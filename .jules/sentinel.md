## 2026-03-31 - CSV Formula Injection in Data Exports
**Vulnerability:** Raw scout data exported to CSV in `LeaderDashboard.jsx` allowed user inputs starting with formula triggers (`=`, `+`, `-`, `@`, `\t`, `\r`) to execute arbitrary spreadsheet formulas when opened in Excel/Google Sheets.
**Learning:** Concatenating raw string variables in CSV output without sanitizing formula trigger characters exposes spreadsheet users to formula injection and macro execution risks.
**Prevention:** Always pass string cell values through a CSV sanitization function like `sanitizeCsvCell` that prefixes trigger characters with `'` and escapes double quotes before CSV generation.
