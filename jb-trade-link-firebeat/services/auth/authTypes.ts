import { User } from '../../types';

export enum AuthStatus {
    LOADING = 'loading',
    AUTHENTICATED = 'authenticated',
    UNAUTHENTICATED = 'unauthenticated',
    ERROR = 'error',
}

export interface AuthErrorType {
    code?: string;
    message: string;
    retryable?: boolean;
}

export type AuthState =
    | { status: AuthStatus.LOADING; message?: string }
    | { status: AuthStatus.AUTHENTICATED; user: User }
    | { status: AuthStatus.UNAUTHENTICATED }
    | { status: AuthStatus.ERROR; error: AuthErrorType };

export interface AuthContextValue {
    state: AuthState;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    refreshSession: () => Promise<void>;
    isAuthenticated: boolean;
    isLoading: boolean;
    isInitialized: boolean;
    user: User | null;
    error: AuthErrorType | null;
}
