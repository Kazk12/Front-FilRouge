import { LoginFormData, RegisterFormData, User } from "@/types/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Gère les appels API liés à l'authentification
 */
class AuthService {
  /**
   * Connecte un utilisateur avec son email et mot de passe
   */
  async login(data: LoginFormData): Promise<{ user: User; token: string }> {
    try {
      // Utilisation de l'endpoint standard pour LexikJWTAuthenticationBundle
      const loginResponse = await fetch(`${API_URL}/login_check`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          username: data.email, // LexikJWTBundle utilise username par défaut
          password: data.password
        }),
      });

      if (!loginResponse.ok) {
        const error = await loginResponse.json();
        throw new Error(error.message || "Échec de la connexion");
      }

      const { token } = await loginResponse.json();
      
      // Stockage du token selon préférence utilisateur
      if (data.rememberMe) {
        localStorage.setItem("auth_token", token);
      } else {
        sessionStorage.setItem("auth_token", token);
      }

      // Récupération des infos utilisateur avec le token obtenu
      const userResponse = await fetch(`${API_URL}/me`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/ld+json"
        }
      });

      if (!userResponse.ok) {
        this.logout();
        throw new Error("Impossible de récupérer les informations utilisateur");
      }

      const user = await userResponse.json();
      
      return { user, token };
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
  async register(formData: RegisterFormData): Promise<{ user: User; token: string }> {
    try {
      // Transformer les données pour correspondre à la structure attendue par l'API Symfony
      const apiData = {
        email: formData.email,
        password: formData.password,
        firstName: formData.prenom,
        lastName: formData.nom,
        phoneNumber: formData.telephone,
        description: formData.description || "",
        // Gestion des détails professionnels si l'utilisateur est vendeur
        professionnalDetails: formData.isVendeur ? {
          companyName: formData.entrepriseNom || "",
          companyAddress: formData.entrepriseAdresse || ""
        } : null
      };

      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/ld+json",
          "Accept": "application/ld+json"
        },
        body: JSON.stringify(apiData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = "Échec de l'inscription";
        
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.detail || 
                        (errorJson.violations && errorJson.violations.length > 0 ? 
                          errorJson.violations[0].message : null) || 
                        errorJson.message || 
                        errorMessage;
        } catch (e) {
          console.error('Réponse d\'erreur non-JSON:', errorText);
        }
        
        throw new Error(errorMessage);
      }

      const result = await response.json();
      
      // Comme l'API Symfony/API Platform pourrait ne pas renvoyer de token après inscription,
      // nous devons peut-être faire une connexion séparée
      let token = result.token;
      let user = result;
      
      if (!token) {
        // Si pas de token fourni, nous devons nous connecter
        const loginResult = await this.login({
          email: formData.email,
          password: formData.password,
          rememberMe: true
        });
        
        token = loginResult.token;
        user = loginResult.user;
      } else {
        localStorage.setItem("auth_token", token);
      }
      
      return { user, token };
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

      const response = await fetch(`${API_URL}/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Accept": "application/ld+json"
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