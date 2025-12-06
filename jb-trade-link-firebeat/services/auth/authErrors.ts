import { AuthErrorType } from './authTypes';

export enum AuthErrorCode {
    INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
    NETWORK_ERROR = 'NETWORK_ERROR',
    SERVER_ERROR = 'SERVER_ERROR',
    PROFILE_NOT_FOUND = 'PROFILE_NOT_FOUND',
    SESSION_EXPIRED = 'SESSION_EXPIRED',
    UNKNOWN_ERROR = 'UNKNOWN_ERROR',
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
    // Invalid credentials
    if (error.message?.includes('Invalid login credentials')) {
        return AUTH_ERRORS[AuthErrorCode.INVALID_CREDENTIALS];
    }

    // Network errors
    if (error.message?.includes('network') ||
        error.message?.includes('fetch') ||
        error.code === 'ECONNREFUSED' ||
        error.name === 'NetworkError') {
        return AUTH_ERRORS[AuthErrorCode.NETWORK_ERROR];
    }

    // Profile not found
    if (error.code === 'PGRST116') {
        return AUTH_ERRORS[AuthErrorCode.PROFILE_NOT_FOUND];
    }

    // Session expired
    if (error.message?.includes('expired') || error.message?.includes('JWT')) {
        return AUTH_ERRORS[AuthErrorCode.SESSION_EXPIRED];
    }

    // Server errors
    if (error.status >= 500 || error.code?.startsWith('5')) {
        return AUTH_ERRORS[AuthErrorCode.SERVER_ERROR];
    }

    // Default to unknown error
    return {
        ...AUTH_ERRORS[AuthErrorCode.UNKNOWN_ERROR],
        message: error.message || AUTH_ERRORS[AuthErrorCode.UNKNOWN_ERROR].message,
    };
}
