"use client";

import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/routing/ProtectedRoute';
import { Book } from '@/types/book';
import { formatPrice } from '@/lib/utils/formatters';

// Types pour les statistiques du vendeur
interface VendorStats {
  totalBooks: number;
  activeSales: number;
  completedSales: number;
}

// Types pour les données de l'API
interface UserProfessionalDetails {
  companyName: string;
  companyAdress: string;
}

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<VendorStats>({
    totalBooks: 0,
    activeSales: 0,
    completedSales: 0
  });
  const [books, setBooks] = useState<Book[]>([]);

  // Calculer si l'utilisateur est vendeur avec useMemo pour éviter des recalculs inutiles
  const isVendeur = useMemo(() => {
    return user?.roles?.includes('ROLE_VENDEUR') || false;
  }, [user?.roles]);

  // Utilisation d'un seul useEffect pour charger les données du vendeur
  useEffect(() => {
    // Ne charger les données que si l'utilisateur est un vendeur authentifié
    if (isVendeur && user?.id && !isLoading) {
      // Ici, vous feriez un appel API réel
      const fetchVendorData = async () => {
        try {
          // Simuler un appel API
          const mockStats = {
            totalBooks: 12,
            activeSales: 8,
            completedSales: 4
          };

          const mockBooks = [
            {
              id: 1,
              title: "Les Misérables",
              author: "Victor Hugo",
              price: 15.99,
              image: "/images/book-placeholder.png",
              state: { name: "Bon état" },
              shortDescription: "Un classique de la littérature française"
            },
            {
              id: 2,
              title: "1984",
              author: "George Orwell",
              price: 12.50,
              image: "/images/book-placeholder.png",
              state: { name: "Comme neuf" },
              shortDescription: "Une vision dystopique du futur"
            }
          ] as Book[];

          setStats(mockStats);
          setBooks(mockBooks);
        } catch (error) {
          console.error("Erreur lors du chargement des données vendeur:", error);
          // Gérer l'erreur, par exemple avec un toast ou un message
        }
      };

      fetchVendorData();
    }
  }, [isVendeur, user?.id, isLoading]);

  // Affichage conditionnel - Composants extraits pour plus de clarté
  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        {/* En-tête de profil commun à tous les utilisateurs */}
        <ProfileHeader 
          firstName={user?.firstName} 
          lastName={user?.lastName} 
          isVendeur={isVendeur} 
        />

        {/* Contenu conditionnel selon le type d'utilisateur */}
        {isVendeur ? (
          <VendorContent 
            stats={stats} 
            books={books} 
            professionalDetails={user?.professionnalDetails} 
          />
        ) : (
          <CustomerContent />
        )}
      </div>
    </ProtectedRoute>
  );
}

// Composants extraits pour améliorer la lisibilité et la maintenance

function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full"></div>
    </div>
  );
}

function ProfileHeader({ firstName = '', lastName = '', isVendeur = false }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            Bonjour, {firstName} {lastName}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {isVendeur ? 'Compte Vendeur' : 'Compte Utilisateur'}
          </p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <Link 
            href="/profil/my-informations" 
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
            Modifier mes informations
          </Link>
        </div>
      </div>
    </div>
  );
}

function VendorContent({ stats, books, professionalDetails }: { 
  stats: VendorStats; 
  books: Book[];
  professionalDetails?: UserProfessionalDetails;
}) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Total des livres</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.totalBooks}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Ventes actives</h3>
          <p className="text-3xl font-bold text-green-600">{stats.activeSales}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Ventes complétées</h3>
          <p className="text-3xl font-bold text-purple-600">{stats.completedSales}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Mes annonces</h2>
          <Link 
            href="/profil/my-books/new" 
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Nouvelle annonce
          </Link>
        </div>

        <BooksTable books={books} />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Informations professionnelles</h2>
        
        {professionalDetails ? (
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Nom de l'entreprise</dt>
              <dd className="mt-1 text-lg text-gray-900 dark:text-white">{professionalDetails.companyName}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Adresse professionnelle</dt>
              <dd className="mt-1 text-lg text-gray-900 dark:text-white">{professionalDetails.companyAdress}</dd>
            </div>
          </dl>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">
            Aucune information professionnelle disponible.
          </p>
        )}
      </div>
    </>
  );
}

function BooksTable({ books = [] }: { books: Book[] }) {
  if (books.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400 mb-4">Vous n'avez pas encore d'annonces.</p>
        <Link 
          href="/profil/my-books/new" 
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Créer ma première annonce
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead className="text-sm text-gray-700 dark:text-gray-300 border-b dark:border-gray-700">
          <tr>
            <th className="py-3 px-4">Titre</th>
            <th className="py-3 px-4">Prix</th>
            <th className="py-3 px-4">État</th>
            <th className="py-3 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.id} className="border-b dark:border-gray-700">
              <td className="py-3 px-4">{book.title}</td>
              <td className="py-3 px-4">{formatPrice(book.price)}</td>
              <td className="py-3 px-4">{book.state?.name || 'Non spécifié'}</td>
              <td className="py-3 px-4">
                <div className="flex space-x-2">
                  <Link
                    href={`/profil/my-books/${book.id}/edit`}
                    className="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    aria-label="Modifier"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </Link>
                  <button
                    className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                    aria-label="Supprimer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CustomerContent() {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Mon panier</h2>
          <Link 
            href="/panier" 
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
            </svg>
            Voir mon panier
          </Link>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Mes commandes</h2>
          <Link 
            href="/profil/commandes" 
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
              <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
            </svg>
            Voir mes commandes
          </Link>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Devenir vendeur</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Vous avez des livres à vendre ? Devenir vendeur sur notre plateforme est simple et vous permettra de mettre en vente vos livres d'occasion.
        </p>
        <Link 
          href="/profil/devenir-vendeur" 
          className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Devenir vendeur
        </Link>
      </div>
    </>
  );
}