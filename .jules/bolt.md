## 2025-05-14 - Search Debouncing and Test Reliability
**Learning:** React components using complex interactions (like search) can suffer from excessive re-renders and utility calls without debouncing. Additionally, test suites may contain logically incorrect assertions that block CI/CD pipelines.
**Action:** Always implement debouncing for search/filter inputs and verify test logic when fixing regressions to ensure a smooth build process.
