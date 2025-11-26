"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

export function WishlistButton({
  productId,
  collectionId,
  type = "product",
  className = "",
  showText = false,
  showLabel = false,
  variant = "default",
}: {
  productId?: string
  collectionId?: string
  type?: "product" | "collection"
  className?: string
  showText?: boolean
  showLabel?: boolean
  variant?: "default" | "desktop"
}) {
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const itemId = productId || collectionId
  const storageKey = collectionId ? "wishlist_collections" : type === "collection" ? "wishlist_collections" : "wishlist"

  useEffect(() => {
    if (itemId) checkWishlist()
  }, [itemId])

  const checkWishlist = () => {
    if (!itemId) return
    const savedWishlist = localStorage.getItem(storageKey)
    if (savedWishlist) {
      const ids: string[] = JSON.parse(savedWishlist)
      setIsInWishlist(ids.includes(itemId))
    }
  }

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!itemId || isLoading) return
    setIsLoading(true)

    const savedWishlist = localStorage.getItem(storageKey)
    let ids: string[] = savedWishlist ? JSON.parse(savedWishlist) : []

    if (isInWishlist) {
      ids = ids.filter((id) => id !== itemId)
    } else {
      ids.push(itemId)
      window.dispatchEvent(new CustomEvent("wishlistAdded"))
    }

    localStorage.setItem(storageKey, JSON.stringify(ids))
    setIsInWishlist(!isInWishlist)

    window.dispatchEvent(new CustomEvent("wishlistUpdated"))

    setTimeout(() => setIsLoading(false), 300)
  }

  if (variant === "desktop") {
    return (
      <button
        onClick={toggleWishlist}
        disabled={isLoading}
        className={cn(
          "transition-all duration-200 flex items-center justify-center gap-2",
          isInWishlist && "bg-red-500 hover:bg-red-600",
          className,
        )}
      >
        {isLoading ? (
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
        ) : (
          <>
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: isInWishlist ? "'FILL' 1" : "'FILL' 0" }}
            >
              favorite
            </span>
            {isInWishlist ? "WISHLISTED" : "ADD TO WISHLIST"}
          </>
        )}
      </button>
    )
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
