const CACHE = 'turma-thur-v4';
const FILES = ['./', './index.html', './app.css', './data.js', './app.js', './manifest.json',
  './icon-192.png', './icon-512.png', './apple-touch-icon.png', './img/logo.jpg', './img/thur.png',
  './img/pets/zuzu.png', './img/pets/lelo.png', './img/pets/pituca.png', './img/pets/bubu.png',
  './img/rev/turma.jpg', './img/rev/thur.jpg', './img/rev/zuzu.jpg', './img/rev/lelo.jpg', './img/rev/pituca.jpg', './img/rev/bubu.jpg'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(hit => hit || fetch(e.request).then(res => {
      if (res.ok || res.type === 'opaque') {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
      }
      return res;
    }).catch(() => caches.match('./index.html')))
  );
});
