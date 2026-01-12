## 2024-05-23 - [Route Code Splitting]
**Learning:** `React.lazy` only supports default exports. When lazy loading named exports from legacy codebases, you must use the promise chain pattern: `import('./module').then(m => ({ default: m.NamedExport }))`.
**Action:** Apply this pattern when refactoring existing named-export components for code splitting without rewriting the component file itself.
