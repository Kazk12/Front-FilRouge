"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";

type ProtectedRouteProps = {
  children: ReactNode;
};

/**
 * Protège les routes qui nécessitent une authentification
 * Redirige vers la page de connexion si l'utilisateur n'est pas connecté
 */
export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Ne rediriger que si le chargement est terminé et que l'utilisateur n'est PAS authentifié
    if (!isLoading && !isAuthenticated) {
      router.replace("/connexion");
    }
  }, [isLoading, isAuthenticated, router]);

  // Si en cours de chargement, afficher un indicateur de chargement
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // Si l'utilisateur est authentifié, afficher les enfants (le contenu de la page)
  // Si l'utilisateur n'est pas authentifié, ne rien afficher car la redirection est en cours
  return isAuthenticated ? <>{children}</> : null;
}