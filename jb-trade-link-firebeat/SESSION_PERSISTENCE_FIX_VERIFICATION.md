# Session Persistence Fix - Verification Guide

## Problem Fixed

**Issue**: App was logging out on every page refresh, even with valid Supabase sessions.

**Root Cause**: `AuthProvider.tsx` was calling `resetStore()` unconditionally at boot, which cleared all `sb-*` auth tokens from localStorage **before** checking if a valid session existed. The boot sequence was backwards:
```
❌ BAD (old):  Clear tokens → Check session → Try to restore (fails, no tokens!)
✅ GOOD (new): Check session → Load profile → Keep session (or clear if invalid)
```

## Changes Made

### 1. AuthProvider.tsx (Boot Effect)
**Before**: 
```typescript
// Hard reset before rehydration to clear stale persisted state
useUserStore.getState().resetStore();

// Start rehydration (with built-in 10s timeout)
await useUserStore.getState().rehydrateFromSession();
```

**After**:
```typescript
// Rehydrate session WITHOUT clearing tokens first
// rehydrateFromSession() will check getSession() first,
// then only clear tokens if session is missing/invalid
await useUserStore.getState().rehydrateFromSession();
```

**Why**: `resetStore()` is now only called when actually logging out, not on every boot. The rehydration function handles clearing tokens internally when needed.

### 2. userStore.ts (rehydrateFromSession)
**Critical change in token clearing logic**:

Before: Scattered `clearStaleTokens()` calls after errors
```typescript
const { data, error } = await supabase.auth.getSession();
// ... if error or no session, then clear
```

After: Guarded clearing with detailed logging
```typescript
// CRITICAL: Check Supabase session FIRST before clearing anything
const { data, error } = await supabase.auth.getSession();

if (error) {
  // Session lookup failed - clear tokens and stay logged out
  clearStaleTokens();
  set({ bootStatus: 'ready', user: null, session: null });
  return;
}

const session = data.session;

if (!session?.user) {
  // No session - clear tokens
  clearStaleTokens();
  set({ bootStatus: 'ready', user: null, session: null });
  return;
}

// Session exists - NOW load profile
try {
  const profile = await loadUserProfile(session.user.id);
  // Success - set authenticated WITHOUT clearing tokens
  set({ bootStatus: 'ready', user: profile, session });
} catch (profileErr) {
  // Profile failed - NOW clear tokens as unrecoverable
  clearStaleTokens();
  set({ bootStatus: 'ready', user: null, session: null });
}
```

**Why**: Tokens are only cleared when we've confirmed:
1. Session doesn't exist, OR
2. Session exists but profile fetch fails

Tokens are preserved when profile load succeeds.

## Testing Checklist

### ✅ Test 1: Normal Refresh (Session Persists)
**Steps:**
1. `npm run dev` - start dev server
2. Navigate to `/login`
3. Login with valid credentials
4. Verify you're on authenticated page (e.g., `/admin/dashboard`)
5. **Hard refresh**: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows/Linux)
6. **Expected**: 
   - ✓ Still on dashboard
   - ✓ User info still visible
   - ✓ No redirect to login
   - ✓ Console shows: `[Boot] Valid session found` → `[Boot] Profile loaded successfully`

### ✅ Test 2: Logout Still Works
**Steps:**
1. While logged in, click Logout button
2. **Expected**:
   - ✓ Redirected to login page
   - ✓ Console shows: `[Auth] Logging out...` → tokens cleared
   - ✓ Hard refresh on login page keeps you on login (no auto-login)

### ✅ Test 3: Expired Session Gets Cleared
**Steps:**
1. Login normally
2. Wait for token to expire (or manually delete sb-* keys from DevTools)
3. Hard refresh
4. **Expected**:
   - ✓ Redirected to login page
   - ✓ Console shows: `[Boot] No active session found, clearing auth state`
   - ✓ No authenticated data visible

### ✅ Test 4: Cross-Tab Sync Still Works
**Steps:**
1. Open app in Tab A, login
2. Open app in Tab B (same domain, should be same session)
3. Both tabs should show authenticated
4. Logout in Tab A
5. Refresh Tab B
6. **Expected**:
   - ✓ Tab B detects logout and redirects to login
   - ✓ onAuthStateChange subscription handles it

### ✅ Test 5: Profile Fetch Failure Handling
**Steps:**
1. Login normally
2. Open DevTools → Network tab
3. Manually delete localStorage `auth-user-storage` (but leave sb-* tokens)
4. Hard refresh
5. Intercept profile fetch request and block it (set offline mode)
6. **Expected**:
   - ✓ Console shows: `[Boot] Profile fetch failed`
   - ✓ Tokens are cleared
   - ✓ Redirected to login
   - ✓ No infinite "Checking session..." loop

## Console Log Inspection

### Successful Boot (Session Preserved)
```
[Boot] Starting boot...
[Boot] Starting session rehydration...
[Boot] Session check: Found valid session
[Boot] Valid session found, loading profile for user: abc123...
[Boot] Profile loaded successfully
[Boot] Boot complete. User authenticated: true
```

### Failed Boot (Session Invalid)
```
[Boot] Starting boot...
[Boot] Starting session rehydration...
[Boot] Session check: No session found
[Boot] No active session found, clearing auth state
[Boot] Boot complete. User authenticated: false
```

### Profile Load Failure (Tokens Cleared)
```
[Boot] Valid session found, loading profile for user: abc123...
[Boot] Profile fetch failed: [error message]
[Boot] Boot complete. User authenticated: false
```

## DevTools Verification

### localStorage Check
After login and refresh, DevTools → Application → Storage → localStorage should show:
- ✓ `sb-qlosefnvwvmqeebfqdcg-auth-token` (session token)
- ✓ `sb-qlosefnvwvmqeebfqdcg-auth-token-code-verifier` 
- ✓ `auth-user-storage` (persisted user summary)
- ✓ Other app data

**NOT cleared on refresh**, but cleared on logout.

### Network Tab Check
1. Do hard refresh on authenticated page
2. Look for requests to:
   - `/auth/v1/user` - getting current user (should 200)
   - `/rest/v1/users?id=...` - getting user profile (should 200)
3. No requests should return 401 (not authenticated)

## Common Debugging

### Issue: Still Getting Logged Out on Refresh
**Diagnosis**:
1. Check DevTools Console → Search for `[Boot]`
2. Check if logs show: `[Boot] Valid session found` then `Profile loaded`?
   - YES: Session is loading but something else redirects (check useAuth/useUserStore subscribers)
   - NO: Session is not being found (check localStorage still has sb-* tokens)

**Solutions**:
- Force hard refresh with `Ctrl+F5` (full cache clear)
- Check if `getSession()` is returning null (browser DevTools Network tab)
- Verify `loadUserProfile()` is not throwing error

### Issue: Infinite "Checking Session..." Loop
**Check**: Console should show `[Boot] Boot timeout (10s exceeded), forcing ready state`
- If this message appears, there's a bug in boot logic (should be fixed)
- If timeout doesn't appear but stuck for 10s+, check Profile request in Network tab

**Solution**: Refresh page, check if profile request hanging

### Issue: Non-Admin Can't Login After Fix
**Likely Cause**: Your user doesn't have a profile in `users` table
**Fix**:
1. Admin page → Users
2. Create user with your email
3. Use "Set Password" (lock icon) to set initial password
4. Logout, then login again

## Rollback Instructions

If issues persist, revert to previous commit:
```bash
git revert HEAD
npm run dev
# Test again
```

## Performance Notes

Boot now takes ~2-3 seconds longer due to:
1. `getSession()` call (fast, <100ms)
2. `loadUserProfile()` call (network dependent, 1-2s)
3. Overall faster than old version that logged you out then back in

No impact on page load time after boot.

## Files Modified

1. **services/auth/AuthProvider.tsx**
   - Removed unconditional `resetStore()` call
   - Simplified boot flow to just `rehydrateFromSession()`

2. **services/auth/userStore.ts**
   - Reorganized `rehydrateFromSession()` with session-first logic
   - Added detailed comments explaining token clearing guards
   - Updated `resetStore()` docstring

## Commit Reference

- **Hash**: 36cc8cd
- **Message**: Fix: Prevent logout on refresh by guarding token clearing during boot
- **Files**: 2 changed, 24 insertions(+), 9 deletions(-)

---

**Status**: ✅ Ready for Testing

Start with Test 1 (Normal Refresh) to confirm the main fix works!
