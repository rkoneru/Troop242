/**
 * Sanitizes a cell value for CSV export to prevent CSV / Formula Injection attacks.
 * If a value starts with =, +, -, @, tab, or carriage return, it prefixes it with a single quote.
 * It also escapes double quotes by doubling them.
 *
 * @param {any} value - Cell value to sanitize
 * @returns {string} Sanitized string safe for CSV inclusion
 */
export function sanitizeCsvCell(value) {
  if (value === null || value === undefined) {
    return '';
  }
  const str = String(value);
  // Double quotes escape
  let escaped = str.replace(/"/g, '""');
  // Check formula injection trigger characters
  if (/^[=+\-@\t\r]/.test(escaped)) {
    escaped = `'${escaped}`;
  }
  return escaped;
}
