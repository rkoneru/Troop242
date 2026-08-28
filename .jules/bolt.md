## 2025-05-18 - Avoid In-Place State Mutation and Date Parsing During Component Render

**Learning:** Calling `Array.prototype.sort()` directly on state arrays inside JSX (e.g. `events.sort(...)`) mutates React state arrays in place during render and re-parses dates on every render frame.
**Action:** Always wrap state array sorting and date transformations in `useMemo` with proper dependencies, returning a shallow copy (`[...array].sort()`), to preserve pure render semantics and eliminate redundant $O(N \log N)$ operations on re-renders.
