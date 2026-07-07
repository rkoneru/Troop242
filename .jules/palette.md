## 2025-05-14 - Accessible Dropdown Menus
**Learning:** For navigation dropdowns that trigger on hover (like those in `Header.jsx`), providing explicit `aria-haspopup="true"`, `aria-expanded`, and `aria-controls` attributes on the toggle button is critical for accessibility. Additionally, an `onClick` handler (using functional state updates like `setOpen(prev => !prev)`) and a matching `id` on the menu container ensures keyboard and assistive technology compatibility.
**Action:** Always include ARIA state attributes and an explicit click toggle when implementing hover-based menus.
