"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import LoginForm from "@/components/features/auth/LoginForm";
import PublicRoute from "@/components/routing/PublicRoute";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered");
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Affiche le message de confirmation si "registered=true" est présent dans l'URL
  useEffect(() => {
    if (registered === "true") {
      setShowConfirmation(true);
      
      // Faire disparaître le message après 6 secondes
      const timer = setTimeout(() => {
        setShowConfirmation(false);
      }, 6000);
      
      return () => clearTimeout(timer);
    }
  }, [registered]);

  return (
    <PublicRoute>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          {/* Message de confirmation */}
          {showConfirmation && (
            <div className="mb-6 bg-green-50 dark:bg-green-900/30 border border-green-400 text-green-700 dark:text-green-300 px-4 py-3 rounded relative" role="alert">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
                <span>
                  <strong>Compte créé avec succès !</strong> Vous pouvez maintenant vous connecter.
                </span>
              </div>
              <button 
                onClick={() => setShowConfirmation(false)}
                className="absolute top-0 right-0 p-2"
                aria-label="Fermer"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                </svg>
              </button>
            </div>
          )}
          
          <LoginForm />
        </div>
      </div>
    </PublicRoute>
  );
}