export interface FormState {
  title: string;
  author: string;
  categories: string[]; // Maintenant, nous utiliserons les IDs des catégories
  state: string; // ID de l'état
  shortDescription: string;
  description: string;
  price: string;
  image: File | null;
}

export interface FormErrors {
  title?: string;
  author?: string;
  categories?: string;
  state?: string;
  shortDescription?: string;
  description?: string;
  price?: string;
  image?: string;
  submit?: string;
  [key: string]: string | undefined;
}