# Sentinel's Journal

## 2026-03-05 - Cryptographically Secure Random Generation for Invitations and Temporary Passwords
**Vulnerability:** Insecure Random Number Generation. The application used `Math.random()` to generate security-sensitive tokens, specifically invitation codes in `SendInvitations.jsx` and temporary passwords in `LeaderDashboard.jsx`.
**Learning:** `Math.random()` is not cryptographically secure and uses a predictable PRNG algorithm. Attackers who observe a series of tokens could potentially predict future values, bypassing invitation requirements or administrative setup flows.
**Prevention:** Always use the Web Crypto API (`crypto.getRandomValues()`) for generating secure temporary credentials, tokens, or unique codes where randomness directly impacts security.
