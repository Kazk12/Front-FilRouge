import Link from "next/link";

const AnnounceHeader = () => {
  return (
    <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 mb-8 shadow-lg overflow-hidden">
      <div className="absolute inset-0 bg-grid-white/[0.05] bg-[length:16px_16px]"></div>
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Mes livres en vente
          </h1>
          <p className="text-indigo-100">
            Gérez et suivez vos annonces de livres d'occasion
          </p>
        </div>
        <Link
          href="/my-announces/create"
          className="mt-4 md:mt-0 bg-white hover:bg-indigo-50 text-indigo-700 py-2.5 px-5 rounded-lg transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white shadow-md flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Ajouter un livre
        </Link>
      </div>
    </div>
  );
};

export default AnnounceHeader;