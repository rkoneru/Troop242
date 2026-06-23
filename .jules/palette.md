# Palette's Critical Learnings Journal

## 2025-05-15 - Icon-only Button Accessibility
**Learning:** Found that the `DidYouKnowCarousel` in `Home.jsx` uses icon-only buttons for navigation without `aria-label`. This makes the controls unusable for screen reader users as they have no accessible name.
**Action:** Always provide `aria-label` for buttons that do not contain visible text.
