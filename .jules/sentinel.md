## 2026-03-31 - Target Blank Reverse Tabnabbing Vulnerability in Footer Link
**Vulnerability:** External address link in `src/components/Footer.jsx` used an `onClick` handler with `window.open(..., '_blank')` without window features, allowing potential reverse tabnabbing attacks where the destination page could manipulate `window.opener`.
**Learning:** `window.open(url, '_blank')` without specifying `noopener,noreferrer` retains a reference to the source window (`window.opener`), exposing the client application to phishing or tab hijacking.
**Prevention:** Always use standard `<a href="..." target="_blank" rel="noopener noreferrer">` tags for external links in React components.
