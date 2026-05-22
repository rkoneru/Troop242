## 2025-05-15 - Jest environment issues with import.meta and Firebase
**Learning:** The codebase uses Vite with `import.meta.env`, which causes Jest tests to fail unless `babel-plugin-transform-import-meta` is configured. Additionally, Firebase mocks must be centralized in `src/__mocks__/firebase.js` and mapped in `jest.config.js` to avoid evaluation errors and ensure stable testing of components relying on Firebase.
**Action:** Always check `jest.config.js` for module mapping and ensure Babel is configured to handle Vite-specific syntax when running or creating tests.
