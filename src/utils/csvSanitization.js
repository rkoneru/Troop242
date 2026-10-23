/**
 * CSV Sanitization Utility
 * Prevents CSV Formula Injection (Formula Injection / CSV Injection)
 * when exporting user-supplied data to CSV spreadsheets (Excel, Google Sheets, Calc).
 */

/**
 * Sanitizes a single cell value for CSV export.
 * Escapes double quotes and prefixes formula trigger characters (=, +, -, @, \t, \r)
 * with a single quote (') to force text evaluation.
 *
 * @param {any} value - The raw cell value
 * @returns {string} Sanitized and quoted CSV cell string
 */
export function sanitizeCsvCell(value) {
  if (value === null || value === undefined) {
    return '""';
  }

  let str = String(value);

  // If the cell begins with formula trigger characters, prefix with single quote
  if (/^[=+\-@\t\r]/.test(str)) {
    str = `'${str}`;
  }

  // Escape internal double quotes by doubling them
  const escaped = str.replace(/"/g, '""');

  return `"${escaped}"`;
}
