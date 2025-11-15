"use client"

import { useState, useEffect } from "react"
import { Star } from 'lucide-react'
import { createClient } from "@/lib/supabase/client"

interface RatingDisplayProps {
  itemId: string
  itemType: "collection" | "product"
  className?: string
}

export function RatingDisplay({ itemId, itemType, className = "" }: RatingDisplayProps) {
  const [averageRating, setAverageRating] = useState(4.1)

  useEffect(() => {
    loadRating()
    
    // Listen for rating updates
    const handleRatingUpdate = (event: any) => {
      if (event.detail.itemId === itemId && event.detail.itemType === itemType) {
        loadRating()
      }
    }
    
    window.addEventListener('ratingUpdated', handleRatingUpdate)
    return () => window.removeEventListener('ratingUpdated', handleRatingUpdate)
  }, [itemId])

  const loadRating = async () => {
    try {
      const supabase = createClient()
      
      const { data: ratings } = await supabase
        .from("ratings")
        .select("rating")
        .eq("item_id", itemId)
        .eq("item_type", itemType)

      if (ratings && ratings.length > 0) {
        const avg = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
        setAverageRating(Math.round(avg * 10) / 10)
      }
    } catch (error) {
      // Silently fail if table doesn't exist yet
    }
  }

  return (
    <div
      className={`flex items-center gap-1 bg-green-600 text-white px-2 py-0.5 rounded-md text-xs font-semibold shadow-sm ${className}`}
    >
      <Star className="w-3 h-3 fill-white" />
      <span>{averageRating}</span>
    </div>
  )
}
