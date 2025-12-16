# Auth System Testing & Verification Guide

## Overview

This guide provides comprehensive testing instructions for the hardened auth system and Delivery report fixes. Tests cover boot sequence resilience, stale data cleanup, timeout guards, and error surfacing.

## Quick Start - Run All Tests

```bash
# Run all auth tests
npm test -- __tests__/auth

# Run specific test suites
npm test -- __tests__/auth/boot-sequence.test.ts
npm test -- __tests__/auth/protected-route.test.ts

# Run with coverage
npm test -- __tests__/auth --coverage

# Watch mode (continuous)
npm test -- __tests__/auth --watch
```

## Test Suites Overview

### 1. Boot Sequence Tests (`__tests__/auth/boot-sequence.test.ts`)

**Purpose**: Verify auth store initialization, stale data cleanup, and boot timeout resilience.

#### Test Groups

**A. resetStore() Function**
- **Hardness**: Tests confirm store returns to initial state
- **Stale Data Cleanup**: Verifies persisted keys cleared from localStorage
- **Stale User Prevention**: Confirms old users not resurrected on boot
- **Commands**:
  ```bash
  npm test -- boot-sequence.test.ts -t "resetStore"
  ```

**B. Boot Timeout Guard**
- **10s Timeout**: Validates infinite checking state prevented
- **Always Settles**: Ensures bootStatus never stays 'checking' forever
- **Edge Cases**: Tests handling of slow network conditions
- **Commands**:
  ```bash
  npm test -- boot-sequence.test.ts -t "timeout"
  ```

**C. Logout & Session Clearing**
- **Auth State Cleared**: Confirms user, session, tokens all null
- **Error Recovery**: Tests bootError set on failure
- **Commands**:
  ```bash
  npm test -- boot-sequence.test.ts -t "logout"
  ```

**D. Stale Token Cleanup**
- **Remove Supabase Tokens**: Verifies sb-* keys removed
- **Preserve Other Data**: Confirms non-auth data not deleted
- **Commands**:
  ```bash
  npm test -- boot-sequence.test.ts -t "stale"
  ```

**E. Boot Error Recovery**
- **Error State Tracking**: Tests bootError and bootStatus pairing
- **Error Clearance**: Confirms errors cleared on successful rehydration
- **Commands**:
  ```bash
  npm test -- boot-sequence.test.ts -t "recovery"
  ```

#### Key Test Scenarios

| Scenario | Test | Expected Result |
|----------|------|-----------------|
| User logs out on tab 1, hard refresh on tab 2 | `resetStore` clears localStorage before rehydrate | No stale user persists |
| Slow network delays session fetch >10s | Boot timeout guard in `rehydrateFromSession` | bootStatus forced to 'ready' after 10s, not indefinite 'checking' |
| Multiple logout/login cycles | `logout()` → `resetStore()` → `rehydrate()` | Each cycle starts clean, no state bleeding |
| App starts with corrupted persisted auth | `resetStore()` on boot | Persisted key cleared, fresh boot from Supabase |

---

### 2. ProtectedRoute Integration Tests (`__tests__/auth/protected-route.test.ts`)

**Purpose**: Verify route gating, role-based access control, and boot state transitions.

#### Test Groups

**A. Auth Gating**
- **Loading State**: Confirms loading overlay shown during 'checking' state
- **Unauthenticated Redirect**: Verifies fallback shown when bootStatus='ready' + no user
- **Authenticated Rendering**: Confirms protected content shown with valid user
- **Commands**:
  ```bash
  npm test -- protected-route.test.ts -t "Auth Gating"
  ```

**B. Role-Based Access Control**
- **Admin Role Access**: Tests admin can access admin-only routes
- **Manager Role Access**: Tests manager permissions
- **User Role Denial**: Confirms regular users blocked from admin routes
- **Commands**:
  ```bash
  npm test -- protected-route.test.ts -t "Role-Based"
  ```

**C. Inactive User Handling**
- **Inactive User Denied**: Verifies `is_active=false` users blocked
- **Commands**:
  ```bash
  npm test -- protected-route.test.ts -t "Inactive"
  ```

**D. Boot State Transitions**
- **checking → ready**: Tests smooth transition from loading to content
- **Error Display**: Confirms boot errors displayed to user
- **Commands**:
  ```bash
  npm test -- protected-route.test.ts -t "Boot"
  ```

#### Key Test Scenarios

| Scenario | Route Behavior | Expected Result |
|----------|----------------|-----------------|
| Fresh app load, checking session | Show loading spinner | No content visible, just loader |
| Session check completes, no active session | bootStatus='ready', user=null | Redirect to fallback/login page |
| Session check completes, user authenticated as admin | bootStatus='ready', user.role='admin' | Render protected admin page |
| Authenticated user, but role doesn't match required | bootStatus='ready', user.role='user', need admin | Redirect to fallback page |
| User account deactivated (is_active=false) | Check is_active before access | Redirect to fallback even if had admin role |

---

## Local Testing - Manual Checklist

### Prerequisites
```bash
# Build for preview (Vercel-like environment)
npm run build

# Start local preview server
npm run preview
# Output: > Local: http://localhost:4173/
```

### Test Scenarios

#### Scenario 1: Login & Boot Sequence ✓

**Steps**:
1. Open preview at `http://localhost:4173/`
2. Should see login page (not authenticated yet)
3. Login with admin account (username/email: admin, password: admin)
4. **Observation**: No infinite loading spinner
5. **Expected**: Dashboard loads within 2-3 seconds
6. **Evidence**: Check browser console for `[Boot] Boot successful` message

**Checklist**:
- [ ] No loading spinner >5 seconds
- [ ] Dashboard renders after login
- [ ] Console shows `[Boot] Boot successful` or similar
- [ ] User menu shows logged-in user name

---

#### Scenario 2: Logout & Stale Data Prevention ✓

**Steps**:
1. From authenticated session (previous scenario)
2. Click user menu → Logout
3. **Observation**: Redirected to login page
4. Hard refresh page (Cmd+Shift+R or Ctrl+Shift+R)
5. **Expected**: Still on login page, no user info visible
6. **Critical**: User NOT resurrected from localStorage

**Checklist**:
- [ ] After logout, login page shows (not dashboard)
- [ ] Hard refresh keeps login page visible
- [ ] No stale user name in user menu
- [ ] Console shows `[Boot] Hard reset of auth store` or `[Storage] Cleared persisted key`

---

#### Scenario 3: Cross-Tab Logout Sync ✓

**Steps**:
1. Open TWO browser tabs at `http://localhost:4173/`
2. Tab A: Login with admin account
3. Tab A: Verify dashboard visible
4. Tab B: Refresh page
5. **Observation**: Tab B auto-authenticates (same session, Supabase sync)
6. Tab A: Click logout
7. **Expected**: Tab B should also show login page (cross-tab sync via Supabase.auth listener)
8. Tab A: Verify login page
9. Tab B: Verify login page (may need small delay, 1-2 seconds)

**Checklist**:
- [ ] Tab B auto-authenticates after refresh (shared Supabase session)
- [ ] Tab A logout triggers Tab B logout
- [ ] No stale user data in either tab after logout
- [ ] Console shows `[AuthProvider] Auth state changed: SIGNED_OUT`

---

#### Scenario 4: Delivery Report Rendering ✓

**Steps**:
1. Login with admin account (same as Scenario 1)
2. Navigate to `/admin/reports` (or click Admin → Reports)
3. Click **Delivery** tab
4. **Observation**: Report loads with data OR clear error message
5. **Critical**: Not blank, not stale data, explicit feedback

**Checklist - Success Case**:
- [ ] Delivery tab shows table with data (orders, delivered status, etc.)
- [ ] No loading spinner >3 seconds
- [ ] Summary stats visible (total invoices, delivered count, etc.)

**Checklist - Error Case**:
- [ ] If RLS/CORS issue: Error message visible
- [ ] Error banner displays: "Error loading delivery data: [specific error]"
- [ ] **Retry** button present and clickable
- [ ] Clicking retry re-attempts fetch (console shows new `[Delivery] Starting data fetch...`)

**Checklist - Loading State**:
- [ ] First load shows "Loading delivery data..." text
- [ ] Loading clears when data arrives or error occurs
- [ ] No lingering spinners after load completes

---

#### Scenario 5: Boot Timeout Guard (Advanced) ✓

**Purpose**: Verify system can't hang indefinitely during boot.

**Simulated Test** (requires dev tools network throttling):
1. Open DevTools → Network tab
2. Set throttle to "Slow 3G" or offline
3. Open new browser tab to `http://localhost:4173/`
4. **Observation**: App shows loading spinner initially
5. Wait 12 seconds
6. **Expected**: After ~10 seconds, loading spinner disappears and either:
   - Shows "Session check timed out. Please try refreshing." error message, OR
   - Shows login page (if no session available)
7. **Critical**: Never shows infinite spinner >10 seconds

**Checklist**:
- [ ] Throttle set to "Slow 3G"
- [ ] Initial page load shows spinner
- [ ] After 10 seconds, spinner is gone (bootStatus forced to 'ready')
- [ ] Error message OR login page visible (not blank)
- [ ] Console shows timeout warning: `[Boot] Boot timeout (10s exceeded)`

---

#### Scenario 6: Error Recovery & Retry ✓

**Steps**:
1. Login and navigate to `/admin/reports`
2. Click Delivery tab
3. If data loads successfully, simulate error:
   - DevTools → Network tab → filter for API calls
   - Disable network (DevTools offline)
4. Click Delivery tab again (or Retry if visible)
5. **Expected**: Error message appears: "Error loading delivery data: ..."
6. Re-enable network
7. Click **Retry** button
8. **Expected**: Data loads successfully after retry

**Checklist**:
- [ ] Error banner appears on fetch failure
- [ ] Error message is specific (not generic)
- [ ] Retry button present and functional
- [ ] After network restored + retry clicked, data loads
- [ ] No stale data shown during retry

---

## Vercel Deployment Verification

### Pre-Deployment Checklist

**Environment Variables** (verify in Vercel dashboard):
```bash
✓ VITE_SUPABASE_URL=https://qlosefnvwvmqeebfqdcg.supabase.co
✓ VITE_SUPABASE_ANON_KEY=eyJhbGc... (your key)
```

**Deploy**:
```bash
git add .
git commit -m "Phase 2: Auth robustness + Delivery report fixes"
git push origin main
# Vercel auto-deploys on push
```

### Post-Deployment Tests (On Vercel)

**On Production Build** (after deploy completes):

1. **Login Test**:
   - Visit https://firebeat-seven.vercel.app/
   - Login with admin credentials
   - Should not show indefinite loading spinner
   - Dashboard should load within 3 seconds

2. **Delivery Report Test**:
   - Navigate to `/admin/reports`
   - Click Delivery tab
   - Should show data or clear error message (not blank)
   - Error messages should be visible and helpful

3. **Logout Test**:
   - Click user menu → Logout
   - Should redirect to login page
   - Hard refresh (Cmd+Shift+R)
   - Should still show login page (no stale user)

4. **Error Monitoring**:
   - Vercel Logs → check for errors
   - Look for any undefined state warnings
   - Check RLS policy violations in Supabase logs

---

## Debugging Guide

### Common Issues & Solutions

#### Issue: "Loading delivery data..." spinner doesn't disappear

**Diagnosis**:
```bash
# Check browser console for errors
# Look for:
# 1. [Delivery] Error fetching data: ...
# 2. Network errors in DevTools → Network tab
```

**Solutions**:
1. Verify Supabase env vars set on Vercel
2. Check RLS policies allow `orders` / `users` / `returns` queries for authenticated users
3. Check network latency (DevTools → Network → Slow 3G)
4. Check if data is actually returning from API

#### Issue: Stale user persisting after logout

**Diagnosis**:
```bash
# In browser console:
localStorage.getItem('auth-user-storage')
# Should be null after logout + refresh
```

**Solution**:
- Verify `resetStore()` called on logout
- Verify AuthProvider calls `resetStore()` before `rehydrateFromSession()`
- Clear localStorage manually: `localStorage.clear()`

#### Issue: Cross-tab logout not syncing

**Diagnosis**:
```bash
# In console of one tab:
const unsubscribe = supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth event:', event);
});
# Try logout in another tab, watch for event
```

**Solution**:
- Verify `supabase.auth.onAuthStateChange()` listener in AuthProvider
- Check Supabase session is persisted (localStorage: `sb-*-auth-token`)
- Ensure tabs share same Supabase project URL

---

## Test Command Reference

### Run Specific Test Files

```bash
# Boot sequence tests
npm test -- boot-sequence.test.ts

# Protected route tests
npm test -- protected-route.test.ts

# All auth tests
npm test -- __tests__/auth
```

### Run Tests with Options

```bash
# Watch mode (re-run on file change)
npm test -- __tests__/auth --watch

# Coverage report
npm test -- __tests__/auth --coverage

# Verbose output
npm test -- __tests__/auth --verbose

# Run single test by name
npm test -- boot-sequence.test.ts -t "resetStore"

# Run tests matching pattern
npm test -- --testNamePattern="(boot|timeout)"
```

### Debug Tests

```bash
# Run with debug output
npm test -- __tests__/auth --debug

# Run with extra logging
DEBUG=* npm test -- __tests__/auth

# Keep test process running for debugging
npm test -- __tests__/auth --testTimeout=30000
```

---

## Metrics & Success Criteria

### Boot Sequence
| Metric | Target | Passing Criteria |
|--------|--------|------------------|
| Boot Time | <3s | From app load to dashboard visible |
| Timeout Guard | 10s max | bootStatus forced 'ready' if exceeds 10s |
| Stale Cleanup | 100% | All sb-* tokens removed on logout |
| Error Recovery | <1s | Error state set immediately on failure |

### Delivery Report
| Metric | Target | Passing Criteria |
|--------|--------|------------------|
| Load Time | <2s | Data visible or error shown |
| Error Display | 100% | Errors always visible to user |
| Retry Success | >95% | Retry button fixes transient errors |
| Stale Data | 0% | Never shows data after fetch error |

### Route Gating
| Metric | Target | Passing Criteria |
|--------|--------|------------------|
| Loading State | 100% | Loading overlay shown during boot |
| Role Enforcement | 100% | Unauthorized users always blocked |
| Inactive Users | 100% | is_active=false always blocked |

---

## Next Steps

1. **Run Local Tests**: `npm test -- __tests__/auth --watch`
2. **Manual Testing**: Follow manual checklist above
3. **Local Preview**: `npm run preview` and test Scenarios 1-6
4. **Deploy to Vercel**: Push to main, wait for deploy
5. **Verify on Production**: Test on deployed URL
6. **Monitor**: Watch Vercel logs for any errors

---

## Support & Reference

**Related Documentation**:
- [AUTH_ARCHITECTURE.md](./AUTH_ARCHITECTURE.md) - System design
- [AUTH_QUICK_REFERENCE.md](./AUTH_QUICK_REFERENCE.md) - Quick start
- [services/auth/userStore.ts](./services/auth/userStore.ts) - Store implementation
- [services/auth/AuthProvider.tsx](./services/auth/AuthProvider.tsx) - Provider implementation

**Key Functions**:
- `resetStore()` - Hard reset auth state and clear localStorage
- `rehydrateFromSession()` - Boot sequence with timeout guard
- `onAuthStateChange()` - Cross-tab sync listener
- `clearPersistedAuthKey()` - Remove stale localStorage

---

## Revision History

| Date | Changes | Author |
|------|---------|--------|
| 2025-01-20 | Initial comprehensive testing guide | AI Assistant |
| | Phase 2 implementation verification | |
| | Boot timeout + resetStore + listener | |
| | Delivery report error handling | |
