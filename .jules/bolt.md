## 2025-07-14 - [Isolating High-Frequency Re-renders]
**Learning:** High-frequency state updates (like a 1-second countdown timer) in a large page-level component can cause significant performance degradation by triggering unnecessary re-renders of the entire page content. Hoisting static animation variants to the module scope also prevents object re-creation on each render.
**Action:** Always isolate high-frequency state updates to the smallest possible leaf component and utilize `React.memo` to prevent cascading re-renders in parent components.
