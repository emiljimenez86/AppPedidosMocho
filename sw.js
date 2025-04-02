self.addEventListener("install", (event) => {
    console.log("Service Worker instalado");
    event.waitUntil(
        caches.open("Pedidos-App-cache").then((cache) => {
            return cache.addAll([
                "./index.html",
                "./styles.css",
                "./imagen/logo.png"
            ]);
        })
    );
});

self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
