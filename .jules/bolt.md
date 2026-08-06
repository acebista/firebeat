## 2025-05-24 - Lazy Loading Inventory Modal Tabs
**Learning:** Large modal components with multiple tabs should lazy load their tab contents to reduce the initial bundle size of the parent component. This is especially important when the tabs contain heavy logic or many sub-components.
**Action:** When implementing tabbed interfaces, check if the tab contents are substantial enough to warrant lazy loading. If so, use `React.lazy` and `Suspense`.
