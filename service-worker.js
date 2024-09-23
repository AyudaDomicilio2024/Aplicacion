// Nombre del caché
const CACHE_NAME = 'v1_cache_pwa_app';

// Archivos que queremos cachear
const urlsToCache = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/images/icon-192x192.png',
  '/images/icon-512x512.png',
  // Agrega aquí todos los archivos que deseas cachear (CSS, imágenes, etc.)
];

// Instalación del Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Archivos cacheados correctamente');
        return cache.addAll(urlsToCache);
      })
  );
});

// Activación del Service Worker
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheWhitelist.indexOf(cacheName) === -1) {
              // Borra las caches antiguas que no están en la lista blanca
              return caches.delete(cacheName);
            }
          })
        );
      })
  );
});

// Intercepción de las peticiones de la aplicación
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Si la respuesta está en la caché, devuélvela
        if (response) {
          return response;
        }
        // Si no está en la caché, haz una petición normal
        return fetch(event.request);
      })
  );
});
