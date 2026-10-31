/**
 * File reading and object-URL lifecycle for TML tools.
 * validateFile + formatFileSize are pure (testable in Node).
 * readAsText / readAsArrayBuffer / createObjectURL are browser-only.
 */

import { isValidFile, formatFileSize } from './validators.js';

export { formatFileSize };

/**
 * Validate a file against type and size rules.
 * @param {File|{name?:string,size?:number,type?:string}} file
 * @param {{maxSize?: number, allowedTypes?: string[]}} [opts]
 * @returns {{valid: boolean, error?: string}}
 */
export function validateFile(file, opts = {}) {
  return isValidFile(file, opts);
}

/**
 * Read a File as UTF-8 text. Browser only.
 * @param {File} file
 * @returns {Promise<string>}
 */
export function readAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error || new Error('Failed to read file.'));
    reader.readAsText(file);
  });
}

/**
 * Read a File as an ArrayBuffer. Browser only.
 * @param {File} file
 * @returns {Promise<ArrayBuffer>}
 */
export function readAsArrayBuffer(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error || new Error('Failed to read file.'));
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Create an object URL for a Blob/File with a managed revoke handle.
 * Browser only. Always call revoke() when done to avoid memory leaks.
 * @param {Blob|File} blob
 * @returns {{url: string, revoke: () => void}}
 */
export function createObjectURL(blob) {
  const url = URL.createObjectURL(blob);
  let revoked = false;
  return {
    url,
    revoke() {
      if (!revoked) {
        URL.revokeObjectURL(url);
        revoked = true;
      }
    },
  };
}
