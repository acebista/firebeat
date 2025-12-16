// Main exports
export { AuthProvider, AuthContext } from './AuthProvider';
export { useAuth, useUser, useUserStoreData } from './useAuth';

// Types
export type { AuthContextValue, AuthState, AuthErrorType } from './authTypes';
export { AuthStatus } from './authTypes';

// Utilities & Helpers
export { getDashboardPath } from './authUtils';
export * from './authHelpers';  // Role/permission utilities
export * from './authSelectors'; // Store selectors & hooks
// Emergency cleanup (import to activate)
import './emergencyCleanup';
