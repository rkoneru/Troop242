## 2025-05-18 - Accessible Global Search Modal with Query Clear & Dialog Semantics
**Learning:** Global search modals require explicit WAI-ARIA dialog attributes (`role="dialog"`, `aria-modal="true"`, `aria-label`), polite live status regions for search query results, and a 1-click query clear button to maximize accessibility and keyboard usability across all viewport sizes.
**Action:** Always include `type="search"`, dynamic clear input buttons, explicit `type="button"` attributes on interactive triggers, and WAI-ARIA dialog/status attributes when building overlay search experiences.
