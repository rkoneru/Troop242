## 2026-03-21 - [Search Accessibility and WAI-ARIA]
**Learning:** Global search components should implement the WAI-ARIA Combobox pattern with keyboard navigation (ArrowUp/Down) to ensure they are accessible to both screen reader and power users.
**Action:** Always pair visual active states with `aria-activedescendant` and `aria-selected` for keyboard-navigable lists.

## 2026-03-21 - [Accessibility Utility Availability]
**Learning:** Common accessibility classes like `.sr-only` should be defined globally in the main stylesheet (`index.css`) to prevent silent accessibility failures when they are used in components.
**Action:** Check for the presence of standard utility classes in the global CSS before using them in new UI components.
