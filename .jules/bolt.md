## 2025-05-22 - Isolating High-Frequency State
**Learning:** In React, a single timer (setInterval) updating state in a large parent component causes the entire VDOM tree to be diffed every tick. Even if the changes are small, the overhead of diffing a 600+ line component every second is significant, especially on mobile devices.
**Action:** Extract timer-dependent logic into small, isolated components. This ensures that only the minimal necessary part of the UI re-renders, drastically reducing VDOM diffing overhead.
