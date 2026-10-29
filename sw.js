/*
  Service worker de la agenda.
  - Guarda la "cáscara" de la app (HTML, íconos, manifest) para que abra rápido.
  - Si no hay internet y la página no está guardada, muestra offline.html.
  - Cuando cambies cualquier archivo, sube el número de VERSION para que
    los teléfonos descarguen la versión nueva.
*/
const VERSION = 'v1';
const CACHE = `agenda-${VERSION}`;
const SHELL = [
  './',
  './index.html',
  './offline.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png',
  './icons/favicon-32.png'
];

// 1) Instalación: guarda la cáscara
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

// 2) Activación: borra versiones viejas
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k.startsWith('agenda-') && k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// 3) Peticiones
self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Páginas: primero internet (para tener lo más nuevo); sin red, lo guardado; si no, offline.html
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then(res => { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); return res; })
        .catch(() => caches.match(req).then(r => r || caches.match('./index.html')).then(r => r || caches.match('./offline.html')))
    );
    return;
  }

  // Fuentes de Google: usa la guardada y actualiza en segundo plano
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(
      caches.open(CACHE).then(c => c.match(req).then(hit => {
        const net = fetch(req).then(res => { c.put(req, res.clone()); return res; }).catch(() => hit);
        return hit || net;
      }))
    );
    return;
  }

  // Archivos propios (íconos, manifest): primero lo guardado
  if (url.origin === self.location.origin) {
    event.respondWith(caches.match(req).then(hit => hit || fetch(req)));
  }
});

/*
  Nota para la versión con Flask: las peticiones a la API (/api/...) NO se guardan aquí.
  Las citas siempre se piden al servidor; el service worker solo guarda la interfaz.
*/
