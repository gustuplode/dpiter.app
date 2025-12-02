"use client"

export default function Loading() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="fixed top-0 left-0 right-0 z-[100] h-1 bg-gray-200 overflow-hidden">
        <div
          className="h-full bg-[#883223] animate-[loading_1.5s_ease-in-out_infinite]"
          style={{
            width: "30%",
            animation: "loading 1.5s ease-in-out infinite",
          }}
        />
      </div>

      <style jsx>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(200%); }
          100% { transform: translateX(400%); }
        }
      `}</style>

      {/* Banner Skeleton */}
      <div className="px-3 py-3 mt-2">
        <div className="w-full h-36 rounded-xl bg-gray-100 animate-pulse" />
      </div>

      {/* Product Grid Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="flex flex-col border-t border-r border-gray-100 dark:border-gray-800">
            <div className="aspect-square bg-gray-100 dark:bg-gray-800 animate-pulse" />
            <div className="p-2 space-y-2 bg-gray-50 dark:bg-gray-900">
              <div className="h-2 w-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-3 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="flex items-center justify-between pt-1">
                <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
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
  )
}
