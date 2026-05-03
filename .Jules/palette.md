## 2025-05-15 - [Accessible Skip Links with Tailwind]
**Learning:** Skip-to-content links can be implemented entirely with Tailwind utility classes (`sr-only`, `focus:not-sr-only`, `focus:fixed`) in this project, avoiding the need for custom CSS in `index.css`. Wrapping main content in a `<main id="main-content" tabIndex="-1" className="outline-none">` tag ensures proper focus management without visual artifacts.
**Action:** Use the `sr-only focus:not-sr-only` pattern for all skip links and keyboard-only accessibility controls to keep the CSS footprint small.
