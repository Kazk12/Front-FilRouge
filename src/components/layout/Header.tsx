"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import logoImage from '../../../public/images/logo.jpg';

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

  // Récupérer le prénom de l'utilisateur si disponible
  const getUserFirstName = () => {
    if (user?.firstName) {
      return user.firstName.split(' ')[0]; // Prend le premier mot du nom complet
    }
    return null;
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
              <div className="relative overflow-hidden rounded-full border-2 border-indigo-100 dark:border-indigo-900">
                <Image 
                  src={logoImage}  
                  alt="Librairie d'occasion"
                  width={36}
                  height={36}
                  className="transition-transform hover:scale-110"
                />
              </div>
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
                className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-indigo-600 transition-colors"
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
              <Link href="/panier" className="relative p-2 text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 transition-colors">
                <div className="relative">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  {cartItems.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItems.length}
                    </span>
                  )}
                </div>
                <span className="sr-only">Panier</span>
              </Link>
            </div>

            {/* Navigation - version desktop */}
            <nav className="hidden md:block">
              <ul className="flex items-center space-x-6">
                <li>
                  <Link 
                    href="/livres" 
                    className="text-gray-700 hover:text-indigo-600 font-medium dark:text-gray-300 dark:hover:text-indigo-400 transition-colors"
                  >
                    Catalogue
                  </Link>
                </li>
                
                {isAuthenticated ? (
                  <>
                    <li className="relative" ref={dropdownRef}>
                      <button 
                        onClick={toggleDropdown}
                        className="flex items-center px-3 py-2 text-gray-700 hover:text-indigo-600 font-medium dark:text-gray-300 dark:hover:text-indigo-400 transition-colors focus:outline-none"
                        aria-expanded={isDropdownOpen}
                        aria-haspopup="true"
                      >
                        {getUserFirstName() ? (
                          <span className="flex items-center">
                            <span className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 flex items-center justify-center mr-2 font-medium">
                              {getUserFirstName().charAt(0).toUpperCase()}
                            </span>
                            <span>
                              Bonjour, {getUserFirstName()}
                            </span>
                          </span>
                        ) : (
                          "Mon compte"
                        )}
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
                            href="/profil" 
                            className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                            onClick={() => setIsDropdownOpen(false)}
                          >
                            <span className="flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                              Voir mon profil
                            </span>
                          </Link>
                          {user?.roles?.includes('ROLE_VENDEUR') && (
                            <Link 
                              href="/mes-livres/ajouter" 
                              className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                              onClick={() => setIsDropdownOpen(false)}
                            >
                              <span className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Vendre un livre
                              </span>
                            </Link>
                          )}
                          <button 
                            onClick={handleLogout} 
                            className="w-full text-left block px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                          >
                            <span className="flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                              </svg>
                              Déconnexion
                            </span>
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
                        className="text-gray-700 hover:text-indigo-600 font-medium dark:text-gray-300 dark:hover:text-indigo-400 transition-colors"
                      >
                        Connexion
                      </Link>
                    </li>
                    <li>
                      <Link 
                        href="/inscription" 
                        className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-medium rounded-full transition-colors shadow-sm hover:shadow transform hover:-translate-y-0.5 transition-transform duration-200"
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
              className="inline-flex items-center p-2 ml-3 text-gray-700 rounded-md md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-gray-400 dark:hover:bg-gray-700"
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
          {/* Informations utilisateur mobile */}
          {isAuthenticated && getUserFirstName() && (
            <div className="mb-4 px-4 py-3 bg-indigo-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 flex items-center justify-center mr-3 font-medium text-lg">
                  {getUserFirstName().charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-gray-800 dark:text-white">Bonjour, {getUserFirstName()}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
                </div>
              </div>
            </div>
          )}

          {/* Barre de recherche mobile */}
          <form onSubmit={handleSearch} className="mb-4">
            <div className="relative">
              <input
                type="search"
                placeholder="Rechercher un livre..."
                className="w-full pl-4 pr-10 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-indigo-600"
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
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span>Panier</span>
              </div>
              {cartItems.length > 0 && (
                <span className="bg-rose-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
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
                  className="block px-4 py-2.5 text-gray-700 hover:bg-indigo-50 dark:text-gray-300 dark:hover:bg-gray-700 font-medium rounded-md transition-colors"
                  onClick={closeMenu}
                >
                  <span className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    Catalogue
                  </span>
                </Link>
              </li>
              
              {isAuthenticated ? (
                <>
                  <li>
                    <Link 
                      href="/profil" 
                      className="block px-4 py-2.5 text-gray-700 hover:bg-indigo-50 dark:text-gray-300 dark:hover:bg-gray-700 rounded-md transition-colors"
                      onClick={closeMenu}
                    >
                      <span className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Mon profil
                      </span>
                    </Link>
                  </li>
                  {user?.roles?.includes('ROLE_VENDEUR') && (
                    <li>
                      <Link 
                        href="/mes-livres/ajouter" 
                        className="block px-4 py-2.5 text-gray-700 hover:bg-indigo-50 dark:text-gray-300 dark:hover:bg-gray-700 rounded-md transition-colors"
                        onClick={closeMenu}
                      >
                        <span className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          Vendre un livre
                        </span>
                      </Link>
                    </li>
                  )}
                  <li>
                    <button 
                      onClick={handleLogout} 
                      className="w-full text-left px-4 py-2.5 text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-gray-700 rounded-md transition-colors cursor-pointer"
                    >
                      <span className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Déconnexion
                      </span>
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link 
                      href="/connexion" 
                      className="block px-4 py-2.5 text-gray-700 hover:bg-indigo-50 dark:text-gray-300 dark:hover:bg-gray-700 rounded-md transition-colors"
                      onClick={closeMenu}
                    >
                      <span className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                        </svg>
                        Connexion
                      </span>
                    </Link>
                  </li>
                  <li className="mt-4">
                    <Link 
                      href="/inscription" 
                      className="block w-full px-4 py-2.5 text-center bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-medium rounded-md transition-colors shadow-sm hover:shadow"
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