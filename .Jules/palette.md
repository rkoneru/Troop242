## 2025-05-14 - Skip to Content and Password Visibility
**Learning:** Skip links require a target landmark with `tabIndex="-1"` to ensure focus shifts correctly in all browsers, especially when navigating to non-natively focusable elements like `<main>`. Password toggles significantly improve mobile UX where typing complex passwords is error-prone.
**Action:** Always wrap main content in a `<main id="main-content" tabIndex="-1">` and include a skip link as the first focusable element in the header.
