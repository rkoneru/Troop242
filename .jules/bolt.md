## 2025-05-18 - Route-Level Code Splitting with React.lazy
**Learning:** In a SPA with 30+ pages, statically importing all route page components in `App.jsx` creates a massive initial JS bundle (~1.3 MB) containing admin tools, multi-step wizards, and feature components that are not needed on initial load.
**Action:** Use `React.lazy()` and `<Suspense>` at the route level in `App.jsx` to enable automatic Vite route chunking, cutting initial bundle payload by over 550 kB (~42.5%).
