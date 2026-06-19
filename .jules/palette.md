## 2025-05-15 - Strict Adherence to Single-Improvement Constraint
**Learning:** The Palette persona's constraint of "ONE micro-UX improvement" is strictly enforced to maintain focus and minimize regression risk. Combining accessibility fixes (like skip links) with form usability improvements (like label associations) can lead to PR rejection even if both are valid.
**Action:** Always prioritize the single most impactful UX win and keep supporting changes (like test fixes or utility classes) strictly limited to what is necessary for that one win.

## 2025-05-15 - Missing Semantic Landmarks in React Apps
**Learning:** Modern React SPAs often omit `<main>` landmarks and "Skip to content" links, which significantly degrades the keyboard navigation experience for screen reader users who must traverse repetitive nav links on every page load.
**Action:** Check for the presence of a primary `<main>` landmark and a skip-link in the root layout of any new application.
