# Bolt's Performance Journal

This journal documents critical performance-related learnings.

## 2026-03-05 - Polyfilling and Mocking in JSDOM for Modern Animations
**Learning:** In React 19 apps using Framer Motion and React Router 7, the JSDOM test runner encounters ReferenceErrors (e.g. `TextEncoder`) and slow rendering due to animation libraries. Polyfilling global JSDOM environment values (`TextEncoder`, `TextDecoder`, `IntersectionObserver`) and mocking `framer-motion` using a lightweight forwardRef Proxy completely eliminates animation-related overhead and resolves JSDOM test failures.
**Action:** Always verify test runner compatibility with modern UI libraries, and mock heavy animation components with standard DOM equivalents to maintain blazing-fast test runs.

## 2026-03-05 - Single-Pass Grouping in Memoized Computations
**Learning:** Performing multiple nested filters (e.g. `$O(L \cdot N)$` operations filtering glossary terms by letter in render loops) on each keystroke of a search bar can lead to input lag on lower-end devices. Memoizing the filtering, grouping, and letter sorting in a single `$O(N)$` linear-pass `useMemo` block completely avoids nested rendering operations.
**Action:** Use a unified `useMemo` block to return grouped and sorted structures instead of executing nested `.filter().map()` calls inside components.
