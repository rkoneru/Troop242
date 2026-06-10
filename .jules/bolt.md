## 2026-06-10 - [Home Page Re-render Bottleneck]
**Learning:** High-frequency state updates (1s timer) in a large parent component like `Home.jsx` trigger unnecessary re-renders of the entire page, including static illustrations and carousels.
**Action:** Isolate high-frequency state into dedicated child components (`EventCard`) and hoist static animation variants outside the render function to minimize re-render scope and object recreation.
