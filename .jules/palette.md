## 2026-03-05 - Form and Accordion Accessibility on Contact Page
**Learning:** Adding standard `htmlFor` and `id` attributes on form elements enables seamless touch/click-to-focus on text labels and allows screen readers to correctly read fields. Similarly, WAI-ARIA states such as `aria-expanded`, `aria-controls`, `role="region"`, and `aria-labelledby` are necessary on collapsible elements like accordions to ensure that assistive technologies can dynamically announce state changes.
**Action:** Always verify form labels and interactive collapsible sections for missing ARIA metadata and proper element associations.

## 2026-03-05 - Mocking and Polyfills for Modern React/Router Testing
**Learning:** Running Jest/JSDOM tests with modern packages (like React Router 7, Framer Motion, and Firebase) will fail due to missing web platform APIs like `TextEncoder`, `TextDecoder`, `IntersectionObserver`, or `window.scrollTo` in the default Node.js test environment.
**Action:** Ensure these critical polyfills are added to the global namespace in `src/setupTests.js` before executing any integration or unit tests.
