## 2025-05-18 - Cryptographically Secure Randomness for Invitations and Passwords
**Vulnerability:** `Math.random()` (a non-cryptographic PRNG) was used to generate invitation codes in `SendInvitations.jsx` and temporary passwords in `LeaderDashboard.jsx` (CWE-330).
**Learning:** `Math.random()` PRNG state can be predicted if observed, allowing unauthorized password/invite guessing. Additionally, mapping byte values with `byte.toString(36)` introduces character modulo bias.
**Prevention:** Always use Web Crypto API (`crypto.getRandomValues()`) with a uniform lookup table (`chars[byte % chars.length]`) or base-16 hex for generating security tokens, temporary passwords, and invitation codes.
