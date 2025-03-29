import { Suspense } from "react";
import BookCard from "./BookCard";
import { getLatestBooks } from "@/services/bookService";
import BookCardSkeleton from "./BookCardSkeleton";

export default async function BookList() {
  const books = await getLatestBooks();

  if (books.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">
          Aucun livre disponible pour le moment.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {books.map((book) => (
        <Suspense key={book.id} fallback={<BookCardSkeleton />}>
          <BookCard book={book} />
        </Suspense>
      ))}
    </div>
  );
}