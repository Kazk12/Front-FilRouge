import { useState, useEffect } from "react";
import { getStates } from "@/lib/services/bookService";

/**
 * Interface pour les états des livres
 */
interface State {
  id: string;
  name: string;
}

/**
 * Hook personnalisé pour récupérer les états des livres depuis l'API
 * @returns Objet contenant les états, l'état de chargement et les erreurs éventuelles
 */
export function useBookStates() {
  // État pour stocker les options d'états disponibles
  const [states, setStates] = useState<State[]>([]);
  // État pour indiquer si le chargement est en cours
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // État pour gérer les erreurs potentielles
  const [error, setError] = useState<string | null>(null);

  // Charge les états au montage du composant
  useEffect(() => {
    const fetchStates = async () => {
      try {
        setIsLoading(true);
        // Appel à l'API via le service
        const statesData = await getStates();
        setStates(statesData);
        setError(null);
      } catch (error) {
        console.error("Erreur lors du chargement des états:", error);
        setError("Impossible de charger les états des livres");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStates();
  }, []);

  return { states, isLoading, error };
}