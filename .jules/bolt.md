## 2026-06-03 - [Home Page Re-render Isolation]
**Learning:** Centralized countdown timer state in the `Home` page component caused the entire page (hero, stats, facts, badges) to re-render every second. Even if the state only affects specific cards, React's default behavior re-renders the subtree unless heavily memoized.
**Action:** Isolate high-frequency state (like 1s timers) into the smallest possible leaf components (`EventCard`). This restricts the render impact to only the elements that actually change.
