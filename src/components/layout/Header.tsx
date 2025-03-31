"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const { items: cartItems } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Gestion du défilement
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Gestion du clic en dehors du dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/recherche?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsMenuOpen(false);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    setIsDropdownOpen(false);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header 
      className={`sticky top-0 z-40 bg-white dark:bg-gray-900 ${
        isScrolled ? "shadow-lg" : "shadow-sm"
      } transition-all duration-300`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo et nom du site */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2" onClick={closeMenu}>
              <Image 
                src="/images/logo.svg" 
                alt="Librairie d'occasion"
                width={36}
                height={36}
                className="transition-transform hover:scale-110"
              />
              <span className="text-xl font-semibold text-gray-800 dark:text-white hidden sm:inline">
                Librairie d'occasion
              </span>
            </Link>
          </div>

          {/* Barre de recherche - écrans moyens et grands */}
          <div className="hidden md:block flex-grow max-w-md mx-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="search"
                placeholder="Rechercher un livre..."
                className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600 transition-colors"
                aria-label="Rechercher"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path>
                </svg>
              </button>
            </form>
          </div>

          {/* Navigation et boutons d'action */}
          <div className="flex items-center">
            {/* Icône panier */}
            <div className="hidden md:flex items-center mr-6">
              <Link href="/panier" className="relative p-2 text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItems.length}
                  </span>
                )}
              </Link>
            </div>

            {/* Navigation - version desktop */}
            <nav className="hidden md:block">
              <ul className="flex items-center space-x-6">
                <li>
                  <Link 
                    href="/livres" 
                    className="text-gray-700 hover:text-blue-600 font-medium dark:text-gray-300 dark:hover:text-blue-400 transition-colors"
                  >
                    Catalogue
                  </Link>
                </li>
                
                {isAuthenticated ? (
                  <>
                    <li className="relative" ref={dropdownRef}>
                      <button 
                        onClick={toggleDropdown}
                        className="flex items-center px-3 py-2 text-gray-700 hover:text-blue-600 font-medium dark:text-gray-300 dark:hover:text-blue-400 transition-colors focus:outline-none"
                        aria-expanded={isDropdownOpen}
                        aria-haspopup="true"
                      >
                        Mon compte
                        <svg 
                          className={`ml-1.5 w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} 
                          fill="currentColor" 
                          viewBox="0 0 20 20" 
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
                        </svg>
                      </button>
                      {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700">
                          <Link 
                            href="/tableau-de-bord" 
                            className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                            onClick={() => setIsDropdownOpen(false)}
                          >
                            Tableau de bord
                          </Link>
                          {user?.role?.includes('ROLE_VENDEUR') && (
                            <Link 
                              href="/mes-livres/ajouter" 
                              className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                              onClick={() => setIsDropdownOpen(false)}
                            >
                              Vendre un livre
                            </Link>
                          )}
                          <button 
                            onClick={handleLogout} 
                            className="w-full text-left block px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                          >
                            Déconnexion
                          </button>
                        </div>
                      )}
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <Link 
                        href="/connexion" 
                        className="text-gray-700 hover:text-blue-600 font-medium dark:text-gray-300 dark:hover:text-blue-400 transition-colors"
                      >
                        Connexion
                      </Link>
                    </li>
                    <li>
                      <Link 
                        href="/inscription" 
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full transition-colors shadow-sm hover:shadow"
                      >
                        S'inscrire
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </nav>

            {/* Bouton menu hamburger - petits écrans */}
            <button 
              type="button" 
              className="inline-flex items-center p-2 ml-3 text-gray-700 rounded-md md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-400 dark:hover:bg-gray-700"
              onClick={toggleMenu}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              <span className="sr-only">Ouvrir le menu</span>
              {isMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path>
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Menu mobile */}
        <div 
          id="mobile-menu"
          className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden py-3 border-t border-gray-200 dark:border-gray-700 animate-fadeIn`}
        >
          {/* Barre de recherche mobile */}
          <form onSubmit={handleSearch} className="mb-4">
            <div className="relative">
              <input
                type="search"
                placeholder="Rechercher un livre..."
                className="w-full pl-4 pr-10 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600"
                aria-label="Rechercher"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path>
                </svg>
              </button>
            </div>
          </form>
          
          {/* Lien vers le panier (mobile) */}
          <div className="mb-4">
            <Link 
              href="/panier" 
              className="flex items-center justify-between px-4 py-2.5 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-md transition-colors"
              onClick={closeMenu}
            >
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span>Panier</span>
              </div>
              {cartItems.length > 0 && (
                <span className="bg-blue-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </Link>
          </div>
          
          {/* Navigation mobile */}
          <nav>
            <ul className="space-y-2.5">
              <li>
                <Link 
                  href="/livres" 
                  className="block px-4 py-2.5 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 font-medium rounded-md transition-colors"
                  onClick={closeMenu}
                >
                  Catalogue
                </Link>
              </li>
              
              {isAuthenticated ? (
                <>
                  <li>
                    <Link 
                      href="/tableau-de-bord" 
                      className="block px-4 py-2.5 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 rounded-md transition-colors"
                      onClick={closeMenu}
                    >
                      Tableau de bord
                    </Link>
                  </li>
                  {user?.role?.includes('ROLE_VENDEUR') && (
                    <li>
                      <Link 
                        href="/mes-livres/ajouter" 
                        className="block px-4 py-2.5 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 rounded-md transition-colors"
                        onClick={closeMenu}
                      >
                        Vendre un livre
                      </Link>
                    </li>
                  )}
                  <li>
                    <button 
                      onClick={handleLogout} 
                      className="w-full text-left px-4 py-2.5 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 rounded-md transition-colors"
                    >
                      Déconnexion
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link 
                      href="/connexion" 
                      className="block px-4 py-2.5 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 rounded-md transition-colors"
                      onClick={closeMenu}
                    >
                      Connexion
                    </Link>
                  </li>
                  <li className="mt-4">
                    <Link 
                      href="/inscription" 
                      className="block w-full px-4 py-2.5 text-center bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors shadow-sm hover:shadow"
                      onClick={closeMenu}
                    >
                      S'inscrire
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