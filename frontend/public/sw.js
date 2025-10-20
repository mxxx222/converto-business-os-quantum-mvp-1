// Converto Business OS - Service Worker
// PWA functionality with offline support and caching

const CACHE_NAME = 'converto-v1.0.0';
const STATIC_CACHE = 'converto-static-v1';
const DYNAMIC_CACHE = 'converto-dynamic-v1';

// Files to cache for offline functionality
const STATIC_FILES = [
  '/',
  '/dashboard',
  '/invoices',
  '/expenses',
  '/reports',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/offline.html'
];

// API endpoints to cache
const API_CACHE_PATTERNS = [
  '/api/v1/invoices',
  '/api/v1/expenses',
  '/api/v1/dashboard',
  '/api/v1/reports'
];

// Install event - cache static files
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');

  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Service Worker: Caching static files');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => {
        console.log('Service Worker: Installation complete');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Service Worker: Installation failed', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');

  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activation complete');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Background sync for POST requests to /api
  if (request.method === 'POST' && url.pathname.startsWith('/api/')) {
    event.respondWith(
      (async () => {
        try {
          return await fetch(request.clone());
        } catch (err) {
          // Queue failed POST for background sync
          const body = await request.clone().text();
          const entry = {
            url: request.url,
            body,
            headers: Array.from(request.headers.entries()),
            timestamp: Date.now(),
          };
          const queue = await caches.open('bg-sync-queue');
          await queue.put(new Request(`queue:${entry.timestamp}`, { method: 'GET' }), new Response(JSON.stringify(entry)));
          if ('sync' in self.registration) {
            await self.registration.sync.register('api-post-sync');
          }
          return new Response(JSON.stringify({ queued: true, offline: true }), { status: 202, headers: { 'Content-Type': 'application/json' } });
        }
      })()
    );
    return;
  }

  // Handle different types of requests
  if (request.destination === 'document') {
    event.respondWith(handleDocumentRequest(request));
  } else if (request.destination === 'image' || request.destination === 'style' || request.destination === 'script') {
    event.respondWith(handleStaticAssetRequest(request));
  } else if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(request));
  } else {
    event.respondWith(fetch(request));
  }
});

// Handle API requests - network first, cache fallback
async function handleApiRequest(request) {
  try {
    const networkResponse = await fetch(request);

    if (networkResponse.ok && request.method === 'GET') {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.log('Service Worker: API request failed, trying cache');

    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    return new Response(
      JSON.stringify({
        error: 'Offline',
        message: 'No internet connection available',
        offline: true
      }),
      {
        status: 503,
        statusText: 'Service Unavailable',
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// Background sync: replay queued POST requests when back online
self.addEventListener('sync', (event) => {
  if (event.tag === 'api-post-sync') {
    event.waitUntil(
      (async () => {
        const queue = await caches.open('bg-sync-queue');
        const keys = await queue.keys();
        for (const key of keys) {
          const res = await queue.match(key);
          if (!res) continue;
          try {
            const entry = await res.json();
            const headers = new Headers();
            for (const [k, v] of entry.headers) headers.append(k, v);
            await fetch(entry.url, { method: 'POST', body: entry.body, headers });
            await queue.delete(key);
          } catch (e) {
            // Keep entry for next sync attempt
          }
        }
      })()
    );
  }
});

// Push notifications
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push notification received');

  const options = {
    body: 'Converto Business OS notification',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [100, 50, 100]
  };

  if (event.data) {
    const data = event.data.json();
    options.body = data.body || options.body;
  }

  event.waitUntil(
    self.registration.showNotification('Converto Business OS', options)
  );
});
