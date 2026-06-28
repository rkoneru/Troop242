## 2025-05-15 - Privilege Escalation in Firestore Rules
**Vulnerability:** Users could self-assign any role (e.g., 'admin') by directly writing to their user document in Firestore because the rules allowed unrestricted updates to the `role` and `status` fields for the document owner.
**Learning:** The application relied on the client to send the correct role during registration and profile updates without server-side (Firestore rules) enforcement of immutability for authorization-sensitive fields.
**Prevention:** Always use granular Firestore rules that differentiate between `create` and `update` operations, explicitly restricting roles and statuses. Use `request.resource.data.field == resource.data.field` to ensure fields remain immutable during updates.
