## 2026-03-31 - External Link Accessibility with target="_blank"
**Learning:** When external links open in a new tab via target="_blank", screen readers need explicit context (such as "opens in a new tab") within `aria-label` attributes to prevent unexpected context switches during keyboard navigation.
**Action:** Always append "(opens in a new tab)" to the `aria-label` of external links that use `target="_blank"`.
