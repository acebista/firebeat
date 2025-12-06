# ✅ Fixes Summary

## 1. "Database query timeout" & "RLS policy blocking access" (406 Error)
**Cause:** The `users` table has Row Level Security (RLS) enabled, but no policy was created to allow users to read their own (or others') profiles. This blocks the app from loading the user profile after login.

**Fix:**
Run the SQL script `fix_rls_policies.sql` in your Supabase SQL Editor.
```sql
-- This allows any logged-in user to read user profiles (needed for login & lists)
CREATE POLICY "Allow authenticated users to read all profiles" 
ON public.users FOR SELECT TO authenticated USING (true);
```

## 2. "Encountered two children with the same key"
**Cause:** The `admin` navigation list in `DashboardLayout.tsx` had the "Reports" link twice.
**Fix:** Removed the duplicate "Reports" entry.

## 3. "Salesperson" Role Showing Admin Details
**Cause:** The `navItems` configuration didn't have a specific entry for the `salesperson` role, so it might have been falling back or behaving unexpectedly. Also, the `sales` and `salesperson` roles are distinct strings in the database but should have the same UI.

**Fix:**
Updated `DashboardLayout.tsx` to explicitly define `salesperson` with the same menu items as `sales`.

```typescript
  salesperson: [
    { label: 'Dashboard', path: '/sales/dashboard', icon: LayoutDashboard },
    { label: 'Create Order', path: '/sales/create-order', icon: ShoppingBag },
    { label: 'My Orders', path: '/sales/orders', icon: FileText },
    { label: 'Performance', path: '/sales/performance', icon: Users },
  ],
```

## 🚀 Next Steps
1. **Run the SQL Script**: Go to Supabase -> SQL Editor -> Run `fix_rls_policies.sql`.
2. **Reload App**: Refresh the page. The login timeout and RLS errors should be gone.
3. **Verify Navigation**: Log in as a salesperson. You should now see the correct Sales Dashboard, not the Admin one.
