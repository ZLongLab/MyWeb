'use strict';

// Cache only this site's runtime files. Documentation, backups, personal data
// and external links are deliberately absent, even if the host can serve them.
const BASE = new URL('./', self.location.href);
const CACHE_PREFIX = 'myweb-shell-' + encodeURIComponent(BASE.pathname) + '-';
const CACHE_NAME = CACHE_PREFIX + '1.1.0';
const APP_FILES = [
  'assets/images/garden-graph.svg',
  'assets/timeline-data.js',
  'assets/garden-data.js',
  'assets/garden.css',
  'assets/garden.js',
  'assets/images/github-activity.svg',
  'assets/seasons.css',
  'assets/house.css',
  'assets/room-pages.js',
  'assets/house.js',
  'assets/site-snapshot.js',
  'assets/life-data.js',
  'assets/house-data.js',
  'colophon.html',
  'links.html',
  'life.html',
  'uses.html',
  'now.html',
  'index.html',
  'projects.html',
  'project.html',
  'about.html',
  'articles.html',
  'article.html',
  'guestbook.html',
  'workbench.html',
  'assets/styles.css',
  'assets/site-theme.css',
  'assets/home.css',
  'assets/background.css',
  'assets/page-background.svg',
  'assets/site-mark.svg',
  'assets/favicon.svg',
  'assets/site-data.js',
  'assets/app.js',
  'assets/projects-data.js',
  'assets/projects.js',
  'assets/projects.css',
  'assets/project.js',
  'assets/articles-data.js',
  'assets/articles.js',
  'assets/content.js',
  'assets/home-projects.js',
  'assets/workbench-data.js',
  'assets/workbench.js',
  'assets/workbench.css',
  'assets/navigation.js',
  'assets/navigation.css',
  'assets/search.js',
  'assets/search.css',
  'assets/guestbook.js',
  'assets/guestbook.css',
  'assets/media-viewer.js',
  'assets/media-viewer.css',
  'assets/images/recallai-preview.png',
  'assets/images/recallai-adoption-preview.png',
  'assets/images/documentassistant-preview.png',
  'assets/night.css',
  'assets/theme-controls.js',
  'assets/motion.css',
  'assets/motion.js',
  'assets/pwa.css',
  'assets/pwa.js',
  'manifest.webmanifest',
  'assets/icons/site-192.png',
  'assets/icons/site-512.png'
];
const APP_URLS = APP_FILES.map(path => new URL(path, BASE).href);
const ALLOWED = new Set(APP_URLS);

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => {
    // addAll is atomic: a missing asset fails this installation without
    // replacing the cache belonging to the already active worker.
    return cache.addAll(APP_URLS.map(url => new Request(url, { cache: 'reload', credentials: 'same-origin' })));
  }));
  // Do not force skipWaiting: open pages may still belong to the old version.
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => {
    return key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME;
  }).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const requested = new URL(event.request.url);
  if (requested.origin !== BASE.origin) return;
  // The HTML shell is identical for every known detail/filter query. Query
  // strings remain in the address bar and are processed by the page scripts.
  const canonical = new URL(requested.pathname, BASE.origin);
  if (canonical.pathname === BASE.pathname) canonical.pathname += 'index.html';
  if (!ALLOWED.has(canonical.href)) return;

  event.respondWith((async () => {
    try {
      const response = await fetch(event.request);
      if (response.ok && response.type === 'basic') {
        try {
          const cache = await caches.open(CACHE_NAME);
          await cache.put(canonical.href, response.clone());
        } catch (error) { /* Cache quota/storage failure must not hide a good network response. */ }
      }
      return response;
    } catch (error) {
      try {
        const cache = await caches.open(CACHE_NAME);
        const cached = await cache.match(canonical.href);
        if (cached) return cached;
      } catch (storageError) { /* A restricted cache cannot provide an offline fallback. */ }
      return Response.error();
    }
  })());
});
