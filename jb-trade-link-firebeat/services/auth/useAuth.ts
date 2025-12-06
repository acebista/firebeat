import { useContext } from 'react';
import { AuthContext } from './AuthProvider';
import { useUserStore } from './userStore';

/**
 * Hook to access auth context
 * Must be used within AuthProvider
 */
export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }

    return context;
}

/**
 * Hook to get current user (convenience)
 * Falls back to Zustand store if needed
 */
export function useUser() {
    try {
        const { user } = useAuth();
        return user;
    } catch (e) {
        // If auth context is not available, try to get from Zustand store
        const { user } = useUserStore();
        return user;
    }
}

/**
 * Hook to access Zustand user store directly
 * Useful for components that need direct access to persistent user state
 */
export function useUserStoreData() {
    return useUserStore();
}
