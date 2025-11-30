"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import { WishlistButton } from "@/components/wishlist-button"
import { RatingButton } from "@/components/rating-button"
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
  const [page, setPage] = useState(1)
  const [totalProducts, setTotalProducts] = useState(0)
  const loaderRef = useRef<HTMLDivElement>(null)

  const loadMoreProducts = useCallback(async () => {
    if (loading) return

    setLoading(true)
    try {
      const supabase = createClient()
      const from = page * 6
      const to = from + 5

      const { data, error, count } = await supabase
        .from("category_products")
        .select("*", { count: "exact" })
        .eq("is_visible", true)
        .order("created_at", { ascending: false })
        .range(from, to)

      if (error) {
        console.error("Error loading more products:", error)
        return
      }

      if (count) setTotalProducts(count)

      if (data && data.length > 0) {
        setProducts((prev) => [...prev, ...data])
        setPage((prev) => prev + 1)
      }
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setLoading(false)
    }
  }, [loading, page])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          loadMoreProducts()
        }
      },
      { threshold: 0.1, rootMargin: "300px" },
    )

    if (loaderRef.current) {
      observer.observe(loaderRef.current)
    }

    return () => observer.disconnect()
  }, [loadMoreProducts, loading])

  useEffect(() => {
    const keywords: string[] = []
    products.forEach((product) => {
      if (product.title) {
        const title = product.title.toLowerCase()
        keywords.push(title)
        keywords.push(`buy ${title}`)
        keywords.push(`${title} price`)
        keywords.push(`${title} online`)
        keywords.push(`best ${title}`)
        keywords.push(`${title} india`)
        keywords.push(`${title} 2025`)
        if (product.brand) {
          keywords.push(`${product.brand.toLowerCase()} ${title}`)
        }
      }
    })

    // Dispatch custom event for SEO block to pick up
    window.dispatchEvent(
      new CustomEvent("productKeywordsUpdated", {
        detail: [...new Set(keywords)],
      }),
    )
  }, [products])

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
            className="flex flex-col bg-white dark:bg-gray-800 overflow-hidden border-t border-r border-gray-200 dark:border-gray-700 md:rounded-lg md:border hover:shadow-lg transition-shadow"
            data-product-title={product.title}
            data-product-brand={product.brand}
            data-product-category={product.category}
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

            <div className="p-2 flex flex-col gap-1 bg-gray-50 dark:bg-gray-800">
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
                    className="flex items-center justify-center h-6 w-6 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-all"
                  />
                  <RatingButton
                    itemId={product.id}
                    itemType="product"
                    className="flex items-center justify-center h-6 w-6 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/30 transition-all"
                  />
                  <RatingButton
                    itemId={product.id}
                    itemType="product"
                    variant="like"
                    className="flex items-center justify-center h-6 w-6 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div ref={loaderRef} className="py-8 flex flex-col items-center justify-center gap-2">
        {loading && (
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 border-2 border-[#883223] border-t-transparent rounded-full animate-spin" />
            <span className="text-gray-500 dark:text-gray-400 text-sm">Loading more products...</span>
          </div>
        )}
        {!loading && products.length < totalProducts && (
          <button
            onClick={loadMoreProducts}
            className="px-6 py-2 bg-[#883223] text-white rounded-full text-sm font-medium hover:bg-[#6d2719] transition-colors"
          >
            Load More Products
          </button>
        )}
        {totalProducts > 0 && (
          <p className="text-xs text-gray-400">
            Showing {products.length} of {totalProducts} products
          </p>
        )}
      </div>
    </>
  )
}
