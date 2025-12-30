## 2024-05-24 - [Route-based Code Splitting]
**Learning:** Static imports in the main routing file (`App.tsx`) cause all page components to be bundled together, leading to a large initial bundle size. Implementing `React.lazy` with `Suspense` effectively splits the code into smaller chunks, improving load performance.
**Action:** When working with large React applications, always check the routing configuration for code splitting opportunities. Use `React.lazy` for route components and ensure a proper `Suspense` fallback is in place.
