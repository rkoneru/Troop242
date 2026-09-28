## 2025-05-18 - Unused Timer Intervals in Animated Components
**Learning:** Animated SVG components or visuals that rely on CSS keyframes sometimes include remnant React `useState` timer loops (e.g. `setInterval` triggering state updates every 50ms) left over from draft or debug implementations. These timers trigger 20+ state updates and full component DOM diffs per second without producing any visible changes.
**Action:** Inspect animation components for unused timer state updates and remove them so CSS animations run hardware-accelerated without triggering React re-render loops.
