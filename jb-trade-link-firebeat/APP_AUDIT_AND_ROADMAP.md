# App Audit & Roadmap

**Date:** December 16, 2025
**Version:** 1.0.0
**Status:** Comprehensive Audit Completed

---

## 1. Executive Summary

The application is built on a solid foundation using **Vite + React (TypeScript)** with **Supabase** for the backend. The use of **Zustand** for state management and **Zod** for validation is excellent. The code is generally clean and well-structured.

However, as the application scales, several architectural patterns (specifically around data fetching and type safety) will become bottlenecks. The most critical technical debt is the "waterfall" data fetching pattern in dashboards and the lack of a caching layer (React Query), which will degradation performance as data volume grows.

---

## 2. Critical Fixes & Improvements (High Priority)

These items address potential bugs, data integrity issues, or significant performance bottlenecks.

- [ ] **Fix Inventory N+1 Query Issue**
    -   **Problem:** `getInventoryMovements` fetches individual orders and then filters them in JavaScript. For large datasets, this will be slow.
    -   **Solution:** Optimize Supabase queries to filter at the database level where possible, or use a dedicated `order_items` table (if not already effectively present via JSONB operators).
- [ ] **Fix Dashboard Waterfall Fetching**
    -   **Problem:** `DeliveryDashboard` and `SalesDashboard` fetch trips/orders sequentially inside loops (`await` inside `for` loops).
    -   **Solution:** Use `Promise.all` to fetch data in parallel, or better yet, refactor to single optimized SQL queries (RPC calls).
- [ ] **Standardize Types with Zod**
    -   **Problem:** `types.ts` manually defines interfaces that duplicate `utils/validation/schemas.ts`. This leads to drift where validation logic doesn't match TypeScript types.
    -   **Solution:** Derive types from Zod schemas: `export type User = z.infer<typeof userSchema> & { id: string, ... }`.
- [ ] **Align "Auth User" vs "Profile" Creation**
    -   **Problem:** Creating a user in "User Management" creates a DB row but NOT an Auth user. We fixed the "Set Password" edge function to handle this (backfill), but the creation flow ideally should be synchronous.
    -   **Solution:** Updated `UserService.add` or the Admin UI to optionally create the Auth user immediately via Edge Function.

---

## 3. Architecture Upgrades (Medium Priority)

These upgrades will significantly improve developer experience (DX) and user experience (UX).

- [ ] **Migrate to TanStack Query (React Query)**
    -   **Current:** Manual `useEffect` + `useState(loading)` + `fetch`. No caching.
    -   **Benefit:** Automatic caching, background refetching (stale-while-revalidate), built-in loading/error states, and elimination of race conditions.
    -   **Effort:** Medium (Page by page migration).
- [ ] **Implement Route Splitting (Lazy Loading)**
    -   **Current:** All pages are bundled into one large JS file (`index.js`).
    -   **Benefit:** Faster initial page load. Unused admin pages won't slow down delivery users.
    -   **Solution:** Use `React.lazy(() => import('./pages/...'))` and `<Suspense>` in `App.tsx`.
- [ ] **Global Error Boundary**
    -   **Current:** No top-level error catcher. If a component crashes, the white screen appears.
    -   **Solution:** Wrap `App` in a generic `<ErrorBoundary>` to show a nice "Something went wrong" page with a "Reload" button.

---

## 4. UI/UX Enhancements

- [ ] **Loading Skeletons**
    -   **Current:** "Loading..." text or spinners.
    -   **Improvement:** Use UI skeletons (gray placeholder shapes) that match the table/card layout for a perceived faster load.
- [ ] **Toast Notification Standardization**
    -   **Current:** Good use of `react-hot-toast`.
    -   **Improvement:** Create a wrapper utility e.g. `notify.success()` that standardizes duration and styling globally.
- [ ] **Confirm Dialogs**
    -   **Current:** `window.confirm()` (native browser alert).
    -   **Improvement:** Use a custom Modal component for confirmations (Delete, Approve) for a more professional feel.

---

## 5. Security & Robustness

- [ ] **Review RLS Policies**
    -   **Status:** Needs verification.
    -   **Action:** Ensure `public.users` cannot be written to by non-admins. Ensure `orders` can only be viewed by assigned sales/delivery persons (if strict data isolation is required).
- [ ] **Audit Logs**
    -   **Feature:** Track *who* changed *what*.
    -   **Action:** Create a `audit_logs` table (id, table_name, record_id, action, changed_by, old_data, new_data, timestamp). Log critical actions (Price changes, User deletion, Password resets).

---

## 6. Implementation Plan / To-Do List

### Phase 1: Stabilization (Day 1-2)
1.  [x] Fix Admin Password Edge Function (Completed).
2.  [ ] Refactor `DeliveryDashboard` fetching (Parallelize requests).
3.  [ ] Refactor `InventoryService` queries (Optimize loops).

### Phase 2: Modernization (Day 3-5)
4.  [ ] Install `@tanstack/react-query`.
5.  [ ] Migrate `InventoryPage` to React Query (Pilot).
6.  [ ] Migrate `Dashboard` pages to React Query.

### Phase 3: Polish (Day 6+)
7.  [ ] Implement Code Splitting (`lazy/Suspense`) in `App.tsx`.
8.  [ ] Replace `window.confirm` with `ConfirmModal`.
9.  [ ] Derive Types from Zod schemas.

---

**Recommendation:**
Start with **Phase 1 (Refactor DeliveryDashboard fetching)** as it directly impacts the performance of the most used page for delivery operations. Then move to **Inventory Service optimizations**.
