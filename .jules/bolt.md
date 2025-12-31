## 2024-05-22 - [Route-based Code Splitting]
**Learning:** The application was loading all 20+ page components upfront, including heavy admin dashboards and charts, even for a simple login page. This drastically increases Time-to-Interactive (TTI).
**Action:** Implemented `React.lazy` and `Suspense` for all top-level route components. Using `SuspenseLoader` (or existing `LoadingOverlay`) as fallback ensures a smooth transition. This moves the cost of loading these pages to when they are actually requested.
