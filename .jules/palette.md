## 2026-03-30 - Scout Portal Icon Button Accessibility
**Learning:** Icon-only control buttons in complex dashboard portals (such as navigation toggles, modal close buttons, and list row deletion triggers) lack accessible names for screen reader users unless explicitly assigned `aria-label` and `aria-expanded` state attributes.
**Action:** Always audit icon-only buttons across all portal tools and add context-aware `aria-label` and `aria-expanded` properties during UI component updates.
