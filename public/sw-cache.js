// DPITER.shop Advanced Service Worker - Complete Offline Support
const CACHE_VERSION = "v2"
const CACHE_NAME = `dpiter-cache-${CACHE_VERSION}`
const PRODUCT_CACHE = `dpiter-products-${CACHE_VERSION}`
const IMAGE_CACHE = `dpiter-images-${CACHE_VERSION}`
const API_CACHE = `dpiter-api-${CACHE_VERSION}`

// Cache expiration - 15 days
const CACHE_EXPIRATION = 15 * 24 * 60 * 60 * 1000

// Static assets to pre-cache
const STATIC_ASSETS = ["/", "/offline.html", "/manifest.json", "/favicon.ico"]

// Install - pre-cache static assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS)
    }),
  )
  self.skipWaiting()
})

// Activate - clean old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheName.includes(CACHE_VERSION)) {
            return caches.delete(cacheName)
          }
        }),
      )
    }),
  )
  self.clients.claim()
})

// Fetch handler
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url)

  // Skip non-GET requests
  if (event.request.method !== "GET") return

  // Handle product pages - network first, cache fallback
  if (url.pathname.startsWith("/products/")) {
    event.respondWith(networkFirstWithCache(event.request, PRODUCT_CACHE))
    return
  }

  // Handle images - cache first, network fallback
  if (isImageRequest(event.request)) {
    event.respondWith(cacheFirstWithNetwork(event.request, IMAGE_CACHE))
    return
  }

  // Handle API requests - network first with cache
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(networkFirstWithCache(event.request, API_CACHE))
    return
  }

  // Handle page navigations - network first
  if (event.request.mode === "navigate") {
    event.respondWith(networkFirstWithOffline(event.request))
    return
  }

  // Other requests - stale while revalidate
  event.respondWith(staleWhileRevalidate(event.request, CACHE_NAME))
})

function isImageRequest(request) {
  const url = request.url.toLowerCase()
  return (
    url.match(/\.(jpg|jpeg|png|gif|webp|svg|ico)(\?.*)?$/) ||
    url.includes("blob.vercel-storage.com") ||
    url.includes("placeholder.svg")
  )
}

// Network first, cache as fallback
async function networkFirstWithCache(request, cacheName) {
  try {
    const networkResponse = await fetch(request)
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName)
      cache.put(request, networkResponse.clone())
      storeTimestamp(request.url)
    }
    return networkResponse
  } catch (error) {
    const cachedResponse = await caches.match(request)
    if (cachedResponse && !(await isExpired(request.url))) {
      notifyOffline()
      return cachedResponse
    }
    return caches.match("/offline.html")
  }
}

// Cache first, network as fallback
async function cacheFirstWithNetwork(request, cacheName) {
  const cache = await caches.open(cacheName)
  const cachedResponse = await cache.match(request)

  if (cachedResponse) {
    // Revalidate in background
    fetch(request)
      .then((response) => {
        if (response.ok) {
          cache.put(request, response.clone())
        }
      })
      .catch(() => {})
    return cachedResponse
  }

  try {
    const networkResponse = await fetch(request)
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone())
    }
    return networkResponse
  } catch (error) {
    return new Response("", { status: 404 })
  }
}

// Network first with offline fallback
async function networkFirstWithOffline(request) {
  try {
    const networkResponse = await fetch(request)
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME)
      cache.put(request, networkResponse.clone())
    }
    return networkResponse
  } catch (error) {
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      notifyOffline()
      return cachedResponse
    }
    return caches.match("/offline.html")
  }
}

// Stale while revalidate
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName)
  const cachedResponse = await cache.match(request)

  const fetchPromise = fetch(request)
    .then((response) => {
      if (response.ok) {
        cache.put(request, response.clone())
      }
      return response
    })
    .catch(() => cachedResponse)

  return cachedResponse || fetchPromise
}

// IndexedDB for timestamps
function storeTimestamp(url) {
  const request = indexedDB.open("dpiter-sw-timestamps", 1)
  request.onupgradeneeded = (e) => {
    const db = e.target.result
    if (!db.objectStoreNames.contains("timestamps")) {
      db.createObjectStore("timestamps", { keyPath: "url" })
    }
  }
  request.onsuccess = (e) => {
    const db = e.target.result
    const tx = db.transaction("timestamps", "readwrite")
    const store = tx.objectStore("timestamps")
    store.put({ url, timestamp: Date.now() })
  }
}

function isExpired(url) {
  return new Promise((resolve) => {
    const request = indexedDB.open("dpiter-sw-timestamps", 1)
    request.onsuccess = (e) => {
      const db = e.target.result
      if (!db.objectStoreNames.contains("timestamps")) {
        resolve(false)
        return
      }
      const tx = db.transaction("timestamps", "readonly")
      const store = tx.objectStore("timestamps")
      const getRequest = store.get(url)
      getRequest.onsuccess = () => {
        const data = getRequest.result
        if (!data) {
          resolve(false)
        } else {
          resolve(Date.now() - data.timestamp > CACHE_EXPIRATION)
        }
      }
      getRequest.onerror = () => resolve(false)
    }
    request.onerror = () => resolve(false)
  })
}

// Notify clients about offline mode
function notifyOffline() {
  self.clients.matchAll().then((clients) => {
    clients.forEach((client) => {
      client.postMessage({ type: "OFFLINE_MODE" })
    })
  })
}

// Clean expired caches
async function cleanExpiredCaches() {
  const request = indexedDB.open("dpiter-sw-timestamps", 1)
  request.onsuccess = async (e) => {
    const db = e.target.result
    if (!db.objectStoreNames.contains("timestamps")) return

    const tx = db.transaction("timestamps", "readwrite")
    const store = tx.objectStore("timestamps")
    const getAllRequest = store.getAll()

    getAllRequest.onsuccess = async () => {
      const items = getAllRequest.result
      const now = Date.now()

      for (const item of items) {
        if (now - item.timestamp > CACHE_EXPIRATION) {
          // Delete from all caches
          const cacheNames = await caches.keys()
          for (const cacheName of cacheNames) {
            const cache = await caches.open(cacheName)
            await cache.delete(item.url)
          }
          store.delete(item.url)
        }
      }
    }
  }
}

// Run cleanup on startup and every hour
cleanExpiredCaches()
setInterval(cleanExpiredCaches, 60 * 60 * 1000)

// Handle messages from main thread
self.addEventListener("message", (event) => {
  if (event.data.type === "CACHE_PRODUCT") {
    cacheProductData(event.data.product)
  } else if (event.data.type === "CLEAN_CACHE") {
    cleanExpiredCaches()
  } else if (event.data.type === "CACHE_IMAGES") {
    cacheImages(event.data.images)
  }
})

// Cache product data and images
async function cacheProductData(product) {
  if (!product) return

  const imageCache = await caches.open(IMAGE_CACHE)
  const urls = []

  if (product.image_url) urls.push(product.image_url)
  if (product.images && Array.isArray(product.images)) {
    urls.push(...product.images)
  }

  for (const url of urls) {
    try {
      const response = await fetch(url)
      if (response.ok) {
        await imageCache.put(url, response)
      }
    } catch (e) {}
  }
}

async function cacheImages(images) {
  if (!images || !Array.isArray(images)) return

  const imageCache = await caches.open(IMAGE_CACHE)

  for (const url of images) {
    try {
      const response = await fetch(url)
      if (response.ok) {
        await imageCache.put(url, response)
      }
    } catch (e) {}
  }
}
