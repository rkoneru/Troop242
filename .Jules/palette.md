## 2025-05-22 - Login Form Accessibility
**Learning:** Proper label association using `htmlFor` and `id` is crucial for screen reader users to understand form fields. ARIA attributes like `aria-invalid` and `aria-describedby` provide essential context during error states, and `role="alert"` ensures immediate feedback for dynamic error messages.
**Action:** Always ensure form inputs have unique IDs matched with label `htmlFor` attributes, and use ARIA live regions for error feedback.
