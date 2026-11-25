const CACHE = 'turma-thur-v6';
const FILES = ["./", "./index.html", "./app.css", "./data.js", "./data2.js", "./app.js", "./mundo.js", "./carros.js", "./manifest.json", "./icon-192.png", "./icon-512.png", "./apple-touch-icon.png", "./img/bg-cozinha.jpg", "./img/bg-parque.jpg", "./img/logo.jpg", "./img/thur.png", "./img/bg-quarto.jpg", "./img/rev/bubu.jpg", "./img/rev/thur.jpg", "./img/rev/zuzu.jpg", "./img/rev/lelo.jpg", "./img/rev/pituca.jpg", "./img/rev/turma.jpg", "./img/mundo/quarto.jpg", "./img/mundo/cozinha.jpg", "./img/mundo/parque.jpg", "./img/mundo/obj/cenoura.webp", "./img/mundo/obj/baloes.webp", "./img/mundo/obj/carro.webp", "./img/mundo/obj/pula.webp", "./img/mundo/obj/melancia.webp", "./img/mundo/obj/trem.webp", "./img/mundo/obj/abajur.webp", "./img/mundo/obj/biscoito.webp", "./img/mundo/obj/tambor.webp", "./img/mundo/obj/bola.webp", "./img/mundo/obj/piscina.webp", "./img/mundo/obj/joao.webp", "./img/mundo/obj/uva.webp", "./img/mundo/obj/urso.webp", "./img/mundo/obj/banana.webp", "./img/mundo/obj/cupcake.webp", "./img/mundo/obj/leite.webp", "./img/mundo/obj/maca.webp", "./img/mundo/obj/cama.webp", "./img/mundo/obj/escorregador.webp", "./img/mundo/obj/bau.webp", "./img/mundo/obj/cavalinho.webp", "./img/pets/zuzu.png", "./img/pets/lelo.png", "./img/pets/pituca.png", "./img/pets/bubu.png"];

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
