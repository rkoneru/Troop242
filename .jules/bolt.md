## 2026-03-21 - Hoist Framer Motion Animation Variants & Use Stable Keys
**Learning:** Re-allocating static Framer Motion variant objects inside component render functions creates new object references on every render, triggering unnecessary reconciliation in motion components.
**Action:** Always hoist static animation variants (`containerVariants`, `itemVariants`) to module scope and map lists with stable unique primitive keys (e.g., `rank.name`) instead of array indices.
