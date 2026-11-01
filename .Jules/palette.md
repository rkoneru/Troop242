# Palette's Journal - UX & Accessibility Learnings

## 2026-03-24 - Semantic Radio Buttons for Theme & Framework Cards
**Learning:** Interactive option grids (like theme or UI framework selectors) that use generic `<div>` containers with click handlers fail WCAG 2.1 AA keyboard navigation and screen reader requirements. Using `<button type="button" role="radio" aria-checked={...}>` within a `role="radiogroup"` preserves visual card styling while granting native tab focus, keyboard activation (Enter/Space), and screen reader role and state semantics.
**Action:** Always render card option pickers as semantic buttons with appropriate ARIA radiogroup roles and live region announcements.
