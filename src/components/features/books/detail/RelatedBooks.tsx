import { getOtherBooksByUser } from "@/lib/services/bookService";
import BookCard from "@/components/features/books/BookCard";
import { Suspense } from "react";
import BookCardSkeleton from "@/components/features/books/BookCardSkeleton";

interface RelatedBooksProps {
  bookId: number | string;
}

export default async function RelatedBooks({ bookId }: RelatedBooksProps) {
  const otherBooks = await getOtherBooksByUser(bookId);

  if (!otherBooks || otherBooks.length === 0) {
    return (
      <p className="text-gray-500 dark:text-gray-400 text-center py-4">
        Aucun autre livre de ce vendeur pour le moment.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {otherBooks.map((book) => (
        <Suspense key={book.id} fallback={<BookCardSkeleton />}>
          <BookCard book={book} />
        </Suspense>
      ))}
    </div>
  );
}