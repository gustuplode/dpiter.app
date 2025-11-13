"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Heart } from "lucide-react"

export function WishlistButton({ productId }: { productId: string }) {
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
      className="absolute top-2 right-2 flex items-center justify-center size-8 rounded-full bg-[#f8f6f5]/70 dark:bg-[#23150f]/70 text-[#23150f] dark:text-gray-200 hover:bg-[#f8f6f5] dark:hover:bg-[#23150f] transition-colors"
    >
      <Heart className={`h-5 w-5 ${isInWishlist ? "fill-red-500 text-red-500" : ""}`} />
    </button>
  )
}
