
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
        // Get environment variables
        const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
        const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''

        if (!supabaseUrl || !supabaseServiceKey) {
            return new Response(
                JSON.stringify({ error: 'Server configuration error: Missing environment variables' }),
                { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // Get authorization
        const authHeader = req.headers.get('Authorization')
        if (!authHeader) {
            return new Response(
                JSON.stringify({ error: 'No authorization header' }),
                { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        const adminClient = createClient(supabaseUrl, supabaseServiceKey, {
            auth: { autoRefreshToken: false, persistSession: false }
        })

        // Verify the caller is an admin
        const token = authHeader.replace('Bearer ', '')
        const { data: { user: callerUser }, error: userError } = await adminClient.auth.getUser(token)

        if (userError || !callerUser) {
            return new Response(
                JSON.stringify({ error: 'Invalid authentication', details: userError?.message }),
                { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        const { data: callerProfile, error: profileError } = await adminClient
            .from('users')
            .select('role')
            .eq('id', callerUser.id)
            .single()

        if (profileError || !callerProfile || callerProfile.role !== 'admin') {
            return new Response(
                JSON.stringify({ error: 'Unauthorized: Admin access required' }),
                { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // Parse request
        const body = await req.json()
        const { userId, newPassword, newEmail, email: bodyEmail } = body

        if (!userId) {
            return new Response(
                JSON.stringify({ error: 'userId is required' }),
                { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // Target user details
        let updateData: any = {}
        if (newPassword) updateData.password = newPassword
        if (newEmail) updateData.email = newEmail

        if (Object.keys(updateData).length === 0) {
            return new Response(
                JSON.stringify({ error: 'newPassword or newEmail is required' }),
                { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        console.log(`[admin-update-password] Admin ${callerUser.id} updating user ${userId}`)

        // 1. Check if user exists in Auth
        const { data: { user: existingAuthUser }, error: getUserError } = await adminClient.auth.admin.getUserById(userId)

        if (existingAuthUser) {
            // User exists, update them
            const { error: updateError } = await adminClient.auth.admin.updateUserById(userId, updateData)

            if (updateError) {
                console.error('[admin-update-password] Update failed:', updateError.message)
                return new Response(
                    JSON.stringify({ error: `Update failed: ${updateError.message}` }),
                    { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
                )
            }

            // If email was updated, also update the public.users table
            if (newEmail) {
                await adminClient.from('users').update({ email: newEmail }).eq('id', userId)
            }

            return new Response(
                JSON.stringify({ success: true, message: 'User updated successfully' }),
                { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        } else {
            // User DOES NOT exist in Auth - needs Backfill
            console.log(`[admin-update-password] User ${userId} not in Auth, attempting backfill`)

            // We MUST have an email and a password to create an auth user
            let emailToUse = bodyEmail || newEmail;

            if (!emailToUse) {
                // Look up in public.users if not provided in body
                const { data: profile } = await adminClient.from('users').select('email').eq('id', userId).single()
                emailToUse = profile?.email;
            }

            if (!emailToUse) {
                return new Response(
                    JSON.stringify({ error: 'User does not exist in auth system. Provide email and newPassword to create login.' }),
                    { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
                )
            }

            // We need a password to create the user if one wasn't provided for update
            const passwordToUse = newPassword || Math.random().toString(36).slice(-12) + "A1!";

            const { data: createdUser, error: createError } = await adminClient.auth.admin.createUser({
                id: userId,
                email: emailToUse,
                password: passwordToUse,
                email_confirm: true,
                user_metadata: { source: 'admin-backfill' }
            })

            if (createError) {
                console.error('[admin-update-password] Backfill failed:', createError.message)
                return new Response(
                    JSON.stringify({ error: `Backfill failed: ${createError.message}` }),
                    { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
                )
            }

            return new Response(
                JSON.stringify({
                    success: true,
                    message: newPassword ? 'User login created and password set' : 'User login created successfully (random password)',
                    note: !newPassword ? 'User created with temporary password as none was provided.' : undefined
                }),
                { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

    } catch (error: any) {
        console.error('[admin-update-password] Unexpected error:', error.message)
        return new Response(
            JSON.stringify({ error: `Server error: ${error.message}` }),
            { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
})
