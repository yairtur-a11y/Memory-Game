// ─────────────────────────────────────────────────────────────────────────────
// BUMP THIS VERSION on every push that changes any file.
// Format: "vN" — just increment N each time (v2, v3, v4…)
// ─────────────────────────────────────────────────────────────────────────────
const CACHE_VERSION = "v23";
// ─────────────────────────────────────────────────────────────────────────────

const CACHE_NAME = `memory-game-${CACHE_VERSION}`;

const ASSETS = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./countries.js",
  "./us-states.js",
  "./maps.js",
  "./family.js",
  "./feedback.js",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  // CDN assets — cached so the game works offline
  "https://cdn.jsdelivr.net/npm/d3@7/dist/d3.min.js",
  "https://cdn.jsdelivr.net/npm/topojson-client@3/dist/topojson-client.min.js",
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json",
  "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json",
];

// ── Install ───────────────────────────────────────────────────────────────────
// Pre-cache all assets into the versioned cache, then activate immediately
// without waiting for existing tabs to close.
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

// ── Activate ──────────────────────────────────────────────────────────────────
// Delete all old caches (any "memory-game-*" that isn't the current version),
// then claim all open pages so this SW serves them immediately.
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys
          .filter(key => key.startsWith("memory-game-") && key !== CACHE_NAME)
          .map(key => {
            console.log("[SW] Deleting old cache:", key);
            return caches.delete(key);
          })
      ))
      .then(() => self.clients.claim())
  );
});

// ── Fetch ─────────────────────────────────────────────────────────────────────
// Cache-first: serve from cache when available, fall back to network.
// New responses are added to the cache automatically.
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  if (event.request.url.startsWith("chrome-extension://")) return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;

      return fetch(event.request)
        .then(response => {
          if (response && response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => {
          // Network failed and nothing in cache — nothing we can do
          console.warn("[SW] Fetch failed, no cache:", event.request.url);
        });
    })
  );
});
