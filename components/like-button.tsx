"use client"

import { useState, useEffect } from "react"
import { ThumbsUp } from 'lucide-react'
import { createClient } from "@/lib/supabase/client"

interface LikeButtonProps {
  itemId: string
  itemType: 'product' | 'collection' | 'category_product'
  className?: string
}

export function LikeButton({ itemId, itemType, className = "" }: LikeButtonProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    loadLikeStatus()
    loadLikeCount()
  }, [itemId, itemType])

  const loadLikeStatus = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from("likes")
      .select("id")
      .eq("item_id", itemId)
      .eq("item_type", itemType)
      .eq("user_id", user.id)
      .single()

    setIsLiked(!!data)
  }

  const loadLikeCount = async () => {
    const { count } = await supabase
      .from("likes")
      .select("*", { count: "exact", head: true })
      .eq("item_id", itemId)
      .eq("item_type", itemType)

    setLikeCount(count || 0)
  }

  const toggleLike = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      alert('Please sign in to like products')
      return
    }

    setIsLoading(true)

    try {
      if (isLiked) {
        // Unlike
        await supabase
          .from("likes")
          .delete()
          .eq("item_id", itemId)
          .eq("item_type", itemType)
          .eq("user_id", user.id)

        setIsLiked(false)
        setLikeCount(prev => Math.max(0, prev - 1))
      } else {
        // Like
        await supabase
          .from("likes")
          .insert({
            user_id: user.id,
            item_id: itemId,
            item_type: itemType
          })

        setIsLiked(true)
        setLikeCount(prev => prev + 1)
      }
    } catch (error) {
      console.error("Error toggling like:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    null
  )
}
