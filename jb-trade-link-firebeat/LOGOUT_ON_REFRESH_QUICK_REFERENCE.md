# Quick Reference: Logout-on-Refresh Fix

## What Was Fixed

User got logged out on every page refresh, even with valid Supabase sessions.

## Root Cause

Boot flow was backwards:
- ❌ OLD: Clear tokens → Check session → (no tokens, so no session!) → User logged out
- ✅ NEW: Check session → Load profile → Keep tokens → User stays logged in

## The Fix (2 Files)

### 1. AuthProvider.tsx (Boot Effect)
**Removed**: `useUserStore.getState().resetStore()` from boot startup
**Why**: This was nuking valid session tokens before checking if they're needed

### 2. userStore.ts (rehydrateFromSession)
**Changed**: Token clearing logic from "clear then check" to "check then conditionally clear"
- ✅ getSession() runs FIRST (doesn't clear anything yet)
- ✅ If session exists → load profile → keep tokens
- ✅ If no session → clear tokens
- ✅ If profile fails → clear tokens as unrecoverable

## Testing (Simple 2-Step)

1. **Login** → Hard refresh (Cmd+Shift+R) → Should stay logged in ✓
2. **Logout** → Hard refresh → Should stay on login ✓

## Console Validation

After hard refresh on authenticated page, console should show:
```
[Boot] Starting session rehydration...
[Boot] Session check: Found valid session
[Boot] Valid session found, loading profile for user: [uuid]
[Boot] Profile loaded successfully
[Boot] Boot complete. User authenticated: true
```

## Commit

**36cc8cd** - Fix: Prevent logout on refresh by guarding token clearing during boot

## Docs

- `SESSION_PERSISTENCE_FIX_VERIFICATION.md` - Full testing guide with 5 test scenarios
- `LOGOUT_ON_REFRESH_FIX_SUMMARY.md` - Technical deep dive

---

**Status**: ✅ Ready to test

**Action**: Do the 2-step test above to verify!
