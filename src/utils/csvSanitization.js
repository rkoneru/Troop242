/**
 * CSV Sanitization Utility
 * Prevents CSV Formula Injection (CSV Injection / Formula Injection)
 * when exporting user-controlled text fields to CSV files.
 */

/**
 * Sanitizes a single cell value for CSV export to prevent formula injection.
 * If the value starts with formula characters (=, +, -, @, \t, \r), prefix with a single quote.
 *
 * @param {any} val - The raw value of the CSV cell
 * @returns {string} Sanitized and escaped string suitable for CSV output
 */
export function sanitizeCsvCell(val) {
  if (val === null || val === undefined) {
    return '';
  }

  let str = String(val);

  // Strip leading space characters before checking trigger chars
  const trimmed = str.trimStart();
  if (/^[=+\-@\t\r]/.test(trimmed)) {
    str = `'${str}`;
  }

  // Escape any double quotes by doubling them
  const escaped = str.replace(/"/g, '""');

  return `"${escaped}"`;
}
