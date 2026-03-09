/**
 * Content script for github.com.
 *
 * Detects cooldown.yaml blob pages and shows a floating button
 * that opens the cryo-wiring viewer site with the raw URL.
 */

const VIEWER_BASE = "https://cryo-wiring.github.io/viewer/";
const COOLDOWN_PATTERN = /\/blob\/[^/]+\/.*cooldown\.ya?ml$/;

function isCooldownBlobPage(): boolean {
  return COOLDOWN_PATTERN.test(window.location.pathname);
}

function getRawUrl(): string | null {
  const match = window.location.pathname.match(
    /^\/([^/]+)\/([^/]+)\/blob\/([^/]+)\/(.+)$/
  );
  if (match) {
    const [, owner, repo, ref, filePath] = match;
    return `https://raw.githubusercontent.com/${owner}/${repo}/refs/heads/${ref}/${filePath}`;
  }
  return null;
}

function createViewerButton(rawUrl: string): HTMLElement {
  const btn = document.createElement("button");
  btn.id = "cryo-wiring-viewer-btn";
  btn.type = "button";
  btn.style.cssText = `
    position: fixed;
    bottom: 24px;
    right: 24px;
    z-index: 99999;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 18px;
    font-size: 13px;
    font-weight: 600;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif;
    line-height: 20px;
    color: #e2e8f0;
    background: linear-gradient(135deg, #0a0f1e 0%, #162033 100%);
    border: 1px solid #38bdf8;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 4px 24px rgba(56, 189, 248, 0.25), 0 0 12px rgba(56, 189, 248, 0.15);
    white-space: nowrap;
  `;
  btn.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M12 6v6l4 2"/>
    </svg>
    <span>Open in Cryo-Wiring Viewer</span>
  `;

  btn.addEventListener("mouseenter", () => {
    btn.style.transform = "translateY(-2px)";
    btn.style.boxShadow = "0 6px 32px rgba(56, 189, 248, 0.35), 0 0 20px rgba(56, 189, 248, 0.25)";
  });
  btn.addEventListener("mouseleave", () => {
    btn.style.transform = "translateY(0)";
    btn.style.boxShadow = "0 4px 24px rgba(56, 189, 248, 0.25), 0 0 12px rgba(56, 189, 248, 0.15)";
  });

  btn.addEventListener("click", () => {
    const viewerUrl = `${VIEWER_BASE}?url=${encodeURIComponent(rawUrl)}`;
    window.open(viewerUrl, "_blank");
  });

  return btn;
}

function tryInject() {
  document.getElementById("cryo-wiring-viewer-btn")?.remove();

  if (!isCooldownBlobPage()) return;

  const rawUrl = getRawUrl();
  if (!rawUrl) return;

  document.body.appendChild(createViewerButton(rawUrl));
}

// Run on load
tryInject();

// GitHub SPA navigation (turbo drive)
document.addEventListener("turbo:load", () => tryInject());

// Fallback: observe URL changes
let lastUrl = window.location.href;
new MutationObserver(() => {
  if (window.location.href !== lastUrl) {
    lastUrl = window.location.href;
    setTimeout(tryInject, 300);
  }
}).observe(document.body, { childList: true, subtree: true });
