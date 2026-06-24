## 2025-05-15 - Isolating High-Frequency Countdown Timers
**Learning:** In large React components like `Home.jsx`, high-frequency state updates (e.g., a 1s interval for a countdown) trigger full-component re-renders. This is especially expensive when the component contains many other complex child components and animation logic.
**Action:** Isolate timers and other high-frequency state into small, leaf components (e.g., `EventCard.jsx`). Use `React.memo` to ensure the parent component's re-renders don't force unnecessary updates on these optimized leaf components, and vice versa.
