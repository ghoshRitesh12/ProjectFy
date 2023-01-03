const CACHE_NAME = "ProjectFy";
const assets = [];

// Install
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      // return cache.addAll(assets);
    })
  );
});

// Listen for requests
self.addEventListener('fetch', (e) => {
  // e.respondWith(
  //   fetch(e.request).then(response => {
  //     console.log(response);
  //     return response;
  //   })
  // );

  // e.respondWith(
  //   caches.match(e.request).then(response => {
  //     return response || fetch(e.request);
  //   })
  // );
});


// Activation
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys => { 
      return Promise.all(keys
        .filter(key => key !== CACHE_NAME)
        .map(key => caches.delete(key))
      )
    })
  )
});

