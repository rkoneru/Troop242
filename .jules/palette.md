## 2026-08-16 - Accessible Navigation Dropdowns
**Learning:** Dropdowns that rely solely on hover events (`onMouseEnter`/`onMouseLeave`) are inaccessible to keyboard and touch screen users. Providing `onClick` handlers that toggle state along with `aria-haspopup="true"`, `aria-expanded`, `aria-controls`, and `id` attributes ensures full accessibility across input methods.
**Action:** Always pair hover-triggered dropdowns with keyboard `onClick` state toggles and appropriate ARIA disclosure attributes.
