export default function Loading() {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      {/* Search Header Skeleton */}
      <div className="sticky top-0 z-50 bg-[#883223] px-3 py-2">
        <div className="h-10 bg-white/20 rounded-full animate-pulse" />
      </div>

      {/* Category Header Skeleton */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-3 py-2">
        <div className="flex gap-3 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-1 min-w-[60px]">
              <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
              <div className="w-10 h-2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>

      {/* Banner Skeleton */}
      <div className="px-3 py-3">
        <div className="w-full h-36 md:h-48 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse" />
      </div>

      {/* Products Grid Skeleton */}
      <div className="px-3 py-2">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm">
              {/* Product Image */}
              <div className="aspect-square bg-gray-200 dark:bg-gray-700 animate-pulse" />

              {/* Product Info */}
              <div className="p-3 space-y-2">
                {/* Title */}
                <div className="space-y-1">
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse" />
                </div>

                {/* Price */}
                <div className="flex items-center gap-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-12 animate-pulse" />
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1">
                  <div className="h-4 w-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  <div className="h-3 w-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                </div>

                {/* Buttons */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex gap-1">
                    <div className="w-7 h-7 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
                    <div className="w-7 h-7 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
                    <div className="w-7 h-7 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Skeleton */}
      <div className="mt-4 px-3 py-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="space-y-3">
          <div className="flex justify-center gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
            ))}
          </div>
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Nav Skeleton */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 px-4 py-2">
        <div className="flex justify-around">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className="w-6 h-6 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
              <div className="w-8 h-2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
