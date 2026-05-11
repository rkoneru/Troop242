
## 2024-05-11 - [Memoization of merit badge metadata]
**Learning:** In components with large static datasets (like ~150 merit badges) that undergo filtering and rendering, re-calculating metadata (string regex, array lookups) and filtering on every render is a significant bottleneck. Moving these operations into `useMemo` and pre-calculating as much as possible avoids repetitive work.
**Action:** Use `useMemo` for heavy data transformations and pre-calculate stable metadata inside the memoized block to keep the render loop lean.
