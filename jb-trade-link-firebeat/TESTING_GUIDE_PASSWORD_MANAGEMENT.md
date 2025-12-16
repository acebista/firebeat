# Admin Password Management - Testing Guide

## Quick Test (5 minutes)

### Prerequisites
- You must be logged in as an **admin user**
- User must have `role = 'admin'` in the `users` table
- Browser cache cleared (Cmd+Shift+R or Ctrl+Shift+R)

### Test Steps

1. **Open Admin Users Page**
   - Navigate to `/admin/users`
   - Should see list of all users with action buttons

2. **Find a Test User**
   - Pick any user in the list (preferably a test/sandbox user)

3. **Click Lock Icon (Set Password)**
   - Located in the Actions column (leftmost icon)
   - Modal titled "Set Password for [User Name]" should open
   - Shows email address and password requirements

4. **Option A: Generate Random Password**
   - Click "Generate Random Password" button
   - Both password fields auto-fill with a random 12-character password
   - Click "Set Password"

5. **Option B: Manual Password**
   - Type a password meeting requirements:
     - ✓ At least 8 characters
     - ✓ At least one UPPERCASE letter
     - ✓ At least one lowercase letter
     - ✓ At least one number (0-9)
   - Type same password in "Confirm Password"
   - Click "Set Password"

6. **Verify Success**
   - Modal should close
   - Green toast notification: "Password set for [User Name]"
   - Modal closes automatically

7. **Test the New Password**
   - Logout
   - Login with that user's email and new password
   - Should successfully login
   - Should NOT work with old password

## Error Scenarios (Negative Tests)

### Not Admin
**Setup**: Login as non-admin user
**Action**: Try to set password via direct URL `/admin/users`
**Expected**: Modal might open but should see error: "You do not have admin privileges"

### Weak Password
**Action**: Enter password: `test123`
**Expected**: Red error box appears before submission showing missing requirements:
- "Password must be at least 8 characters"
- "Password must contain at least one uppercase letter"

### Passwords Don't Match
**Action**: 
- Password field: `MyPass123`
- Confirm field: `MyPass124`
- Click "Set Password"
**Expected**: Error: "Passwords do not match"

### Expired Session
**Setup**: Wait > 1 hour for session to expire
**Action**: Try to set password
**Expected**: Error: "Your session has expired. Please login again"

### Invalid User (doesn't exist)
**Setup**: Somehow pass invalid userId to function (shouldn't happen in UI)
**Expected**: Error from Supabase: "User not found"

## Browser Debugging

### Network Tab
1. Open DevTools (F12 / Cmd+Option+I)
2. Go to **Network** tab
3. Filter by "admin-update-password"
4. Set a password
5. Should see POST request to: `https://.../functions/v1/admin-update-password`
6. **Response should be HTTP 200** with body:
   ```json
   {
     "success": true,
     "message": "Password updated successfully",
     "userId": "..."
   }
   ```

### Console Tab
1. Open DevTools (F12)
2. Go to **Console** tab
3. Look for logs starting with `[AdminPasswordService]`
4. Should see success logs, no errors
5. If error, should show parsed error message

### Supabase Logs
1. Go to Supabase Dashboard
2. Project → Edge Functions → admin-update-password
3. Click **Logs** tab
4. Look for recent POST requests
5. Should see:
   - `POST | 200` for success
   - `POST | 403` if user not admin
   - `POST | 401` if auth token invalid
   - `POST | 400` if input validation failed
6. Full error messages visible in logs

## Success Criteria

✅ **All of these must be true**:
- [ ] Generate Random Password button works
- [ ] Manual password entry works with valid password
- [ ] Error shown for weak passwords
- [ ] Error shown for mismatched passwords
- [ ] Success toast appears on password set
- [ ] Modal closes after successful set
- [ ] New password works on login
- [ ] Non-admin user gets 403 error
- [ ] Network shows HTTP 200 response
- [ ] Console shows success logs
- [ ] Supabase logs show POST 200

## Common Issues & Solutions

### Issue: "Edge Function returned a non-2xx status code"
**Cause**: Function returned error (likely 403 or 401)
**Fix**: 
- Check you're logged in as admin
- Verify `role = 'admin'` in users table
- Check Supabase logs for specific error
- Check browser console for error message

### Issue: Modal opens but "Set Password" button disabled
**Cause**: Password fields are empty or don't match
**Fix**: 
- Fill both password fields
- Make sure they match exactly
- Password must meet all requirements

### Issue: "Not authenticated" error
**Cause**: Session expired or not logged in
**Fix**: 
- Logout and login again
- Refresh page after login
- Check browser has session cookie

### Issue: Success toast but password doesn't work on login
**Cause**: Password set but user profile may not exist or other issue
**Fix**: 
- Verify user exists in `users` table
- Check user.isActive is `true`
- Verify email is correct
- Try generating new password again

### Issue: No error message, just generic "Failed"
**Cause**: Edge Function logs might have more details
**Fix**: 
1. Check Supabase Dashboard → Edge Functions → Logs
2. Look for the request timestamp
3. Check full error in logs
4. Share logs with support if unclear

## Performance Notes

- Password set should complete in **< 3 seconds**
- If > 5 seconds, likely network/timeout issue
- Function execution time shown in Supabase logs (should be < 2 seconds)

## Cleanup After Testing

1. If you created test users, delete them from `/admin/users`
2. No database cleanup needed
3. Cache can be cleared anytime (Cmd+Shift+R)

---

**Ready to test?** Start with Quick Test section above! 🚀
