export default function BookCardSkeleton() {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden h-full">
        <div className="h-48 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
        <div className="p-4">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse w-3/4 mb-3"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse mb-3"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse w-2/3 mb-4"></div>
          <div className="flex justify-between mb-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse w-1/4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse w-1/3"></div>
          </div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
        </div>
      </div>
    );
  }