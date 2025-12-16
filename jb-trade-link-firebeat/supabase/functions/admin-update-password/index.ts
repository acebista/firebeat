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
                { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // Get the authorization header
        const authHeader = req.headers.get('Authorization')
        if (!authHeader) {
            console.log('[admin-update-password] No authorization header provided')
            return new Response(
                JSON.stringify({ error: 'No authorization header' }),
                { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
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
                { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
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
                { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        if (!callerProfile || callerProfile.role !== 'admin') {
            console.log('[admin-update-password] Unauthorized access attempt by:', callerUser.id)
            return new Response(
                JSON.stringify({ error: 'Only admins can update user passwords' }),
                { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // Parse the request body
        let body;
        try {
            body = await req.json()
        } catch (e) {
            return new Response(
                JSON.stringify({ error: 'Invalid request body' }),
                { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        const { userId, newPassword } = body

        if (!userId || !newPassword) {
            return new Response(
                JSON.stringify({ error: 'userId and newPassword are required' }),
                { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }


        if (newPassword.length < 6) {
            return new Response(
                JSON.stringify({ error: 'Password must be at least 6 characters' }),
                { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        console.log(`[admin-update-password] Admin ${callerUser.id} processing user ${userId}`)

        // 1. Check if the user exists in Auth
        const { data: { user: existingAuthUser }, error: getUserError } = await adminClient.auth.admin.getUserById(userId)

        if (existingAuthUser) {
            // User exists in Auth, update password
            console.log(`[admin-update-password] Auth user found, updating password for ${userId}`)

            const { error: updateError } = await adminClient.auth.admin.updateUserById(
                userId,
                { password: newPassword }
            )

            if (updateError) {
                console.error('[admin-update-password] Password update failed:', updateError.message)
                return new Response(
                    JSON.stringify({ error: `Password update failed: ${updateError.message}` }),
                    { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
                )
            }

            console.log(`[admin-update-password] Password updated successfully for user ${userId}`)
            return new Response(
                JSON.stringify({ success: true, message: 'Password updated successfully' }),
                { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )

        } else {
            // User does not exist in Auth, we need to create them (Backfill)
            // We need their email from the public profile first
            console.log(`[admin-update-password] Auth user not found from ID, attempting to create backfill for ${userId}`)

            const { data: targetProfile, error: targetProfileError } = await adminClient
                .from('users')
                .select('email')
                .eq('id', userId)
                .single()

            if (targetProfileError || !targetProfile) {
                console.error('[admin-update-password] Could not find public profile for backfill:', targetProfileError?.message)
                return new Response(
                    JSON.stringify({ error: 'User profile not found. Cannot create login without email.' }),
                    { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
                )
            }

            const email = targetProfile.email
            if (!email) {
                return new Response(
                    JSON.stringify({ error: 'User profile has no email. Cannot create login.' }),
                    { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
                )
            }

            console.log(`[admin-update-password] Creating new Auth user for ${email} with ID ${userId}`)

            const { data: createdUser, error: createError } = await adminClient.auth.admin.createUser({
                id: userId,
                email: email,
                password: newPassword,
                email_confirm: true,
                user_metadata: { source: 'admin-backfill' }
            })

            if (createError) {
                console.error('[admin-update-password] User creation failed:', createError.message)

                // Friendly error if email is taken
                if (createError.message.includes('already been registered')) {
                    return new Response(
                        JSON.stringify({ error: `The email ${email} is already associated with another user ID.` }),
                        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
                    )
                }

                return new Response(
                    JSON.stringify({ error: `Failed to create login: ${createError.message}` }),
                    { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
                )
            }

            console.log(`[admin-update-password] User created successfully: ${userId}`)
            return new Response(
                JSON.stringify({ success: true, message: 'User login created and password set successfully' }),
                { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

    } catch (error: any) {
        console.error('[admin-update-password] Unexpected error:', error?.message || error)
        return new Response(
            JSON.stringify({ error: `Internal server error: ${error?.message || 'Unknown error'}` }),
            { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
})
