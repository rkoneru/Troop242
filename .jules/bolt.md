## 2026-03-31 - Memoizing Sub-components in High-Frequency Timer Components
**Learning:** Components with active timers (like 1s `setInterval` countdowns) trigger state updates and re-renders on every tick. Unmemoized child components (like card items or static containers) re-render and re-allocate objects on every second.
**Action:** Extract child items into separate `React.memo` components and hoist static animation variants (`containerVariants`, `itemVariants`) to module scope.
