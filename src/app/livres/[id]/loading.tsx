import BookCardSkeleton from '@/components/features/books/BookCardSkeleton';

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="animate-pulse">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Image skeleton */}
          <div className="w-full lg:w-1/3 h-96 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          
          {/* Content skeleton */}
          <div className="w-full lg:w-2/3">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md mb-4 w-3/4"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-md mb-6 w-1/2"></div>
            
            <div className="space-y-2 mb-6">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-full"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-full"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-3/4"></div>
            </div>
            
            <div className="flex items-center justify-between mb-6">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-md w-24"></div>
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md w-48"></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Related books skeleton */}
      <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-md mb-6 w-64"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <BookCardSkeleton />
          <BookCardSkeleton />
          <BookCardSkeleton />
        </div>
      </div>
    </div>
  );
}