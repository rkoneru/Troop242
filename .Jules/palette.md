## 2026-03-21 - Accessible Authentication Form Controls
**Learning:** Glassmorphism form inputs styled with inline React CSS without `htmlFor`/`id` input label bindings prevent screen readers from announcing control names and break browser password manager autofill.
**Action:** Always link form labels using `htmlFor` and `id`, provide explicit `autoComplete` hints (`email`, `current-password`), and wrap error banners in `role="alert"` and `aria-live="polite"` live regions.
