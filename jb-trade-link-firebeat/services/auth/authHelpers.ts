/**
 * Role-Based Access Control (RBAC) Utilities
 * 
 * Provides centralized helpers for checking user permissions and roles.
 * Single source of truth for authorization logic.
 */

import { User, UserRole } from '../types';

/**
 * Role hierarchy and permissions
 */
export const ROLE_CONFIG: Record<UserRole, {
  displayName: string;
  permissions: string[];
  canAccess: UserRole[];
}> = {
  admin: {
    displayName: 'Administrator',
    permissions: [
      'users.manage',
      'products.manage',
      'companies.manage',
      'orders.manage',
      'orders.approve',
      'orders.cancel',
      'trips.manage',
      'reports.view',
      'settings.manage',
      'system.health',
      'migration.run',
    ],
    canAccess: ['admin', 'sales', 'delivery', 'finance'],
  },
  sales: {
    displayName: 'Salesperson',
    permissions: [
      'orders.create',
      'orders.edit_own',
      'orders.view_own',
      'reports.view_own',
      'customers.view',
    ],
    canAccess: ['sales'],
  },
  delivery: {
    displayName: 'Delivery Agent',
    permissions: [
      'orders.view_assigned',
      'orders.update_status',
      'trips.view_assigned',
      'challan.print',
      'gps.track',
    ],
    canAccess: ['delivery'],
  },
  finance: {
    displayName: 'Finance',
    permissions: [
      'orders.view',
      'reports.view',
      'invoices.view',
      'payments.view',
    ],
    canAccess: ['finance'],
  },
};

/**
 * Check if a user has a specific role
 * @param user - The user object or null
 * @param role - The required role
 * @returns true if user has the role
 */
export function hasRole(user: User | null, role: UserRole): boolean {
  if (!user) return false;
  return user.role === role;
}

/**
 * Check if a user has one of multiple roles
 * @param user - The user object or null
 * @param roles - Array of acceptable roles
 * @returns true if user matches any of the roles
 */
export function hasAnyRole(user: User | null, roles: UserRole[]): boolean {
  if (!user) return false;
  return roles.includes(user.role);
}

/**
 * Check if a user can access a specific resource/feature
 * @param user - The user object or null
 * @param resource - The resource identifier (e.g., 'orders.create')
 * @returns true if user has permission for the resource
 */
export function canAccess(user: User | null, resource: string): boolean {
  if (!user) return false;
  const config = ROLE_CONFIG[user.role];
  if (!config) return false;
  return config.permissions.includes(resource);
}

/**
 * Check if a user can view a specific admin section
 * @param user - The user object or null
 * @param section - Admin section (e.g., 'users', 'orders', 'reports')
 * @returns true if user can access this admin section
 */
export function canAccessAdminSection(user: User | null, section: string): boolean {
  if (!user || user.role !== 'admin') return false;
  
  const allowedSections = [
    'dashboard',
    'users',
    'products',
    'companies',
    'orders',
    'dispatch',
    'trips',
    'vehicles',
    'purchases',
    'reports',
    'returns',
    'damages',
    'health',
    'migration',
  ];
  
  return allowedSections.includes(section);
}

/**
 * Check if a user is an administrator
 * @param user - The user object or null
 * @returns true if user is an admin
 */
export function isAdmin(user: User | null): boolean {
  return hasRole(user, 'admin');
}

/**
 * Check if a user is a salesperson
 * @param user - The user object or null
 * @returns true if user is a salesperson
 */
export function isSalesperson(user: User | null): boolean {
  return hasRole(user, 'sales');
}

/**
 * Check if a user is a delivery agent
 * @param user - The user object or null
 * @returns true if user is a delivery agent
 */
export function isDeliveryAgent(user: User | null): boolean {
  return hasRole(user, 'delivery');
}

/**
 * Check if a user is finance
 * @param user - The user object or null
 * @returns true if user is finance
 */
export function isFinance(user: User | null): boolean {
  return hasRole(user, 'finance');
}

/**
 * Get the display name for a role
 * @param role - The user role
 * @returns Human-readable role name
 */
export function getRoleDisplayName(role: UserRole | undefined): string {
  if (!role) return 'Unknown';
  return ROLE_CONFIG[role]?.displayName || role;
}

/**
 * Require a user to have a specific role, throw if not
 * Useful for API routes or server-side checks
 * 
 * @param user - The user object or null
 * @param requiredRole - The required role
 * @param context - Optional context for error message (e.g., 'create admin user')
 * @throws Error if user doesn't have the required role
 */
export function requireRole(
  user: User | null,
  requiredRole: UserRole,
  context?: string
): asserts user is User {
  if (!user) {
    throw new Error('Authentication required' + (context ? ` (${context})` : ''));
  }
  if (user.role !== requiredRole) {
    throw new Error(
      `Permission denied: ${requiredRole} access required` +
      (context ? ` (${context})` : '')
    );
  }
}

/**
 * Require a user to have one of multiple roles, throw if not
 * Useful for API routes or server-side checks
 * 
 * @param user - The user object or null
 * @param requiredRoles - Array of acceptable roles
 * @param context - Optional context for error message
 * @throws Error if user doesn't have any of the required roles
 */
export function requireAnyRole(
  user: User | null,
  requiredRoles: UserRole[],
  context?: string
): asserts user is User {
  if (!user) {
    throw new Error('Authentication required' + (context ? ` (${context})` : ''));
  }
  if (!requiredRoles.includes(user.role)) {
    throw new Error(
      `Permission denied: one of [${requiredRoles.join(', ')}] required` +
      (context ? ` (${context})` : '')
    );
  }
}

/**
 * Middleware for route handlers - checks role and throws 403 if unauthorized
 * @param user - The user object or null
 * @param requiredRole - The required role
 * @returns The user (type-asserted)
 */
export function guardRoute(
  user: User | null,
  requiredRole: UserRole
): User {
  if (!user) {
    const err = new Error('Unauthorized');
    (err as any).status = 401;
    throw err;
  }
  if (user.role !== requiredRole) {
    const err = new Error('Forbidden');
    (err as any).status = 403;
    throw err;
  }
  return user;
}

/**
 * Type-safe user check for conditional rendering
 * @param user - The user object or null
 * @returns true if user is authenticated and valid
 */
export function isAuthenticated(user: User | null): user is User {
  return !!user;
}

/**
 * Check if user can edit an order (owner or admin)
 * @param user - The user object
 * @param orderCreatedBy - Email of user who created the order
 * @returns true if user can edit
 */
export function canEditOrder(
  user: User | null,
  orderCreatedBy: string
): boolean {
  if (!user) return false;
  // Admin can always edit, owner can edit their own
  return isAdmin(user) || (isSalesperson(user) && user.email === orderCreatedBy);
}

/**
 * Check if user can view an order
 * @param user - The user object
 * @param orderCreatedBy - Email of user who created the order
 * @param orderAssignedDeliveryId - ID of delivery agent assigned
 * @returns true if user can view
 */
export function canViewOrder(
  user: User | null,
  orderCreatedBy: string,
  orderAssignedDeliveryId?: string
): boolean {
  if (!user) return false;
  if (isAdmin(user)) return true; // Admin can view all
  if (isSalesperson(user)) return user.email === orderCreatedBy; // Sales see own
  if (isDeliveryAgent(user)) return user.id === orderAssignedDeliveryId; // Delivery see assigned
  return false;
}
