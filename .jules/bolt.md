## 2025-05-15 - React Component-in-Component Anti-Pattern in Dashboard Pages

**Learning:** Declaring React functional subcomponents (e.g. `ScoutCard`, `ActivityCard`) directly inside parent component render functions creates new function references on every render. This forces React to unmount and remount the entire DOM subtree and restart animations on every state update or real-time snapshot listener dispatch.

**Action:** Always hoist item components outside parent component bodies and wrap with `React.memo` while memoizing callback handlers (`useCallback`) and derived sorted arrays (`useMemo`).
