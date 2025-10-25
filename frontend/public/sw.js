const CACHE_NAME = 'converto-v1';
const urlsToCache = [
  '/',
  '/receipts',
  '/offline.html'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request).catch(() => {
          if (event.request.destination === 'document') {
            return caches.match('/offline.html');
          }
        });
      })
  );
});

// Background sync for receipts
self.addEventListener('sync', (event) => {
  if (event.tag === 'receipts-sync') {
    event.waitUntil(syncReceipts());
  }
});

async function syncReceipts() {
  // Sync pending receipts when back online
  console.log('Syncing receipts...');
}
