"use client"

import type React from "react"
import { useState, useEffect } from "react"

export function WishlistButton({ 
  productId, 
  type = "product",
  className = "" 
}: { 
  productId: string
  type?: "product" | "collection"
  className?: string 
}) {
  const [isInWishlist, setIsInWishlist] = useState(false)

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

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const key = type === "collection" ? "wishlist_collections" : "wishlist"
    const savedWishlist = localStorage.getItem(key)
    let ids: string[] = savedWishlist ? JSON.parse(savedWishlist) : []

    if (isInWishlist) {
      ids = ids.filter((id) => id !== productId)
    } else {
      ids.push(productId)
      window.dispatchEvent(new CustomEvent('wishlistAdded'))
    }

    localStorage.setItem(key, JSON.stringify(ids))
    setIsInWishlist(!isInWishlist)
    
    window.dispatchEvent(new CustomEvent('wishlistUpdated'))
  }

  return (
    <button
      onClick={toggleWishlist}
      className={className}
    >
      <span 
        className={`material-symbols-outlined !text-base transition-colors ${
          isInWishlist 
            ? "text-red-500" 
            : "text-slate-700 dark:text-slate-200"
        }`}
        style={{ fontVariationSettings: isInWishlist ? "'FILL' 1" : "'FILL' 0" }}
      >
        favorite
      </span>
    </button>
  )
}
