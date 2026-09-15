## 2025-05-18 - Cryptographically Secure Invitation Code Generation
**Vulnerability:** `SendInvitations.jsx` generated invitation codes using `Math.random()`, which produces predictable pseudo-random values susceptible to brute-force or state-reconstruction attacks.
**Learning:** Utilities for secure code generation (`generateSecureInviteCode()` using Web Crypto API `crypto.getRandomValues`) existed in `src/utils/invitations.js` but were bypassed in page components in favor of inline `Math.random()` calls.
**Prevention:** Always enforce centralized utility functions that utilize `crypto.getRandomValues()` for security-sensitive tokens, passwords, and invite codes.
