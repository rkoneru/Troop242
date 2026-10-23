## 2026-10-23 - Search Widget Query Reset & Focus Restoration
**Learning:** In interactive search modal overlays, setting query state via suggestion pills or clear controls without returning keyboard focus to the search input (`inputRef.current?.focus()`) breaks keyboard flow and screen reader navigation context.
**Action:** Always auto-refocus search inputs when clicking quick suggestion pills or clear query buttons, and add `aria-live="polite"` regions so query results/empty states are announced dynamically.
