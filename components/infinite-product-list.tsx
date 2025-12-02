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

const productCache = new Map<string, { products: Product[]; page: number; hasMore: boolean; scrollY: number }>()

export function InfiniteProductList({ initialProducts }: InfiniteProductListProps) {
  const cacheKey = "home-products"
  const cached = productCache.get(cacheKey)

  const [products, setProducts] = useState<Product[]>(cached?.products || initialProducts)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(cached?.hasMore ?? true)
  const [page, setPage] = useState(cached?.page ?? 1)
  const loaderRef = useRef<HTMLDivElement>(null)
  const initialLoadDone = useRef(!!cached)

  useEffect(() => {
    if (cached?.scrollY && initialLoadDone.current) {
      setTimeout(() => {
        window.scrollTo(0, cached.scrollY)
      }, 100)
    }
  }, [])

  useEffect(() => {
    const saveCache = () => {
      productCache.set(cacheKey, {
        products,
        page,
        hasMore,
        scrollY: window.scrollY,
      })
    }

    window.addEventListener("beforeunload", saveCache)

    // Also save on route change
    const handleRouteChange = () => saveCache()
    window.addEventListener("popstate", handleRouteChange)

    return () => {
      saveCache()
      window.removeEventListener("beforeunload", saveCache)
      window.removeEventListener("popstate", handleRouteChange)
    }
  }, [products, page, hasMore])

  // Save to IndexedDB for offline access
  useEffect(() => {
    if ("indexedDB" in window && products.length > 0) {
      saveProductsToIndexedDB(products)
    }
  }, [products])

  // Load from IndexedDB if offline
  useEffect(() => {
    if (!navigator.onLine && products.length === 0) {
      loadProductsFromIndexedDB().then((cachedProducts) => {
        if (cachedProducts && cachedProducts.length > 0) {
          setProducts(cachedProducts)
        }
      })
    }
  }, [])

  const loadMoreProducts = useCallback(async () => {
    if (loading || !hasMore) return

    setLoading(true)
    try {
      const supabase = createClient()
      const from = page * 6
      const to = from + 5

      const { data, error } = await supabase
        .from("category_products")
        .select("*")
        .eq("is_visible", true)
        .order("created_at", { ascending: false })
        .range(from, to)

      if (error) {
        console.error("Error loading more products:", error)
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
    } finally {
      setLoading(false)
    }
  }, [loading, page, hasMore])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && hasMore) {
          loadMoreProducts()
        }
      },
      { threshold: 0.1, rootMargin: "500px" },
    )

    if (loaderRef.current) {
      observer.observe(loaderRef.current)
    }

    return () => observer.disconnect()
  }, [loadMoreProducts, loading, hasMore])

  // Dispatch keywords for SEO
  useEffect(() => {
    const keywords: string[] = []
    products.forEach((product) => {
      if (product.title) {
        const title = product.title.toLowerCase()
        keywords.push(title)
        keywords.push(`buy ${title}`)
        keywords.push(`${title} price`)
        keywords.push(`${title} online`)
        keywords.push(`${title} india`)
        keywords.push(`best ${title}`)
        keywords.push(`${title} 2025`)
        keywords.push(`${title} deals`)
        if (product.brand) {
          keywords.push(`${product.brand.toLowerCase()} ${title}`)
          keywords.push(product.brand.toLowerCase())
        }
        if (product.category) {
          keywords.push(`${product.category.toLowerCase()} ${title}`)
        }
      }
    })

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
        ))}
      </div>

      <div ref={loaderRef} className="py-6 flex flex-col items-center justify-center gap-3">
        {loading && (
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 border-2 border-[#883223] border-t-transparent rounded-full animate-spin" />
            <span className="text-gray-500 text-sm">Loading...</span>
          </div>
        )}
        {!hasMore && products.length > 0 && (
          <p className="text-xs text-gray-400">All products loaded ({products.length})</p>
        )}
      </div>
    </>
  )
}

async function saveProductsToIndexedDB(products: Product[]) {
  return new Promise<void>((resolve) => {
    const request = indexedDB.open("dpiter-products-db", 1)

    request.onupgradeneeded = (e: any) => {
      const db = e.target.result
      if (!db.objectStoreNames.contains("products")) {
        db.createObjectStore("products", { keyPath: "id" })
      }
      if (!db.objectStoreNames.contains("meta")) {
        db.createObjectStore("meta", { keyPath: "key" })
      }
    }

    request.onsuccess = (e: any) => {
      const db = e.target.result
      const tx = db.transaction(["products", "meta"], "readwrite")
      const productsStore = tx.objectStore("products")
      const metaStore = tx.objectStore("meta")

      productsStore.clear()
      products.forEach((product) => {
        productsStore.put(product)
      })

      metaStore.put({ key: "lastUpdate", timestamp: Date.now() })

      tx.oncomplete = () => resolve()
    }

    request.onerror = () => resolve()
  })
}

async function loadProductsFromIndexedDB(): Promise<Product[]> {
  return new Promise((resolve) => {
    const request = indexedDB.open("dpiter-products-db", 1)

    request.onsuccess = (e: any) => {
      const db = e.target.result
      if (!db.objectStoreNames.contains("products")) {
        resolve([])
        return
      }

      const tx = db.transaction("products", "readonly")
      const store = tx.objectStore("products")
      const getAllRequest = store.getAll()

      getAllRequest.onsuccess = () => {
        resolve(getAllRequest.result || [])
      }

      getAllRequest.onerror = () => resolve([])
    }

    request.onerror = () => resolve([])
  })
}
