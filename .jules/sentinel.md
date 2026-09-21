## 2026-03-31 - Cryptographically Secure Invitation Codes
**Vulnerability:** `SendInvitations.jsx` generated invitation codes using `Math.random().toString(36)`, which relies on a predictable pseudo-random number generator.
**Learning:** PRNG functions like `Math.random()` can allow attackers to predict valid invitation codes and gain unauthorized access to registration workflows.
**Prevention:** Always use `crypto.getRandomValues()` (via Web Crypto API) or dedicated utility functions like `generateSecureInviteCode()` for sensitive tokens, invitation codes, and passwords.
