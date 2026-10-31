/**
 * Per-tool privacy disclosure for TML tools.
 * getDisclosureText is pure (testable in Node).
 * renderPrivacyBanner is browser-only.
 */

/** Tools whose operation sends user input to an external endpoint. */
const NETWORK_DISCLOSURES = {
  'dns-lookup':
    'Sends the domain you enter to Google Public DNS (dns.google) to resolve records. Google can see which domains you look up.',
  'spf-dkim-dmarc':
    'Sends the domain you enter to Google Public DNS (dns.google) to look up SPF, DKIM, and DMARC records. Google can see which domains you check.',
  'website-status-checker':
    'Sends the URL you enter through third-party proxies (allorigins.win, corsproxy.io) to fetch the page. Those services can see which URLs you check.',
  'http-headers':
    'Sends a HEAD request from your browser directly to the URL you enter. That site sees your request and your IP address.',
  'security-headers':
    'Sends a HEAD request from your browser directly to the URL you enter. That site sees your request and your IP address.',
  'qr-code':
    'Sends the text or URL you enter to api.qrserver.com to generate the QR image. That service can see what you encode.',
  'currency-converter':
    'Shows indicative exchange rates. If live rates are enabled, your browser requests them from an external rate API.',
};

/**
 * Return the disclosure sentence for a tool.
 * @param {string} toolSlug e.g. "word-counter", "dns-lookup"
 * @param {'local'|'local-file'|'network'} [model]
 * @returns {string}
 */
export function getDisclosureText(toolSlug, model = 'local') {
  if (model === 'network') {
    return NETWORK_DISCLOSURES[toolSlug] ||
      'This tool sends your input to an external service. That service can see what you enter.';
  }
  if (model === 'local-file') {
    return 'Your file is read into memory by this browser tab. It is never uploaded to a server. Close the tab and the data is gone.';
  }
  return 'Everything you type or paste stays in this browser tab. No data is sent to a server. Close the tab and it is gone.';
}

/**
 * Return the processing-model label for a tool slug, derived from the inventory.
 * @param {string} toolSlug
 * @param {Array<{slug:string, processingModel:string}>} inventory
 * @returns {'local'|'local-file'|'network'}
 */
export function getModelFromInventory(toolSlug, inventory) {
  const row = (inventory || []).find((r) => r.slug === toolSlug);
  if (!row) return 'local';
  if (row.processingModel === 'network') return 'network';
  if (row.processingModel === 'local-file' || row.hasFileInput) return 'local-file';
  return 'local';
}

/**
 * Render a privacy banner into a container. Browser only.
 * @param {HTMLElement} container
 * @param {string} toolSlug
 * @param {'local'|'local-file'|'network'} [model]
 */
export function renderPrivacyBanner(container, toolSlug, model = 'local') {
  if (!container) return;
  const text = getDisclosureText(toolSlug, model);
  const icon = model === 'network' ? '&#9888;' : '&#128274;';
  const cls = model === 'network' ? 'tml-privacy tml-privacy-net' : 'tml-privacy';
  container.innerHTML =
    `<div class="${cls}" role="note" aria-label="Privacy notice">` +
    `<span class="tml-privacy-icon" aria-hidden="true">${icon}</span>` +
    `<span>${text}</span>` +
    `</div>`;
}
