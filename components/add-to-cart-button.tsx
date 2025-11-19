"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from 'next/navigation'

export function AddToCartButton({ 
  productId, 
  className = ""
}: { 
  productId: string
  className?: string
}) {
  const [isInCart, setIsInCart] = useState(false)
  const router = useRouter()

  useEffect(() => {
    checkCart()
  }, [productId])

  const checkCart = () => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      const ids: string[] = JSON.parse(savedCart)
      setIsInCart(ids.includes(productId))
    }
  }

  const toggleCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const savedCart = localStorage.getItem("cart")
    let ids: string[] = savedCart ? JSON.parse(savedCart) : []

    if (isInCart) {
      ids = ids.filter((id) => id !== productId)
    } else {
      ids.push(productId)
      window.dispatchEvent(new CustomEvent('cartAdded', { detail: { productId } }))
    }

    localStorage.setItem("cart", JSON.stringify(ids))
    setIsInCart(!isInCart)
    
    window.dispatchEvent(new CustomEvent('cartUpdated'))
    
    if (!isInCart) {
      router.push('/cart')
    }
  }

  return (
    <button
      onClick={toggleCart}
      className={className}
    >
      <span 
        className={`material-symbols-outlined !text-xl transition-colors ${
          isInCart 
            ? "text-primary dark:text-primary-light" 
            : "text-slate-700 dark:text-slate-200"
        }`}
        style={{ fontVariationSettings: isInCart ? "'FILL' 1" : "'FILL' 0" }}
      >
        {isInCart ? "shopping_cart" : "add_shopping_cart"}
      </span>
    </button>
  )
}
