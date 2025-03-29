"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/recherche?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center">
              <Image 
                src="/images/logo.svg" 
                alt="Librairie d'occasion"
                width={40}
                height={40}
                className="mr-3"
              />
              <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
                Librairie d'occasion
              </span>
            </Link>
            
            <button 
              type="button" 
              className="inline-flex items-center p-2 ml-3 text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" 
              onClick={toggleMenu}
            >
              <span className="sr-only">Ouvrir le menu</span>
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path>
              </svg>
            </button>
          </div>
          
          <div className={`${isMenuOpen ? 'block' : 'hidden'} md:block w-full md:w-auto`}>
            <form onSubmit={handleSearch} className="flex mb-4 md:mb-0">
              <input
                type="search"
                placeholder="Rechercher un livre..."
                className="w-full px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path>
                </svg>
              </button>
            </form>
          </div>
          
          <nav className={`${isMenuOpen ? 'block' : 'hidden'} md:block`}>
            <ul className="flex flex-col md:flex-row md:space-x-8 space-y-2 md:space-y-0">
              <li>
                <Link href="/livres" className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
                  Catalogue
                </Link>
              </li>
              
              {isAuthenticated ? (
                <>
                  <li>
                    <Link href="/tableau-de-bord" className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
                      Tableau de bord
                    </Link>
                  </li>
                  {user?.roles?.includes('ROLE_VENDEUR') && (
                    <li>
                      <Link href="/mes-livres/ajouter" className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
                        Vendre un livre
                      </Link>
                    </li>
                  )}
                  <li>
                    <button 
                      onClick={logout} 
                      className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                    >
                      Déconnexion
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link href="/connexion" className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
                      Connexion
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/inscription" 
                      className="inline-block py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Inscription
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}