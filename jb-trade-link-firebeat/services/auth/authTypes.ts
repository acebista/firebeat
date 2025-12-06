import { User } from '../../types';
import { Session } from '@supabase/supabase-js';

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
    isInitialized: boolean; // Track if boot process is complete
    user: User | null;
    error: AuthErrorType | null;
}

export interface AuthErrorType {
    code: string;
    message: string;
    retryable: boolean;
}
