
## 2026-06-23 - Isolated High-Frequency State Updates in Home.jsx
**Learning:** High-frequency state updates (e.g., a 1-second countdown timer) in a large parent component cause the entire component tree to re-render, even if only a small part of the UI changes. This is especially impactful when combined with complex animations (Framer Motion).
**Action:** Isolate high-frequency state updates to the smallest possible leaf components. Hoist static configuration objects (like animation variants) outside of the component body to prevent redundant object creation on every render.
