import Link from "next/link";

export default function FormHeader() {
  return (
    <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 mb-8 shadow-lg overflow-hidden">
      <div className="absolute inset-0 bg-grid-white/[0.05] bg-[length:16px_16px]"></div>
      <div className="relative z-10">
        <div className="flex items-center mb-4">
          <Link 
            href="/my-announces" 
            className="text-indigo-100 hover:text-white flex items-center transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Retour aux annonces
          </Link>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
          Créer une nouvelle annonce
        </h1>
        <p className="text-indigo-100">
          Remplissez le formulaire ci-dessous pour mettre en vente votre livre
        </p>
      </div>
    </div>
  );
}