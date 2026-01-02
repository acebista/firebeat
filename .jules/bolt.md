# BOLT'S JOURNAL

## 2025-05-23 - Frontend Architecture Pattern
**Learning:** The codebase uses named exports for page components (e.g., `export const AdminDashboard`), which requires a specific adapter pattern when using `React.lazy` since it expects default exports.
**Action:** Use `React.lazy(() => import('./path').then(module => ({ default: module.ComponentData })))` for all route splitting.
