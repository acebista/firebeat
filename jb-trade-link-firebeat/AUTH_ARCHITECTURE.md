# Authentication Architecture Guide

**Version**: 2.0  
**Last Updated**: December 16, 2025  
**Status**: Production Ready

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Core Components](#core-components)
3. [Usage Patterns](#usage-patterns)
4. [Role-Based Access Control](#role-based-access-control)
5. [State Management](#state-management)
6. [Protected Routes](#protected-routes)
7. [Error Handling](#error-handling)
8. [Testing](#testing)
9. [Security Checklist](#security-checklist)

---

## Architecture Overview

The authentication system is built on three core pillars:

```
┌─────────────────────────────────────────────────────────┐
│                    LOGIN / SIGNUP                         │
│              (pages/Login.tsx)                            │
└────────────────────┬────────────────────────────────────┘
                     │ email + password
                     ▼
┌─────────────────────────────────────────────────────────┐
│                  SUPABASE AUTH                            │
│            (lib/supabase.ts)                             │
│         ✓ JWT token management                           │
│         ✓ Session handling                               │
│         ✓ User verification                              │
└────────────────────┬────────────────────────────────────┘
                     │ { session, user }
                     ▼
┌─────────────────────────────────────────────────────────┐
│                  ZUSTAND STORE                            │
│         (services/auth/userStore.ts)                    │
│         ✓ Single source of truth                         │
│         ✓ Persistent user state                          │
│         ✓ Boot sequence management                       │
└────────────────────┬────────────────────────────────────┘
                     │ state: User + bootStatus
                     ▼
┌─────────────────────────────────────────────────────────┐
│                REACT CONTEXT                              │
│          (services/auth/AuthProvider.tsx)               │
│         ✓ useAuth() hook                                 │
│         ✓ Inactivity timeout (3 hours)                  │
│         ✓ Error broadcasting                             │
└────────────────────┬────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
        ▼                         ▼
┌──────────────────┐    ┌──────────────────┐
│ PROTECTED ROUTE  │    │  RBAC HELPERS    │
│  (App.tsx)       │    │ (authHelpers.ts) │
│ ✓ Role gating   │    │ ✓ canAccess()    │
│ ✓ Redirects     │    │ ✓ requireRole()  │
└──────────────────┘    └──────────────────┘
```

---

## Core Components

### 1. Zustand Store (`services/auth/userStore.ts`)

**Single Source of Truth** for all auth state.

```typescript
// State shape
{
  bootStatus: 'idle' | 'checking' | 'ready' | 'error'
  user: User | null                    // Persisted
  session: any | null                  // NOT persisted (security)
  error: string | null
  bootError: string | null
}

// Actions
rehydrateFromSession()       // Load session from Supabase
setAuthenticated(user, session)
setUnauthenticated()
logout()
setError(error)
retryBoot()
```

**Persistence**: Uses `persist` middleware to save only safe fields:
```typescript
partialize: (state) => ({
  user: state.user ? {
    id, email, name, role, company_id,
    // NOT saving: session, tokens, passwords
  } : null
})
```

### 2. React Context (`services/auth/AuthProvider.tsx`)

**Sync layer** between Zustand store and React components.

```typescript
// Provides
useAuth() => {
  state: AuthState
  login(email, password)
  logout()
  isAuthenticated: boolean
  isLoading: boolean
  isInitialized: boolean
}

// Boot Sequence
1. Calls store.rehydrateFromSession()
2. Waits for bootStatus === 'ready'
3. Dispatches auth state to context
4. Handles inactivity timeout (3 hours)
```

### 3. Selectors (`services/auth/authSelectors.ts`)

**Optimized store access** to prevent unnecessary rerenders.

```typescript
// Instead of:
const { user, bootStatus, error } = useUserStore();
// ^ Rerenders when ANY field changes

// Use:
const user = useUserStore(selectUser);           // Only when user changes
const bootStatus = useUserStore(selectBootStatus);
const isAdmin = useUserStore(selectIsAdmin);

// Or use convenience hooks:
const user = useCurrentUser();
const isAdmin = useIsAdmin();
```

### 4. RBAC Helpers (`services/auth/authHelpers.ts`)

**Centralized permission logic** - single source of truth for authorization.

```typescript
// Role checks
hasRole(user, 'admin')              // Is admin?
hasAnyRole(user, ['admin', 'sales']) // One of?
isAdmin(user)                        // Shorthand
isSalesperson(user)
isDeliveryAgent(user)

// Resource access
canAccess(user, 'users.manage')     // Has permission?
canAccessAdminSection(user, 'orders')
canEditOrder(user, orderCreatedBy)
canViewOrder(user, orderCreatedBy, assignedDeliveryId)

// For API/server routes
requireRole(user, 'admin', 'create user')      // Throws if not
requireAnyRole(user, ['admin', 'finance'])     // Throws if not
guardRoute(user, 'admin')                      // Returns user or throws
```

---

## Usage Patterns

### Pattern 1: Check User in Component

```tsx
import { useCurrentUser, useIsAdmin } from '@/services/auth';

function MyComponent() {
  const user = useCurrentUser();
  const isAdmin = useIsAdmin();

  if (!user) return <div>Not logged in</div>;
  
  return (
    <div>
      {isAdmin && <AdminButton />}
      <p>Hello, {user.name}</p>
    </div>
  );
}
```

### Pattern 2: Check Permission

```tsx
import { canAccess } from '@/services/auth';
import { useCurrentUser } from '@/services/auth';

function OrderForm() {
  const user = useCurrentUser();

  if (!canAccess(user, 'orders.create')) {
    return <p>You don't have permission to create orders</p>;
  }

  return <form>{/* form content */}</form>;
}
```

### Pattern 3: Conditional Navigation

```tsx
import { useNavigate } from 'react-router-dom';
import { useIsAdmin } from '@/services/auth';

function Dashboard() {
  const navigate = useNavigate();
  const isAdmin = useIsAdmin();

  useEffect(() => {
    if (isAdmin) {
      navigate('/admin/dashboard');
    } else {
      navigate('/sales/dashboard');
    }
  }, [isAdmin, navigate]);

  return null;
}
```

### Pattern 4: Protected Routes (App.tsx)

```tsx
import { ProtectedRouteV2 } from '@/components/auth/ProtectedRouteV2';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      {/* Admin only */}
      <Route element={<ProtectedRouteV2 allowedRoles={['admin']} />}>
        <Route path="/admin/users" element={<UserManagement />} />
        <Route path="/admin/orders" element={<OrderManagement />} />
      </Route>

      {/* Sales + Admin */}
      <Route element={<ProtectedRouteV2 allowedRoles={['admin', 'sales']} />}>
        <Route path="/orders/create" element={<CreateOrder />} />
      </Route>
    </Routes>
  );
}
```

### Pattern 5: API Route Protection

```typescript
// api/users/create.ts
import { guardRoute } from '@/services/auth';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  const user = req.user; // Middleware sets this
  
  // Throws 403 if not admin
  guardRoute(user, 'admin');
  
  // Safe - user is admin
  const { email, role } = await req.json();
  // ... create user
}
```

---

## Role-Based Access Control

### Role Hierarchy

| Role | Display Name | Key Permissions |
|------|---|---|
| **admin** | Administrator | users.manage, products.manage, orders.manage, orders.approve, system.health, migration.run |
| **sales** | Salesperson | orders.create, orders.edit_own, orders.view_own, reports.view_own, customers.view |
| **delivery** | Delivery Agent | orders.view_assigned, orders.update_status, trips.view_assigned, challan.print, gps.track |
| **finance** | Finance | orders.view, reports.view, invoices.view, payments.view |

### Permission Matrix

```typescript
// For each role, see ROLE_CONFIG in authHelpers.ts
ROLE_CONFIG = {
  admin: {
    permissions: [
      'users.manage',
      'products.manage',
      'companies.manage',
      'orders.manage',
      'orders.approve',
      'orders.cancel',
      // ... see authHelpers.ts for full list
    ]
  },
  sales: { /* ... */ },
  delivery: { /* ... */ },
  finance: { /* ... */ },
};
```

### Adding New Permissions

1. **Define the permission** in `ROLE_CONFIG` (authHelpers.ts):

```typescript
ROLE_CONFIG.admin.permissions.push('invoices.export');
```

2. **Check permission** in component:

```typescript
if (canAccess(user, 'invoices.export')) {
  return <ExportButton />;
}
```

3. **Test the permission**:

```typescript
it('admin should have invoices.export', () => {
  expect(canAccess(adminUser, 'invoices.export')).toBe(true);
});
```

---

## State Management

### Boot Sequence (on app load)

```
1. AuthProvider mounts
   ↓
2. useUserStore.rehydrateFromSession() starts
   - Loads persisted user from localStorage
   - Calls supabase.auth.getSession()
   - If session exists, loads user profile
   - If session invalid, clears state
   ↓
3. bootStatus: 'checking' → 'ready' 
   ↓
4. Auth state synced to Context
   ↓
5. Protected routes can now render
```

### What Gets Persisted?

```typescript
// ✅ PERSISTED (safe data only)
user: {
  id,
  email,
  name,
  role,
  company_id,
}

// ❌ NOT PERSISTED (security)
session          // JWT tokens
access_token     // Tokens in storage = risk
refresh_token    // Only in memory
error            // Temporary state
bootError        // Temporary state
```

### Session Invalidation

```typescript
// Automatic invalidation
1. Page refresh → Boot sequence verifies session
2. 401 response → No automatic refresh (needs implementation)
3. 3 hours inactivity → Logout automatically
4. User calls logout() → Supabase signOut() + state cleared
```

---

## Protected Routes

### Using ProtectedRouteV2 (Recommended)

```tsx
<Route element={<ProtectedRouteV2 allowedRoles={['admin']} />}>
  <Route path="/admin/users" element={<UserManagement />} />
</Route>
```

**Features**:
- ✅ Waits for boot to complete before redirecting
- ✅ Shows loading overlay while checking
- ✅ Shows error with retry on boot failure
- ✅ Prevents "flash" of unauthorized content
- ✅ Uses optimized selectors (no unnecessary rerenders)

### Using withAuth HOC

```tsx
const ProtectedUsersPage = withAuth(UserManagement, ['admin']);

// In routes
<Route path="/admin/users" element={<ProtectedUsersPage />} />
```

### Redirect Behavior

```typescript
const dashboardPaths = {
  admin: '/admin/dashboard',
  sales: '/sales/dashboard',
  delivery: '/delivery/dashboard',
  finance: '/finance/dashboard',
};

// If user tries to access /admin/users but is sales:
<ProtectedRoute allowedRoles={['admin']} 
  fallbackPath="/sales/dashboard" />
// → Redirects to /sales/dashboard (or their dashboard)
```

---

## Error Handling

### Boot Errors

```typescript
// If session check fails:
1. bootError = "Profile fetch failed: ..."
2. Show error UI with retry button
3. User can click "Try Again" → retryBoot()
4. Or click "Go to Login" → redirect to login
```

### Login Errors

```typescript
// AuthProvider.login() handles:
try {
  const { data, error } = await supabase.auth.signInWithPassword(...)
  if (error) throw error;  // Caught and set in context
} catch (error) {
  // Error displayed to user in Login component
  // User can retry
}
```

### 401 Errors (Token Expired)

**Not yet implemented** - see [TODO](#todo).

Current behavior: User sees "Unauthorized" error, must refresh and login again.

Recommended fix:
```typescript
// Intercept 401 responses and call refreshSession()
if (response.status === 401) {
  await refreshSession();
  // Retry request
}
```

---

## Testing

### Run Tests

```bash
npm test -- __tests__/auth
```

### Test Coverage

- ✅ Store initialization
- ✅ Authentication (setAuthenticated, logout)
- ✅ Role checks (hasRole, isAdmin, etc.)
- ✅ Permissions (canAccess, canEditOrder)
- ✅ Selectors (selectUser, selectIsAdmin)
- ✅ Error handling

### Add New Tests

```typescript
// __tests__/auth/auth.test.ts
it('should allow admin to manage users', () => {
  expect(canAccess(adminUser, 'users.manage')).toBe(true);
});

it('should prevent sales from managing users', () => {
  expect(canAccess(salesUser, 'users.manage')).toBe(false);
});
```

---

## Security Checklist

- [x] **Env vars required**: Removed hardcoded Supabase keys (commit 75cfa08)
- [x] **Session token NOT persisted**: Only user data stored
- [x] **JWT verification**: Supabase handles on server
- [x] **CORS configured**: User must set on Supabase dashboard
- [x] **RLS policies enabled**: Database verified
- [x] **Admin routes protected**: Client-side with ProtectedRouteV2
- [x] **Signup hidden in prod**: Button only in DEV mode
- [x] **Role validation**: Centralized in authHelpers
- [x] **Inactivity logout**: 3-hour timeout implemented
- [x] **Boot sequence**: Waits for session verification before allowing navigation
- [ ] **Token refresh on 401**: Not yet implemented (see TODO)
- [ ] **CSRF protection**: Handled by Supabase (forms should use CSRF tokens)

---

## Common Patterns & Examples

### Render Admin Menu

```tsx
import { useIsAdmin } from '@/services/auth';

function Navigation() {
  const isAdmin = useIsAdmin();

  return (
    <nav>
      <Link to="/">Home</Link>
      {isAdmin && <Link to="/admin">Admin Panel</Link>}
    </nav>
  );
}
```

### Show Different UI by Role

```tsx
import { useUserRole } from '@/services/auth';

function Dashboard() {
  const role = useUserRole();

  switch (role) {
    case 'admin':
      return <AdminDashboard />;
    case 'sales':
      return <SalesDashboard />;
    case 'delivery':
      return <DeliveryDashboard />;
    default:
      return <DefaultDashboard />;
  }
}
```

### Check Multiple Permissions

```tsx
import { canAccess, useCurrentUser } from '@/services/auth';

function OrderActions() {
  const user = useCurrentUser();
  const canCreate = canAccess(user, 'orders.create');
  const canApprove = canAccess(user, 'orders.approve');

  return (
    <div>
      {canCreate && <button>Create Order</button>}
      {canApprove && <button>Approve Order</button>}
      {!canCreate && !canApprove && <p>No permissions</p>}
    </div>
  );
}
```

---

## TODO / Known Issues

1. **Token Refresh on 401**: Need to implement automatic token refresh when API returns 401
2. **Better Error Messages**: Show user-friendly error messages in Login page
3. **Session Timeout**: Add countdown timer before logout
4. **Multi-Tab Sync**: Sync logout across browser tabs
5. **Password Reset Flow**: Email verification for password reset

---

## File Structure

```
services/auth/
├── userStore.ts              # Zustand store (STATE)
├── AuthProvider.tsx          # Context provider (SYNC)
├── authHelpers.ts            # RBAC utilities (LOGIC) ← NEW
├── authSelectors.ts          # Store selectors (OPTIMIZE) ← NEW
├── useAuth.ts                # Custom hooks
├── authTypes.ts              # TypeScript types
├── authService.ts            # Supabase auth functions
├── authUtils.ts              # Utility functions
├── profileService.ts         # Load user profile
├── index.ts                  # Exports
└── ...

components/auth/
├── ProtectedRouteV2.tsx      # Enhanced protected route (NEW)
├── LoadingOverlay.tsx
├── ErrorBanner.tsx
└── ...

__tests__/auth/
└── auth.test.ts              # Unit tests (NEW)
```

---

## Migration Guide (from old to new)

### Old Pattern (❌ Don't use)

```tsx
const { user, bootStatus, error } = useUserStore();
// ^ Rerenders on any change
```

### New Pattern (✅ Use)

```tsx
const user = useCurrentUser();  // Only rerender when user changes
const bootStatus = useBootStatus();
const error = useAuthError();
```

### Old Role Check (❌ Don't use)

```tsx
{user?.role === 'admin' && <AdminButton />}
```

### New Role Check (✅ Use)

```tsx
const isAdmin = useIsAdmin();
{isAdmin && <AdminButton />}

// Or use helpers:
{canAccess(user, 'users.manage') && <ManageButton />}
```

---

## Questions?

See [AUTH_SECURITY_AUDIT.md](./AUTH_SECURITY_AUDIT.md) for detailed analysis of the current auth system and issues found.

