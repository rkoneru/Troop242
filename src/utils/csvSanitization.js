/**
 * Utility to sanitize values for CSV export to prevent CSV Formula Injection (CWE-1236)
 */

/**
 * Sanitizes a single cell value for CSV formatting.
 * Prefixes cells starting with formula triggers (=, +, -, @, \t, \r) with a single quote (')
 * and escapes double quotes.
 *
 * @param {any} value - The input cell value to sanitize
 * @returns {string} The sanitized and CSV-escaped string
 */
export function sanitizeCsvCell(value) {
  if (value === null || value === undefined) {
    return '""';
  }

  let str = String(value);

  // If the string starts with formula trigger characters, prefix with single quote
  if (/^[=+\-@\t\r]/.test(str)) {
    str = `'${str}`;
  }

  // Escape internal double quotes by doubling them
  const escaped = str.replace(/"/g, '""');

  return `"${escaped}"`;
}
