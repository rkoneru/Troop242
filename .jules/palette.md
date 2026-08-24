## 2025-05-18 - Non-nested Interactive Controls for Accordion Items
**Learning:** Placing interactive controls (such as a `<button role="checkbox">`) inside an outer container element marked as `role="button"` creates nested interactive controls, which violates WAI-ARIA standards and confuses screen readers and keyboard navigation focus.
**Action:** Always separate checkbox controls and expandable trigger sections into sibling `<button>` elements within a list or flex row.
