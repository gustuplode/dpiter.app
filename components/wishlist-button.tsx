"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

export function WishlistButton({
  productId,
  type = "product",
  className = "",
  showText = false,
  showLabel = false,
}: {
  productId: string
  type?: "product" | "collection"
  className?: string
  showText?: boolean
  showLabel?: boolean
}) {
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    checkWishlist()
  }, [productId])

  const checkWishlist = () => {
    const key = type === "collection" ? "wishlist_collections" : "wishlist"
    const savedWishlist = localStorage.getItem(key)
    if (savedWishlist) {
      const ids: string[] = JSON.parse(savedWishlist)
      setIsInWishlist(ids.includes(productId))
    }
  }

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (isLoading) return
    setIsLoading(true)

    const key = type === "collection" ? "wishlist_collections" : "wishlist"
    const savedWishlist = localStorage.getItem(key)
    let ids: string[] = savedWishlist ? JSON.parse(savedWishlist) : []

    if (isInWishlist) {
      ids = ids.filter((id) => id !== productId)
    } else {
      ids.push(productId)
      window.dispatchEvent(new CustomEvent("wishlistAdded"))
    }

    localStorage.setItem(key, JSON.stringify(ids))
    setIsInWishlist(!isInWishlist)

    window.dispatchEvent(new CustomEvent("wishlistUpdated"))

    setTimeout(() => setIsLoading(false), 300)
  }

  if (showLabel) {
    return (
      <button
        onClick={toggleWishlist}
        disabled={isLoading}
        className={cn(
          "flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-red-500 transition-colors",
          isInWishlist && "text-red-500",
          className,
        )}
      >
        {isLoading ? (
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-red-500 border-t-transparent" />
        ) : (
          <span
            className="material-symbols-outlined text-xl"
            style={{ fontVariationSettings: isInWishlist ? "'FILL' 1" : "'FILL' 0" }}
          >
            favorite
          </span>
        )}
        <span>{isInWishlist ? "Wishlisted" : "Wishlist"}</span>
      </button>
    )
  }

  return (
    <button onClick={toggleWishlist} disabled={isLoading} className={className}>
      {isLoading ? (
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-red-500 border-t-transparent" />
      ) : (
        <>
          <span
            className={`material-symbols-outlined !text-base transition-colors ${
              isInWishlist ? "text-red-500" : "text-slate-700 dark:text-slate-200"
            }`}
            style={{ fontVariationSettings: isInWishlist ? "'FILL' 1" : "'FILL' 0" }}
          >
            favorite
          </span>
          {showText && <span className="ml-1">{isInWishlist ? "Remove" : "Add"}</span>}
        </>
      )}
    </button>
  )
}
