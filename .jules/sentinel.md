## 2026-05-19 - Firestore Privilege Escalation Protection
**Vulnerability:** A generic `allow write` rule on the `users` collection allowed authenticated users to set or modify their own `role` and `status` fields, enabling self-promotion to `admin` or `leader`.
**Learning:** Generic `write` rules in Firestore are dangerous for documents containing authorization metadata. Split `write` into `create` and `update` to enforce initial defaults and subsequent immutability for sensitive fields.
**Prevention:** Always use `request.resource.data.field == resource.data.field` to make fields immutable for the owner, and strictly define allowed values for sensitive fields in `create` rules.
