## 2025-05-14 - [Form Accessibility & Password Visibility]
**Learning:** Found that form inputs lacked explicit 'id' and 'htmlFor' associations, which hinders screen reader navigation. Additionally, long/complex passwords benefit significantly from a visibility toggle to prevent entry errors.
**Action:** Always link labels to inputs using unique IDs and provide a 'Show/Hide' toggle for password fields using 'lucide-react' icons and proper ARIA labels.

## 2025-05-14 - [Test Environment for React Router 7]
**Learning:** React Router 7 and modern JS features in this repo require 'TextEncoder', 'TextDecoder', and 'IntersectionObserver' polyfills when running in a JSDOM environment (Jest).
**Action:** Ensure 'src/setupTests.js' includes these polyfills to prevent 'ReferenceError: TextEncoder is not defined' during component testing.
