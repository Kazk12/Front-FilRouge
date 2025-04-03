import { Book } from "@/types/book";
import { Category } from "@/types/category";

// Interface pour les états des livres
interface State {
  id: number;
  name: string;
}

// Interface pour les réponses API (avec ou sans Hydra)
interface ApiResponse<T> {
  "member"?: T[];
  "hydra:member"?: T[];
  "hydra:totalItems"?: number;
  totalItems?: number;
}

// Interface pour les filtres de recherche
interface SearchFilters {
  category?: string | number;
  state?: string | number;
  minPrice?: number;
  maxPrice?: number;
  [key: string]: string | number | undefined;
}

// Définition de l'URL de l'API avec une valeur par défaut
const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Type predicate pour vérifier si un livre est valide (non null)
 */
function isValidBook(book: Book | null): book is Book {
  return book !== null;
}

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
    books = books.slice(0, 8);
    
    if (books.length === 0 && !Array.isArray(data)) {
      console.warn("Format de réponse API non reconnu:", data);
    }
    
    // Normaliser les données des livres et filtrer les valeurs null avec type predicate
    return books.map(normalizeBookData).filter(isValidBook);
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
      .filter(isValidBook);
  } catch (error) {
    console.error("Erreur dans getOtherBooksByUser:", error);
    return [];
  }
}

/**
 * Recherche des livres selon des critères
 */
export async function searchBooks(
  query: string, 
  page = 1, 
  filters: SearchFilters = {}
): Promise<{ books: Book[], total: number }> {
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
    
    // Normaliser les données des livres avec type predicate
    return { 
      books: books.map(normalizeBookData).filter(isValidBook), 
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
export async function getStates(): Promise<State[]> {
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
    const rawStates = data["hydra:member"] || data.member || (Array.isArray(data) ? data : []);

    // Transformation des données pour extraire l'ID de @id
    const states = rawStates.map(state => {
      // Extraire l'ID numérique de l'URI (ex: /api/states/1 -> 1)
      const id = state["@id"] ? state["@id"].split("/").pop() : null;
      
      return {
        id,
        name: state.name
      };
    });
    
    
    return states;
  } catch (error) {
    console.error("Erreur dans getStates:", error);
    return [];
  }
}


export async function createBook(bookData: FormData, token: string): Promise<Book | null> {
  try {
    // 1. Créer un objet pour stocker toutes les données au format JSON
    const jsonData: any = {};
    
    // 2. Extraire les données textuelles du FormData
    bookData.forEach((value, key) => {
      // Ne pas inclure le fichier image dans l'objet JSON
      if (key !== 'image') {
        jsonData[key] = value;
      }
    });
    
    // Traitement spécial des catégories - à faire séparément pour s'assurer de récupérer toutes les valeurs
    const categoryIds = bookData.getAll('categories');
    if (categoryIds.length > 0) {
      // Vérifier si les IDs sont numériques et les convertir si nécessaire
      const formattedCategoryIds = categoryIds.map(id => {
        // S'assurer que l'ID est traité comme une chaîne
        const categoryId = String(id);
        // Vérifier si l'ID est déjà au format IRI
        if (categoryId.startsWith('/api/categories/')) {
          return categoryId;
        } else {
          return `/api/categories/${categoryId}`;
        }
      });
      
      // Assigner les catégories formatées à jsonData
      jsonData.categories = formattedCategoryIds;
    }
    
    // Ajouter une valeur par défaut pour l'image pour éviter l'erreur SQL
    jsonData.image = 'placeholder.jpg';
    
    console.log("Données JSON envoyées:", JSON.stringify(jsonData, null, 2));
    
    // 3. Première requête : créer le livre avec une image par défaut
    const response = await fetch(`${API_URL}/books`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/ld+json',
        'Accept': 'application/ld+json'
      },
      body: JSON.stringify(jsonData)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error("Erreur lors de la création du livre:", errorData || response.statusText);
      throw new Error(errorData?.['hydra:description'] || errorData?.detail || `Erreur lors de la création du livre: ${response.status}`);
    }

    // 4. Récupérer les données du livre créé, y compris l'ID
    const bookCreated = await response.json();
    console.log("Livre créé avec succès:", bookCreated['@id']);
    
    // 5. Si une image est fournie, la télécharger séparément avec une seconde requête
    const image = bookData.get('image');
    
    if (image instanceof File && bookCreated['@id']) {
      console.log("Upload de l'image:", image.name, image.type, image.size);
      
      const imageFormData = new FormData();
      imageFormData.append('image', image);
      
      const imageEndpoint = `${bookCreated['@id']}/image`;
      console.log("URL d'upload de l'image:", imageEndpoint);
      
      try {
        const imageResponse = await fetch(`http://127.0.0.1:8000${imageEndpoint}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
            // Ne pas définir Content-Type pour FormData
          },
          body: imageFormData
        });
        
        if (!imageResponse.ok) {
          const imageErrorText = await imageResponse.text();
          console.error("Erreur lors de l'upload de l'image:", imageResponse.status, imageErrorText);
        } else {
          const imageResult = await imageResponse.json().catch(() => ({}));
          console.log("Image téléchargée avec succès:", imageResult);
        }
      } catch (imageError) {
        console.error("Exception lors de l'upload de l'image:", imageError);
      }
      
      // Récupérer le livre mis à jour avec l'image
      const bookWithImageResponse = await fetch(`${bookCreated['@id']}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/ld+json',
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (bookWithImageResponse.ok) {
        const bookWithImage = await bookWithImageResponse.json();
        console.log("Livre récupéré après upload d'image:", bookWithImage.image);
        return normalizeBookData(bookWithImage);
      }
    }

    return normalizeBookData(bookCreated);
  } catch (error) {
    console.error("Erreur dans createBook:", error);
    throw error; // On propage l'erreur pour la gérer dans le hook
  }
}