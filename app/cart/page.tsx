"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import Image from "next/image"

interface Product {
  id: string
  brand: string
  title: string
  price: number
  original_price?: number
  image_url: string
  category: string
  slug: string
}

interface CartItem extends Product {
  quantity: number
}

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCart()

    const handleCartUpdated = () => {
      loadCart()
    }

    window.addEventListener("cartUpdated", handleCartUpdated)
    return () => window.removeEventListener("cartUpdated", handleCartUpdated)
  }, [])

  const loadCart = async () => {
    try {
      const savedCart = localStorage.getItem("cart")
      const savedQuantities = localStorage.getItem("cart_quantities")

      if (!savedCart) {
        setItems([])
        setLoading(false)
        return
      }

      const ids: string[] = JSON.parse(savedCart)
      const quantities: Record<string, number> = savedQuantities ? JSON.parse(savedQuantities) : {}

      if (ids.length === 0) {
        setItems([])
        setLoading(false)
        return
      }

      const supabase = createClient()
      const { data, error } = await supabase.from("category_products").select("*").in("id", ids)

      if (error) throw error

      const cartItems: CartItem[] = (data || []).map((product) => ({
        ...product,
        quantity: quantities[product.id] || 1,
      }))

      setItems(cartItems)
    } catch (error) {
      console.error("Error loading cart:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return

    const savedQuantities = localStorage.getItem("cart_quantities")
    const quantities: Record<string, number> = savedQuantities ? JSON.parse(savedQuantities) : {}
    quantities[productId] = newQuantity
    localStorage.setItem("cart_quantities", JSON.stringify(quantities))

    setItems((prev) => prev.map((item) => (item.id === productId ? { ...item, quantity: newQuantity } : item)))
  }

  const removeFromCart = (productId: string) => {
    const savedCart = localStorage.getItem("cart")
    const savedQuantities = localStorage.getItem("cart_quantities")

    if (savedCart) {
      let ids: string[] = JSON.parse(savedCart)
      ids = ids.filter((id) => id !== productId)
      localStorage.setItem("cart", JSON.stringify(ids))
    }

    if (savedQuantities) {
      const quantities: Record<string, number> = JSON.parse(savedQuantities)
      delete quantities[productId]
      localStorage.setItem("cart_quantities", JSON.stringify(quantities))
    }

    setItems((prev) => prev.filter((item) => item.id !== productId))
    window.dispatchEvent(new CustomEvent("cartUpdated"))
  }

  const totalPrice = items.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0)
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalSavings = items.reduce((sum, item) => {
    if (item.original_price && item.original_price > item.price) {
      return sum + (item.original_price - item.price) * item.quantity
    }
    return sum
  }, 0)

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark">
      <main className="flex-1 pb-40">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">Shopping Cart</h1>
              <span className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                {totalItems} {totalItems === 1 ? "item" : "items"}
              </span>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center px-4">
              <div className="h-32 w-32 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-6xl text-gray-400 dark:text-gray-600">
                  shopping_cart
                </span>
              </div>
              <h2 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-2">
                Your cart is empty
              </h2>
              <p className="text-text-secondary-light dark:text-text-secondary-dark mb-6">
                Add products to your cart to see them here
              </p>
              <Link
                href="/"
                className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <>
              <div className="p-4 space-y-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3 bg-white dark:bg-gray-900 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 p-3"
                  >
                    <Link
                      href={`/products/${item.category}/${item.id}/${item.slug || item.title?.toLowerCase().replace(/\s+/g, "-")}`}
                      className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800"
                    >
                      <Image
                        src={item.image_url || "/placeholder.svg?height=200&width=200"}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </Link>

                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <Link
                          href={`/products/${item.category}/${item.id}/${item.slug || item.title?.toLowerCase().replace(/\s+/g, "-")}`}
                        >
                          <p className="text-xs font-semibold text-primary line-clamp-1">{item.brand}</p>
                          <p className="text-sm font-medium text-gray-800 dark:text-gray-200 line-clamp-2">
                            {item.title}
                          </p>
                        </Link>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <div>
                          <span className="text-base font-bold text-gray-900 dark:text-white">
                            ₹{(item.price * item.quantity).toLocaleString()}
                          </span>
                          {item.original_price && item.original_price > item.price && (
                            <span className="ml-2 text-xs text-gray-400 line-through">
                              ₹{(item.original_price * item.quantity).toLocaleString()}
                            </span>
                          )}
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 disabled:opacity-50"
                          >
                            <span className="material-symbols-outlined text-lg">remove</span>
                          </button>
                          <span className="w-8 text-center font-medium text-gray-800 dark:text-gray-200">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                          >
                            <span className="material-symbols-outlined text-lg">add</span>
                          </button>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="w-8 h-8 flex items-center justify-center rounded-full ml-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                          >
                            <span className="material-symbols-outlined text-lg">delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Details */}
              <div className="mx-4 mt-4 p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-text-primary-light dark:text-text-primary-dark mb-3">
                  Price Details
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-text-secondary-light dark:text-text-secondary-dark">
                      Price ({totalItems} items)
                    </span>
                    <span className="text-text-primary-light dark:text-text-primary-dark">
                      ₹{(totalPrice + totalSavings).toLocaleString()}
                    </span>
                  </div>
                  {totalSavings > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-₹{totalSavings.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-text-secondary-light dark:text-text-secondary-dark">Delivery</span>
                    <span className="text-green-600">FREE</span>
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                    <div className="flex justify-between font-semibold text-base">
                      <span className="text-text-primary-light dark:text-text-primary-dark">Total Amount</span>
                      <span className="text-text-primary-light dark:text-text-primary-dark">
                        ₹{totalPrice.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  {totalSavings > 0 && (
                    <p className="text-green-600 text-xs mt-2">
                      You will save ₹{totalSavings.toLocaleString()} on this order
                    </p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      {/* Fixed Checkout Bar */}
      {items.length > 0 && (
        <div className="fixed bottom-14 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-4 shadow-lg z-40">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Total</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">₹{totalPrice.toLocaleString()}</p>
            </div>
            <button className="px-8 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors shadow-lg flex items-center gap-2">
              <span>Place Order</span>
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
