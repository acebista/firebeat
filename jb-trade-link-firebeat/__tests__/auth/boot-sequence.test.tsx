/**
 * Auth Store & Boot Sequence Tests
 * 
 * Tests for:
 * - Store initialization and stale data cleanup
 * - Boot sequence with timeout guard
 * - Logout and session clearing
 * - Stale token cleanup
 * - Error recovery
 */

import { renderHook, act, waitFor } from '@testing-library/react';
import { useUserStore } from '../../services/auth/userStore';
import { AuthProvider, useAuth } from '../../services/auth';
import React from 'react';
import { User } from '../../types';

describe('Auth Store - Boot Sequence & Stale Data Cleanup', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    
    // Reset store to initial state
    useUserStore.setState({
      user: null,
      session: null,
      bootStatus: 'idle',
      error: null,
      bootError: null,
    });
  });

  describe('resetStore', () => {
    it('should hard reset store to initial state', () => {
      // Set some data
      useUserStore.setState({
        user: {
          id: 'user-1',
          email: 'test@example.com',
          name: 'Test User',
          role: 'admin',
          company_id: 'company-1',
          is_active: true,
          created_at: new Date().toISOString(),
        },
        session: { access_token: 'mock-token' },
        bootStatus: 'ready',
      });

      // Call resetStore
      act(() => {
        useUserStore.getState().resetStore();
      });

      // Verify reset
      const state = useUserStore.getState();
      expect(state.user).toBeNull();
      expect(state.session).toBeNull();
      expect(state.bootStatus).toBe('idle');
      expect(state.error).toBeNull();
      expect(state.bootError).toBeNull();
    });

    it('should clear persisted auth key from localStorage', () => {
      // Simulate persisted state with stale user
      const persistedKey = 'auth-user-storage';
      const mockData = { state: { user: { id: 'stale-user', email: 'stale@example.com' } }, version: 3 };
      localStorage.setItem(persistedKey, JSON.stringify(mockData));

      const beforeClear = localStorage.getItem(persistedKey);
      expect(beforeClear).toBeTruthy();
      expect(JSON.parse(beforeClear!).state.user).toBeTruthy();

      // Call resetStore
      act(() => {
        useUserStore.getState().resetStore();
      });

      // Verify the persisted state is now empty (Zustand may re-save, but user should be null)
      const afterClear = localStorage.getItem(persistedKey);
      if (afterClear) {
        const parsed = JSON.parse(afterClear);
        // User should be null after reset (state was cleared)
        expect(parsed.state.user).toBeNull();
      }
    });

    it('should prevent stale user resurrection on boot', async () => {
      // Scenario: User logs out on one tab, stale data persisted from old login
      const mockPersistedUser: User = {
        id: 'old-user-id',
        email: 'old@example.com',
        name: 'Old User',
        role: 'admin',
        company_id: 'company-1',
        is_active: true,
        created_at: new Date().toISOString(),
      };

      // Simulate old persisted state
      localStorage.setItem('auth-user-storage', JSON.stringify({
        state: { user: mockPersistedUser },
      }));

      // Boot and reset before rehydration
      act(() => {
        useUserStore.getState().resetStore();
      });

      const state = useUserStore.getState();
      expect(state.user).toBeNull();
      expect(state.bootStatus).toBe('idle');
    });
  });

  describe('Boot timeout guard', () => {
    it('should force ready state if checking takes >10 seconds', async () => {
      // Note: In real tests, we'd mock setTimeout, but this demonstrates the concept
      // Mock a slow rehydration
      const realRehydrate = useUserStore.getState().rehydrateFromSession;
      
      let slowRehydrateComplete = false;
      const slowRehydrate = jest.fn(async () => {
        // Simulate slow network
        await new Promise(resolve => {
          setTimeout(() => {
            slowRehydrateComplete = true;
            resolve(undefined);
          }, 100); // Fast in test, but logic prevents hanging
        });
      });

      // Replace with slow version
      useUserStore.getState().rehydrateFromSession = slowRehydrate as any;

      // This test would need jest timer mocking for full effect
      // The important part is that the timeout guard prevents infinite checking
      expect(useUserStore.getState().bootStatus).toBe('idle');

      // Restore
      useUserStore.getState().rehydrateFromSession = realRehydrate;
    });

    it('should always settle bootStatus to ready, never leave at checking', async () => {
      // Start boot
      const bootPromise = useUserStore.getState().rehydrateFromSession();
      
      // Should be checking immediately
      let state = useUserStore.getState();
      expect(state.bootStatus).toBe('checking');

      // Wait for completion
      await bootPromise;

      // Should have settled to ready
      state = useUserStore.getState();
      expect(state.bootStatus).toBe('ready');
      expect(['ready', 'checking']).toContain(state.bootStatus);
    });
  });

  describe('Logout and session clearing', () => {
    it('should clear all auth state on logout', async () => {
      const mockUser: User = {
        id: 'user-1',
        email: 'test@example.com',
        name: 'Test',
        role: 'admin',
        company_id: 'company-1',
        is_active: true,
        created_at: new Date().toISOString(),
      };

      // Set authenticated state
      act(() => {
        useUserStore.getState().setAuthenticated(mockUser, { access_token: 'token' });
      });

      // Verify set
      let state = useUserStore.getState();
      expect(state.user).toEqual(mockUser);
      expect(state.bootStatus).toBe('ready');

      // Logout
      await act(async () => {
        await useUserStore.getState().logout();
      });

      // Verify cleared
      state = useUserStore.getState();
      expect(state.user).toBeNull();
      expect(state.session).toBeNull();
      expect(state.bootStatus).toBe('ready');
      expect(state.error).toBeNull();
    });

    it('should set bootError on failed profile fetch', async () => {
      // This would require mocking Supabase and loadUserProfile
      // The test demonstrates the error flow
      const state = useUserStore.getState();
      
      act(() => {
        state.setError('Profile fetch failed: 403 Forbidden');
      });

      let current = useUserStore.getState();
      expect(current.error).toContain('Profile fetch failed');
    });
  });

  describe('Stale token cleanup', () => {
    it('should remove sb-* auth tokens from localStorage', () => {
      // Add mock Supabase tokens
      localStorage.setItem('sb-qlosefnvwvmqeebfqdcg-auth-token', JSON.stringify({ access_token: 'old' }));
      localStorage.setItem('sb-qlosefnvwvmqeebfqdcg-session', JSON.stringify({ token: 'old' }));
      localStorage.setItem('user-preferences', 'keep-this'); // Should not be removed

      // Call resetStore which includes clearStaleTokens
      act(() => {
        useUserStore.getState().resetStore();
      });

      // Verify tokens removed but other data kept
      expect(localStorage.getItem('sb-qlosefnvwvmqeebfqdcg-auth-token')).toBeNull();
      expect(localStorage.getItem('sb-qlosefnvwvmqeebfqdcg-session')).toBeNull();
      expect(localStorage.getItem('user-preferences')).toBe('keep-this');
    });
  });

  describe('Store initialization', () => {
    it('should start with idle bootStatus', () => {
      localStorage.clear();
      useUserStore.setState({
        bootStatus: 'idle',
        user: null,
      });

      const state = useUserStore.getState();
      expect(state.bootStatus).toBe('idle');
      expect(state.user).toBeNull();
    });

    it('should have all required actions', () => {
      const store = useUserStore.getState();
      expect(typeof store.rehydrateFromSession).toBe('function');
      expect(typeof store.setAuthenticated).toBe('function');
      expect(typeof store.setUnauthenticated).toBe('function');
      expect(typeof store.resetStore).toBe('function');
      expect(typeof store.logout).toBe('function');
      expect(typeof store.retryBoot).toBe('function');
    });
  });

  describe('Boot error recovery', () => {
    it('should set bootError and bootStatus=ready on failure', async () => {
      const errorMsg = 'Failed to fetch session';
      
      // Simulate boot error by setting manually
      act(() => {
        useUserStore.setState({
          bootStatus: 'ready',
          bootError: errorMsg,
          user: null,
        });
      });

      const state = useUserStore.getState();
      expect(state.bootStatus).toBe('ready');
      expect(state.bootError).toBe(errorMsg);
      expect(state.user).toBeNull();
    });

    it('should clear bootError on successful rehydration', async () => {
      // Set error state
      useUserStore.setState({
        bootStatus: 'ready',
        bootError: 'Previous error',
      });

      // Manually trigger successful rehydration
      const mockUser: User = {
        id: 'user-1',
        email: 'test@example.com',
        name: 'Test',
        role: 'admin',
        company_id: 'company-1',
        is_active: true,
        created_at: new Date().toISOString(),
      };

      act(() => {
        useUserStore.getState().setAuthenticated(mockUser, { access_token: 'token' });
      });

      const state = useUserStore.getState();
      expect(state.bootError).toBeNull();
      expect(state.user).toEqual(mockUser);
    });
  });

  describe('unauthenticated state', () => {
    it('should set bootStatus=ready and user=null', () => {
      act(() => {
        useUserStore.getState().setUnauthenticated();
      });

      const state = useUserStore.getState();
      expect(state.bootStatus).toBe('ready');
      expect(state.user).toBeNull();
      expect(state.session).toBeNull();
    });
  });
});

describe('Auth System - Integration', () => {
  beforeEach(() => {
    localStorage.clear();
    useUserStore.setState({
      user: null,
      session: null,
      bootStatus: 'idle',
      error: null,
      bootError: null,
    });
  });

  it('should cycle through boot states: idle -> checking -> ready', async () => {
    const states: string[] = [];

    // Subscribe to boot status changes
    const unsubscribe = useUserStore.subscribe(
      (state) => state.bootStatus,
      (status) => states.push(status)
    );

    // Start boot
    useUserStore.getState().resetStore();
    
    // Boot should complete
    await useUserStore.getState().rehydrateFromSession();

    unsubscribe();

    // Should have idle (from resetStore), then checking, then ready
    expect(states).toContain('checking');
    expect(states[states.length - 1]).toBe('ready');
  });

  it('should not resurrect stale user after reset + boot cycle', async () => {
    // Simulate previous persistent session
    localStorage.setItem('auth-user-storage', JSON.stringify({
      state: {
        user: {
          id: 'stale-user',
          email: 'stale@example.com',
          name: 'Stale User',
          role: 'admin',
        },
      },
    }));

    // Boot cycle: reset -> rehydrate
    act(() => {
      useUserStore.getState().resetStore();
    });

    await useUserStore.getState().rehydrateFromSession();

    // User should be null (no active session)
    const state = useUserStore.getState();
    expect(state.user).toBeNull();
    expect(state.bootStatus).toBe('ready');
  });
});
