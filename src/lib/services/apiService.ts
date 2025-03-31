import authService from './authService';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

interface ApiOptions {
  method?: string;
  body?: any;
  headers?: Record<string, string>;
  auth?: boolean;
}

/**
 * Service pour les appels API génériques
 */
const apiService = {
  /**
   * Effectue un appel API
   */
  async request<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
    const {
      method = 'GET',
      body,
      headers = {},
      auth = false,
    } = options;

    // Headers par défaut
    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/ld+json',
    };

    // Ajout du token d'authentification si nécessaire
    if (auth) {
      const token = authService.getToken();
      if (token) {
        defaultHeaders['Authorization'] = `Bearer ${token}`;
      }
    }

    // Fusion des headers personnalisés
    const requestHeaders = { ...defaultHeaders, ...headers };

    // Construction des options de la requête
    const requestOptions: RequestInit = {
      method,
      headers: requestHeaders,
    };

    // Ajout du corps de la requête si nécessaire
    if (body && (method !== 'GET' && method !== 'HEAD')) {
      requestOptions.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(`${API_URL}${endpoint}`, requestOptions);
      
      // Gestion des erreurs
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const message = 
          errorData.detail || 
          errorData.message || 
          errorData.violations?.[0]?.message ||
          `Erreur ${response.status}`;
          
        throw new Error(message);
      }
      
      // Si la réponse est vide (204 No Content)
      if (response.status === 204) {
        return {} as T;
      }
      
      return await response.json() as T;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Erreur API: ${error.message}`);
      }
      throw new Error("Une erreur inconnue est survenue lors de l'appel API");
    }
  },
  
  // Méthodes utilitaires
  get<T>(endpoint: string, auth = false) {
    return this.request<T>(endpoint, { method: 'GET', auth });
  },
  
  post<T>(endpoint: string, data: any, auth = false) {
    return this.request<T>(endpoint, { method: 'POST', body: data, auth });
  },
  
  put<T>(endpoint: string, data: any, auth = false) {
    return this.request<T>(endpoint, { method: 'PUT', body: data, auth });
  },
  
  patch<T>(endpoint: string, data: any, auth = false) {
    return this.request<T>(endpoint, { method: 'PATCH', body: data, auth });
  },
  
  delete<T>(endpoint: string, auth = false) {
    return this.request<T>(endpoint, { method: 'DELETE', auth });
  }
};

export default apiService;