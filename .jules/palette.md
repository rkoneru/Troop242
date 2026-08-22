## 2026-03-21 - Interactive Card Accessibility Pattern
**Learning:** In glassmorphism cards that expand on click (such as story or feedback cards), adding `role="button"`, `tabIndex={0}`, dynamic `aria-expanded`, `aria-controls`, and `onKeyDown` (for Enter/Space) ensures full keyboard and screen reader accessibility without changing visual aesthetics.
**Action:** When making card components interactive, always pair click handlers with keyboard event listeners and appropriate ARIA roles/controls.
