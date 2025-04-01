import { useState, useRef, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { FormState, FormErrors } from "../types";

export default function useBookForm() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // État initial du formulaire
  const [formData, setFormData] = useState<FormState>({
    title: "",
    author: "",
    categories: [],
    state: "",
    shortDescription: "",
    description: "",
    price: "",
    image: null,
  });

  // États pour la gestion UI
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Gestion du changement des champs texte
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === "price") {
      // Accepter seulement les chiffres et un point/virgule
      const formattedValue = value.replace(/[^0-9.,]/g, "").replace(",", ".");
      // Limiter à deux décimales
      const parts = formattedValue.split(".");
      if (parts.length > 1) {
        parts[1] = parts[1].slice(0, 2);
        setFormData({ ...formData, [name]: parts.join(".") });
      } else {
        setFormData({ ...formData, [name]: formattedValue });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
    
    // Effacer l'erreur du champ modifié
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  // Gestion du changement des catégories
  const handleCategoryChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    
    if (checked) {
      setFormData({ 
        ...formData, 
        categories: [...formData.categories, value] 
      });
    } else {
      setFormData({
        ...formData,
        categories: formData.categories.filter(cat => cat !== value)
      });
    }
    
    if (errors.categories) {
      setErrors({ ...errors, categories: "" });
    }
  };

  // Gestion du téléchargement d'image
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Vérifier le type de fichier
      if (!file.type.includes("image/")) {
        setErrors({ ...errors, image: "Le fichier doit être une image" });
        return;
      }
      
      // Vérifier la taille du fichier (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, image: "L'image ne doit pas dépasser 5MB" });
        return;
      }
      
      setImagePreview(URL.createObjectURL(file));
      setFormData({ ...formData, image: file });
      
      if (errors.image) {
        setErrors({ ...errors, image: "" });
      }
    }
  };

  // Supprimer l'image sélectionnée
  const handleRemoveImage = () => {
    setFormData({ ...formData, image: null });
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Valider le formulaire avant soumission
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.title.trim()) newErrors.title = "Le titre est obligatoire";
    if (!formData.author.trim()) newErrors.author = "L'auteur est obligatoire";
    if (formData.categories.length === 0) newErrors.categories = "Sélectionnez au moins une catégorie";
    if (!formData.state) newErrors.state = "L'état du livre est obligatoire";
    if (!formData.shortDescription.trim()) newErrors.shortDescription = "Un court résumé est obligatoire";
    if (!formData.description.trim()) newErrors.description = "La description est obligatoire";
    if (!formData.price) newErrors.price = "Le prix est obligatoire";
    if (!formData.image) newErrors.image = "Une photo du livre est obligatoire";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Soumission du formulaire
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Faire défiler jusqu'à la première erreur
      const firstError = document.querySelector("[data-error='true']");
      if (firstError) {
        firstError.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Création d'un objet FormData pour envoyer des fichiers
      const submitData = new FormData();
      
      // Ajout des données textuelles
      submitData.append("title", formData.title);
      submitData.append("author", formData.author);
      formData.categories.forEach(category => {
        submitData.append("categories[]", category);
      });
      submitData.append("state", formData.state);
      submitData.append("shortDescription", formData.shortDescription);
      submitData.append("description", formData.description);
      submitData.append("price", formData.price);
      
      // Ajout de l'image
      if (formData.image) {
        submitData.append("image", formData.image);
      }
      
      // Simulation d'envoi API (à remplacer par votre appel API réel)
      console.log("Données à envoyer:", Object.fromEntries(submitData));
      
      // Simuler une réponse d'API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSubmitSuccess(true);
      
      // Redirection après succès
      setTimeout(() => {
        router.push("/my-announces");
      }, 2000);
      
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
      setErrors({ 
        submit: "Une erreur est survenue lors de la création de l'annonce. Veuillez réessayer." 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    imagePreview,
    errors,
    isSubmitting,
    submitSuccess,
    fileInputRef,
    handleChange,
    handleCategoryChange,
    handleImageChange,
    handleRemoveImage,
    handleSubmit
  };
}