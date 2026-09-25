(() => {
  "use strict";

  const returnParam = "pmtReturn";
  const labelParam = "pmtReturnLabel";
  const cacheParam = "cb";
  const historyKey = "pmtNavigationStackV1";

  function freshCacheToken() {
    return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }

  function applyFreshCacheToken(url) {
    url.searchParams.set(cacheParam, freshCacheToken());
    return url;
  }

  function canonicalPageUrl(input = window.location.href) {
    const url = new URL(input, window.location.href);
    url.searchParams.delete(returnParam);
    url.searchParams.delete(labelParam);
    url.searchParams.delete("pmtReturned");
    url.searchParams.delete(cacheParam);
    url.hash = "";
    return url.href;
  }

  function readNavigationStack() {
    try {
      const value = JSON.parse(window.sessionStorage.getItem(historyKey) || "[]");
      return Array.isArray(value) ? value.filter(item =>
        item &&
        typeof item.url === "string" &&
        typeof item.label === "string"
      ) : [];
    } catch {
      return [];
    }
  }

  function writeNavigationStack(stack) {
    try {
      window.sessionStorage.setItem(historyKey, JSON.stringify(stack));
    } catch {
      // Navigation still works without persistence; no unsafe fallback is used.
    }
  }

  function pushCurrentPageForForwardNavigation() {
    const stack = readNavigationStack();
    const currentUrl = canonicalPageUrl();
    const last = stack.at(-1);

    if (!last || canonicalPageUrl(last.url) !== currentUrl) {
      stack.push({ url: currentUrl, label: pageLabel() });
      writeNavigationStack(stack);
    }
  }

  function popPreviousPage() {
    const stack = readNavigationStack();

    while (stack.length > 0) {
      const previous = stack.pop();
      if (canonicalPageUrl(previous.url) !== canonicalPageUrl()) {
        writeNavigationStack(stack);
        return previous;
      }
    }

    writeNavigationStack([]);
    return null;
  }

  function peekPreviousPage() {
    const stack = readNavigationStack();
    const currentUrl = canonicalPageUrl();

    for (let index = stack.length - 1; index >= 0; index -= 1) {
      if (canonicalPageUrl(stack[index].url) !== currentUrl) {
        return stack[index];
      }
    }

    return null;
  }

  function isHttpProtocol(url) {
    return url.protocol === "http:" || url.protocol === "https:";
  }

  function isSameSite(url) {
    return isHttpProtocol(url) && url.origin === window.location.origin;
  }

  function isNavigablePmtTarget(url) {
    if (!isSameSite(url)) {
      return false;
    }

    const path = url.pathname.toLowerCase();
    return path.endsWith(".html") || (path.endsWith("/home.html") && url.searchParams.has("doc"));
  }

  function pageLabel() {
    const heading = document.querySelector("h1");
    const text = heading?.textContent?.trim();
    if (text) {
      return text;
    }

    return document.title.trim() || "Previous page";
  }

  function currentReturnUrl() {
    const url = new URL(window.location.href);
    url.searchParams.delete(returnParam);
    url.searchParams.delete(labelParam);
    url.hash = "";
    return url.href;
  }

  function clearReturnContextFromInternalLinks() {
    for (const link of document.querySelectorAll("a[href]")) {
      if (link.hasAttribute("download") || link.classList.contains("pmt-return-link")) {
        continue;
      }

      let target;
      try {
        target = new URL(link.href, window.location.href);
      } catch {
        continue;
      }

      if (!isNavigablePmtTarget(target)) {
        continue;
      }

      target.searchParams.delete(returnParam);
      target.searchParams.delete(labelParam);
      target.searchParams.delete(returnedParam);
      link.href = target.href;
    }
  }

  function decorateInternalLinks() {
    if (isReturnArrival()) {
      return;
    }

    const returnUrl = currentReturnUrl();
    const returnLabel = pageLabel();

    for (const link of document.querySelectorAll("a[href]")) {
      if (link.hasAttribute("download")) {
        continue;
      }

      let target;
      try {
        target = new URL(link.href, window.location.href);
      } catch {
        continue;
      }

      if (!isNavigablePmtTarget(target) || target.href === returnUrl) {
        continue;
      }

      target.searchParams.set(returnParam, returnUrl);
      target.searchParams.set(labelParam, returnLabel);
      applyFreshCacheToken(target);
      link.href = target.href;
    }
  }

  function validatedReturnTarget() {
    const current = new URL(window.location.href);
    const value = current.searchParams.get(returnParam);
    if (!value) {
      return null;
    }

    let target;
    try {
      target = new URL(value, window.location.href);
    } catch {
      return null;
    }

    if (!isSameSite(target) || !target.pathname.toLowerCase().endsWith(".html")) {
      return null;
    }

    return target;
  }

  function returnLabel() {
    const value = new URL(window.location.href).searchParams.get(labelParam)?.trim();
    if (!value) {
      return "Back";
    }

    return `Back to ${value.slice(0, 80)}`;
  }

  function renderReturnControl() {
    const stackTarget = peekPreviousPage();
    const legacyTarget = validatedReturnTarget();

    if (!stackTarget && !legacyTarget) {
      return;
    }

    const target = stackTarget
      ? new URL(stackTarget.url, window.location.href)
      : legacyTarget;
    const label = stackTarget
      ? `Back to ${stackTarget.label.slice(0, 80)}`
      : returnLabel();

    target.searchParams.delete(returnParam);
    target.searchParams.delete(labelParam);
    target.searchParams.delete("pmtReturned");
    applyFreshCacheToken(target);

    const link = document.createElement("a");
    link.className = "pmt-return-link";
    link.href = target.href;
    link.setAttribute("aria-label", label);
    link.innerHTML = '<span aria-hidden="true">←</span><span class="pmt-return-text"></span>';
    link.querySelector(".pmt-return-text").textContent = label;

    const activateReturn = (event) => {
      if (event.type === "click" && event.button !== 0) {
        return;
      }

      if (stackTarget) {
        const previous = popPreviousPage();
        if (previous) {
          const destination = new URL(previous.url, window.location.href);
          applyFreshCacheToken(destination);
          link.href = destination.href;
        }
      } else {
        // Seed the stack from legacy return metadata so older/deep links transition
        // into the stack model without creating a forward/back loop.
        const stack = readNavigationStack();
        stack.push({
          url: canonicalPageUrl(target.href),
          label: label.replace(/^Back to\s+/, "") || "Previous page"
        });
        writeNavigationStack(stack);
        popPreviousPage();
      }
    };

    link.addEventListener("pointerdown", activateReturn, { capture: true, once: true });
    link.addEventListener("auxclick", activateReturn, { capture: true, once: true });
    link.addEventListener("click", activateReturn, { capture: true, once: true });

    const host = document.createElement("div");
    host.className = "pmt-return-nav";
    host.setAttribute("aria-label", "Return navigation");
    host.appendChild(link);

    document.body.appendChild(host);
    synchronizeReturnControlHost();

    const dialogObserver = new MutationObserver(synchronizeReturnControlHost);
    dialogObserver.observe(document.documentElement, {
      subtree: true,
      attributes: true,
      attributeFilter: ["open"]
    });
  }

  function synchronizeReturnControlHost() {
    const host = document.querySelector(".pmt-return-nav");
    if (!host) {
      return;
    }

    const openDialogs = Array.from(document.querySelectorAll("dialog[open]"));
    const targetHost = openDialogs.at(-1) || document.body;

    if (host.parentElement !== targetHost) {
      targetHost.appendChild(host);
    }
  }

  function installStyles() {
    if (document.getElementById("pmtReturnNavigationStyles")) {
      return;
    }

    const style = document.createElement("style");
    style.id = "pmtReturnNavigationStyles";
    style.textContent = `
      .pmt-return-nav {
        position: fixed;
        left: max(14px, env(safe-area-inset-left));
        bottom: max(14px, env(safe-area-inset-bottom));
        z-index: 10000;
        pointer-events: auto;
      }
      .pmt-return-link {
        position: relative;
        z-index: 10001;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        max-width: min(420px, calc(100vw - 28px));
        padding: 10px 14px;
        border: 1px solid rgba(159, 207, 168, .95);
        border-radius: 999px;
        background: rgba(220, 245, 224, .96);
        color: #1d1d1f;
        box-shadow: 0 8px 24px rgba(0, 0, 0, .12);
        text-decoration: none;
        font: 600 14px/1.2 -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        backdrop-filter: blur(14px);
        -webkit-backdrop-filter: blur(14px);
        pointer-events: auto;
      }
      .pmt-return-link:hover {
        transform: translateY(-1px);
        box-shadow: 0 10px 28px rgba(0, 0, 0, .16);
      }
      .pmt-return-text {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      @media (max-width: 640px) {
        .pmt-return-nav {
          left: max(10px, env(safe-area-inset-left));
          bottom: max(10px, env(safe-area-inset-bottom));
        }
        .pmt-return-link {
          max-width: calc(100vw - 20px);
          padding: 9px 12px;
          font-size: 13px;
        }
      }
      @media (prefers-reduced-motion: reduce) {
        .pmt-return-link {
          transition: none;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function decorateLink(link) {
    if (!(link instanceof HTMLAnchorElement) ||
        link.hasAttribute("download") ||
        link.classList.contains("pmt-return-link")) {
      return;
    }

    let target;
    try {
      target = new URL(link.href, window.location.href);
    } catch {
      return;
    }

    const returnUrl = currentReturnUrl();
    if (!isNavigablePmtTarget(target) || target.href === returnUrl) {
      return;
    }

    target.searchParams.set(returnParam, returnUrl);
    target.searchParams.set(labelParam, pageLabel());
    applyFreshCacheToken(target);
    link.href = target.href;
  }

  function decorateLinkFromEvent(event) {
    const link = event.target.closest?.("a[href]");
    if (!link) {
      return;
    }

    decorateLink(link);

    if (link.classList.contains("pmt-return-link") ||
        link.hasAttribute("download")) {
      return;
    }

    let target;
    try {
      target = new URL(link.href, window.location.href);
    } catch {
      return;
    }

    if (isNavigablePmtTarget(target)) {
      pushCurrentPageForForwardNavigation();
    }
  }

  function initialize() {
    installStyles();
    clearReturnContextFromInternalLinks();
    renderReturnControl();
    decorateInternalLinks();

    document.addEventListener("pointerdown", decorateLinkFromEvent, true);
    document.addEventListener("click", decorateLinkFromEvent, true);
    document.addEventListener("auxclick", decorateLinkFromEvent, true);
    document.addEventListener("contextmenu", decorateLinkFromEvent, true);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize, { once: true });
  } else {
    initialize();
  }
})();
