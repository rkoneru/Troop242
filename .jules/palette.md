# Palette's Critical Learnings Journal

This journal tracks critical UX and accessibility learnings discovered during the development of Troop 242.

## 2025-06-22 - Accessibility pattern for navigation dropdowns
**Learning:** For navigation dropdowns that trigger on hover, providing explicit `aria-haspopup="true"` and `aria-expanded` attributes on the toggle button is critical for screen reader users. Additionally, adding an `onClick` handler ensures that keyboard users can toggle the menus when the button receives focus.
**Action:** Always include ARIA states and explicit click handlers on hover-triggered interactive elements to ensure full keyboard and screen-reader support.
