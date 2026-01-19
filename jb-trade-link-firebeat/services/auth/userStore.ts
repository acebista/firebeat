import { create } from 'zustand';
import { persist, subscribeWithSelector } from 'zustand/middleware';
import { User } from '../../types';
import { supabase } from '../../lib/supabase';

/**
 * A+ ARCHITECTURE: USER STORE
 * ----------------------------
 * 1. Orchestration Over Implementation: Only stores state, doesn't implement fetch logic.
 * 2. Explicit Life-cycles: Separates App Boot from User Auth state.
 * 3. Security: Persists profile data only; session lives in Supabase.
 */

export type BootStatus = 'idle' | 'checking' | 'ready';
export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated' | 'error';

interface UserState {
  // Metadata/Lifecycle
  bootStatus: BootStatus;
  authStatus: AuthStatus;

  // Data
  user: User | null;
  error: string | null;
  bootError: string | null;

  // Basic Actions (Pure State updates)
  setBootStatus: (status: BootStatus) => void;
  setAuthStatus: (status: AuthStatus) => void;
  setAuthenticated: (user: User) => void;
  setUnauthenticated: () => void;
  setError: (error: string | null) => void;
  setBootError: (error: string | null) => void;

  // Actions
  logout: () => Promise<void>;
  resetStore: () => void;
}

const initialState = {
  bootStatus: 'idle' as BootStatus,
  authStatus: 'loading' as AuthStatus,
  user: null,
  error: null,
  bootError: null,
};

export const useUserStore = create<UserState>()(
  subscribeWithSelector(
    persist(
      (set, get) => ({
        ...initialState,

        setBootStatus: (bootStatus) => set({ bootStatus }),
        setAuthStatus: (authStatus) => set({ authStatus }),

        setAuthenticated: (user) => {
          console.log('[Store] Status -> AUTHENTICATED');
          set({
            user,
            authStatus: 'authenticated',
            bootStatus: 'ready',
            error: null,
            bootError: null,
          });
        },

        setUnauthenticated: () => {
          console.log('[Store] Status -> UNAUTHENTICATED');
          set({
            user: null,
            authStatus: 'unauthenticated',
            bootStatus: 'ready',
            error: null,
          });
        },

        setError: (error) => set({ error, authStatus: error ? 'error' : get().authStatus }),
        setBootError: (bootError) => set({ bootError, bootStatus: 'ready' }),

        resetStore: () => {
          console.log('[Store] Hard reset triggered');
          clearStaleTokens();
          clearPersistedAuthKey();
          set(initialState);
        },

        logout: async () => {
          try {
            console.log('[Store] Global logout initiated');
            await supabase.auth.signOut().catch(() => { });
          } finally {
            get().setUnauthenticated();
            clearStaleTokens();
          }
        },
      }),
      {
        name: 'auth-user-storage',
        partialize: (state) => ({
          user: state.user ? {
            id: state.user.id,
            email: state.user.email,
            name: state.user.name,
            role: state.user.role,
            isActive: state.user.isActive,
          } : null,
        }),
        version: 4,
        migrate: (persistedState: any, version: number) => {
          if (version < 4) {
            return {
              ...initialState,
              user: persistedState.user || null,
            };
          }
          return persistedState;
        },
      }
    )
  )
);

/**
 * Security Helpers
 */

function clearStaleTokens() {
  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.includes('sb-') && (key.includes('auth') || key.includes('session'))) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
  } catch (e) {
    console.error('[Tokens] Failed cleanup:', e);
  }
}

function clearPersistedAuthKey() {
  try {
    localStorage.removeItem('auth-user-storage');
  } catch (e) {
    console.error('[Storage] Failed cleanup:', e);
  }
}

/**
 * External Subscriptions
 */
export const subscribeToUserChanges = (callback: (user: User | null) => void) => {
  return useUserStore.subscribe(
    (state) => state.user,
    callback
  );
};
