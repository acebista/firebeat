/**
 * State Manager Service
 * 
 * Centralized workflow engine for managing order state transitions
 * Handles validation, audit logging, and persistence
 * 
 * Phase 3.1: Status Model & Workflow Canon
 */

import { supabase } from '../../lib/supabase';
import {
  OrderStatus,
  UserRole,
  VALID_TRANSITIONS,
  STATUS_MESSAGES,
  TRANSITION_REQUIREMENTS,
  StateTransitionRequest,
  StateTransitionResponse,
  StatusHistoryEntry,
  AuditLogEntry
} from '@/types/workflow';

export class StateManager {
  /**
   * Check if a specific role can transition from one state to another
   */
  static canTransition(
    currentStatus: OrderStatus,
    targetStatus: OrderStatus,
    userRole: UserRole
  ): boolean {
    const validTargets = VALID_TRANSITIONS[currentStatus]?.[userRole] || [];
    return validTargets.includes(targetStatus);
  }

  /**
   * Get all valid transitions for a given state and role
   */
  static getValidTransitions(
    currentStatus: OrderStatus,
    userRole: UserRole
  ): OrderStatus[] {
    return VALID_TRANSITIONS[currentStatus]?.[userRole] || [];
  }

  /**
   * Get user-friendly message for a status
   */
  static getStatusMessage(status: OrderStatus): string {
    return STATUS_MESSAGES[status] || status;
  }

  /**
   * Execute a state transition with full audit trail
   * This is the main method for changing order status
   */
  static async executeTransition(
    request: StateTransitionRequest,
    userRole: UserRole
  ): Promise<StateTransitionResponse> {
    const { orderId, fromStatus, toStatus, userId, reason, metadata } = request;
    const transitionedAt = new Date().toISOString();

    try {
      // 1. Validate transition is allowed
      if (!this.canTransition(fromStatus, toStatus, userRole)) {
        return {
          success: false,
          orderId,
          oldStatus: fromStatus,
          newStatus: toStatus,
          transitionedAt,
          auditLogId: '',
          errors: [`Invalid transition from ${fromStatus} to ${toStatus} for role ${userRole}`]
        };
      }

      // 2. Check required fields for this specific transition
      const transitionKey = `${fromStatus}->${toStatus}`;
      const requirements = TRANSITION_REQUIREMENTS[transitionKey];
      
      if (requirements?.requiresReason && !reason) {
        return {
          success: false,
          orderId,
          oldStatus: fromStatus,
          newStatus: toStatus,
          transitionedAt,
          auditLogId: '',
          errors: [`Reason is required for ${fromStatus} → ${toStatus} transition`]
        };
      }

      if (requirements?.requiredFields) {
        const missingFields = requirements.requiredFields.filter(
          field => !metadata?.[field]
        );
        if (missingFields.length > 0) {
          return {
            success: false,
            orderId,
            oldStatus: fromStatus,
            newStatus: toStatus,
            transitionedAt,
            auditLogId: '',
            errors: [`Missing required fields: ${missingFields.join(', ')}`]
          };
        }
      }

      // 3. Fetch current order data for audit log
      const { data: order, error: fetchError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

      if (fetchError || !order) {
        return {
          success: false,
          orderId,
          oldStatus: fromStatus,
          newStatus: toStatus,
          transitionedAt,
          auditLogId: '',
          errors: [`Order not found: ${fetchError?.message || 'Unknown error'}`]
        };
      }

      // 4. Create audit log entry
      const { data: auditLog, error: auditError } = await supabase
        .from('audit_logs')
        .insert({
          user_id: userId,
          action: 'STATUS_CHANGE',
          entity_type: 'order',
          entity_id: orderId,
          old_data: { status: fromStatus },
          new_data: { status: toStatus },
          reason,
          metadata: {
            ...metadata,
            userRole,
            source: 'state_manager'
          }
        })
        .select('id')
        .single();

      if (auditError) {
        return {
          success: false,
          orderId,
          oldStatus: fromStatus,
          newStatus: toStatus,
          transitionedAt,
          auditLogId: '',
          errors: [`Failed to create audit log: ${auditError.message}`]
        };
      }

      // 5. Update order status in database
      const { error: updateError } = await supabase
        .from('orders')
        .update({
          status: toStatus,
          status_updated_at: transitionedAt,
          status_updated_by: userId
        })
        .eq('id', orderId);

      if (updateError) {
        return {
          success: false,
          orderId,
          oldStatus: fromStatus,
          newStatus: toStatus,
          transitionedAt,
          auditLogId: auditLog?.id || '',
          errors: [`Failed to update order: ${updateError.message}`]
        };
      }

      // 6. Create status history entry (for tracking)
      const { error: historyError } = await supabase
        .from('order_status_history')
        .insert({
          order_id: orderId,
          from_status: fromStatus,
          to_status: toStatus,
          reason,
          user_id: userId,
          metadata
        });

      if (historyError) {
        console.warn('Failed to create status history:', historyError.message);
        // Don't fail the transition if history entry fails
      }

      return {
        success: true,
        orderId,
        oldStatus: fromStatus,
        newStatus: toStatus,
        transitionedAt,
        auditLogId: auditLog?.id || ''
      };
    } catch (error) {
      return {
        success: false,
        orderId,
        oldStatus: fromStatus,
        newStatus: toStatus,
        transitionedAt,
        auditLogId: '',
        errors: [`Unexpected error: ${error instanceof Error ? error.message : 'Unknown'}`]
      };
    }
  }

  /**
   * Get complete status history for an order
   */
  static async getStatusHistory(orderId: string): Promise<StatusHistoryEntry[]> {
    const { data, error } = await supabase
      .from('order_status_history')
      .select(`
        id,
        order_id,
        from_status,
        to_status,
        reason,
        user_id,
        metadata,
        created_at,
        auth_users:user_id(email, user_metadata)
      `)
      .eq('order_id', orderId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []).map((entry: any) => ({
      id: entry.id,
      orderId: entry.order_id,
      fromStatus: entry.from_status,
      toStatus: entry.to_status,
      reason: entry.reason,
      userId: entry.user_id,
      userName: entry.auth_users?.email,
      createdAt: entry.created_at,
      metadata: entry.metadata
    }));
  }

  /**
   * Get audit log entries for an order
   */
  static async getAuditLog(orderId: string): Promise<AuditLogEntry[]> {
    const { data, error } = await supabase
      .from('audit_logs')
      .select(`
        id,
        user_id,
        action,
        entity_type,
        entity_id,
        old_data,
        new_data,
        reason,
        metadata,
        created_at,
        auth_users:user_id(email, user_metadata)
      `)
      .eq('entity_id', orderId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []).map((entry: any) => ({
      id: entry.id,
      userId: entry.user_id,
      userName: entry.auth_users?.email,
      action: entry.action,
      entityType: entry.entity_type,
      entityId: entry.entity_id,
      oldData: entry.old_data,
      newData: entry.new_data,
      reason: entry.reason,
      metadata: entry.metadata,
      createdAt: entry.created_at
    }));
  }

  /**
   * Get user's role-specific transitions for current status
   * Useful for populating action buttons/menus
   */
  static getAvailableActions(
    currentStatus: OrderStatus,
    userRole: UserRole
  ): Array<{ toStatus: OrderStatus; label: string; requiresReason: boolean }> {
    const validTargets = this.getValidTransitions(currentStatus, userRole);

    return validTargets.map(toStatus => ({
      toStatus,
      label: `Mark as ${STATUS_MESSAGES[toStatus]}`,
      requiresReason: TRANSITION_REQUIREMENTS[`${currentStatus}->${toStatus}`]?.requiresReason || false
    }));
  }

  /**
   * Validate if all requirements are met for a transition (async version for component usage)
   * Fetches order data and validates requirements
   */
  static async validateTransitionRequirements(
    orderId: string,
    toStatus: OrderStatus
  ): Promise<boolean> {
    try {
      // Fetch current order to get current status
      const { data: order, error: fetchError } = await supabase
        .from('orders')
        .select('status')
        .eq('id', orderId)
        .single();

      if (fetchError || !order) {
        return false;
      }

      const fromStatus = order.status as OrderStatus;
      const transitionKey = `${fromStatus}->${toStatus}`;
      const requirements = TRANSITION_REQUIREMENTS[transitionKey];

      // If no specific requirements, transition is valid
      if (!requirements) {
        return true;
      }

      // Check if required fields exist in order
      if (requirements.requiredFields && requirements.requiredFields.length > 0) {
        const { data: fullOrder } = await supabase
          .from('orders')
          .select('*')
          .eq('id', orderId)
          .single();

        if (!fullOrder) return false;

        for (const field of requirements.requiredFields) {
          if (!(field in fullOrder) || !fullOrder[field as keyof typeof fullOrder]) {
            return false;
          }
        }
      }

      return true;
    } catch (error) {
      console.error('Error validating transition requirements:', error);
      return false;
    }
  }

  /**
   * Validate transition requirements synchronously (returns errors)
   */
  static validateTransitionRequirementsSync(
    fromStatus: OrderStatus,
    toStatus: OrderStatus,
    metadata?: Record<string, any>
  ): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    const transitionKey = `${fromStatus}->${toStatus}`;
    const requirements = TRANSITION_REQUIREMENTS[transitionKey];

    if (!requirements) {
      return { valid: true, errors: [] };
    }

    if (requirements.requiredFields) {
      for (const field of requirements.requiredFields) {
        if (!metadata?.[field]) {
          errors.push(`Missing required field: ${field}`);
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}
