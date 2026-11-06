# Palette's Journal - Critical Learnings Only

## 2026-03-31 - Accessible Interactive Flashcard Components
**Learning:** Interactive 3D/flipping study cards built with motion container `div`s lack keyboard focus, announcement state, and semantic control. In addition, when users cycle between study cards, persistent flipped states cause subsequent cards to open backwards (showing the answer/definition before the prompt/term).
**Action:** Always render interactive flashcards as semantic `<button type="button">` elements with explicit dynamic `aria-label`s, `aria-pressed`, and clear `focus-visible` styling; automatically reset flip status upon navigation and pair card counter with `aria-live="polite"` so assistive technologies announce card context changes seamlessly.
