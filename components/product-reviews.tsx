"use client"

import { useState } from "react"

interface Rating {
  id: string
  rating: number
  comment: string | null
  user_id: string
  created_at: string
}

interface ProductReviewsProps {
  ratings: Rating[]
  avgRating: number
  ratingCount: number
}

export function ProductReviews({ ratings, avgRating, ratingCount }: ProductReviewsProps) {
  const [showAll, setShowAll] = useState(false)

  const displayedRatings = showAll ? ratings : ratings.slice(0, 3)

  // Calculate rating distribution
  const distribution = [5, 4, 3, 2, 1].map((star) => {
    const count = ratings.filter((r) => r.rating === star).length
    const percentage = ratingCount > 0 ? (count / ratingCount) * 100 : 0
    return { star, count, percentage }
  })

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Ratings & Reviews</h3>

      <div className="flex gap-8 mb-6">
        {/* Overall Rating */}
        <div className="text-center">
          <div className="text-5xl font-bold text-gray-900 dark:text-white">{avgRating.toFixed(1)}</div>
          <div className="flex items-center justify-center gap-0.5 my-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`material-symbols-outlined text-lg ${
                  star <= Math.round(avgRating) ? "text-green-600" : "text-gray-300"
                }`}
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                star
              </span>
            ))}
          </div>
          <div className="text-sm text-gray-500">{ratingCount.toLocaleString()} ratings</div>
        </div>

        {/* Rating Distribution */}
        <div className="flex-1 space-y-2">
          {distribution.map(({ star, count, percentage }) => (
            <div key={star} className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400 w-4">{star}</span>
              <span
                className="material-symbols-outlined text-sm text-gray-400"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                star
              </span>
              <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-green-600 rounded-full transition-all" style={{ width: `${percentage}%` }} />
              </div>
              <span className="text-xs text-gray-500 w-10">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      {displayedRatings.length > 0 ? (
        <div className="space-y-4">
          {displayedRatings.map((review) => (
            <div key={review.id} className="border-b border-gray-100 dark:border-gray-800 pb-4 last:border-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1 bg-green-600 text-white text-xs font-bold px-1.5 py-0.5 rounded">
                  {review.rating}
                  <span className="material-symbols-outlined text-[10px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    star
                  </span>
                </span>
                <span className="text-xs text-gray-500">{new Date(review.created_at).toLocaleDateString()}</span>
              </div>
              {review.comment && <p className="text-sm text-gray-700 dark:text-gray-300">{review.comment}</p>}
            </div>
          ))}

          {ratings.length > 3 && (
            <button onClick={() => setShowAll(!showAll)} className="text-primary font-medium text-sm hover:underline">
              {showAll ? "Show less" : `View all ${ratings.length} reviews`}
            </button>
          )}
        </div>
      ) : (
        <p className="text-gray-500 text-sm">No reviews yet. Be the first to review!</p>
      )}
    </div>
  )
}
