const CACHE_NAME = 'portfolio-v2';
const urlsToCache = ['/', '/index.html', '/style.css', '/script.js', '/icons/user-solid.svg'];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
        )
    );
});

self.addEventListener('fetch', event => {
    const req = event.request;
    const url = new URL(req.url);

    if (req.method !== 'GET' || url.origin !== self.location.origin) return;

    const isCoreAsset =
        url.pathname === '/' ||
        url.pathname === '/index.html' ||
        url.pathname === '/script.js' ||
        url.pathname === '/style.css';

    if (isCoreAsset) {
        event.respondWith(
            fetch(req)
                .then(res => {
                    const copy = res.clone();
                    caches.open(CACHE_NAME).then(c => c.put(req, copy));
                    return res;
                })
                .catch(() => caches.match(req))
        );
        return;
    }

    event.respondWith(caches.match(req).then(r => r || fetch(req)));
}); 
