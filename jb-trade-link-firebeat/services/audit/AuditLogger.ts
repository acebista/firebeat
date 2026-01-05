/**
 * Comprehensive Audit Logger Service
 * 
 * Tracks all critical operations across the application:
 * - Order status changes
 * - Trip modifications
 * - Payment transactions
 * - User actions
 * - System events
 * 
 * Features:
 * - Automatic user context capture
 * - Before/after state tracking
 * - Error logging
 * - Query helpers for audit trail retrieval
 */

import { supabase } from '../../lib/supabase';

export type AuditAction =
    // Order actions
    | 'ORDER_CREATED'
    | 'ORDER_UPDATED'
    | 'ORDER_STATUS_CHANGED'
    | 'ORDER_DELETED'
    | 'ORDER_ASSIGNED_TO_TRIP'
    | 'ORDER_REMOVED_FROM_TRIP'
    | 'ORDER_ITEMS_MODIFIED'

    // Trip actions
    | 'TRIP_CREATED'
    | 'TRIP_UPDATED'
    | 'TRIP_STATUS_CHANGED'
    | 'TRIP_COMPLETED'
    | 'TRIP_DELETED'
    | 'TRIP_ORDERS_BULK_UPDATE'

    // Payment actions
    | 'PAYMENT_RECORDED'
    | 'PAYMENT_VOIDED'
    | 'PAYMENT_UPDATED'

    // Delivery actions
    | 'DELIVERY_COMPLETED'
    | 'DELIVERY_FAILED'
    | 'RETURN_RECORDED'
    | 'DAMAGE_RECORDED'

    // User actions
    | 'USER_LOGIN'
    | 'USER_LOGOUT'
    | 'USER_CREATED'
    | 'USER_UPDATED'
    | 'USER_DELETED'

    // Product actions
    | 'PRODUCT_CREATED'
    | 'PRODUCT_UPDATED'
    | 'PRODUCT_DELETED'

    // Customer actions
    | 'CUSTOMER_CREATED'
    | 'CUSTOMER_UPDATED'
    | 'CUSTOMER_DELETED'

    // System actions
    | 'BULK_IMPORT'
    | 'BULK_UPDATE'
    | 'DATA_MIGRATION'
    | 'SYSTEM_ERROR';

export type EntityType =
    | 'order'
    | 'trip'
    | 'payment'
    | 'user'
    | 'product'
    | 'customer'
    | 'return'
    | 'damage'
    | 'system';

export interface AuditLogParams {
    action: AuditAction;
    entityType: EntityType;
    entityId: string;
    oldData?: any;
    newData?: any;
    reason?: string;
    metadata?: Record<string, any>;
    userId?: string; // Optional - will auto-detect if not provided
}

export interface AuditLogQuery {
    entityType?: EntityType;
    entityId?: string;
    action?: AuditAction;
    userId?: string;
    startDate?: string;
    endDate?: string;
    limit?: number;
}

export class AuditLogger {
    /**
     * Log an audit entry
     */
    static async log(params: AuditLogParams): Promise<{ success: boolean; id?: string; error?: string }> {
        try {
            // Auto-detect user if not provided
            let userId = params.userId;
            if (!userId) {
                const { data: { user } } = await supabase.auth.getUser();
                userId = user?.id;
            }

            // Prepare audit log entry
            const logEntry = {
                user_id: userId,
                action: params.action,
                entity_type: params.entityType,
                entity_id: params.entityId,
                old_data: params.oldData || null,
                new_data: params.newData || null,
                reason: params.reason || null,
                metadata: {
                    ...params.metadata,
                    timestamp: new Date().toISOString(),
                    userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server',
                },
            };

            // Insert into audit_logs table
            const { data, error } = await supabase
                .from('audit_logs')
                .insert(logEntry)
                .select('id')
                .single();

            if (error) {
                console.error('Failed to create audit log:', error);
                return { success: false, error: error.message };
            }

            return { success: true, id: data?.id };
        } catch (error) {
            console.error('Audit logging error:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }

    /**
     * Log order status change with full context
     */
    static async logOrderStatusChange(
        orderId: string,
        oldStatus: string,
        newStatus: string,
        reason?: string,
        metadata?: Record<string, any>
    ) {
        return this.log({
            action: 'ORDER_STATUS_CHANGED',
            entityType: 'order',
            entityId: orderId,
            oldData: { status: oldStatus },
            newData: { status: newStatus },
            reason,
            metadata,
        });
    }

    /**
     * Log trip status change
     */
    static async logTripStatusChange(
        tripId: string,
        oldStatus: string,
        newStatus: string,
        reason?: string,
        metadata?: Record<string, any>
    ) {
        return this.log({
            action: 'TRIP_STATUS_CHANGED',
            entityType: 'trip',
            entityId: tripId,
            oldData: { status: oldStatus },
            newData: { status: newStatus },
            reason,
            metadata,
        });
    }

    /**
     * Log bulk order update (dangerous operation)
     */
    static async logBulkOrderUpdate(
        tripId: string,
        orderIds: string[],
        operation: string,
        oldStatuses: Record<string, string>,
        newStatus: string,
        reason?: string
    ) {
        return this.log({
            action: 'TRIP_ORDERS_BULK_UPDATE',
            entityType: 'trip',
            entityId: tripId,
            oldData: { orderStatuses: oldStatuses },
            newData: { newStatus, orderCount: orderIds.length },
            reason: reason || `Bulk ${operation}`,
            metadata: {
                orderIds,
                operation,
                affectedCount: orderIds.length,
            },
        });
    }

    /**
     * Log payment transaction
     */
    static async logPayment(
        paymentId: string,
        invoiceId: string,
        amount: number,
        method: string,
        action: 'PAYMENT_RECORDED' | 'PAYMENT_VOIDED' | 'PAYMENT_UPDATED',
        metadata?: Record<string, any>
    ) {
        return this.log({
            action,
            entityType: 'payment',
            entityId: paymentId,
            newData: { invoiceId, amount, method },
            metadata: {
                ...metadata,
                invoiceId,
            },
        });
    }

    /**
     * Log delivery completion
     */
    static async logDelivery(
        orderId: string,
        success: boolean,
        paymentCollected: number,
        metadata?: Record<string, any>
    ) {
        return this.log({
            action: success ? 'DELIVERY_COMPLETED' : 'DELIVERY_FAILED',
            entityType: 'order',
            entityId: orderId,
            newData: {
                delivered: success,
                paymentCollected,
            },
            metadata,
        });
    }

    /**
     * Log returns and damages
     */
    static async logReturnOrDamage(
        orderId: string,
        type: 'return' | 'damage',
        items: any[],
        reason?: string
    ) {
        return this.log({
            action: type === 'return' ? 'RETURN_RECORDED' : 'DAMAGE_RECORDED',
            entityType: type,
            entityId: orderId,
            newData: { items },
            reason,
            metadata: {
                itemCount: items.length,
                totalValue: items.reduce((sum, item) => sum + (item.value || 0), 0),
            },
        });
    }

    /**
     * Log system errors for debugging
     */
    static async logError(
        operation: string,
        error: Error,
        context?: Record<string, any>
    ) {
        return this.log({
            action: 'SYSTEM_ERROR',
            entityType: 'system',
            entityId: `error_${Date.now()}`,
            newData: {
                operation,
                errorMessage: error.message,
                errorStack: error.stack,
            },
            metadata: {
                ...context,
                errorName: error.name,
            },
        });
    }

    /**
     * Query audit logs with filters
     */
    static async query(filters: AuditLogQuery = {}) {
        try {
            let query = supabase
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
          created_at
        `)
                .order('created_at', { ascending: false });

            // Apply filters
            if (filters.entityType) {
                query = query.eq('entity_type', filters.entityType);
            }
            if (filters.entityId) {
                query = query.eq('entity_id', filters.entityId);
            }
            if (filters.action) {
                query = query.eq('action', filters.action);
            }
            if (filters.userId) {
                query = query.eq('user_id', filters.userId);
            }
            if (filters.startDate) {
                query = query.gte('created_at', filters.startDate);
            }
            if (filters.endDate) {
                query = query.lte('created_at', filters.endDate);
            }
            if (filters.limit) {
                query = query.limit(filters.limit);
            }

            const { data, error } = await query;

            if (error) throw error;

            return { success: true, data };
        } catch (error) {
            console.error('Failed to query audit logs:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
                data: []
            };
        }
    }

    /**
     * Get audit trail for a specific entity
     */
    static async getEntityHistory(entityType: EntityType, entityId: string, limit = 50) {
        return this.query({ entityType, entityId, limit });
    }

    /**
     * Get recent activity for a user
     */
    static async getUserActivity(userId: string, limit = 100) {
        return this.query({ userId, limit });
    }

    /**
     * Get all changes in a date range
     */
    static async getChangesByDateRange(startDate: string, endDate: string, limit = 500) {
        return this.query({ startDate, endDate, limit });
    }

    /**
     * Search for specific actions
     */
    static async searchByAction(action: AuditAction, limit = 100) {
        return this.query({ action, limit });
    }
}
