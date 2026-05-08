## 2025-05-22 - [WAI-ARIA Combobox for Search]
**Learning:** Implementing the WAI-ARIA Combobox pattern (roles: combobox, listbox, option; attributes: aria-activedescendant, aria-selected) significantly improves the accessibility of custom search components for screen reader users by providing semantic meaning to keyboard-driven selection.
**Action:** Always pair visual 'active' states in custom dropdowns/searches with `aria-activedescendant` on the input and `aria-selected` on the list items.
