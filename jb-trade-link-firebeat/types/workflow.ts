/**
 * Workflow Type Definitions
 * 
 * Central source of truth for all order, trip, return, and payment states
 * Defines valid state transitions per role and required fields
 * 
 * Phase 3.1: Status Model & Workflow Canon
 */

// ============ ORDER STATES ============
export type OrderStatus = 
  | 'DRAFT'
  | 'APPROVED'
  | 'DISPATCHED'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'FAILED'
  | 'RESCHEDULED'
  | 'CANCELLED'
  | 'RETURNED'
  | 'DAMAGED';

// ============ TRIP STATES ============
export type TripStatus =
  | 'DRAFT'
  | 'READY'
  | 'OUT_FOR_DELIVERY'
  | 'COMPLETED'
  | 'CANCELLED';

// ============ RETURN STATES ============
export type ReturnStatus =
  | 'INITIATED'
  | 'APPROVED'
  | 'IN_TRANSIT'
  | 'RECEIVED'
  | 'CLOSED'
  | 'REJECTED';

// ============ PAYMENT STATES ============
export type PaymentStatus =
  | 'PENDING'
  | 'RECORDED'
  | 'RECONCILED'
  | 'DISPUTED';

// ============ USER ROLES ============
export type UserRole = 'admin' | 'sales' | 'delivery';

// ============ VALID STATE TRANSITIONS ============
/**
 * Defines which roles can transition from one state to another
 * Format: { fromState: { role: [toStates] } }
 */
export const VALID_TRANSITIONS: Record<OrderStatus, Partial<Record<UserRole, OrderStatus[]>>> = {
  DRAFT: {
    sales: ['APPROVED', 'CANCELLED'],
    admin: ['APPROVED', 'CANCELLED', 'DRAFT']
  },
  APPROVED: {
    admin: ['DRAFT', 'DISPATCHED', 'CANCELLED'],
    sales: ['CANCELLED']
  },
  DISPATCHED: {
    admin: ['DRAFT', 'APPROVED', 'OUT_FOR_DELIVERY', 'CANCELLED'],
    delivery: ['OUT_FOR_DELIVERY']
  },
  OUT_FOR_DELIVERY: {
    delivery: ['DELIVERED', 'FAILED'],
    admin: ['DISPATCHED', 'DELIVERED', 'FAILED', 'CANCELLED']
  },
  DELIVERED: {
    delivery: ['RETURNED', 'DAMAGED'],
    admin: ['OUT_FOR_DELIVERY', 'RETURNED', 'DAMAGED', 'CANCELLED']
  },
  FAILED: {
    delivery: ['RESCHEDULED'],
    admin: ['OUT_FOR_DELIVERY', 'RESCHEDULED', 'CANCELLED']
  },
  RESCHEDULED: {
    admin: ['APPROVED', 'DISPATCHED', 'CANCELLED']
  },
  CANCELLED: {
    admin: ['DRAFT', 'APPROVED']
  },
  RETURNED: {
    admin: ['CANCELLED']
  },
  DAMAGED: {
    admin: ['CANCELLED']
  }
};

// ============ STATUS MESSAGES ============
/**
 * User-friendly messages for each status
 * Displayed in UI badges and notifications
 */
export const STATUS_MESSAGES: Record<OrderStatus, string> = {
  DRAFT: 'Awaiting approval',
  APPROVED: 'Ready for dispatch',
  DISPATCHED: 'Assigned to delivery trip',
  OUT_FOR_DELIVERY: 'Currently being delivered',
  DELIVERED: 'Successfully delivered',
  FAILED: 'Delivery failed - awaiting reschedule',
  RESCHEDULED: 'Rescheduled - awaiting re-dispatch',
  CANCELLED: 'Cancelled by manager',
  RETURNED: 'Returned to sender',
  DAMAGED: 'Marked as damaged'
};

// ============ TRANSITION REQUIREMENTS ============
/**
 * Required fields and validations for specific transitions
 * Used to enforce data completeness before allowing state changes
 */
export const TRANSITION_REQUIREMENTS: Record<string, {
  requiredFields: string[];
  requiresReason: boolean;
  requiresApproval?: boolean;
}> = {
  'APPROVED->CANCELLED': { 
    requiredFields: [], 
    requiresReason: true 
  },
  'OUT_FOR_DELIVERY->FAILED': { 
    requiredFields: ['failure_reason'], 
    requiresReason: true 
  },
  'DELIVERED->RETURNED': { 
    requiredFields: ['return_reason'], 
    requiresReason: true 
  },
  'FAILED->RESCHEDULED': { 
    requiredFields: ['new_delivery_date'], 
    requiresReason: true 
  }
};

// ============ STATE TRANSITION TYPES ============
export interface StateTransitionRequest {
  orderId: string;
  fromStatus: OrderStatus;
  toStatus: OrderStatus;
  userId: string;
  reason: string;
  metadata?: Record<string, any>;
}

export interface StateTransitionResponse {
  success: boolean;
  orderId: string;
  oldStatus: OrderStatus;
  newStatus: OrderStatus;
  transitionedAt: string;
  auditLogId: string;
  errors?: string[];
}

export interface StatusHistoryEntry {
  id: string;
  orderId: string;
  fromStatus: OrderStatus;
  toStatus: OrderStatus;
  reason: string;
  userId: string;
  userName?: string;
  createdAt: string;
  metadata?: Record<string, any>;
}

export interface AuditLogEntry {
  id: string;
  userId: string;
  userName?: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'STATUS_CHANGE';
  entityType: 'order' | 'trip' | 'return' | 'payment';
  entityId: string;
  oldData?: Record<string, any>;
  newData: Record<string, any>;
  reason?: string;
  metadata?: Record<string, any>;
  createdAt: string;
}
