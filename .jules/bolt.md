## 2026-03-30 - Avoid In-Place State Mutation and Heavy Filtering in Portal Render Loops
**Learning:** Calling `.sort()` on state arrays during React render (e.g., `patrols.sort(...)`) mutates React state in-place and recalculates on every render frame. In addition, unmemoized filtering over large datasets like `FIELD_GUIDE` (136 items) allocates new array instances on unrelated state updates.
**Action:** Always create a shallow copy (`[...stateArray]`) before sorting, and wrap large filtering and sorting operations in `useMemo` hooks.
