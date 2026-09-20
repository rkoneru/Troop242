## 2026-03-31 - Cryptographically Secure Temporary Password Generation
**Vulnerability:** Use of `Math.random()` in `generateTempPassword` inside `src/pages/LeaderDashboard.jsx` generated predictable temporary passwords when inviting users.
**Learning:** Standard JS `Math.random()` is PRNG-based and non-cryptographic, making generated strings predictable under attack.
**Prevention:** Use Web Crypto API (`window.crypto.getRandomValues`) to generate random byte arrays mapped onto character sets for cryptographically secure random strings.
