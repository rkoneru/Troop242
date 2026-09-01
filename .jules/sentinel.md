## 2026-09-01 - Cryptographically Secure Invitation Code and Temporary Password Generation
**Vulnerability:** Use of insecure `Math.random()` pseudo-random number generator to create user invitation codes and temporary leader/scout passwords in `SendInvitations.jsx` and `LeaderDashboard.jsx`.
**Learning:** `Math.random()` outputs predictable PRNG state sequences that allow attackers to calculate past and future generated tokens, opening invitation bypasses and credential prediction vectors.
**Prevention:** Always use the Web Crypto API (`window.crypto.getRandomValues`) to generate random values for security tokens, access codes, passwords, or session tokens.
