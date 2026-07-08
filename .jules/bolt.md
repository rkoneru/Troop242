## 2025-05-15 - Isolating High-Frequency State Updates

**Learning:** In React components with high-frequency updates (e.g., 1-second countdown timers), keeping the state at the page level causes the entire component tree to re-render, which is extremely expensive for large components like `Home.jsx`.

**Action:** Isolate high-frequency state updates to the smallest possible leaf components (e.g., `EventCard`). Use `React.memo` for static or infrequently changing siblings to ensure that only the component that actually needs the update re-renders. This drastically reduces CPU usage and prevents jank during animations.
