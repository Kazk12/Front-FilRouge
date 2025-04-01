/**
 * Options pour l'état du livre dans le formulaire de création d'annonce
 * Chaque option contient une valeur (value) utilisée en interne et un libellé (label) affiché à l'utilisateur
 */
export const stateOptions = [
    { value: "neuf", label: "Neuf" },
    { value: "très bon", label: "Très bon état" },
    { value: "bon", label: "Bon état" },
    { value: "acceptable", label: "État acceptable" },
    { value: "usé", label: "Usé" },
  ];
  
  /**
   * Liste des catégories de livres disponibles pour la classification des annonces
   * Ces catégories sont utilisées dans les formulaires de création et de recherche
   */
  export const bookCategories = [
    "Roman",
    "Science-fiction",
    "Fantasy",
    "Policier",
    "Thriller",
    "Biographie",
    "Histoire",
    "Science",
    "Art",
    "Cuisine",
    "Développement personnel",
    "Littérature classique",
    "Littérature jeunesse",
    "Manga",
    "BD",
    "Autre",
  ];
  
  /**
   * Taille maximale autorisée pour les images uploadées (en octets)
   * 5MB = 5 * 1024 * 1024
   */
  export const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
  
  /**
   * Types de fichiers image acceptés pour l'upload
   */
  export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  
  /**
   * Longueur maximale pour la description courte d'un livre
   */
  export const MAX_SHORT_DESCRIPTION_LENGTH = 100;
  
  /**
   * Configuration des routes liées aux annonces
   */
  export const BOOK_ROUTES = {
    MY_ANNOUNCES: "/my-announces",
    CREATE_ANNOUNCE: "/my-announces/create",
    EDIT_ANNOUNCE: (id: string) => `/my-announces/edit/${id}`,
    VIEW_ANNOUNCE: (id: string) => `/books/${id}`,
  };