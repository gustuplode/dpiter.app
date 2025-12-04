"use client"

import Link from "next/link"
import { useState, useEffect, useRef, useCallback, useMemo } from "react"
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
  image_aspect_ratio?: string
  image_width?: number
  image_height?: number
}

interface CategoryPageLayoutProps {
  title: string
  products: Product[]
  error?: any
}

class CategoryCache {
  private static instances: Map<string, CategoryCache> = new Map()
  products: Map<string, Product> = new Map()
  loadedIds: Set<string> = new Set()
  page = 1
  hasMore = true
  isLoading = false

  static getInstance(category: string): CategoryCache {
    if (!CategoryCache.instances.has(category)) {
      CategoryCache.instances.set(category, new CategoryCache())
    }
    return CategoryCache.instances.get(category)!
  }

  addProducts(products: Product[]) {
    products.forEach((p) => {
      if (!this.loadedIds.has(p.id)) {
        this.products.set(p.id, p)
        this.loadedIds.add(p.id)
      }
    })
  }

  getProducts(): Product[] {
    return Array.from(this.products.values())
  }
}

export function CategoryPageLayout({ title, products: initialProducts, error }: CategoryPageLayoutProps) {
  const category = title.toLowerCase()
  const cache = CategoryCache.getInstance(category)

  const [products, setProducts] = useState<Product[]>(() => {
    if (cache.products.size > 0) {
      return cache.getProducts()
    }
    cache.addProducts(initialProducts)
    return initialProducts
  })

  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(cache.hasMore)
  const loaderRef = useRef<HTMLDivElement>(null)
  const pageRef = useRef(cache.page)

  const loadMoreProducts = useCallback(async () => {
    if (cache.isLoading || !cache.hasMore) return

    cache.isLoading = true
    setLoading(true)

    try {
      const supabase = createClient()
      const from = pageRef.current * 6
      const to = from + 5

      const { data, error } = await supabase
        .from("category_products")
        .select("*")
        .eq("category", category)
        .eq("is_visible", true)
        .order("created_at", { ascending: false })
        .range(from, to)

      if (error) {
        console.error("Error loading more products:", error)
        return
      }

      if (data && data.length > 0) {
        const newProducts = data.filter((p) => !cache.loadedIds.has(p.id))

        if (newProducts.length > 0) {
          cache.addProducts(newProducts)
          setProducts(cache.getProducts())
        }

        pageRef.current += 1
        cache.page = pageRef.current

        if (data.length < 6) {
          cache.hasMore = false
          setHasMore(false)
        }
      } else {
        cache.hasMore = false
        setHasMore(false)
      }
    } catch (error) {
      console.error("Error:", error)
    } finally {
      cache.isLoading = false
      setLoading(false)
    }
  }, [category]) // Only category as dependency

  useEffect(() => {
    const currentLoader = loaderRef.current
    if (!currentLoader) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !cache.isLoading && cache.hasMore) {
          loadMoreProducts()
        }
      },
      { threshold: 0.1, rootMargin: "500px" },
    )

    observer.observe(currentLoader)
    return () => observer.disconnect()
  }, [loadMoreProducts])

  const productCards = useMemo(() => {
    return products.map((product) => {
      const width = product.image_width || 1080
      const height = product.image_height || 1080

      return (
        <div
          key={product.id}
          className="flex flex-col bg-white dark:bg-gray-800 overflow-hidden border-b border-r border-gray-200 dark:border-gray-700 h-full"
        >
          <Link href={getProductUrl(product.id, product.title, product.category)} className="block">
            <div
              className="relative w-full bg-center bg-no-repeat bg-cover"
              style={{
                backgroundImage: `url("${product.image_url || "/placeholder.svg"}")`,
                aspectRatio: `${width} / ${height}`,
              }}
            >
              <div className="absolute bottom-1.5 left-1.5 flex items-center bg-white/95 backdrop-blur-sm rounded px-1.5 py-0.5 shadow-sm">
                <span className="text-[10px] font-semibold text-gray-800">4.1</span>
              </div>
            </div>
          </Link>

          <div className="p-2 flex flex-col gap-1 bg-gray-50 dark:bg-gray-800 flex-1 min-h-[72px]">
            <p className="text-[10px] font-bold uppercase text-gray-600 dark:text-gray-400 tracking-wider">
              {product.brand || "Brand"}
            </p>
            <p className="text-gray-800 dark:text-gray-200 text-[11px] font-normal leading-snug line-clamp-1">
              {product.title}
            </p>

            <div className="flex items-center justify-between mt-auto">
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-extrabold bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500 bg-clip-text text-transparent">
                  <CurrencyDisplay price={product.price} />
                </p>
                {product.original_price && (
                  <p className="text-gray-400 dark:text-gray-500 text-[10px] line-through">
                    <CurrencyDisplay price={product.original_price} />
                  </p>
                )}
              </div>

              <div className="flex items-center gap-1">
                <WishlistButton
                  productId={product.id}
                  className="flex items-center justify-center h-7 w-7 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 hover:text-red-500 hover:bg-red-50 transition-all"
                />
                <RatingButton
                  itemId={product.id}
                  itemType="product"
                  className="flex items-center justify-center h-7 w-7 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 hover:text-yellow-500 hover:bg-yellow-50 transition-all"
                />
                <RatingButton
                  itemId={product.id}
                  itemType="product"
                  variant="like"
                  className="flex items-center justify-center h-7 w-7 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 hover:text-blue-500 hover:bg-blue-50 transition-all"
                />
              </div>
            </div>
          </div>
        </div>
      )
    })
  }, [products])

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden bg-background-light dark:bg-background-dark">
      <main className="flex-1 pb-4">
        <div className="flex flex-col">
          {products && products.length > 0 ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-0">{productCards}</div>

              <div ref={loaderRef} className="py-6 flex flex-col items-center justify-center gap-3">
                {loading && (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-[#883223] border-t-transparent rounded-full animate-spin" />
                    <span className="text-gray-500 text-sm">Loading...</span>
                  </div>
                )}
                {!hasMore && products.length > 0 && (
                  <p className="text-xs text-gray-400">
                    All {title.toLowerCase()} products loaded ({products.length})
                  </p>
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <p className="text-lg text-slate-600 dark:text-slate-400">
                {error
                  ? "Please run the database setup script in admin panel"
                  : `No ${title.toLowerCase()} products available yet`}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
