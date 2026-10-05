const CACHE_NAME = 'pizza-calc-v1';
const ASSETS_TO_CACHE = [
  './index.html',
  './manifest.json',
  // If you separate out external CSS/JS/images into local files, list them here.
  // Since index.html is self-contained with embedded Tailwind and Unsplash images, 
  // caching index.html and manifest.json is the primary requirement.
];

// Install Event: Cache core assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate Event: Clean up old caches if version changes
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event: Serve from cache first, fall back to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((response) => {
        return response;
      }).catch(() => {
        // Optional: Return a fallback offline page if both cache and network fail
      });
    })
  );
});