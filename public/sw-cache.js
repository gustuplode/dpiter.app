// DPITER.shop Service Worker - Offline Product Caching
const CACHE_NAME = "dpiter-cache-v1"
const PRODUCT_CACHE = "dpiter-products-v1"
const IMAGE_CACHE = "dpiter-images-v1"
const STATIC_CACHE = "dpiter-static-v1"

// Cache expiration - 15 days
const CACHE_EXPIRATION = 15 * 24 * 60 * 60 * 1000

// Static assets to cache on install
const STATIC_ASSETS = ["/", "/offline.html", "/manifest.json", "/favicon.ico"]

// Install event - cache static assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(STATIC_ASSETS)
    }),
  )
  self.skipWaiting()
})

// Activate event - clean old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (![CACHE_NAME, PRODUCT_CACHE, IMAGE_CACHE, STATIC_CACHE].includes(cacheName)) {
            return caches.delete(cacheName)
          }
        }),
      )
    }),
  )
  self.clients.claim()
})

// Fetch event - serve from cache when offline
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url)

  // Skip non-GET requests
  if (event.request.method !== "GET") return

  // Skip external requests (except images)
  if (!url.origin.includes(self.location.origin) && !isImageRequest(event.request)) {
    return
  }

  // Handle product pages
  if (url.pathname.startsWith("/products/")) {
    event.respondWith(handleProductRequest(event.request))
    return
  }

  // Handle image requests
  if (isImageRequest(event.request)) {
    event.respondWith(handleImageRequest(event.request))
    return
  }

  // Handle API requests - network first, then cache
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(handleApiRequest(event.request))
    return
  }

  // Handle other requests - stale while revalidate
  event.respondWith(handleGeneralRequest(event.request))
})

function isImageRequest(request) {
  const url = request.url.toLowerCase()
  return (
    url.includes(".jpg") ||
    url.includes(".jpeg") ||
    url.includes(".png") ||
    url.includes(".gif") ||
    url.includes(".webp") ||
    url.includes(".svg") ||
    url.includes("blob.vercel-storage.com") ||
    url.includes("placeholder.svg")
  )
}

async function handleProductRequest(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request)

    // Clone and cache the response
    const cache = await caches.open(PRODUCT_CACHE)
    cache.put(request, networkResponse.clone())

    // Store timestamp for expiration
    storeTimestamp(request.url)

    return networkResponse
  } catch (error) {
    // Network failed, try cache
    const cachedResponse = await caches.match(request)

    if (cachedResponse && !isExpired(request.url)) {
      // Notify client about offline mode
      notifyClientsOffline()
      return cachedResponse
    }

    // No cache, return offline page
    return caches.match("/offline.html")
  }
}

async function handleImageRequest(request) {
  const cache = await caches.open(IMAGE_CACHE)

  // Try cache first for images
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

  // Not in cache, fetch from network
  try {
    const networkResponse = await fetch(request)
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone())
    }
    return networkResponse
  } catch (error) {
    // Return placeholder for failed images
    return new Response("", { status: 404 })
  }
}

async function handleApiRequest(request) {
  try {
    const networkResponse = await fetch(request)

    // Cache successful API responses
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME)
      cache.put(request, networkResponse.clone())
    }

    return networkResponse
  } catch (error) {
    // Network failed, try cache
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }

    return new Response(JSON.stringify({ error: "Offline" }), {
      status: 503,
      headers: { "Content-Type": "application/json" },
    })
  }
}

async function handleGeneralRequest(request) {
  const cache = await caches.open(CACHE_NAME)
  const cachedResponse = await cache.match(request)

  // Return cached response and revalidate in background
  if (cachedResponse) {
    fetch(request)
      .then((response) => {
        if (response.ok) {
          cache.put(request, response.clone())
        }
      })
      .catch(() => {})
    return cachedResponse
  }

  // No cache, fetch from network
  try {
    const networkResponse = await fetch(request)
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone())
    }
    return networkResponse
  } catch (error) {
    return caches.match("/offline.html")
  }
}

// IndexedDB for timestamps
function storeTimestamp(url) {
  const request = indexedDB.open("dpiter-timestamps", 1)
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
    const request = indexedDB.open("dpiter-timestamps", 1)
    request.onsuccess = (e) => {
      const db = e.target.result
      if (!db.objectStoreNames.contains("timestamps")) {
        resolve(true)
        return
      }
      const tx = db.transaction("timestamps", "readonly")
      const store = tx.objectStore("timestamps")
      const getRequest = store.get(url)
      getRequest.onsuccess = () => {
        const data = getRequest.result
        if (!data) {
          resolve(true)
        } else {
          resolve(Date.now() - data.timestamp > CACHE_EXPIRATION)
        }
      }
      getRequest.onerror = () => resolve(true)
    }
    request.onerror = () => resolve(true)
  })
}

function notifyClientsOffline() {
  self.clients.matchAll().then((clients) => {
    clients.forEach((client) => {
      client.postMessage({ type: "OFFLINE_MODE" })
    })
  })
}

// Clean expired caches periodically
async function cleanExpiredCaches() {
  const request = indexedDB.open("dpiter-timestamps", 1)
  request.onsuccess = async (e) => {
    const db = e.target.result
    if (!db.objectStoreNames.contains("timestamps")) return

    const tx = db.transaction("timestamps", "readwrite")
    const store = tx.objectStore("timestamps")
    const getAllRequest = store.getAll()

    getAllRequest.onsuccess = async () => {
      const items = getAllRequest.result
      const now = Date.now()
      const cache = await caches.open(PRODUCT_CACHE)

      for (const item of items) {
        if (now - item.timestamp > CACHE_EXPIRATION) {
          cache.delete(item.url)
          store.delete(item.url)
        }
      }
    }
  }
}

// Run cleanup every hour
setInterval(cleanExpiredCaches, 60 * 60 * 1000)

// Message handler for manual cache operations
self.addEventListener("message", (event) => {
  if (event.data.type === "CACHE_PRODUCT") {
    cacheProductData(event.data.product)
  } else if (event.data.type === "CLEAN_CACHE") {
    cleanExpiredCaches()
  }
})

async function cacheProductData(product) {
  if (!product) return

  // Cache product images
  const imageCache = await caches.open(IMAGE_CACHE)

  if (product.image_url) {
    try {
      const response = await fetch(product.image_url)
      if (response.ok) {
        imageCache.put(product.image_url, response)
      }
    } catch (e) {}
  }

  if (product.images && Array.isArray(product.images)) {
    for (const img of product.images) {
      try {
        const response = await fetch(img)
        if (response.ok) {
          imageCache.put(img, response)
        }
      } catch (e) {}
    }
  }
}
