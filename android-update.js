import { Capacitor } from "@capacitor/core";
import { App } from "@capacitor/app";
import { Browser } from "@capacitor/browser";

const UPDATE_METADATA_URL =
    "https://kiraapp.vercel.app/android-version.json";

const RESUME_CHECK_INTERVAL_MS =
    6 * 60 * 60 * 1000;

const DISMISS_INTERVAL_MS =
    24 * 60 * 60 * 1000;

const LAST_CHECK_KEY =
    "kira.androidUpdate.lastCheck";

const DISMISSED_KEY =
    "kira.androidUpdate.dismissed";

let checkedThisSession =
    false;

let activePromptKey =
    null;

let activeDownloadUrl =
    null;

let previouslyFocusedElement =
    null;


function isAndroidNative() {

    return (
        Capacitor.isNativePlatform()
        &&
        Capacitor.getPlatform() ===
            "android"
    );
}


function parseVersionCode(value) {

    const parsed =
        Number.parseInt(
            String(value ?? ""),
            10
        );

    return Number.isFinite(parsed)
        ? parsed
        : null;
}


function compareVersionNames(
    first,
    second
) {

    const firstParts =
        String(first || "")
            .split("-")[0]
            .split(".")
            .map(
                part =>
                    Number.parseInt(
                        part,
                        10
                    ) || 0
            );

    const secondParts =
        String(second || "")
            .split("-")[0]
            .split(".")
            .map(
                part =>
                    Number.parseInt(
                        part,
                        10
                    ) || 0
            );

    const length =
        Math.max(
            firstParts.length,
            secondParts.length
        );

    for (
        let index = 0;
        index < length;
        index += 1
    ) {

        const firstValue =
            firstParts[index] || 0;

        const secondValue =
            secondParts[index] || 0;

        if (
            firstValue >
            secondValue
        ) {
            return 1;
        }

        if (
            firstValue <
            secondValue
        ) {
            return -1;
        }
    }

    return 0;
}


export function isUpdateAvailable(
    current,
    latest
) {

    const currentCode =
        parseVersionCode(
            current?.build
        );

    const latestCode =
        parseVersionCode(
            latest?.versionCode
        );

    if (
        currentCode !== null &&
        latestCode !== null
    ) {

        return (
            latestCode >
            currentCode
        );
    }

    return (
        compareVersionNames(
            latest?.versionName,
            current?.version
        ) > 0
    );
}


function sanitizeDownloadUrl(
    value
) {

    if (!value) {
        return null;
    }

    try {

        const url =
            new URL(
                String(value)
            );

        if (
            url.protocol !==
            "https:"
        ) {
            return null;
        }

        return url.href;

    } catch {

        return null;
    }
}


function normalizeMetadata(
    data
) {

    if (
        !data ||
        typeof data !==
            "object"
    ) {
        return null;
    }

    const versionCode =
        parseVersionCode(
            data.versionCode
        );

    const versionName =
        String(
            data.versionName || ""
        ).trim();

    if (
        versionCode === null &&
        !versionName
    ) {
        return null;
    }

    let releaseNotes =
        [];

    if (
        Array.isArray(
            data.releaseNotes
        )
    ) {

        releaseNotes =
            data.releaseNotes
                .map(
                    note =>
                        String(note)
                            .trim()
                )
                .filter(Boolean)
                .slice(0, 8);

    } else if (
        data.releaseNotes
    ) {

        releaseNotes = [
            String(
                data.releaseNotes
            ).trim()
        ];
    }

    return {
        versionCode,
        versionName,
        downloadUrl:
            sanitizeDownloadUrl(
                data.downloadUrl
            ),
        releaseNotes,
        publishedAt:
            data.publishedAt || null
    };
}


async function fetchLatestVersion() {

    const controller =
        new AbortController();

    const timeout =
        window.setTimeout(
            () =>
                controller.abort(),
            8000
        );

    try {

        const response =
            await fetch(
                `${UPDATE_METADATA_URL}?t=${Date.now()}`,
                {
                    cache:
                        "no-store",

                    signal:
                        controller.signal
                }
            );

        if (!response.ok) {

            throw new Error(
                `Update metadata returned HTTP ${response.status}.`
            );
        }

        return normalizeMetadata(
            await response.json()
        );

    } finally {

        window.clearTimeout(
            timeout
        );
    }
}


function getVersionKey(
    metadata
) {

    if (
        metadata.versionCode !==
        null
    ) {

        return `code:${metadata.versionCode}`;
    }

    return `name:${metadata.versionName}`;
}


function wasRecentlyDismissed(
    versionKey
) {

    try {

        const stored =
            JSON.parse(
                localStorage.getItem(
                    DISMISSED_KEY
                )
            );

        return (
            stored?.versionKey ===
                versionKey
            &&
            Number(stored?.until) >
                Date.now()
        );

    } catch {

        return false;
    }
}


function saveDismissedVersion(
    versionKey
) {

    localStorage.setItem(
        DISMISSED_KEY,
        JSON.stringify({
            versionKey,

            until:
                Date.now() +
                DISMISS_INTERVAL_MS
        })
    );
}


function ensureUpdateUi() {

    let overlay =
        document.getElementById(
            "kira-android-update"
        );

    if (overlay) {
        return overlay;
    }

    overlay =
        document.createElement(
            "div"
        );

    overlay.id =
        "kira-android-update";

    overlay.className =
        "kira-update-overlay";

    overlay.hidden =
        true;

    overlay.innerHTML = `
        <div class="kira-update-backdrop"></div>

        <section
            class="kira-update-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="kira-update-title"
        >
            <div class="kira-update-icon" aria-hidden="true">
                ↑
            </div>

            <h2 id="kira-update-title">
                Kira Update Available
            </h2>

            <p class="kira-update-description">
                A newer Android version of Kira is available.
            </p>

            <div class="kira-update-versions">
                <span>
                    Current
                    <strong id="kira-update-current-version"></strong>
                </span>

                <span>
                    Latest
                    <strong id="kira-update-latest-version"></strong>
                </span>
            </div>

            <div
                id="kira-update-release-section"
                class="kira-update-release-section"
            >
                <strong>What's new</strong>

                <ul id="kira-update-release-notes"></ul>
            </div>

            <p
                id="kira-update-no-download"
                class="kira-update-no-download"
                hidden
            >
                Contact the app owner for the latest APK.
            </p>

            <div class="kira-update-actions">

                <button
                    type="button"
                    id="kira-update-later"
                    class="kira-update-later"
                >
                    Later
                </button>

                <button
                    type="button"
                    id="kira-update-download"
                    class="kira-update-download"
                >
                    Download Update
                </button>

            </div>
        </section>
    `;

    document.body.appendChild(
        overlay
    );

    overlay
        .querySelector(
            ".kira-update-backdrop"
        )
        ?.addEventListener(
            "click",
            () =>
                closeUpdatePrompt(
                    true
                )
        );

    document
        .getElementById(
            "kira-update-later"
        )
        ?.addEventListener(
            "click",
            () =>
                closeUpdatePrompt(
                    true
                )
        );

    document
        .getElementById(
            "kira-update-download"
        )
        ?.addEventListener(
            "click",
            downloadUpdate
        );

    overlay.addEventListener(
        "keydown",
        function (
            event
        ) {

            if (
                event.key ===
                "Escape"
            ) {

                event.preventDefault();

                closeUpdatePrompt(
                    true
                );
            }
        }
    );

    return overlay;
}


function closeUpdatePrompt(
    rememberDismissal = false
) {

    const overlay =
        document.getElementById(
            "kira-android-update"
        );

    if (!overlay) {
        return;
    }

    if (
        rememberDismissal &&
        activePromptKey
    ) {

        saveDismissedVersion(
            activePromptKey
        );
    }

    overlay.hidden =
        true;

    document.body.classList.remove(
        "kira-update-open"
    );

    activePromptKey =
        null;

    activeDownloadUrl =
        null;

    previouslyFocusedElement
        ?.focus?.();

    previouslyFocusedElement =
        null;
}


async function downloadUpdate() {

    if (
        !activeDownloadUrl
    ) {
        return;
    }

    const url =
        activeDownloadUrl;

    closeUpdatePrompt(
        true
    );

    try {

        await Browser.open({
            url
        });

    } catch (
        error
    ) {

        console.warn(
            "Unable to open Kira update download:",
            error
        );
    }
}


function showUpdatePrompt(
    current,
    latest
) {

    const versionKey =
        getVersionKey(
            latest
        );

    if (
        wasRecentlyDismissed(
            versionKey
        )
    ) {
        return;
    }

    const overlay =
        ensureUpdateUi();

    const currentVersion =
        document.getElementById(
            "kira-update-current-version"
        );

    const latestVersion =
        document.getElementById(
            "kira-update-latest-version"
        );

    const releaseSection =
        document.getElementById(
            "kira-update-release-section"
        );

    const releaseNotes =
        document.getElementById(
            "kira-update-release-notes"
        );

    const downloadButton =
        document.getElementById(
            "kira-update-download"
        );

    const noDownload =
        document.getElementById(
            "kira-update-no-download"
        );

    currentVersion.textContent =
        current.version ||
        String(
            current.build ||
            "Unknown"
        );

    latestVersion.textContent =
        latest.versionName ||
        String(
            latest.versionCode
        );

    releaseNotes.replaceChildren();

    if (
        latest.releaseNotes.length
    ) {

        releaseSection.hidden =
            false;

        latest.releaseNotes
            .forEach(
                function (
                    note
                ) {

                    const item =
                        document.createElement(
                            "li"
                        );

                    item.textContent =
                        note;

                    releaseNotes
                        .appendChild(
                            item
                        );
                }
            );

    } else {

        releaseSection.hidden =
            true;
    }

    activeDownloadUrl =
        latest.downloadUrl;

    downloadButton.hidden =
        !activeDownloadUrl;

    noDownload.hidden =
        Boolean(
            activeDownloadUrl
        );

    activePromptKey =
        versionKey;

    previouslyFocusedElement =
        document.activeElement;

    overlay.hidden =
        false;

    document.body.classList.add(
        "kira-update-open"
    );

    window.setTimeout(
        function () {

            document
                .getElementById(
                    "kira-update-later"
                )
                ?.focus();
        },
        50
    );
}


export async function checkForAndroidUpdate({
    resume = false
} = {}) {

    if (
        !isAndroidNative()
    ) {
        return;
    }

    if (
        !resume &&
        checkedThisSession
    ) {
        return;
    }

    if (resume) {

        const lastCheck =
            Number(
                localStorage.getItem(
                    LAST_CHECK_KEY
                )
            ) || 0;

        if (
            Date.now() -
                lastCheck <
            RESUME_CHECK_INTERVAL_MS
        ) {
            return;
        }
    }

    try {

        const [
            current,
            latest
        ] =
            await Promise.all([
                App.getInfo(),
                fetchLatestVersion()
            ]);

        if (!latest) {
            return;
        }

        checkedThisSession =
            true;

        localStorage.setItem(
            LAST_CHECK_KEY,
            String(
                Date.now()
            )
        );

        if (
            !isUpdateAvailable(
                current,
                latest
            )
        ) {
            return;
        }

        showUpdatePrompt(
            current,
            latest
        );

    } catch (
        error
    ) {

        console.info(
            "Kira update check skipped:",
            error?.message ||
            error
        );
    }
}


function initializeAndroidUpdateChecker() {

    if (
        !isAndroidNative()
    ) {
        return;
    }

    ensureUpdateUi();

    window.addEventListener(
        "kira:app-ready",
        () =>
            checkForAndroidUpdate()
    );

    window.addEventListener(
        "kira:close-update",
        () =>
            closeUpdatePrompt(
                true
            )
    );

    void App.addListener(
        "appStateChange",
        function (
            state
        ) {

            if (
                state.isActive
            ) {

                void checkForAndroidUpdate({
                    resume:
                        true
                });
            }
        }
    );

    const financeApp =
        document.getElementById(
            "finance-app"
        );

    if (
        financeApp?.style.display ===
        "block"
    ) {

        window.setTimeout(
            () =>
                checkForAndroidUpdate(),
            500
        );
    }
}


initializeAndroidUpdateChecker();
