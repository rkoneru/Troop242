## 2025-05-15 - Navigation Accessibility Patterns

**Learning:** Navigation dropdowns in the header were relying on CSS focus-within/hover for visibility, which provided no feedback to screen readers and made them difficult to toggle intentionally via keyboard. Interactive elements that reveal content should have explicit ARIA states and be triggerable via standard activation keys.

**Action:** Ensure all navigation dropdowns use `aria-haspopup="true"` and `aria-expanded` attributes. Use `onClick` handlers on trigger buttons to ensure keyboard activation (Enter/Space) works consistently across devices and provides the necessary state changes for assistive technologies.
