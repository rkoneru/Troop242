## 2026-05-14 - [Centralized Secure Random Generation]
**Vulnerability:** Use of insecure `Math.random()` for invitation codes and temporary passwords across multiple components (`SendInvitations.jsx`, `LeaderDashboard.jsx`).
**Learning:** Security-sensitive strings were generated in a decentralized way using predictable methods. Consolidating these into a utility that uses the Web Crypto API (`window.crypto.getRandomValues`) ensures consistency and cryptographic strength.
**Prevention:** Always use a centralized security utility for generating any form of credential or access code. Ensure the test environment (JSDOM) is polyfilled to support these APIs to maintain test coverage for security features.
