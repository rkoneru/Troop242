## 2026-03-31 - Insecure PRNG for Invitation Codes and Temporary Passwords
**Vulnerability:** `Math.random().toString(36)...` was used in `SendInvitations.jsx` and `LeaderDashboard.jsx` to generate invitation codes and temporary user passwords. `Math.random()` is not cryptographically secure and predictable by attackers.
**Learning:** Developers often use `Math.random().toString(36)` for convenience when generating short alphanumeric tokens without realizing it introduces PRNG predictability risks.
**Prevention:** Always use `crypto.getRandomValues()` (Web Crypto API) or `crypto.randomBytes()` (Node.js) for security-sensitive tokens, invitation codes, and temporary credentials.
