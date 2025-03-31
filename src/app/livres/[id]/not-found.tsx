import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
        Livre introuvable
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-lg mx-auto">
        Nous n'avons pas pu trouver le livre que vous recherchez. Il est possible qu'il ait été vendu ou retiré de notre catalogue.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link 
          href="/livres" 
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
        >
          Parcourir le catalogue
        </Link>
        <Link 
          href="/" 
          className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md transition-colors"
        >
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}