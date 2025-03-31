"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

type PublicRouteProps = {
  children: React.ReactNode;
};

/**
 * Protège les routes publiques comme la connexion et l'inscription
 * Redirige vers la page d'accueil si l'utilisateur est déjà connecté
 */
export default function PublicRoute({ children }: PublicRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Ne rediriger que si le chargement est terminé et que l'utilisateur est authentifié
    if (!isLoading && isAuthenticated) {
      router.replace("/");
    }
  }, [isLoading, isAuthenticated, router]);

  // Si en cours de chargement, on peut afficher un indicateur de chargement
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // Si l'utilisateur n'est pas authentifié, on affiche les enfants (le contenu de la page)
  // Si l'utilisateur est authentifié, on ne retourne rien car la redirection est en cours
  return !isAuthenticated ? <>{children}</> : null;
}