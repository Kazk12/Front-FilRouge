"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import FormGroup from "@/components/ui/FormGroup";
import authService from "@/services/authService";
import type { RegisterFormData } from "@/types/auth";

const RegisterForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVendeur, setIsVendeur] = useState(false);
  
  const [formData, setFormData] = useState<RegisterFormData>({
    email: "",
    nom: "",
    prenom: "",
    telephone: "",
    description: "",
    password: "",
    confirmPassword: "",
    isVendeur: false,
    entrepriseNom: "",
    entrepriseAdresse: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setIsVendeur(checked);
      
      // Réinitialiser les champs d'entreprise s'ils ne sont plus nécessaires
      if (!checked) {
        setFormData((prev) => ({
          ...prev,
          isVendeur: checked,
          entrepriseNom: "",
          entrepriseAdresse: ""
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          isVendeur: checked
        }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = (): boolean => {
    // Réinitialiser l'erreur
    setError(null);
  
    // Vérifier que tous les champs obligatoires sont remplis
    if (!formData.email || !formData.nom || !formData.prenom || !formData.telephone || !formData.password) {
      setError("Veuillez remplir tous les champs obligatoires.");
      return false;
    }
  
    // Valider le format de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Format d'email invalide.");
      return false;
    }
  
    // Valider le format du téléphone (version simple)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.telephone)) {
      setError("Le numéro de téléphone doit contenir 10 chiffres.");
      return false;
    }
  
    // Vérifier que les mots de passe correspondent
    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return false;
    }
  
    // Vérifier la complexité du mot de passe
    if (formData.password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      return false;
    }
  
    // Vérifier les champs spécifiques aux vendeurs
    if (isVendeur) {
      if (!formData.entrepriseNom || formData.entrepriseNom.trim() === "") {
        setError("Le nom de l'entreprise est requis pour les vendeurs.");
        return false;
      }
      if (!formData.entrepriseAdresse || formData.entrepriseAdresse.trim() === "") {
        setError("L'adresse de l'entreprise est requise pour les vendeurs.");
        return false;
      }
    }
  
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
  
    setIsLoading(true);
    try {
      await authService.register(formData);
      router.push("/connexion?registered=true");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue lors de l'inscription.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Créer un compte</h2>
      
      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-400 text-red-700 dark:text-red-400 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormGroup label="Prénom" htmlFor="prenom" required>
          <Input
            id="prenom"
            name="prenom"
            type="text"
            value={formData.prenom}
            onChange={handleChange}
            placeholder="John"
            required
          />
        </FormGroup>
        
        <FormGroup label="Nom" htmlFor="nom" required>
          <Input
            id="nom"
            name="nom"
            type="text"
            value={formData.nom}
            onChange={handleChange}
            placeholder="Doe"
            required
          />
        </FormGroup>
      </div>
      
      <FormGroup label="Email" htmlFor="email" required>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="john.doe@example.com"
          required
        />
      </FormGroup>
      
      <FormGroup label="Téléphone" htmlFor="telephone" required>
        <Input
          id="telephone"
          name="telephone"
          type="tel"
          value={formData.telephone}
          onChange={handleChange}
          placeholder="0601020304"
          required
        />
      </FormGroup>
      
      <FormGroup label="Description (optionnel)" htmlFor="description">
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
          placeholder="Parlez-nous de vous..."
        />
      </FormGroup>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormGroup label="Mot de passe" htmlFor="password" required>
          <Input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <p className="text-sm text-gray-500 mt-1">Minimum 8 caractères</p>
        </FormGroup>
        
        <FormGroup label="Confirmer le mot de passe" htmlFor="confirmPassword" required>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </FormGroup>
      </div>
      
      <div className="flex items-center">
        <input
          id="isVendeur"
          name="isVendeur"
          type="checkbox"
          checked={isVendeur}
          onChange={handleChange}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="isVendeur" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
          Je souhaite devenir vendeur
        </label>
      </div>
      
      {isVendeur && (
        <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700 mt-4">
          <h3 className="text-lg font-medium">Informations sur l&apos;entreprise</h3>
          
          <FormGroup label="Nom de l'entreprise" htmlFor="entrepriseNom" required={isVendeur}>
            <Input
              id="entrepriseNom"
              name="entrepriseNom"
              type="text"
              value={formData.entrepriseNom}
              onChange={handleChange}
              required={isVendeur}
            />
          </FormGroup>
          
          <FormGroup label="Adresse de l'entreprise" htmlFor="entrepriseAdresse" required={isVendeur}>
            <Input
              id="entrepriseAdresse"
              name="entrepriseAdresse"
              type="text"
              value={formData.entrepriseAdresse}
              onChange={handleChange}
              required={isVendeur}
            />
          </FormGroup>
        </div>
      )}
      
      <div className="flex items-center justify-between pt-4">
        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? "Inscription en cours..." : "S'inscrire"}
        </Button>
      </div>
    </form>
  );
};

export default RegisterForm;