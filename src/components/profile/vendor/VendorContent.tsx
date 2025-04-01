import Link from 'next/link';
import { Book } from '@/types/book';
import BooksTable from './BooksTable';
import VendorStats from './VendorStats';
import ProfessionalInfo from './ProfessionalInfo';

interface VendorContentProps {
  stats: {
    totalBooks: number;
    activeSales: number;
    completedSales: number;
  };
  books: Book[];
  professionalDetails?: {
    companyName: string;
    companyAdress: string;
  };
}

export default function VendorContent({ stats, books, professionalDetails }: VendorContentProps) {
  return (
    <>
      <VendorStats
        totalBooks={stats.totalBooks}
        activeSales={stats.activeSales}
        completedSales={stats.completedSales}
      />

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Mes annonces</h2>
          <Link 
            href="/profil/my-books/new" 
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Nouvelle annonce
          </Link>
        </div>

        <BooksTable books={books} />
      </div>

      <ProfessionalInfo professionalDetails={professionalDetails} />
    </>
  );
}