# 🔍 MANUAL TESTING INSTRUCTIONS - Multi-Window Login Issue

**Date:** 2025-11-24  
**Test Scenario:** Login in one window, try to login in another  

---

## 🎯 EXACT STEPS TO REPRODUCE

### **Test 1: Fresh Login (Should Work)**

1. **Open Chrome** (normal window, not incognito)

2. **Go to:** http://localhost:5175

3. **Open DevTools:**
   - Press **F12**
   - Go to **Console** tab

4. **Clear Storage:**
   ```javascript
   localStorage.clear();
   sessionStorage.clear();
   location.reload();
   ```

5. **Wait for page to reload**

6. **Login with:**
   - Email: `ace.bista@gmail.com`
   - Password: `Sachu123!`

7. **Watch Console - Should see:**
   ```
   🧹 Doing immediate local cleanup before login...
   Clearing all storage on logout...
   ✅ localStorage cleared
   ✅ sessionStorage cleared
   Storage cleared successfully
   ✅ Local cleanup complete, attempting fresh login...
   ✅ Sign in successful, loading profile...
   ✅ Profile loaded successfully
   ```

8. **Expected Result:** Login succeeds, redirects to dashboard

---

### **Test 2: Multi-Window Login (The Problem)**

1. **Keep Window 1 open** (you're logged in)

2. **Open NEW Chrome window** (Cmd+N or Ctrl+N)

3. **Go to:** http://localhost:5175

4. **Open DevTools in new window:**
   - Press **F12**
   - Go to **Console** tab

5. **Check what you see:**
   - Are you already logged in? (redirected to dashboard)
   - Or do you see login page?

6. **If you see login page, try to login again:**
   - Email: `ace.bista@gmail.com`
   - Password: `Sachu123!`

7. **Watch Console - What do you see?**
   - Same success messages?
   - Or errors?
   - Timeout?

8. **What happens?**
   - Does it work?
   - Does it fail?
   - Does it hang?

---

## 🔍 WHAT TO LOOK FOR

### **In Console Logs:**

**GOOD SIGNS:**
```
✅ 🧹 Doing immediate local cleanup before login...
✅ Storage cleared successfully
✅ Local cleanup complete, attempting fresh login...
✅ Sign in successful, loading profile...
✅ Profile loaded successfully
```

**BAD SIGNS:**
```
❌ Error: timeout
❌ Failed to fetch
❌ 400 Bad Request
❌ 401 Unauthorized
❌ Network error
❌ CORS error
❌ Session already exists
```

### **In Network Tab:**

1. **Go to Network tab** in DevTools
2. **Filter:** `token`
3. **Look for:** `POST https://qlosefnvwvmqeebfqdcg.supabase.co/auth/v1/token?grant_type=password`
4. **Check:**
   - Status code (should be 200)
   - Response (should have user and session)
   - If 400/401/500, click on it and check Response tab

---

## 📊 DIAGNOSTIC SCRIPT

### **Option 1: Use Debug Script**

1. **Copy the entire content of `DEBUG_AUTH.js`**
2. **Paste in Console**
3. **Press Enter**
4. **Run:**
   ```javascript
   await window.debugAuth.testLogin("ace.bista@gmail.com", "Sachu123!")
   ```
5. **Observe output**

### **Option 2: Manual Checks**

**Check Storage:**
```javascript
// See what's in storage
for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    console.log(key, localStorage.getItem(key)?.substring(0, 50));
}
```

**Check Supabase Session:**
```javascript
// Import and check session
const { supabase } = await import('./lib/supabase.js');
const { data, error } = await supabase.auth.getSession();
console.log('Session:', data);
console.log('Error:', error);
```

**Test Login Directly:**
```javascript
// Clear and login
localStorage.clear();
sessionStorage.clear();

const { supabase } = await import('./lib/supabase.js');
const result = await supabase.auth.signInWithPassword({
    email: 'ace.bista@gmail.com',
    password: 'Sachu123!'
});

console.log('Result:', result);
```

---

## 🎯 SPECIFIC THINGS TO CHECK

### **1. Check Supabase Key**

```javascript
// Check if correct key is loaded
const { supabase } = await import('./lib/supabase.js');
console.log('Supabase URL:', supabase.supabaseUrl);
console.log('Key starts with:', supabase.supabaseKey?.substring(0, 10));
// Should show: "eyJhbGciOi"
```

### **2. Check for Existing Session**

```javascript
// Before login, check if session exists
const { supabase } = await import('./lib/supabase.js');
const { data } = await supabase.auth.getSession();
console.log('Existing session:', data.session);
// Should be null if not logged in
```

### **3. Check Storage Keys**

```javascript
// Check for Supabase keys
const keys = [];
for (let i = 0; i < localStorage.length; i++) {
    keys.push(localStorage.key(i));
}
console.log('Storage keys:', keys);
// Look for: sb-qlosefnvwvmqeebfqdcg-auth-token
```

---

## 📝 WHAT TO REPORT

Please capture and share:

### **1. Console Logs**

Copy ALL console output from:
- First login attempt
- Second window login attempt

### **2. Network Errors**

If login fails:
- Open Network tab
- Find the failed request
- Right-click → Copy → Copy as cURL
- Share the cURL command (remove password first!)

### **3. Storage State**

Before and after login:
```javascript
// Run this before login
console.log('BEFORE LOGIN:');
for (let i = 0; i < localStorage.length; i++) {
    console.log(localStorage.key(i));
}

// Login...

// Run this after login
console.log('AFTER LOGIN:');
for (let i = 0; i < localStorage.length; i++) {
    console.log(localStorage.key(i));
}
```

### **4. Exact Error Message**

If you see an error banner:
- Screenshot it
- Copy the exact text
- Check console for more details

---

## 🚨 COMMON SCENARIOS

### **Scenario A: Second window auto-logs in**

**Symptoms:**
- Open second window
- Automatically redirected to dashboard
- No login needed

**This means:**
- Session is shared across windows (normal browser behavior)
- This is actually CORRECT behavior
- You're already logged in

**Solution:**
- This is not a problem!
- Supabase sessions are shared across tabs/windows
- This is expected and secure

---

### **Scenario B: Second window shows login, but fails**

**Symptoms:**
- Open second window
- See login page
- Try to login
- Fails or hangs

**This means:**
- Session not being recognized
- Or cleanup is too aggressive

**Check:**
1. What's in localStorage in second window?
2. Is there a session in first window?
3. What error appears?

---

### **Scenario C: Login works in second window**

**Symptoms:**
- Open second window
- Login succeeds
- Both windows now logged in

**This means:**
- Everything is working correctly!
- Session is now shared

**This is CORRECT behavior**

---

## 🎯 EXPECTED BEHAVIOR

### **Normal Supabase Behavior:**

1. **Login in Window 1:**
   - Session stored in localStorage
   - User logged in

2. **Open Window 2:**
   - **Should auto-login** (session shared)
   - OR if session expired, show login page

3. **Login in Window 2:**
   - Should work
   - Session updates in both windows

### **What's NOT Normal:**

- ❌ Login fails in second window
- ❌ Login hangs/times out
- ❌ Error messages
- ❌ Need to clear storage manually

---

## 💡 QUICK FIXES TO TRY

### **Fix 1: Clear Everything**

```javascript
localStorage.clear();
sessionStorage.clear();
// Close ALL browser windows
// Open fresh window
// Try login
```

### **Fix 2: Use Emergency Cleanup**

```javascript
window.emergencyStorageClear();
location.reload();
```

### **Fix 3: Check Browser Extensions**

- Disable ALL extensions
- Try login again
- Some extensions block storage access

### **Fix 4: Try Incognito**

- Open incognito window
- Try login
- If it works, it's a storage/extension issue

---

## 📊 DECISION TREE

```
Open second window
    ↓
Do you see login page or dashboard?
    ↓
├─ Dashboard → ✅ CORRECT (auto-logged in)
│
└─ Login page
    ↓
    Try to login
        ↓
    ├─ Success → ✅ CORRECT (login works)
    │
    ├─ Fails with error → ❌ PROBLEM
    │   └─ Check console for error
    │       └─ Report error message
    │
    └─ Hangs/timeout → ❌ PROBLEM
        └─ Check Network tab
            └─ Report failed request
```

---

## 🎯 WHAT I NEED FROM YOU

Please run the tests above and tell me:

1. **What happens in Window 1?**
   - Login succeeds?
   - What page do you land on?

2. **What happens in Window 2?**
   - Do you see login page or dashboard?
   - If login page, does login work?
   - If it fails, what's the exact error?

3. **Console logs from both windows**
   - Copy and paste all logs
   - Especially any errors

4. **Network tab**
   - Any failed requests?
   - What status codes?

---

**Let's diagnose this together!** 🔍

Run the tests and share the results!
