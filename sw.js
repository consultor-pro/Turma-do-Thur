/* Turma do Thur — funciona sem internet e se atualiza sozinho */
const CACHE = 'turma-thur-v21';
const FILES = ["./", "./index.html", "./app.css", "./data.js", "./data2.js", "./data3.js", "./app.js", "./mundo.js", "./carros.js", "./cozinha.js", "./img/mundo/obj/panela.svg", "./img/mundo/obj/arroz.svg", "./img/mundo/obj/feijao.svg", "./img/mundo/obj/carne.svg", "./img/mundo/obj/macarrao.svg", "./img/mundo/obj/salada.svg", "./manifest.json", "./icon-192.png", "./icon-512.png", "./apple-touch-icon.png", "./img/bg-cozinha.jpg", "./img/bg-parque.jpg", "./img/logo.jpg", "./img/thur.png", "./img/bg-quarto.jpg", "./img/rev/bubu.jpg", "./img/rev/thur.jpg", "./img/rev/zuzu.jpg", "./img/rev/lelo.jpg", "./img/rev/pituca.jpg", "./img/rev/turma.jpg", "./img/mundo/quarto.jpg", "./img/mundo/cozinha.jpg", "./img/mundo/banheiro.svg", "./img/mundo/parque.jpg", "./img/mundo/obj/cenoura.webp", "./img/mundo/obj/baloes.webp", "./img/mundo/obj/carro.webp", "./img/mundo/obj/patinho.svg", "./img/mundo/obj/pula.webp", "./img/mundo/obj/melancia.webp", "./img/mundo/obj/trem.webp", "./img/mundo/obj/abajur.webp", "./img/mundo/obj/biscoito.webp", "./img/mundo/obj/tambor.webp", "./img/mundo/obj/bola.webp", "./img/mundo/obj/piscina.webp", "./img/mundo/obj/joao.webp", "./img/mundo/obj/uva.webp", "./img/mundo/obj/vaso.svg", "./img/mundo/obj/urso.webp", "./img/mundo/obj/pia.svg", "./img/mundo/obj/banana.webp", "./img/mundo/obj/cupcake.webp", "./img/mundo/obj/leite.webp", "./img/mundo/obj/maca.webp", "./img/mundo/obj/cama.webp", "./img/mundo/obj/escorregador.webp", "./img/mundo/obj/bau.webp", "./img/mundo/obj/cavalinho.webp", "./img/pets/zuzu.png", "./img/pets/lelo.png", "./img/pets/pituca.png", "./img/pets/bubu.png"];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE)
    .then(c => Promise.all(FILES.map(f => c.add(new Request(f, {cache: 'reload'})).catch(() => null))))
    .then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('message', e => { if (e.data === 'skip') self.skipWaiting(); });

const isCode = u => u.origin === location.origin && (/\.(html|js|css|json)$/.test(u.pathname) || u.pathname.endsWith('/'));

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (req.mode === 'navigate' || isCode(url)) {
    /* página e código: sempre tenta a versão nova primeiro; sem internet, usa a guardada */
    e.respondWith(fetch(req, {cache: 'no-store'}).then(res => {
      if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
      return res;
    }).catch(() => caches.match(req, {ignoreSearch: true}).then(r => r || caches.match('./index.html'))));
    return;
  }
  /* imagens e fontes: usa a guardada e busca se não tiver */
  e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(res => {
    if (res.ok || res.type === 'opaque') { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
    return res;
  })));
});
