/**
 * Error and success presentation for TML tools.
 * Pure formatting is separated from DOM rendering so logic is testable in Node.
 */

/**
 * Build an error descriptor (no DOM).
 * @param {string} message
 * @param {{code?: string|number}} [opts]
 * @returns {{html: string, text: string, role: string}}
 */
export function formatError(message, { code = null } = {}) {
  const safe = escapeHTML(String(message ?? 'Unknown error'));
  const codePart = code != null ? ` <span class="tml-err-code">(${escapeHTML(String(code))})</span>` : '';
  return {
    text: String(message ?? 'Unknown error'),
    html: `<div class="tml-error" role="alert" aria-live="assertive">${safe}${codePart}</div>`,
    role: 'alert',
  };
}

/**
 * Build a success descriptor (no DOM).
 * @param {string} message
 * @returns {{html: string, text: string}}
 */
export function formatSuccess(message) {
  const safe = escapeHTML(String(message ?? ''));
  return {
    text: String(message ?? ''),
    html: `<div class="tml-success" role="status" aria-live="polite">${safe}</div>`,
  };
}

/** Escape HTML special characters. */
export function escapeHTML(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Render an error into a container element. Browser only.
 * @param {HTMLElement} container
 * @param {string} message
 * @param {{code?: string|number}} [opts]
 */
export function showError(container, message, opts = {}) {
  if (!container) return;
  const { html } = formatError(message, opts);
  container.innerHTML = html;
}

/**
 * Render a success message into a container element. Browser only.
 * @param {HTMLElement} container
 * @param {string} message
 */
export function showSuccess(container, message) {
  if (!container) return;
  const { html } = formatSuccess(message);
  container.innerHTML = html;
}

/**
 * Clear any error/success panel in a container. Browser only.
 * @param {HTMLElement} container
 */
export function clearMessage(container) {
  if (!container) return;
  container.innerHTML = '';
}
