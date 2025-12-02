"use client"

import type React from "react"
import { useEffect } from "react"

interface Product {
  id: string
  title: string
  price: number
  original_price?: number
  image_url: string
  images?: string[]
  brand?: string
  category?: string
  description?: string
  affiliate_link?: string
}

interface ProductCacheWrapperProps {
  product: Product
  relatedProducts?: Product[]
  children: React.ReactNode
}

export function ProductCacheWrapper({ product, relatedProducts = [], children }: ProductCacheWrapperProps) {
  useEffect(() => {
    if (!product) return

    // Cache product data to IndexedDB
    cacheProductToIndexedDB(product)

    // Cache related products
    relatedProducts.forEach((p) => cacheProductToIndexedDB(p))

    // Tell service worker to cache images
    if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
      const images = [product.image_url, ...(product.images || []), ...relatedProducts.map((p) => p.image_url)].filter(
        Boolean,
      )

      navigator.serviceWorker.controller.postMessage({
        type: "CACHE_IMAGES",
        images,
      })
    }
  }, [product, relatedProducts])

  return <>{children}</>
}

async function cacheProductToIndexedDB(product: Product) {
  if (!product || !product.id) return

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
      try {
        const tx = db.transaction(["products", "meta"], "readwrite")
        const store = tx.objectStore("products")
        const metaStore = tx.objectStore("meta")

        // Add/update product with timestamp
        store.put({
          ...product,
          cachedAt: Date.now(),
        })

        // Update last cache time
        metaStore.put({ key: "lastUpdate", timestamp: Date.now() })

        tx.oncomplete = () => resolve()
        tx.onerror = () => resolve()
      } catch (e) {
        resolve()
      }
    }

    request.onerror = () => resolve()
  })
}
