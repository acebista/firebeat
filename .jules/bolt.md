## 2025-05-23 - [Lazy Loading Named Exports]
**Learning:** React.lazy expects a default export. When working with named exports (common in this codebase), we must use the pattern `React.lazy(() => import('./path').then(module => ({ default: module.NamedExport })))`.
**Action:** Always check export type before converting to lazy load. Use the helper pattern for named exports.
