# Phase 17 local build results — 18 September 2026

Repository: C:\Users\WanNuredrienaIqbalBi\Documents\Projects\finance-app

Starting state: clean master, 682e138. Work branch: phase17-android-prep. Local-only changes; no push, GitHub write, Supabase/Vercel production modification, Play upload, or new keystore.

## Completion

| Phase | Result |
| --- | --- |
| 17A | Source readiness audit complete, with release blockers and device-test warnings recorded in ANDROID-AUDIT.md. |
| 17B | Capacitor 8.5.2 integrated; native project generated; Vite build and cap sync pass. |
| 17C | Debug APK built and signature verified using the existing local debug keystore. No runtime/device test. |
| 17E | Non-secret prep complete: Kira label, permanent app.kira.finance ID, first release versionCode 1 / versionName 1.0.0 locked, SDK levels, permission review, HTTPS, backup exclusions, native insets and keyboard setting. Final artwork/version/app ID and runtime validation pending. |
| 17F | Unsigned release APK and AAB generated; release signing remains unconfigured. Signing/release readiness is not complete. |

## Artifacts

All original paths below are relative to the repository above. Copies are included in this task's outputs directory.

| Artifact | Original path | Bytes | Copy |
| --- | --- | ---: | --- |
| Debug APK (development signed) | android/app/build/outputs/apk/debug/app-debug.apk | 5483998 | Kira-debug.apk |
| Release APK (unsigned) | android/app/build/outputs/apk/release/app-release-unsigned.apk | 4199384 | Kira-release-unsigned.apk |
| Release AAB (unsigned) | android/app/build/outputs/bundle/release/app-release.aab | 4032469 | Kira-release-unsigned.aab |

SHA-256:

- Kira-debug.apk: 0E664DA9727FDE0B0F79F9D3DABB74332B8325AEA581CE0F286517F8B01BD93B
- Kira-release-unsigned.apk: D6DBFA76490E251968A3F5FE1536F282F41A9C23532F8ACA15B29789BD2B3063
- Kira-release-unsigned.aab: 9389660B5EE69F802F109527B4CF506D1AE62D8183820D62FCE313221AB1D6FB

All 11 Vite output files were compared by SHA-256 against their packaged entries in each artifact and matched. Debug APK passes apksigner verification. Release APK fails signature verification as expected for an unsigned APK; jarsigner explicitly reports the AAB is unsigned. The Gradle task name signReleaseBundle does not imply a release key was configured.

## Checks

- npm run build: PASS (Vite 8.2.2); npx cap sync android: PASS.
- node --test tests/android-compat.test.cjs: 6/6 PASS; offline mocked-boundary tests, no backend requests.
- JavaScript module syntax: script.js, notifications.js, native-platform.js, supabase.js and public/service-worker.js PASS.
- Final Gradle assembleDebug, assembleRelease, bundleRelease, lintDebug: PASS.
- App lint: 0 errors, 16 warnings. Remaining warnings concern template resources/icons/splash, unused resources and newer Gradle/AndroidX versions. Lint also repeats a DataExtractionRules advisory despite explicit fullBackupContent=false and allowBackup=false for older Android plus Android 12+ exclusion rules; device backup behavior remains a QA item. No blanket suppression was added. Capacitor library lint uses its upstream baseline (six errors filtered by that baseline); this is not a claim that dependencies have no lint issues.
- npm audit --omit=dev: zero vulnerabilities. Full audit: three moderate reports in CLI -> xcode -> uuid; documented, no forced dependency downgrade.
- git diff --check: PASS. Credential-pattern scan of tracked/unignored source and dist: no findings; private env/key files excluded. This is a heuristic scan, not a credential-security guarantee.
- Protected backend/Vercel/PWA/HTML/CSS paths compared with starting master: unchanged. Small frontend changes are gated to native, with web branches tested; full browser/device regression remains pending.

## Local build recovery

Java's default Windows temporary socket location caused a UnixDomainSockets loopback error. A process-only jdk.net.unixdomain.tmpdir override to a writable directory resolved it with JDK 21. No permanent system setting was changed. SDK Platform 36 was installed locally by Gradle under an existing accepted license. Resource linking also failed during the initial build; a sequential processDebugResources retry succeeded, followed by successful complete builds. Always finish cap sync before Gradle; do not sync assets while Gradle is running.

Non-blocking tooling messages include generated flatDir repositories, a duplicate pre-existing Android 35 SDK folder and SDK metadata-version mismatch. Existing SDK directories were not deleted. Generated template example tests were removed rather than counting an addition test or retaining an incorrect template app-ID assertion.

## Remaining gates

Phone next week: install/cold start, auth persistence and resume, web-email recovery, upload picker (JPG/PNG/WebP/PDF), receipt opening/browser return, OCR/network/memory, offline/reconnect, keyboard/safe areas, Back/rotation and in-app notifications.

Before Android distribution: implement/test native export save/share; resolve Back navigation; verify native CSP; decide/implement native push or explicitly accept its absence; finish device regression. These are not automatically solved by connecting a phone. No background push or native auth deep-link support is claimed.

User decisions: final app.kira.finance ID and first release versionCode 1 / versionName 1.0.0 are locked; remaining decisions: adaptive/monochrome icon and splash exports, release/upload keystore ownership and backup, Play App Signing, developer account, privacy/data-safety/listing/reviewer details and submission approval. Never provide passwords in chat or commit keys.

See ANDROID.md for exact commands and the physical-phone checklist. Signing secrets were neither created nor requested.
