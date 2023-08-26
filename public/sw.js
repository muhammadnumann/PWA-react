// const cacheName = 'pwa App mobile';
// const staticAssets = [
//     './',
//     './index.html',
//     './custom.css',
//     '.custom.js',
//     '../src/index.js',
// ];

// self.addEventListener('install', async e => {
//     const cache = await caches.open(cacheName);
//     await cache.addAll(staticAssets);
//     return self.skipWaiting();
// });

// self.addEventListener('activate', e => {
//     self.clients.claim();
// });

// self.addEventListener('fetch', async e => {
//     const req = e.request;
//     const url = new URL(req.url);

//     if (url.origin === location.origin) {
//         e.respondWith(cacheFirst(req));
//     } else {
//         e.respondWith(networkAndCache(req));
//     }
// });

// async function cacheFirst(req) {
//     const cache = await caches.open(cacheName);
//     const cached = await cache.match(req);
//     return cached || fetch(req);
// }

// async function networkAndCache(req) {
//     const cache = await caches.open(cacheName);
//     try {
//         const fresh = await fetch(req);
//         await cache.put(req, fresh.clone());
//         return fresh;
//     } catch (e) {
//         const cached = await cache.match(req);
//         return cached;
//     }
// }

let cacheData = "appV1";
this.addEventListener("install", event => {
    event.waitUntil(
        caches.open(cacheData)
            .then((cache) => {
                cache.addAll([
                    '/static/js/main.chunk.js',
                    '/static/js/0.chunk.js',
                    '/static/js/stripe.js',
                    '/static/js/bundle.js',
                    '/index.html',
                    '/'
                ])
            })
    )
});

this.addEventListener("fetch", event => {
    if (!navigator.onLine) {
        event.respondWith(
            caches.match(event.request)
                .then(resp => {
                    if (resp) {
                        return resp;
                    }
                })
        )
    }
});