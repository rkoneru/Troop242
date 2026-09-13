## 2026-03-22 - Hoist Static Motion Variants to Module Scope
**Learning:** Defining Framer Motion animation variant objects directly inside React component bodies causes unnecessary object allocations on every re-render (e.g. during state updates on form keystrokes or FAQ toggles) and breaks object reference stability for Framer Motion.
**Action:** Always hoist static Framer Motion animation variants (`containerVariants`, `itemVariants`, etc.) to module scope outside the component function.
