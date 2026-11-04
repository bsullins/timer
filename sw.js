/* Bump this version and update ASSETS whenever the application shell changes. */
const CACHE = 'bens-timer-offline-v1';
const BASE = new URL('./', self.location.href);
const ASSETS = ['index.html', 'styles.css?v=3', 'golf.js?v=3', 'app.js?v=3',
  'offline.js?v=1', 'assets/golf-mobility.jpg'].map(path => new URL(path, BASE).href);
self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    // Installation only succeeds when every required file is safely cached.
    await cache.addAll(ASSETS.map(url => new Request(url, { cache: 'reload' })));
    await self.skipWaiting();
  })());
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    for (const key of await caches.keys()) {
      if (key.startsWith('bens-timer-offline-') && key !== CACHE) await caches.delete(key);
    }
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET' || url.origin !== BASE.origin || !url.pathname.startsWith(BASE.pathname)) return;
  if (event.request.mode === 'navigate') {
    event.respondWith((async () => {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 3000);
      try {
        const response = await fetch(event.request, { signal: controller.signal });
        if (response.ok) return response;
      } catch (_) { /* Use the installed shell when offline or the server fails. */ }
      finally { clearTimeout(timeout); }
      const cache = await caches.open(CACHE);
      return (await cache.match(new URL('index.html', BASE).href)) || Response.error();
    })());
    return;
  }
  if (ASSETS.includes(url.href)) {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE);
      return (await cache.match(event.request)) || fetch(event.request);
    })());
  }
});
