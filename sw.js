/* Willow PropDesk — Service Worker v3 */
const CACHE_NAME = 'willow-propdesk-v3';
const SHELL_FILES = [
  '/propdesk-/index.html',
  '/propdesk-/css/main.css',
  '/propdesk-/css/fieldtrack.css',
  '/propdesk-/css/property-settings.css',
  '/propdesk-/js/app.js',
  '/propdesk-/js/mobile.js',
  '/propdesk-/js/pipeline.js',
  '/propdesk-/js/fieldtrack.js',
  '/propdesk-/js/inbox.js',
  '/propdesk-/js/automation.js',
  '/propdesk-/js/ft-db.js',
  '/propdesk-/js/config.js',
  '/propdesk-/js/property-settings.js',
  '/propdesk-/js/reply-kb.js',
  '/propdesk-/manifest.json',
  '/propdesk-/icons/icon-192.png',
  '/propdesk-/icons/icon-512.png'
];

/* Install — cache the app shell */
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(SHELL_FILES);
    }).then(function() {
      return self.skipWaiting();
    })
  );
});

/* Activate — clean old caches */
self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(names) {
      return Promise.all(
        names.filter(function(n) { return n !== CACHE_NAME; })
            .map(function(n) { return caches.delete(n); })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});

/* Fetch — network-first for API calls, cache-first for app shell */
self.addEventListener('fetch', function(e) {
  var url = new URL(e.request.url);

  /* Always go to network for Supabase API, external CDNs, and non-GET */
  if (e.request.method !== 'GET' ||
      url.hostname.includes('supabase') ||
      url.hostname.includes('googleapis') ||
      url.hostname.includes('cdnjs') ||
      url.hostname.includes('cdn.jsdelivr')) {
    return;
  }

  /* Stale-while-revalidate for app files */
  e.respondWith(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.match(e.request).then(function(cached) {
        var fetched = fetch(e.request).then(function(response) {
          if (response && response.status === 200) {
            cache.put(e.request, response.clone());
          }
          return response;
        }).catch(function() {
          return cached;
        });
        return cached || fetched;
      });
    })
  );
});
