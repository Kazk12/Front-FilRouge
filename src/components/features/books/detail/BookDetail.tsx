"use client";

import { Book } from "@/types/book";
import Image from "next/image";
import { useState } from "react";
import { formatPrice } from "@/lib/utils/formatters";
import { useCart } from "@/hooks/useCart";

interface BookDetailProps {
  book: Book;
}

export default function BookDetail({ book }: BookDetailProps) {
  const [isImageLoading, setIsImageLoading] = useState(true);
  const { addToCart, isItemInCart } = useCart();
  const isInCart = isItemInCart(book.id);
  
  const handleAddToCart = () => {
    addToCart({
      id: book.id,
      title: book.title,
      price: book.price,
      image: book.image,
      quantity: 1,
    });
  };
  
  const handleImageError = () => {
    console.log("Erreur de chargement d'image, utilisation de l'image par défaut");
    setIsImageLoading(false);
  };
  
  // Assurer que l'image est une URL valide ou utiliser l'image par défaut
  const imageUrl = book.image && 
    typeof book.image === 'string' && 
    !book.image.includes('<string>') &&
    book.image !== 'string' 
      ? book.image 
      : '/images/book-placeholder.png';
  
  const handleImageLoad = () => {
    setIsImageLoading(false);
  };
  
  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Image du livre */}
      <div className="w-full lg:w-1/3 relative">
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg shadow-md bg-gray-100 dark:bg-gray-800">
          {isImageLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-700">
              <div className="animate-pulse w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full"></div>
            </div>
          )}
          <Image 
            src={imageUrl}
            alt={book.title}
            fill
            className={`object-cover transition-opacity ${isImageLoading ? 'opacity-0' : 'opacity-100'}`}
            onLoad={handleImageLoad}
            onError={handleImageError}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority
          />
        </div>
      </div>
      
      {/* Informations du livre */}
      <div className="w-full lg:w-2/3">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
          {book.title}
        </h1>
        
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
          par <span className="font-semibold">{book.author}</span>
        </p>
        
        {/* État et vendeur */}
        <div className="flex flex-wrap gap-4 mb-6">
          <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full font-medium">
            État: {book.state?.name || "Non spécifié"}
          </span>
          <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full font-medium">
            Vendu par: {book.user?.prenom || "Anonyme"} {book.user?.nom || ""}
          </span>
        </div>
        
        {/* Description complète */}
        <div className="prose dark:prose-invert max-w-none mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
            Description
          </h2>
          <div className="text-gray-600 dark:text-gray-300 whitespace-pre-line">
            {book.description}
          </div>
        </div>
        
        {/* Prix et bouton d'achat */}
        <div className="flex items-center justify-between flex-wrap gap-4 mt-8">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatPrice(book.price)}
          </div>
          <button
            onClick={handleAddToCart}
            disabled={isInCart}
            className={`px-8 py-3 rounded-md text-white font-medium transition-all ${
              isInCart
                ? "bg-green-600 hover:bg-green-700"
                : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg"
            }`}
            aria-label={isInCart ? "Déjà dans le panier" : "Ajouter au panier"}
          >
            <div className="flex items-center gap-2">
              {isInCart ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Dans le panier</span>
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <span>Ajouter au panier</span>
                </>
              )}
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}