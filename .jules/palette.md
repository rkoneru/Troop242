## 2026-03-21 - [Icon-Only Carousel Controls Accessibility]
**Learning:** Carousel controls that only use icons (like chevron icons) lack accessible names. Screen readers can only announce them as "button", giving no context on what action they perform. Providing descriptive `aria-label` attributes like "Previous fact" or "Next fact" solves this.
**Action:** Always inspect custom interactive controls (carousels, sliders, custom dropdowns) for icon-only buttons and explicitly add descriptive `aria-label` or `aria-labelledby` attributes.
