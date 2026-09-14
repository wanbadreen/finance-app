const CACHE_NAME = "kira-shell-v2-phase13";
const APP_SHELL = [
  "/",
  "/index.html",
  "/style.css",
  "/script.js",
  "/phase13-notifications.css",
  "/phase13-notifications.js",
  "/manifest.webmanifest",
  "/icon-192.png",
  "/icon-512.png",
  "/apple-touch-icon.png",
  "/icon-maskable-512.png",
  "/favicon-64.png",
  "/kira-logo.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  const request = event.request;
  const url = new URL(request.url);

  if (request.method !== "GET") return;
  if (url.origin !== self.location.origin) return;

  const isAppShell =
    url.pathname === "/" ||
    url.pathname === "/index.html" ||
    url.pathname === "/style.css" ||
    url.pathname === "/script.js" ||
    url.pathname === "/phase13-notifications.css" ||
    url.pathname === "/phase13-notifications.js" ||
    url.pathname === "/manifest.webmanifest" ||
    url.pathname.startsWith("/icon-") ||
    url.pathname === "/apple-touch-icon.png" ||
    url.pathname === "/favicon-64.png" ||
    url.pathname === "/kira-logo.png";

  if (!isAppShell) return;

  event.respondWith(
    fetch(request)
      .then(response => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
        return response;
      })
      .catch(() =>
        caches.match(request).then(cached => cached || caches.match("/"))
      )
  );
});

self.addEventListener("push", event => {
  let payload = {};

  try {
    payload = event.data ? event.data.json() : {};
  } catch {
    payload = {
      title: "Kira",
      body: event.data ? event.data.text() : "You have a new Kira notification."
    };
  }

  const title = payload.title || "Kira";
  const options = {
    body: payload.body || "You have a new financial alert.",
    icon: "/icon-192.png",
    badge: "/favicon-64.png",
    tag: payload.tag || "kira-notification",
    renotify: false,
    data: {
      url: payload.url || "/#dashboard"
    }
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", event => {
  event.notification.close();
  const targetUrl = new URL(event.notification?.data?.url || "/#dashboard", self.location.origin).href;

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(clients => {
      for (const client of clients) {
        if ("focus" in client) {
          client.navigate(targetUrl);
          return client.focus();
        }
      }

      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});
