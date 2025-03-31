"use client";

import { Book } from "@/types/book";
import { useCart } from "@/hooks/useCart";

interface AddToCartButtonProps {
  book: Book;
}

export default function AddToCartButton({ book }: AddToCartButtonProps) {
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

  return (
    <button
      onClick={handleAddToCart}
      disabled={isInCart}
      className={`px-8 py-3 rounded-md text-white font-medium transition-all ${
        isInCart
          ? "bg-green-600 hover:bg-green-700"
          : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg"
      }`}
    >
      <div className="flex items-center gap-2">
        {isInCart ? (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span>Dans le panier</span>
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span>Ajouter au panier</span>
          </>
        )}
      </div>
    </button>
  );
}