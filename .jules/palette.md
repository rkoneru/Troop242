## 2025-05-14 - [Accessible Navigation: Skip Links]
**Learning:** Implementing a "Skip to main content" link requires both a visible-on-focus link in the header and a corresponding landmark with a matching ID (e.g., `<main id="main-content">`). For the focus shift to work reliably across all browsers, the target landmark should have `tabIndex="-1"`.
**Action:** Always wrap the primary page content in a semantic `<main>` tag with a clear ID and ensure a skip link is the first focusable element in the DOM.
