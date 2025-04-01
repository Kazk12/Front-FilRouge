import Link from 'next/link';

interface ProfileHeaderProps {
  firstName?: string;
  lastName?: string;
  isVendeur: boolean;
}

export default function ProfileHeader({ firstName = '', lastName = '', isVendeur = false }: ProfileHeaderProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            Bonjour, {firstName} {lastName}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {isVendeur ? 'Compte Vendeur' : 'Compte Utilisateur'}
          </p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <Link 
            href="/profil/my-informations" 
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
            Modifier mes informations
          </Link>
        </div>
      </div>
    </div>
  );
}