## 2026-03-30 - Cryptographically Secure Random Generation for Sensitive Tokens
**Vulnerability:** Use of `Math.random()` to generate invitation codes and temporary leader passwords made generated tokens PRNG-predictable and susceptible to brute-force or enumeration attacks.
**Learning:** `Math.random()` is not cryptographically secure in JavaScript environments.
**Prevention:** Use `crypto.getRandomValues()` (Web Crypto API) when generating security-sensitive tokens, passwords, or invitation codes in browser or Node contexts.
