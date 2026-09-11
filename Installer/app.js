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

            if (
                url.origin !== window.location.origin ||
                url.searchParams.has("v") ||
                url.searchParams.has("doc")
            ) {
                continue;
            }

            url.searchParams.set("v", cacheBust);
            link.setAttribute("href", url.toString());
        } catch {
            // Leave malformed or unsupported URLs unchanged.
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
    const firmwareCacheBust = getRandomCacheBust();

    const manifest = {
        name: "Poor Man's Throttle - " + board.label,
        version: release.version,
        new_install_prompt_erase: true,
        builds: [
            {
                chipFamily: board.chipFamily,
                parts: board.parts.map((part) => {
                    const firmwareUrl = new URL(part.file, firmwareDirectoryUrl);
                    firmwareUrl.searchParams.set("v", firmwareCacheBust);

                    return {
                        path: firmwareUrl.href,
                        offset: part.offset
                    };
                })
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

function setBoardChoiceState(selectedBoardChoice) {
    const choices = document.querySelectorAll(".board-choice[data-board-choice]");

    for (const choice of choices) {
        const isSelected = choice.dataset.boardChoice === selectedBoardChoice;
        choice.setAttribute("aria-pressed", String(isSelected));
        choice.classList.toggle("is-selected", isSelected);

        const action = choice.querySelector(".board-choice-action");
        if (action) {
            if (isSelected) {
                action.textContent = "Selected";
            } else {
                action.textContent =
                    choice.dataset.boardChoice === "s3"
                        ? "I have an S3 board"
                        : "I have this board";
            }
        }
    }
}

function setS3VariantChoiceState(selectedBoardKey) {
    const choices = document.querySelectorAll(".s3-variant-choice[data-board]");

    for (const choice of choices) {
        const boardKey = choice.dataset.board;
        const isSelected = boardKey === selectedBoardKey;
        choice.setAttribute("aria-pressed", String(isSelected));
        choice.classList.toggle("is-selected", isSelected);

        const action = choice.querySelector(".s3-variant-action");
        if (action) {
            const variantName = boardKey === "s3-n8r8" ? "N8R8" : "N16R8";
            action.textContent = isSelected ? "Selected" : "I have " + variantName;
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
    const s3VariantPanel = document.getElementById("s3VariantPanel");

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

    if (s3VariantPanel) {
        s3VariantPanel.hidden = true;
    }
}

async function updateFirmwareInstaller() {
    const boardChoices = document.querySelectorAll(".board-choice[data-board-choice]");
    const s3VariantChoices = document.querySelectorAll(".s3-variant-choice[data-board]");
    const s3VariantPanel = document.getElementById("s3VariantPanel");
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
        s3VariantChoices.length > 0 &&
        s3VariantPanel &&
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

            const resetInstallSelection = () => {
                panel.hidden = true;
                sel.onchange = null;
                clearInstallButtonManifest(olderBtn);
                clearInstallButtonManifest(latestBtn);
            };

            const selectBoard = (boardKey) => {
                const board = firmwareData.boards[boardKey];

                if (!board) {
                    console.error("Unknown firmware board: " + boardKey);
                    showFirmwareLoadError();
                    resetInstallSelection();
                    return;
                }

                const latestRelease = getRelease(board, board.latest);
                const dropdownRelease = getRelease(board, board.dropdownDefault);

                if (!latestRelease || !dropdownRelease) {
                    console.error("Firmware version configuration is incomplete for " + boardKey + ".");
                    showFirmwareLoadError();
                    resetInstallSelection();
                    return;
                }

                const isS3 = boardKey === "s3" || boardKey === "s3-n8r8";
                setBoardChoiceState(isS3 ? "s3" : "classic");
                setS3VariantChoiceState(isS3 ? boardKey : null);
                s3VariantPanel.hidden = !isS3;

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
                    const selectedChoice = choice.dataset.boardChoice;

                    if (selectedChoice === "classic") {
                        setBoardChoiceState("classic");
                        setS3VariantChoiceState(null);
                        s3VariantPanel.hidden = true;
                        selectBoard("classic");
                        return;
                    }

                    if (selectedChoice === "s3") {
                        setBoardChoiceState("s3");
                        setS3VariantChoiceState(null);
                        s3VariantPanel.hidden = false;

                        // Never keep an old S3 manifest attached while the user is
                        // deciding between N16R8 and N8R8.
                        resetInstallSelection();
                    }
                });
            }

            for (const choice of s3VariantChoices) {
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


function initializeChangelog() {
    const changelogDialog = document.getElementById("changelogDialog");
    const closeChangelogButton = document.getElementById("closeChangelogButton");
    const changelogStatus = document.getElementById("changelogStatus");
    const changelogContent = document.getElementById("changelogContent");
    const changelogTabs = Array.from(document.querySelectorAll(".changelog-tab"));
    const changelogOpenButtons = Array.from(document.querySelectorAll("[data-open-changelog]"));

    if (
        !changelogDialog ||
        !closeChangelogButton ||
        !changelogStatus ||
        !changelogContent ||
        changelogTabs.length === 0 ||
        changelogOpenButtons.length === 0
    ) {
        return;
    }

    const changelogSources = {
        app: {
            label: "App",
            fileName: "CHANGELOG_App.md",
            path: "../CHANGELOG_App.md"
        },
        firmware: {
            label: "Firmware",
            fileName: "CHANGELOG_Firmware.md",
            path: "../CHANGELOG_Firmware.md"
        }
    };

    let activeChangelog = "app";

    function addChangelogCacheBuster(url) {
        const cacheBustedUrl = new URL(url, window.location.href);
        cacheBustedUrl.searchParams.set("v", getRandomCacheBust());
        return cacheBustedUrl.href;
    }

    function escapeHtml(value) {
        return String(value)
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll("\"", "&quot;")
            .replaceAll("'", "&#39;");
    }

    function sanitizeMarkdownHref(rawHref) {
        const href = String(rawHref || "").trim();
        if (!href) {
            return null;
        }

        try {
            const url = new URL(href, window.location.href);
            if (url.protocol === "http:" || url.protocol === "https:" || url.protocol === "mailto:") {
                return url.href;
            }

            if (
                url.origin === window.location.origin &&
                (url.protocol === "file:" || url.protocol === window.location.protocol)
            ) {
                return url.href;
            }
        } catch {
            return null;
        }

        return null;
    }

    function renderInlineMarkdown(value) {
        const protectedTokens = [];
        let text = String(value ?? "");

        const protect = (html) => {
            const token = "PMTMDTOKEN" + protectedTokens.length + "END";
            protectedTokens.push(html);
            return token;
        };

        text = text.replace(/`([^`\n]+)`/g, (_, code) =>
            protect("<code>" + escapeHtml(code) + "</code>")
        );

        text = text.replace(/\[([^\]\n]+)\]\(([^)\s]+)\)/g, (_, label, href) => {
            const safeHref = sanitizeMarkdownHref(href);
            if (!safeHref) {
                return label;
            }

            return protect(
                "<a href=\"" +
                escapeHtml(safeHref) +
                "\" target=\"_blank\" rel=\"noopener noreferrer\">" +
                escapeHtml(label) +
                "</a>"
            );
        });

        text = escapeHtml(text);
        text = text.replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>");
        text = text.replace(/__([^_\n]+)__/g, "<strong>$1</strong>");
        text = text.replace(/\*([^*\n]+)\*/g, "<em>$1</em>");
        text = text.replace(/_([^_\n]+)_/g, "<em>$1</em>");

        protectedTokens.forEach((html, index) => {
            text = text.replace("PMTMDTOKEN" + index + "END", html);
        });

        return text;
    }

    function splitMarkdownTableRow(line) {
        let row = String(line || "").trim();
        if (row.startsWith("|")) {
            row = row.slice(1);
        }
        if (row.endsWith("|")) {
            row = row.slice(0, -1);
        }

        return row.split("|").map((cell) => cell.trim());
    }

    function isMarkdownTableDivider(line) {
        const cells = splitMarkdownTableRow(line);
        return cells.length > 0 && cells.every((cell) => /^:?-{3,}:?$/.test(cell));
    }

    function renderMarkdown(markdown) {
        const lines = String(markdown || "").replace(/\r\n?/g, "\n").split("\n");
        const output = [];
        let index = 0;

        const isBlockStart = (line, nextLine) => {
            const trimmed = String(line || "").trim();
            return (
                trimmed === "" ||
                /^#{1,6}\s+/.test(trimmed) ||
                /^(?:-{3,}|\*{3,}|_{3,})$/.test(trimmed) ||
                /^```/.test(trimmed) ||
                /^\s*>\s?/.test(line) ||
                /^\s*[-*+]\s+/.test(line) ||
                /^\s*\d+\.\s+/.test(line) ||
                (trimmed.includes("|") && isMarkdownTableDivider(nextLine || ""))
            );
        };

        while (index < lines.length) {
            const rawLine = lines[index];
            const trimmed = rawLine.trim();

            if (!trimmed) {
                index += 1;
                continue;
            }

            const fenceMatch = trimmed.match(/^```(.*)$/);
            if (fenceMatch) {
                const language = fenceMatch[1].trim();
                const codeLines = [];
                index += 1;
                while (index < lines.length && !lines[index].trim().startsWith("```")) {
                    codeLines.push(lines[index]);
                    index += 1;
                }
                if (index < lines.length) {
                    index += 1;
                }
                const languageClass = language
                    ? " class=\"language-" + escapeHtml(language) + "\""
                    : "";
                output.push(
                    "<pre><code" +
                    languageClass +
                    ">" +
                    escapeHtml(codeLines.join("\n")) +
                    "</code></pre>"
                );
                continue;
            }

            const headingMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);
            if (headingMatch) {
                const level = headingMatch[1].length;
                output.push(
                    "<h" +
                    level +
                    ">" +
                    renderInlineMarkdown(headingMatch[2]) +
                    "</h" +
                    level +
                    ">"
                );
                index += 1;
                continue;
            }

            if (/^(?:-{3,}|\*{3,}|_{3,})$/.test(trimmed)) {
                output.push("<hr>");
                index += 1;
                continue;
            }

            if (
                trimmed.includes("|") &&
                index + 1 < lines.length &&
                isMarkdownTableDivider(lines[index + 1])
            ) {
                const headers = splitMarkdownTableRow(rawLine);
                const rows = [];
                index += 2;

                while (
                    index < lines.length &&
                    lines[index].trim().includes("|") &&
                    lines[index].trim() !== ""
                ) {
                    rows.push(splitMarkdownTableRow(lines[index]));
                    index += 1;
                }

                const headHtml = headers
                    .map((cell) => "<th>" + renderInlineMarkdown(cell) + "</th>")
                    .join("");
                const bodyHtml = rows
                    .map((row) => {
                        const cells = headers
                            .map(
                                (_, cellIndex) =>
                                    "<td>" +
                                    renderInlineMarkdown(row[cellIndex] ?? "") +
                                    "</td>"
                            )
                            .join("");
                        return "<tr>" + cells + "</tr>";
                    })
                    .join("");

                output.push(
                    "<div class=\"markdown-table-wrap\"><table><thead><tr>" +
                    headHtml +
                    "</tr></thead><tbody>" +
                    bodyHtml +
                    "</tbody></table></div>"
                );
                continue;
            }

            if (/^\s*>\s?/.test(rawLine)) {
                const quoteLines = [];
                while (index < lines.length && /^\s*>\s?/.test(lines[index])) {
                    quoteLines.push(lines[index].replace(/^\s*>\s?/, "").trim());
                    index += 1;
                }
                output.push(
                    "<blockquote>" +
                    renderInlineMarkdown(quoteLines.join(" ")) +
                    "</blockquote>"
                );
                continue;
            }

            const unorderedMatch = rawLine.match(/^\s*[-*+]\s+(.+)$/);
            const orderedMatch = rawLine.match(/^\s*\d+\.\s+(.+)$/);
            if (unorderedMatch || orderedMatch) {
                const ordered = Boolean(orderedMatch);
                const listTag = ordered ? "ol" : "ul";
                const itemPattern = ordered ? /^\s*\d+\.\s+(.+)$/ : /^\s*[-*+]\s+(.+)$/;
                const items = [];

                while (index < lines.length) {
                    const itemMatch = lines[index].match(itemPattern);
                    if (!itemMatch) {
                        break;
                    }
                    items.push("<li>" + renderInlineMarkdown(itemMatch[1]) + "</li>");
                    index += 1;
                }

                output.push("<" + listTag + ">" + items.join("") + "</" + listTag + ">");
                continue;
            }

            const paragraphLines = [trimmed];
            index += 1;

            while (
                index < lines.length &&
                !isBlockStart(lines[index], lines[index + 1]) &&
                lines[index].trim() !== ""
            ) {
                paragraphLines.push(lines[index].trim());
                index += 1;
            }

            output.push("<p>" + renderInlineMarkdown(paragraphLines.join(" ")) + "</p>");
        }

        return "<div class=\"markdown-body\">" + output.join("") + "</div>";
    }

    function selectChangelogTab(kind) {
        activeChangelog = kind;
        changelogTabs.forEach((tab) => {
            tab.setAttribute(
                "aria-selected",
                tab.dataset.changelog === kind ? "true" : "false"
            );
        });
    }

    async function loadChangelog(kind) {
        const source = changelogSources[kind];
        if (!source) {
            return;
        }

        selectChangelogTab(kind);
        changelogStatus.textContent = "Loading " + source.label + " changelog…";
        changelogContent.setAttribute("aria-busy", "true");
        changelogContent.innerHTML = "";

        try {
            const response = await fetch(addChangelogCacheBuster(source.path), {
                cache: "no-store"
            });
            if (!response.ok) {
                throw new Error("HTTP " + response.status);
            }

            const markdown = await response.text();
            changelogContent.innerHTML = renderMarkdown(markdown);
            changelogStatus.textContent = source.label + " changelog loaded.";
            changelogContent.scrollTop = 0;
        } catch (error) {
            console.error("Failed to load " + source.fileName, error);
            changelogStatus.textContent = "";
            changelogContent.innerHTML =
                "<div class=\"changelog-error\">The " +
                escapeHtml(source.label) +
                " changelog could not be loaded. Please try again later.</div>";
        } finally {
            changelogContent.setAttribute("aria-busy", "false");
        }
    }

    changelogOpenButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const kind = button.dataset.openChangelog;
            if (!kind || !changelogSources[kind]) {
                return;
            }

            selectChangelogTab(kind);
            if (!changelogDialog.open) {
                changelogDialog.showModal();
            }
            void loadChangelog(kind);
        });
    });

    closeChangelogButton.addEventListener("click", () => {
        changelogDialog.close();
    });

    changelogTabs.forEach((tab) => {
        tab.addEventListener("click", () => {
            const kind = tab.dataset.changelog;
            if (kind && changelogSources[kind] && kind !== activeChangelog) {
                void loadChangelog(kind);
            }
        });
    });
}

const SOUND_PACK_GITHUB_OWNER = "jamocle";
const SOUND_PACK_GITHUB_REPOSITORY = "PoorMansThrottle-DIY";
const SOUND_PACK_GITHUB_BRANCH = "main";
const SOUND_PACK_REPOSITORY_DIRECTORY = "sounds";
let soundPacksLoadPromise = null;

function getSoundPackDisplayName(fileName) {
    return fileName
        .replace(/\.zip$/i, "")
        .replace(/_/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

function buildGitHubContentsApiUrl(category) {
    const pathSegments = [
        SOUND_PACK_REPOSITORY_DIRECTORY,
        category
    ].map((segment) => encodeURIComponent(segment));

    const path = pathSegments.join("/");
    return (
        "https://api.github.com/repos/" +
        encodeURIComponent(SOUND_PACK_GITHUB_OWNER) +
        "/" +
        encodeURIComponent(SOUND_PACK_GITHUB_REPOSITORY) +
        "/contents/" +
        path +
        "?ref=" +
        encodeURIComponent(SOUND_PACK_GITHUB_BRANCH)
    );
}

async function loadSoundPackCategory(category) {
    const apiUrl = buildGitHubContentsApiUrl(category);
    const response = await fetch(apiUrl, { cache: "no-store" });

    if (response.status === 404) {
        return [];
    }

    if (!response.ok) {
        const error = new Error(
            "HTTP " + response.status + " while loading " + category + " sound packs."
        );
        error.status = response.status;
        throw error;
    }

    const entries = await response.json();

    if (!Array.isArray(entries)) {
        throw new Error("Unexpected GitHub response while loading " + category + " sound packs.");
    }

    return entries
        .filter((entry) =>
            entry &&
            entry.type === "file" &&
            typeof entry.name === "string" &&
            /\.zip$/i.test(entry.name)
        )
        .map((entry) => ({
            name: entry.name,
            displayName: getSoundPackDisplayName(entry.name),
            sha: typeof entry.sha === "string" ? entry.sha : ""
        }))
        .sort((left, right) =>
            left.displayName.localeCompare(right.displayName, undefined, {
                numeric: true,
                sensitivity: "base"
            })
        );
}

function buildSoundPackDownloadUrl(category, fileName, sha) {
    const encodedFileName = encodeURIComponent(fileName);
    const baseUrl = "../sounds/" + encodeURIComponent(category) + "/" + encodedFileName;

    const cacheVersion = sha ? sha : getRandomCacheBust();
    return baseUrl + "?v=" + encodeURIComponent(cacheVersion);
}

function renderSoundPackCategory(category, files) {
    const list = document.getElementById(category + "SoundPackList");
    if (!list) {
        return;
    }

    list.replaceChildren();

    if (files.length === 0) {
        const emptyMessage = document.createElement("p");
        emptyMessage.className = "note sound-pack-empty";
        emptyMessage.textContent =
            "No " + category + " sound packs are currently available.";
        list.appendChild(emptyMessage);
        return;
    }

    for (const file of files) {
        const row = document.createElement("div");
        row.className = "sound-pack-row";

        const name = document.createElement("span");
        name.className = "sound-pack-name";
        name.textContent = file.displayName;

        const download = document.createElement("a");
        download.className = "app-link app-link-primary sound-pack-download";
        download.href = buildSoundPackDownloadUrl(category, file.name, file.sha);
        download.setAttribute("download", file.name);
        download.textContent = "Download";
        download.setAttribute(
            "aria-label",
            "Download " + file.displayName + " " + category + " sound pack"
        );

        row.append(name, download);
        list.appendChild(row);
    }
}

function renderSoundPackError(category, error) {
    const list = document.getElementById(category + "SoundPackList");
    if (!list) {
        return;
    }

    list.replaceChildren();

    const message = document.createElement("p");
    message.className = "note warn sound-pack-error";

    if (error && (error.status === 403 || error.status === 429)) {
        message.textContent =
            "The sound-pack list is temporarily unavailable because GitHub is limiting requests. " +
            "Please try again later.";
    } else {
        message.textContent =
            "The " + category + " sound-pack list could not be loaded right now. Please try again.";
    }

    list.appendChild(message);
}

async function loadSoundPacks() {
    const status = document.getElementById("soundPacksStatus");
    if (status) {
        status.textContent = "Loading available sound packs…";
    }

    const categories = ["diesel", "steam"];
    const results = await Promise.allSettled(
        categories.map((category) => loadSoundPackCategory(category))
    );

    let failureCount = 0;

    results.forEach((result, index) => {
        const category = categories[index];

        if (result.status === "fulfilled") {
            renderSoundPackCategory(category, result.value);
        } else {
            failureCount += 1;
            console.error(result.reason);
            renderSoundPackError(category, result.reason);
        }
    });

    if (status) {
        if (failureCount === 0) {
            status.textContent =
                "Sound packs are listed automatically from the Diesel and Steam folders.";
        } else if (failureCount === categories.length) {
            status.textContent =
                "The sound-pack list could not be loaded right now. The rest of the installer is still available.";
        } else {
            status.textContent =
                "Some sound packs could not be loaded right now. Available packs are shown below.";
        }
    }
}

function initializeSoundPacks() {
    const section = document.getElementById("soundPacksSection");
    if (!section) {
        return;
    }

    const loadWhenOpen = () => {
        if (!section.open || soundPacksLoadPromise) {
            return;
        }

        soundPacksLoadPromise = loadSoundPacks();
    };

    section.addEventListener("toggle", loadWhenOpen);
    loadWhenOpen();
}



const DOCUMENTATION_GITHUB_OWNER = "jamocle";
const DOCUMENTATION_GITHUB_REPOSITORY = "PoorMansThrottle-DIY";
const DOCUMENTATION_GITHUB_BRANCH = "main";
const DOCUMENTATION_REPOSITORY_DIRECTORY = "docs";
const DOCUMENTATION_QUERY_PARAMETER = "doc";
let documentationLoadPromise = null;
let documentationRequestId = 0;
let suppressDocumentationCloseHistory = false;

function getDocumentationDisplayName(fileName) {
    const normalizedName = fileName
        .replace(/\.md$/i, "")
        .replace(/[_-]+/g, " ")
        .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
        .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
        .replace(/\s+/g, " ")
        .trim();

    return normalizedName
        .split(" ")
        .map((word) => {
            if (/^[A-Z0-9]+$/.test(word) && /[A-Z]/.test(word)) {
                return word;
            }

            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        })
        .join(" ");
}

function buildDocumentationContentsApiUrl() {
    return (
        "https://api.github.com/repos/" +
        encodeURIComponent(DOCUMENTATION_GITHUB_OWNER) +
        "/" +
        encodeURIComponent(DOCUMENTATION_GITHUB_REPOSITORY) +
        "/contents/" +
        encodeURIComponent(DOCUMENTATION_REPOSITORY_DIRECTORY) +
        "?ref=" +
        encodeURIComponent(DOCUMENTATION_GITHUB_BRANCH)
    );
}

function getRequestedDocumentationFileName() {
    const url = new URL(window.location.href);
    const value = url.searchParams.get(DOCUMENTATION_QUERY_PARAMETER);
    return value ? value.trim() : "";
}

function buildDocumentationPageUrl(fileName) {
    const url = new URL(window.location.href);
    url.searchParams.set(DOCUMENTATION_QUERY_PARAMETER, fileName);
    return url.pathname + url.search + url.hash;
}

function updateDocumentationHistory(fileName, mode) {
    const url = new URL(window.location.href);

    if (fileName) {
        url.searchParams.set(DOCUMENTATION_QUERY_PARAMETER, fileName);
    } else {
        url.searchParams.delete(DOCUMENTATION_QUERY_PARAMETER);
    }

    const nextUrl = url.pathname + url.search + url.hash;

    if (mode === "replace") {
        window.history.replaceState(null, "", nextUrl);
    } else {
        window.history.pushState(null, "", nextUrl);
    }
}

async function loadDocumentationFiles() {
    const response = await fetch(buildDocumentationContentsApiUrl(), { cache: "no-store" });

    if (!response.ok) {
        const error = new Error(
            "HTTP " + response.status + " while loading project documentation."
        );
        error.status = response.status;
        throw error;
    }

    const entries = await response.json();

    if (!Array.isArray(entries)) {
        throw new Error("Unexpected GitHub response while loading project documentation.");
    }

    return entries
        .filter((entry) =>
            entry &&
            entry.type === "file" &&
            typeof entry.name === "string" &&
            /\.md$/i.test(entry.name) &&
            typeof entry.html_url === "string" &&
            entry.html_url.startsWith("https://github.com/")
        )
        .map((entry) => ({
            name: entry.name,
            displayName: getDocumentationDisplayName(entry.name),
            url: entry.html_url
        }))
        .sort((left, right) =>
            left.name.localeCompare(right.name, undefined, {
                numeric: true,
                sensitivity: "base"
            })
        );
}

function clearDynamicDocumentationItems(list) {
    for (const item of list.querySelectorAll("[data-documentation-dynamic]")) {
        item.remove();
    }
}

function appendDocumentationMessage(list, message, isWarning) {
    const item = document.createElement("li");
    item.dataset.documentationDynamic = "true";
    item.className = isWarning ? "note warn" : "note";
    item.textContent = message;
    list.appendChild(item);
}

function setDocumentationViewerMessage(message, isWarning) {
    const target = document.getElementById("documentationContent");
    if (!target) {
        return;
    }

    target.replaceChildren();
    target.setAttribute("aria-busy", "false");

    const paragraph = document.createElement("p");
    paragraph.className = isWarning ? "note warn" : "note";
    paragraph.textContent = message;
    target.appendChild(paragraph);
}

function buildDocumentationMarkdownUrl(fileName) {
    const pathBase = window.location.pathname.includes("/PoorMansThrottle-DIY/")
        ? "/PoorMansThrottle-DIY"
        : "";

    return (
        pathBase +
        "/docs/" +
        encodeURIComponent(fileName) +
        "?v=" +
        encodeURIComponent(getRandomCacheBust())
    );
}

function showDocumentationNotFound(fileName) {
    const dialog = document.getElementById("documentationDialog");
    const title = document.getElementById("documentationDialogTitle");
    const status = document.getElementById("documentationStatus");

    if (!dialog || !title || !status) {
        return;
    }

    documentationRequestId += 1;
    title.textContent = "Project documentation";
    status.textContent = "";
    setDocumentationViewerMessage(
        'The requested Markdown guide "' + fileName + '" was not found.',
        true
    );

    if (!dialog.open) {
        dialog.showModal();
    }
}

async function loadDocumentationFile(file, updateHistory = true) {
    const dialog = document.getElementById("documentationDialog");
    const title = document.getElementById("documentationDialogTitle");
    const status = document.getElementById("documentationStatus");
    const target = document.getElementById("documentationContent");

    if (!dialog || !title || !status || !target) {
        return;
    }

    if (updateHistory && getRequestedDocumentationFileName() !== file.name) {
        updateDocumentationHistory(file.name, "push");
    }

    const requestId = ++documentationRequestId;

    title.textContent = file.displayName;
    status.textContent = "Loading " + file.displayName + "…";
    target.replaceChildren();
    target.setAttribute("aria-busy", "true");
    target.scrollTop = 0;

    if (!dialog.open) {
        dialog.showModal();
    }

    try {
        const response = await fetch(buildDocumentationMarkdownUrl(file.name), {
            cache: "no-store"
        });

        if (!response.ok) {
            const error = new Error(
                "HTTP " + response.status + " while loading " + file.name + "."
            );
            error.status = response.status;
            throw error;
        }

        const markdown = await response.text();

        if (requestId !== documentationRequestId) {
            return;
        }

        if (!markdown.trim()) {
            status.textContent = "";
            setDocumentationViewerMessage(
                "The Markdown file loaded, but it appears to be empty.",
                true
            );
            return;
        }

        target.innerHTML = marked.parse(markdown);
        target.scrollTop = 0;
        status.textContent = "";
    } catch (error) {
        if (requestId !== documentationRequestId) {
            return;
        }

        console.error(error);
        status.textContent = "";
        setDocumentationViewerMessage(
            "Unable to load " + file.displayName + ". Please try again later.",
            true
        );
    } finally {
        if (requestId === documentationRequestId) {
            target.setAttribute("aria-busy", "false");
        }
    }
}

function renderDocumentationFiles(files) {
    const list = document.getElementById("documentationList");
    if (!list) {
        return;
    }

    clearDynamicDocumentationItems(list);

    if (files.length === 0) {
        appendDocumentationMessage(
            list,
            "No Markdown documentation files are currently available.",
            false
        );
        return;
    }

    for (const file of files) {
        const item = document.createElement("li");
        item.dataset.documentationDynamic = "true";

        const link = document.createElement("a");
        link.className = "doc-link";
        link.href = buildDocumentationPageUrl(file.name);
        link.textContent = file.displayName;
        link.setAttribute("aria-haspopup", "dialog");
        link.setAttribute("aria-controls", "documentationDialog");
        link.addEventListener("click", (event) => {
            event.preventDefault();
            void loadDocumentationFile(file);
        });

        item.appendChild(link);
        list.appendChild(item);
    }
}

function renderDocumentationError(error) {
    const list = document.getElementById("documentationList");
    if (!list) {
        return;
    }

    clearDynamicDocumentationItems(list);

    const isRateLimited = error && (error.status === 403 || error.status === 429);
    appendDocumentationMessage(
        list,
        isRateLimited
            ? "The documentation list is temporarily unavailable because GitHub is limiting requests. Please try again later."
            : "The documentation list could not be loaded right now. Please try again later.",
        true
    );
}

async function loadDocumentation() {
    const list = document.getElementById("documentationList");
    if (!list) {
        return [];
    }

    clearDynamicDocumentationItems(list);
    appendDocumentationMessage(list, "Loading project documentation…", false);

    try {
        const files = await loadDocumentationFiles();
        renderDocumentationFiles(files);
        return files;
    } catch (error) {
        console.error(error);
        renderDocumentationError(error);
        return [];
    }
}

function ensureDocumentationLoaded() {
    if (!documentationLoadPromise) {
        documentationLoadPromise = loadDocumentation();
    }

    return documentationLoadPromise;
}

function initializeDocumentation() {
    const section = document.getElementById("documentationSection");
    const dialog = document.getElementById("documentationDialog");
    const closeButton = document.getElementById("closeDocumentationButton");

    if (!section || !dialog || !closeButton) {
        return;
    }

    const closeWithoutHistoryChange = () => {
        if (!dialog.open) {
            return;
        }

        documentationRequestId += 1;
        suppressDocumentationCloseHistory = true;
        dialog.close();
    };

    const synchronizeFromUrl = async () => {
        const requestedFileName = getRequestedDocumentationFileName();

        if (!requestedFileName) {
            closeWithoutHistoryChange();
            return;
        }

        section.open = true;

        const files = await ensureDocumentationLoaded();
        const file = files.find((candidate) => candidate.name === requestedFileName);

        if (!file) {
            showDocumentationNotFound(requestedFileName);
            return;
        }

        await loadDocumentationFile(file, false);
    };

    closeButton.addEventListener("click", () => {
        dialog.close();
    });

    dialog.addEventListener("close", () => {
        documentationRequestId += 1;

        if (suppressDocumentationCloseHistory) {
            suppressDocumentationCloseHistory = false;
            return;
        }

        if (getRequestedDocumentationFileName()) {
            updateDocumentationHistory("", "push");
        }
    });

    const loadWhenOpen = () => {
        if (!section.open) {
            return;
        }

        void ensureDocumentationLoaded();
    };

    section.addEventListener("toggle", loadWhenOpen);
    window.addEventListener("popstate", () => {
        void synchronizeFromUrl();
    });

    loadWhenOpen();
    void synchronizeFromUrl();
}



const SOUND_UPLOAD_MAX_BYTES = 20 * 1024 * 1024;
let soundUploadTurnstileWidgetId = null;
let soundUploadTurnstileToken = "";
let soundUploadScriptPromise = null;

function getSoundUploadConfig() {
    const config = window.PMT_SOUND_UPLOAD_CONFIG || {};

    return {
        apiUrl: typeof config.apiUrl === "string" ? config.apiUrl.trim().replace(/\/+$/, "") : "",
        turnstileSiteKey:
            typeof config.turnstileSiteKey === "string" ? config.turnstileSiteKey.trim() : ""
    };
}

function setSoundUploadStatus(message, type) {
    const target = document.getElementById("soundPackUploadStatus");
    if (!target) {
        return;
    }

    target.classList.remove("is-success", "is-error");

    if (type === "success") {
        target.classList.add("is-success");
    } else if (type === "error") {
        target.classList.add("is-error");
    }

    target.replaceChildren();

    const paragraph = document.createElement("p");
    paragraph.className = "note";

    if (type === "success") {
        const strong = document.createElement("strong");
        strong.textContent = "Thank you for contributing! ";
        paragraph.appendChild(strong);
    }

    paragraph.appendChild(document.createTextNode(message));
    target.appendChild(paragraph);
}

function setSoundUploadFormDisabled(disabled) {
    const form = document.getElementById("soundPackUploadForm");
    if (!form) {
        return;
    }

    form.classList.toggle("is-busy", disabled);

    for (const control of form.querySelectorAll("input, select, button, textarea")) {
        control.disabled = disabled;
    }
}

function loadTurnstileScript() {
    if (window.turnstile) {
        return Promise.resolve();
    }

    if (soundUploadScriptPromise) {
        return soundUploadScriptPromise;
    }

    soundUploadScriptPromise = new Promise((resolve, reject) => {
        const existing = document.querySelector('script[data-pmt-turnstile="true"]');
        if (existing) {
            existing.addEventListener("load", () => resolve(), { once: true });
            existing.addEventListener("error", () => reject(new Error("Turnstile failed to load.")), {
                once: true
            });
            return;
        }

        const script = document.createElement("script");
        script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
        script.async = true;
        script.defer = true;
        script.dataset.pmtTurnstile = "true";
        script.addEventListener("load", () => resolve(), { once: true });
        script.addEventListener("error", () => reject(new Error("Turnstile failed to load.")), {
            once: true
        });
        document.head.appendChild(script);
    });

    return soundUploadScriptPromise;
}

function resetSoundUploadTurnstile() {
    soundUploadTurnstileToken = "";

    if (
        window.turnstile &&
        soundUploadTurnstileWidgetId !== null &&
        soundUploadTurnstileWidgetId !== undefined
    ) {
        window.turnstile.reset(soundUploadTurnstileWidgetId);
    }
}

async function initializeSoundUploadTurnstile(siteKey) {
    const target = document.getElementById("soundPackTurnstile");
    if (!target) {
        return;
    }

    await loadTurnstileScript();

    if (!window.turnstile) {
        throw new Error("Turnstile is unavailable.");
    }

    soundUploadTurnstileWidgetId = window.turnstile.render(target, {
        sitekey: siteKey,
        theme: "light",
        appearance: "interaction-only",
        callback: (token) => {
            soundUploadTurnstileToken = token;
        },
        "expired-callback": () => {
            soundUploadTurnstileToken = "";
        },
        "error-callback": () => {
            soundUploadTurnstileToken = "";
            setSoundUploadStatus(
                "Human verification could not be completed. Please refresh the page and try again.",
                "error"
            );
        }
    });
}

function isZipFile(file) {
    return file && /\.zip$/i.test(file.name);
}

async function hasZipSignature(file) {
    const signature = new Uint8Array(await file.slice(0, 4).arrayBuffer());

    if (signature.length < 4 || signature[0] !== 0x50 || signature[1] !== 0x4B) {
        return false;
    }

    return (
        (signature[2] === 0x03 && signature[3] === 0x04) ||
        (signature[2] === 0x05 && signature[3] === 0x06) ||
        (signature[2] === 0x07 && signature[3] === 0x08)
    );
}

async function submitSoundPack(event) {
    event.preventDefault();

    const config = getSoundUploadConfig();
    const form = document.getElementById("soundPackUploadForm");
    const category = document.getElementById("soundPackCategory");
    const fileInput = document.getElementById("soundPackFile");

    if (!form || !category || !fileInput) {
        return;
    }

    if (!config.apiUrl || !config.turnstileSiteKey) {
        setSoundUploadStatus(
            "Crowdsourcing uploads are not configured yet. Please try again later.",
            "error"
        );
        return;
    }

    const file = fileInput.files && fileInput.files[0];

    if (!file) {
        setSoundUploadStatus("Choose a ZIP file before submitting.", "error");
        return;
    }

    if (!isZipFile(file) || !(await hasZipSignature(file))) {
        setSoundUploadStatus("Please choose a valid ZIP file.", "error");
        return;
    }

    if (file.size <= 0 || file.size > SOUND_UPLOAD_MAX_BYTES) {
        setSoundUploadStatus("The ZIP file must be 20 MB or smaller.", "error");
        return;
    }

    if (!soundUploadTurnstileToken) {
        setSoundUploadStatus(
            "Human verification is still being prepared. Please wait a moment and try again.",
            "error"
        );
        return;
    }

    const data = new FormData();
    data.append("category", category.value);
    data.append("file", file, file.name);
    data.append("turnstileToken", soundUploadTurnstileToken);

    setSoundUploadFormDisabled(true);
    setSoundUploadStatus("Uploading your sound pack…", "");

    try {
        const response = await fetch(config.apiUrl + "/submit", {
            method: "POST",
            body: data,
            headers: {
                Accept: "application/json"
            }
        });

        let payload = null;
        try {
            payload = await response.json();
        } catch {
            payload = null;
        }

        if (!response.ok) {
            throw new Error(
                payload && typeof payload.message === "string"
                    ? payload.message
                    : "The upload could not be completed. Please try again."
            );
        }

        form.reset();
        resetSoundUploadTurnstile();

        setSoundUploadStatus(
            "Your sound pack was uploaded successfully. It is not live yet. " +
            "Every submitted ZIP goes through a series of evaluations before it is approved " +
            "and added to the public Sound Packs library.",
            "success"
        );
    } catch (error) {
        console.error(error);
        resetSoundUploadTurnstile();
        setSoundUploadStatus(
            error instanceof Error
                ? error.message
                : "The upload could not be completed. Please try again.",
            "error"
        );
    } finally {
        setSoundUploadFormDisabled(false);
    }
}

function initializeSoundPackCrowdsourcing() {
    const form = document.getElementById("soundPackUploadForm");
    const section = document.getElementById("soundPacksSection");
    const submitButton = document.getElementById("soundPackSubmitButton");

    if (!form || !section || !submitButton) {
        return;
    }

    const config = getSoundUploadConfig();

    if (!config.apiUrl || !config.turnstileSiteKey) {
        setSoundUploadFormDisabled(true);
        setSoundUploadStatus(
            "Crowdsourcing uploads are being configured. Sound-pack downloads are still available.",
            ""
        );
        return;
    }

    let turnstileInitialized = false;

    const prepareWhenOpen = async () => {
        if (!section.open || turnstileInitialized) {
            return;
        }

        turnstileInitialized = true;
        submitButton.disabled = true;
        setSoundUploadStatus("Preparing secure upload…", "");

        try {
            await initializeSoundUploadTurnstile(config.turnstileSiteKey);
            submitButton.disabled = false;
            setSoundUploadStatus(
                "Choose a ZIP file, select Diesel or Steam, then click Submit Sound Pack.",
                ""
            );
        } catch (error) {
            console.error(error);
            setSoundUploadFormDisabled(true);
            setSoundUploadStatus(
                "The secure upload service could not be prepared. Please try again later.",
                "error"
            );
        }
    };

    form.addEventListener("submit", submitSoundPack);
    section.addEventListener("toggle", prepareWhenOpen);
    prepareWhenOpen();
}

async function initialize() {
    await updateFirmwareInstaller();
    initializeSoundPacks();
    initializeDocumentation();
    initializeSoundPackCrowdsourcing();
    initializeChangelog();
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
