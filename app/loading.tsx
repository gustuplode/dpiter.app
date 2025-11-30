export default function Loading() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Search Header Skeleton */}
      <div className="sticky top-0 z-50" style={{ backgroundColor: "#883223" }}>
        <div className="px-3 py-2">
          <div className="flex items-center h-10 rounded-lg bg-white">
            <div className="w-5 h-5 ml-3 bg-gray-200 rounded animate-pulse" />
            <div className="flex-1 h-4 mx-3 bg-gray-200 rounded animate-pulse" />
            <div className="w-5 h-5 mr-3 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
        {/* Category Icons Skeleton */}
        <div className="bg-white py-3 px-4">
          <div className="flex justify-center gap-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5">
                <div className="w-11 h-11 rounded-full bg-gray-100 animate-pulse" />
                <div className="w-8 h-2 bg-gray-100 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Banner Skeleton */}
      <div className="px-3 py-3">
        <div className="w-full h-36 rounded-xl bg-gray-100 animate-pulse" />
      </div>

      {/* Product Grid Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex flex-col border-t border-r border-gray-100">
            <div className="aspect-square bg-gray-100 animate-pulse" />
            <div className="p-2 space-y-2 bg-gray-50">
              <div className="h-2 w-12 bg-gray-200 rounded animate-pulse" />
              <div className="h-3 w-full bg-gray-200 rounded animate-pulse" />
              <div className="flex items-center justify-between">
                <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                <div className="flex gap-1">
                  <div className="w-6 h-6 rounded-full bg-gray-200 animate-pulse" />
                  <div className="w-6 h-6 rounded-full bg-gray-200 animate-pulse" />
                  <div className="w-6 h-6 rounded-full bg-gray-200 animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Nav Skeleton */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-2 z-50">
        <div className="flex justify-around max-w-md mx-auto">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className="w-6 h-6 bg-gray-200 rounded animate-pulse" />
              <div className="w-8 h-2 bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
