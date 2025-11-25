"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

export function AddToCartButton({
  productId,
  className = "",
  variant = "default",
}: {
  productId: string
  className?: string
  variant?: "default" | "desktop"
}) {
  const [isInCart, setIsInCart] = useState(false)
  const [isAdding, setIsAdding] = useState(false)

  useEffect(() => {
    checkCart()

    const handleCartUpdated = () => {
      checkCart()
    }

    window.addEventListener("cartUpdated", handleCartUpdated)
    return () => window.removeEventListener("cartUpdated", handleCartUpdated)
  }, [productId])

  const checkCart = () => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      const ids: string[] = JSON.parse(savedCart)
      setIsInCart(ids.includes(productId))
    }
  }

  const toggleCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (isAdding) return
    setIsAdding(true)

    const savedCart = localStorage.getItem("cart")
    let ids: string[] = savedCart ? JSON.parse(savedCart) : []

    if (isInCart) {
      ids = ids.filter((id) => id !== productId)
    } else {
      ids.push(productId)
      window.dispatchEvent(new CustomEvent("cartAdded", { detail: { productId } }))
    }

    localStorage.setItem("cart", JSON.stringify(ids))
    setIsInCart(!isInCart)

    window.dispatchEvent(new CustomEvent("cartUpdated"))

    // Brief delay for visual feedback
    setTimeout(() => setIsAdding(false), 300)
  }

  if (variant === "desktop") {
    return (
      <button
        onClick={toggleCart}
        disabled={isAdding}
        className={cn("transition-all duration-200", isInCart && "bg-green-500 hover:bg-green-600", className)}
      >
        {isAdding ? (
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
        ) : isInCart ? (
          <>
            <span className="material-symbols-outlined">check</span>
            ADDED
          </>
        ) : (
          <>
            <span className="material-symbols-outlined">shopping_cart</span>
            ADD TO CART
          </>
        )}
      </button>
    )
  }

  return (
    <button onClick={toggleCart} disabled={isAdding} className={className}>
      {isAdding ? (
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" />
      ) : (
        <span
          className={`material-symbols-outlined !text-xl transition-colors ${
            isInCart ? "text-primary dark:text-primary-light" : "text-slate-700 dark:text-slate-200"
          }`}
          style={{ fontVariationSettings: isInCart ? "'FILL' 1" : "'FILL' 0" }}
        >
          {isInCart ? "shopping_cart" : "add_shopping_cart"}
        </span>
      )}
    </button>
  )
}
