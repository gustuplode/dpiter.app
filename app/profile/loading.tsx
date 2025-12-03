"use client"

export default function ProfileLoading() {
  return (
    <div className="min-h-screen bg-background pb-24">
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

      {/* Header with gradient background */}
      <div className="bg-gradient-to-br from-orange-500 to-red-500 pt-8 pb-20 px-4">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-4">
            {/* Avatar skeleton */}
            <div className="w-20 h-20 rounded-full bg-white/20 skeleton-shimmer" />
            <div className="flex-1 space-y-2">
              {/* Name skeleton */}
              <div className="h-6 w-32 bg-white/20 rounded skeleton-shimmer" />
              {/* Email skeleton */}
              <div className="h-4 w-48 bg-white/20 rounded skeleton-shimmer" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Card Skeleton */}
      <div className="max-w-lg mx-auto px-4 -mt-12">
        <div className="bg-card rounded-xl shadow-lg p-5 border border-border">
          <div className="grid grid-cols-2 gap-4">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3">
                <div className="w-12 h-12 rounded-full skeleton-shimmer" />
                <div className="space-y-1">
                  <div className="h-7 w-10 skeleton-shimmer rounded" />
                  <div className="h-4 w-16 skeleton-shimmer rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Skeleton */}
      <div className="max-w-lg mx-auto px-4 mt-4">
        <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="flex items-center justify-between p-4 border-b border-border last:border-b-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full skeleton-shimmer" />
                <div className="h-4 w-28 skeleton-shimmer rounded" />
              </div>
              <div className="w-5 h-5 skeleton-shimmer rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
