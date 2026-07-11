# Bolt's Journal - Performance Learnings

## 2025-05-14 - Isolating High-Frequency State Updates
**Learning:** In React components with complex trees (like a landing page with carousels and animations), a top-level `setInterval` updating state every second for a countdown timer causes the entire tree to re-render, even if only a tiny leaf node needs the update. This is especially impactful when using libraries like Framer Motion which may re-calculate animations on every render.
**Action:** Always encapsulate high-frequency timers (countdowns, clocks, progress bars) into the smallest possible leaf components. Use `React.memo` on these leaf components and their siblings to ensure that parent re-renders (if they happen) don't cascade unnecessarily.

## 2025-05-14 - Jest Environment and TextEncoder
**Learning:** Modern versions of React Router (v7+) and other dependencies may rely on `TextEncoder` and `TextDecoder` being available in the global scope. JSDOM (default Jest environment) does not provide these by default, leading to cryptic `ReferenceError: TextEncoder is not defined` failures during `pnpm test`.
**Action:** Add `const { TextEncoder, TextDecoder } = require('util'); global.TextEncoder = TextEncoder; global.TextDecoder = TextDecoder;` to `src/setupTests.js` to ensure a compatible testing environment for modern ESM/Web-API-reliant packages.
