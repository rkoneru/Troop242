## 2026-03-21 - Dynamic ARIA Labels on Interactive Flip Cards
**Learning:** When using `role="button"` and `aria-label` on flip card containers, the `aria-label` completely overrides the accessible name computed from its child DOM elements. If the card is flipped, the `aria-label` MUST explicitly include the revealed definition text, otherwise screen reader users will not hear the card's back content.
**Action:** Always include the flipped state's text content inside the dynamic `aria-label` string for 3D flip card elements.
