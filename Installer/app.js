import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";

function getDateTimeCacheBust() {
    return new Date().toISOString();
}

function getRandomCacheBust() {
    return Date.now() + "-" + Math.random();
}

function updateFirmwareInstaller() {
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
        const updateOlderManifest = () => {
            olderBtn.setAttribute(
                "manifest",
                sel.value + "?v=" + encodeURIComponent(getDateTimeCacheBust())
            );
        };

        sel.addEventListener("change", updateOlderManifest);
        updateOlderManifest();
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