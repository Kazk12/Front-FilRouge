import { AnnounceStatus, BookCondition } from "./types";

interface AnnounceFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  filter: AnnounceStatus | "all";
  setFilter: (value: AnnounceStatus | "all") => void;
  conditionFilter: BookCondition | "all";
  setConditionFilter: (value: BookCondition | "all") => void;
  resetFilters: () => void;
  activeFiltersCount: number;
  filteredResultsCount: number;
}

const AnnounceFilters = ({
  searchTerm,
  setSearchTerm,
  filter,
  setFilter,
  conditionFilter,
  setConditionFilter,
  resetFilters,
  activeFiltersCount,
  filteredResultsCount
}: AnnounceFiltersProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md mb-8 border border-gray-200 dark:border-gray-700 transition-all">
      <div className="flex flex-col space-y-5">
        <div className="flex flex-col md:flex-row gap-5">
          <div className="flex-1 relative">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Rechercher
            </label>
            <div className="relative">
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher par titre ou auteur..."
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg pl-10 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white shadow-sm"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  aria-label="Effacer la recherche"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
          
          <div className="w-full md:w-48">
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Statut
            </label>
            <select
              id="status"
              value={filter}
              onChange={(e) => setFilter(e.target.value as AnnounceStatus | "all")}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white appearance-none bg-no-repeat shadow-sm"
              style={{ backgroundPosition: "right 0.75rem center", backgroundImage: "url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 20 20\"%3E%3Cpath stroke=\"%236b7280\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"1.5\" d=\"M6 8l4 4 4-4\"/%3E%3C/svg%3E')", backgroundSize: "1.5em 1.5em" }}
            >
              <option value="all">Tous les statuts</option>
              <option value="active">Active</option>
              <option value="pending">En attente</option>
              <option value="expired">Expirée</option>
            </select>
          </div>
          
          <div className="w-full md:w-48">
            <label htmlFor="condition" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              État du livre
            </label>
            <select
              id="condition"
              value={conditionFilter}
              onChange={(e) => setConditionFilter(e.target.value as BookCondition | "all")}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white appearance-none bg-no-repeat shadow-sm"
              style={{ backgroundPosition: "right 0.75rem center", backgroundImage: "url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 20 20\"%3E%3Cpath stroke=\"%236b7280\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"1.5\" d=\"M6 8l4 4 4-4\"/%3E%3C/svg%3E')", backgroundSize: "1.5em 1.5em" }}
            >
              <option value="all">Tous états</option>
              <option value="neuf">Neuf</option>
              <option value="très bon">Très bon</option>
              <option value="bon">Bon</option>
              <option value="acceptable">Acceptable</option>
              <option value="usé">Usé</option>
            </select>
          </div>
        </div>
        
        {activeFiltersCount > 0 && (
          <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
            <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
              <span className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 text-xs font-medium px-2.5 py-1 rounded-full mr-2">{filteredResultsCount}</span> 
              résultat{filteredResultsCount > 1 ? 's' : ''} trouvé{filteredResultsCount > 1 ? 's' : ''} avec {activeFiltersCount} filtre{activeFiltersCount > 1 ? 's' : ''}
            </div>
            <button
              onClick={resetFilters}
              className="text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-lg px-3 py-1.5 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Réinitialiser
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnnounceFilters;