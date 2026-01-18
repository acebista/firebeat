/**
 * SessionManager: Single source of truth for session state
 * 
 * Principle: Auth is a boot-time invariant, not something we re-check on every fetch.
 * Session is verified once at boot, cached in memory, and cleared only on auth events.
 */

import { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

// In-memory session cache (NOT localStorage - this is runtime state)
let cachedSession: Session | null = null;
let sessionPromise: Promise<Session | null> | null = null;

/**
 * Get the cached session, or fetch it once if not cached.
 * Uses a promise lock to prevent multiple concurrent getSession calls.
 */
export async function getCachedSession(): Promise<Session | null> {
    // If we have a cached session, return it immediately
    if (cachedSession) {
        return cachedSession;
    }

    // If a session fetch is already in progress, wait for it
    if (sessionPromise) {
        return sessionPromise;
    }

    // Fetch session and cache it
    sessionPromise = (async () => {
        console.time('[SessionManager] getSession');
        try {
            const { data, error } = await supabase.auth.getSession();
            if (error) {
                console.error('[SessionManager] getSession error:', error);
                return null;
            }
            cachedSession = data.session;
            console.log('[SessionManager] Session cached:', cachedSession ? '✓ Valid' : '✗ None');
            return cachedSession;
        } catch (err) {
            console.error('[SessionManager] Unexpected error:', err);
            return null;
        } finally {
            console.timeEnd('[SessionManager] getSession');
            sessionPromise = null;
        }
    })();

    return sessionPromise;
}

/**
 * Clear the session cache. Called on:
 * - Logout
 * - Auth state change (SIGNED_OUT event)
 * - Token refresh failure
 */
export function clearSessionCache(): void {
    console.log('[SessionManager] Clearing session cache');
    cachedSession = null;
    sessionPromise = null;
}

/**
 * Update the cached session (used after login or token refresh)
 */
export function setSessionCache(session: Session | null): void {
    console.log('[SessionManager] Setting session cache:', session ? '✓ Valid' : '✗ None');
    cachedSession = session;
}

/**
 * Check if we have a valid cached session (synchronous check)
 */
export function hasValidSession(): boolean {
    if (!cachedSession) return false;

    // Check if session is expired
    const expiresAt = cachedSession.expires_at;
    if (!expiresAt) return true;

    const now = Date.now() / 1000;
    return now < expiresAt;
}

/**
 * Initialize session manager - subscribe to auth state changes
 * Call this once at app startup
 */
export function initSessionManager(): void {
    supabase.auth.onAuthStateChange((event, session) => {
        console.log('[SessionManager] Auth state changed:', event);

        if (event === 'SIGNED_OUT') {
            clearSessionCache();
        } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
            setSessionCache(session);
        }
    });

    console.log('[SessionManager] Initialized');
}
