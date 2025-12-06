# CORS Error - Complete Solution Guide

## The Problem (Still Happening)

```
CORS Policy blocked request to Supabase
Failed to fetch at auth/v1/token endpoint
```

**Why it's still happening:**
- Supabase backend doesn't accept requests from `http://localhost:5173`
- This is a **backend configuration**, not code
- Code changes alone won't fix this

---

## Solution Options

### ✅ OPTION 1: Disable CORS Requirement (For Development Only)

**Fastest solution - takes 5 minutes:**

1. **Create a proxy server** that bypasses CORS:

```bash
# Install cors-anywhere or simple-cors-proxy
npm install cors-anywhere

# Create proxy.js in project root
cat > proxy.js << 'EOF'
const cors = require('cors');
const https = require('https');

const app = require('express')();

app.use(cors());

app.all('*', (req, res) => {
  const url = req.originalUrl.slice(1); // Remove leading /
  https.get(url, response => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    response.pipe(res);
  });
});

app.listen(3001, () => console.log('CORS proxy running on :3001'));
EOF
```

2. **Update Supabase client** to use proxy:

```typescript
// lib/supabase.ts
const supabaseUrl = process.env.VITE_SUPABASE_URL ?? 
  'http://localhost:3001/https://qlosefnvwvmqeebfqdcg.supabase.co';
```

---

### ✅ OPTION 2: Use Environment Variables (Recommended for Development)

**This is the proper development approach:**

1. **Create `.env.local`** in project root:

```env
VITE_SUPABASE_URL=https://qlosefnvwvmqeebfqdcg.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFsb3NlZm52d3ZtcWVlYmZxZGNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1Nzc3ODIsImV4cCI6MjA3OTE1Mzc4Mn0.Jqrle6lGJmerRSCQkmpoEmz_ZV922TvwjLV5h-uFS7Y
VITE_CORS_PROXY=http://localhost:3001
```

2. **Update supabase.ts**:

```typescript
// lib/supabase.ts
const isDev = import.meta.env.DEV;
const supabaseUrl = isDev 
  ? import.meta.env.VITE_CORS_PROXY
  : import.meta.env.VITE_SUPABASE_URL;

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  }
});
```

---

### ✅ OPTION 3: Use Supabase Dashboard (Permanent Solution)

**This is the proper production approach:**

1. Log in to [app.supabase.com](https://app.supabase.com)
2. Select project: `qlosefnvwvmqeebfqdcg`
3. Go to: **Authentication** → **URL Configuration** (or **Settings** → **API**)
4. Under **Allowed Origins**, add:
   ```
   http://localhost:5173
   http://localhost:5174
   http://127.0.0.1:5173
   http://localhost:3000
   ```
5. Click **Save**
6. Wait 3-5 minutes for propagation
7. Hard refresh browser (Cmd+Shift+R)

---

### ✅ OPTION 4: Use Different Authentication Method

**If above options don't work:**

Modify `AuthProvider.tsx` to catch CORS errors and retry:

```typescript
const login = useCallback(async (email: string, password: string) => {
  try {
    dispatch({ type: 'SET_LOADING', message: 'Signing in...' });

    let data, error;
    
    try {
      // Try normal auth first
      const result = await supabase.auth.signInWithPassword({ email, password });
      data = result.data;
      error = result.error;
    } catch (corsError) {
      // If CORS error, show helpful message
      if (corsError instanceof Error && corsError.message.includes('CORS')) {
        console.error('CORS error detected - trying workaround...');
        dispatch({ 
          type: 'SET_ERROR', 
          error: new Error('Authentication service temporarily unavailable. Please check browser console for details.')
        });
        throw corsError;
      }
      throw corsError;
    }

    if (error) throw error;

    // ... rest of login logic
  } catch (error) {
    console.error('[AuthProvider] Login error:', error);
    dispatch({ type: 'SET_ERROR', error });
    throw error;
  }
}, []);
```

---

## Quick Fix: Use CORS Proxy (Works Right Now)

### Step 1: Install dependencies

```bash
npm install express cors
```

### Step 2: Create proxy server

Create file: `/proxy.js`

```javascript
const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// Enable CORS for all routes
app.use(cors());

// Proxy Supabase requests
app.use('/supabase', createProxyMiddleware({
  target: 'https://qlosefnvwvmqeebfqdcg.supabase.co',
  changeOrigin: true,
  pathRewrite: {
    '^/supabase': '',
  },
  onError: (err, req, res) => {
    console.error('Proxy error:', err);
    res.status(500).json({ error: 'Proxy error' });
  }
}));

const PORT = process.env.PROXY_PORT || 3001;
app.listen(PORT, () => {
  console.log(`🔄 CORS Proxy running on http://localhost:${PORT}`);
  console.log(`   Forwarding to Supabase: https://qlosefnvwvmqeebfqdcg.supabase.co`);
});
```

### Step 3: Update supabase client

```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const isDev = import.meta.env.DEV;

// In development, use local proxy to bypass CORS
const supabaseUrl = isDev 
  ? 'http://localhost:3001/supabase'
  : import.meta.env.VITE_SUPABASE_URL ?? 'https://qlosefnvwvmqeebfqdcg.supabase.co';

const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFsb3NlZm52d3ZtcWVlYmZxZGNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1Nzc3ODIsImV4cCI6MjA3OTE1Mzc4Mn0.Jqrle6lGJmerRSCQkmpoEmz_ZV922TvwjLV5h-uFS7Y';

export const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
    }
});
```

### Step 4: Start both servers

```bash
# Terminal 1: Start proxy
node proxy.js

# Terminal 2: Start dev server
npm run dev
```

### Step 5: Test login

- Navigate to: `http://localhost:5173`
- Try logging in
- Should work without CORS errors!

---

## Which Option to Choose?

| Option | Setup Time | For Production | Best For |
|--------|-----------|-----------------|----------|
| 1 (CORS Proxy) | 5 min | ❌ No | Quick dev testing |
| 2 (Env Variables) | 5 min | ⚠️ Partial | Development workflow |
| 3 (Supabase Dashboard) | 5 min + wait | ✅ Yes | Long-term solution |
| 4 (Error Handling) | 10 min | ⚠️ Partial | Backup solution |

**Recommendation:**
- **For now**: Use Option 1 (CORS Proxy) - works immediately
- **For permanent**: Use Option 3 (Dashboard) + Option 2 (Env Variables)

---

## Test After Fix

```javascript
// Paste in browser console (F12):
console.log('🧪 Testing authentication...');

// Test if proxy is working
fetch('http://localhost:3001/supabase/auth/v1/health')
  .then(r => r.json())
  .then(d => console.log('✅ Proxy working:', d))
  .catch(e => console.log('❌ Proxy failed:', e.message));
```

---

## Verification Checklist

- [ ] Chosen solution method
- [ ] Installed required packages (if applicable)
- [ ] Updated configuration files
- [ ] Started necessary servers
- [ ] Browser shows no CORS errors
- [ ] Can log in successfully
- [ ] Dispatch planner loads
- [ ] Features are accessible

---

## Still Having Issues?

1. **Check port conflicts**: 
   ```bash
   lsof -i :3001
   lsof -i :5173
   ```

2. **Clear all caches**:
   - Browser cache (Cmd+Shift+Delete)
   - Hard refresh (Cmd+Shift+R)
   - npm cache: `npm cache clean --force`

3. **Restart everything**:
   ```bash
   # Kill all node processes
   pkill -f node
   
   # Reinstall deps
   rm -rf node_modules package-lock.json
   npm install
   
   # Start fresh
   node proxy.js  # Terminal 1
   npm run dev    # Terminal 2
   ```

4. **Check network tab**:
   - Open DevTools (F12)
   - Network tab
   - Look for OPTIONS request (preflight)
   - Check response headers for Access-Control headers

---

## Production Deployment

When deploying to production:

1. **Use Option 3**: Add your production URL to Supabase CORS whitelist
2. **Update env variables**: 
   ```env
   VITE_SUPABASE_URL=https://your-domain.com
   VITE_SUPABASE_ANON_KEY=your-key
   ```
3. **Remove proxy code**: Delete proxy.js from production build
4. **Test on staging**: Verify login works before going live

---

**Current Status**: Ready to implement chosen solution ⏳

Which option would you like to implement?
