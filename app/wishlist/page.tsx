"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Heart, Trash2 } from "lucide-react"
import { BottomNav } from "@/components/bottom-nav"
import { createClient } from "@/lib/supabase/client"

type WishlistProduct = {
  id: string
  title: string
  brand: string
  price: number
  image_url: string
}

export default function WishlistPage() {
  const [wishlistProducts, setWishlistProducts] = useState<WishlistProduct[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    loadWishlist()
  }, [])

  const loadWishlist = async () => {
    try {
      const savedWishlist = localStorage.getItem("wishlist")
      if (!savedWishlist) {
        setWishlistProducts([])
        setLoading(false)
        return
      }

      const productIds: string[] = JSON.parse(savedWishlist)

      if (productIds.length === 0) {
        setWishlistProducts([])
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from("products")
        .select("id, title, brand, price, image_url")
        .in("id", productIds)

      if (error) {
        setWishlistProducts([])
      } else {
        setWishlistProducts(data || [])
      }
    } catch (error) {
      setWishlistProducts([])
    } finally {
      setLoading(false)
    }
  }

  const removeFromWishlist = (productId: string) => {
    const savedWishlist = localStorage.getItem("wishlist")
    const productIds: string[] = savedWishlist ? JSON.parse(savedWishlist) : []
    const updatedIds = productIds.filter((id) => id !== productId)
    localStorage.setItem("wishlist", JSON.stringify(updatedIds))
    setWishlistProducts(wishlistProducts.filter((p) => p.id !== productId))
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-[#f8f6f5] dark:bg-[#23150f]">
      <main className="flex-1 px-4 md:px-6 lg:px-8 py-6 max-w-7xl mx-auto w-full">
        <h2 className="text-2xl md:text-3xl font-bold text-[#23150f] dark:text-[#f8f6f5] mb-6">My Wishlist</h2>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        ) : wishlistProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Heart className="h-16 w-16 text-slate-300 dark:text-slate-700 mb-4" />
            <h3 className="text-xl font-bold text-[#23150f] dark:text-[#f8f6f5]">Your Wishlist is Empty</h3>
            <p className="text-slate-600 dark:text-slate-400 mt-2 max-w-xs">
              Start adding items you love to your wishlist!
            </p>
            <Link
              href="/"
              className="mt-4 px-6 py-2 bg-primary text-white rounded-full font-medium hover:bg-primary/90 transition-colors"
            >
              Browse Collections
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 pb-24">
            {wishlistProducts.map((product) => (
              <div
                key={product.id}
                className="flex flex-col bg-white dark:bg-[#2a2a2e] rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow relative group"
              >
                <button
                  onClick={() => removeFromWishlist(product.id)}
                  className="absolute top-2 right-2 z-10 bg-white/90 dark:bg-[#2a2a2e]/90 backdrop-blur-sm rounded-full p-2 shadow-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  title="Remove from wishlist"
                >
                  <Trash2 className="h-4 w-4 text-red-600" />
                </button>
                <Link href={`/collections/${product.id}`} className="flex flex-col">
                  <div className="relative w-full overflow-hidden">
                    <div
                      className="w-full bg-center bg-no-repeat aspect-[3/4] bg-cover"
                      style={{ backgroundImage: `url('${product.image_url}')` }}
                    />
                  </div>
                  <div className="flex flex-col p-3">
                    <p className="text-xs md:text-sm font-bold uppercase leading-normal tracking-wide text-slate-700 dark:text-slate-400">
                      {product.brand}
                    </p>
                    <p className="text-sm md:text-base font-normal leading-normal text-slate-600 dark:text-slate-300 line-clamp-2">
                      {product.title}
                    </p>
                    <p className="text-sm md:text-base font-medium leading-normal text-[#23150f] dark:text-[#f8f6f5] pt-1">
                      ${product.price.toFixed(2)}
                    </p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  )
}
