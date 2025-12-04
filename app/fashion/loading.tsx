"use client"

export default function FashionLoading() {
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

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-0">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="flex flex-col border-b border-r border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800"
          >
            {/* Product Image Skeleton - varying heights */}
            <div
              className="relative skeleton-shimmer"
              style={{ aspectRatio: i % 3 === 0 ? "3/4" : i % 2 === 0 ? "4/5" : "1/1" }}
            >
              <div className="absolute bottom-1.5 left-1.5 w-8 h-4 bg-white/80 rounded" />
            </div>

            {/* Product Info Skeleton */}
            <div className="p-2 flex flex-col bg-gray-50 dark:bg-gray-800/50 flex-1">
              <div className="h-2.5 w-12 skeleton-shimmer rounded mb-1" />
              <div className="flex-1 min-h-[32px] space-y-1">
                <div className="h-3 w-full skeleton-shimmer rounded" />
                <div className="h-3 w-3/4 skeleton-shimmer rounded" />
              </div>
              <div className="flex items-center justify-between mt-1.5">
                <div className="flex items-center gap-1.5">
                  <div className="h-4 w-14 skeleton-shimmer rounded" />
                  <div className="h-3 w-10 skeleton-shimmer rounded" />
                </div>
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
    </div>
  )
}
