## 2025-05-15 - Top-level interval state in large pages
**Learning:** Placing a 1-second interval state (like a countdown) at the top level of a large component (like the Home page) causes the entire DOM tree, including complex animated SVGs, to re-render every second.
**Action:** Always isolate frequent state updates (timers, mouse tracking, etc.) into the smallest possible child component to minimize the re-render scope.
