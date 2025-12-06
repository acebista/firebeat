import { supabase } from '../../lib/supabase';
import { Session } from '@supabase/supabase-js';
import { mapSupabaseError } from './authErrors';
import { clearSupabaseStorage } from './authUtils';

/**
 * Sign in with email and password
 */
export async function signIn(email: string, password: string) {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) throw error;
        if (!data.session) throw new Error('No session returned');
        if (!data.user) throw new Error('No user returned');

        return {
            user: data.user,
            session: data.session,
        };
    } catch (error) {
        throw mapSupabaseError(error);
    }
}

/**
 * Sign out current user
 */
export async function signOut(): Promise<void> {
    try {
        await supabase.auth.signOut();
    } catch (error) {
        console.error('Sign out error:', error);
        // Don't throw - always clear storage even if signOut fails
    } finally {
        // Always clear local state
        clearSupabaseStorage();
    }
}

/**
 * Get current session
 */
export async function getSession(): Promise<Session | null> {
    try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) throw error;

        return session;
    } catch (error) {
        throw mapSupabaseError(error);
    }
}

/**
 * Refresh current session
 */
export async function refreshSession(): Promise<Session | null> {
    try {
        const { data: { session }, error } = await supabase.auth.refreshSession();

        if (error) throw error;

        return session;
    } catch (error) {
        throw mapSupabaseError(error);
    }
}

/**
 * Check if session is valid (not expired)
 */
export function isSessionValid(session: Session | null): boolean {
    if (!session) return false;

    const expiresAt = session.expires_at;
    if (!expiresAt) return true; // No expiry means valid

    const now = Date.now() / 1000;
    const bufferSeconds = 60; // Refresh 1 minute before expiry

    return now < (expiresAt - bufferSeconds);
}

/**
 * Reset password for email
 */
export async function resetPasswordForEmail(email: string, redirectTo: string): Promise<void> {
    try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo,
        });

        if (error) throw error;
    } catch (error) {
        throw mapSupabaseError(error);
    }
}
