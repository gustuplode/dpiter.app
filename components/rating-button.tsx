"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Star } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"

interface RatingButtonProps {
  itemId: string
  itemType: "collection" | "product"
  className?: string
  showLabel?: boolean
  variant?: "default" | "like"
}

export function RatingButton({
  itemId,
  itemType,
  className = "",
  showLabel = false,
  variant = "default",
}: RatingButtonProps) {
  const [userRating, setUserRating] = useState(0)
  const [showRatingModal, setShowRatingModal] = useState(false)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [comment, setComment] = useState("")
  const [isLiked, setIsLiked] = useState(false)

  useEffect(() => {
    loadUserRating()
    const likedProducts = localStorage.getItem("liked_products")
    if (likedProducts) {
      const ids: string[] = JSON.parse(likedProducts)
      setIsLiked(ids.includes(itemId))
    }
  }, [itemId])

  const loadUserRating = async () => {
    try {
      const supabase = createClient()
      const userId = localStorage.getItem("firebase_uid") || localStorage.getItem("userId") || `user_${Date.now()}`
      localStorage.setItem("userId", userId)

      const { data: userRatingData } = await supabase
        .from("ratings")
        .select("rating, comment")
        .eq("item_id", itemId)
        .eq("item_type", itemType)
        .eq("user_id", userId)
        .maybeSingle()

      if (userRatingData) {
        setUserRating(userRatingData.rating)
        setComment(userRatingData.comment || "")
      }
    } catch (error) {
      // Silently fail if table doesn't exist yet
    }
  }

  const toggleLike = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const likedProducts = localStorage.getItem("liked_products")
    let ids: string[] = likedProducts ? JSON.parse(likedProducts) : []

    if (isLiked) {
      ids = ids.filter((id) => id !== itemId)
    } else {
      ids.push(itemId)
    }

    localStorage.setItem("liked_products", JSON.stringify(ids))
    setIsLiked(!isLiked)
    window.dispatchEvent(new CustomEvent("likedUpdated"))
  }

  const submitRating = async (rating: number) => {
    setIsLoading(true)
    try {
      const supabase = createClient()
      const userId = localStorage.getItem("firebase_uid") || localStorage.getItem("userId") || `user_${Date.now()}`
      localStorage.setItem("userId", userId)

      const { error } = await supabase.from("ratings").upsert({
        item_id: itemId,
        item_type: itemType,
        user_id: userId,
        rating: rating,
        comment: comment || null,
      })

      if (!error) {
        setUserRating(rating)
        setShowRatingModal(false)
        setComment("")
        window.dispatchEvent(new CustomEvent("ratingUpdated", { detail: { itemId, itemType } }))
      }
    } catch (error) {
      console.error("Error saving rating:", error)
    }
    setIsLoading(false)
  }

  if (variant === "like") {
    return (
      <button
        onClick={toggleLike}
        className={cn(
          "transition-all duration-200 flex items-center justify-center gap-2",
          isLiked ? "bg-blue-500 hover:bg-blue-600" : "",
          className,
        )}
      >
        <span
          className="material-symbols-outlined"
          style={{ fontVariationSettings: isLiked ? "'FILL' 1" : "'FILL' 0" }}
        >
          thumb_up
        </span>
        {showLabel && (isLiked ? "LIKED" : "LIKE")}
      </button>
    )
  }

  if (showLabel) {
    return (
      <>
        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setShowRatingModal(true)
          }}
          className={cn(
            "flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-yellow-500 transition-colors",
            userRating > 0 && "text-yellow-500",
            className,
          )}
        >
          <Star className={`w-5 h-5 ${userRating > 0 ? "fill-yellow-400 text-yellow-400" : ""}`} />
          <span>{userRating > 0 ? `Rated ${userRating}` : "Rate"}</span>
        </button>

        {showRatingModal && (
          <RatingModal
            userRating={userRating}
            setUserRating={setUserRating}
            hoveredRating={hoveredRating}
            setHoveredRating={setHoveredRating}
            isLoading={isLoading}
            comment={comment}
            setComment={setComment}
            submitRating={submitRating}
            setShowRatingModal={setShowRatingModal}
            itemType={itemType}
          />
        )}
      </>
    )
  }

  return (
    <>
      <button
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setShowRatingModal(true)
        }}
        className={`flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-yellow-500 transition-colors ${className}`}
      >
        <Star className={`w-4 h-4 ${userRating > 0 ? "fill-yellow-400 text-yellow-400" : ""}`} />
      </button>

      {showRatingModal && (
        <RatingModal
          userRating={userRating}
          setUserRating={setUserRating}
          hoveredRating={hoveredRating}
          setHoveredRating={setHoveredRating}
          isLoading={isLoading}
          comment={comment}
          setComment={setComment}
          submitRating={submitRating}
          setShowRatingModal={setShowRatingModal}
          itemType={itemType}
        />
      )}
    </>
  )
}

function RatingModal({
  userRating,
  setUserRating,
  hoveredRating,
  setHoveredRating,
  isLoading,
  comment,
  setComment,
  submitRating,
  setShowRatingModal,
  itemType,
}: {
  userRating: number
  setUserRating: (r: number) => void
  hoveredRating: number
  setHoveredRating: (r: number) => void
  isLoading: boolean
  comment: string
  setComment: (c: string) => void
  submitRating: (r: number) => void
  setShowRatingModal: (s: boolean) => void
  itemType: string
}) {
  return (
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
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 text-center">Rate this {itemType}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 text-center">Tap a star to give your rating</p>
        <div className="flex gap-3 justify-center mb-6">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setUserRating(star)}
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
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Comment (Optional)
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your thoughts..."
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            rows={3}
          />
        </div>
        <div className="text-center mb-4">
          {userRating > 0 ? (
            <p className="text-sm font-medium text-green-600 dark:text-green-400">
              Your rating: {userRating} {userRating === 1 ? "star" : "stars"}
            </p>
          ) : (
            <p className="text-sm text-slate-600 dark:text-slate-400">Click a star to rate</p>
          )}
        </div>
        <div className="flex gap-3">
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setShowRatingModal(false)
            }}
            className="flex-1 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              if (userRating > 0) submitRating(userRating)
            }}
            disabled={userRating === 0 || isLoading}
            className="flex-1 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  )
}
