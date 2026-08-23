## 2025-05-24 - Cryptographically Secure Invitation Code Generation
**Vulnerability:** Use of `Math.random()` in `SendInvitations.jsx` to generate invitation codes created predictable invitation tokens susceptible to enumeration/guessing attacks.
**Learning:** Client-side registration flows that generate user invitation tokens or temporary credentials must use a cryptographically secure random number generator (CSPRNG) rather than standard Math.random().
**Prevention:** Use `generateSecureInviteCode` (which leverages Web Crypto API's `crypto.getRandomValues`) for all invitation and token generation.
