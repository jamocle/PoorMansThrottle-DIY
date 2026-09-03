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
            const hostname = (url.hostname || "").toLowerCase();

            if (hostname === "youtu.be" || hostname === "www.youtu.be") {
                continue;
            }

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

const manifestUrls = new WeakMap();

async function loadFirmwareVersions() {
    const versionsUrl = "@firmware-versions.json?v=" + encodeURIComponent(getRandomCacheBust());
    const response = await fetch(versionsUrl, { cache: "no-store" });

    if (!response.ok) {
        throw new Error("HTTP " + response.status + " while loading " + versionsUrl);
    }

    const firmwareData = await response.json();

    if (
        !firmwareData ||
        firmwareData.schemaVersion !== 2 ||
        typeof firmwareData.boards !== "object" ||
        firmwareData.boards === null
    ) {
        throw new Error("Firmware versions JSON is missing the expected board catalog.");
    }

    for (const [boardKey, board] of Object.entries(firmwareData.boards)) {
        validateBoardConfiguration(boardKey, board);
    }

    return firmwareData;
}

function validateBoardConfiguration(boardKey, board) {
    if (
        !board ||
        typeof board.label !== "string" ||
        typeof board.image !== "string" ||
        typeof board.chipFamily !== "string" ||
        typeof board.firmwareDirectory !== "string" ||
        !board.firmwareDirectory.includes("{version}") ||
        typeof board.latest !== "string" ||
        typeof board.dropdownDefault !== "string" ||
        !Array.isArray(board.parts) ||
        board.parts.length === 0 ||
        !Array.isArray(board.versions) ||
        board.versions.length === 0
    ) {
        throw new Error("Firmware board configuration is invalid for " + boardKey + ".");
    }

    const versions = new Set();

    for (const release of board.versions) {
        if (!release || typeof release.version !== "string" || !release.version.trim()) {
            throw new Error("Firmware release is invalid for " + boardKey + ".");
        }

        if (versions.has(release.version)) {
            throw new Error("Duplicate firmware version " + release.version + " for " + boardKey + ".");
        }

        versions.add(release.version);
    }

    if (!versions.has(board.latest)) {
        throw new Error("Latest firmware " + board.latest + " is not listed for " + boardKey + ".");
    }

    if (!versions.has(board.dropdownDefault)) {
        throw new Error(
            "Dropdown default firmware " + board.dropdownDefault + " is not listed for " + boardKey + "."
        );
    }

    for (const part of board.parts) {
        if (
            !part ||
            typeof part.file !== "string" ||
            !part.file.trim() ||
            !Number.isInteger(part.offset) ||
            part.offset < 0
        ) {
            throw new Error("Firmware flash part is invalid for " + boardKey + ".");
        }
    }
}

function getRelease(board, version) {
    return board.versions.find((release) => release.version === version) ?? null;
}

function getReleaseLabel(release) {
    return release.label || "v" + release.version;
}

function getFirmwareDirectoryUrl(board, version) {
    const encodedVersion = encodeURIComponent(version);
    const relativeDirectory = board.firmwareDirectory.replace("{version}", encodedVersion);
    return new URL(relativeDirectory, window.location.href);
}

function createManifestUrl(board, release) {
    const firmwareDirectoryUrl = getFirmwareDirectoryUrl(board, release.version);

    const manifest = {
        name: "Poor Man's Throttle - " + board.label,
        version: release.version,
        new_install_prompt_erase: true,
        builds: [
            {
                chipFamily: board.chipFamily,
                parts: board.parts.map((part) => ({
                    path: new URL(part.file, firmwareDirectoryUrl).href,
                    offset: part.offset
                }))
            }
        ]
    };

    const blob = new Blob([JSON.stringify(manifest)], { type: "application/json" });
    return URL.createObjectURL(blob);
}

function setInstallButtonManifest(button, board, release) {
    const previousUrl = manifestUrls.get(button);
    if (previousUrl) {
        URL.revokeObjectURL(previousUrl);
    }

    const manifestUrl = createManifestUrl(board, release);
    manifestUrls.set(button, manifestUrl);
    button.setAttribute("manifest", manifestUrl);
}

function clearInstallButtonManifest(button) {
    if (!button) {
        return;
    }

    const previousUrl = manifestUrls.get(button);
    if (previousUrl) {
        URL.revokeObjectURL(previousUrl);
        manifestUrls.delete(button);
    }

    button.setAttribute("manifest", "");
}

function populateFirmwareSelect(select, board) {
    select.innerHTML = "";

    for (const release of board.versions) {
        const option = document.createElement("option");
        option.value = release.version;
        option.textContent = getReleaseLabel(release);
        select.appendChild(option);
    }

    select.value = board.dropdownDefault;

    if (!select.value && select.options.length > 0) {
        select.selectedIndex = 0;
    }
}

function setBoardChoiceState(selectedBoardKey) {
    const choices = document.querySelectorAll(".board-choice[data-board]");

    for (const choice of choices) {
        const isSelected = choice.dataset.board === selectedBoardKey;
        choice.setAttribute("aria-pressed", String(isSelected));
        choice.classList.toggle("is-selected", isSelected);

        const action = choice.querySelector(".board-choice-action");
        if (action) {
            action.textContent = isSelected ? "Selected" : "I have this board";
        }
    }
}

function isLocalPreviewEnvironment() {
    const protocol = window.location.protocol.toLowerCase();
    return protocol !== "http:" && protocol !== "https:";
}

function showFirmwareLoadError() {
    const errorCard = document.getElementById("firmwareLoadError");
    const panel = document.getElementById("boardInstallPanel");

    if (errorCard) {
        const isPreview = isLocalPreviewEnvironment();
        const kicker = errorCard.querySelector(".card-kicker");
        const heading = errorCard.querySelector("h3");
        const message = errorCard.querySelector(".note");

        errorCard.classList.toggle("firmware-preview-card", isPreview);
        errorCard.setAttribute("role", isPreview ? "status" : "alert");

        if (isPreview) {
            if (kicker) {
                kicker.textContent = "Preview mode";
            }

            if (heading) {
                heading.textContent = "Firmware controls load on the hosted website.";
            }

            if (message) {
                message.textContent =
                    "This editor preview can still be used to check the page layout. " +
                    "Use the hosted HTTPS website in Chrome or Edge to install firmware.";
            }
        } else {
            if (kicker) {
                kicker.textContent = "Installer problem";
            }

            if (heading) {
                heading.textContent = "Firmware information could not be loaded.";
            }

            if (message) {
                message.textContent =
                    "Refresh this page and try again. If the message returns, please contact " +
                    "Poor Man's Throttle support before flashing.";
            }
        }

        errorCard.hidden = false;
    }

    if (panel) {
        panel.hidden = true;
    }
}

async function updateFirmwareInstaller() {
    const boardChoices = document.querySelectorAll(".board-choice[data-board]");
    const panel = document.getElementById("boardInstallPanel");
    const selectedBoardName = document.getElementById("selectedBoardName");
    const selectedBoardImage = document.getElementById("selectedBoardImage");
    const sel = document.getElementById("fwSel");
    const olderBtn = document.getElementById("olderBtn");
    const latestBtn = document.getElementById("latestBtn");
    const latestVersionLabel = document.getElementById("latestVersionLabel");
    const dropdownDefaultNote = document.getElementById("dropdownDefaultNote");
    const androidGuideLink = document.getElementById("androidGuideLink");
    const androidApkLink = document.getElementById("androidApkLink");

    if (
        boardChoices.length > 0 &&
        panel &&
        selectedBoardName &&
        selectedBoardImage &&
        sel &&
        olderBtn &&
        latestBtn &&
        latestVersionLabel
    ) {
        try {
            const firmwareData = await loadFirmwareVersions();

            const selectBoard = (boardKey) => {
                const board = firmwareData.boards[boardKey];

                if (!board) {
                    console.error("Unknown firmware board: " + boardKey);
                    showFirmwareLoadError();
                    return;
                }

                const latestRelease = getRelease(board, board.latest);
                const dropdownRelease = getRelease(board, board.dropdownDefault);

                if (!latestRelease || !dropdownRelease) {
                    console.error("Firmware version configuration is incomplete for " + boardKey + ".");
                    showFirmwareLoadError();
                    return;
                }

                setBoardChoiceState(boardKey);

                selectedBoardName.textContent = board.label;
                selectedBoardImage.src = board.image;
                selectedBoardImage.alt = board.label + " board";
                selectedBoardImage.dataset.board = boardKey;

                latestVersionLabel.textContent = "Version " + board.latest;
                populateFirmwareSelect(sel, board);

                setInstallButtonManifest(latestBtn, board, latestRelease);

                const updateSelectedManifest = () => {
                    const selectedRelease = getRelease(board, sel.value);
                    if (!selectedRelease) {
                        clearInstallButtonManifest(olderBtn);
                        return;
                    }

                    setInstallButtonManifest(olderBtn, board, selectedRelease);
                };

                sel.onchange = updateSelectedManifest;
                updateSelectedManifest();

                if (dropdownDefaultNote) {
                    dropdownDefaultNote.textContent =
                        "This list opens on " + getReleaseLabel(dropdownRelease) +
                        ". You can choose any version shown before installing.";
                }

                panel.hidden = false;
            };

            for (const choice of boardChoices) {
                choice.addEventListener("click", () => {
                    selectBoard(choice.dataset.board);
                });
            }
        } catch (error) {
            console.error(error);
            showFirmwareLoadError();
            clearInstallButtonManifest(olderBtn);
            clearInstallButtonManifest(latestBtn);
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
            androidApkLink.textContent = "Download latest Android version";
        }
    }
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
window.addEventListener("pagehide", () => {
    for (const button of document.querySelectorAll("esp-web-install-button")) {
        clearInstallButtonManifest(button);
    }
});
