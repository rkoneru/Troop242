## 2026-03-08 - Cryptographically Secure Invitation Code Generation
**Vulnerability:** Insecure pseudo-random invitation code generation using `Math.random()`.
**Learning:** `Math.random()` uses a deterministic pseudo-random number generator (PRNG) that allows attackers to predict upcoming codes once sufficient samples are observed.
**Prevention:** Always use Web Crypto API (`crypto.getRandomValues`) for security-sensitive tokens, passwords, and invite codes.
