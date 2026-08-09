# Palette UX/Accessibility Journal

## 2025-02-18 - Accordion and Form Accessibility Standards
**Learning:** Standard interactive components (such as FAQ accordions) and input forms built in custom styles/frameworks often omit native WAI-ARIA and HTML linking properties (`aria-expanded`, `aria-controls`, `id`, `htmlFor`). This hinders screen-reader users from identifying state (expanded/collapsed), navigating structure, and easily focusing inputs.
**Action:** Always map standard HTML `id`/`htmlFor` for labels/inputs, and explicitly implement WAI-ARIA roles (`role="region"`), states (`aria-expanded`), and element links (`aria-controls`, `aria-labelledby`) on collapsible sections.
