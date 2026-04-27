import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";

function getDateTimeCacheBust() {
    return new Date().toISOString();
}

function getRandomCacheBust() {
    return Date.now() + "-" + Math.random();
}

function appendCacheBusterToAnchors() {
    const cacheBust = encodeURIComponent(getRandomCacheBust());
    const links = document.querySelectorAll("a[href]");

    for (const link of links) {
        const href = link.getAttribute("href");

        if (
            !href ||
            href.startsWith("#") ||
            href.startsWith("mailto:") ||
            href.startsWith("tel:") ||
            href.startsWith("javascript:")
        ) {
            continue;
        }

        try {
            const url = new URL(href, window.location.href);

            if (url.searchParams.has("v")) {
                continue;
            }

            url.searchParams.set("v", cacheBust);
            link.setAttribute("href", url.toString());
        } catch {
            const separator = href.includes("?") ? "&" : "?";
            link.setAttribute("href", href + separator + "v=" + cacheBust);
        }
    }
}

async function loadFirmwareVersions() {
    const versionsUrl = "@firmware-versions.json?v=" + encodeURIComponent(getRandomCacheBust());
    const response = await fetch(versionsUrl, { cache: "no-store" });

    if (!response.ok) {
        throw new Error("HTTP " + response.status + " while loading " + versionsUrl);
    }

    const firmwareData = await response.json();

    if (
        !firmwareData ||
        typeof firmwareData !== "object" ||
        !Array.isArray(firmwareData.versions) ||
        firmwareData.versions.length === 0
    ) {
        throw new Error("Firmware versions JSON is empty or invalid.");
    }

    return firmwareData;
}

async function loadAndroidVersion() {
    const versionUrl = "downloads/version.txt?v=" + encodeURIComponent(getRandomCacheBust());
    const response = await fetch(versionUrl, { cache: "no-store" });

    if (!response.ok) {
        throw new Error("HTTP " + response.status + " while loading " + versionUrl);
    }

    const version = (await response.text()).trim();

    if (!version) {
        throw new Error("Android version text file is empty.");
    }

    return version;
}

function populateFirmwareSelect(sel, versions) {
    sel.innerHTML = "";

    for (const version of versions) {
        const option = document.createElement("option");
        option.value = version.manifest;
        option.textContent = version.label;
        sel.appendChild(option);
    }

    const preferredVersion = versions.find((version) => version.selected === true);
    if (preferredVersion) {
        sel.value = preferredVersion.manifest;
    } else {
        sel.selectedIndex = 0;
    }
}

async function updateFirmwareInstaller() {
    const sel = document.getElementById("fwSel");
    const olderBtn = document.getElementById("olderBtn");
    const latestBtn = document.getElementById("latestBtn");
    const latestVersionLabel = document.getElementById("latestVersionLabel");
    const androidGuideLink = document.getElementById("androidGuideLink");
    const androidApkLink = document.getElementById("androidApkLink");

    try {
        const firmwareData = await loadFirmwareVersions();
        const versions = firmwareData.versions;
        const latestVersion = firmwareData.latest;

        if (latestBtn && latestVersion) {
            latestBtn.setAttribute(
                "manifest",
                "manifest-" + latestVersion + ".json?v=" + encodeURIComponent(getDateTimeCacheBust())
            );
        }

        if (latestVersionLabel) {
            latestVersionLabel.textContent = latestVersion ? "v" + latestVersion : "";
        }

        if (sel && olderBtn) {
            populateFirmwareSelect(sel, versions);

            const updateOlderManifest = () => {
                olderBtn.setAttribute(
                    "manifest",
                    sel.value + "?v=" + encodeURIComponent(getDateTimeCacheBust())
                );
            };

            sel.addEventListener("change", updateOlderManifest);
            updateOlderManifest();
        }
    } catch (error) {
        console.error(error);

        if (latestVersionLabel) {
            latestVersionLabel.textContent = "";
        }

        if (sel) {
            sel.innerHTML = "";
            const option = document.createElement("option");
            option.textContent = "Unable to load versions";
            option.value = "";
            sel.appendChild(option);
            sel.disabled = true;
        }

        if (olderBtn) {
            olderBtn.setAttribute("manifest", "");
        }

        if (latestBtn) {
            latestBtn.setAttribute("manifest", "");
        }
    }

    if (androidGuideLink) {
        androidGuideLink.setAttribute(
            "href",
            "android-guide.html?v=" + encodeURIComponent(getRandomCacheBust())
        );
    }

    if (androidApkLink) {
        androidApkLink.setAttribute(
            "href",
            "downloads/poor-mans-throttle-latest.apk?v=" + encodeURIComponent(getRandomCacheBust())
        );

        try {
            const androidVersion = await loadAndroidVersion();
            androidApkLink.textContent = "Download Android version " + androidVersion;
        } catch (error) {
            console.error(error);
            androidApkLink.textContent = "Download LatestAndroid version";
        }
    }
}

async function loadAndroidGuide() {
    const target = document.getElementById("guideContent");
    if (!target) {
        return;
    }

    const pathBase = window.location.pathname.includes("/PoorMansThrottle-DIY/")
        ? "/PoorMansThrottle-DIY"
        : "";

    const markdownCacheBust = encodeURIComponent(getRandomCacheBust());
    const guideUrl =
        pathBase + "/docs/10_mobile_device_installation_instructions.md?v=" + markdownCacheBust;

    try {
        const response = await fetch(guideUrl, { cache: "no-store" });

        if (!response.ok) {
            throw new Error("HTTP " + response.status + " while loading " + guideUrl);
        }

        const markdown = await response.text();

        if (!markdown.trim()) {
            target.innerHTML =
                "<p class=\"note warn\">The Markdown file loaded, but it appears to be empty.</p>";
            return;
        }

        target.innerHTML = marked.parse(markdown);
    } catch (error) {
        target.innerHTML =
            "<p class=\"note warn\">Unable to load the Android installation instructions.</p>" +
            "<p class=\"note\">Details: " + String(error.message) + "</p>";
        console.error(error);
    }
}

async function initialize() {
    await updateFirmwareInstaller();
    appendCacheBusterToAnchors();
    await loadAndroidGuide();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize);
} else {
    initialize();
}