## 2026-03-31 - Cryptographically Secure Invitation Code and Password Generation

**Vulnerability:** Pseudo-random number generation via `Math.random()` was used to generate invitation codes in `SendInvitations.jsx` and temporary passwords in `LeaderDashboard.jsx`. `Math.random()` outputs are deterministic and predictable, allowing attackers to predict future codes and gain unauthorized access or bypass registration controls.
**Learning:** Utilities for creating security tokens should rely on Web Crypto API (`crypto.getRandomValues`) rather than PRNG functions like `Math.random()`.
**Prevention:** Always use `crypto.getRandomValues` or existing crypto utilities (like `generateSecureInviteCode`) for token, invitation, and password generation.
