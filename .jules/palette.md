## 2025-05-14 - Accessible Hover Dropdowns
**Learning:** Dropdowns that only trigger on hover are inaccessible to keyboard and screen reader users. Simply adding ARIA attributes is insufficient if the interaction remains hover-only.
**Action:** Always complement hover-based dropdowns with an `onClick` handler for the toggle button and ensure `aria-haspopup`, `aria-expanded`, and `aria-controls` are correctly linked to a unique ID on the menu container.
