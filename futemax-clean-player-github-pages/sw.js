// Service Worker — FuteMAX Clean Player
// Cache strategies:
// - App shell (HTML, CSS, JS, icons): cache-first
// - Player URLs (iframe src): bypass cache, network-only (don't cache streams)
// - Homepage fetches (futemax home): network-first, fallback to cache (max 5min)

const VERSION = 'v1.0.0';
const APP_SHELL_CACHE = `fmcp-shell-${VERSION}`;
const HOME_CACHE = `fmcp-home-${VERSION}`;

const APP_SHELL_ASSETS = [
  './',
  './futemax-clean-player.html',
  './manifest.json',
  './icons/icon-16.png',
  './icons/icon-32.png',
  './icons/icon-180.png',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-192.png',
  './icons/icon-maskable-512.png'
];

// Patterns of URLs we should NEVER cache (player streams / dynamic content)
const NEVER_CACHE_PATTERNS = [
  /nossoplayeronlinehd\.ink/i,
  /embedtv\./i,
  /esportesembed\./i,
  /player-c8y\.pages\.dev/i,
  /sportsonliine\.click/i,
  /outbound-proxy/i,
  /corsproxy\.io/i,
  /api\.allorigins\.win/i,
  /api\.codetabs\.com/i,
  /thingproxy/i,
  /api\.qrserver\.com/i
];

// Install: pre-cache the app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(APP_SHELL_CACHE).then((cache) => {
      return cache.addAll(APP_SHELL_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate: clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((k) => !k.endsWith(VERSION))
          .map((k) => caches.delete(k))
      );
    }).then(() => self.clients.claim())
  );
});

// Helper: should we bypass cache entirely?
function shouldBypassCache(url) {
  return NEVER_CACHE_PATTERNS.some((pattern) => pattern.test(url));
}

// Helper: is this a same-origin app shell asset?
function isAppShellAsset(url) {
  try {
    const u = new URL(url);
    return u.origin === self.location.origin;
  } catch (e) {
    return false;
  }
}

// Helper: is this the futemax homepage (or similar)?
function isHomepageFetch(url) {
  return /futemax\.(ke|app|tv|bet|com)/i.test(url) && !/ao-vivo-\d/i.test(url);
}

// Fetch handler with routing
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = req.url;

  // Only handle GET
  if (req.method !== 'GET') return;

  // Bypass entirely — never intercept player URLs or proxied fetches
  // (the page handles these with its own fetch + proxy chain)
  if (shouldBypassCache(url)) {
    return; // let the browser handle it normally
  }

  // App shell: cache-first
  if (isAppShellAsset(url)) {
    event.respondWith(
      caches.match(req).then((cached) => {
        if (cached) {
          // Update cache in background
          fetch(req).then((res) => {
            if (res && res.status === 200) {
              caches.open(APP_SHELL_CACHE).then((cache) => cache.put(req, res.clone()));
            }
          }).catch(() => {});
          return cached;
        }
        return fetch(req).then((res) => {
          if (res && res.status === 200) {
            const clone = res.clone();
            caches.open(APP_SHELL_CACHE).then((cache) => cache.put(req, clone));
          }
          return res;
        });
      })
    );
    return;
  }

  // Default: try network, fall back to cache
  event.respondWith(
    fetch(req).catch(() => caches.match(req))
  );
});

// Listen for messages from the page (e.g., manual cache clear)
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  } else if (event.data === 'CLEAR_CACHE') {
    caches.keys().then((keys) => {
      Promise.all(keys.map((k) => caches.delete(k))).then(() => {
        event.ports[0] && event.ports[0].postMessage({ ok: true });
      });
    });
  }
});
