/**
 * CSV Sanitization Utility
 * Sanitizes cell values to prevent CSV / Formula Injection vulnerabilities (CWE-1236)
 */

/**
 * Sanitizes a value for inclusion in a CSV document.
 * Escapes double quotes and prefixes formula trigger characters (=, +, -, @, \t, \r)
 * with a single quote (') to prevent spreadsheet applications from executing formulas.
 *
 * @param {any} value - The input cell value
 * @returns {string} - The sanitized and double-quoted CSV cell string
 */
export function sanitizeCsvCell(value) {
  if (value === null || value === undefined) {
    return '""';
  }

  let str = String(value);

  // Prefix formula trigger characters (=, +, -, @, \t, \r) with a single quote
  if (/^\s*[=+\-@\t\r]/.test(str)) {
    str = `'${str}`;
  }

  // Escape double quotes by doubling them
  const escaped = str.replace(/"/g, '""');

  return `"${escaped}"`;
}
