"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { WishlistButton } from "@/components/wishlist-button"
import { RatingButton } from "@/components/rating-button"
import { RatingDisplay } from "@/components/rating-display"
import { LikeButton } from "@/components/like-button"
import { getProductUrl } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import { Loader2 } from "lucide-react"

interface Product {
  id: string
  title: string
  brand: string
  price: number
  category: string
  image_url: string
  [key: string]: any
}

export function InfiniteProductsClient({ initialProducts }: { initialProducts: Product[] }) {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(initialProducts.length === 10)
  const [page, setPage] = useState(1)
  const observerTarget = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMore()
        }
      },
      { threshold: 0.1 },
    )

    if (observerTarget.current) {
      observer.observe(observerTarget.current)
    }

    return () => observer.disconnect()
  }, [hasMore, loading, page])

  const loadMore = async () => {
    setLoading(true)
    console.log("[v0] Loading more products, page:", page)
    try {
      const supabase = createClient()
      const start = page * 10
      const end = start + 9

      const { data, error } = await supabase
        .from("category_products")
        .select("*")
        .order("created_at", { ascending: false })
        .range(start, end)

      console.log("[v0] Loaded products:", data?.length || 0, "Error:", error)

      if (error) throw error

      if (data && data.length > 0) {
        setProducts((prev) => [...prev, ...data])
        setPage((prev) => prev + 1)
        setHasMore(data.length === 10)
      } else {
        setHasMore(false)
      }
    } catch (error) {
      console.error("[v0] Load more error:", error)
      setHasMore(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-x-1 md:gap-x-2 gap-y-2 md:gap-y-3">
        {products.map((product) => (
          <div key={product.id} className="group">
            <Link href={getProductUrl(product.id, product.title, product.category)} className="block">
              <div className="relative overflow-hidden rounded-md bg-white dark:bg-slate-800 shadow-sm aspect-[3/4]">
                <img
                  src={product.image_url || "/placeholder.svg"}
                  alt={product.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute top-1.5 right-1.5 flex flex-col gap-0.5">
                  <RatingButton itemId={product.id} itemType="category_product" />
                  <WishlistButton
                    productId={product.id}
                    type="product"
                    className="h-6 w-6 flex items-center justify-center rounded-full bg-white/90 dark:bg-slate-700/90 backdrop-blur-sm hover:scale-110 transition-transform"
                  />
                  <LikeButton itemId={product.id} itemType="category_product" />
                </div>
                <div className="absolute bottom-1.5 right-1.5">
                  <RatingDisplay itemId={product.id} itemType="category_product" />
                </div>
                <div className="absolute top-1.5 left-1.5">
                  <span className="inline-flex items-center rounded-md bg-blue-500/90 px-1.5 py-0.5 text-[9px] font-medium text-white capitalize">
                    {product.category}
                  </span>
                </div>
              </div>
              <div className="pt-1.5 px-0.5">
                <h3 className="text-xs font-semibold text-slate-900 dark:text-white truncate">{product.brand}</h3>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{product.title}</p>
                <p className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">₹{product.price}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Infinite scroll trigger */}
      <div ref={observerTarget} className="py-8 flex justify-center">
        {loading && (
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Loading more products...</span>
          </div>
        )}
        {!hasMore && products.length > 0 && (
          <p className="text-slate-500 dark:text-slate-400 text-sm">You've reached the end!</p>
        )}
      </div>
    </>
  )
}
