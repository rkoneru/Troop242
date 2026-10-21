# Palette's Journal - UX & Accessibility Learnings

## 2026-03-21 - Dynamic Invitation Code Copy Accessibility
**Learning:** In invitation management interfaces where registration links and codes are generated dynamically, buttons that copy values or share links need explicit `type="button"`, contextual `aria-label` attributes (`Copy registration link`, `Copy code XYZ for email`), and `aria-hidden="true"` on status icons (`Check`, `Copy`). Furthermore, generated result containers should include live region attributes (`role="status"`, `aria-live="polite"`) so screen readers announce creation events immediately.
**Action:** Always associate input fields with labels via `htmlFor`/`id`, apply `aria-live="polite"` to dynamically displayed action cards, and set explicit button types and ARIA labels on copy actions.
