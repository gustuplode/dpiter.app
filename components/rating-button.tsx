"use client"

import { useState, useEffect } from "react"
import { Star } from 'lucide-react'
import { createClient } from "@/lib/supabase/client"

interface RatingButtonProps {
  itemId: string
  itemType: "collection" | "product"
  className?: string
}

export function RatingButton({ itemId, itemType, className = "" }: RatingButtonProps) {
  const [userRating, setUserRating] = useState(0)
  const [showRatingModal, setShowRatingModal] = useState(false)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    loadUserRating()
  }, [itemId])

  const loadUserRating = async () => {
    try {
      const supabase = createClient()
      const userId = localStorage.getItem("userId") || `user_${Date.now()}`
      localStorage.setItem("userId", userId)

      const { data: userRatingData } = await supabase
        .from("ratings")
        .select("rating")
        .eq("item_id", itemId)
        .eq("item_type", itemType)
        .eq("user_id", userId)
        .single()

      if (userRatingData) {
        setUserRating(userRatingData.rating)
      }
    } catch (error) {
      // Silently fail if table doesn't exist yet
    }
  }

  const submitRating = async (rating: number) => {
    setIsLoading(true)
    try {
      const supabase = createClient()
      const userId = localStorage.getItem("userId") || `user_${Date.now()}`
      localStorage.setItem("userId", userId)

      const { error } = await supabase
        .from("ratings")
        .upsert({
          item_id: itemId,
          item_type: itemType,
          user_id: userId,
          rating: rating,
        })

      if (!error) {
        setUserRating(rating)
        setShowRatingModal(false)
        // Trigger a custom event to update the display
        window.dispatchEvent(new CustomEvent('ratingUpdated', { detail: { itemId, itemType } }))
      }
    } catch (error) {
      console.error("Error saving rating:", error)
    }
    setIsLoading(false)
  }

  return (
    <>
      <button
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setShowRatingModal(true)
        }}
        className={`h-7 w-7 flex items-center justify-center rounded-full bg-white/70 dark:bg-slate-700/70 backdrop-blur-sm text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-600 transition-colors ${className}`}
      >
        <Star className={`w-4 h-4 ${userRating > 0 ? 'fill-yellow-400 text-yellow-400' : ''}`} />
      </button>
      {/* </CHANGE> */}

      {showRatingModal && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setShowRatingModal(false)
          }}
        >
          <div
            className="bg-white dark:bg-slate-800 rounded-2xl p-8 max-w-sm w-full shadow-2xl transform transition-all"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
            }}
          >
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 text-center">
              Rate this {itemType}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 text-center">
              Tap a star to give your rating
            </p>
            <div className="flex gap-3 justify-center mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => submitRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  disabled={isLoading}
                  className="transition-all hover:scale-125 active:scale-95 disabled:opacity-50 focus:outline-none"
                >
                  <Star
                    className={`w-12 h-12 transition-colors ${
                      star <= (hoveredRating || userRating)
                        ? "fill-yellow-400 text-yellow-400 drop-shadow-lg"
                        : "text-slate-300 dark:text-slate-600"
                    }`}
                  />
                </button>
              ))}
            </div>
            <div className="text-center">
              {userRating > 0 ? (
                <p className="text-sm font-medium text-green-600 dark:text-green-400">
                  ✓ Your rating: {userRating} {userRating === 1 ? 'star' : 'stars'}
                </p>
              ) : (
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Click a star to rate
                </p>
              )}
            </div>
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setShowRatingModal(false)
              }}
              className="mt-6 w-full py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  )
}
