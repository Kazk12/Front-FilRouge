import { Book } from "@/types/book";
import { Category } from "@/types/category";

// Interface pour les réponses API (avec ou sans Hydra)
interface ApiResponse<T> {
  "member"?: T[];
  "hydra:member"?: T[];
  "hydra:totalItems"?: number;
  totalItems?: number;
}

// Définition de l'URL de l'API avec une valeur par défaut
const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Extrait les membres d'une réponse API, quel que soit le format
 */
function extractMembers<T>(data: ApiResponse<T> | T[]): T[] {
  if (Array.isArray(data)) {
    return data;
  }
  
  return data["hydra:member"] || data.member || [];
}

/**
 * Ajuste les données des livres pour assurer la compatibilité avec l'application
 */
function normalizeBookData(book: any): Book | null {
  // Vérification que book n'est pas null ou undefined
  if (!book) return null;
  
  // Traitement de l'image pour s'assurer qu'elle a une URL valide
  const imageUrl = book.image 
    ? book.image.startsWith('http') 
      ? book.image 
      : book.image.startsWith('/') 
        ? book.image 
        : `/${book.image}`
    : '/images/book-placeholder.png';

  // Normaliser les données utilisateur (mapping des propriétés)
  let normalizedUser = null;
  if (book.user) {
    if (typeof book.user === 'object') {
      normalizedUser = {
        id: book.user.id || book.user['@id']?.split('/').pop(),
        prenom: book.user.firstName || book.user.prenom || 'Anonyme',
        nom: book.user.lastName || book.user.nom || '',
        email: book.user.email
      };
    } else if (typeof book.user === 'string' && book.user.includes('/users/')) {
      // Si l'utilisateur est juste une référence IRI
      const userId = book.user.split('/').pop();
      normalizedUser = {
        id: userId,
        prenom: 'Vendeur',
        nom: userId
      };
    }
  }

  return {
    ...book,
    image: imageUrl,
    user: normalizedUser
  };
}

/**
 * Récupère les derniers livres ajoutés (6 maximum)
 */
export async function getLatestBooks(): Promise<Book[]> {
  try {
    // Utilisation explicite de plusieurs paramètres pour s'assurer que la limitation fonctionne
    const response = await fetch(`${API_URL}/books?page=1&itemsPerPage=6&order[createdAt]=desc`, {
      headers: {
        "Accept": "application/ld+json"
      },
      next: { revalidate: 60 } // Revalidation côté serveur toutes les 60 secondes
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Réponse d'erreur API:", errorText);
      throw new Error(`Erreur lors de la récupération des livres: ${response.status}`);
    }

    const data = await response.json();
    
    // Gestion des différents formats API Platform
    let books = data["hydra:member"] || data.member || (Array.isArray(data) ? data : []);
    
    // Limitation côté client pour s'assurer de ne pas dépasser 6 livres
    books = books.slice(0, 6);
    
    if (books.length === 0 && !Array.isArray(data)) {
      console.warn("Format de réponse API non reconnu:", data);
    }
    
    // Normaliser les données des livres et filtrer les valeurs null
    return books.map(normalizeBookData).filter(book => book !== null);
  } catch (error) {
    console.error("Erreur dans getLatestBooks:", error);
    return [];
  }
}

/**
 * Récupère un livre par son ID
 */
export async function getBookById(id: string | number): Promise<Book | null> {
  try {
    const response = await fetch(`${API_URL}/books/${id}`, {
      headers: {
        "Accept": "application/ld+json"
      },
      next: { revalidate: 60 }
    });

    if (!response.ok) {
      if (response.status === 404) {
        console.warn(`Livre avec ID ${id} non trouvé`);
        return null;
      }
      const errorText = await response.text();
      console.error("Réponse d'erreur API:", errorText);
      throw new Error(`Erreur lors de la récupération du livre: ${response.status}`);
    }

    const bookData = await response.json();
    return normalizeBookData(bookData);
  } catch (error) {
    console.error("Erreur dans getBookById:", error);
    return null;
  }
}

/**
 * Récupère les autres livres du même vendeur (limité à 3)
 */
export async function getOtherBooksByUser(bookId: string | number): Promise<Book[]> {
  try {
    
    const response = await fetch(`${API_URL}/books/${bookId}/public-other-books`, {
      headers: {
        "Accept": "application/ld+json"
      },
      next: { revalidate: 60 }
    });
    
    if (!response.ok) {
      console.error(`Erreur lors de la récupération des livres du même vendeur: ${response.status}`);
      return [];
    }
    
    const data = await response.json();
    
    const otherBooks = extractMembers(data);
    
    // Limiter à 3 livres maximum
    const limitedBooks = otherBooks.slice(0, 3);
    
    // Normaliser et filtrer les valeurs null
    return limitedBooks
      .map(normalizeBookData)
      .filter((book): book is Book => book !== null);
  } catch (error) {
    console.error("Erreur dans getOtherBooksByUser:", error);
    return [];
  }
}
/**
 * Recherche des livres selon des critères
 */
export async function searchBooks(query: string, page = 1, filters = {}): Promise<{ books: Book[], total: number }> {
  try {
    // Construction des paramètres de recherche
    const searchParams = new URLSearchParams({
      page: page.toString(),
      itemsPerPage: "12"
    });
    
    if (query) {
      searchParams.append("title", query);
    }
    
    // Ajout des filtres
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        searchParams.append(key, value.toString());
      }
    });

    const url = `${API_URL}/books?${searchParams.toString()}`;
    
    const response = await fetch(url, {
      headers: {
        "Accept": "application/ld+json"
      },
      next: { revalidate: 60 }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Réponse d'erreur API:", errorText);
      throw new Error(`Erreur lors de la recherche de livres: ${response.status}`);
    }

    const data = await response.json();
    
    // Gestion des différents formats API Platform
    const books = data["hydra:member"] || data.member || [];
    const total = data["hydra:totalItems"] || data.totalItems || books.length;
    
    // Normaliser les données des livres
    return { 
      books: books.map(normalizeBookData).filter(book => book !== null), 
      total 
    };
  } catch (error) {
    console.error("Erreur dans searchBooks:", error);
    return { books: [], total: 0 };
  }
}

/**
 * Récupère les catégories disponibles
 */
export async function getCategories(): Promise<Category[]> {
  try {
    const response = await fetch(`${API_URL}/categories`, {
      headers: {
        "Accept": "application/ld+json"
      },
      next: { revalidate: 3600 } // Revalidation moins fréquente pour les données statiques
    });

    if (!response.ok) {
      throw new Error(`Erreur lors de la récupération des catégories: ${response.status}`);
    }

    const data = await response.json();
    const categories = data["hydra:member"] || data.member || (Array.isArray(data) ? data : []);
    
    return categories;
  } catch (error) {
    console.error("Erreur dans getCategories:", error);
    return [];
  }
}

/**
 * Récupère les états disponibles pour les livres
 */
export async function getStates(): Promise<any[]> {
  try {
    const response = await fetch(`${API_URL}/states`, {
      headers: {
        "Accept": "application/ld+json"
      },
      next: { revalidate: 3600 }
    });

    if (!response.ok) {
      throw new Error(`Erreur lors de la récupération des états: ${response.status}`);
    }

    const data = await response.json();
    const states = data["hydra:member"] || data.member || (Array.isArray(data) ? data : []);
    
    return states;
  } catch (error) {
    console.error("Erreur dans getStates:", error);
    return [];
  }
}