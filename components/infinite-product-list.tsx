"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import { WishlistButton } from "@/components/wishlist-button"
import { RatingButton } from "@/components/rating-button"
import { AddToCartButton } from "@/components/add-to-cart-button"
import { getProductUrl } from "@/lib/utils"
import { CurrencyDisplay } from "@/components/currency-display"
import { createClient } from "@/lib/supabase/client"

interface Product {
  id: string
  title: string
  price: number
  original_price?: number
  image_url: string
  brand?: string
  category?: string
}

interface InfiniteProductListProps {
  initialProducts: Product[]
}

export function InfiniteProductList({ initialProducts }: InfiniteProductListProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const loaderRef = useRef<HTMLDivElement>(null)

  const loadMoreProducts = useCallback(async () => {
    if (loading || !hasMore) return

    setLoading(true)
    try {
      const supabase = createClient()
      const from = page * 6
      const to = from + 5 // Load 6 products at a time

      const { data, error } = await supabase
        .from("category_products")
        .select("*")
        .eq("is_visible", true)
        .order("created_at", { ascending: false })
        .range(from, to)

      if (error) {
        console.error("Error loading more products:", error)
        setHasMore(false)
        return
      }

      if (data && data.length > 0) {
        setProducts((prev) => [...prev, ...data])
        setPage((prev) => prev + 1)
        if (data.length < 6) {
          setHasMore(false)
        }
      } else {
        setHasMore(false)
      }
    } catch (error) {
      console.error("Error:", error)
      setHasMore(false)
    } finally {
      setLoading(false)
    }
  }, [loading, hasMore, page])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMoreProducts()
        }
      },
      { threshold: 0.1, rootMargin: "100px" },
    )

    if (loaderRef.current) {
      observer.observe(loaderRef.current)
    }

    return () => observer.disconnect()
  }, [loadMoreProducts, hasMore, loading])

  if (products.length === 0 && !loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">inventory_2</span>
        <p className="text-lg text-slate-600 dark:text-slate-400">No products available</p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:gap-4 xl:grid-cols-5">
        {products.map((product) => (
          <div
            key={product.id}
            className="flex flex-col bg-white dark:bg-gray-800 overflow-hidden border-t border-r border-[#8A3224] dark:border-[#8A3224] md:rounded-lg md:border hover:shadow-lg transition-shadow"
          >
            <Link href={getProductUrl(product.id, product.title, product.category)} className="block">
              <div
                className="relative w-full bg-center bg-no-repeat aspect-square bg-cover"
                style={{ backgroundImage: `url("${product.image_url || "/placeholder.svg"}")` }}
              >
                <div className="absolute bottom-1.5 left-1.5 flex items-center bg-white/95 backdrop-blur-sm rounded px-1.5 py-0.5 shadow-sm">
                  <span className="text-[10px] font-semibold text-gray-800">4.1</span>
                </div>
              </div>
            </Link>

            <div className="p-2 flex flex-col gap-1 bg-[#F7F7F7] dark:bg-gray-800">
              <p className="text-[10px] font-bold uppercase text-gray-600 dark:text-gray-400 tracking-wider">
                {product.brand || "Brand"}
              </p>
              <p className="text-gray-800 dark:text-gray-200 text-[11px] font-normal leading-snug line-clamp-1">
                {product.title}
              </p>

              <div className="flex items-center justify-between mt-1">
                <div className="flex items-center gap-1.5">
                  <p className="text-gray-900 dark:text-white text-sm font-bold">
                    <CurrencyDisplay price={product.price} />
                  </p>
                  {product.original_price && (
                    <p className="text-gray-400 dark:text-gray-500 text-[10px] line-through">
                      <CurrencyDisplay price={product.original_price} />
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-0.5">
                  <WishlistButton
                    productId={product.id}
                    className="flex items-center justify-center h-6 w-6 text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
                  />
                  <RatingButton
                    itemId={product.id}
                    itemType="product"
                    className="flex items-center justify-center h-6 w-6 text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
                  />
                  <AddToCartButton
                    productId={product.id}
                    className="flex items-center justify-center h-6 w-6 text-primary dark:text-primary-light hover:text-primary/80 transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Loader / End indicator */}
      <div ref={loaderRef} className="py-8 flex justify-center">
        {loading && (
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <span className="text-gray-500 dark:text-gray-400 text-sm">Loading more products...</span>
          </div>
        )}
        {!hasMore && products.length > 0 && (
          <p className="text-gray-400 dark:text-gray-500 text-sm">You&apos;ve seen all products</p>
        )}
      </div>
    </>
  )
}
