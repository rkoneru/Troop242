## 2025-05-22 - Isolate high-frequency timers in large components
**Learning:** Maintaining a 1-second interval timer in a large (30KB+) root component like `Home.jsx` causes the entire component tree to re-render every second, significantly impacting performance and battery life.
**Action:** Extract localized, high-frequency updates (timers, progress bars, real-time counters) into dedicated sub-components to isolate state changes and minimize the re-render scope.
