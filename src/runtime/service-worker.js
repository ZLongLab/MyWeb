"use strict";

// Cache only this site's runtime files. Documentation, backups, personal data
// and external links are deliberately absent, even if the host can serve them.
const BASE = new URL("./", self.location.href);
const CACHE_PREFIX = "myweb-shell-" + encodeURIComponent(BASE.pathname) + "-";
const CACHE_NAME = CACHE_PREFIX + "__CACHE_VERSION__";
const APP_FILES = []; /*__APP_FILES__*/
const APP_URLS = APP_FILES.map((path) => new URL(path, BASE).href);
const ALLOWED = new Set(APP_URLS);

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // addAll is atomic: a missing asset fails this installation without
      // replacing the cache belonging to the already active worker.
      return cache.addAll(
        APP_URLS.map(
          (url) =>
            new Request(url, { cache: "reload", credentials: "same-origin" }),
        ),
      );
    }),
  );
  // Do not force skipWaiting: open pages may still belong to the old version.
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => {
              return key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME;
            })
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const requested = new URL(event.request.url);
  if (requested.origin !== BASE.origin) return;
  // The HTML shell is identical for every known detail/filter query. Query
  // strings remain in the address bar and are processed by the page scripts.
  const canonical = new URL(requested.pathname, BASE.origin);
  if (canonical.pathname === BASE.pathname) canonical.pathname += "index.html";
  // Some static hosts redirect page.html to /page. Map only known pages back
  // to their cache keys; unknown paths never acquire access to other files.
  if (
    !ALLOWED.has(canonical.href) &&
    !canonical.pathname.split("/").pop().includes(".")
  ) {
    const html = new URL(canonical.href);
    html.pathname += ".html";
    if (ALLOWED.has(html.href)) canonical.pathname = html.pathname;
  }
  if (!ALLOWED.has(canonical.href)) {
    if (
      event.request.mode === "navigate" &&
      requested.pathname.startsWith(BASE.pathname)
    )
      event.respondWith(
        fetch(event.request).catch(async () => {
          const cached = await caches.match(new URL("404.html", BASE).href);
          return cached
            ? new Response(cached.body, {
                status: 404,
                headers: cached.headers,
              })
            : Response.error();
        }),
      );
    return;
  }

  event.respondWith(
    (async () => {
      try {
        const response = await fetch(event.request);
        if (response.ok && response.type === "basic") {
          try {
            const cache = await caches.open(CACHE_NAME);
            await cache.put(canonical.href, response.clone());
          } catch (error) {
            /* Cache quota/storage failure must not hide a good network response. */
          }
        }
        return response;
      } catch (error) {
        try {
          const cache = await caches.open(CACHE_NAME);
          const cached = await cache.match(canonical.href);
          // A cached response fetched through a host redirect retains its URL and
          // redirect flag. Rewrap the body for offline navigation to either URL.
          if (cached)
            return new Response(cached.body, {
              status: cached.status,
              statusText: cached.statusText,
              headers: cached.headers,
            });
        } catch (storageError) {
          /* A restricted cache cannot provide an offline fallback. */
        }
        return Response.error();
      }
    })(),
  );
});
