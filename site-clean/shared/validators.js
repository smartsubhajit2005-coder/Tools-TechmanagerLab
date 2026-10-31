/**
 * Pure input-validation helpers shared by TML tools.
 * No DOM access. Safe to import in Node for unit tests.
 */

/** Format a byte count for human-readable error messages. */
export function formatFileSize(bytes) {
  if (!Number.isFinite(bytes) || bytes < 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  let i = 0;
  let n = bytes;
  while (n >= 1024 && i < units.length - 1) {
    n /= 1024;
    i++;
  }
  return `${Number.isInteger(n) ? Math.round(n) : n.toFixed(1)} ${units[i]}`;
}

/**
 * Validate free-text input.
 * @param {string} text
 * @param {{min?: number, max?: number}} opts
 * @returns {{valid: boolean, error?: string}}
 */
export function isValidText(text, { min = 1, max = 1_000_000 } = {}) {
  if (typeof text !== 'string') return { valid: false, error: 'Input must be text.' };
  const len = text.trim().length;
  if (len < min) return { valid: false, error: `Input is empty or too short (min ${min} character${min === 1 ? '' : 's'}).` };
  if (len > max) return { valid: false, error: `Input exceeds the ${max.toLocaleString('en-IN')}-character limit.` };
  return { valid: true };
}

/** Map common MIME types to their file extensions, for fallback matching. */
const MIME_TO_EXT = {
  'application/pdf': '.pdf',
  'image/png': '.png',
  'image/jpeg': '.jpg',
  'image/jpg': '.jpg',
  'image/webp': '.webp',
  'image/gif': '.gif',
  'image/svg+xml': '.svg',
  'text/plain': '.txt',
  'application/zip': '.zip',
  'application/x-zip-compressed': '.zip',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
  'application/msword': '.doc',
};

/**
 * Validate a File-like object (browser File or plain {name, size, type}).
 * @param {{name?: string, size?: number, type?: string}} file
 * @param {{maxSize?: number, allowedTypes?: string[]}} opts
 * @returns {{valid: boolean, error?: string}}
 */
export function isValidFile(file, { maxSize = 50 * 1024 * 1024, allowedTypes = [] } = {}) {
  if (!file || typeof file !== 'object') return { valid: false, error: 'No file selected.' };
  if (typeof file.size !== 'number') return { valid: false, error: 'Cannot read file size.' };
  if (file.size === 0) return { valid: false, error: 'The selected file is empty.' };
  if (file.size > maxSize) {
    return { valid: false, error: `File is ${formatFileSize(file.size)}. Maximum is ${formatFileSize(maxSize)}.` };
  }
  if (allowedTypes.length > 0) {
    const type = (file.type || '').toLowerCase();
    const name = (file.name || '').toLowerCase();
    const ext = name.slice(name.lastIndexOf('.'));
    const match = allowedTypes.some((t) => {
      if (t.startsWith('.')) return ext === t;
      if (t.endsWith('/*')) return type.startsWith(t.slice(0, -1));
      if (type === t) return true;
      if (!type && ext) {
        const mapped = MIME_TO_EXT[t.toLowerCase()];
        return mapped ? ext === mapped : false;
      }
      return false;
    });
    if (!match) {
      return { valid: false, error: `Unsupported file type${type ? ` (${type})` : ''}. Allowed: ${allowedTypes.join(', ')}.` };
    }
  }
  return { valid: true };
}

/**
 * Validate a URL string. Only http/https accepted.
 * @param {string} url
 * @returns {{valid: boolean, error?: string, url?: URL}}
 */
export function isValidURL(url) {
  if (typeof url !== 'string' || !url.trim()) return { valid: false, error: 'Enter a URL.' };
  let parsed;
  try {
    parsed = new URL(url.trim());
  } catch {
    return { valid: false, error: 'That is not a valid URL.' };
  }
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return { valid: false, error: 'Only http and https URLs are supported.' };
  }
  return { valid: true, url: parsed };
}

/**
 * Validate an IPv4 dotted-quad address.
 * @param {string} ip
 * @returns {{valid: boolean, error?: string}}
 */
export function isValidIPv4(ip) {
  if (typeof ip !== 'string') return { valid: false, error: 'Enter an IPv4 address.' };
  const parts = ip.trim().split('.');
  if (parts.length !== 4) return { valid: false, error: 'IPv4 address must have four octets.' };
  for (const p of parts) {
    if (!/^\d{1,3}$/.test(p)) return { valid: false, error: `"${p}" is not a valid octet.` };
    if (Number(p) > 255) return { valid: false, error: `Octet ${p} exceeds 255.` };
  }
  return { valid: true };
}

/**
 * Validate CIDR notation "a.b.c.d/prefix".
 * @param {string} input
 * @returns {{valid: boolean, error?: string, ip?: string, prefix?: number}}
 */
export function isValidCIDR(input) {
  if (typeof input !== 'string') return { valid: false, error: 'Enter an address in CIDR notation, e.g. 192.168.1.0/24.' };
  const trimmed = input.trim();
  const slashIdx = trimmed.indexOf('/');
  if (slashIdx === -1) return { valid: false, error: 'Missing /prefix. Example: 192.168.1.0/24.' };
  const ip = trimmed.slice(0, slashIdx);
  const prefixStr = trimmed.slice(slashIdx + 1);
  const ipResult = isValidIPv4(ip);
  if (!ipResult.valid) return ipResult;
  if (!/^\d{1,2}$/.test(prefixStr)) return { valid: false, error: `Prefix "/${prefixStr}" is not a number.` };
  const prefix = Number(prefixStr);
  if (prefix < 0 || prefix > 32) return { valid: false, error: `Prefix /${prefix} is out of range (0-32).` };
  return { valid: true, ip, prefix };
}

/**
 * Validate a hex color string (#RGB, #RRGGBB, with optional alpha).
 * @param {string} color
 * @returns {{valid: boolean, error?: string}}
 */
export function isValidHex(color) {
  if (typeof color !== 'string') return { valid: false, error: 'Enter a hex color.' };
  const c = color.trim();
  if (!/^#?(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(c)) {
    return { valid: false, error: `"${c}" is not a valid hex color. Use #RGB, #RRGGBB, or #RRGGBBAA.` };
  }
  return { valid: true };
}

/**
 * Validate a Base64 string (standard or URL-safe).
 * @param {string} str
 * @returns {{valid: boolean, error?: string}}
 */
export function isValidBase64(str) {
  if (typeof str !== 'string') return { valid: false, error: 'Enter a Base64 string.' };
  const s = str.trim();
  if (s.length === 0) return { valid: false, error: 'Input is empty.' };
  if (!/^[A-Za-z0-9+/_-]+=*$/.test(s)) return { valid: false, error: 'Contains characters that are not valid Base64.' };
  return { valid: true };
}

/**
 * Validate a JSON string and report the failing line when determinable.
 * @param {string} text
 * @returns {{valid: boolean, error?: string, line?: number}}
 */
export function isValidJSON(text) {
  if (typeof text !== 'string') return { valid: false, error: 'Input must be text.' };
  if (text.trim().length === 0) return { valid: false, error: 'Input is empty.' };
  try {
    JSON.parse(text);
    return { valid: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    const line = lineFromJsonError(text, message);
    if (line) return { valid: false, error: `Invalid JSON at line ${line}. ${message}`, line };
    return { valid: false, error: `Invalid JSON. ${message}` };
  }
}

/** Derive a 1-based line number from a V8 JSON error message or its byte offset. */
function lineFromJsonError(text, message) {
  const explicit = message.match(/\(line (\d+)/i);
  if (explicit) return Number(explicit[1]);
  const pos = message.match(/position (\d+)/i);
  if (pos) {
    const offset = Math.min(Number(pos[1]), text.length);
    let line = 1;
    for (let i = 0; i < offset; i++) if (text[i] === '\n') line++;
    return line;
  }
  const ctx = message.match(/'([^']*)'/);
  if (ctx && ctx[1]) {
    const idx = text.indexOf(ctx[1]);
    if (idx >= 0) {
      let line = 1;
      for (let i = 0; i < idx; i++) if (text[i] === '\n') line++;
      return line;
    }
  }
  return null;
}
