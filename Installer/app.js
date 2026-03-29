import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";

function getDateTimeCacheBust() {
    return new Date().toISOString();
}

function getRandomCacheBust() {
    return Date.now() + "-" + Math.random();
}

async function loadFirmwareVersions() {
    const versionsUrl = "@firmware-versions.json?v=" + encodeURIComponent(getRandomCacheBust());
    const response = await fetch(versionsUrl, { cache: "no-store" });

    if (!response.ok) {
        throw new Error("HTTP " + response.status + " while loading " + versionsUrl);
    }

    const versions = await response.json();

    if (!Array.isArray(versions) || versions.length === 0) {
        throw new Error("Firmware versions JSON is empty or invalid.");
    }

    return versions;
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
    const androidGuideLink = document.getElementById("androidGuideLink");

    if (latestBtn) {
        latestBtn.setAttribute(
            "manifest",
            "manifest-latest.json?v=" + encodeURIComponent(getDateTimeCacheBust())
        );
    }

    if (sel && olderBtn) {
        try {
            const versions = await loadFirmwareVersions();
            populateFirmwareSelect(sel, versions);

            const updateOlderManifest = () => {
                olderBtn.setAttribute(
                    "manifest",
                    sel.value + "?v=" + encodeURIComponent(getDateTimeCacheBust())
                );
            };

            sel.addEventListener("change", updateOlderManifest);
            updateOlderManifest();
        } catch (error) {
            console.error(error);

            sel.innerHTML = "";
            const option = document.createElement("option");
            option.textContent = "Unable to load versions";
            option.value = "";
            sel.appendChild(option);
            sel.disabled = true;

            olderBtn.setAttribute("manifest", "");
        }
    }

    if (androidGuideLink) {
        androidGuideLink.setAttribute(
            "href",
            "android-guide.html?v=" + encodeURIComponent(getRandomCacheBust())
        );
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

function initialize() {
    updateFirmwareInstaller();
    loadAndroidGuide();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize);
} else {
    initialize();
}