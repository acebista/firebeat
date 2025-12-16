import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from 'jsr:@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        // Get environment variables first
        const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
        const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? ''
        const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''

        if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
            console.error('[admin-update-password] Missing required environment variables')
            return new Response(
                JSON.stringify({ error: 'Server configuration error: Missing environment variables' }),
                { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // Get the authorization header
        const authHeader = req.headers.get('Authorization')
        if (!authHeader) {
            console.log('[admin-update-password] No authorization header provided')
            return new Response(
                JSON.stringify({ error: 'No authorization header' }),
                { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // Create a Supabase client with the user's JWT
        const userClient = createClient(supabaseUrl, supabaseAnonKey, {
            global: { headers: { Authorization: authHeader } }
        })

        // Verify the user
        const { data: { user: callerUser }, error: userError } = await userClient.auth.getUser()

        if (userError || !callerUser) {
            console.error('[admin-update-password] Auth error:', userError?.message)
            return new Response(
                JSON.stringify({ error: 'Invalid authentication' }),
                { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        console.log(`[admin-update-password] Caller authenticated: ${callerUser.id}`)

        // Create admin client with service role key (bypasses RLS)
        const adminClient = createClient(supabaseUrl, supabaseServiceKey, {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        })

        // Check if caller is an admin by looking up their role in the public.users table
        const { data: callerProfile, error: profileError } = await adminClient
            .from('users')
            .select('role')
            .eq('id', callerUser.id)
            .single()

        if (profileError) {
            console.error('[admin-update-password] Profile lookup error:', profileError.message)
            return new Response(
                JSON.stringify({ error: `Failed to verify admin status: ${profileError.message}` }),
                { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        if (!callerProfile || callerProfile.role !== 'admin') {
            console.log('[admin-update-password] Unauthorized access attempt by:', callerUser.id)
            return new Response(
                JSON.stringify({ error: 'Only admins can update user passwords' }),
                { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // Parse the request body
        let body;
        try {
            body = await req.json()
        } catch (e) {
            return new Response(
                JSON.stringify({ error: 'Invalid request body' }),
                { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        const { userId, newPassword } = body

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
        const { error: updateError } = await adminClient.auth.admin.updateUserById(
            userId,
            { password: newPassword }
        )

        if (updateError) {
            console.error('[admin-update-password] Password update failed:', updateError.message)
            return new Response(
                JSON.stringify({ error: `Password update failed: ${updateError.message}` }),
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

