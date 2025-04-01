export interface User {
  id: string;
  email: string;
  lastName: string;
  firstName: string;
  telephone: string;
  description?: string;
  roles: "user" | "vendeur" | "admin";
  professionnalDetails?: {
    companyName: string;
    companyAdress: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

export interface LoginFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterFormData {
  email: string;
  nom: string;
  prenom: string;
  telephone: string;
  description?: string;
  password: string;
  confirmPassword: string;
  isVendeur: boolean;
  entrepriseNom?: string;
  entrepriseAdresse?: string;
}