import { LoginFormData, RegisterFormData, User } from "@/types/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

/**
 * Gère les appels API liés à l'authentification
 */
class AuthService {
  /**
   * Connecte un utilisateur avec son email et mot de passe
   */
  async login(data: LoginFormData): Promise<{ user: User; token: string }> {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Échec de la connexion");
      }

      const result = await response.json();
      
      // Stocke le token si rememberMe est activé
      if (data.rememberMe) {
        localStorage.setItem("auth_token", result.token);
      } else {
        sessionStorage.setItem("auth_token", result.token);
      }
      
      return result;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Erreur lors de la connexion: ${error.message}`);
      }
      throw new Error("Une erreur inconnue est survenue lors de la connexion");
    }
  }

  /**
   * Inscrit un nouvel utilisateur
   */
  async register(data: RegisterFormData): Promise<{ user: User; token: string }> {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Échec de l'inscription");
      }

      const result = await response.json();
      
      // Stocke le token
      localStorage.setItem("auth_token", result.token);
      
      return result;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Erreur lors de l'inscription: ${error.message}`);
      }
      throw new Error("Une erreur inconnue est survenue lors de l'inscription");
    }
  }

  /**
   * Récupère les informations de l'utilisateur connecté
   */
  async getCurrentUser(): Promise<User> {
    try {
      const token = this.getToken();
      
      if (!token) {
        throw new Error("Aucun token d'authentification trouvé");
      }

      const response = await fetch(`${API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        this.logout();
        throw new Error("Session expirée ou invalide");
      }

      return await response.json();
    } catch (error) {
      this.logout();
      if (error instanceof Error) {
        throw new Error(`Erreur lors de la récupération du profil: ${error.message}`);
      }
      throw new Error("Une erreur inconnue est survenue");
    }
  }

  /**
   * Déconnecte l'utilisateur
   */
  logout(): void {
    localStorage.removeItem("auth_token");
    sessionStorage.removeItem("auth_token");
  }

  /**
   * Récupère le token d'authentification
   */
  getToken(): string | null {
    return localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token");
  }

  /**
   * Vérifie si l'utilisateur est connecté
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

const authService = new AuthService();
export default authService;