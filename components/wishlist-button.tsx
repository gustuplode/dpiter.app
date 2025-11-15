"use client"

import type React from "react"
import { useState, useEffect } from "react"

export function WishlistButton({ productId, className = "" }: { productId: string; className?: string }) {
  const [isInWishlist, setIsInWishlist] = useState(false)

  useEffect(() => {
    checkWishlist()
  }, [productId])

  const checkWishlist = () => {
    const savedWishlist = localStorage.getItem("wishlist")
    if (savedWishlist) {
      const productIds: string[] = JSON.parse(savedWishlist)
      setIsInWishlist(productIds.includes(productId))
    }
  }

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const savedWishlist = localStorage.getItem("wishlist")
    let productIds: string[] = savedWishlist ? JSON.parse(savedWishlist) : []

    if (isInWishlist) {
      productIds = productIds.filter((id) => id !== productId)
    } else {
      productIds.push(productId)
    }

    localStorage.setItem("wishlist", JSON.stringify(productIds))
    setIsInWishlist(!isInWishlist)
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
      {/* </CHANGE> */}
    </button>
  )
}
