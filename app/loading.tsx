"use client"

export default function Loading() {
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

      {/* Banner Skeleton - matches actual banner */}
      <div className="px-3 py-3">
        <div className="w-full h-32 sm:h-40 md:h-48 lg:h-32 rounded-xl skeleton-shimmer" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-0 auto-rows-fr">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="flex flex-col border-b border-r border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800 h-full"
          >
            {/* Product Image Skeleton - fixed 3/4 aspect ratio */}
            <div className="relative aspect-[3/4] skeleton-shimmer">
              {/* Rating badge skeleton */}
              <div className="absolute bottom-1.5 left-1.5 w-8 h-4 bg-white/80 rounded" />
            </div>

            {/* Product Info Skeleton - matches actual layout */}
            <div className="p-2 flex flex-col bg-gray-50 dark:bg-gray-800/50 flex-1">
              {/* Brand */}
              <div className="h-2.5 w-12 skeleton-shimmer rounded mb-1" />
              {/* Title - expanded area with line-clamp-2 */}
              <div className="flex-1 space-y-1">
                <div className="h-3 w-full skeleton-shimmer rounded" />
                <div className="h-3 w-3/4 skeleton-shimmer rounded" />
              </div>

              {/* Price and buttons row */}
              <div className="flex items-center justify-between mt-auto pt-1.5">
                <div className="flex items-center gap-1.5">
                  {/* Price */}
                  <div className="h-4 w-14 skeleton-shimmer rounded" />
                  {/* Original price */}
                  <div className="h-3 w-10 skeleton-shimmer rounded" />
                </div>

                {/* Action buttons */}
                <div className="flex gap-1">
                  <div className="w-7 h-7 rounded-full skeleton-shimmer" />
                  <div className="w-7 h-7 rounded-full skeleton-shimmer" />
                  <div className="w-7 h-7 rounded-full skeleton-shimmer" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Nav Skeleton - only on mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 flex items-center justify-around px-4">
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
