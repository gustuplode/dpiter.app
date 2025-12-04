"use client"

import { useState, useEffect, useRef, useCallback, useMemo } from "react"
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
  image_aspect_ratio?: string
  image_width?: number
  image_height?: number
}

interface InfiniteProductListProps {
  initialProducts: Product[]
}

class ProductCache {
  private static instance: ProductCache
  products: Product[] = []
  loadedIds: Set<string> = new Set()
  page = 1
  hasMore = true
  initialized = false
  isLoading = false
  lastFetchTime = 0

  static getInstance(): ProductCache {
    if (!ProductCache.instance) {
      ProductCache.instance = new ProductCache()
    }
    return ProductCache.instance
  }

  reset() {
    this.products = []
    this.loadedIds.clear()
    this.page = 1
    this.hasMore = true
    this.initialized = false
    this.isLoading = false
    this.lastFetchTime = 0
  }

  addProducts(newProducts: Product[]) {
    newProducts.forEach((p) => {
      if (!this.loadedIds.has(p.id)) {
        this.loadedIds.add(p.id)
        this.products.push(p)
      }
    })
  }

  getProducts(): Product[] {
    return this.products
  }
}

const cache = ProductCache.getInstance()

export function InfiniteProductList({ initialProducts }: InfiniteProductListProps) {
  const [products, setProducts] = useState<Product[]>(() => {
    if (cache.initialized && cache.products.length > 0) {
      return cache.getProducts()
    }
    // First time - add initial products to cache
    cache.addProducts(initialProducts)
    cache.initialized = true
    return cache.getProducts()
  })

  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(cache.hasMore)
  const loaderRef = useRef<HTMLDivElement>(null)
  const pageRef = useRef(cache.page)

  // Handle product update events
  useEffect(() => {
    const handleProductUpdate = () => {
      cache.reset()
      pageRef.current = 1
      setHasMore(true)

      const supabase = createClient()
      supabase
        .from("category_products")
        .select("*")
        .eq("is_visible", true)
        .order("created_at", { ascending: false })
        .range(0, 5)
        .then(({ data }) => {
          if (data) {
            cache.addProducts(data)
            cache.initialized = true
            setProducts(cache.getProducts())
          }
        })
    }

    window.addEventListener("productUpdated", handleProductUpdate)
    return () => window.removeEventListener("productUpdated", handleProductUpdate)
  }, [])

  // Save to IndexedDB for offline
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
    // Prevent concurrent loads and rapid successive calls
    const now = Date.now()
    if (cache.isLoading || !cache.hasMore || now - cache.lastFetchTime < 500) return

    cache.isLoading = true
    cache.lastFetchTime = now
    setLoading(true)

    try {
      const supabase = createClient()
      const from = pageRef.current * 6
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
        // Filter out already loaded products strictly
        const newProducts = data.filter((p) => !cache.loadedIds.has(p.id))

        if (newProducts.length > 0) {
          cache.addProducts(newProducts)
          setProducts([...cache.getProducts()]) // Create new array reference
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
  }, [])

  useEffect(() => {
    const currentLoader = loaderRef.current
    if (!currentLoader) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !cache.isLoading && cache.hasMore) {
          loadMoreProducts()
        }
      },
      { threshold: 0.1, rootMargin: "300px" },
    )

    observer.observe(currentLoader)
    return () => observer.disconnect()
  }, [loadMoreProducts])

  // SEO keywords
  useEffect(() => {
    const keywords: string[] = []
    products.forEach((product) => {
      if (product.title) {
        const title = product.title.toLowerCase()
        keywords.push(title, `buy ${title}`, `${title} price`, `${title} online`)
        if (product.brand) keywords.push(product.brand.toLowerCase())
      }
    })

    window.dispatchEvent(
      new CustomEvent("productKeywordsUpdated", {
        detail: [...new Set(keywords)],
      }),
    )
  }, [products])

  const productCards = useMemo(() => {
    return products.map((product) => {
      const width = product.image_width || 1080
      const height = product.image_height || 1080

      return (
        <div
          key={product.id}
          className="break-inside-avoid flex flex-col bg-white dark:bg-gray-800 overflow-hidden border-b border-r border-gray-200 dark:border-gray-700"
          data-product-title={product.title}
          data-product-brand={product.brand}
          data-product-category={product.category}
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

          <div className="p-2 flex flex-col gap-1 bg-gray-50 dark:bg-gray-800">
            <p className="text-[10px] font-bold uppercase text-gray-600 dark:text-gray-400 tracking-wider">
              {product.brand || "Brand"}
            </p>
            <p className="text-gray-800 dark:text-gray-200 text-[11px] font-normal leading-snug line-clamp-1">
              {product.title}
            </p>

            <div className="flex items-center justify-between mt-1">
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
      <div className="columns-2 md:columns-4 xl:columns-5 gap-0">{productCards}</div>

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
