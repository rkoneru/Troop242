## 2026-03-31 - Cryptographically Secure Random Token Generation
**Vulnerability:** Weak PRNG (`Math.random()`) was used for generating temporary user passwords and invitation codes in `LeaderDashboard.jsx` and `SendInvitations.jsx`, making tokens predictable and susceptible to brute-force or enumeration attacks.
**Learning:** `Math.random()` in JS engines (V8, etc.) uses pseudo-random algorithms (e.g. xorshift128+) that are not cryptographically secure and should never be used for credentials, reset tokens, or invitation codes.
**Prevention:** Always use `crypto.getRandomValues()` (Web Crypto API) or dedicated cryptographically secure random generator helpers when generating tokens, temporary passwords, or secrets.
