import { Book } from "@/types/book";

// Définition de l'URL de l'API avec une valeur par défaut
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

/**
 * Ajuste les données des livres pour assurer la compatibilité avec l'application
 * Notamment pour les URLs des images
 */
function normalizeBookData(book: any): Book {
  return {
    ...book,
    // S'assurer que l'image a une URL valide
    image: book.image && (
      // Si l'image commence déjà par http ou https, la laisser telle quelle
      book.image.startsWith('http') ? book.image :
      // Sinon si c'est juste un nom de fichier sans chemin, ajouter un chemin par défaut
      book.image.startsWith('/') ? book.image : 
      // Si c'est une chaîne sans slash, ajouter un slash
      `/${book.image}`
    ),
    // Autres normalisations si nécessaires
  };
}

/**
 * Récupère les derniers livres ajoutés (6 maximum)
 */
export async function getLatestBooks(): Promise<Book[]> {
  try {
    // Utilisation explicite de plusieurs paramètres pour s'assurer que la limitation fonctionne
    console.log("Requête API getLatestBooks:", `${API_URL}/books?page=1&itemsPerPage=6&order[createdAt]=desc`);
    
    const response = await fetch(`${API_URL}/books?page=1&itemsPerPage=6&order[createdAt]=desc`, {
      headers: {
        "Accept": "application/ld+json"
      },
      cache: "no-store" // Force une nouvelle requête pendant le développement
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Réponse d'erreur API:", errorText);
      throw new Error(`Erreur lors de la récupération des livres: ${response.status}`);
    }

    const data = await response.json();
    console.log("Réponse API getLatestBooks:", data);
    
    // Gestion des différents formats API Platform
    let books = data["hydra:member"] || data.member || (Array.isArray(data) ? data : []);
    
    // Limitation côté client pour s'assurer de ne pas dépasser 6 livres
    books = books.slice(0, 5);
    
    if (books.length === 0 && !Array.isArray(data)) {
      console.warn("Format de réponse API non reconnu:", data);
    }
    
    // Normaliser les données des livres
    return books.map(normalizeBookData);
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
      throw new Error(`Livre non trouvé: ${response.status}`);
    }

    const book = await response.json();
    return normalizeBookData(book);
  } catch (error) {
    console.error("Erreur dans getBookById:", error);
    return null;
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
      itemsPerPage: "12",
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
    console.log("Requête API searchBooks:", url);
    
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
    console.log("Réponse API searchBooks:", data);
    
    // Gestion des différents formats API Platform
    const books = data.member || data["hydra:member"] || [];
    const total = data.totalItems || data["hydra:totalItems"] || 0;
    
    // Normaliser les données des livres
    return { 
      books: books.map(normalizeBookData), 
      total 
    };
  } catch (error) {
    console.error("Erreur dans searchBooks:", error);
    return { books: [], total: 0 };
  }
}