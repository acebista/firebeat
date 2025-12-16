# Vercel Deployment Setup Guide

## Critical Issue: Session Redirects

If you're getting redirected to login after logging in on Vercel, it's because **environment variables are not set**.

## Required Environment Variables

You **MUST** set these on Vercel for authentication to work:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

⚠️ **WITHOUT THESE, THE APP WILL NOT AUTHENTICATE**

## How to Find Your Supabase Credentials

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Click **Settings** → **API**
4. Copy:
   - **Project URL** → Use as `VITE_SUPABASE_URL`
   - **Anon (public)** → Use as `VITE_SUPABASE_ANON_KEY`

## How to Set Environment Variables on Vercel

### Option 1: Vercel Dashboard

1. Go to https://vercel.com/dashboard
2. Select your **firebeat-seven** project
3. Click **Settings** → **Environment Variables**
4. Add two new variables:
   - Key: `VITE_SUPABASE_URL` → Value: `https://your-project.supabase.co`
   - Key: `VITE_SUPABASE_ANON_KEY` → Value: `your-anon-key`
5. Click **Save**
6. **Redeploy**: Go to Deployments → Trigger redeploy (or push to main)

### Option 2: Vercel CLI

```bash
# Install Vercel CLI if not installed
npm install -g vercel

# Link to your project
vercel link

# Add environment variables
vercel env add VITE_SUPABASE_URL
# Paste: https://your-project.supabase.co

vercel env add VITE_SUPABASE_ANON_KEY
# Paste: your-anon-key

# Trigger redeploy
vercel --prod
```

## Verify Setup is Working

After setting environment variables and redeploying:

1. Clear browser cache completely:
   - DevTools → Application → Clear all storage
   - Close browser entirely
2. Visit https://firebeat-seven.vercel.app
3. Login with test credentials
4. Try accessing `/admin/migration` or other protected pages
5. **Should NOT redirect to login**

## Test Connection Script

If still having issues, paste this in browser console to test connection:

```javascript
// Test Supabase connection
(async () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  console.log('Supabase URL:', supabaseUrl);
  console.log('Supabase Key Present:', !!supabaseKey);
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Environment variables not set on Vercel!');
    return;
  }
  
  // Try a simple fetch to Supabase
  const response = await fetch(`${supabaseUrl}/rest/v1/users?limit=1`, {
    headers: {
      'Authorization': `Bearer ${supabaseKey}`,
      'apikey': supabaseKey,
    }
  });
  
  if (response.ok) {
    console.log('✅ Connection to Supabase successful!');
  } else {
    console.error('❌ Failed to connect:', response.status, response.statusText);
  }
})();
```

## Common Issues

### Issue: "Missing Supabase environment variables"

**Cause**: Environment variables not set on Vercel

**Solution**:
1. Follow "How to Set Environment Variables on Vercel" above
2. Make sure to **redeploy** after adding variables
3. Clear browser cache and try again

### Issue: "Session lost after refresh" or "Redirected to login"

**Cause**: Still using old session tokens from development

**Solution**:
1. Verify env vars are set correctly on Vercel dashboard
2. Trigger a new deployment (even just redeploying won't help if env vars aren't saved)
3. **Important**: Clear ALL browser storage for firebeat-seven.vercel.app:
   - DevTools (F12) → Application tab
   - Left sidebar → Local Storage → firebeat-seven.vercel.app → right-click → Clear all
   - Left sidebar → Cookies → firebeat-seven.vercel.app → right-click → Clear all
4. Close browser completely
5. Open fresh browser window
6. Visit https://firebeat-seven.vercel.app and login again

### Issue: "CORS error" or "Failed to fetch"

**Cause**: Supabase CORS not configured for your Vercel domain

**Solution**:
1. Supabase Dashboard → Your project
2. Settings → API → CORS Allowed Origins
3. Add: `https://firebeat-seven.vercel.app`
4. Save and try again

## Production Checklist

- [ ] Environment variables set on Vercel (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`)
- [ ] Application redeployed after setting env vars
- [ ] Browser cache completely cleared
- [ ] Login works and doesn't redirect
- [ ] Can access `/admin/migration` without redirects
- [ ] Supabase CORS includes `https://firebeat-seven.vercel.app`

## Need Help?

Check the browser console (F12 → Console tab) for error messages that will help diagnose the issue.

Most issues are caused by missing/incorrect environment variables. Double-check those first!
