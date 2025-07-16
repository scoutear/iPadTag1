const CACHE_NAME = 'ipadtag-cache-v1';

const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon-512.png'
  // Agregá acá más archivos si tenés otros (CSS, imágenes, JS)
];

// Se instala el Service Worker y guarda archivos en caché
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Instalando...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[ServiceWorker] Archivos cacheados:', urlsToCache);
        return cache.addAll(urlsToCache);
      })
  );
});

// Intercepta requests y devuelve archivos del caché si no hay conexión
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Devuelve del caché si existe
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

// Elimina cachés antiguos al activar una nueva versión
self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activado');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
});
