self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open("pwacache").then(cache =>
      cache.addAll([
        "./index.html",
        "./script.js",
        "./firebase.js",
        "./manifest.json",
        "./icon.png"
      ])
    )
  );
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then(response => response || fetch(e.request))
  );
});
