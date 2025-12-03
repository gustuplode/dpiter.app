"use client"

export default function ProductDetailLoading() {
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

      {/* Mobile Layout Skeleton */}
      <div className="lg:hidden">
        {/* Image Skeleton */}
        <div className="w-full aspect-square skeleton-shimmer" />

        {/* Product Info Skeleton */}
        <div className="p-4 space-y-4">
          {/* Brand & Title */}
          <div className="space-y-2">
            <div className="h-4 w-20 skeleton-shimmer rounded" />
            <div className="h-6 w-3/4 skeleton-shimmer rounded" />
            <div className="flex items-center gap-2">
              <div className="h-5 w-12 skeleton-shimmer rounded" />
              <div className="h-4 w-24 skeleton-shimmer rounded" />
            </div>
          </div>

          {/* Price */}
          <div className="flex items-center gap-3">
            <div className="h-8 w-24 skeleton-shimmer rounded" />
            <div className="h-5 w-16 skeleton-shimmer rounded" />
            <div className="h-5 w-16 skeleton-shimmer rounded" />
          </div>

          {/* Description Box */}
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 space-y-2">
            <div className="h-4 w-24 skeleton-shimmer rounded" />
            <div className="h-3 w-full skeleton-shimmer rounded" />
            <div className="h-3 w-full skeleton-shimmer rounded" />
            <div className="h-3 w-2/3 skeleton-shimmer rounded" />
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-5 w-16 skeleton-shimmer rounded-full" />
            ))}
          </div>

          {/* Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <div className="h-12 skeleton-shimmer rounded-lg" />
            <div className="h-12 skeleton-shimmer rounded-lg" />
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-around py-3 border-t border-gray-200 dark:border-gray-700">
            <div className="h-5 w-16 skeleton-shimmer rounded" />
            <div className="h-5 w-16 skeleton-shimmer rounded" />
            <div className="h-5 w-16 skeleton-shimmer rounded" />
          </div>
        </div>

        <div className="h-2 bg-gray-100 dark:bg-gray-800/50" />

        {/* Similar Products Skeleton */}
        <div className="mt-4">
          <div className="h-5 w-32 skeleton-shimmer rounded mx-3 mb-2" />
          <div className="columns-2 gap-0">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="break-inside-avoid border-b border-r border-gray-200 dark:border-gray-700">
                <div className="aspect-square skeleton-shimmer" />
                <div className="p-2 space-y-1 bg-gray-50 dark:bg-gray-800">
                  <div className="h-2 w-10 skeleton-shimmer rounded" />
                  <div className="h-3 w-full skeleton-shimmer rounded" />
                  <div className="h-4 w-14 skeleton-shimmer rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop Layout Skeleton */}
      <div className="hidden lg:block max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-8">
          {/* Left - Image */}
          <div className="w-[400px] flex-shrink-0">
            <div className="sticky top-4">
              <div className="aspect-square skeleton-shimmer rounded-lg" />
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="h-14 skeleton-shimmer rounded" />
                <div className="h-14 skeleton-shimmer rounded" />
              </div>
            </div>
          </div>

          {/* Right - Details */}
          <div className="flex-1 space-y-4">
            {/* Breadcrumb */}
            <div className="h-4 w-64 skeleton-shimmer rounded" />

            {/* Brand & Title */}
            <div className="h-5 w-24 skeleton-shimmer rounded" />
            <div className="h-6 w-3/4 skeleton-shimmer rounded" />

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="h-6 w-14 skeleton-shimmer rounded" />
              <div className="h-4 w-40 skeleton-shimmer rounded" />
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <div className="h-10 w-32 skeleton-shimmer rounded" />
              <div className="h-6 w-20 skeleton-shimmer rounded" />
              <div className="h-6 w-20 skeleton-shimmer rounded" />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 py-4 border-t border-b border-gray-200 dark:border-gray-700">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-6 w-20 skeleton-shimmer rounded" />
              ))}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <div className="h-6 w-40 skeleton-shimmer rounded" />
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 space-y-2">
                <div className="h-4 w-full skeleton-shimmer rounded" />
                <div className="h-4 w-full skeleton-shimmer rounded" />
                <div className="h-4 w-3/4 skeleton-shimmer rounded" />
              </div>
            </div>

            {/* Highlights */}
            <div className="space-y-2">
              <div className="h-6 w-28 skeleton-shimmer rounded" />
              <div className="grid grid-cols-2 gap-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-4 w-40 skeleton-shimmer rounded" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
