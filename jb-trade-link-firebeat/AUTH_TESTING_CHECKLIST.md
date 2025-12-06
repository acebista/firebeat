# Auth System - Complete Testing & Validation Checklist

## Phase 1: Local Development Testing

### 1.1 Hard Refresh - Logged In State

**Precondition**: User is logged in and dashboard is visible

**Steps**:
1. Open DevTools → Console and Network tabs
2. Press `F5` or `Cmd+Shift+R` (hard refresh)
3. Watch console for logs starting with `[Boot]`
4. Check Network tab for these calls in order:
   - `POST /auth/v1/session` (status 200)
   - `GET /rest/v1/users?...` (status 200)

**Expected Result**:
- ✓ Dashboard loads (no redirect to login)
- ✓ User data is displayed
- ✓ Console shows: `[Boot] Profile loaded successfully`
- ✓ Network shows 200 responses

**If Failed**:
- Check console for errors: `[Boot] Profile fetch failed`
- Check network response for 401/403
- See [RLS Policies Check](#rls-policies-check) below

### 1.2 Hard Refresh - Logged Out State

**Precondition**: User is logged out and at login page

**Steps**:
1. Logout (should show login page)
2. Hard refresh (`F5` or `Cmd+Shift+R`)
3. Watch console

**Expected Result**:
- ✓ Login page still visible
- ✓ No perpetual loader
- ✓ Console shows: `[Boot] No active session, clearing auth state`
- ✓ No JavaScript errors

**If Failed**:
- Check if stuck in loader (bootStatus: checking)
- Look for network errors in Network tab

### 1.3 Hard Refresh - Session Expired

**Precondition**: Session JWT expired but token exists in localStorage

**Steps**:
1. Logout
2. Manually add an expired session token to localStorage:
```javascript
// In Console
localStorage.setItem('sb-PROJECTID-auth-token', JSON.stringify({
  access_token: 'eyJhbGc...',  // any JWT (will be invalid)
  refresh_token: '...',
}));
```
3. Hard refresh
4. Watch console

**Expected Result**:
- ✓ Login page shows (not dashboard)
- ✓ May show error + Retry button
- ✓ Console shows: `[Boot] Profile fetch failed` with error message
- ✓ Clicking Retry attempts boot again

**If Failed**:
- Check if stuck on dashboard (should not be)
- Look for permission errors in console

### 1.4 Login Flow

**Steps**:
1. Go to login page
2. Enter valid credentials
3. Wait for redirect to dashboard

**Expected Result**:
- ✓ `[Auth] User authenticated: {email}` in console
- ✓ Dashboard loads
- ✓ User data is correct

### 1.5 Logout Flow

**Steps**:
1. Click logout button
2. Observe redirect

**Expected Result**:
- ✓ Redirects to login page
- ✓ Console shows: `[Auth] Logging out...`
- ✓ localStorage cleared of auth tokens
- ✓ Can log back in without issues

### 1.6 3-Hour Inactivity Timeout

**Manual Test** (for development only):
```javascript
// In Console, change timeout to 10 seconds for testing
// Edit AuthProvider.tsx: INACTIVITY_TIMEOUT = 10 * 1000
```

**Steps**:
1. Log in
2. Wait 10 seconds without any mouse/keyboard activity
3. Observe redirect to login

**Expected Result**:
- ✓ Auto-logout after inactivity
- ✓ Console shows warning message

## Phase 2: Product Management Testing

### 2.1 Add New Product

**Steps**:
1. Go to Admin → Products
2. Click "Add Product"
3. Fill all fields:
   - Name: "Test Product"
   - Company: Select one
   - Base Rate: 100
   - Discounted Rate: 80
   - Order Multiple: 5
   - etc.
4. Click "Save Product"

**Expected Result**:
- ✓ Product saves successfully
- ✓ Toast shows "Product added successfully"
- ✓ New product appears in table with auto-generated ID (prod_xxxxx)
- ✓ No validation errors

**If Failed**:
- Check browser console for error messages
- Verify all fields are filled
- Check that numeric fields are actually numbers

### 2.2 Edit Product

**Steps**:
1. Click edit icon on existing product
2. Change name to "Updated Name"
3. Click "Save Product"

**Expected Result**:
- ✓ Product updates
- ✓ Toast shows "Product updated successfully"
- ✓ Table reflects changes

### 2.3 Validation Test

**Steps**:
1. Click "Add Product"
2. Leave "Company" empty
3. Click "Save Product"

**Expected Result**:
- ✓ Red error message under Company field
- ✓ Toast shows "Please fix validation errors"
- ✓ Modal stays open (not saved)

## Phase 3: Session Persistence Testing

### 3.1 localStorage Inspection

**Steps**:
1. Log in
2. Open Console → Storage → Local Storage
3. Find `auth-user-storage` key

**Expected Content**:
```json
{
  "state": {
    "user": {
      "id": "user_uuid",
      "email": "user@example.com",
      "name": "User Name",
      "role": "admin",
      "isActive": true
    }
  },
  "version": 3
}
```

**Must NOT contain**:
- ✗ `session` field (sessions are ephemeral)
- ✗ `access_token` or `refresh_token` (handled by Supabase)

### 3.2 Supabase Token Inspection

**Steps**:
1. Log in
2. Open Console → Storage → Local Storage
3. Look for keys starting with `sb-`

**Expected Keys** (Supabase manages these):
- `sb-PROJECTID-auth-token` (Contains access_token, refresh_token)
- `sb-PROJECTID-auth-session` (May be empty or contain session metadata)

**These should be different after each login**:
```javascript
// Compare tokens before/after login
const before = localStorage.getItem('sb-PROJECTID-auth-token');
// ... login ...
const after = localStorage.getItem('sb-PROJECTID-auth-token');
// before !== after (should be true)
```

## Phase 4: RLS Policies Check

### 4.1 Verify Users Table RLS

**In Supabase Dashboard**:
1. Go to SQL Editor
2. Run:
```sql
-- Test 1: Can authenticated user select their own profile?
SELECT * FROM users 
WHERE id = auth.uid() 
LIMIT 1;
-- Should return 1 row

-- Test 2: Check RLS is enabled
SELECT tablename, enable_rls 
FROM pg_tables 
WHERE tablename = 'users';
-- Should show: enable_rls = true

-- Test 3: Check active policies
SELECT policyname, cmd, permissive, qual 
FROM pg_policies 
WHERE tablename = 'users';
-- Should show policies allowing SELECT
```

**Expected Results**:
- ✓ Can select own profile
- ✓ RLS is enabled
- ✓ Policies exist for authenticated users

### 4.2 Verify Products Table RLS

```sql
-- Products should be readable by authenticated users
SELECT * FROM products LIMIT 1;
-- Should return at least 1 row if data exists
```

## Phase 5: Error Scenarios

### 5.1 Network Error During Boot

**Simulate**:
1. Open DevTools → Network tab
2. Check "Offline"
3. Hard refresh

**Expected Result**:
- ✓ Shows error message (no perpetual loader)
- ✓ Has Retry button
- ✓ Clicking Retry attempts again (will still fail while offline)

### 5.2 Invalid JWT

**Simulate**:
1. Log in normally
2. In Console:
```javascript
// Get token
const token = localStorage.getItem('sb-PROJECTID-auth-token');
const parsed = JSON.parse(token);

// Corrupt it
parsed.access_token = 'invalid-jwt-here';
localStorage.setItem('sb-PROJECTID-auth-token', JSON.stringify(parsed));

// Hard refresh
location.reload(true);
```

**Expected Result**:
- ✓ Profile fetch fails (401)
- ✓ Shows error with Retry button
- ✓ Clicking Login redirects to login page
- ✓ Can log in again normally

### 5.3 User Row Missing from Database

**Simulate** (Admin only):
1. Log in as admin
2. In Supabase Dashboard, manually delete the user row from `users` table
3. Hard refresh

**Expected Result**:
- ✓ Shows "Profile fetch failed"
- ✓ Can log in again to recreate row (if trigger exists)
- ✓ No perpetual loader

## Phase 6: Cross-Browser Testing

Test on:
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

For each browser:
- [ ] Hard refresh while logged in - dashboard visible
- [ ] Hard refresh while logged out - login page visible
- [ ] Add product successfully
- [ ] 3-hour inactivity logout works (modify timeout for testing)

## Phase 7: Production Deployment

### Pre-Deployment Checklist

- [ ] All console error messages reviewed
- [ ] RLS policies verified on production database
- [ ] Bundle size acceptable (< 500KB per chunk)
- [ ] No sensitive data in localStorage
- [ ] Session refresh working correctly
- [ ] Error monitoring configured

### Post-Deployment Monitoring

```typescript
// Add to monitoring service
useUserStore.subscribe(
  state => state.bootStatus,
  (status) => {
    if (status === 'error') {
      const error = useUserStore.getState().bootError;
      monitoringService.captureException({
        type: 'AUTH_BOOT_FAILED',
        error,
        timestamp: new Date(),
      });
    }
  }
);
```

## Debug Commands Reference

### Check Boot Status Anytime
```javascript
const store = useUserStore.getState();
console.table({
  bootStatus: store.bootStatus,
  user: store.user?.email,
  hasSession: !!store.session,
  error: store.bootError,
});
```

### Force Logout
```javascript
useUserStore.getState().logout();
```

### Force Boot Retry
```javascript
useUserStore.getState().retryBoot();
```

### Clear All Auth Data
```javascript
localStorage.removeItem('auth-user-storage');
Object.keys(localStorage)
  .filter(k => k.includes('sb-'))
  .forEach(k => localStorage.removeItem(k));
// Then hard refresh
```

### Simulate Session Expiry
```javascript
const token = JSON.parse(localStorage.getItem('sb-PROJECTID-auth-token'));
const expired = {
  ...token,
  access_token: token.access_token.slice(0, -10) + '0000000000', // Corrupt it
};
localStorage.setItem('sb-PROJECTID-auth-token', JSON.stringify(expired));
location.reload(true);
```

## Success Criteria

✓ All tests pass
✓ Hard refresh preserves valid sessions
✓ Hard refresh logs out on expired sessions  
✓ No perpetual loaders
✓ Error retry button works
✓ 3-hour inactivity logout works
✓ Products can be created with auto-generated IDs
✓ All validation works correctly
✓ Bundle size < 2MB
