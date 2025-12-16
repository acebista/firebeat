import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        // Get the authorization header to verify the caller is authenticated
        const authHeader = req.headers.get('Authorization')
        if (!authHeader) {
            console.log('[admin-update-password] No authorization header provided')
            return new Response(
                JSON.stringify({ error: 'No authorization header' }),
                { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // Get environment variables
        const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
        const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? ''
        const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''

        if (!supabaseUrl || !supabaseServiceKey) {
            console.error('[admin-update-password] Missing required environment variables')
            return new Response(
                JSON.stringify({ error: 'Server configuration error' }),
                { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // Create admin client with service role key (bypasses RLS)
        const adminClient = createClient(supabaseUrl, supabaseServiceKey, {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        })

        // Verify the caller's JWT using the service client
        // Extract JWT from Authorization header
        const jwt = authHeader.replace('Bearer ', '')
        const { data: { user: callerUser }, error: userError } = await adminClient.auth.getUser(jwt)

        if (userError) {
            console.error('[admin-update-password] JWT verification failed:', userError.message)
            return new Response(
                JSON.stringify({ error: 'Invalid or expired authentication token' }),
                { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        if (!callerUser) {
            console.log('[admin-update-password] No user found for token')
            return new Response(
                JSON.stringify({ error: 'Invalid authentication' }),
                { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        console.log(`[admin-update-password] Caller authenticated: ${callerUser.id}`)

        // Check if caller is an admin by looking up their role in the public.users table
        // Use service client to bypass RLS and query by ID (stored as text)
        const { data: callerProfile, error: profileError } = await adminClient
            .from('users')
            .select('id, role')
            .eq('id', callerUser.id)
            .single()

        if (profileError) {
            console.error('[admin-update-password] Profile lookup error:', profileError.message, profileError.code)
            return new Response(
                JSON.stringify({ error: `Failed to verify admin status: ${profileError.message}` }),
                { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        if (!callerProfile) {
            console.log('[admin-update-password] No profile found for user:', callerUser.id)
            return new Response(
                JSON.stringify({ error: 'User profile not found' }),
                { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        console.log(`[admin-update-password] User role: ${callerProfile.role}`)

        if (callerProfile.role !== 'admin') {
            console.log('[admin-update-password] Non-admin attempted password change:', callerUser.id)
            return new Response(
                JSON.stringify({ error: 'Only admins can update user passwords' }),
                { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // Parse the request body
        const { userId, newPassword } = await req.json()

        if (!userId || !newPassword) {
            return new Response(
                JSON.stringify({ error: 'userId and newPassword are required' }),
                { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        if (newPassword.length < 6) {
            return new Response(
                JSON.stringify({ error: 'Password must be at least 6 characters' }),
                { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        console.log(`[admin-update-password] Admin ${callerUser.id} updating password for user ${userId}`)

        // Update the user's password using admin privileges
        const { data, error } = await adminClient.auth.admin.updateUserById(
            userId,
            { password: newPassword }
        )

        if (error) {
            console.error('[admin-update-password] Password update failed:', error.message)
            return new Response(
                JSON.stringify({ error: `Password update failed: ${error.message}` }),
                { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        console.log(`[admin-update-password] Password updated successfully for user ${userId}`)
        return new Response(
            JSON.stringify({ success: true, message: 'Password updated successfully' }),
            { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

    } catch (error: any) {
        console.error('[admin-update-password] Unexpected error:', error?.message || error)
        return new Response(
            JSON.stringify({ error: `Internal server error: ${error?.message || 'Unknown error'}` }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
})

