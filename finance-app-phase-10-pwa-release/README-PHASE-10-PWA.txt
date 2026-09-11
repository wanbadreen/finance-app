Finance App — Phase 10 PWA / Release Polish

Added:
- Installable Progressive Web App
- Web App Manifest
- 192x192 and 512x512 app icons
- Apple touch icon
- Android/Chrome install prompt support
- iPhone Add to Home Screen guidance
- Standalone display mode
- Service worker for app-shell caching
- Offline status banner
- Install My Finance card in mobile More
- Proper theme color / mobile app metadata
- Hash navigation fix for Goals, Reports and Insights on direct reload

Important:
The service worker caches only the app shell:
- index.html
- script.js
- style.css
- manifest
- icons

It does NOT cache Supabase finance records or API responses.
When offline, the app shell can open, but live finance data may not refresh.

Project structure:
index.html
script.js
style.css
public/
  manifest.webmanifest
  service-worker.js
  icon-192.png
  icon-512.png
  apple-touch-icon.png

For Vite:
Everything inside public/ will be copied into dist/ during npm run build.

After replacing files:
1. Replace index.html, script.js, style.css
2. Copy the full public folder into the project root
3. npm run dev -- --host 0.0.0.0
4. Test on phone
5. npm run build
6. git add index.html script.js style.css public
7. git commit -m "Add PWA install and release polish"
8. git push

JavaScript syntax validation: PASS
Database migration required: NO
