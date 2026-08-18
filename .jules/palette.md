## 2025-05-18 - Accessible Search Overlay Modals
**Learning:** Overlay search panels built with Framer Motion require explicit modal dialog ARIA attributes (`role="dialog"`, `aria-modal="true"`, `aria-label`) and search-specific input types (`type="search"`) to be properly announced and navigated by screen readers.
**Action:** Always wrap search modal containers with `role="dialog"` and `aria-modal="true"`, set `type="search"` on the input, and ensure external links within search results have visual and screen reader indicators (`ExternalLink` icon and open external annotation).
