"use client"

export default function GadgetsLoading() {
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

      {/* Header Skeleton */}
      <div className="px-4 py-4 border-b border-gray-100 dark:border-gray-800">
        <div className="h-7 w-24 skeleton-shimmer rounded" />
        <div className="h-4 w-48 skeleton-shimmer rounded mt-1" />
      </div>

      {/* Product Grid Skeleton */}
      <div className="columns-2 md:columns-4 xl:columns-5 gap-0">
        {[...Array(12)].map((_, i) => {
          const heights = ["aspect-square", "aspect-[3/4]", "aspect-[4/5]", "aspect-[2/3]"]
          const randomHeight = heights[i % heights.length]

          return (
            <div
              key={i}
              className="break-inside-avoid flex flex-col border-b border-r border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800"
            >
              <div className={`relative ${randomHeight} skeleton-shimmer`}>
                <div className="absolute bottom-1.5 left-1.5 w-8 h-4 bg-white/80 rounded" />
              </div>
              <div className="p-2 space-y-1.5 bg-gray-50 dark:bg-gray-800/50">
                <div className="h-2 w-10 skeleton-shimmer rounded" />
                <div className="h-3 w-full skeleton-shimmer rounded" />
                <div className="flex items-center justify-between pt-1">
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
          )
        })}
      </div>
    </div>
  )
}
