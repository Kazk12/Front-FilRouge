import { useState, useRef, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createBook, getCategories, getStates } from "@/lib/services/bookService";
import { useAuth } from "@/hooks/useAuth";
import { FormState, FormErrors } from "@/types/createMyBooks";
import { useEffect } from "react";
import { ACCEPTED_IMAGE_TYPES, MAX_IMAGE_SIZE, MAX_SHORT_DESCRIPTION_LENGTH, BOOK_ROUTES } from "@/lib/constants/constants";

export default function useBookForm() {
  const router = useRouter();
  const { token } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // États pour les options de sélection
  const [categoryOptions, setCategoryOptions] = useState<{ id: string, name: string }[]>([]);
  const [stateOptions, setStateOptions] = useState<{ id: string, name: string }[]>([]);
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);
  
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

  // État de prévisualisation de l'image
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  // États pour la gestion des erreurs et de la soumission
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Charger les catégories et états au chargement du composant
  useEffect(() => {
    async function loadOptions() {
      try {
        setIsLoadingOptions(true);
        const [categoriesData, statesData] = await Promise.all([
          getCategories(),
          getStates()
        ]);
        
        setCategoryOptions(categoriesData);
        setStateOptions(statesData);
      } catch (error) {
        console.error("Erreur lors du chargement des options:", error);
        setErrors(prev => ({ 
          ...prev, 
          submit: "Impossible de charger les données nécessaires au formulaire. Veuillez réessayer." 
        }));
      } finally {
        setIsLoadingOptions(false);
      }
    }
    
    loadOptions();
  }, []);

  // Gestion du changement des champs texte
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Valider et formater le prix à mesure qu'il est tapé
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
    
    // Effacer l'erreur des catégories
    if (errors.categories) {
      setErrors({ ...errors, categories: "" });
    }
  };

  // Gestion du téléchargement d'image
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Vérifier le type de fichier
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        setErrors({ ...errors, image: "Le fichier doit être une image (JPG, PNG, GIF ou WebP)" });
        return;
      }
      
      // Vérifier la taille du fichier
      if (file.size > MAX_IMAGE_SIZE) {
        setErrors({ ...errors, image: "L'image ne doit pas dépasser 5MB" });
        return;
      }
      
      // Créer une URL pour la prévisualisation
      setImagePreview(URL.createObjectURL(file));
      setFormData({ ...formData, image: file });
      
      // Effacer l'erreur d'image
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
    else if (formData.title.length < 3) newErrors.title = "Le titre doit contenir au moins 3 caractères";
    else if (formData.title.length > 255) newErrors.title = "Le titre ne peut pas dépasser 255 caractères";
    
    if (!formData.author.trim()) newErrors.author = "L'auteur est obligatoire";
    else if (formData.author.length < 3) newErrors.author = "L'auteur doit contenir au moins 3 caractères";
    else if (formData.author.length > 255) newErrors.author = "L'auteur ne peut pas dépasser 255 caractères";
    
    if (formData.categories.length === 0) newErrors.categories = "Sélectionnez au moins une catégorie";
    
    if (!formData.state) newErrors.state = "L'état du livre est obligatoire";
    
    if (!formData.shortDescription.trim()) newErrors.shortDescription = "Un court résumé est obligatoire";
    else if (formData.shortDescription.length < 10) newErrors.shortDescription = "Le résumé court doit contenir au moins 10 caractères";
    else if (formData.shortDescription.length > MAX_SHORT_DESCRIPTION_LENGTH) 
      newErrors.shortDescription = `Le résumé court ne peut pas dépasser ${MAX_SHORT_DESCRIPTION_LENGTH} caractères`;
    
    if (!formData.description.trim()) newErrors.description = "La description est obligatoire";
    else if (formData.description.length < 50) newErrors.description = "La description doit contenir au moins 50 caractères";
    
    if (!formData.price) newErrors.price = "Le prix est obligatoire";
    else if (isNaN(parseFloat(formData.price))) newErrors.price = "Le prix doit être un nombre valide";
    else if (parseFloat(formData.price) <= 0) newErrors.price = "Le prix doit être supérieur à 0";
    
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
    setErrors({});
    
    try {
      // Création d'un objet FormData pour envoyer des fichiers
      const submitData = new FormData();
      
      // Ajout des données textuelles
      submitData.append("title", formData.title);
      submitData.append("author", formData.author);
      formData.categories.forEach(category => {
        submitData.append("categories[]", `/api/categories/${category}`);
      });
      
      submitData.append("state", `/api/states/${formData.state}`);
      submitData.append("shortDescription", formData.shortDescription);
      submitData.append("description", formData.description);
      submitData.append("price", formData.price);
      
      // Ajout de l'image
      if (formData.image) {
        submitData.append("image", formData.image);
      }
      
      // Appel API pour créer le livre
      await createBook(submitData, token);
      
      setSubmitSuccess(true);
      
      // Redirection après succès (après un délai pour montrer le message de succès)
      setTimeout(() => {
        router.push(BOOK_ROUTES.MY_ANNOUNCES);
      }, 2000);
      
    } catch (error: any) {
      console.error("Erreur lors de la soumission:", error);
      
      // Afficher un message d'erreur générique ou spécifique si disponible
      setErrors({ 
        submit: error.message || "Une erreur est survenue lors de la création de l'annonce. Veuillez réessayer." 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    categoryOptions,
    stateOptions,
    imagePreview,
    errors,
    isSubmitting,
    submitSuccess,
    isLoadingOptions,
    fileInputRef,
    handleChange,
    handleCategoryChange,
    handleImageChange,
    handleRemoveImage,
    handleSubmit
  };
}