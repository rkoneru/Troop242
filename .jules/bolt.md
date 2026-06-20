## 2025-06-20 - Isolate high-frequency timers to leaf components
**Learning:** In the `Home.jsx` component, a countdown timer updating every second was causing the entire page (Hero, Stats, "Why Us", etc.) to re-render. React performance can degrade significantly when high-frequency state updates are located in top-level components of a large component tree.
**Action:** Always isolate high-frequency updates (timers, mouse tracking, etc.) into the smallest possible dedicated leaf components to ensure only those components re-render, keeping the rest of the application tree static.
