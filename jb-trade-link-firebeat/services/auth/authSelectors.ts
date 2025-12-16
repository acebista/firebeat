/**
 * Zustand Store Selectors
 * 
 * Provides optimized selectors to prevent unnecessary component rerenders.
 * Use these instead of accessing the whole store state.
 * 
 * Example:
 *   const user = useUserStore(selectUser);          // Only rerender when user changes
 *   const isAuthenticated = useUserStore(selectIsAuthenticated);
 *   const canAccessAdmin = useUserStore(selectCanAccessAdmin);
 */

import { useUserStore } from './userStore';
import { User, UserRole } from '../../types';

// ============================================================================
// Basic Selectors (User & Session)
// ============================================================================

/**
 * Get the current authenticated user
 */
export const selectUser = (state: ReturnType<typeof useUserStore.getState>) =>
  state.user;

/**
 * Get the current session (should rarely be needed)
 */
export const selectSession = (state: ReturnType<typeof useUserStore.getState>) =>
  state.session;

/**
 * Get the user's email (for convenience)
 */
export const selectUserEmail = (state: ReturnType<typeof useUserStore.getState>) =>
  state.user?.email ?? null;

/**
 * Get the user's role
 */
export const selectUserRole = (state: ReturnType<typeof useUserStore.getState>) =>
  state.user?.role ?? null;

/**
 * Get the user's company ID
 */
export const selectUserCompanyId = (state: ReturnType<typeof useUserStore.getState>) =>
  state.user?.company_id ?? null;

// ============================================================================
// Authentication Status Selectors
// ============================================================================

/**
 * Check if user is authenticated
 */
export const selectIsAuthenticated = (state: ReturnType<typeof useUserStore.getState>) =>
  !!state.user;

/**
 * Get the current boot status
 */
export const selectBootStatus = (state: ReturnType<typeof useUserStore.getState>) =>
  state.bootStatus;

/**
 * Check if boot is in progress
 */
export const selectIsBooting = (state: ReturnType<typeof useUserStore.getState>) =>
  state.bootStatus === 'checking';

/**
 * Check if boot is complete
 */
export const selectIsBootComplete = (state: ReturnType<typeof useUserStore.getState>) =>
  state.bootStatus === 'ready';

// ============================================================================
// Error & Loading Selectors
// ============================================================================

/**
 * Get the general error message
 */
export const selectError = (state: ReturnType<typeof useUserStore.getState>) =>
  state.error;

/**
 * Get the boot error message
 */
export const selectBootError = (state: ReturnType<typeof useUserStore.getState>) =>
  state.bootError;

/**
 * Check if there's any error
 */
export const selectHasError = (state: ReturnType<typeof useUserStore.getState>) =>
  !!state.error || !!state.bootError;

// ============================================================================
// Role-Based Selectors
// ============================================================================

/**
 * Check if user is admin
 */
export const selectIsAdmin = (state: ReturnType<typeof useUserStore.getState>) =>
  state.user?.role === 'admin';

/**
 * Check if user is salesperson
 */
export const selectIsSalesperson = (state: ReturnType<typeof useUserStore.getState>) =>
  state.user?.role === 'sales';

/**
 * Check if user is delivery agent
 */
export const selectIsDeliveryAgent = (state: ReturnType<typeof useUserStore.getState>) =>
  state.user?.role === 'delivery';

/**
 * Check if user is finance
 */
export const selectIsFinance = (state: ReturnType<typeof useUserStore.getState>) =>
  state.user?.role === 'finance';

/**
 * Check if user has one of the given roles
 */
export const makeSelectHasRole = (allowedRoles: UserRole[]) =>
  (state: ReturnType<typeof useUserStore.getState>) =>
    allowedRoles.includes(state.user?.role as UserRole);

// ============================================================================
// Admin Access Selectors
// ============================================================================

/**
 * Check if user can access admin section
 */
export const selectCanAccessAdmin = (state: ReturnType<typeof useUserStore.getState>) =>
  state.user?.role === 'admin';

/**
 * Check if user can manage users
 */
export const selectCanManageUsers = (state: ReturnType<typeof useUserStore.getState>) =>
  state.user?.role === 'admin';

/**
 * Check if user can manage products
 */
export const selectCanManageProducts = (state: ReturnType<typeof useUserStore.getState>) =>
  state.user?.role === 'admin';

/**
 * Check if user can manage orders
 */
export const selectCanManageOrders = (state: ReturnType<typeof useUserStore.getState>) =>
  state.user?.role === 'admin';

/**
 * Check if user can run migrations
 */
export const selectCanRunMigrations = (state: ReturnType<typeof useUserStore.getState>) =>
  state.user?.role === 'admin';

// ============================================================================
// Hook Wrappers (for convenience)
// ============================================================================

/**
 * Hook to get the current authenticated user (with optimization)
 */
export function useCurrentUser() {
  return useUserStore(selectUser);
}

/**
 * Hook to check if user is authenticated
 */
export function useIsAuthenticated() {
  return useUserStore(selectIsAuthenticated);
}

/**
 * Hook to get the current user's role
 */
export function useUserRole() {
  return useUserStore(selectUserRole);
}

/**
 * Hook to check if user is admin
 */
export function useIsAdmin() {
  return useUserStore(selectIsAdmin);
}

/**
 * Hook to check if user is salesperson
 */
export function useIsSalesperson() {
  return useUserStore(selectIsSalesperson);
}

/**
 * Hook to check if user is delivery agent
 */
export function useIsDeliveryAgent() {
  return useUserStore(selectIsDeliveryAgent);
}

/**
 * Hook to check if user can access admin section
 */
export function useCanAccessAdmin() {
  return useUserStore(selectCanAccessAdmin);
}

/**
 * Hook to get boot status
 */
export function useBootStatus() {
  return useUserStore(selectBootStatus);
}

/**
 * Hook to check if boot is complete
 */
export function useIsBootComplete() {
  return useUserStore(selectIsBootComplete);
}

/**
 * Hook to get error message
 */
export function useAuthError() {
  return useUserStore(selectError);
}

/**
 * Hook to get boot error message
 */
export function useBootError() {
  return useUserStore(selectBootError);
}

/**
 * Hook to check if user has one of the given roles
 * 
 * @example
 *   const canAccess = useHasRole(['admin', 'finance']);
 */
export function useHasRole(allowedRoles: UserRole[]) {
  return useUserStore(makeSelectHasRole(allowedRoles));
}
