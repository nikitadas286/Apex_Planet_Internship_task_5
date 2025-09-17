const CACHE_NAME = "nisaan-cache-v2";
const urlsToCache = [
  "/",
  "/index.html",

  // CSS
  "/css/bootstrap.css",
  "/css/style.css",
  "/css/responsive.css",
  "/css/style.css.map",   // optional, for debugging

  // JS
  "/js/bootstrap.js",
  "/js/jquery-3.4.1.min.js",
  "/js/custom.js",
  "/js/script.js",

  // Images used in CSS or directly
  "/images/logo.png",
  "/images/slider-img.png",
  "/images/design-1.png",
  "/images/design-2.png",
  "/images/cart.png",
  "/images/hero-bg.png",
  "/images/menu.png",
  "/images/search-icon.png",
  "/images/prev.png",
  "/images/prev-black.png",
  "/images/next.png",
  "/images/next-black.png"
];

// Install
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

// Activate - clean old caches
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      )
    )
  );
});

// Fetch
self.addEventListener("fetch", event => {
  if (event.request.mode === "navigate") {
    // Network-first for HTML
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
  } else {
    // Cache-first for static assets
    event.respondWith(
      caches.match(event.request).then(response => {
        return (
          response ||
          fetch(event.request).then(fetchRes => {
            return caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, fetchRes.clone());
              return fetchRes;
            });
          })
        );
      })
    );
  }
});
