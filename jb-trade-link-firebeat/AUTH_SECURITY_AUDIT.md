# Auth Security Audit Report

**Date**: December 16, 2025  
**Status**: In Progress  
**Severity**: Medium  

## Executive Summary

The application has a basic multi-role authentication system (admin, sales, delivery) using Zustand for state management and Supabase for auth/database. While functional, the following security and architectural issues were identified:

### Critical Issues
1. **Hardcoded fallback Supabase keys removed** ✅ (fixed in commit 75cfa08)
2. **Signup button visible in production** ⚠️ (UI only, feature gated)
3. **Session persistence issues on Vercel** ✅ (fixed in commit 75cfa08)

### Medium Issues
1. No explicit role/permission helper utilities
2. Admin page protection relies on UI layer only (no server-side middleware)
3. Store selectors could be optimized to prevent unnecessary rerenders
4. Limited error recovery for token refresh failures

### Low Issues
1. Auth error handling could be more granular
2. Type definitions could be more strict (Session is `any`)
3. No comprehensive auth tests
4. Documentation sparse

---

## Current Architecture

### 1. State Management: Zustand (`services/auth/userStore.ts`)

**Purpose**: Single source of truth for auth state

**Current State Shape**:
```typescript
{
  bootStatus: 'idle' | 'checking' | 'ready' | 'error'
  user: User | null
  session: any | null          // ⚠️ Should be typed as Session
  error: string | null
  bootError: string | null
}
```

**Stored Actions**:
- `rehydrateFromSession()`: Loads session from Supabase, fetches user profile
- `setAuthenticated(user, session)`: Sets authenticated state
- `setUnauthenticated()`: Clears auth state
- `setError(error)`: Sets error message
- `retryBoot()`: Retries session rehydration
- `logout()`: Signs out and clears state

**Persistence**: Uses `persist` middleware with `partialize` to store only safe fields:
- ✅ `user.id, user.email, user.name, user.role, user.company_id`
- ❌ Does NOT store `session` (good practice)

**Issue**: The store is not exported with typed selectors, so consuming components access all fields and rerender on any change.

---

### 2. Context Provider (`services/auth/AuthProvider.tsx`)

**Purpose**: Sync Zustand state with React Context for useAuth hook

**State Structure**:
```typescript
{
  status: 'IDLE' | 'LOADING' | 'AUTHENTICATED' | 'UNAUTHENTICATED' | 'ERROR'
  user?: User
  session?: Session
  error?: AuthError
}
```

**Actions**:
- `login(email, password)`: Authenticates with Supabase
- `logout()`: Clears state and signs out
- `refreshSession()`: Refreshes JWT (stub implementation)
- `isAuthenticated`, `isLoading`, `isInitialized`: Convenience flags

**Issue**: Context rerenders entire subtree on any state change; should use `useMemo`.

---

### 3. Protected Routes (`App.tsx`)

**Current Implementation**:
```typescript
<ProtectedRoute allowedRoles={['admin']} />
  <Route path="/admin/migration" element={<Migration />} />
</ProtectedRoute>
```

**Logic**:
1. If `bootStatus === 'checking'`: Show loading overlay
2. If boot error + no user: Show error with retry
3. If no user: Redirect to `/login`
4. If user role not in `allowedRoles`: Redirect to dashboard
5. Otherwise: Render `DashboardLayout` + `<Outlet />`

**Issues**:
- ✅ Correctly waits for boot to complete
- ✅ Handles errors gracefully
- ❌ No server-side protection (middleware)
- ❌ Flashes may occur if store updates slowly

---

### 4. Login Page (`pages/Login.tsx`)

**Current Features**:
- ✅ Email + Phone number support
- ✅ Forgot password
- ✅ Dev registration (gated by `VITE_ENABLE_DEV_REGISTRATION` env var)

**Issues**:
- ❌ **Signup button always visible** (even though feature-gated, button text suggests self-service)
- ✅ Registration toggle correctly disabled when `VITE_ENABLE_DEV_REGISTRATION=false`
- ⚠️ UI confusion: "Register (Dev)" label suggests this is a public feature

---

### 5. File Structure

```
services/auth/
├── userStore.ts          # Zustand store (main state)
├── AuthProvider.tsx      # Context provider (syncs store to Context)
├── authTypes.ts          # Type definitions
├── authService.ts        # Supabase auth functions
├── authUtils.ts          # Utilities (clearStaleTokens, etc.)
├── profileService.ts     # Loads user profile from DB
├── useAuth.ts            # Hooks (useAuth, useUser, useUserStoreData)
├── useUserStoreHook.ts   # (appears unused/duplicate)
└── index.ts              # Exports

lib/
└── supabase.ts           # Supabase client (now without fallback keys)
```

---

## Issues Found

### 1. Signup Button Visible (UI Issue)

**Location**: `pages/Login.tsx:331`

**Current Code**:
```tsx
{isDevRegistrationEnabled && (
  <button
    type="button"
    onClick={() => {
      setIsRegistering(true);
      setLocalError('');
    }}
    className="text-indigo-600 hover:underline"
  >
    Register (Dev)
  </button>
)}
```

**Problem**: 
- Button text says "Register (Dev)" which confuses users
- Even though gated by `VITE_ENABLE_DEV_REGISTRATION`, button appears in production
- Creates false impression of self-service registration

**Fix**: Hide the button entirely unless in development OR explicitly enabled.

---

### 2. No Role/Permission Helpers

**Problem**: 
- Admin checks are scattered across components
- No centralized `canAccess()` or `requireRole()` utilities
- Role validation is implicit in routing only

**Needed**:
```typescript
// canAccess(resource, user) -> boolean
// requireRole(role, user) -> boolean
// useCanAccess(resource) -> boolean  // hook
```

---

### 3. Session Storage Issues on Vercel

**Status**: ✅ FIXED (commit 75cfa08)

**Root Cause**: Hardcoded fallback Supabase keys used when env vars missing

**Solution Applied**:
- Removed fallback keys
- Now requires explicit `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Fails fast with clear error message

---

### 4. Duplicate Stores/Hooks

**Potential Issues**:
- `useUserStoreHook.ts` appears similar to `useAuth.ts`
- `AuthProvider.tsx` syncs state manually instead of using store selectors
- `useUser()` and `useUserStoreData()` both exist

**Needed**: Consolidate to single source of truth.

---

### 5. Store Without Selectors

**Problem**: 
```typescript
const { user, bootStatus, error } = useUserStore();
// ^ Component rerenders on ANY store change
```

**Better Pattern**:
```typescript
const user = useUserStore((state) => state.user);
const bootStatus = useUserStore((state) => state.bootStatus);
// ^ Only rerender when these specific fields change
```

---

### 6. Error Recovery

**Problem**: 
- No automatic token refresh on 401
- No debounced refresh (could cause loops)
- Error states persist until manual retry

**Needed**:
- Debounced `refreshSession()` on 401
- Auto-clear auth state if refresh fails
- Redirect to login with message

---

## Security Checklist

| Check | Status | Notes |
|-------|--------|-------|
| Env vars required for auth | ✅ | Commit 75cfa08 enforces this |
| Session token NOT persisted | ✅ | `partialize` excludes session |
| JWT verification | ✅ | Supabase handles on server |
| CORS configured | ⚠️ | User must configure on Supabase |
| RLS policies enabled | ✅ | Database verified in prior audits |
| Admin routes protected | ✅ | Client-side, needs server-side too |
| Signup hidden in prod | ❌ | Button still visible, needs fix |
| Role validation | ⚠️ | Only in routing, needs helpers |
| Token refresh | ⚠️ | Stub implementation |
| 401 error recovery | ❌ | Not implemented |

---

## Recommended Fixes (Prioritized)

### Priority 1 (Do Now)
1. **Hide signup button in production** (5 min)
2. **Add role/permission helpers** (30 min)
3. **Create auth store selectors** (20 min)

### Priority 2 (Do Soon)
4. **Add server-side route protection** (1 hour)
5. **Improve token refresh logic** (45 min)
6. **Add auth tests** (1 hour)

### Priority 3 (Nice to Have)
7. **Better error recovery UI** (30 min)
8. **Auth architecture documentation** (30 min)

---

## Testing Checklist

- [ ] Login redirects unauthenticated users
- [ ] Login with phone number works
- [ ] Login with email works
- [ ] Signup button NOT visible in production
- [ ] Signup only works when `VITE_ENABLE_DEV_REGISTRATION=true`
- [ ] Non-admin cannot access `/admin/*` routes
- [ ] Admin can access `/admin/*` routes
- [ ] Logout clears auth state
- [ ] Session persists on page reload
- [ ] Session lost after 3 hours of inactivity
- [ ] Store hydrates correctly on boot
- [ ] Boot errors show retry option

---

## Next Steps

See linked files for implementation:
1. `AUTH_FIX_PLAN.md` - Detailed step-by-step fixes
2. `AUTH_HELPERS_UTILS.ts` - Role/permission utilities (new file)
3. `AUTH_SELECTORS.ts` - Store selectors (new file)
4. `__tests__/auth/` - Test files (new directory)

