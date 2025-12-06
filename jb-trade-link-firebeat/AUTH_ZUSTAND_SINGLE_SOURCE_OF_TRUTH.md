# Auth Refactor - Complete Implementation & Debugging Guide

## Overview
This document covers the complete refactor of the auth system to use Zustand as the single source of truth, with proper session persistence and debugging capabilities.

## Architecture

### Single Source of Truth: Zustand Store
**File**: `services/auth/userStore.ts`

The store now manages:
- `bootStatus`: Lifecycle state (idle → checking → ready → error)
- `user`: Current user profile
- `session`: Active Supabase session (NOT persisted)
- `bootError`: Detailed error messages for debugging
- `rehydrateFromSession()`: Only entry point for boot/login

**Key Design Decisions**:
- Session is NEVER persisted (short-lived, server-managed)
- Only minimal user snapshot is persisted (id, email, name, role, isActive)
- Boot status tracks the full lifecycle with detailed error messages
- All debug logs use `[Boot]`, `[Auth]`, `[Storage]`, `[Tokens]` prefixes

### Auth Context Provider
**File**: `services/auth/AuthProvider.tsx`

Exists for backward compatibility. It:
1. Calls `useUserStore.getState().rehydrateFromSession()` on mount
2. Subscribes to store changes and syncs to context
3. Maintains 3-hour inactivity timeout
4. Provides login/logout/refreshSession functions

### Protected Routes
**File**: `App.tsx`

The `ProtectedRoute` component now:
1. Reads from store directly (`useUserStore()`)
2. Shows `LoadingOverlay` while `bootStatus === 'checking'`
3. Shows error with **Retry** button if boot fails
4. Only redirects to login when `bootStatus === 'ready'` and no user

## Debug Logging

All auth operations are logged with prefixes for easy filtering:

```typescript
// Boot flow
[Boot] Starting session rehydration...
[Boot] Session check: Found/None
[Boot] Valid session found, loading profile for user: {userId}
[Boot] Profile loaded successfully

// Errors
[Boot] getSession error: {...}
[Boot] Profile fetch failed: {...}
[Boot] This may indicate:
  - RLS policies blocking the query
  - User row missing in users table
  - JWT/auth issue
  - Network error

// Storage
[Storage] getItem: auth-user-storage ✓ found/✗ empty
[Storage] setItem: auth-user-storage ✓ saved
[Tokens] Cleared stale Supabase auth tokens...
[Tokens] Removed sb-PROJECTID-auth-token
```

## Testing Hard Refresh Behavior

### Expected Behavior
1. **User logged in, hard refresh**:
   - Boot checks session: ✓ Valid session
   - Profile loads: ✓ User restored
   - UI shows dashboard
   - No redirect to login

2. **User logged out, hard refresh**:
   - Boot checks session: ✗ No session
   - Stale tokens cleared
   - UI shows login
   - No perpetual loader

3. **Session invalid, hard refresh**:
   - Boot checks session: ✓ Session exists (but JWT expired)
   - Profile fetch fails: ✗ 401/403
   - Boot marks ready, user logs out
   - UI shows login with error + retry button

### How to Test

**DevTools Setup**:
```javascript
// In Console
// 1. Check session
await supabase.auth.getSession()
// Output: { data: { session: {...} | null }, error: null }

// 2. Check localStorage
localStorage.getItem('auth-user-storage')
// Output: {"user":{"id":"...","email":"...","name":"...","role":"..."}}

// 3. Check Supabase tokens
Object.keys(localStorage).filter(k => k.includes('sb-'))
// Output: ["sb-PROJECTID-auth-token", "sb-PROJECTID-auth-session"]
```

**Network Tab**:
1. Filter by `supabase` or `api`
2. Look for these calls in order:
   - `/auth/v1/session` - GET (check if session valid)
   - `/rest/v1/users?id=eq...` or profile query - GET (load user data)
3. Check response status:
   - 200 OK = Success
   - 401 Unauthorized = JWT expired/invalid
   - 403 Forbidden = RLS policy blocking
   - 5xx = Server error

**Console Logs**:
```
// Filter by prefix
console.log() calls with [Boot], [Auth], [Storage], [Tokens]

// Search for errors
[Boot] getSession error: ...
[Boot] Profile fetch failed: ...
[Storage] Failed to read...
```

## Validation Schema Updates

**File**: `utils/validation/schemas.ts`

Product schema now validates ALL fields including:
- `discountedRate` ✓ (was missing)
- `secondaryAvailable` ✓ (was missing)
- `currentStock` ✓ (was missing)
- All numeric fields with defaults

This prevents `undefined` or `NaN` from reaching Supabase.

## Product ID Generation

**File**: `services/db.ts`

`ProductService.add()` now:
1. Generates ID if missing: `prod_{first-8-chars-of-uuid}`
2. Uses INSERT instead of UPSERT (prevents race conditions)
3. Returns complete product with generated ID

Example:
```typescript
// Input: { name: "Widget", companyId: "...", ... }
// Generated ID: "prod_a1b2c3d4"
// Output: { id: "prod_a1b2c3d4", name: "Widget", ... }
```

## Common Issues & Solutions

### Issue: Hard Refresh Shows Login Instead of Dashboard

**Cause**: Session is valid but boot marked as ready without user

**Debug**:
```javascript
// Check if session exists
const session = await supabase.auth.getSession();
console.log('Session:', session.data.session ? 'Valid' : 'None');

// Check localStorage
const stored = localStorage.getItem('auth-user-storage');
console.log('Stored user:', stored);

// Check store state
useUserStore.getState()
// Should show: { bootStatus: 'ready', user: {...} }
```

**Fix**: Check browser console for `[Boot] Profile fetch failed` messages

### Issue: Perpetual Loading on Hard Refresh

**Cause**: `bootStatus` is still 'checking'

**Debug**:
```javascript
// Should never be stuck in 'checking'
setInterval(() => {
  console.log('Boot status:', useUserStore.getState().bootStatus);
}, 1000);
```

**Fix**: Look for `[Boot] Profile fetch failed` - likely a RLS or network issue

### Issue: Session Exists but Profile Fetch Fails (401/403)

**Cause**: RLS policies not allowing authenticated user to read their own row

**Debug**:
```sql
-- In Supabase SQL Editor
-- Check RLS policies on users table
SELECT * FROM auth.users WHERE id = 'the-user-id';

-- Verify this user's profile exists
SELECT * FROM users WHERE id = 'the-user-id';
```

**Fix**: 
1. Enable public profile select (row should exist)
2. Verify JWT audience matches project URL
3. Check if using service role vs authenticated role

### Issue: Products Not Saving

**Cause**: Missing required fields in validation schema

**Debug**:
```javascript
// Check validation errors
useProductStore.getState().validationErrors
// Should be empty if all fields present

// Check form data conversion
Number(formData.discountedRate) // Must be number, not string
```

**Fix**: Ensure all numeric fields are converted to Number type before validation

## Performance Optimization

**Current Bundle Size**: ~1.65 MB (gzipped: ~469 KB)

**Recommendations**:
1. Code-split pages dynamically:
```typescript
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
```

2. Use Vite's chunk splitting:
```javascript
// vite.config.ts
manualChunks: {
  'admin': ['./pages/admin/**'],
  'sales': ['./pages/sales/**'],
}
```

## Monitoring & Observability

**Add to your monitoring setup**:
```typescript
// Log auth events
useUserStore.subscribe(
  state => state.bootStatus,
  (bootStatus) => {
    if (bootStatus === 'error') {
      console.error('Boot failed:', useUserStore.getState().bootError);
      // Send to error tracking service
    }
  }
);
```

## Next Steps

1. **Test all three hard refresh scenarios** (logged in, logged out, session invalid)
2. **Verify RLS policies** allow profile queries for authenticated users
3. **Add retry tracking** to understand profile fetch failure patterns
4. **Monitor bundle size** and implement code-splitting if > 500KB chunks needed
5. **Set up error monitoring** to track real user auth failures
