"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Heart, Trash2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { getProductUrl, getCollectionUrl } from "@/lib/utils"

type WishlistItem = {
  id: string
  title: string
  brand: string
  price?: number
  image_url: string
  type: "product" | "collection"
  category?: string
}

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadWishlist()

    const handleWishlistUpdate = () => {
      loadWishlist()
    }

    window.addEventListener("wishlistUpdated", handleWishlistUpdate)
    return () => window.removeEventListener("wishlistUpdated", handleWishlistUpdate)
  }, [])

  const loadWishlist = async () => {
    try {
      const supabase = createClient()

      // Load products
      const savedProducts = localStorage.getItem("wishlist")
      const productIds: string[] = savedProducts ? JSON.parse(savedProducts) : []

      // Load collections
      const savedCollections = localStorage.getItem("wishlist_collections")
      const collectionIds: string[] = savedCollections ? JSON.parse(savedCollections) : []

      const items: WishlistItem[] = []

      if (productIds.length > 0) {
        const { data: products } = await supabase
          .from("category_products")
          .select("id, title, brand, price, image_url, category")
          .in("id", productIds)

        if (products) {
          items.push(...products.map((p) => ({ ...p, type: "product" as const })))
        }
      }

      // Fetch collections
      if (collectionIds.length > 0) {
        const { data: collections } = await supabase
          .from("collections")
          .select("id, title, brand, image_url")
          .in("id", collectionIds)

        if (collections) {
          items.push(...collections.map((c) => ({ ...c, type: "collection" as const })))
        }
      }

      setWishlistItems(items)
    } catch (error) {
      console.error("Error loading wishlist:", error)
      setWishlistItems([])
    } finally {
      setLoading(false)
    }
  }

  const removeFromWishlist = (itemId: string, type: "product" | "collection") => {
    const key = type === "collection" ? "wishlist_collections" : "wishlist"
    const savedWishlist = localStorage.getItem(key)
    const ids: string[] = savedWishlist ? JSON.parse(savedWishlist) : []
    const updatedIds = ids.filter((id) => id !== itemId)
    localStorage.setItem(key, JSON.stringify(updatedIds))
    setWishlistItems(wishlistItems.filter((item) => !(item.id === itemId && item.type === type)))
    window.dispatchEvent(new CustomEvent("wishlistUpdated"))
  }

  const getItemUrl = (item: WishlistItem) => {
    if (item.type === "collection") {
      return getCollectionUrl(item.id, item.title)
    }
    return getProductUrl(item.id, item.title, item.category || "fashion")
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark">
      <main className="flex-1 px-4 md:px-6 lg:px-8 py-6 max-w-7xl mx-auto w-full pb-20">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-200 mb-6">My Wishlist</h2>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        ) : wishlistItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Heart className="h-16 w-16 text-slate-300 dark:text-slate-700 mb-4" />
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">Your Wishlist is Empty</h3>
            <p className="text-slate-600 dark:text-slate-400 mt-2 max-w-xs">
              Start adding items you love to your wishlist!
            </p>
            <Link
              href="/"
              className="mt-4 px-6 py-2 bg-primary text-white rounded-full font-medium hover:bg-primary/90 transition-colors"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-[5px] gap-y-4 pb-24">
            {wishlistItems.map((item) => (
              <div
                key={`${item.type}-${item.id}`}
                className="flex flex-col bg-white dark:bg-slate-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow relative group"
              >
                <button
                  onClick={() => removeFromWishlist(item.id, item.type)}
                  className="absolute top-2 right-2 z-10 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-full p-2 shadow-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  title="Remove from wishlist"
                >
                  <Trash2 className="h-4 w-4 text-red-600" />
                </button>
                <Link href={getItemUrl(item)} className="flex flex-col">
                  <div className="relative w-full overflow-hidden">
                    <div
                      className="w-full bg-center bg-no-repeat aspect-[3/4] bg-cover"
                      style={{ backgroundImage: `url('${item.image_url || "/placeholder.svg"}')` }}
                    />
                  </div>
                  <div className="flex flex-col p-3">
                    <p className="text-xs md:text-sm font-bold uppercase leading-normal tracking-wide text-slate-700 dark:text-slate-400">
                      {item.brand}
                    </p>
                    <p className="text-sm md:text-base font-normal leading-normal text-slate-600 dark:text-slate-300 line-clamp-2">
                      {item.title}
                    </p>
                    {item.price && (
                      <p className="text-sm md:text-base font-medium leading-normal text-slate-800 dark:text-slate-100 pt-1">
                        ₹{item.price.toFixed(2)}
                      </p>
                    )}
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {item.type === "collection" ? "Collection" : "Product"}
                    </p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
