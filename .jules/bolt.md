## 2024-05-23 - [Surprising Missing Code Splitting]
**Learning:** Despite memory indicating route-based code splitting was implemented, the codebase was using static imports for all routes, bundling the entire application into a single chunk.
**Action:** Always verify "known" architectural features by inspecting the actual entry point (App.tsx or main.tsx) before assuming they exist. Use `React.lazy` with the named export pattern for existing components.
