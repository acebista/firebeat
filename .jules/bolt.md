## 2024-05-23 - Code Splitting with React.lazy
**Learning:** React.lazy and Suspense significantly reduce initial bundle size by splitting the code into smaller chunks. This is especially useful for applications with role-based routing where users only access a subset of pages.
**Action:** Use React.lazy for all route components in `App.tsx` and ensure a proper Suspense fallback is in place. Group lazy imports by feature to keep the file organized.
