## 2026-03-30 - Cryptographically Secure Invitation Codes
**Vulnerability:** Use of non-cryptographic PRNG (`Math.random()`) to generate invitation codes in `src/pages/SendInvitations.jsx`.
**Learning:** `Math.random()` numbers can be predicted, allowing potential unauthorized generation or guessing of valid invitation codes.
**Prevention:** Use `crypto.getRandomValues()` to generate cryptographically random bytes when creating invitation codes or sensitive tokens in client components.
