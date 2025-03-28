/**
 * Utilitaires pour les interactions avec l'API
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/**
 * Vérifie si l'API est accessible
 * @returns {Promise<boolean>} Résultat de la vérification
 */
export async function testApiConnection(): Promise<boolean> {
  try {
    // Pour API Platform, essayons d'accéder à la documentation
    const response = await fetch(`${API_URL}/api`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (response.ok) {
      console.log('Connexion à l\'API Symfony réussie !');
      return true;
    }
    
    console.error(`Échec de connexion à l'API Symfony: ${response.status} ${response.statusText}`);
    return false;
  } catch (error) {
    console.error('Erreur lors de la connexion à l\'API Symfony:', error);
    return false;
  }
}

/**
 * Vérifie l'état d'authentification avec l'API
 * @returns {Promise<boolean>} Résultat de la vérification
 */
export async function checkAuthStatus(): Promise<boolean> {
  try {
    const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
    
    if (!token) {
      return false;
    }
    
    const response = await fetch(`${API_URL}/api/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/ld+json',
      },
    });
    
    return response.ok;
  } catch (error) {
    return false;
  }
}