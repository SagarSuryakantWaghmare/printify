/// <reference lib="webworker" />

const CACHE_NAME = "printfy-v1"
const STATIC_ASSETS = [
  "/",
  "/app",
  "/manifest.json",
]

// Assets to cache on install
const PRECACHE_ASSETS = [
  "/bg-removal/onnxruntime-web/ort-wasm-simd-threaded.wasm",
  "/bg-removal/onnxruntime-web/ort-wasm-simd.wasm",
]

declare const self: ServiceWorkerGlobalScope

// Install event - cache static assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([...STATIC_ASSETS, ...PRECACHE_ASSETS])
    })
  )
  self.skipWaiting()
})

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      )
    })
  )
  self.clients.claim()
})

// Fetch event - serve from cache, fallback to network
self.addEventListener("fetch", (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== "GET") return

  // Skip external requests
  if (url.origin !== location.origin) return

  // Skip API requests
  if (url.pathname.startsWith("/api/")) return

  // Network-first for HTML pages
  if (request.headers.get("accept")?.includes("text/html")) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const responseClone = response.clone()
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone)
          })
          return response
        })
        .catch(() => caches.match(request).then((response) => response || caches.match("/")))
    )
    return
  }

  // Cache-first for static assets
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse
      }

      return fetch(request).then((response) => {
        // Don't cache non-successful responses
        if (!response || response.status !== 200 || response.type !== "basic") {
          return response
        }

        const responseClone = response.clone()
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, responseClone)
        })

        return response
      })
    })
  )
})

// Handle background sync for offline photo processing queue
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-photos") {
    event.waitUntil(syncPhotos())
  }
})

async function syncPhotos() {
  // Placeholder for background sync logic
  // This would sync any pending photos when back online
  console.log("Syncing photos...")
}

// Handle push notifications
self.addEventListener("push", (event) => {
  const data = event.data?.json() ?? {}
  const title = data.title || "PrintfY"
  const options = {
    body: data.body || "Your photo is ready!",
    icon: "/icons/icon-192x192.png",
    badge: "/icons/icon-72x72.png",
    vibrate: [100, 50, 100],
    data: {
      url: data.url || "/app",
    },
  }

  event.waitUntil(self.registration.showNotification(title, options))
})

// Handle notification clicks
self.addEventListener("notificationclick", (event) => {
  event.notification.close()
  const url = event.notification.data?.url || "/"

  event.waitUntil(
    self.clients.matchAll({ type: "window" }).then((clients) => {
      // Focus existing window if available
      for (const client of clients) {
        if (client.url === url && "focus" in client) {
          return client.focus()
        }
      }
      // Open new window
      if (self.clients.openWindow) {
        return self.clients.openWindow(url)
      }
    })
  )
})

export {}
