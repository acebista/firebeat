# 🔑 SUPABASE CONFIGURATION - PRODUCTION CHECKLIST

**Date:** 2025-11-24  
**Status:** CRITICAL CONFIGURATION REVIEW  
**Priority:** PRODUCTION BLOCKER  

---

## 🚨 CRITICAL ISSUE FOUND!

### **Your Current Configuration:**

```typescript
// lib/supabase.ts
const supabaseUrl = 'https://qlosefnvwvmqeebfqdcg.supabase.co';
const supabaseKey = 'sb_publishable_GmOKGTI8IFmv9q-KFJoICg_397GdY1g'; // ⚠️ WRONG!
```

### **The Problem:**

**Your key starts with:** `sb_publishable_`  
**Should start with:** `eyJ...` (JWT format)

This is **NOT** the correct Supabase anon key format!

---

## ✅ CORRECT SUPABASE KEYS

### **What You Need:**

1. **Supabase URL** ✅ (You have this)
   ```
   https://qlosefnvwvmqeebfqdcg.supabase.co
   ```

2. **Supabase Anon Key** ❌ (This is wrong!)
   - Should be a **JWT token** (very long)
   - Starts with `eyJ`
   - Example: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFsb3NlZm52d3ZtcWVlYmZxZGNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTg...`

---

## 📍 WHERE TO FIND THE CORRECT KEYS

### **Step 1: Go to Supabase Dashboard**
1. Visit: https://supabase.com/dashboard
2. Login to your account
3. Select your project: `qlosefnvwvmqeebfqdcg`

### **Step 2: Get API Keys**
1. Click **Settings** (gear icon) in left sidebar
2. Click **API** under Project Settings
3. You'll see:

```
Project URL
https://qlosefnvwvmqeebfqdcg.supabase.co

Project API keys

anon public
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFsb3NlZm52d3ZtcWVlYmZxZGNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTg...
[Copy button]

service_role secret
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFsb3NlZm52d3ZtcWVlYmZxZGNnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY5OC4uLg==
[Copy button]
```

### **Step 3: Copy the Correct Key**
- **For frontend (your app):** Use `anon public` key
- **For backend/admin:** Use `service_role secret` key (NEVER expose this!)

---

## 🔧 HOW TO FIX

### **Option 1: Update lib/supabase.ts Directly**

```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qlosefnvwvmqeebfqdcg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFsb3NlZm52d3ZtcWVlYmZxZGNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTg...'; // ← PASTE YOUR REAL ANON KEY HERE

export const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
    }
});
```

### **Option 2: Use Environment Variables (RECOMMENDED)**

1. **Create `.env` file:**
```bash
# .env
VITE_SUPABASE_URL=https://qlosefnvwvmqeebfqdcg.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFsb3NlZm52d3ZtcWVlYmZxZGNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTg...
```

2. **Update lib/supabase.ts:**
```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables!');
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
    }
});
```

3. **Add .env to .gitignore:**
```bash
# .gitignore
.env
.env.local
```

---

## 🔍 VERIFY YOUR KEYS

### **Check Key Format:**

**CORRECT Anon Key:**
```
✅ Starts with: eyJ
✅ Very long (500+ characters)
✅ Contains dots: eyJ...abc.def...xyz
✅ Is a JWT token
```

**INCORRECT Key:**
```
❌ Starts with: sb_publishable_
❌ Short (< 100 characters)
❌ Not a JWT token
```

### **Test Your Keys:**

Run this in browser console:
```javascript
// Test if key is valid JWT
const key = 'YOUR_KEY_HERE';
console.log('Starts with eyJ:', key.startsWith('eyJ'));
console.log('Has dots:', key.includes('.'));
console.log('Length:', key.length);
console.log('Is JWT:', key.startsWith('eyJ') && key.includes('.') && key.length > 100);
```

Should output:
```
Starts with eyJ: true
Has dots: true
Length: 500+ (varies)
Is JWT: true
```

---

## 🎯 ADDITIONAL SUPABASE SETTINGS

### **1. Authentication Settings**

Go to: **Authentication** → **Settings**

**Required Settings:**
```
✅ Enable Email Provider
✅ Confirm email: OFF (for development) or ON (for production)
✅ Enable email confirmations: Your choice
✅ Secure email change: ON
✅ Enable phone provider: OFF (unless needed)
```

### **2. URL Configuration**

Go to: **Authentication** → **URL Configuration**

**Site URL:**
```
Development: http://localhost:5173
Production: https://yourdomain.com
```

**Redirect URLs (Whitelist):**
```
http://localhost:5173/**
http://localhost:5173/reset-password
https://yourdomain.com/**
https://yourdomain.com/reset-password
```

### **3. Email Templates**

Go to: **Authentication** → **Email Templates**

**Confirm signup:**
```html
<h2>Confirm your signup</h2>
<p>Follow this link to confirm your email:</p>
<p><a href="{{ .ConfirmationURL }}">Confirm your email</a></p>
```

**Reset password:**
```html
<h2>Reset Password</h2>
<p>Follow this link to reset your password:</p>
<p><a href="{{ .ConfirmationURL }}">Reset Password</a></p>
```

### **4. JWT Settings**

Go to: **Settings** → **API** → **JWT Settings**

**JWT expiry:**
```
Default: 3600 (1 hour)
Recommended: 3600 (1 hour)
Max: 604800 (1 week)
```

---

## 🔐 SECURITY BEST PRACTICES

### **DO:**
- ✅ Use environment variables for keys
- ✅ Add `.env` to `.gitignore`
- ✅ Use `anon` key in frontend
- ✅ Use `service_role` key ONLY in backend
- ✅ Enable RLS (Row Level Security) on all tables
- ✅ Whitelist redirect URLs

### **DON'T:**
- ❌ Commit keys to git
- ❌ Use `service_role` key in frontend
- ❌ Share keys publicly
- ❌ Use same keys for dev/prod
- ❌ Disable RLS in production

---

## 🧪 TEST YOUR CONFIGURATION

### **Test 1: Check Supabase Connection**

```typescript
// Test in browser console
import { supabase } from './lib/supabase';

const test = async () => {
  const { data, error } = await supabase.auth.getSession();
  console.log('Session:', data);
  console.log('Error:', error);
};

test();
```

**Expected:**
```
Session: { session: null } // If not logged in
Error: null
```

### **Test 2: Test Login**

```typescript
const testLogin = async () => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'test@example.com',
    password: 'password123'
  });
  console.log('Login result:', data);
  console.log('Login error:', error);
};

testLogin();
```

**Expected:**
```
Login result: { user: {...}, session: {...} }
Login error: null
```

---

## 📊 CONFIGURATION CHECKLIST

### **Supabase Dashboard:**
- [ ] Got correct `anon` key from Settings → API
- [ ] Key starts with `eyJ`
- [ ] Key is 500+ characters long
- [ ] Enabled Email authentication
- [ ] Set Site URL
- [ ] Whitelisted redirect URLs
- [ ] Configured email templates
- [ ] Set JWT expiry

### **Your Code:**
- [ ] Updated `lib/supabase.ts` with correct key
- [ ] OR created `.env` with correct key
- [ ] Added `.env` to `.gitignore`
- [ ] Tested connection
- [ ] Tested login
- [ ] No console errors

---

## 🚨 COMMON ISSUES

### **Issue 1: "Invalid API key"**
**Cause:** Wrong key format  
**Fix:** Get correct `anon` key from Supabase dashboard

### **Issue 2: "Failed to fetch"**
**Cause:** Wrong URL or network issue  
**Fix:** Verify URL is correct, check internet connection

### **Issue 3: "Email not confirmed"**
**Cause:** Email confirmation required  
**Fix:** Disable email confirmation in Auth settings (dev) or confirm email (prod)

### **Issue 4: "Invalid login credentials"**
**Cause:** Wrong email/password or user doesn't exist  
**Fix:** Check credentials, verify user exists in Auth → Users

---

## 🎯 WHAT YOU NEED TO DO NOW

### **Immediate Action:**

1. **Go to Supabase Dashboard:**
   - https://supabase.com/dashboard
   - Select project: `qlosefnvwvmqeebfqdcg`

2. **Get Correct Anon Key:**
   - Settings → API
   - Copy the `anon public` key
   - Should start with `eyJ`

3. **Update Your Code:**
   ```typescript
   // lib/supabase.ts
   const supabaseKey = 'eyJ...'; // ← PASTE YOUR REAL KEY HERE
   ```

4. **Restart Dev Server:**
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```

5. **Test Login:**
   - Should work now!

---

## 📝 EXAMPLE CORRECT CONFIGURATION

```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

// ✅ CORRECT FORMAT
const supabaseUrl = 'https://qlosefnvwvmqeebfqdcg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFsb3NlZm52d3ZtcWVlYmZxZGNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTg0MzY4NjAsImV4cCI6MjAxNDAxMjg2MH0.XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';

export const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        flowType: 'pkce', // ← Add this for better security
    }
});
```

---

## 🎉 AFTER FIXING

Once you have the correct key:

- ✅ Login will work
- ✅ No more auth errors
- ✅ Session will persist
- ✅ Auto-refresh will work
- ✅ Production ready

---

**GET YOUR CORRECT ANON KEY FROM SUPABASE DASHBOARD NOW!** 🔑

**Settings → API → Copy "anon public" key** ✅

---

**Created:** 2025-11-24  
**Priority:** CRITICAL  
**Action Required:** Get correct Supabase anon key  
**Time to Fix:** 2 minutes  
