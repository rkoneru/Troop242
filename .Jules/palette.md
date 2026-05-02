## 2025-05-15 - Search Keyboard Navigation and ARIA Combobox
**Learning:** Implementing the WAI-ARIA Combobox pattern in a React search component significantly improves accessibility for screen reader users and power users who prefer keyboard navigation. A debounce of 300ms is a sweet spot for preventing UI flickering while maintaining responsiveness.
**Action:** Use `aria-activedescendant` combined with a managed `activeIndex` state to provide a robust accessible focus management system for list-based search results.
