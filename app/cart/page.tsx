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
  image_url: string
  category: string
  slug: string
}

export default function CartPage() {
  const [products, setProducts] = useState<Product[]>([])
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
      if (!savedCart) {
        setProducts([])
        setLoading(false)
        return
      }

      const ids: string[] = JSON.parse(savedCart)
      if (ids.length === 0) {
        setProducts([])
        setLoading(false)
        return
      }

      const supabase = createClient()
      const { data, error } = await supabase.from("category_products").select("*").in("id", ids)

      if (error) throw error
      setProducts(data || [])
    } catch (error) {
      console.error("Error loading cart:", error)
    } finally {
      setLoading(false)
    }
  }

  const removeFromCart = (productId: string) => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      let ids: string[] = JSON.parse(savedCart)
      ids = ids.filter((id) => id !== productId)
      localStorage.setItem("cart", JSON.stringify(ids))
      loadCart()
      window.dispatchEvent(new CustomEvent("cartUpdated"))
    }
  }

  const totalPrice = products.reduce((sum, product) => sum + (product.price || 0), 0)

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark">
      <main className="flex-1 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-4">
            <h1 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">
              Shopping Cart ({products.length})
            </h1>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : products.length === 0 ? (
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
              <div className="p-4 space-y-4">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="flex gap-3 bg-white dark:bg-gray-900 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700"
                  >
                    <Link
                      href={`/products/${product.category}/${product.id}/${product.slug || product.title?.toLowerCase().replace(/\s+/g, "-")}`}
                      className="relative w-24 h-24 flex-shrink-0"
                    >
                      <Image
                        src={product.image_url || "/placeholder.svg?height=200&width=200"}
                        alt={product.title}
                        fill
                        className="object-cover"
                      />
                    </Link>

                    <div className="flex-1 py-2 pr-2 flex flex-col justify-between">
                      <div>
                        <Link
                          href={`/products/${product.category}/${product.id}/${product.slug || product.title?.toLowerCase().replace(/\s+/g, "-")}`}
                        >
                          <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 line-clamp-1">
                            {product.brand}
                          </p>
                          <p className="text-[11px] text-gray-600 dark:text-gray-400 line-clamp-1">{product.title}</p>
                        </Link>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-gray-900 dark:text-white">
                          ₹{product.price?.toLocaleString()}
                        </span>
                        <button
                          onClick={() => removeFromCart(product.id)}
                          className="text-red-500 hover:text-red-600 transition-colors"
                        >
                          <span className="material-symbols-outlined !text-lg">delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="sticky bottom-12 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-4">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Amount</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">₹{totalPrice.toLocaleString()}</p>
                  </div>
                  <button className="px-8 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-lg">
                    Checkout
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
