/**
 * Sanitizes a value for CSV export to prevent CSV Formula Injection (CSV Injection / Macro Injection).
 * Formula injection occurs when values starting with '=', '+', '-', '@', '\t', or '\r' are interpreted as executable formulas or commands in spreadsheet applications (e.g. Excel, Calc).
 *
 * @param {any} value - Cell value to sanitize
 * @returns {string} Sanitized cell string safe for CSV export
 */
export function sanitizeCsvCell(value) {
  if (value === null || value === undefined) {
    return '';
  }

  let str = String(value);

  // Escape double quotes by doubling them
  str = str.replace(/"/g, '""');

  // Neutralize potential formula injection characters at start of cell
  if (/^[=+\-@\t\r]/.test(str)) {
    str = `'${str}`;
  }

  return str;
}
