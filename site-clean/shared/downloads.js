/**
 * Download and clipboard helpers for TML tools.
 * sanitizeFilename is pure (testable in Node).
 * downloadBlob / downloadText / copyToClipboard are browser-only.
 */

/**
 * Strip characters that are unsafe or confusing in a filename.
 * Keeps letters, digits, dots, underscores, hyphens, and spaces.
 * @param {string} name
 * @param {string} fallback
 * @returns {string}
 */
export function sanitizeFilename(name, fallback = 'download') {
  const cleaned = String(name ?? '')
    .replace(/[\\/:*?"<>|\x00-\x1f]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  return cleaned.length > 0 ? cleaned : fallback;
}

/**
 * Trigger a browser download for a Blob. Object URL is revoked after click.
 * Browser only.
 * @param {Blob} blob
 * @param {string} filename
 */
export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = sanitizeFilename(filename);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

/**
 * Trigger a browser download for a text string.
 * Browser only.
 * @param {string} text
 * @param {string} filename
 * @param {string} [mime]
 */
export function downloadText(text, filename, mime = 'text/plain;charset=utf-8') {
  downloadBlob(new Blob([text], { type: mime }), filename);
}

/**
 * Copy text to the clipboard. Returns true on success.
 * Browser only. Falls back to execCommand when Clipboard API is unavailable.
 * @param {string} text
 * @returns {Promise<boolean>}
 */
export async function copyToClipboard(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* fall through to legacy path */
  }
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'absolute';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}
