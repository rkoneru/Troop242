# Bolt's Journal - Performance Optimizations

## 2025-05-15 - Initial Audit
**Learning:** Found several components where state changes cause large tree re-renders and where expensive calculations are performed on every render.
**Action:** Prioritize isolation of high-frequency state (timers) and memoization of derived state (filtering).
