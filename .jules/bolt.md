## 2026-07-03 - [High-Frequency Re-render Isolation]
**Learning:** In large React pages like `Home.jsx` with complex SVGs and multiple animated sections, having a 1-second interval timer at the page level causes the entire component tree to re-render. This is extremely inefficient as most of the page (hero, why us, stats) is static between ticks.
**Action:** Always isolate high-frequency state updates (timers, mouse trackers, etc.) into the smallest possible leaf components. Use `React.memo` for adjacent components to ensure they stay skipped during these frequent updates.
