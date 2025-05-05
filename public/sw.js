
// Service Worker für Rush Fitness App
const CACHE_NAME = 'rush-fitness-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// Service Worker Installation
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch-Ereignis für Netzwerkanfragen
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (event.request.url.startsWith(self.location.origin)) {
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          // Cache hit - return response
          if (response) {
            return response;
          }

          // Clone the request
          const fetchRequest = event.request.clone();

          return fetch(fetchRequest).then(
            (response) => {
              // Check if we received a valid response
              if (!response || response.status !== 200 || response.type !== 'basic') {
                return response;
              }

              // Clone the response
              const responseToCache = response.clone();

              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(event.request, responseToCache);
                });

              return response;
            }
          );
        }).catch(() => {
          // If both the cache and network fail, or if this is a navigation request,
          // return the cached homepage as fallback
          if (event.request.mode === 'navigate') {
            return caches.match('/index.html');
          }
        })
    );
  }
});

// Service Worker Aktivierung und Cache-Bereinigung
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
