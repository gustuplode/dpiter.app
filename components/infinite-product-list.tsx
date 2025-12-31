"use client"

import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import Link from "next/link"
import { WishlistButton } from "@/components/wishlist-button"
import { RatingButton } from "@/components/rating-button"
import { getProductUrl } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import { CurrencyDisplay } from "@/components/currency-display" // Import CurrencyDisplay component
import type { JSX } from "react/jsx-runtime"

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
  products: Map<string, Product> = new Map()
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
    this.products.clear()
    this.page = 1
    this.hasMore = true
    this.initialized = false
    this.isLoading = false
    this.lastFetchTime = 0
  }

  addProducts(newProducts: Product[]) {
    newProducts.forEach((p) => {
      if (!this.products.has(p.id)) {
        this.products.set(p.id, p)
      }
    })
  }

  hasProduct(id: string): boolean {
    return this.products.has(id)
  }

  getProducts(): Product[] {
    return Array.from(this.products.values())
  }

  getProductCount(): number {
    return this.products.size
  }
}

const cache = ProductCache.getInstance()

function getAspectRatioStyle(product: Product): { paddingBottom: string } {
  // If we have width and height, calculate exact aspect ratio
  if (product.image_width && product.image_height && product.image_width > 0 && product.image_height > 0) {
    const ratio = (product.image_height / product.image_width) * 100
    return { paddingBottom: `${ratio}%` }
  }

  // If we have aspect ratio string, parse it
  if (product.image_aspect_ratio) {
    const ratioMap: Record<string, number> = {
      "1:1": 100,
      "4:5": 125,
      "3:4": 133.33,
      "2:3": 150,
      "9:16": 177.78,
      "16:9": 56.25,
      "4:3": 75,
      "3:2": 66.67,
    }
    const ratio = ratioMap[product.image_aspect_ratio]
    if (ratio) {
      return { paddingBottom: `${ratio}%` }
    }
  }

  // Default to 4:5 aspect ratio
  return { paddingBottom: "125%" }
}

function normalizeAspectRatio(product: Product): string {
  // If we have width and height, calculate aspect ratio
  if (product.image_width && product.image_height && product.image_width > 0 && product.image_height > 0) {
    const ratio = product.image_width / product.image_height

    // Group similar ratios together
    if (ratio >= 0.9 && ratio <= 1.1) return "1:1" // Square
    if (ratio >= 0.75 && ratio <= 0.85) return "4:5" // Portrait
    if (ratio >= 0.55 && ratio <= 0.65) return "9:16" // Story
    if (ratio >= 1.3 && ratio <= 1.4) return "4:3" // Standard
    if (ratio >= 1.7 && ratio <= 1.9) return "16:9" // Wide
    if (ratio < 0.7) return "9:16" // Very tall
    if (ratio > 1.5) return "16:9" // Very wide
    return "4:5" // Default
  }

  // Use the stored aspect ratio
  return product.image_aspect_ratio || "4:5"
}

export function InfiniteProductList({ initialProducts }: InfiniteProductListProps) {
  const [products, setProducts] = useState<Product[]>(() => {
    if (cache.initialized && cache.getProductCount() > 0) {
      return cache.getProducts()
    }
    cache.addProducts(initialProducts)
    cache.initialized = true
    return cache.getProducts()
  })

  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(cache.hasMore)
  const loaderRef = useRef<HTMLDivElement>(null)
  const pageRef = useRef(cache.page)

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

  useEffect(() => {
    if ("indexedDB" in window && products.length > 0) {
      saveProductsToIndexedDB(products)
    }
  }, [products])

  useEffect(() => {
    if (!navigator.onLine && products.length === 0) {
      loadProductsFromIndexedDB().then((cachedProducts) => {
        if (cachedProducts && cachedProducts.length > 0) {
          setProducts(cachedProducts)
        }
      })
    }
  }, [])

  const ITEMS_PER_PAGE = 8 // Increased from 6 for better loading
  const PRELOAD_THRESHOLD = "500px" // Reduced from 300px for earlier loading

  const loadMoreProducts = useCallback(async () => {
    const now = Date.now()
    if (cache.isLoading || !cache.hasMore || now - cache.lastFetchTime < 300) return

    cache.isLoading = true
    cache.lastFetchTime = now
    setLoading(true)

    try {
      const supabase = createClient()
      const currentCount = cache.getProductCount()
      const from = currentCount
      const to = from + ITEMS_PER_PAGE - 1 // Load 8 items at a time

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
        const newProducts = data.filter((p) => !cache.hasProduct(p.id))

        if (newProducts.length > 0) {
          cache.addProducts(newProducts)
          setProducts(cache.getProducts())

          newProducts.forEach((product) => {
            if (product.image_url) {
              const img = new Image()
              img.src = product.image_url
            }
          })
        }

        pageRef.current += 1
        cache.page = pageRef.current

        if (data.length < ITEMS_PER_PAGE) {
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
      {
        threshold: 0,
        rootMargin: PRELOAD_THRESHOLD, // Load earlier for smoother experience
      },
    )

    observer.observe(currentLoader)
    return () => observer.disconnect()
  }, [loadMoreProducts])

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

  const groupedProducts = useMemo(() => {
    const groups: { [key: string]: Product[] } = {}

    products.forEach((product) => {
      const aspectRatio = normalizeAspectRatio(product)
      if (!groups[aspectRatio]) {
        groups[aspectRatio] = []
      }
      groups[aspectRatio].push(product)
    })

    return groups
  }, [products])

  const renderProductGroups = useMemo(() => {
    const orderedRatios = ["9:16", "4:5", "1:1", "4:3", "16:9"]
    const sections: JSX.Element[] = []

    orderedRatios.forEach((ratio) => {
      const productsInGroup = groupedProducts[ratio] || []

      if (productsInGroup.length === 0) return

      const cards = productsInGroup.map((product) => {
        const aspectStyle = getAspectRatioStyle(product)

        return (
          <div
            key={product.id}
            className="flex flex-col bg-white dark:bg-gray-800 overflow-hidden border-b border-r border-gray-200 dark:border-gray-700"
            data-product-title={product.title}
            data-product-brand={product.brand}
            data-product-category={product.category}
            data-aspect-ratio={ratio}
          >
            <Link href={getProductUrl(product.id, product.title, product.category)} className="block">
              <div
                className="relative w-full bg-center bg-no-repeat bg-cover will-change-transform"
                style={{
                  ...aspectStyle,
                  backgroundImage: `url("${product.image_url || "/placeholder.svg"}")`,
                }}
              >
                <div className="absolute bottom-1.5 left-1.5 flex items-center bg-white/95 backdrop-blur-sm rounded px-1.5 py-0.5 shadow-sm">
                  <span className="text-[10px] font-semibold text-gray-800">4.1</span>
                </div>
              </div>
            </Link>

            <div className="p-2 flex flex-col bg-gray-50 dark:bg-gray-800 will-change-transform">
              <p className="text-[10px] font-bold uppercase text-gray-600 dark:text-gray-400 tracking-wider mb-0.5">
                {product.brand || "Brand"}
              </p>
              <p
                className="text-gray-800 dark:text-gray-200 text-[12px] leading-[1.3] font-normal line-clamp-2 min-h-[32px]"
                style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
              >
                {product.title}
              </p>

              <div className="flex items-center justify-between mt-1.5">
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

      sections.push(
        <div key={ratio} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-0 contain-layout">
          {cards}
        </div>,
      )
    })

    return sections
  }, [groupedProducts])

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
      {renderProductGroups}

      <div ref={loaderRef} className="py-6 flex flex-col items-center justify-center gap-3">
        {loading && (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 border-3 border-[#883223] border-t-transparent rounded-full animate-spin" />
            <span className="text-gray-500 text-sm font-medium">Loading more products...</span>
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
