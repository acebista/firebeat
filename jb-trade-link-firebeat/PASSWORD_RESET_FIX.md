# Password Reset Not Working - Diagnosis & Fix

## 🔴 Problem

When clicking the password reset link from email, you're redirected to the login screen instead of the reset password page.

---

## 🔍 Root Cause

The issue is likely one of these:

### 1. **Supabase Redirect URL Not Whitelisted** (Most Likely)
Supabase requires you to whitelist redirect URLs in the dashboard. If `http://localhost:5173/#/reset-password` is not whitelisted, Supabase will redirect to the default URL (which is probably your login page).

### 2. **Hash-Based Routing Issue**
The app uses hash-based routing (`/#/reset-password`), but Supabase might be stripping the hash when redirecting.

### 3. **Token Not Being Parsed Correctly**
The `ResetPassword.tsx` component parses the token from the URL hash, but if Supabase redirects differently, the token might not be in the expected location.

---

## ✅ Solution

### Step 1: Whitelist Redirect URL in Supabase (REQUIRED)

1. **Go to Supabase Dashboard**
   - Open https://app.supabase.com
   - Select your project

2. **Navigate to Authentication Settings**
   - Click **Authentication** in left sidebar
   - Click **URL Configuration**

3. **Add Redirect URLs**
   Add these URLs to the **Redirect URLs** list:
   ```
   http://localhost:5173/#/reset-password
   http://localhost:5173/reset-password
   http://localhost:5173
   ```

   For production, also add:
   ```
   https://yourdomain.com/#/reset-password
   https://yourdomain.com/reset-password
   https://yourdomain.com
   ```

4. **Save Changes**

### Step 2: Update Code to Handle Both Hash and Path-Based Routing

I'll update the `ResetPassword.tsx` component to handle tokens in multiple locations.

---

## 🔧 Code Fixes

### Fix 1: Enhanced Token Detection

The current code only checks the hash. We need to also check:
- URL search params (`?access_token=...`)
- URL hash params (`#access_token=...`)

### Fix 2: Better Error Messages

Add more specific error messages to help debug the issue.

### Fix 3: Fallback Redirect

If no token is found, provide a clear path to request a new reset link.

---

## 📝 Implementation

I'll update the `ResetPassword.tsx` component with enhanced token detection and better error handling.

---

## 🧪 Testing Steps

After applying the fix:

### Test 1: Request Reset Email
1. Go to login page
2. Click "Forgot password?"
3. Enter your email
4. Click "Send Reset Link"
5. Check console for any errors

### Test 2: Check Email
1. Open your email inbox
2. Find the reset email from Supabase
3. **Copy the reset link** (don't click yet)
4. Paste it in a text editor
5. Verify it contains `access_token` and `type=recovery`

### Test 3: Click Reset Link
1. Click the reset link in email
2. Should open reset password page
3. Check browser console for logs
4. Verify you see the password form (not an error)

### Test 4: Reset Password
1. Enter new password (8+ characters)
2. Confirm password
3. Click "Update Password"
4. Should see success message
5. Should redirect to login after 2 seconds

### Test 5: Login with New Password
1. On login page
2. Enter email and NEW password
3. Should login successfully

---

## 🐛 Debugging

If it still doesn't work, check these:

### Check 1: Inspect the Reset Link
```javascript
// Paste the reset link and check its structure
const resetLink = "YOUR_RESET_LINK_HERE";
console.log('Link:', resetLink);
console.log('Has access_token:', resetLink.includes('access_token'));
console.log('Has type=recovery:', resetLink.includes('type=recovery'));
```

### Check 2: Check Browser Console
When you click the reset link, open browser console (F12) and look for:
- "Hash params:" log
- "Password recovery link detected" log
- Any error messages

### Check 3: Check Supabase Logs
1. Go to Supabase Dashboard
2. Click **Logs** → **Auth Logs**
3. Look for password reset events
4. Check for any errors

### Check 4: Verify Email Template
1. Go to Supabase Dashboard
2. Click **Authentication** → **Email Templates**
3. Find "Reset Password" template
4. Verify the redirect URL in the template matches your app

---

## 🔧 Alternative: Use Query Params Instead of Hash

If hash-based routing continues to cause issues, we can switch to query params:

### Change in Login.tsx:
```typescript
// Instead of:
redirectTo: `${window.location.origin}/#/reset-password`

// Use:
redirectTo: `${window.location.origin}/reset-password`
```

### Change in ResetPassword.tsx:
```typescript
// Check both hash and query params
const hashParams = new URLSearchParams(window.location.hash.substring(1));
const searchParams = new URLSearchParams(window.location.search);

const accessToken = hashParams.get('access_token') || searchParams.get('access_token');
const type = hashParams.get('type') || searchParams.get('type');
```

---

## 📊 Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| Redirects to login | URL not whitelisted | Add to Supabase redirect URLs |
| "Invalid token" error | Token expired (1 hour) | Request new reset email |
| No token in URL | Email template wrong | Check Supabase email template |
| Token in wrong format | Hash vs query params | Update code to check both |
| CORS error | Domain not allowed | Add domain to Supabase settings |

---

## 🎯 Expected Behavior

### Correct Flow:
```
1. User clicks "Forgot password?" on login
   ↓
2. Enters email, clicks "Send Reset Link"
   ↓
3. Supabase sends email with link like:
   http://localhost:5173/#/reset-password#access_token=xxx&type=recovery
   ↓
4. User clicks link in email
   ↓
5. Browser opens: http://localhost:5173/#/reset-password
   ↓
6. ResetPassword component detects token in URL
   ↓
7. Shows password reset form
   ↓
8. User enters new password
   ↓
9. Password updated in Supabase
   ↓
10. Redirects to login
```

### Current (Broken) Flow:
```
1. User clicks "Forgot password?" on login ✅
   ↓
2. Enters email, clicks "Send Reset Link" ✅
   ↓
3. Supabase sends email ✅
   ↓
4. User clicks link in email ✅
   ↓
5. Redirects to login page ❌ (PROBLEM HERE)
```

---

## 🚀 Next Steps

1. **Whitelist URLs in Supabase** (do this first!)
2. **Apply code fixes** (I'll do this next)
3. **Test the flow** (follow testing steps above)
4. **Check logs if it fails** (browser console + Supabase logs)

---

**I'll now update the code to handle token detection more robustly...**
