# Manual Verification Checklist - Auth Robustness & Delivery Report

**Purpose**: Quick reference checklist for manual testing the hardened auth system and Delivery report fixes.

**Timeline**: ~20-30 minutes for full checklist  
**Prerequisites**: `npm run build && npm run preview` running on http://localhost:4173

---

## SECTION 1: Boot Sequence & Login (5 min)

### Test 1.1: Clean Login - No Infinite Loading ✓
- **Steps**:
  1. Open http://localhost:4173 in fresh private/incognito tab
  2. See login form
  3. Enter admin credentials (username: admin, password: admin)
  4. Click Login
  5. Observe dashboard load time

- **Acceptance Criteria**:
  - [ ] Loading spinner appears briefly (1-2 seconds)
  - [ ] No spinner >5 seconds (boot timeout works)
  - [ ] Dashboard renders without errors
  - [ ] User name visible in top-right corner
  - [ ] Console shows NO `[Boot] Boot timeout` warning (indicates <10s)

- **Evidence to Capture**:
  - Screenshot of dashboard after login
  - Browser console log showing `[Boot] Boot successful`

---

## SECTION 2: Stale Data Prevention (5 min)

### Test 2.1: Logout & Hard Refresh - No Stale User ✓
- **Steps**:
  1. From logged-in state (Test 1.1)
  2. Click user menu → Logout
  3. Confirm redirect to login page
  4. **Hard Refresh**: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows/Linux)
  5. Observe page state

- **Acceptance Criteria**:
  - [ ] After logout, login page visible (not dashboard)
  - [ ] After hard refresh, STILL on login page (no stale user resurrection)
  - [ ] User menu EMPTY (no username visible)
  - [ ] Browser DevTools → Console shows:
    - `[Boot] Performing hard reset of auth store...` OR
    - `[Storage] Cleared persisted key: auth-user-storage`
  - [ ] localStorage CLEAN: `localStorage.getItem('auth-user-storage')` returns null

- **Evidence to Capture**:
  - Screenshot of login page after hard refresh
  - Browser console log showing storage cleared
  - `localStorage.getItem('auth-user-storage')` output in console

---

### Test 2.2: Multiple Login/Logout Cycles ✓
- **Steps**:
  1. Login → Logout → Login → Logout (repeat 3 times quickly)
  2. Check each transition
  3. Final logout + hard refresh

- **Acceptance Criteria**:
  - [ ] All transitions smooth (no infinite loading)
  - [ ] No errors accumulating in console
  - [ ] Final state after refresh: Login page with clean storage
  - [ ] No stale user from previous cycles

- **Evidence to Capture**:
  - Console output showing clean reset messages
  - No duplicate auth tokens in localStorage

---

## SECTION 3: Cross-Tab Logout Sync (5 min)

### Test 3.1: Logout Syncs Across Tabs ✓
- **Steps**:
  1. Open http://localhost:4173 in TWO separate tabs
  2. **Tab A**: Login with admin credentials
  3. **Tab A**: Verify dashboard visible
  4. **Tab B**: Refresh page (no login needed, should see dashboard too)
  5. **Tab A**: Click user menu → Logout
  6. **Tab A**: Observe redirect to login
  7. **Tab B**: Watch for auto-redirect to login (may take 1-2 seconds)

- **Acceptance Criteria**:
  - [ ] Tab A shows dashboard after login
  - [ ] Tab B auto-loads dashboard on refresh (shared session via Supabase)
  - [ ] Tab A logout redirects to login page
  - [ ] Tab B auto-redirects to login within 2 seconds (listener works)
  - [ ] Both tabs show login page after logout
  - [ ] Browser console shows: `[AuthProvider] Auth state changed: SIGNED_OUT`

- **Evidence to Capture**:
  - Side-by-side screenshot of Tab A (login) and Tab B (login) after logout
  - Console showing `SIGNED_OUT` event
  - Timing: Note seconds until Tab B updated

---

## SECTION 4: Delivery Report Rendering (5 min)

### Test 4.1: Delivery Tab Loads Successfully ✓
- **Steps**:
  1. Login (as in Test 1.1)
  2. Navigate to Admin → Reports (or /admin/reports)
  3. Wait for page to load
  4. Click **Delivery** tab
  5. Observe data load

- **Acceptance Criteria**:
  - [ ] Delivery tab content appears (not blank)
  - [ ] **Option A - Success**: 
    - Table with order rows visible
    - Summary stats (total invoices, delivered count, etc.)
    - No loading spinner >3 seconds
  - [ ] **Option B - Error**: 
    - Error banner visible with message
    - Error message is specific (not generic "error")
    - **Retry** button visible and clickable
  - [ ] No stale/old data from previous session
  - [ ] Console shows: `[Delivery] Starting data fetch...` then `[Delivery] Data fetched successfully...`

- **Evidence to Capture**:
  - Screenshot of Delivery tab with data or error
  - Browser console showing fetch success/error
  - Table row count or error message

---

### Test 4.2: Delivery Tab Error Handling & Retry ✓
- **Steps**:
  1. From Delivery tab (Test 4.1)
  2. If data loaded successfully, simulate error:
     - DevTools → Network tab
     - Filter for API requests
     - Throttle to "Offline" or block requests
  3. Reload page or navigate away/back to Delivery tab
  4. Observe error state
  5. Re-enable network
  6. Click **Retry** button
  7. Verify data loads

- **Acceptance Criteria**:
  - [ ] On error:
    - Error banner visible with specific message
    - No stale data shown (empty table or clear error state)
    - Retry button present and clickable
  - [ ] After retry:
    - Loading indicator shows "Loading delivery data..."
    - Data loads successfully
    - Error banner disappears
  - [ ] Console shows:
    - `[Delivery] Error fetching data: [specific error]`
    - `[Delivery] Starting data fetch...` (on retry)
    - `[Delivery] Data fetched successfully...` (after retry)

- **Evidence to Capture**:
  - Screenshot of error banner
  - Screenshot of successful load after retry
  - Console logs showing error → retry → success flow

---

## SECTION 5: Boot Timeout Guard (Advanced - Optional)

### Test 5.1: Slow Network Doesn't Hang (5 min)
- **Steps**:
  1. Open DevTools → Network tab
  2. Set throttle to "Slow 3G"
  3. Open NEW tab to http://localhost:4173
  4. Observe loading spinner
  5. Note the time
  6. Wait up to 15 seconds
  7. Check state after 10+ seconds

- **Acceptance Criteria**:
  - [ ] Loading spinner appears initially
  - [ ] At ~10 second mark, one of:
    - [ ] Spinner disappears and error shows: "Session check timed out..."
    - [ ] Spinner disappears and login page shown
  - [ ] **NEVER** infinite spinner >10 seconds
  - [ ] Console shows timeout warning:
    - `[Boot] Boot timeout (10s exceeded), forcing ready state`
  - [ ] Page becomes interactive (can click buttons)

- **Evidence to Capture**:
  - Screenshot at 10s showing no spinner (timeout worked)
  - Console log showing timeout warning
  - Note actual timeout time (should be ~10s, not longer)

---

## SECTION 6: Role-Based Access Control (5 min)

### Test 6.1: Admin Access Granted ✓
- **Steps**:
  1. Login with admin credentials (previous tests)
  2. Navigate to `/admin/reports` (should work)
  3. Click Delivery tab (should render)
  4. Try accessing other admin-only pages if available

- **Acceptance Criteria**:
  - [ ] Admin pages load without error
  - [ ] No "Access Denied" messages
  - [ ] All admin features visible and functional

---

### Test 6.2: Non-Admin Access Denied (Optional)
- **Steps** (if test user account available):
  1. Logout from admin session
  2. Login with non-admin user (e.g., regular staff)
  3. Try accessing `/admin/reports`
  4. Observe behavior

- **Acceptance Criteria**:
  - [ ] Redirected to dashboard or error page
  - [ ] Error message visible (e.g., "Insufficient permissions")
  - [ ] Admin menu hidden or disabled
  - [ ] No admin pages render

---

## SECTION 7: Activity Logout (Optional - 5 min)

### Test 7.1: Inactivity Logout Works (If Configured)
- **Steps** (if activity timeout is configured):
  1. Login to dashboard
  2. Leave app idle for configured timeout period
  3. Try to interact (click, navigate, etc.)

- **Acceptance Criteria**:
  - [ ] After inactivity timeout, redirected to login
  - [ ] Session cleared from localStorage
  - [ ] Confirmation message shown (if configured)

---

## SECTION 8: Error Recovery (5 min)

### Test 8.1: Network Error During Navigation ✓
- **Steps**:
  1. Login successfully
  2. DevTools → Network → throttle to "Offline"
  3. Click a link or navigate to new page
  4. Observe error handling
  5. Re-enable network
  6. Retry/refresh

- **Acceptance Criteria**:
  - [ ] Error message visible (not silent failure)
  - [ ] Page doesn't hang
  - [ ] Can interact with page (retry button, etc.)
  - [ ] After network restored, can retry successfully
  - [ ] No infinite loading spinner

---

## SECTION 9: Final Integration Test (5 min)

### Test 9.1: Complete User Journey ✓
- **Steps**:
  1. **Start**: Fresh tab, login page visible
  2. **Login**: Admin credentials, wait for dashboard
  3. **Navigate**: Go to Reports → Delivery tab
  4. **Interact**: Scroll, filter, or interact with report
  5. **Cross-Tab**: Open second tab, should auto-authenticate
  6. **Logout**: Click logout in Tab A
  7. **Sync**: Verify Tab B also logged out
  8. **Re-login**: Login again, verify clean state

- **Acceptance Criteria**:
  - [ ] Step 1: ✓ Login page loads
  - [ ] Step 2: ✓ Dashboard loads <3s, no timeout
  - [ ] Step 3: ✓ Delivery report loads with data or error
  - [ ] Step 4: ✓ Report interactive, no frozen state
  - [ ] Step 5: ✓ Tab B auto-authenticates on refresh
  - [ ] Step 6: ✓ Tab A redirects to login
  - [ ] Step 7: ✓ Tab B syncs logout within 2s
  - [ ] Step 8: ✓ Re-login clean, no stale data

- **Evidence to Capture**:
  - Complete console output from start to finish
  - Note any warnings or errors (should be minimal)
  - Timing: Boot time, report load time, logout sync time

---

## SUMMARY SCORECARD

### Critical (Must Pass)
- [ ] **1.1**: Boot <5 seconds (no timeout)
- [ ] **2.1**: No stale user after logout + refresh
- [ ] **3.1**: Cross-tab logout syncs within 2 seconds
- [ ] **4.1**: Delivery report renders (data or error, not blank)

### Important (Should Pass)
- [ ] **4.2**: Retry button works on error
- [ ] **5.1**: Boot timeout guard prevents >10s hanging
- [ ] **6.1**: Admin routes accessible to admin users
- [ ] **9.1**: Complete journey works end-to-end

### Optional (Nice to Have)
- [ ] **6.2**: Non-admin users denied access
- [ ] **7.1**: Inactivity logout after X minutes
- [ ] **8.1**: Network error recovery

---

## Sign-Off

**Tester Name**: _______________________  
**Test Date**: _______________________  
**Environment**: [ ] Local (npm preview)  [ ] Vercel Production  
**Result**: [ ] **PASS** (all critical + important)  [ ] **FAIL** (issues found)  

**Issues Found** (if any):
```
1. [Issue description]
   - Expected: [what should happen]
   - Actual: [what happened]
   - Steps to reproduce: [how to reproduce]

2. [Issue description]
   ...
```

**Notes**:
```
[Any additional observations, timing notes, or context]
```

---

## Contact & Support

- **Auth System Documentation**: See AUTH_ARCHITECTURE.md
- **Test Guide**: See AUTH_TESTING_GUIDE.md
- **Quick Reference**: See AUTH_QUICK_REFERENCE.md
- **Code Location**: services/auth/ directory

**Key Files Modified**:
- services/auth/userStore.ts (resetStore, boot timeout)
- services/auth/AuthProvider.tsx (boot sequence, auth listener)
- pages/admin/Reports.tsx (error handling, retry)
