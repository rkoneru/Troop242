## 2026-05-04 - [Search Widget Keyboard Navigation]
**Learning:** Implementing the WAI-ARIA Combobox pattern with `aria-activedescendant` significantly improves accessibility for screen readers, but requires manual synchronization of visual focus states. Without a corresponding CSS class for the "active" item, keyboard users are left without visual feedback.
**Action:** Always pair `activeIndex` state with a corresponding CSS class (e.g., `.active`) that mirrors `:hover` styles when implementing custom list navigation.
