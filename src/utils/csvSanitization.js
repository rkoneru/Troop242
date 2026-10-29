/**
 * Sanitizes a cell value for safe CSV export, preventing CSV Formula Injection (Excel Macro Injection).
 * Formula injection occurs when a cell begins with characters such as '=', '+', '-', '@', '\t', or '\r'.
 * Prepending a single quote (') forces spreadsheet software to interpret the value as text.
 *
 * @param {any} val - Value to sanitize
 * @returns {string} - Sanitized and quoted CSV cell value
 */
export function sanitizeCsvCell(val) {
  if (val === null || val === undefined) {
    return '""';
  }

  let str = String(val);

  // If value starts with formula injection triggers, prefix with single quote
  if (/^[=+@\-\t\r]/.test(str)) {
    str = "'" + str;
  }

  // Escape internal double quotes and enclose in double quotes
  const escaped = str.replace(/"/g, '""');
  return `"${escaped}"`;
}
