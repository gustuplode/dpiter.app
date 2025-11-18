"use client"

import { useState, useEffect } from "react"
import { Star } from 'lucide-react'
import { createClient } from "@/lib/supabase/client"
import { RatingButton } from "@/components/rating-button"

interface Review {
  id: string
  user_id: string
  rating: number
  comment: string | null
  created_at: string
}

interface ReviewSectionProps {
  itemId: string
  itemType: "collection" | "product" | "category_product"
}

export function ReviewSection({ itemId, itemType }: ReviewSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [displayRating, setDisplayRating] = useState(4.1)
  const [reviewCount, setReviewCount] = useState(0)
  const [likeCount, setLikeCount] = useState(0)
  const supabase = createClient()

  useEffect(() => {
    loadReviews()
    loadLikes()
  }, [itemId])

  const loadReviews = async () => {
    const { data: ratings } = await supabase
      .from("ratings")
      .select("*")
      .eq("item_id", itemId)
      .eq("item_type", itemType)
      .order("created_at", { ascending: false })

    if (ratings && ratings.length > 0) {
      setReviews(ratings)
      setReviewCount(ratings.length)
      
      const frequency: { [key: number]: number } = {}
      ratings.forEach(r => {
        frequency[r.rating] = (frequency[r.rating] || 0) + 1
      })
      
      let maxCount = 0
      let modeRating = 4
      Object.entries(frequency).forEach(([rating, count]) => {
        if (count > maxCount) {
          maxCount = count
          modeRating = parseInt(rating)
        }
      })
      
      setDisplayRating(modeRating + 0.1)
    }
  }

  const loadLikes = async () => {
    const { count } = await supabase
      .from("likes")
      .select("*", { count: "exact", head: true })
      .eq("item_id", itemId)
      .eq("item_type", itemType)
    
    setLikeCount(count || 0)
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-lg font-bold shadow-md">
              <Star className="w-5 h-5 fill-white" />
              <span>{displayRating}</span>
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              <p className="font-semibold">{reviewCount} Reviews</p>
              <p>{likeCount} Likes</p>
            </div>
          </div>
          
          <RatingButton itemId={itemId} itemType={itemType} />
        </div>

        {reviews.length > 0 ? (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <span className="material-symbols-outlined">rate_review</span>
              Customer Reviews
            </h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {reviews.map((review) => (
                <div key={review.id} className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating 
                              ? "fill-yellow-400 text-yellow-400" 
                              : "fill-slate-300 text-slate-300 dark:fill-slate-600 dark:text-slate-600"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {new Date(review.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  {review.comment && (
                    <p className="text-sm text-slate-700 dark:text-slate-300">{review.comment}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-slate-500 dark:text-slate-400">
            <span className="material-symbols-outlined text-4xl mb-2 opacity-50">rate_review</span>
            <p className="text-sm">No reviews yet. Be the first to review!</p>
          </div>
        )}
      </div>
    </div>
  )
}
