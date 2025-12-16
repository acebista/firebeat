# Admin Password Management - Edge Function Deployment

## Overview
This Edge Function allows admin users to directly set passwords for other users.
Without this function, password updates require email-based reset flow.

## Prerequisites
- Supabase CLI installed (`npm install -g supabase`)
- You are logged into Supabase CLI (`supabase login`)

## Deployment Steps

### Step 1: Link your project
```bash
cd /Users/babi/Downloads/firebeat-main/jb-trade-link-firebeat
supabase link --project-ref qlosefnvwvmqeebfqdcg
```

### Step 2: Deploy the Edge Function
```bash
supabase functions deploy admin-update-password --no-verify-jwt
```

Note: `--no-verify-jwt` is used because the function handles its own JWT verification internally to check admin role.

### Step 3: Test the deployment
The function should now be available at:
`https://qlosefnvwvmqeebfqdcg.supabase.co/functions/v1/admin-update-password`

## What the function does:
1. ✅ Verifies the caller is authenticated
2. ✅ Checks caller has 'admin' role in the users table
3. ✅ Uses service role key (secret) to update the target user's password
4. ✅ Returns success/failure response

## Security
- Only admins can call this function
- Service role key is never exposed to the client
- All requests are authenticated and authorized

## Fallback
If the Edge Function is not deployed, admins can still:
- Use "Send Password Reset Email" button for existing users
- Create new users with passwords (uses signUp which works with anon key)
