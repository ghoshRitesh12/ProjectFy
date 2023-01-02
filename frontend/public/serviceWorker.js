const CACHE_NAME = "ProjectFy";
const assets = [
  '/',
  '/fonts/roboto-v30-latin-500.woff', '/fonts/roboto-v30-latin-500.woff2',
  '/fonts/roboto-v30-latin-regular.woff', '/fonts/roboto-v30-latin-regular.woff2',
  '/fonts/ubuntu-v20-latin-500.woff', '/fonts/ubuntu-v20-latin-500.woff2',
  '/fonts/ubuntu-v20-latin-regular.woff', '/fonts/ubuntu-v20-latin-regular.woff2',

  '/images/favicon-192x192.png', '/images/favicon-512x512.png', '/images/favicon-512x512.svg',

  '/css/homeStyles.css', '/css/rootHomeStyles.css',

  '/js/home.overview.js', '/js/home.ideas.js', '/js/home.kanban.js',
  '/js/home.root.js', '/js/signinPage.js', '/js/signupPage.js', '/js/utility.js'
];

// Install
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(assets);
    })
  );
});

// Listen for requests
self.addEventListener('fetch', (e) => {
  // e.respondWith(
  //   fetch(e.request).then(response => response)
  // );

  e.respondWith(
    caches.match(e.request).then(response => {
      return response || fetch(e.request);
    })
  );

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

