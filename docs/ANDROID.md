# Kira — Phase 17 Android packaging

Local preparation only. Phase 1–16 finance features and backend configuration are unchanged. This is a test package, not a release approval. See `ANDROID-AUDIT.md` for remaining release gates.

## Configuration

- Capacitor core/CLI/Android: pinned to **8.5.2**, with npm lockfile.
- App label: **Kira**. App ID/namespace: **com.kira.finance**, provisional; confirm ownership and final value before signing or Play registration.
- Web assets: Vite `dist`, bundled locally; no remote `server.url` or `allowNavigation` wildcard.
- Android local origin: `https://localhost`; cleartext disabled.
- Minimum SDK **24** (Android 7); compile/target SDK **36** (Android 16).
- Android Gradle Plugin **8.13.0**, wrapper **8.14.3**; Java 21.
- `versionCode 1`, `versionName 1.0`: placeholders requiring confirmation before first release.
- SystemBars native insets with viewport `auto`; keep the existing web viewport unchanged. `adjustResize` requests keyboard resizing. Physical-device verification is mandatory.
- Android backup disabled; Android 12+ cloud-backup and device-transfer rules exclude all storage domains to reduce copying of WebView sessions. Some OEM device-transfer behavior can differ; verify before release.
- Template launcher/splash images remain placeholders. Existing Kira artwork is available under `public/`, but approved Android adaptive/monochrome icon and splash exports are still pending. No new branding was invented.
- App manifest requests only INTERNET. The merged manifest also contains AndroidX's app-scoped signature permission `com.kira.finance.DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION`; this is not a user/runtime permission. No camera, broad storage, location, microphone, contacts, or notification permissions were added.

## Detected prerequisites on this Windows machine

Node 24.20.0; npm 11.19.0; Git available; Temurin JDK 21.0.12.1; Android Studio and SDK/ADB installed. SDK Platform 36 was installed by Gradle using an already accepted SDK license. Build-tools 36.0.0 was already present. No device or AVD was found.

`ANDROID_HOME` exists in the Windows user environment, but the agent's inherited process environment did not have it. Set it for a fresh PowerShell session if necessary:

```powershell
Set-Location C:\Users\WanNuredrienaIqbalBi\Documents\Projects\finance-app
$env:ANDROID_HOME = [Environment]::GetEnvironmentVariable('ANDROID_HOME', 'User')
```

Use the existing private `.env` frontend URL/publishable key for the intended environment. Only the URL and publishable key belong in client bundles; never supply service-role keys or backend secrets. The APK can contact that configured backend when run. This preparation did not log in, execute app operations, or modify production.

## Rebuild

```powershell
npm.cmd ci
npm.cmd run build
npx.cmd cap sync android
node --test tests/android-compat.test.cjs
```

On this host, Java's default Windows temporary socket path caused `Unable to establish loopback connection` / `UnixDomainSockets` / `Invalid argument: connect`. A normal writable socket directory fixed it. Apply this process-only workaround before Gradle (no permanent Java/system changes):

```powershell
$socketDir = 'C:\Users\WanNuredrienaIqbalBi\Documents\Codex\work\jtmp'
New-Item -ItemType Directory -Force $socketDir | Out-Null
$env:JAVA_TOOL_OPTIONS = '-Djdk.net.unixdomain.tmpdir=C:/Users/WanNuredrienaIqbalBi/Documents/Codex/work/jtmp'
```

On another machine choose a short, writable path. Keep JDK 21 selected; Android Studio's bundled JDK 25 was not the successful build runtime.

```powershell
# Do not generate a new keystore during this preparation.
if (!(Test-Path "$env:USERPROFILE\.android\debug.keystore")) {
    throw 'Existing debug keystore missing; stop before creating signing material.'
}
.\android\gradlew.bat -p android assembleDebug assembleRelease bundleRelease --no-daemon --console=plain
```

Convenience scripts: `npm run android:sync`, `npm run android:debug`, `npm run android:release:unsigned`. The latter two target Windows; environment setup above still applies. Gradle normally auto-creates a debug keystore if absent, so perform the guard above when keeping the no-new-keystore constraint. An existing debug keystore was reused on this machine, without reading or exposing key contents/passwords.

Expected output paths relative to repo:

- Debug APK: `android/app/build/outputs/apk/debug/app-debug.apk`
- Unsigned release APK: `android/app/build/outputs/apk/release/app-release-unsigned.apk`
- Unsigned release AAB: `android/app/build/outputs/bundle/release/app-release.aab`

Release signing is deliberately unconfigured. An unsigned AAB is build evidence, not upload/install readiness. Build outputs, copied web assets, local SDK settings and signing files are ignored by Git.

## Physical phone checklist — Phase 17D, next week

1. Enable Developer Options and USB debugging; connect USB and approve the computer on the phone.
2. Run `& "$env:ANDROID_HOME\platform-tools\adb.exe" devices`; require `device`, not `unauthorized`.
3. Install debug APK with `& "$env:ANDROID_HOME\platform-tools\adb.exe" install -r .\android\app\build\outputs\apk\debug\app-debug.apk`.
4. Verify cold start, existing-account sign-in, session after force-stop/relaunch/reboot, background/foreground token refresh, logout, and sign-out across sessions using a designated test account/environment.
5. Verify account registration and password-reset emails complete on the configured web Site URL; sign in again in Android afterward. Native deep-link return is not implemented.
6. Exercise picker selection/cancel for JPG/PNG/WebP/PDF, wrong/oversized files, preview, upload, signed receipt opening, returning from browser, and image OCR. PDF storage is supported by source validation; PDF OCR is not assumed supported.
7. Test keyboard focus, amount/date inputs, scrolling, bottom navigation, notches, gesture/three-button navigation, rotation, font scaling, dialogs, Android Back and predictive Back.
8. Test offline startup, failed network operations/retry, airplane mode and reconnect. Do not assume offline financial edits/sync.
9. Verify in-app notifications. Native push is not configured and must not be advertised as available.
10. Treat CSV/JSON export as a known release blocker until a device-proven native save/share path exists; do not trust a downloaded success message alone.
11. Inspect local Logcat for failures without sharing auth tokens, receipt URLs or financial data. Record device model, Android version, WebView version and outcomes.

## Later release decisions and Play Console

- Confirm final application ID, version values, adaptive/monochrome icon and splash artwork.
- Resolve audit release blockers and complete device regression against the existing web/PWA.
- User creates and owns the upload keystore only when ready, with secure backup/recovery and private local/CI signing configuration. Never commit keys/passwords; no passwords are requested here.
- Decide Play App Signing and key custody. Build a signed release AAB and verify its certificate once authorized; keep debug and release identities separate.
- Prepare Play developer account/identity checks, store text and approved screenshots, privacy-policy URL, data-safety declarations based on actual auth/financial/receipt/OCR data flows, content rating, audience, reviewer access and any account-specific testing requirements.
- Recheck current Play target-API and testing policies at submission time, start with the appropriate testing track, obtain explicit submission approval. No Play submission or production changes were performed.

References: [Capacitor Android](https://capacitorjs.com/docs/android), [SystemBars](https://capacitorjs.com/docs/apis/system-bars), [Supabase auth redirects](https://supabase.com/docs/guides/auth/redirect-urls).
