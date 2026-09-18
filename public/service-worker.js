const CACHE_NAME = "kira-shell-v4-phase16-vite-assets";

const STATIC_APP_SHELL = [
  "/",
  "/index.html",
  "/manifest.webmanifest",
  "/icon-192.png",
  "/icon-512.png",
  "/apple-touch-icon.png",
  "/icon-maskable-512.png",
  "/favicon-64.png",
  "/kira-logo.png"
];

function extractBuiltAssetPaths(html) {
  const paths = new Set();
  const assetPattern = /(?:src|href)=["']([^"']+)["']/g;
  let match;

  while ((match = assetPattern.exec(html)) !== null) {
    try {
      const url = new URL(match[1], self.location.origin);

      if (
        url.origin === self.location.origin &&
        url.pathname.startsWith("/assets/")
      ) {
        paths.add(`${url.pathname}${url.search}`);
      }
    } catch {
      // Ignore malformed or unsupported asset URLs.
    }
  }

  return [...paths];
}

async function cachePath(cache, path) {
  try {
    const request = new Request(path, { cache: "reload" });
    const response = await fetch(request);

    if (response.ok) {
      await cache.put(request, response.clone());
      return;
    }

    console.warn(
      "Kira service worker skipped cache entry:",
      path,
      response.status
    );
  } catch (error) {
    console.warn(
      "Kira service worker cache warning:",
      path,
      error
    );
  }
}

async function cacheAppShellBestEffort() {
  const cache = await caches.open(CACHE_NAME);
  let builtAssets = [];

  try {
    const rootRequest = new Request("/", { cache: "reload" });
    const rootResponse = await fetch(rootRequest);

    if (rootResponse.ok) {
      await cache.put(rootRequest, rootResponse.clone());
      builtAssets = extractBuiltAssetPaths(await rootResponse.text());
    } else {
      console.warn(
        "Kira service worker could not inspect the built app shell:",
        rootResponse.status
      );
    }
  } catch (error) {
    console.warn(
      "Kira service worker could not inspect the built app shell:",
      error
    );
  }

  const paths = [
    ...STATIC_APP_SHELL.filter(path => path !== "/"),
    ...builtAssets
  ];

  await Promise.allSettled(
    [...new Set(paths)].map(path => cachePath(cache, path))
  );
}

self.addEventListener("install", event => {
  event.waitUntil(
    (async () => {
      // Cache the deployed Vite shell and its hashed /assets/* files.
      // A single unavailable asset must not make installation fail.
      await cacheAppShellBestEffort();
      await self.skipWaiting();
    })()
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();

      await Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      );

      await self.clients.claim();
    })()
  );
});

self.addEventListener("message", event => {
  if (event.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener("fetch", event => {
  const request = event.request;
  const url = new URL(request.url);

  if (request.method !== "GET") return;
  if (url.origin !== self.location.origin) return;

  const isNavigation = request.mode === "navigate";
  const isAppShell =
    isNavigation ||
    url.pathname === "/" ||
    url.pathname === "/index.html" ||
    url.pathname === "/manifest.webmanifest" ||
    url.pathname.startsWith("/assets/") ||
    url.pathname.startsWith("/icon-") ||
    url.pathname === "/apple-touch-icon.png" ||
    url.pathname === "/favicon-64.png" ||
    url.pathname === "/kira-logo.png";

  if (!isAppShell) return;

  event.respondWith(
    (async () => {
      try {
        const response = await fetch(request);

        if (response.ok) {
          const copy = response.clone();
          const cache = await caches.open(CACHE_NAME);
          await cache.put(request, copy);
        }

        return response;
      } catch {
        const cached = await caches.match(request);

        if (cached) {
          return cached;
        }

        if (isNavigation) {
          const root = await caches.match("/");

          if (root) {
            return root;
          }
        }

        // Never return cached HTML for a missing JS/CSS asset.
        return Response.error();
      }
    })()
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

  const targetUrl = new URL(
    event.notification?.data?.url || "/#dashboard",
    self.location.origin
  ).href;

  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then(clients => {
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
