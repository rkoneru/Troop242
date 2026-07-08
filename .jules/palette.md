## 2025-05-22 - Accessibility and Micro-UX in Forms
**Learning:** For navigation dropdowns that trigger on hover (like those in `Header.jsx`), providing explicit `aria-haspopup="true"`, `aria-expanded`, and `aria-controls"` attributes on the toggle button is critical for accessibility. Additionally, an `onClick` handler (using functional state updates like `setOpen(prev => !prev)`) and a matching `id` on the menu container ensures keyboard and assistive technology compatibility. (Note: These were from memory, adding new one below).

**Learning:** When implementing password visibility toggles, using `type={showPassword ? 'text' : 'password'}` provides immediate feedback. Associating labels via `htmlFor` and providing `aria-describedby` linked to live-region error messages (role="alert") significantly improves the experience for screen reader users.
**Action:** Always include a password visibility toggle for better UX and ensure full ARIA coverage on form fields.
