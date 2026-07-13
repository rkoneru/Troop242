## 2026-07-13 - Isolate High-Frequency Countdown State
**Learning:** In a large component (like the 31KB `Home.jsx`), high-frequency state updates (e.g., a 1-second timer) trigger expensive re-renders of the entire component tree. This significantly degrades performance, especially with complex animations or many child components.
**Action:** Isolate high-frequency state updates into dedicated, small leaf components. Wrap these components in `React.memo` to ensure they only re-render when their own state or props change, and use stable keys for animations to avoid redundant transitions.
