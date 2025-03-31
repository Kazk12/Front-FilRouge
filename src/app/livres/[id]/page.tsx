import { notFound } from 'next/navigation';
import { Metadata, ResolvingMetadata } from 'next';
import BookDetail from '@/components/features/books/detail/BookDetail';
import RelatedBooks from '@/components/features/books/detail/RelatedBooks';
import { getBookById } from '@/lib/services/bookService';
import React from 'react'; // Ajout de l'import React pour résoudre le problème JSX

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

/**
 * Génère les métadonnées pour la page de détail du livre
 */
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // Attendre directement les params
  const resolvedParams = await params;
  const id = resolvedParams.id;
  const book = await getBookById(id);

  if (!book) {
    return {
      title: 'Livre non trouvé',
      description: 'Ce livre n\'est pas disponible dans notre catalogue'
    };
  }

  return {
    title: `${book.title} | Librairie d'occasion`,
    description: book.shortDescription,
    openGraph: {
      title: book.title,
      description: book.shortDescription,
      images: [book.image || '/images/book-placeholder.png'],
      type: 'article',
    },
  };
}

/**
 * Composant de page pour afficher les détails d'un livre
 */
export default async function BookPage({ params }: Props): Promise<React.ReactElement> {
  // Attendre directement les params
  const resolvedParams = await params;
  const id = resolvedParams.id;
  const book = await getBookById(id);

  // Si le livre n'existe pas, rediriger vers une page 404
  if (!book) {
    notFound();
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-12">
        <BookDetail book={book} />
      </div>
      
      {/* Section pour les autres livres du même vendeur */}
      <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          Autres livres de ce vendeur
        </h2>
        <RelatedBooks bookId={book.id} />
      </div>
    </main>
  );
}