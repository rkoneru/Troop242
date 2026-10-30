# Palette's Journal - Critical Learnings Only

## 2026-03-21 - [Referral Links Micro-UX and Accessibility]
**Learning:** Shared invitation and referral link panels require explicit label-to-input association (`htmlFor` / `id`) and dynamic screen-reader accessible `aria-label` feedback on copy/share actions so non-visual users receive instant confirmation when links or invitation codes are copied to the clipboard.
**Action:** Always provide `type="button"`, `htmlFor`/`id` pairs, dynamic `aria-label`, and `role="status"` live regions on interactive copy/share panels.
