## 2026-03-31 - Search Input Clear Button Duplication in WebKit/Chromium
**Learning:** Native `type="search"` inputs in WebKit/Chromium render a default clear (`::-webkit-search-cancel-button`) pseudo-element when text is entered. When adding a custom accessible clear button (`<button type="button" aria-label="Clear search">`), the native icon creates duplicate visual controls.
**Action:** Always apply `::-webkit-search-cancel-button, ::-webkit-search-decoration { -webkit-appearance: none; appearance: none; }` to custom search inputs when providing custom accessible clear query buttons.
