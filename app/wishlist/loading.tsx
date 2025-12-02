"use client"

export default function WishlistLoading() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* YouTube-style top loading bar */}
      <div className="fixed top-0 left-0 right-0 z-[100] h-[3px] bg-gray-100 overflow-hidden">
        <div
          className="h-full bg-[#883223] rounded-r-full"
          style={{
            width: "30%",
            animation: "youtubeLoading 2s ease-in-out infinite",
          }}
        />
      </div>

      <style jsx>{`
        @keyframes youtubeLoading {
          0% { width: 0%; margin-left: 0%; }
          25% { width: 50%; margin-left: 0%; }
          50% { width: 30%; margin-left: 50%; }
          75% { width: 20%; margin-left: 80%; }
          100% { width: 0%; margin-left: 100%; }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .skeleton-shimmer {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }
        .dark .skeleton-shimmer {
          background: linear-gradient(90deg, #1f2937 25%, #374151 50%, #1f2937 75%);
          background-size: 200% 100%;
        }
      `}</style>

      <div className="px-4 md:px-6 lg:px-8 py-6 max-w-7xl mx-auto w-full pb-20">
        {/* Title Skeleton */}
        <div className="h-8 w-36 skeleton-shimmer rounded mb-6" />

        {/* Wishlist Grid Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-[5px] gap-y-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex flex-col bg-white dark:bg-slate-800 rounded-lg overflow-hidden shadow-sm">
              {/* Remove button skeleton */}
              <div className="relative">
                <div className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full skeleton-shimmer" />
                <div className="w-full aspect-[3/4] skeleton-shimmer" />
              </div>

              {/* Product Info Skeleton */}
              <div className="p-3 space-y-2">
                <div className="h-3 w-12 skeleton-shimmer rounded" />
                <div className="h-4 w-full skeleton-shimmer rounded" />
                <div className="h-4 w-3/4 skeleton-shimmer rounded" />
                <div className="h-4 w-16 skeleton-shimmer rounded mt-1" />
                <div className="h-3 w-14 skeleton-shimmer rounded mt-1" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Nav Skeleton */}
      <div className="fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-gray-900 border-t border-gray-100 flex items-center justify-around px-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <div className="w-6 h-6 rounded skeleton-shimmer" />
            <div className="w-10 h-2 skeleton-shimmer rounded" />
          </div>
        ))}
      </div>
    </div>
  )
}
