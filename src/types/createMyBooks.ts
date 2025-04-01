export type FormState = {
    title: string;
    author: string;
    categories: string[];
    state: string;
    shortDescription: string;
    description: string;
    price: string;
    image: File | null;
  };
  
  export type FormErrors = Record<string, string>;

  // Options pour l'état du livre
export const stateOptions = [
  { value: "neuf", label: "Neuf" },
  { value: "très bon", label: "Très bon état" },
  { value: "bon", label: "Bon état" },
  { value: "acceptable", label: "État acceptable" },
  { value: "usé", label: "Usé" },
];

// Catégories de livres
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