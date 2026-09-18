# Phase 17A — Android readiness audit

Source audit, local builds and offline regression checks only. **No emulator or physical-device runtime test was performed.** Safe means no source-level blocker identified, not runtime certification.

## Release blockers / required follow-up

| Area | Finding and disposition |
| --- | --- |
| Downloads / exports | `downloadJsonFile` and CSV report export use Blob URLs and `<a download>`. Android WebView does not provide a proven system download/save path here; existing success text can overstate completion. Implement/test a native save/share or Storage Access Framework path before claiming Android export parity. No extra storage permission was added. |
| Push | Existing code uses Web Push, Notification, PushManager and service workers. Native web-push detection/registration is now disabled with explicit UI status. In-app notification queries remain. Native push requires separately authorized setup and device tests; no Firebase/backend config was changed. Resolve or explicitly accept this feature limitation before release. |
| Android navigation | App routing uses hash/history and `popstate`. There is no Capacitor App/back-button integration in this package, so hardware/predictive Back may exit instead of closing a modal or navigating pages. Test and implement the intended native behavior before release. |
| Native content policy | Vercel CSP/security headers apply to hosted web responses, not bundled Android HTML. No native-equivalent CSP has been verified. Evaluate an Android-only policy for Supabase HTTPS/WSS, OCR CDN/worker/WASM and receipt blob/image sources before distribution; do not weaken hosted CSP. |
| Runtime QA | Auth persistence/resume, picker, receipt viewing, OCR, keyboard/insets and offline recovery require real-device evidence. Successful compilation cannot close these gates. |

## Warnings and mitigations

| Area | Evidence / action |
| --- | --- |
| Auth session storage | `supabase.js` uses normal supabase-js defaults. Installed auth library enables persistence and uses WebView localStorage when available (memory fallback otherwise). HTTPS localhost origin stays stable; no Capacitor HTTP/cookie override added. Verify cold start, token refresh after suspension, reinstall/data-clear and logout. WebView storage is not a hardware-backed secret vault. Android OS backup was disabled and Android 12+ cloud/device-transfer rules exclude all storage domains. |
| Auth emails / navigation | Reset helper and signup previously used `window.location.origin`, which becomes localhost in Android. Native calls now omit that redirect and use existing Supabase Site URL; web calls retain current behavior. Live Site URL/templates were not inspected or changed. Recovery/confirmation occurs in browser; returning authenticated via deep link is pending a final app-ID/domain decision. No OAuth flow found in the frontend. |
| File inputs / uploads | Accept list and validation include JPG/PNG/WebP/PDF. Capacitor implements Android file chooser intents. Current input does not request capture; direct camera capture is not promised. Check MIME reporting, cancellation, URI grants and file sizes with real providers. No broad storage or camera permission is necessary merely to select files. |
| Receipt opening | Previously preopened `about:blank` before obtaining a 60-second signed URL. Native skips that popup and navigates to the signed URL; Capacitor's external-URL handler uses Android ACTION_VIEW outside the local origin. Web popup behavior is preserved. Test image/PDF handlers, browser return and expiry; signed URLs remain sensitive until expiry. |
| OCR / workers | Tesseract `createWorker('eng', 1, ...)` uses worker/WASM/language resources, with external defaults. Vite build does not establish that every OCR asset is bundled offline. Test first-use network fetches, WebView WASM/worker compatibility, memory on large photos, cancellation and resume. Remote AI scanning still depends on network/backend. |
| PWA / service worker | Two registration entry points existed: main app and notifications bootstrap. Both are gated outside native. Native install UI reports already installed. Hosted web manifest/service-worker code is unchanged. Native app shell loads bundled assets without a PWA cache. |
| Offline | Existing online/offline banner uses navigator.onLine, which indicates connectivity, not backend reachability. No offline finance-write queue was added. Data/API/OCR failures and reconnect must be tested. |
| Insets / keyboard | Existing CSS has bottom safe-area adjustments but not a fully validated native layout. SystemBars native handling, viewport auto, and adjustResize avoid opting into unhandled edge-to-edge. Verify notch/top bars, bottom controls, modal inputs, keyboard and rotation on devices. |
| CSP / CORS | Local Edge Function source has wildcard origin CORS and OPTIONS handlers; deployed state was intentionally not inspected. Browser fetch is retained so HTTPS localhost CORS needs device verification. No production allowlist, headers, auth settings, RLS, storage, functions or database changes were made. |
| Browser APIs | localStorage, Blob/object URLs, FileReader/canvas, matchMedia, history, visibility/focus and online events appear in frontend flows. They are plausible WebView APIs, but support does not prove lifecycle behavior. Notification/service-worker APIs are explicitly guarded; Blob downloads remain the distinct gap above. |
| Dependency audit | npm runtime audit (`--omit=dev`) found zero vulnerabilities. Full audit reported three moderate entries in Capacitor CLI -> xcode -> uuid (GHSA-w5hq-g745-h8pq), an iOS development-tool chain. No forced downgrade/major override was applied to the current compatible Capacitor set. Recheck upstream before release. |

## Safe at source/configuration level

- Existing Vite output is `dist`; web production build and Capacitor sync succeed.
- Core/CLI/Android packages are pinned to the same stable version 8.5.2.
- Bundled local assets, default external navigation boundary and HTTPS local origin; no remote app server, cleartext enablement or navigation wildcard.
- Password sign-in uses normal Supabase browser client; frontend reads only URL and publishable-key env names. Backend source/migrations are unchanged.
- MIME validation and receipt storage remain existing finance behavior; no new finance features.
- No unrelated Android runtime permission. Native app label is Kira; SDK/version/app-ID values are recorded in ANDROID.md.
- Existing logo/icon files are preserved; generated Android template art is explicitly provisional.
- Release has no signingConfig; debug uses the pre-existing local development keystore. Git ignores key files and build outputs.

## Local verification scope

`tests/android-compat.test.cjs` evaluates actual app functions with mocked native/browser boundaries: reset URL, installed status, push support, service-worker bootstrap, receipt navigation and error handling. These checks never contact Supabase and do not replace phone testing. Vite compiles the entire frontend; Android Gradle compiles/packages the native wrapper. See the build-results report for exact outcomes, sizes and hashes.
