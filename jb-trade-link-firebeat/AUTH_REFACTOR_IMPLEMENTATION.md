# 🚀 Auth Refactor - Implementation Guide

## 📋 Overview

This guide provides the exact implementation for refactoring the authentication system to production-grade quality.

---

## 🎯 Phase 1: Core Refactor (Immediate)

### Step 1: Create New Auth Service Structure

Create these new files:

```
services/auth/
├── index.ts                 # Public exports
├── AuthProvider.tsx         # React provider
├── useAuth.ts              # React hook
├── authService.ts          # Core auth logic
├── profileService.ts       # Profile management
├── sessionService.ts       # Session management
├── authTypes.ts            # Type definitions
├── authErrors.ts           # Error handling
└── authUtils.ts            # Utilities
```

---

### Step 2: Define Types (`authTypes.ts`)

```typescript
export enum AuthStatus {
  IDLE = 'idle',
  LOADING = 'loading',
  AUTHENTICATED = 'authenticated',
  UNAUTHENTICATED = 'unauthenticated',
  ERROR = 'error',
}

export type AuthState =
  | { status: AuthStatus.IDLE }
  | { status: AuthStatus.LOADING; message?: string }
  | { status: AuthStatus.AUTHENTICATED; user: User; session: Session }
  | { status: AuthStatus.UNAUTHENTICATED }
  | { status: AuthStatus.ERROR; error: AuthErrorType };

export interface AuthContextValue {
  state: AuthState;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  error: AuthErrorType | null;
}
```

---

### Step 3: Define Errors (`authErrors.ts`)

```typescript
export enum AuthErrorCode {
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  NETWORK_ERROR = 'NETWORK_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
  PROFILE_NOT_FOUND = 'PROFILE_NOT_FOUND',
  SESSION_EXPIRED = 'SESSION_EXPIRED',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export interface AuthErrorType {
  code: AuthErrorCode;
  message: string;
  retryable: boolean;
}

export const AUTH_ERRORS: Record<AuthErrorCode, AuthErrorType> = {
  [AuthErrorCode.INVALID_CREDENTIALS]: {
    code: AuthErrorCode.INVALID_CREDENTIALS,
    message: 'Invalid email or password. Please try again.',
    retryable: false,
  },
  [AuthErrorCode.NETWORK_ERROR]: {
    code: AuthErrorCode.NETWORK_ERROR,
    message: 'Network error. Please check your connection and try again.',
    retryable: true,
  },
  [AuthErrorCode.SERVER_ERROR]: {
    code: AuthErrorCode.SERVER_ERROR,
    message: 'Server error. Please try again in a moment.',
    retryable: true,
  },
  [AuthErrorCode.PROFILE_NOT_FOUND]: {
    code: AuthErrorCode.PROFILE_NOT_FOUND,
    message: 'Account profile not found. Please contact support.',
    retryable: false,
  },
  [AuthErrorCode.SESSION_EXPIRED]: {
    code: AuthErrorCode.SESSION_EXPIRED,
    message: 'Your session has expired. Please sign in again.',
    retryable: false,
  },
  [AuthErrorCode.UNKNOWN_ERROR]: {
    code: AuthErrorCode.UNKNOWN_ERROR,
    message: 'An unexpected error occurred. Please try again.',
    retryable: true,
  },
};

export function mapSupabaseError(error: any): AuthErrorType {
  if (error.message?.includes('Invalid login credentials')) {
    return AUTH_ERRORS[AuthErrorCode.INVALID_CREDENTIALS];
  }
  if (error.message?.includes('network') || error.code === 'ECONNREFUSED') {
    return AUTH_ERRORS[AuthErrorCode.NETWORK_ERROR];
  }
  if (error.code === 'PGRST116') {
    return AUTH_ERRORS[AuthErrorCode.PROFILE_NOT_FOUND];
  }
  return AUTH_ERRORS[AuthErrorCode.UNKNOWN_ERROR];
}
```

---

### Step 4: Core Auth Service (`authService.ts`)

```typescript
import { supabase } from '../../lib/supabase';
import { AuthErrorCode, mapSupabaseError } from './authErrors';
import { withRetry } from './authUtils';

export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    if (!data.session) throw new Error('No session returned');

    return {
      user: data.user,
      session: data.session,
    };
  } catch (error) {
    throw mapSupabaseError(error);
  }
}

export async function signOut() {
  try {
    await supabase.auth.signOut();
    
    // Clear Supabase storage
    clearSupabaseStorage();
  } catch (error) {
    console.error('Sign out error:', error);
    // Always clear local state even if signOut fails
    clearSupabaseStorage();
  }
}

export async function getSession() {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) throw error;
    
    return session;
  } catch (error) {
    throw mapSupabaseError(error);
  }
}

export async function refreshSession() {
  try {
    const { data: { session }, error } = await supabase.auth.refreshSession();
    
    if (error) throw error;
    
    return session;
  } catch (error) {
    throw mapSupabaseError(error);
  }
}

export function isSessionValid(session: Session | null): boolean {
  if (!session) return false;
  
  const expiresAt = session.expires_at;
  if (!expiresAt) return true; // No expiry means valid
  
  const now = Date.now() / 1000;
  const bufferSeconds = 60; // Refresh 1 minute before expiry
  
  return now < (expiresAt - bufferSeconds);
}

function clearSupabaseStorage() {
  try {
    // Clear localStorage
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith('sb-') || key.includes('supabase'))) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    // Clear sessionStorage
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && (key.startsWith('sb-') || key.includes('supabase'))) {
        sessionStorage.removeItem(key);
      }
    }
  } catch (error) {
    console.error('Error clearing storage:', error);
  }
}
```

---

### Step 5: Profile Service (`profileService.ts`)

```typescript
import { supabase } from '../../lib/supabase';
import { User } from '../../types';
import { mapSupabaseError } from './authErrors';
import { withRetry } from './authUtils';

export async function loadUserProfile(uid: string): Promise<User> {
  try {
    // Use retry logic for network resilience
    const profile = await withRetry(async () => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', uid)
        .single();

      if (error) throw error;
      if (!data) throw new Error('Profile not found');

      return data as User;
    });

    return profile;
  } catch (error) {
    throw mapSupabaseError(error);
  }
}

export async function updateUserProfile(uid: string, updates: Partial<User>): Promise<User> {
  try {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', uid)
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('Update failed');

    return data as User;
  } catch (error) {
    throw mapSupabaseError(error);
  }
}
```

---

### Step 6: Utilities (`authUtils.ts`)

```typescript
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  delayMs = 1000
): Promise<T> {
  let lastError: any;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      // Don't retry on non-retryable errors
      if (error.retryable === false) {
        throw error;
      }
      
      // Don't retry on last attempt
      if (attempt === maxRetries - 1) {
        throw error;
      }
      
      // Exponential backoff
      const delay = delayMs * Math.pow(2, attempt);
      await sleep(delay);
    }
  }

  throw lastError;
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function getDashboardPath(role: UserRole): string {
  switch (role) {
    case 'admin':
      return '/admin/dashboard';
    case 'sales':
    case 'salesperson':
      return '/sales/dashboard';
    case 'delivery':
      return '/delivery/dashboard';
    default:
      return '/login';
  }
}
```

---

### Step 7: Auth Provider (`AuthProvider.tsx`)

```typescript
import React, { createContext, useReducer, useEffect, useCallback } from 'react';
import { AuthState, AuthStatus, AuthContextValue } from './authTypes';
import { signIn, signOut, getSession, refreshSession, isSessionValid } from './authService';
import { loadUserProfile } from './profileService';
import { getDashboardPath } from './authUtils';
import { supabase } from '../../lib/supabase';

// Initial state
const initialState: AuthState = {
  status: AuthStatus.IDLE,
};

// Reducer
type AuthAction =
  | { type: 'SET_LOADING'; message?: string }
  | { type: 'SET_AUTHENTICATED'; user: User; session: Session }
  | { type: 'SET_UNAUTHENTICATED' }
  | { type: 'SET_ERROR'; error: AuthErrorType };

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_LOADING':
      return { status: AuthStatus.LOADING, message: action.message };
    case 'SET_AUTHENTICATED':
      return { status: AuthStatus.AUTHENTICATED, user: action.user, session: action.session };
    case 'SET_UNAUTHENTICATED':
      return { status: AuthStatus.UNAUTHENTICATED };
    case 'SET_ERROR':
      return { status: AuthStatus.ERROR, error: action.error };
    default:
      return state;
  }
}

// Context
export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Provider
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize auth state
  useEffect(() => {
    initializeAuth();
  }, []);

  // Listen to auth changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          await handleSignIn(session);
        } else if (event === 'SIGNED_OUT') {
          dispatch({ type: 'SET_UNAUTHENTICATED' });
        } else if (event === 'TOKEN_REFRESHED' && session) {
          await handleSignIn(session);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function initializeAuth() {
    try {
      dispatch({ type: 'SET_LOADING', message: 'Checking session...' });
      
      const session = await getSession();
      
      if (session && isSessionValid(session)) {
        await handleSignIn(session);
      } else {
        dispatch({ type: 'SET_UNAUTHENTICATED' });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', error });
    }
  }

  async function handleSignIn(session: Session) {
    try {
      dispatch({ type: 'SET_LOADING', message: 'Loading profile...' });
      
      const user = await loadUserProfile(session.user.id);
      
      dispatch({ type: 'SET_AUTHENTICATED', user, session });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', error });
    }
  }

  const login = useCallback(async (email: string, password: string) => {
    try {
      dispatch({ type: 'SET_LOADING', message: 'Signing in...' });
      
      const { user, session } = await signIn(email, password);
      const profile = await loadUserProfile(user.id);
      
      dispatch({ type: 'SET_AUTHENTICATED', user: profile, session });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', error });
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await signOut();
      dispatch({ type: 'SET_UNAUTHENTICATED' });
    } catch (error) {
      console.error('Logout error:', error);
      // Always clear state even on error
      dispatch({ type: 'SET_UNAUTHENTICATED' });
    }
  }, []);

  const refreshSessionCallback = useCallback(async () => {
    try {
      const session = await refreshSession();
      if (session) {
        await handleSignIn(session);
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', error });
    }
  }, []);

  const value: AuthContextValue = {
    state,
    login,
    logout,
    refreshSession: refreshSessionCallback,
    isAuthenticated: state.status === AuthStatus.AUTHENTICATED,
    isLoading: state.status === AuthStatus.LOADING,
    user: state.status === AuthStatus.AUTHENTICATED ? state.user : null,
    error: state.status === AuthStatus.ERROR ? state.error : null,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
```

---

### Step 8: Hook (`useAuth.ts`)

```typescript
import { useContext } from 'react';
import { AuthContext } from './AuthProvider';

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  
  return context;
}
```

---

## 🎨 UI Components

### Loading Overlay

```typescript
// components/auth/LoadingOverlay.tsx
export const LoadingOverlay: React.FC<{ message?: string }> = ({ message }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
        <p className="text-gray-700 font-medium">{message || 'Loading...'}</p>
      </div>
    </div>
  );
};
```

### Error Banner

```typescript
// components/auth/ErrorBanner.tsx
export const ErrorBanner: React.FC<{
  error: AuthErrorType;
  onRetry?: () => void;
  onDismiss?: () => void;
}> = ({ error, onRetry, onDismiss }) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
      <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-sm font-medium text-red-800">{error.message}</p>
        {error.retryable && onRetry && (
          <button
            onClick={onRetry}
            className="mt-2 text-sm font-medium text-red-600 hover:text-red-700"
          >
            Try again
          </button>
        )}
      </div>
      {onDismiss && (
        <button onClick={onDismiss} className="text-red-400 hover:text-red-600">
          <X className="h-5 w-5" />
        </button>
      )}
    </div>
  );
};
```

---

## 📝 Migration Steps

1. **Create new auth structure** (1 hour)
2. **Implement core services** (2 hours)
3. **Update AuthProvider** (1 hour)
4. **Update Login component** (1 hour)
5. **Update App.tsx** (30 min)
6. **Test thoroughly** (2 hours)
7. **Deploy** (30 min)

**Total Time: ~8 hours**

---

## ✅ Testing Checklist

- [ ] Login with valid credentials
- [ ] Login with invalid credentials
- [ ] Logout
- [ ] Session refresh
- [ ] Network error handling
- [ ] Slow connection handling
- [ ] Role-based navigation
- [ ] Multiple tabs
- [ ] Browser refresh
- [ ] Session expiry

---

**Ready to implement? I can start creating the new files now.**
