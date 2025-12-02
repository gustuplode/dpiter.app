"use client"

export default function ProductLoading() {
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

      <div className="pb-20">
        {/* Product Image Gallery Skeleton */}
        <div className="w-full aspect-square skeleton-shimmer" />

        {/* Product Info Skeleton */}
        <div className="p-4 space-y-4">
          {/* Brand */}
          <div className="h-3 w-16 skeleton-shimmer rounded" />

          {/* Title */}
          <div className="space-y-2">
            <div className="h-5 w-full skeleton-shimmer rounded" />
            <div className="h-5 w-3/4 skeleton-shimmer rounded" />
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="h-6 w-12 skeleton-shimmer rounded" />
            <div className="h-4 w-20 skeleton-shimmer rounded" />
          </div>

          {/* Price */}
          <div className="flex items-center gap-3">
            <div className="h-8 w-24 skeleton-shimmer rounded" />
            <div className="h-5 w-16 skeleton-shimmer rounded" />
            <div className="h-5 w-14 skeleton-shimmer rounded-full" />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <div className="flex-1 h-12 skeleton-shimmer rounded-lg" />
            <div className="h-12 w-12 skeleton-shimmer rounded-lg" />
          </div>

          {/* Description Section */}
          <div className="pt-4 space-y-3">
            <div className="h-5 w-28 skeleton-shimmer rounded" />
            <div className="space-y-2">
              <div className="h-3 w-full skeleton-shimmer rounded" />
              <div className="h-3 w-full skeleton-shimmer rounded" />
              <div className="h-3 w-2/3 skeleton-shimmer rounded" />
            </div>
          </div>

          {/* Keywords */}
          <div className="flex flex-wrap gap-2 pt-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-6 w-16 skeleton-shimmer rounded-full" />
            ))}
          </div>
        </div>

        {/* Similar Products Section */}
        <div className="mt-6 px-4">
          <div className="h-6 w-40 skeleton-shimmer rounded mb-4" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex flex-col border-t border-r border-gray-100">
                <div className="aspect-square skeleton-shimmer" />
                <div className="p-2 space-y-2 bg-gray-50">
                  <div className="h-2 w-10 skeleton-shimmer rounded" />
                  <div className="h-3 w-full skeleton-shimmer rounded" />
                  <div className="h-4 w-14 skeleton-shimmer rounded" />
                </div>
              </div>
            ))}
          </div>
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
