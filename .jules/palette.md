## 2025-07-14 - Accessible Hover Dropdowns
**Learning:** For navigation dropdowns that trigger on hover (like those in `Header.jsx`), providing explicit `aria-haspopup="true"`, `aria-expanded`, and `aria-controls` attributes on the toggle button is critical for accessibility. Additionally, an `onClick` handler (using functional state updates like `setOpen(prev => !prev)`) ensures keyboard and assistive technology compatibility.
**Action:** Always include ARIA state attributes and a click-to-toggle fallback for any hover-based interactive menus.
