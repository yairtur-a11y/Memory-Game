const CACHE = "memory-game-v1";

const LOCAL_ASSETS = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./countries.js",
  "./maps.js",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
];

const CDN_ASSETS = [
  "https://cdn.jsdelivr.net/npm/d3@7/dist/d3.min.js",
  "https://cdn.jsdelivr.net/npm/topojson-client@3/dist/topojson-client.min.js",
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json",
];

// Install: cache everything
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE).then(cache =>
      cache.addAll([...LOCAL_ASSETS, ...CDN_ASSETS])
    )
  );
  self.skipWaiting();
});

// Activate: remove old caches
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: cache-first for everything
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE).then(cache => cache.put(event.request, clone));
        }
        return response;
      });
    })
  );
});
