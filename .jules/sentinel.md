## 2026-05-29 - Firestore Field-Level Protection
**Vulnerability:** A privilege escalation risk was identified in `src/firebase/firestore.rules` where the `users` collection allowed authenticated users to `write` to their own document without restriction. This enabled a malicious user to escalate their own privileges by manually updating their `role` to `admin` or `leader` via the client-side Firebase SDK.

**Learning:** Combining multiple operations (create, update, delete) into a single `allow write` rule can inadvertently grant more permissions than intended, especially when certain fields must remain immutable or system-managed. Specific field-level validation is required for client-side updates.

**Prevention:** Always separate `allow create` and `allow update` for sensitive collections. Use `request.resource.data.diff(resource.data).affectedKeys()` to explicitly block modifications to sensitive fields like `role`, `status`, or `permissions` in client-side update rules.
