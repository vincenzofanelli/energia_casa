// ── Service Worker — Energia Casa ──
const CACHE_NAME = 'energia-casa-v1.0.0';
const FILES = [
  './',
  './index.html',
  './version.json'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(c => c.addAll(FILES))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Per version.json vai sempre in rete (per rilevare aggiornamenti)
  if (e.request.url.endsWith('version.json')) {
    e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
    return;
  }
  // Per tutto il resto: cache-first
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});

// Messaggio dalla pagina: skipWaiting e ricarica
self.addEventListener('message', e => {
  if (e.data === 'skipWaiting') self.skipWaiting();
});
