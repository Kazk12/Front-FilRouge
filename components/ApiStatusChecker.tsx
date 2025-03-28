"use client";

import { useEffect, useState } from "react";
import { testApiConnection } from "@/utils/apiUtils";

export default function ApiStatusChecker() {
  const [apiStatus, setApiStatus] = useState<'checking' | 'connected' | 'error'>('checking');

  useEffect(() => {
    // Vérifie la connexion à l'API au chargement
    testApiConnection()
      .then((connected) => {
        setApiStatus(connected ? 'connected' : 'error');
        if (!connected) {
          console.warn("L'API n'est pas accessible. Certaines fonctionnalités pourraient ne pas fonctionner correctement.");
        }
      });
  }, []);

  // Ce composant ne rend rien visuellement, il effectue uniquement la vérification
  return null;
}