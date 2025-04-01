interface VendorStatsProps {
    totalBooks: number;
    activeSales: number;
    completedSales: number;
  }
  
  export default function VendorStats({ totalBooks, activeSales, completedSales }: VendorStatsProps) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Total des livres</h3>
          <p className="text-3xl font-bold text-blue-600">{totalBooks}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Ventes actives</h3>
          <p className="text-3xl font-bold text-green-600">{activeSales}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Ventes complétées</h3>
          <p className="text-3xl font-bold text-purple-600">{completedSales}</p>
        </div>
      </div>
    );
  }