# Auth System Quick Reference

**TL;DR**: Use these imports and patterns for auth in your code.

---

## Quick Imports

```typescript
// Check roles & permissions
import { 
  isAdmin, 
  canAccess, 
  canEditOrder, 
  requireRole 
} from '@/services/auth';

// Optimized hooks (prevent rerenders)
import { 
  useCurrentUser, 
  useIsAdmin, 
  useCanAccessAdmin 
} from '@/services/auth';

// Protected routes
import { ProtectedRouteV2, withAuth } from '@/components/auth/ProtectedRouteV2';
```

---

## Common Patterns

### 1️⃣ Show Content If Admin

```tsx
import { useIsAdmin } from '@/services/auth';

function AdminButton() {
  const isAdmin = useIsAdmin();
  return isAdmin ? <button>Manage Users</button> : null;
}
```

### 2️⃣ Check Specific Permission

```tsx
import { canAccess, useCurrentUser } from '@/services/auth';

function OrderForm() {
  const user = useCurrentUser();
  if (!canAccess(user, 'orders.create')) {
    return <p>You cannot create orders</p>;
  }
  return <form>{...}</form>;
}
```

### 3️⃣ Redirect By Role

```tsx
import { useNavigate } from 'react-router-dom';
import { useUserRole } from '@/services/auth';

useEffect(() => {
  const role = useUserRole();
  navigate(role === 'admin' ? '/admin/dashboard' : '/dashboard');
}, [navigate, useUserRole()]);
```

### 4️⃣ Protect a Route

```tsx
import { ProtectedRouteV2 } from '@/components/auth/ProtectedRouteV2';

<Route element={<ProtectedRouteV2 allowedRoles={['admin']} />}>
  <Route path="/admin/users" element={<Users />} />
</Route>
```

### 5️⃣ Protect a Page Component

```tsx
import { withAuth } from '@/components/auth/ProtectedRouteV2';

const AdminUsers = () => <div>...</div>;
export default withAuth(AdminUsers, ['admin']);
```

### 6️⃣ API Route Protection

```typescript
import { guardRoute } from '@/services/auth';

export async function POST(req: Request) {
  const user = req.user; // from middleware
  guardRoute(user, 'admin'); // Throws 403 if not admin
  
  // Safe - user is verified as admin
  return { success: true };
}
```

---

## All Roles

| Role | Can Do |
|------|--------|
| **admin** | Manage users, products, orders, trips, reports, system |
| **sales** | Create orders, view own orders, view customers |
| **delivery** | View assigned orders, update status, print challan |
| **finance** | View orders, reports, invoices, payments |

---

## All Permissions

```
users.manage              → Admin only
products.manage           → Admin only
companies.manage          → Admin only
orders.manage             → Admin only
orders.approve            → Admin only
orders.cancel             → Admin only
orders.create             → Sales + Admin
orders.edit_own           → Sales (own only)
orders.view_own           → Sales (own only)
orders.view_assigned      → Delivery (assigned only)
orders.update_status      → Delivery
orders.view               → Finance + Admin
trips.manage              → Admin only
trips.view_assigned       → Delivery
reports.view              → Finance + Admin
reports.view_own          → Sales (own only)
invoices.view             → Finance
payments.view             → Finance
customers.view            → Sales
challan.print             → Delivery
gps.track                 → Delivery
system.health             → Admin only
settings.manage           → Admin only
migration.run             → Admin only
```

---

## Store State

```typescript
// What's in the store
{
  user: {
    id: string
    email: string
    name: string
    role: 'admin' | 'sales' | 'delivery' | 'finance'
    company_id: string
    is_active: boolean
  } | null
  
  bootStatus: 'idle' | 'checking' | 'ready'
  session: any | null  // Don't use directly
  error: string | null
  bootError: string | null
}
```

---

## Selectors (Prevent Rerenders)

```typescript
// ✅ Good - only rerenders when field changes
const user = useUserStore(selectUser);
const isAdmin = useUserStore(selectIsAdmin);

// ✅ Better - use convenience hooks
const user = useCurrentUser();
const isAdmin = useIsAdmin();

// ❌ Bad - rerenders when ANY field changes
const state = useUserStore();
const { user, bootStatus } = state;
```

---

## Boot Sequence

When app loads:

```
1. AuthProvider mounts
2. Call store.rehydrateFromSession()
3. Check supabase.auth.getSession()
4. Load user profile from database
5. Set bootStatus = 'ready'
6. Show protected routes
```

---

## Error Recovery

```typescript
// User sees this if boot fails:
// "Session Verification Failed"
// [Try Again] [Go to Login]

// On retry:
await useUserStore.getState().retryBoot();

// On logout:
await useUserStore.getState().logout();
```

---

## Files to Know

| File | Purpose |
|------|---------|
| [services/auth/userStore.ts](services/auth/userStore.ts) | Main auth state (Zustand) |
| [services/auth/AuthProvider.tsx](services/auth/AuthProvider.tsx) | React Context sync |
| [services/auth/authHelpers.ts](services/auth/authHelpers.ts) | RBAC functions |
| [services/auth/authSelectors.ts](services/auth/authSelectors.ts) | Optimized selectors |
| [pages/Login.tsx](pages/Login.tsx) | Login page |
| [App.tsx](App.tsx) | Route definitions |

---

## Docs to Read

1. **Quick Start**: This file (you're reading it!)
2. **Deep Dive**: [AUTH_ARCHITECTURE.md](AUTH_ARCHITECTURE.md)
3. **Audit Report**: [AUTH_SECURITY_AUDIT.md](AUTH_SECURITY_AUDIT.md)
4. **Summary**: [AUTH_REFACTORING_SUMMARY.md](AUTH_REFACTORING_SUMMARY.md)

---

## Examples

### Show admin panel
```tsx
import { useIsAdmin } from '@/services/auth';

<div>{useIsAdmin() && <AdminPanel />}</div>
```

### Show different dashboard by role
```tsx
import { useUserRole } from '@/services/auth';

const role = useUserRole();
const Dashboard = role === 'admin' ? AdminDash : SalesDash;
return <Dashboard />;
```

### Can user edit this order?
```tsx
import { canEditOrder, useCurrentUser } from '@/services/auth';

const user = useCurrentUser();
const canEdit = canEditOrder(user, order.created_by);
return canEdit ? <EditButton /> : null;
```

### Protected admin route
```tsx
import { ProtectedRouteV2 } from '@/components/auth/ProtectedRouteV2';

<Route element={<ProtectedRouteV2 allowedRoles={['admin']} />}>
  <Route path="/admin/migration" element={<Migration />} />
</Route>
```

---

## FAQ

**Q: How do I check if user is logged in?**
```tsx
const user = useCurrentUser();
return user ? <LoggedInUI /> : <NotLoggedInUI />;
```

**Q: How do I add a new role?**
```typescript
// 1. Update UserRole type in types.ts
// 2. Add config to ROLE_CONFIG in authHelpers.ts
// 3. Add permissions
// 4. Update database RLS policies
// 5. Add routes to App.tsx
```

**Q: How do I add a new permission?**
```typescript
// 1. Update ROLE_CONFIG[role].permissions in authHelpers.ts
// 2. Check with canAccess(user, 'new.permission')
// 3. Write test
```

**Q: Why is my component rerendering too much?**
```typescript
// ❌ Wrong - use whole store
const { user } = useUserStore();

// ✅ Right - use selector
const user = useUserStore(selectUser);
// or
const user = useCurrentUser();
```

**Q: What happens after 3 hours?**
Automatic logout. User is redirected to login with message.

**Q: Can I see the signup button?**
Only in DEV mode with `VITE_ENABLE_DEV_REGISTRATION=true`.
In production: not visible.

---

## Need Help?

- 📖 Read [AUTH_ARCHITECTURE.md](AUTH_ARCHITECTURE.md) for patterns
- 🧪 Check tests in [__tests__/auth/auth.test.ts](__tests__/auth/auth.test.ts)
- 🔍 See [AUTH_SECURITY_AUDIT.md](AUTH_SECURITY_AUDIT.md) for design decisions

