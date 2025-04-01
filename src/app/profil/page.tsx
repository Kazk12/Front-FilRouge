"use client";

import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/routing/ProtectedRoute';
import { Book } from '@/types/book';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ProfileHeader from '@/components/profile/ProfileHeader';
import VendorContent from '@/components/profile/vendor/VendorContent';
import CustomerContent from '@/components/profile/customer/CustomerContent';

// Types pour les statistiques du vendeur
interface VendorStats {
  totalBooks: number;
  activeSales: number;
  completedSales: number;
}

export default function ProfilePage() {
  const { user, isLoading } = useAuth();
  const [stats, setStats] = useState<VendorStats>({
    totalBooks: 0,
    activeSales: 0,
    completedSales: 0
  });
  const [books, setBooks] = useState<Book[]>([]);

  // Calculer si l'utilisateur est vendeur avec useMemo pour éviter des recalculs inutiles
  const isVendeur = useMemo(() => {
    return Array.isArray(user?.roles) && user.roles.includes('ROLE_VENDEUR') || false;
  }, [user?.roles]);

  // Utilisation d'un seul useEffect pour charger les données du vendeur
  useEffect(() => {
    // Ne charger les données que si l'utilisateur est un vendeur authentifié
    if (isVendeur && user?.id && !isLoading) {
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

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <ProfileHeader 
          firstName={user?.firstName} 
          lastName={user?.lastName} 
          isVendeur={isVendeur} 
        />

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