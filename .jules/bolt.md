## 2026-06-11 - Memoization and Hoisting in Badges.jsx
**Learning:** Large data sets (150+ items) in React components can cause noticeable lag during state updates (like typing in a search bar) if filtered on every render. Hoisting static animation variants prevents unnecessary object re-creation and potential re-renders in motion-based components.
**Action:** Always memoize derived state that depends on search terms or large arrays. Hoist static objects (like Framer Motion variants) to module scope.
