import React, { createContext, useEffect, useCallback, useRef } from 'react';
import { AuthState, AuthStatus, AuthContextValue } from './authTypes';
import { supabase } from '../../lib/supabase';
import { useUserStore } from './userStore';
import { getCachedSession, initSessionManager, clearSessionCache } from '../sessionManager';
import { loadUserProfile } from './profileService';

/**
 * A+ ARCHITECTURE: AUTH PROVIDER (ORCHESTRATOR)
 * --------------------------------------------
 * This component coordinates the app lifecycle:
 * 1. Bootstrapping (Session -> Profile -> Readiness)
 * 2. Auth State Persistence
 * 3. Global Inactivity
 */

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // We derive state from the store and local refs for process control
    const {
        user,
        authStatus,
        bootStatus,
        error: storeError,
        bootError,
        setAuthenticated,
        setUnauthenticated,
        setBootStatus,
        setAuthStatus,
        setBootError,
        logout: storeLogout
    } = useUserStore();

    const isInitializedRef = useRef(false);

    // ==========================================
    // PHASE 1: BOOT ORCHESTRATION
    // ==========================================
    const runBootInternal = useCallback(async (options: { background?: boolean } = {}) => {
        const { background = false } = options;

        if (!background) setBootStatus('checking');

        // Boot timeout guard (20s)
        const timeoutId = setTimeout(() => {
            if (useUserStore.getState().bootStatus === 'checking') {
                console.warn('[Boot] Timeout exceeded');
                setBootError('Slow connection detected. Trying to proceed...');
            }
        }, 20000);

        try {
            console.log('[Boot] Orchestrating phases...');

            // 1. Session Phase
            const session = await getCachedSession();
            if (!session?.user) {
                setUnauthenticated();
                return;
            }

            // 2. Profile Phase
            const profile = await loadUserProfile(session.user.id);

            // 3. Success Phase
            setAuthenticated(profile);
            console.log('[Boot] ✓ Success');

        } catch (err: any) {
            console.error('[Boot] Orchestration failed:', err);
            clearSessionCache();
            setUnauthenticated();
            setBootError(err?.message || 'Failed to load user profile');
        } finally {
            clearTimeout(timeoutId);
        }
    }, [setAuthenticated, setUnauthenticated, setBootStatus, setBootError]);

    // Initial Trigger
    useEffect(() => {
        if (!isInitializedRef.current) {
            isInitializedRef.current = true;
            initSessionManager();
            runBootInternal();
        }
    }, [runBootInternal]);

    // ==========================================
    // PHASE 2: AUTH REACTION (SUPABASE SYNC)
    // ==========================================
    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
            console.log('[Auth] Supabase triggered:', event);

            if (event === 'SIGNED_OUT') {
                useUserStore.getState().resetStore();
            } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
                const currentUser = useUserStore.getState().user;
                runBootInternal({ background: !!currentUser });
            }
        });

        return () => subscription?.unsubscribe();
    }, [runBootInternal]);

    // ==========================================
    // PHASE 3: INACTIVITY
    // ==========================================
    useEffect(() => {
        const INACTIVITY_TIMEOUT = 3 * 60 * 60 * 1000;
        let inactivityTimer: NodeJS.Timeout;

        const resetTimer = () => {
            clearTimeout(inactivityTimer);
            if (authStatus === 'authenticated') {
                inactivityTimer = setTimeout(() => {
                    console.warn('[Auth] Inactivity timeout');
                    storeLogout();
                }, INACTIVITY_TIMEOUT);
            }
        };

        const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
        events.forEach(ev => window.addEventListener(ev, resetTimer));
        resetTimer();

        return () => {
            clearTimeout(inactivityTimer);
            events.forEach(ev => window.removeEventListener(ev, resetTimer));
        };
    }, [authStatus, storeLogout]);

    // ==========================================
    // API FOR COMPONENTS
    // ==========================================
    const login = useCallback(async (email: string, password: string) => {
        setAuthStatus('loading');
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            setAuthStatus('error');
            throw error;
        }
        if (!data.session) throw new Error('Auth failed');
        await runBootInternal();
    }, [setAuthStatus, runBootInternal]);

    const value: AuthContextValue = {
        state: {
            status: authStatus as any,
            user: user as any,
            error: storeError || bootError
        },
        login,
        logout: storeLogout,
        refreshSession: async () => { }, // Handled by supabase internally
        isAuthenticated: authStatus === 'authenticated',
        isLoading: bootStatus === 'checking' || authStatus === 'loading',
        isInitialized: bootStatus === 'ready',
        user: user as any,
        error: (storeError || bootError) as any,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
