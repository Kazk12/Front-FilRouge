"use client";

import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import authService from "@/lib/services/authService"; // Chemin d'import corrigé
import { User, AuthState, LoginFormData, RegisterFormData } from "@/types/auth";

// Création du contexte d'authentification
interface AuthContextType extends AuthState {
  login: (data: LoginFormData) => Promise<void>;
  register: (data: RegisterFormData) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// État initial
const initialState: AuthState = {
  user: null,
  isLoading: true,
  error: null,
  isAuthenticated: false,
};

// Provider pour le contexte d'authentification
export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(initialState);
  const router = useRouter();

  // Vérifie si l'utilisateur est déjà connecté au chargement
  useEffect(() => {
    const checkAuth = async () => {
      if (authService.isAuthenticated()) {
        try {
          const user = await authService.getCurrentUser();
          setState({
            user,
            isLoading: false,
            error: null,
            isAuthenticated: true,
          });
        } catch (error) {
          setState({
            ...initialState,
            isLoading: false,
            error: error instanceof Error ? error.message : "Erreur d'authentification",
          });
        }
      } else {
        setState({
          ...initialState,
          isLoading: false,
        });
      }
    };

    checkAuth();
  }, []);

  // Fonction de connexion
  const login = async (data: LoginFormData) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const { user } = await authService.login(data);
      
      setState({
        user,
        isLoading: false,
        error: null,
        isAuthenticated: true,
      });
      
      router.push("/");
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "Échec de la connexion",
        isAuthenticated: false,
      }));
    }
  };

  // Fonction d'inscription
  const register = async (data: RegisterFormData) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const { user } = await authService.register(data);
      
      setState({
        user,
        isLoading: false,
        error: null,
        isAuthenticated: true,
      });
      
      router.push("/connexion?registered=true");
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "Échec de l'inscription",
        isAuthenticated: false,
      }));
    }
  };

  // Fonction de déconnexion
  const logout = () => {
    authService.logout();
    setState({
      ...initialState,
      isLoading: false,
    });
    router.push("/connexion");
  };

  // Rafraîchir les informations utilisateur
  const refreshUser = async () => {
    if (!state.isAuthenticated) return;
    
    setState((prev) => ({ ...prev, isLoading: true }));
    
    try {
      const user = await authService.getCurrentUser();
      setState((prev) => ({
        ...prev,
        user,
        isLoading: false,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "Erreur lors du rafraîchissement",
      }));
    }
  };

  // Mémoisation des valeurs du contexte pour éviter les re-rendus inutiles
  const value = useMemo(() => ({
    ...state,
    login,
    register,
    logout,
    refreshUser,
  }), [state]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook personnalisé pour utiliser le contexte d'authentification
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider");
  }
  
  return context;
}


