# 🚨 Login Troubleshooting Guide

**Issue:** Login stopped working entirely

---

## 🔍 Quick Diagnostics

### Step 1: Check Browser Console

Open browser console (F12) and look for errors. Common issues:

#### Error 1: "Invalid login credentials"
**Cause:** Wrong email or password  
**Solution:** 
- Verify email is correct
- Check password (case-sensitive)
- Try password reset if forgotten

#### Error 2: "Database query timeout" or "permission denied"
**Cause:** RLS policies blocking access  
**Solution:** Run `CLEANUP_DUPLICATE_POLICIES.sql`

#### Error 3: "Network error" or "Failed to fetch"
**Cause:** Supabase connection issue  
**Solution:**
- Check internet connection
- Verify Supabase is online
- Check Supabase URL in `lib/supabase.ts`

#### Error 4: Page just refreshes or nothing happens
**Cause:** JavaScript error preventing login  
**Solution:** Check console for errors

---

## 🧪 Test Login Step-by-Step

### Test 1: Verify Supabase Connection

1. Open browser console
2. Run this command:
```javascript
const { data, error } = await supabase.auth.getSession();
console.log('Session:', data, 'Error:', error);
```

**Expected:** Should return session data or null (no error)

### Test 2: Test Login Function

1. Open browser console
2. Run this command:
```javascript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'your-email@example.com',
  password: 'your-password'
});
console.log('Login result:', data, 'Error:', error);
```

**Expected:** Should return user data if credentials are correct

### Test 3: Check User Profile Loading

After successful login, check console for:
```
Loading user profile for: [user-id]
User profile query result: {data: {...}, error: null}
User profile loaded successfully: {...}
```

**If you see errors here:** RLS policy issue

---

## 🔧 Common Fixes

### Fix 1: Clear Browser Cache

1. Open DevTools (F12)
2. Right-click refresh button
3. Select "Empty Cache and Hard Reload"
4. Try logging in again

### Fix 2: Clear Supabase Session

```javascript
// Run in browser console
await supabase.auth.signOut();
localStorage.clear();
sessionStorage.clear();
// Refresh page
location.reload();
```

### Fix 3: Verify Supabase Configuration

Check `lib/supabase.ts`:
```typescript
const supabaseUrl = 'https://qlosefnvwvmqeebfqdcg.supabase.co';
const supabaseKey = 'sb_publishable_GmOKGTI8IFmv9q-KFJoICg_397GdY1g';
```

**Verify:**
- URL is correct
- Key is correct
- No typos

### Fix 4: Check RLS Policies

Run in Supabase SQL Editor:
```sql
-- Check if policies exist
SELECT tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename = 'users';
```

**Should see:** At least one policy allowing authenticated users

**If no policies:** Run `CLEANUP_DUPLICATE_POLICIES.sql`

---

## 🐛 Specific Error Solutions

### "Auth initialization timeout"

**Cause:** Auth provider timing out  
**Solution:**
1. Check network speed
2. Verify Supabase is accessible
3. Try refreshing page

### "User profile query result: {data: null, error: {...}}"

**Cause:** RLS policy blocking or user doesn't exist  
**Solution:**
1. Run `CLEANUP_DUPLICATE_POLICIES.sql`
2. Verify user exists in Supabase dashboard
3. Check RLS policies

### "Failed to save user" or "permission denied"

**Cause:** RLS policies too restrictive  
**Solution:** Run `CLEANUP_DUPLICATE_POLICIES.sql`

### Login button does nothing

**Cause:** JavaScript error  
**Solution:**
1. Check console for errors
2. Verify form is submitting
3. Check network tab for API calls

---

## 🔄 Reset Everything (Nuclear Option)

If nothing else works:

### Step 1: Clear All Local Data
```javascript
// Run in console
localStorage.clear();
sessionStorage.clear();
await supabase.auth.signOut();
```

### Step 2: Refresh Page
```javascript
location.reload();
```

### Step 3: Try Login Again

---

## 📊 Login Flow Checklist

When you try to login, this should happen:

- [ ] Form submits (check Network tab)
- [ ] API call to Supabase auth (check Network tab)
- [ ] Supabase returns user data
- [ ] Auth provider loads user profile
- [ ] User profile query succeeds
- [ ] User state updates
- [ ] Redirect to dashboard

**Find where it's failing and focus on that step.**

---

## 🆘 Emergency Login Test

Create a test file to isolate the issue:

**Create `test-login.html` in project root:**
```html
<!DOCTYPE html>
<html>
<head>
    <title>Login Test</title>
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
</head>
<body>
    <h1>Login Test</h1>
    <input type="email" id="email" placeholder="Email">
    <input type="password" id="password" placeholder="Password">
    <button onclick="testLogin()">Test Login</button>
    <div id="result"></div>

    <script>
        const supabase = window.supabase.createClient(
            'https://qlosefnvwvmqeebfqdcg.supabase.co',
            'sb_publishable_GmOKGTI8IFmv9q-KFJoICg_397GdY1g'
        );

        async function testLogin() {
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            console.log('Testing login...');
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });
            
            document.getElementById('result').innerHTML = 
                '<pre>' + JSON.stringify({ data, error }, null, 2) + '</pre>';
        }
    </script>
</body>
</html>
```

**Open this file in browser and test login.**

**If this works:** Issue is in React app  
**If this fails:** Issue is with Supabase credentials or RLS

---

## 📞 What to Check Next

Please provide:

1. **Console errors** (exact error messages)
2. **Network tab** (any failed requests?)
3. **What happens** when you click login?
   - Nothing?
   - Error message?
   - Page refresh?
   - Stuck loading?

This will help identify the exact issue!

---

## 🔍 Debug Mode

Add this to see detailed logs:

**In `services/auth.tsx`, add more logging:**
```typescript
const login = async (email: string, password?: string) => {
  console.log('🔐 Login attempt:', email);
  if (!password) throw new Error("Password required");
  
  console.log('📡 Calling Supabase auth...');
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  
  console.log('📥 Supabase response:', { data, error });
  if (error) {
    console.error('❌ Login error:', error);
    throw error;
  }
  console.log('✅ Login successful');
};
```

This will show exactly where the login process fails.

---

**Please share the console errors and I can provide a specific fix!**
