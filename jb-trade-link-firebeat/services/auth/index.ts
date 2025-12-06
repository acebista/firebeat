// Main exports
export { AuthProvider, AuthContext } from './AuthProvider';
export { useAuth, useUser, useUserStoreData } from './useAuth';

// Types
export type { AuthContextValue, AuthState, AuthErrorType } from './authTypes';
export { AuthStatus } from './authTypes';

// Utilities
export { getDashboardPath } from './authUtils';

// Zustand store (for state management)
export { useUserStore, clearStaleUserData, subscribeToUserChanges } from './userStore';

// Services (for advanced usage)
export * from './authService';
export * from './profileService';

// Emergency cleanup (import to activate)
import './emergencyCleanup';
