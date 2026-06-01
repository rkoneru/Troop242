## 2025-05-15 - Privilege Escalation in Firestore Rules
**Vulnerability:** Users could change their own `role` or `status` during a profile update because the `isValidUser` helper only checked for field presence and types, not that sensitive fields remained unchanged.
**Learning:** Firestore's `write` rule is broad; splitting it into `create` and `update` allows for more granular control, such as ensuring `resource.data.role == request.resource.data.role`.
**Prevention:** Always use `resource.data` to compare against `request.resource.data` for sensitive fields in `update` rules.
