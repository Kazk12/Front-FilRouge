export interface Book {
  id: number;
  title: string;
  author: string;
  shortDescription: string;
  description: string;
  price: number;
  image: string;
  createdAt?: string;
  updatedAt?: string;
  state: {
    id: number;
    name: string;
  };
  user: {
    id: number;
    prenom?: string;
    nom?: string;
    email?: string;
  };
  categories?: Category[];
}

export interface Category {
  id: number;
  name: string;
}

export interface CartItem {
  id: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
}