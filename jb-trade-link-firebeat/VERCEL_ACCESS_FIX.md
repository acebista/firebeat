# Vercel Deployment - Access Issue Diagnosis & Fix

## Problem
User cannot access `/admin/migration` on Vercel - gets redirected to login page even after logging in.

## Root Cause Analysis

### Likely Issues
1. **Environment Variables Not Set**: Supabase credentials may not be configured on Vercel
2. **Session Persistence Issue**: localStorage/sessionStorage might not be persisting across page loads
3. **CORS Configuration**: Supabase might not be configured to accept requests from firebeat-seven.vercel.app
4. **Supabase Project Mismatch**: Deploying with different Supabase project credentials

### Symptoms
- Login appears to work
- Navigating to protected routes redirects to login
- Session doesn't persist on page refresh
- Different Supabase project in production vs development

## Solution Steps

### Step 1: Verify Vercel Environment Variables

Go to Vercel dashboard → firebeat-seven → Settings → Environment Variables

**Required Variables**:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

If not set, add them and redeploy.

### Step 2: Enable CORS on Supabase

1. Go to Supabase Dashboard → Your Project
2. Settings → API
3. Under "CORS", add allowed origins:
   ```
   https://firebeat-seven.vercel.app
   http://localhost:5173
   ```

### Step 3: Clear Browser Storage & Session

The user should:
1. Open browser DevTools (F12)
2. Go to Application tab
3. Clear all cookies for firebeat-seven.vercel.app
4. Clear all localStorage
5. Close browser completely
6. Open fresh browser window
7. Visit https://firebeat-seven.vercel.app

### Step 4: Check Supabase Connection Status

Add a test endpoint by creating this temporary file to verify connection:

```typescript
// pages/Test.tsx - Add this temporarily
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export const SupabaseConnectionTest: React.FC = () => {
  const [status, setStatus] = useState<string>('Testing...');
  const [sessionInfo, setSessionInfo] = useState<any>(null);

  useEffect(() => {
    const testConnection = async () => {
      try {
        // Test 1: Check if Supabase is initialized
        console.log('Supabase URL:', supabase.supabaseUrl);
        
        // Test 2: Get current session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          setStatus(`❌ Error: ${error.message}`);
          return;
        }

        if (session) {
          setSessionInfo(session);
          setStatus('✅ Session found');
        } else {
          setStatus('⚠️ No session found - need to login');
        }
      } catch (err: any) {
        setStatus(`❌ Connection error: ${err.message}`);
      }
    };

    testConnection();
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h2>Supabase Connection Test</h2>
      <p><strong>Status:</strong> {status}</p>
      {sessionInfo && (
        <details>
          <summary>Session Details</summary>
          <pre>{JSON.stringify(sessionInfo, null, 2)}</pre>
        </details>
      )}
      <p style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
        URL: {supabase.supabaseUrl}
      </p>
    </div>
  );
};
```

Visit https://firebeat-seven.vercel.app/#/test to check connection.

## Implementation Fix

### Fix 1: Improve Session Persistence

Update `lib/supabase.ts` to use custom storage:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? 'https://qlosefnvwvmqeebfqdcg.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';

// Custom storage with fallback
const getStorage = () => {
  if (typeof window === 'undefined') return null;
  
  try {
    // Test if localStorage is available
    const test = '__test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return localStorage;
  } catch {
    // Fallback to in-memory storage
    const memoryStorage: Record<string, string> = {};
    return {
      getItem: (key: string) => memoryStorage[key] || null,
      setItem: (key: string, value: string) => { memoryStorage[key] = value; },
      removeItem: (key: string) => { delete memoryStorage[key]; },
    } as Storage;
  }
};

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: getStorage(),
  }
});
```

### Fix 2: Update App.tsx - Add Session Recovery

```typescript
// Add this useEffect to App component
useEffect(() => {
  const recoverSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // Session exists, ensure user is loaded
        await useUserStore.getState().rehydrateFromSession();
      }
    } catch (err) {
      console.error('Session recovery error:', err);
    }
  };

  recoverSession();
}, []);
```

### Fix 3: Vercel Configuration

Create `vercel.json` in project root:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "env": {
    "VITE_SUPABASE_URL": "@supabase_url",
    "VITE_SUPABASE_ANON_KEY": "@supabase_anon_key"
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=0, must-revalidate"
        }
      ]
    }
  ]
}
```

### Fix 4: Update .env.example

Ensure all developers know what environment variables are needed:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Optional
VITE_ENABLE_DEV_REGISTRATION=false
```

## Verification Checklist

After implementing fixes:

- [ ] Vercel environment variables are set
- [ ] Supabase CORS includes Vercel domain
- [ ] Clear browser cache/cookies
- [ ] Test login flow
- [ ] Navigate to /admin/migration
- [ ] Refresh page - should stay on migration page
- [ ] Close and reopen browser - should still be logged in
- [ ] Test different user roles
- [ ] Check browser console for errors

## Quick Debug Commands

In browser console:
```javascript
// Check if user is in localStorage
Object.keys(localStorage).filter(k => k.includes('user') || k.includes('auth'))

// Check Supabase session
localStorage.getItem('sb-qlosefnvwvmqeebfqdcg-auth-token')

// Check if Zustand store has user
// (requires accessing window object if exposed)
```

## Contact Supabase Support

If issues persist:
1. Go to Supabase dashboard
2. Send logs to support
3. Include:
   - Vercel project URL
   - Supabase project ref
   - Error messages from browser console
   - Steps to reproduce

---

**Status**: Awaiting environment variable verification and CORS configuration on Supabase
