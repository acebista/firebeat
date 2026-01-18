import { create } from 'zustand';
import { persist, subscribeWithSelector } from 'zustand/middleware';
import { User } from '../../types';
import { supabase } from '../../lib/supabase';
import { loadUserProfile } from './profileService';
import { getCachedSession, clearSessionCache, setSessionCache } from '../sessionManager';

type BootStatus = 'idle' | 'checking' | 'ready';

interface UserState {
  bootStatus: BootStatus;
  user: User | null;
  session: any | null;
  error: string | null;
  bootError: string | null;
  rehydrateFromSession: (options?: { background?: boolean }) => Promise<void>;
  setAuthenticated: (user: User, session: any) => void;
  setUnauthenticated: () => void;
  setError: (error: string | null) => void;
  retryBoot: () => Promise<void>;
  logout: () => Promise<void>;
  resetStore: () => void;  // New: hard reset with stale cleanup
}

const initialState = {
  bootStatus: 'idle' as BootStatus,
  user: null,
  session: null,
  error: null,
  bootError: null,
};

export const useUserStore = create<UserState>()(
  subscribeWithSelector(
    persist(
      (set, get) => ({
        ...initialState,

        resetStore: () => {
          /**
           * Hard reset: clears all persisted auth keys and resets store to initial state.
           * Called ONLY when truly logging out or when session is confirmed invalid.
           * NOT called on regular boot—that would destroy valid sessions on refresh!
           */
          console.log('[Boot] Performing hard reset of auth store...');
          clearStaleTokens();
          clearPersistedAuthKey();
          set({
            bootStatus: 'idle',
            user: null,
            session: null,
            error: null,
            bootError: null,
          });
        },

        rehydrateFromSession: async (options = {}) => {
          const { background = false } = options;

          if (!background) {
            set({ bootStatus: 'checking' });
          }

          // Boot timeout guard: 20 seconds for slow networks (Nepal mobile)
          const BOOT_TIMEOUT_MS = 20000;
          const timeoutId = setTimeout(() => {
            const current = get();
            if (current.bootStatus === 'checking') {
              console.warn(`[Boot] Boot timeout (${BOOT_TIMEOUT_MS / 1000}s exceeded), forcing ready state`);
              set({
                bootStatus: 'ready',
                bootError: 'Connection is slow. Please check your network and try again.',
                user: null,
              });
            }
          }, BOOT_TIMEOUT_MS);

          try {
            // ========== PHASE 1: Session Check ==========
            console.log('[Boot] Phase 1: Checking session...');
            console.time('[Boot] Phase 1: Session');

            // Use centralized SessionManager instead of direct supabase call
            const session = await getCachedSession();

            console.timeEnd('[Boot] Phase 1: Session');
            console.log('[Boot] Session result:', session ? '✓ Valid' : '✗ None');

            if (!session?.user) {
              console.log('[Boot] No active session, clearing auth state');
              clearSessionCache();
              clearStaleTokens();
              set({ bootStatus: 'ready', user: null, session: null, bootError: null });
              return;
            }

            // Cache session for future use
            setSessionCache(session);

            // ========== PHASE 2: Load Profile ==========
            console.log('[Boot] Phase 2: Loading user profile...');
            console.time('[Boot] Phase 2: Profile');

            try {
              const profile = await loadUserProfile(session.user.id);
              console.timeEnd('[Boot] Phase 2: Profile');
              console.log('[Boot] Profile loaded:', profile.name, `(${profile.role})`);

              // Success - set authenticated state
              set({
                bootStatus: 'ready',
                user: profile,
                session,
                bootError: null,
                error: null,
              });

              console.log('[Boot] ✓ Boot complete - user authenticated');
            } catch (profileErr: any) {
              console.timeEnd('[Boot] Phase 2: Profile');
              console.error('[Boot] Profile fetch failed:', profileErr);

              // Profile fetch failed - clear session
              clearSessionCache();
              clearStaleTokens();
              set({
                bootStatus: 'ready',
                user: null,
                session: null,
                bootError: `Profile load failed: ${profileErr?.message || 'Unknown error'}. Please log in again.`,
              });
            }
          } catch (err: any) {
            console.error('[Boot] Unexpected boot error:', err);
            clearSessionCache();
            clearStaleTokens();
            set({
              bootStatus: 'ready',
              user: null,
              session: null,
              bootError: err?.message || 'Boot failed',
            });
          } finally {
            clearTimeout(timeoutId);
          }
        },

        setAuthenticated: (user, session) => {
          console.log('[Auth] User authenticated:', user.email);
          set({
            user,
            session,
            bootStatus: 'ready',
            error: null,
            bootError: null,
          });
        },

        setUnauthenticated: () => {
          console.log('[Auth] User unauthenticated');
          set({
            user: null,
            session: null,
            bootStatus: 'ready',
            error: null,
          });
          clearStaleTokens();
        },

        setError: (error) => {
          set({ error });
        },

        retryBoot: async () => {
          console.log('[Boot] User initiated retry');
          return get().rehydrateFromSession();
        },

        logout: async () => {
          try {
            console.log('[Auth] Logging out...');
            await supabase.auth.signOut().catch(() => { });
          } finally {
            set({
              user: null,
              session: null,
              bootStatus: 'ready',
              error: null,
              bootError: null,
            });
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
        storage: {
          getItem: (name) => {
            try {
              const item = localStorage.getItem(name);
              const parsed = item ? JSON.parse(item) : null;
              console.log('[Storage] getItem:', name, parsed ? '✓ found' : '✗ empty');
              return parsed;
            } catch (e) {
              console.error(`[Storage] Failed to read (${name}):`, e);
              return null;
            }
          },
          setItem: (name, value) => {
            try {
              localStorage.setItem(name, JSON.stringify(value));
              console.log('[Storage] setItem:', name, '✓ saved');
            } catch (e) {
              console.error(`[Storage] Failed to write (${name}):`, e);
            }
          },
          removeItem: (name) => {
            try {
              localStorage.removeItem(name);
              console.log('[Storage] removeItem:', name, '✓ cleared');
            } catch (e) {
              console.error(`[Storage] Failed to remove (${name}):`, e);
            }
          },
        },
        version: 3,
        migrate: (persistedState: any, version: number) => {
          console.log('[Storage] Migrating from version', version);
          if (version < 3) {
            return {
              ...persistedState,
              bootStatus: 'idle',
              session: null,
              error: null,
              bootError: null,
            };
          }
          return persistedState;
        },
      }
    )
  )
);

function clearStaleTokens() {
  try {
    console.log('[Tokens] Clearing stale Supabase auth tokens...');
    const keysToRemove: string[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.includes('sb-') && (key.includes('auth') || key.includes('session'))) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
      console.log(`[Tokens] Removed ${key}`);
    });
  } catch (e) {
    console.error('[Tokens] Failed to clear tokens:', e);
  }
}

/**
 * Clear the persisted auth-user-storage key to prevent stale rehydration
 */
function clearPersistedAuthKey() {
  try {
    const STORAGE_KEY = 'auth-user-storage';
    localStorage.removeItem(STORAGE_KEY);
    console.log(`[Storage] Cleared persisted key: ${STORAGE_KEY}`);
  } catch (e) {
    console.error('[Storage] Failed to clear persisted auth key:', e);
  }
}

export const subscribeToUserChanges = (callback: (user: User | null) => void) => {
  return useUserStore.subscribe(
    (state) => state.user,
    callback
  );
};

export const clearStaleUserData = () => {
  useUserStore.getState().logout();
};
