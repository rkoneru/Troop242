## 2026-07-12 - [Isolated High-Frequency Updates]
**Learning:** A 1-second interval timer at the top of a large page component (31KB) causes the entire page tree to re-render every second, significantly impacting performance and battery life on mobile.
**Action:** Isolate high-frequency state updates to the smallest possible leaf components and use React.memo to prevent parent re-renders from propagating down to expensive static branches.
