## 2025-07-01 - [Component State Isolation]
**Learning:** High-frequency state updates (like a 1s countdown timer) in a top-level component cause the entire component tree to re-render, even if the sub-components are static.
**Action:** Isolate high-frequency state into leaf components (e.g., `EventCard`) and use `React.memo` to prevent parent renders from trickling down to static neighbors.
