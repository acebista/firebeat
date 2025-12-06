import { UserRole } from '../../types';

/**
 * Retry a function with exponential backoff
 */
export async function withRetry<T>(
    fn: () => Promise<T>,
    maxRetries = 3,
    delayMs = 1000
): Promise<T> {
    let lastError: any;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            return await fn();
        } catch (error: any) {
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

/**
 * Sleep for specified milliseconds
 */
export function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Get dashboard path based on user role
 */
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

/**
 * Clear Supabase-related storage and all app data - PRODUCTION GRADE
 */
export function clearSupabaseStorage(): void {
    try {
        // Clear ALL localStorage (complete clean slate)
        localStorage.clear();

        // Clear ALL sessionStorage (complete clean slate)
        sessionStorage.clear();
    } catch (error) {
        // Log only in development
        if (process.env.NODE_ENV === 'development') {
            console.error('Error clearing storage:', error);
        }

        // Fallback: Try to clear Supabase keys at minimum
        try {
            const localKeysToRemove: string[] = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && (key.startsWith('sb-') || key.includes('supabase'))) {
                    localKeysToRemove.push(key);
                }
            }
            localKeysToRemove.forEach(key => localStorage.removeItem(key));

            const sessionKeysToRemove: string[] = [];
            for (let i = 0; i < sessionStorage.length; i++) {
                const key = sessionStorage.key(i);
                if (key && (key.startsWith('sb-') || key.includes('supabase'))) {
                    sessionKeysToRemove.push(key);
                }
            }
            sessionKeysToRemove.forEach(key => sessionStorage.removeItem(key));
        } catch (fallbackError) {
            // Silent fail in production
        }
    }
}

/**
 * Detect if auth state is corrupted - PRODUCTION GRADE
 * Returns true if corrupted state is detected
 */
export function detectCorruptedAuthState(): boolean {
    try {
        // Check for orphaned Supabase keys
        const supabaseKeys: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && (key.startsWith('sb-') || key.includes('supabase'))) {
                supabaseKeys.push(key);
            }
        }

        if (supabaseKeys.length > 0) {
            // Try to parse auth data
            for (const key of supabaseKeys) {
                try {
                    const value = localStorage.getItem(key);
                    if (value) {
                        JSON.parse(value); // Will throw if corrupted
                    }
                } catch (parseError) {
                    // Corrupted data detected
                    return true;
                }
            }
        }

        return false;
    } catch (error) {
        // Assume corrupted if we can't check
        return true;
    }
}
