## 2025-07-15 - Improving Keyboard Accessibility for Interactive Flip Cards
**Learning:** Purely hover-based interactions are inaccessible to keyboard and screen reader users. Interactive elements that reveal information on hover should be treated as buttons or toggleable elements.
**Action:** Always add `role="button"`, `tabIndex={0}`, and matching keyboard event handlers (`onKeyDown` for Enter/Space, `onFocus`/`onBlur` for visibility) to hover-triggered components. Provide an `aria-label` that includes both the visible and hidden content to ensure screen reader users have the full context.
