## 2025-05-18 - WAI-ARIA Tab and Toggle Button Accessibility in Calendar

**Learning:** Interactive tab bars and toggle buttons (like event RSVPs) without ARIA roles (`role="tablist"`, `role="tab"`, `role="tabpanel"`, `aria-selected`, `aria-controls`, `aria-pressed`) fail to announce their selection state or relationship to screen reader users.
**Action:** When creating tab navigation or toggleable action buttons in React components, always associate tabs with tabpanels using matching `id`/`aria-controls`/`aria-labelledby` attributes and provide `aria-pressed` or `aria-selected` state feedback.
