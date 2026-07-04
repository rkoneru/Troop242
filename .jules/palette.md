## 2026-07-04 - Accessible Form Associations
**Learning:** Proper label-input association using `htmlFor` and `id` is fundamental for screen reader accessibility. Additionally, using `aria-invalid` and `aria-describedby` linked to a `role="alert"` container ensures that validation errors are immediately and clearly communicated to assistive technology users.
**Action:** Always verify that form inputs have unique IDs and matching labels, and ensure error messages are programmatically linked to their respective inputs using ARIA attributes.
