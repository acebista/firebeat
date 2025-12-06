# Phase 3.1 Integration Examples & Code Snippets

**Status**: Ready for UI component implementation  
**Date**: December 6, 2025  
**Phase**: 3.1 - Status Model & Workflow Canon  
**Commit**: `eb0bafa`

---

## Table of Contents

1. [Basic Status Badge Usage](#basic-status-badge-usage)
2. [State Transition Validation](#state-transition-validation)
3. [Getting Available Actions](#getting-available-actions)
4. [Executing State Transitions](#executing-state-transitions)
5. [Displaying Status History](#displaying-status-history)
6. [Audit Log Integration](#audit-log-integration)
7. [UI Component Integration Examples](#ui-component-integration-examples)
8. [Real-World Scenarios](#real-world-scenarios)

---

## Basic Status Badge Usage

### Simple Status Display

```typescript
import { StatusBadge } from '@/components/shared/StatusBadge';
import { OrderStatus } from '@/types/workflow';

interface OrderCardProps {
  orderId: string;
  status: OrderStatus;
}

export function OrderCard({ orderId, status }: OrderCardProps) {
  return (
    <div className="p-4 border rounded-lg">
      <h3>Order {orderId}</h3>
      <div className="mt-4">
        <StatusBadge status={status} size="md" showMessage={true} />
      </div>
    </div>
  );
}
```

### With Message Tooltip

```typescript
import { StatusBadge } from '@/components/shared/StatusBadge';

export function OrderRow({ order }) {
  return (
    <tr>
      <td>{order.id}</td>
      <td>{order.customer_name}</td>
      <td>
        <StatusBadge 
          status={order.status}
          size="sm"
          showMessage={true}
          className="inline-block"
        />
      </td>
      <td>{order.created_at}</td>
    </tr>
  );
}
```

### Different Sizes

```typescript
export function StatusBadgeSizes() {
  return (
    <div className="space-y-4 p-4">
      {/* Small badge - for tables/lists */}
      <div>
        <p className="text-sm mb-2">Small (sm)</p>
        <StatusBadge status="DELIVERED" size="sm" />
      </div>

      {/* Medium badge - default, for most UI elements */}
      <div>
        <p className="text-sm mb-2">Medium (md)</p>
        <StatusBadge status="OUT_FOR_DELIVERY" size="md" showMessage={true} />
      </div>

      {/* Large badge - for detail pages, modals */}
      <div>
        <p className="text-sm mb-2">Large (lg)</p>
        <StatusBadge status="APPROVED" size="lg" showMessage={true} />
      </div>
    </div>
  );
}
```

---

## State Transition Validation

### Check If Transition Is Allowed

```typescript
import { StateManager } from '@/services/workflow/stateManager';
import { OrderStatus, UserRole } from '@/types/workflow';

export function OrderActionButtons({ orderId, currentStatus, userRole }: {
  orderId: string;
  currentStatus: OrderStatus;
  userRole: UserRole;
}) {
  const handleApprove = async () => {
    // Check if user can transition to APPROVED
    if (!StateManager.canTransition(currentStatus, 'APPROVED', userRole)) {
      alert(`You cannot approve from ${currentStatus} status`);
      return;
    }

    // Proceed with transition
    await StateManager.executeTransition({
      entityId: orderId,
      entityType: 'order',
      currentStatus,
      targetStatus: 'APPROVED',
      userRole,
      userId: getUserId(), // from auth context
      reason: 'Approved by manager'
    });
  };

  return (
    <button 
      onClick={handleApprove}
      disabled={!StateManager.canTransition(currentStatus, 'APPROVED', userRole)}
    >
      Approve Order
    </button>
  );
}
```

### Validate Multiple Fields

```typescript
import { StateManager } from '@/services/workflow/stateManager';
import { TRANSITION_REQUIREMENTS } from '@/types/workflow';

export async function validateDispatch(order: Order): Promise<boolean> {
  const currentStatus = 'APPROVED';
  const targetStatus = 'DISPATCHED';

  // Get requirements for this transition
  const requirements = TRANSITION_REQUIREMENTS[currentStatus]?.[targetStatus];
  
  if (!requirements) {
    console.error(`No transition defined from ${currentStatus} to ${targetStatus}`);
    return false;
  }

  // Check all required fields
  const errors: string[] = [];

  if (requirements.includes('address') && !order.delivery_address) {
    errors.push('Delivery address is required');
  }

  if (requirements.includes('phone') && !order.customer_phone) {
    errors.push('Customer phone number is required');
  }

  if (requirements.includes('assigned_agent') && !order.assigned_agent_id) {
    errors.push('Delivery agent must be assigned');
  }

  if (errors.length > 0) {
    throw new Error(`Cannot dispatch order:\n${errors.join('\n')}`);
  }

  // All requirements met
  const valid = await StateManager.validateTransitionRequirements(
    order.id,
    targetStatus
  );

  return valid;
}
```

---

## Getting Available Actions

### Display Action Buttons Based on Role & Status

```typescript
import { StateManager } from '@/services/workflow/stateManager';
import { useAuth } from '@/hooks/useAuth';
import { useOrder } from '@/hooks/useOrder';

export function OrderDetailActions() {
  const { user } = useAuth();
  const { order } = useOrder();

  // Get all valid transitions for this order and user role
  const validTransitions = StateManager.getValidTransitions(
    order.status,
    user.role as UserRole
  );

  // Get friendly descriptions for each action
  const availableActions = validTransitions.map(targetStatus => ({
    status: targetStatus,
    message: StateManager.getStatusMessage(targetStatus),
    label: getActionLabel(order.status, targetStatus)
  }));

  return (
    <div className="flex gap-2">
      {availableActions.length === 0 && (
        <p className="text-gray-500">No actions available for this order</p>
      )}

      {availableActions.map(action => (
        <button
          key={action.status}
          onClick={() => handleTransition(action.status)}
          className="px-4 py-2 bg-blue-500 text-white rounded"
          title={action.message}
        >
          {action.label}
        </button>
      ))}
    </div>
  );
}

function getActionLabel(from: OrderStatus, to: OrderStatus): string {
  const labels: Record<string, string> = {
    'APPROVED': 'Approve Order',
    'DISPATCHED': 'Dispatch',
    'OUT_FOR_DELIVERY': 'Mark Out for Delivery',
    'DELIVERED': 'Confirm Delivery',
    'FAILED': 'Mark as Failed',
    'RESCHEDULED': 'Reschedule',
    'CANCELLED': 'Cancel Order',
  };
  return labels[to] || `Mark as ${to}`;
}
```

---

## Executing State Transitions

### Complete State Transition with Error Handling

```typescript
import { StateManager } from '@/services/workflow/stateManager';
import { toast } from 'react-hot-toast';

export async function handleStateTransition(
  orderId: string,
  currentStatus: OrderStatus,
  targetStatus: OrderStatus,
  userRole: UserRole,
  userId: string,
  notes?: string
) {
  try {
    // 1. Validate permission
    if (!StateManager.canTransition(currentStatus, targetStatus, userRole)) {
      toast.error(`You cannot transition from ${currentStatus} to ${targetStatus}`);
      return;
    }

    // 2. Validate requirements
    const isValid = await StateManager.validateTransitionRequirements(
      orderId,
      targetStatus
    );

    if (!isValid) {
      toast.error('Order does not meet requirements for this transition');
      return;
    }

    // 3. Show loading
    toast.loading('Processing transition...');

    // 4. Execute transition
    const response = await StateManager.executeTransition({
      entityId: orderId,
      entityType: 'order',
      currentStatus,
      targetStatus,
      userRole,
      userId,
      reason: notes || StateManager.getStatusMessage(targetStatus),
      metadata: {
        timestamp: new Date().toISOString(),
        ipAddress: getCurrentIP() // if tracking needed
      }
    });

    // 5. Handle success
    if (response.success) {
      toast.dismiss();
      toast.success(`Order ${StateManager.getStatusMessage(targetStatus)}`);
      
      // Refresh order data
      await refetchOrder(orderId);
      
      return response;
    } else {
      toast.dismiss();
      toast.error(response.error || 'Transition failed');
      return null;
    }

  } catch (error) {
    toast.dismiss();
    console.error('State transition error:', error);
    toast.error(`Failed: ${error.message}`);
    return null;
  }
}
```

### Transition with Confirmation Modal

```typescript
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/Dialog';
import { StateManager } from '@/services/workflow/stateManager';

export function StateTransitionModal({
  isOpen,
  order,
  targetStatus,
  userRole,
  userId,
  onSuccess,
  onClose
}: {
  isOpen: boolean;
  order: Order;
  targetStatus: OrderStatus;
  userRole: UserRole;
  userId: string;
  onSuccess: (response: StateTransitionResponse) => void;
  onClose: () => void;
}) {
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      const response = await StateManager.executeTransition({
        entityId: order.id,
        entityType: 'order',
        currentStatus: order.status,
        targetStatus,
        userRole,
        userId,
        reason: notes || StateManager.getStatusMessage(targetStatus)
      });

      if (response.success) {
        toast.success('Order status updated');
        onSuccess(response);
        onClose();
      }
    } catch (error) {
      toast.error('Failed to update status');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Status Change</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-2">Current Status</p>
            <StatusBadge status={order.status} size="md" showMessage={true} />
          </div>

          <div>
            <p className="text-sm font-medium mb-2">New Status</p>
            <StatusBadge status={targetStatus} size="md" showMessage={true} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes about this transition..."
              className="w-full p-2 border rounded text-sm"
              rows={3}
            />
          </div>

          <div className="flex gap-2 justify-end">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              {isLoading ? 'Processing...' : 'Confirm'}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

---

## Displaying Status History

### Status History Timeline

```typescript
import { StateManager } from '@/services/workflow/stateManager';
import { StatusHistoryEntry } from '@/types/workflow';

export function OrderStatusHistory({ orderId }: { orderId: string }) {
  const [history, setHistory] = useState<StatusHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, [orderId]);

  const loadHistory = async () => {
    try {
      const entries = await StateManager.getStatusHistory(orderId);
      setHistory(entries);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading history...</div>;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Status History</h3>
      
      <div className="relative">
        {history.length === 0 && (
          <p className="text-gray-500">No history yet</p>
        )}

        {history.map((entry, index) => (
          <div key={entry.id} className="flex gap-4">
            {/* Timeline line */}
            <div className="flex flex-col items-center">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              {index < history.length - 1 && (
                <div className="w-0.5 h-12 bg-gray-300" />
              )}
            </div>

            {/* History entry */}
            <div className="flex-1 pb-4">
              <div className="flex items-center gap-2 mb-1">
                <StatusBadge status={entry.new_status} size="sm" />
                <span className="text-sm text-gray-600">
                  {formatDate(entry.created_at)}
                </span>
              </div>
              
              <p className="text-sm text-gray-700">
                Changed by {entry.user?.full_name || 'System'}
              </p>

              {entry.reason && (
                <p className="text-sm text-gray-600 italic mt-1">
                  {entry.reason}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## Audit Log Integration

### Activity Log Display

```typescript
import { StateManager } from '@/services/workflow/stateManager';
import { AuditLogEntry } from '@/types/workflow';

export function OrderAuditLog({ orderId }: { orderId: string }) {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);

  useEffect(() => {
    const fetchLogs = async () => {
      const auditLogs = await StateManager.getAuditLog(orderId);
      setLogs(auditLogs);
    };
    fetchLogs();
  }, [orderId]);

  const getActionIcon = (action: string) => {
    const icons: Record<string, string> = {
      'CREATE': '✨',
      'UPDATE': '📝',
      'DELETE': '🗑️',
      'STATE_CHANGE': '🔄',
      'COMMENT': '💬'
    };
    return icons[action] || '•';
  };

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold">Activity Log</h3>

      <div className="max-h-96 overflow-y-auto">
        {logs.map(log => (
          <div key={log.id} className="border-b pb-3 last:border-b-0">
            <div className="flex items-start gap-3">
              <span className="text-lg">{getActionIcon(log.action)}</span>
              
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">
                  {log.user?.full_name || 'System'} {log.action.toLowerCase()}
                </p>
                
                <p className="text-xs text-gray-600 mt-0.5">
                  {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}
                </p>

                {log.changes && Object.keys(log.changes).length > 0 && (
                  <div className="mt-2 bg-gray-50 p-2 rounded text-xs">
                    <details className="cursor-pointer">
                      <summary className="font-medium">Details</summary>
                      <pre className="text-xs mt-2 whitespace-pre-wrap">
                        {JSON.stringify(log.changes, null, 2)}
                      </pre>
                    </details>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## UI Component Integration Examples

### Complete Order Detail Page with Status Management

```typescript
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { StateManager } from '@/services/workflow/stateManager';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { OrderStatusHistory } from './OrderStatusHistory';
import { OrderAuditLog } from './OrderAuditLog';
import { StateTransitionModal } from './StateTransitionModal';

export function OrderDetailPage() {
  const { orderId } = useParams();
  const { user } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [showTransitionModal, setShowTransitionModal] = useState(false);
  const [targetStatus, setTargetStatus] = useState<OrderStatus | null>(null);

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  const loadOrder = async () => {
    const data = await getOrder(orderId!);
    setOrder(data);
  };

  if (!order) return <div>Loading...</div>;

  const validActions = StateManager.getValidTransitions(
    order.status,
    user.role as UserRole
  );

  const handleActionClick = (targetStatus: OrderStatus) => {
    setTargetStatus(targetStatus);
    setShowTransitionModal(true);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header with status */}
      <div className="border-b pb-4">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold">Order #{order.id}</h1>
            <p className="text-gray-600">{order.customer_name}</p>
          </div>
          <StatusBadge 
            status={order.status} 
            size="lg"
            showMessage={true}
          />
        </div>

        {/* Action buttons */}
        {validActions.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {validActions.map(status => (
              <button
                key={status}
                onClick={() => handleActionClick(status)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                {getActionLabel(order.status, status)}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order details */}
          <div className="border rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4">Order Details</h2>
            <dl className="space-y-2">
              <div className="flex justify-between">
                <dt className="font-medium">Address:</dt>
                <dd>{order.delivery_address}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium">Phone:</dt>
                <dd>{order.customer_phone}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium">Amount:</dt>
                <dd>₹{order.amount}</dd>
              </div>
            </dl>
          </div>

          {/* Status history */}
          <OrderStatusHistory orderId={orderId!} />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Activity log */}
          <OrderAuditLog orderId={orderId!} />
        </div>
      </div>

      {/* Transition modal */}
      {targetStatus && (
        <StateTransitionModal
          isOpen={showTransitionModal}
          order={order}
          targetStatus={targetStatus}
          userRole={user.role as UserRole}
          userId={user.id}
          onSuccess={() => {
            setShowTransitionModal(false);
            loadOrder();
          }}
          onClose={() => setShowTransitionModal(false)}
        />
      )}
    </div>
  );
}

function getActionLabel(from: OrderStatus, to: OrderStatus): string {
  const labels: Record<string, string> = {
    'APPROVED': '✓ Approve',
    'DISPATCHED': '📦 Dispatch',
    'OUT_FOR_DELIVERY': '🚚 Out for Delivery',
    'DELIVERED': '✅ Delivered',
    'FAILED': '❌ Failed',
    'RESCHEDULED': '🔄 Reschedule',
    'CANCELLED': '⛔ Cancel',
  };
  return labels[to] || `Mark as ${to}`;
}
```

---

## Real-World Scenarios

### Scenario 1: Dispatch Manager Approving Orders

```typescript
export async function dispatchManagerApproveOrder(orderId: string, userId: string) {
  // 1. Fetch order
  const order = await supabase
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .single();

  // 2. Check if can transition
  if (!StateManager.canTransition(order.data.status, 'DISPATCHED', 'dispatch')) {
    throw new Error(`Cannot dispatch from ${order.data.status}`);
  }

  // 3. Validate pre-conditions
  if (!order.data.assigned_agent_id) {
    throw new Error('Agent must be assigned before dispatching');
  }

  // 4. Execute transition
  return await StateManager.executeTransition({
    entityId: orderId,
    entityType: 'order',
    currentStatus: order.data.status,
    targetStatus: 'DISPATCHED',
    userRole: 'dispatch',
    userId,
    reason: 'Approved and dispatched for delivery',
    metadata: {
      assignedAgent: order.data.assigned_agent_id,
      routeOptimized: true
    }
  });
}
```

### Scenario 2: Delivery Agent Marking as Delivered

```typescript
export async function deliveryAgentMarkDelivered(
  orderId: string,
  userId: string,
  proofImageUrl: string
) {
  // 1. Only delivery agents can mark as delivered
  const order = await getOrder(orderId);

  if (order.assigned_agent_id !== userId) {
    throw new Error('Only assigned agent can confirm delivery');
  }

  // 2. Execute transition
  return await StateManager.executeTransition({
    entityId: orderId,
    entityType: 'order',
    currentStatus: order.status,
    targetStatus: 'DELIVERED',
    userRole: 'delivery_agent',
    userId,
    reason: 'Delivered successfully',
    metadata: {
      proofImage: proofImageUrl,
      deliveredAt: new Date().toISOString(),
      latitude: getCurrentLocation().lat,
      longitude: getCurrentLocation().lng
    }
  });
}
```

### Scenario 3: Admin Rescheduling Failed Delivery

```typescript
export async function adminRescheduleFailedDelivery(
  orderId: string,
  newDate: string,
  userId: string,
  notes: string
) {
  const order = await getOrder(orderId);

  // Only FAILED orders can be rescheduled
  if (!StateManager.canTransition(order.status, 'RESCHEDULED', 'admin')) {
    throw new Error('Only failed orders can be rescheduled');
  }

  return await StateManager.executeTransition({
    entityId: orderId,
    entityType: 'order',
    currentStatus: order.status,
    targetStatus: 'RESCHEDULED',
    userRole: 'admin',
    userId,
    reason: notes || 'Rescheduled by admin',
    metadata: {
      originalDate: order.scheduled_date,
      newDate,
      failureReason: order.failure_reason
    }
  });
}
```

---

## Testing Integration

### Unit Test Template

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { StateManager } from '@/services/workflow/stateManager';

describe('StateManager Integration', () => {
  it('should allow dispatch to approve orders', () => {
    const canApprove = StateManager.canTransition(
      'APPROVED',
      'DISPATCHED',
      'dispatch'
    );
    expect(canApprove).toBe(true);
  });

  it('should prevent delivery agent from approving orders', () => {
    const canApprove = StateManager.canTransition(
      'DRAFT',
      'APPROVED',
      'delivery_agent'
    );
    expect(canApprove).toBe(false);
  });

  it('should get valid transitions for manager', () => {
    const transitions = StateManager.getValidTransitions('APPROVED', 'manager');
    expect(transitions).toContain('DISPATCHED');
    expect(transitions).toContain('CANCELLED');
  });

  it('should get friendly status message', () => {
    const message = StateManager.getStatusMessage('OUT_FOR_DELIVERY');
    expect(message).toBe('Out for Delivery');
  });
});
```

---

## Next Steps

1. **Create UI Components**:
   - `StateTransitionModal.tsx` - Modal for changing status
   - `StatusHistoryTimeline.tsx` - Visual timeline of changes
   - `QuickActionButton.tsx` - Single button for common transitions

2. **Integrate into Existing Pages**:
   - Update `DeliveryOrderDetails.tsx` to use status actions
   - Update `AllTripsModal.tsx` to show trip statuses
   - Add status badge to order lists

3. **Run Database Migration**:
   - Execute `20251206_phase_3_1_workflow.sql`
   - Verify tables and permissions

4. **Testing**:
   - Unit tests for StateManager
   - Integration tests with Supabase
   - E2E tests for complete workflows

---

**Document Version**: 1.0  
**Last Updated**: December 6, 2025  
**Author**: Development Team  
**Status**: Ready for Implementation ✅
