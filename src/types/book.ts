export interface Category {
    id: number;
    name: string;
  }
  
  export interface State {
    id: number;
    name: string;
    description?: string;
  }
  
  export interface UserPreview {
    id: number;
    firstName: string;
    lastName: string;
  }
  
  export interface Book {
    id: number;
    title: string;
    author: string;
    shortDescription: string;
    description: string;
    price: number;
    image: string;
    state: State;
    categories: Category[];
    createdAt: string;
    updatedAt: string;
    user?: UserPreview;
  }
  
  export interface CartItem {
    id: number;
    title: string;
    price: number;
    image: string;
    quantity: number;
  }