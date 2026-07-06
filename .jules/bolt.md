## 2025-05-15 - Isolating high-frequency state updates in large components
**Learning:** In large React components (like the 600+ line Home page), high-frequency state updates (e.g., 1-second timers) can cause expensive full-page re-renders. Extracting the timer logic into a dedicated, memoized leaf component prevents this.
**Action:** Always look for high-frequency timers or frequent event listeners in large components and isolate them into specialized leaf components.
