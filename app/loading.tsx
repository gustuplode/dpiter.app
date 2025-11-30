export default function Loading() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Search Header Skeleton - Meesho style */}
      <div className="sticky top-0 z-50" style={{ backgroundColor: "#883223" }}>
        <div className="px-2 py-2">
          <div className="flex items-center h-10 rounded bg-white/95">
            <div className="w-8 h-8 rounded ml-2 bg-gray-200 animate-pulse" />
            <div className="flex-1 h-4 mx-3 bg-gray-200 rounded animate-pulse" />
            <div className="w-8 h-8 rounded mr-2 bg-gray-200 animate-pulse" />
          </div>
        </div>

        {/* Category Header Skeleton - Meesho style circles */}
        <div className="bg-white dark:bg-gray-900 py-3 px-2">
          <div className="flex justify-center gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className="w-11 h-11 rounded-full bg-gray-100 animate-pulse" />
                <div className="w-8 h-2 bg-gray-100 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Banner Skeleton */}
      <div className="px-2 py-2">
        <div className="w-full h-32 md:h-44 rounded-xl bg-gray-100 animate-pulse" />
      </div>

      {/* Products Grid Skeleton - Matches actual grid structure */}
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="flex flex-col bg-white dark:bg-gray-800 border-t border-r border-gray-200 dark:border-gray-700"
          >
            {/* Product Image */}
            <div className="aspect-square bg-gray-100 animate-pulse" />

            {/* Product Info */}
            <div className="p-2 bg-gray-50 dark:bg-gray-800 space-y-2">
              <div className="h-2 w-12 bg-gray-200 rounded animate-pulse" />
              <div className="h-3 w-full bg-gray-200 rounded animate-pulse" />
              <div className="flex items-center justify-between">
                <div className="flex gap-1">
                  <div className="h-4 w-14 bg-gray-200 rounded animate-pulse" />
                  <div className="h-3 w-10 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="flex gap-1">
                  <div className="w-7 h-7 rounded-full bg-gray-200 animate-pulse" />
                  <div className="w-7 h-7 rounded-full bg-gray-200 animate-pulse" />
                  <div className="w-7 h-7 rounded-full bg-gray-200 animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Nav Skeleton */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 px-4 py-2 z-50">
        <div className="flex justify-around max-w-lg mx-auto">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className="w-6 h-6 rounded bg-gray-200 animate-pulse" />
              <div className="w-8 h-2 bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
