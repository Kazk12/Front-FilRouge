import { Book } from "@/types/book";

// Définition de l'URL de l'API avec une valeur par défaut
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/**
 * Récupère les derniers livres ajoutés (6 maximum)
 */
export async function getLatestBooks(): Promise<Book[]> {
  try {
    // Utilisation du bon format d'URL selon vos routes API
    const response = await fetch(`${API_URL}/api/books.json?page=1&itemsPerPage=6&order[createdAt]=desc`, {
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
    
    // Vérification de la structure de la réponse
    if (!data["hydra:member"]) {
      console.warn("Format de réponse API inattendu:", data);
      return [];
    }
    
    return data["hydra:member"];
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
    const response = await fetch(`${API_URL}/api/books/${id}.json`, {
      headers: {
        "Accept": "application/ld+json"
      },
      next: { revalidate: 60 }
    });

    if (!response.ok) {
      throw new Error(`Livre non trouvé: ${response.status}`);
    }

    return await response.json();
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

    const response = await fetch(`${API_URL}/api/books.json?${searchParams.toString()}`, {
      headers: {
        "Accept": "application/ld+json"
      },
      next: { revalidate: 60 }
    });

    if (!response.ok) {
      throw new Error(`Erreur lors de la recherche de livres: ${response.status}`);
    }

    const data = await response.json();
    
    return {
      books: data["hydra:member"] || [],
      total: data["hydra:totalItems"] || 0
    };
  } catch (error) {
    console.error("Erreur dans searchBooks:", error);
    return { books: [], total: 0 };
  }
}