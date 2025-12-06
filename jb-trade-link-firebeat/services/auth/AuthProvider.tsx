import React, { createContext, useReducer, useEffect, useCallback } from 'react';
import { AuthState, AuthStatus, AuthContextValue } from './authTypes';
import { supabase } from '../../lib/supabase';
import { User } from '../../types';
import { Session } from '@supabase/supabase-js';
import { useUserStore } from './userStore';

const initialState: AuthState = {
    status: AuthStatus.LOADING,
    message: 'Checking session...',
};

type AuthAction =
    | { type: 'SET_LOADING'; message?: string }
    | { type: 'SET_AUTHENTICATED'; user: User; session: Session }
    | { type: 'SET_UNAUTHENTICATED' }
    | { type: 'SET_ERROR'; error: any };

function authReducer(state: AuthState, action: AuthAction): AuthState {
    switch (action.type) {
        case 'SET_LOADING':
            return { status: AuthStatus.LOADING, message: action.message };
        case 'SET_AUTHENTICATED':
            return {
                status: AuthStatus.AUTHENTICATED,
                user: action.user,
                session: action.session
            };
        case 'SET_UNAUTHENTICATED':
            return { status: AuthStatus.UNAUTHENTICATED };
        case 'SET_ERROR':
            return { status: AuthStatus.ERROR, error: action.error };
        default:
            return state;
    }
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);
    const [isInitialized, setIsInitialized] = React.useState(false);

    useEffect(() => {
        const boot = async () => {
            try {
                await useUserStore.getState().rehydrateFromSession();
                setIsInitialized(true);
                
                const storeState = useUserStore.getState();
                if (storeState.user) {
                    dispatch({ 
                        type: 'SET_AUTHENTICATED', 
                        user: storeState.user, 
                        session: storeState.session 
                    });
                } else {
                    dispatch({ type: 'SET_UNAUTHENTICATED' });
                }
            } catch (err) {
                console.error('[AuthProvider] Boot error:', err);
                dispatch({ type: 'SET_ERROR', error: err });
                setIsInitialized(true);
            }
        };
        boot();
    }, []);

    useEffect(() => {
        return useUserStore.subscribe(
            (storeState) => ({
                user: storeState.user,
                session: storeState.session,
                bootStatus: storeState.bootStatus,
            }),
            (snapshot) => {
                if (snapshot.user) {
                    dispatch({
                        type: 'SET_AUTHENTICATED',
                        user: snapshot.user,
                        session: snapshot.session,
                    });
                } else if (snapshot.bootStatus === 'ready') {
                    dispatch({ type: 'SET_UNAUTHENTICATED' });
                }
            }
        );
    }, []);

    useEffect(() => {
        const INACTIVITY_TIMEOUT = 3 * 60 * 60 * 1000;
        let inactivityTimer: NodeJS.Timeout;

        const resetInactivityTimer = () => {
            clearTimeout(inactivityTimer);
            if (state.status === AuthStatus.AUTHENTICATED) {
                inactivityTimer = setTimeout(() => {
                    console.warn('[AuthProvider] User inactive for 3 hours, logging out...');
                    logout();
                }, INACTIVITY_TIMEOUT);
            }
        };

        const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
        events.forEach(event => {
            window.addEventListener(event, resetInactivityTimer);
        });

        resetInactivityTimer();

        return () => {
            clearTimeout(inactivityTimer);
            events.forEach(event => {
                window.removeEventListener(event, resetInactivityTimer);
            });
        };
    }, [state.status]);

    const login = useCallback(async (email: string, password: string) => {
        try {
            dispatch({ type: 'SET_LOADING', message: 'Signing in...' });

            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            const { session, user: authUser } = data;

            if (!session || !authUser) {
                throw new Error('No session created');
            }

            useUserStore.setState({ session });
            await useUserStore.getState().rehydrateFromSession();
            
            const storeState = useUserStore.getState();
            dispatch({ 
                type: 'SET_AUTHENTICATED', 
                user: storeState.user!, 
                session: storeState.session 
            });
        } catch (error) {
            console.error('[AuthProvider] Login error:', error);
            dispatch({ type: 'SET_ERROR', error });
            throw error;
        }
    }, []);

    const logout = useCallback(async () => {
        try {
            await useUserStore.getState().logout();
            dispatch({ type: 'SET_UNAUTHENTICATED' });
        } catch (error) {
            console.error('[AuthProvider] Logout error:', error);
            dispatch({ type: 'SET_ERROR', error });
        }
    }, []);

    const refreshSession = useCallback(async () => {
        try {
            const { data, error } = await supabase.auth.refreshSession();
            if (error) throw error;
            
            if (data.session && data.user) {
                useUserStore.setState({ session: data.session });
                await useUserStore.getState().rehydrateFromSession();
                
                const storeState = useUserStore.getState();
                dispatch({
                    type: 'SET_AUTHENTICATED',
                    user: storeState.user!,
                    session: storeState.session,
                });
            }
        } catch (error) {
            console.error('[AuthProvider] Session refresh failed:', error);
            await logout();
        }
    }, [logout]);

    const isAuthenticated = state.status === AuthStatus.AUTHENTICATED;
    const isLoading = state.status === AuthStatus.LOADING;
    const user = state.status === AuthStatus.AUTHENTICATED ? state.user : null;
    const error = state.status === AuthStatus.ERROR ? state.error : null;

    const value: AuthContextValue = {
        state,
        login,
        logout,
        refreshSession,
        isAuthenticated,
        isLoading,
        isInitialized,
        user,
        error,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
