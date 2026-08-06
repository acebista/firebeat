## 2024-05-23 - State for Derived Data
**Learning:** Storing filtered lists in `useState` and updating them via `useEffect` causes a "waterfall" of renders (Render 1: input change -> Render 2: effect runs -> Render 3: list update).
**Action:** Use `useMemo` to derive filtered lists during the render phase. This reduces the number of renders and makes the UI more responsive.
