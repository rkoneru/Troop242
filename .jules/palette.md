# Palette's Journal - UX & Accessibility Learnings

## 2026-05-13 - [Keyboard shortcuts and navigation in SearchWidget]
**Learning:** Documented keyboard shortcuts (like Alt+S) must be explicitly implemented if they aren't provided by default browser behavior or existing libraries. Users relying on accessibility guides expect these to work. Providing visual feedback (e.g., an `.active` class) during keyboard navigation of lists is crucial for sighted keyboard users to know which item is currently focused.
**Action:** Always check `AccessibilityGuide.jsx` or similar docs to ensure documented shortcuts are functional. Implement keyboard navigation (Arrow keys + Enter) for any custom dropdown or search result list.
