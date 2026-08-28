## 2025-05-18 - Interactive Card Keyboard Accessibility & WAI-ARIA
**Learning:** Custom interactive cards built with div wrappers often lack semantic roles, keyboard event listeners (Enter/Space), and screen reader state associations (aria-expanded/aria-controls).
**Action:** Always add `role="button"`, `tabIndex={0}`, dynamic `aria-label`, `aria-expanded`, `aria-controls`, and `onKeyDown` handlers to non-native clickable card components.
