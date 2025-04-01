import Link from 'next/link';
import { Book } from '@/types/book';
import { formatPrice } from '@/lib/utils/formatters';

interface BooksTableProps {
  books: Book[];
}

export default function BooksTable({ books = [] }: BooksTableProps) {
  if (books.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400 mb-4">Vous n'avez pas encore d'annonces.</p>
        <Link 
          href="/profil/my-books/new" 
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Créer ma première annonce
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead className="text-sm text-gray-700 dark:text-gray-300 border-b dark:border-gray-700">
          <tr>
            <th className="py-3 px-4">Titre</th>
            <th className="py-3 px-4">Prix</th>
            <th className="py-3 px-4">État</th>
            <th className="py-3 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.id} className="border-b dark:border-gray-700">
              <td className="py-3 px-4">{book.title}</td>
              <td className="py-3 px-4">{formatPrice(book.price)}</td>
              <td className="py-3 px-4">{book.state?.name || 'Non spécifié'}</td>
              <td className="py-3 px-4">
                <div className="flex space-x-2">
                  <Link
                    href={`/profil/my-books/${book.id}/edit`}
                    className="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    aria-label="Modifier"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </Link>
                  <button
                    className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                    aria-label="Supprimer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}