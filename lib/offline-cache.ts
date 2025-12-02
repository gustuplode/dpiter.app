// IndexedDB for storing product data offline
const DB_NAME = "dpiter-offline-db"
const DB_VERSION = 1
const PRODUCT_STORE = "products"
const CACHE_EXPIRATION = 15 * 24 * 60 * 60 * 1000 // 15 days

interface CachedProduct {
  id: string
  data: any
  timestamp: number
  images: string[]
}

export function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      if (!db.objectStoreNames.contains(PRODUCT_STORE)) {
        db.createObjectStore(PRODUCT_STORE, { keyPath: "id" })
      }
    }
  })
}

export async function cacheProduct(product: any): Promise<void> {
  try {
    const db = await openDB()
    const tx = db.transaction(PRODUCT_STORE, "readwrite")
    const store = tx.objectStore(PRODUCT_STORE)

    const cachedProduct: CachedProduct = {
      id: product.id,
      data: product,
      timestamp: Date.now(),
      images: [product.image_url, ...(product.images || [])].filter(Boolean),
    }

    store.put(cachedProduct)

    // Cache images via service worker
    if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: "CACHE_PRODUCT",
        product: cachedProduct,
      })
    }
  } catch (error) {
    console.error("Failed to cache product:", error)
  }
}

export async function getCachedProduct(id: string): Promise<any | null> {
  try {
    const db = await openDB()
    const tx = db.transaction(PRODUCT_STORE, "readonly")
    const store = tx.objectStore(PRODUCT_STORE)

    return new Promise((resolve) => {
      const request = store.get(id)
      request.onsuccess = () => {
        const cached = request.result as CachedProduct
        if (!cached) {
          resolve(null)
        } else if (Date.now() - cached.timestamp > CACHE_EXPIRATION) {
          // Expired, delete and return null
          deleteProduct(id)
          resolve(null)
        } else {
          resolve(cached.data)
        }
      }
      request.onerror = () => resolve(null)
    })
  } catch (error) {
    return null
  }
}

export async function deleteProduct(id: string): Promise<void> {
  try {
    const db = await openDB()
    const tx = db.transaction(PRODUCT_STORE, "readwrite")
    const store = tx.objectStore(PRODUCT_STORE)
    store.delete(id)
  } catch (error) {
    console.error("Failed to delete cached product:", error)
  }
}

export async function cleanExpiredCache(): Promise<void> {
  try {
    const db = await openDB()
    const tx = db.transaction(PRODUCT_STORE, "readwrite")
    const store = tx.objectStore(PRODUCT_STORE)

    const request = store.getAll()
    request.onsuccess = () => {
      const items = request.result as CachedProduct[]
      const now = Date.now()

      items.forEach((item) => {
        if (now - item.timestamp > CACHE_EXPIRATION) {
          store.delete(item.id)
        }
      })
    }
  } catch (error) {
    console.error("Failed to clean cache:", error)
  }
}

export function isOnline(): boolean {
  return navigator.onLine
}
