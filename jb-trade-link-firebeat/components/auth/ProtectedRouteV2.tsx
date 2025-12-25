/**
 * Advanced Protected Route Component
 * 
 * Uses role-based access control with better error handling and fallbacks.
 * Prevents rendering flashes by checking store before rendering.
 * 
 * Usage:
 *   <Routes>
 *     <Route element={<ProtectedRouteV2 allowedRoles={['admin']} />}>
 *       <Route path="/admin/users" element={<UserManagement />} />
 *     </Route>
 *   </Routes>
 */

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useUserStore } from '../../services/auth/userStore';
import { LoadingOverlay } from './LoadingOverlay';
import { UserRole } from '../../types';

interface ProtectedRouteV2Props {
  allowedRoles: UserRole[];
  fallbackPath?: string;  // Where to redirect unauthorized users (default: their role dashboard)
}

/**
 * Enhanced protected route with proper error handling
 * - Waits for boot to complete before showing content or redirecting
 * - Shows error with retry if boot fails
 * - Prevents flash of unauthorized content
 * - Type-safe with Zustand selectors
 */
export const ProtectedRouteV2: React.FC<ProtectedRouteV2Props> = ({
  allowedRoles,
  fallbackPath,
}) => {
  const bootStatus = useUserStore((state) => state.bootStatus);
  const user = useUserStore((state) => state.user);
  const bootError = useUserStore((state) => state.bootError);
  const retryBoot = useUserStore((state) => state.retryBoot);

  // Still checking - show loading
  if (bootStatus === 'checking') {
    return <LoadingOverlay message="Verifying session..." />;
  }

  // Boot failed - show error with retry
  if (bootError && !user) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full mx-4">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-red-600 mb-2">
              ⚠️ Session Verification Failed
            </h2>
            <p className="text-gray-600 text-sm">{bootError}</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => retryBoot()}
              className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition font-medium"
            >
              Try Again
            </button>
            <button
              onClick={() => {
                window.location.href = '/#/login';
              }}
              className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition font-medium"
            >
              Go to Login
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-4">
            If this persists, try clearing your browser cache (Settings → Clear All Storage).
          </p>
        </div>
      </div>
    );
  }

  // Boot complete but no user - redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // User doesn't have required role - redirect to their dashboard
  if (!allowedRoles.includes(user.role)) {
    const dashboardPaths: Record<UserRole, string> = {
      admin: '/admin/dashboard',
      sales: '/sales/dashboard',
      delivery: '/delivery/dashboard',
    };
    return <Navigate to={fallbackPath || dashboardPaths[user.role] || '/login'} replace />;
  }

  // User is authorized - render protected content
  return (
    <>
      <Outlet />
    </>
  );
};

/**
 * HOC for protecting individual page components
 * 
 * Usage:
 *   export default withAuth(UserManagement, ['admin']);
 */
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  allowedRoles: UserRole[],
  fallbackPath?: string
): React.FC<P> {
  return (props: P) => {
    const bootStatus = useUserStore((state) => state.bootStatus);
    const user = useUserStore((state) => state.user);
    const bootError = useUserStore((state) => state.bootError);
    const retryBoot = useUserStore((state) => state.retryBoot);

    // Still checking
    if (bootStatus === 'checking') {
      return <LoadingOverlay message="Verifying session..." />;
    }

    // Boot failed
    if (bootError && !user) {
      return (
        <div className="flex items-center justify-center h-screen bg-gray-50 p-4">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-lg font-bold text-red-600 mb-2">
              Session Verification Failed
            </h2>
            <p className="text-sm text-gray-600 mb-4">{bootError}</p>
            <button
              onClick={() => retryBoot()}
              className="w-full bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition mb-2"
            >
              Try Again
            </button>
            <button
              onClick={() => {
                window.location.href = '/#/login';
              }}
              className="w-full bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition"
            >
              Go to Login
            </button>
          </div>
        </div>
      );
    }

    // No user
    if (!user) {
      return <Navigate to="/login" replace />;
    }

    // Wrong role
    if (!allowedRoles.includes(user.role)) {
      const dashboardPaths: Record<UserRole, string> = {
        admin: '/admin/dashboard',
        sales: '/sales/dashboard',
        delivery: '/delivery/dashboard',
      };
      return <Navigate to={fallbackPath || dashboardPaths[user.role] || '/login'} replace />;
    }

    // Authorized - render component
    return <Component {...props} />;
  };
}
