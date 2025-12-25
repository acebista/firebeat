## 2024-05-23 - Static Import Bottleneck
**Learning:** The `App.tsx` file was using static imports for all page components, including large admin pages and specialized dashboards. This defeats the purpose of route-based code splitting and forces the user to download the entire application bundle upfront, even for pages they can't access.
**Action:** Always verify that `React.lazy` and `Suspense` are actually being used when "code splitting" is claimed. Refactor `App.tsx` to use dynamic imports for top-level route components.
