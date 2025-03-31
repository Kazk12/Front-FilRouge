"use client";

import { Book } from "@/types/book";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils/formatters";
import { useCart } from "@/hooks/useCart";

interface BookCardProps {
  book: Book;
}

export default function BookCard({ book }: BookCardProps) {
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
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 flex flex-col">
      <Link href={`/livres/${book.id}`} className="block relative h-48 overflow-hidden">
        <Image
          src={book.image || "/images/book-placeholder.png"}
          alt={book.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute bottom-0 right-0 bg-blue-600 text-white px-2 py-1 text-sm font-bold rounded-tl-md">
          {formatPrice(book.price)}
        </div>
      </Link>

      <div className="p-4 flex flex-col flex-grow">
        <Link href={`/livres/${book.id}`} className="block">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 line-clamp-1">
            {book.title}
          </h3>
        </Link>

        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
          par <span className="font-medium">{book.author}</span>
        </p>
        
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
          {book.shortDescription}
        </p>

        <div className="mt-auto">
          <div className="flex items-center justify-between text-sm">
            <span className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded">
              {book.state.name}
            </span>
            <span className="text-gray-600 dark:text-gray-400">
              Vendeur: {book.user?.firstName || "Anonyme"}
            </span>
          </div>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={isInCart}
          className={`mt-4 w-full py-2 px-4 rounded-md text-white font-medium transition-colors ${
            isInCart
              ? "bg-green-600 cursor-default"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isInCart ? "Dans le panier" : "Ajouter au panier"}
        </button>
      </div>
    </div>
  );
}