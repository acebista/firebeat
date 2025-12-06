# 🚀 Phase 3.1 Implementation Starter - Ready to Code

**Status**: Ready to Begin  
**Phase**: 3.1 (Status Model & Workflow Canon)  
**Effort**: 1-2 weeks  
**Team**: 1 backend engineer + 1 frontend engineer  
**Date**: December 6, 2025

---

## ⚡ Quick Start (First 30 Minutes)

### What You're Building
A centralized state machine for order/trip/return/payment lifecycle management with full audit logging.

### Why It Matters
Every other Phase 3 feature depends on this foundation. It's the most important 1-2 weeks of work.

### Files You'll Create
```
src/
├── types/
│   └── workflow.ts              (State definitions)
├── services/
│   └── workflow/
│       └── stateManager.ts      (Business logic)
├── components/
│   └── shared/
│       ├── StatusBadge.tsx      (UI component)
│       └── StateChangeToast.tsx (Notifications)
└── supabase/
    └── migrations/
        └── 20251206_workflow.sql (Database)
```

---

## 🎯 Step 1: Create Type Definitions (30 minutes)

**File**: `src/types/workflow.ts`

```typescript
// ============ STATE ENUMS ============
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

export type TripStatus =
  | 'DRAFT'
  | 'READY'
  | 'OUT_FOR_DELIVERY'
  | 'COMPLETED'
  | 'CANCELLED';

export type ReturnStatus =
  | 'INITIATED'
  | 'APPROVED'
  | 'IN_TRANSIT'
  | 'RECEIVED'
  | 'CLOSED'
  | 'REJECTED';

export type PaymentStatus =
  | 'PENDING'
  | 'RECORDED'
  | 'RECONCILED'
  | 'DISPUTED';

// ============ ROLES ============
export type UserRole = 
  | 'admin' 
  | 'manager' 
  | 'supervisor' 
  | 'dispatch' 
  | 'delivery_agent' 
  | 'accountant';

// ============ VALID TRANSITIONS ============
export const VALID_TRANSITIONS: Record<OrderStatus, Partial<Record<UserRole, OrderStatus[]>>> = {
  DRAFT: {
    manager: ['APPROVED', 'CANCELLED'],
    admin: ['APPROVED', 'CANCELLED', 'DRAFT']
  },
  APPROVED: {
    dispatch: ['DISPATCHED', 'CANCELLED'],
    manager: ['DRAFT', 'CANCELLED'],
    admin: ['DRAFT', 'DISPATCHED', 'CANCELLED']
  },
  DISPATCHED: {
    dispatch: ['OUT_FOR_DELIVERY', 'CANCELLED'],
    delivery_agent: ['OUT_FOR_DELIVERY'],
    admin: ['DRAFT', 'APPROVED', 'OUT_FOR_DELIVERY', 'CANCELLED']
  },
  OUT_FOR_DELIVERY: {
    delivery_agent: ['DELIVERED', 'FAILED'],
    admin: ['DISPATCHED', 'DELIVERED', 'FAILED', 'CANCELLED']
  },
  DELIVERED: {
    delivery_agent: ['RETURNED', 'DAMAGED'],
    accountant: ['DELIVERED'],
    admin: ['OUT_FOR_DELIVERY', 'RETURNED', 'DAMAGED', 'CANCELLED']
  },
  FAILED: {
    delivery_agent: ['RESCHEDULED'],
    dispatch: ['RESCHEDULED', 'CANCELLED'],
    admin: ['OUT_FOR_DELIVERY', 'RESCHEDULED', 'CANCELLED']
  },
  RESCHEDULED: {
    dispatch: ['DISPATCHED', 'CANCELLED'],
    manager: ['CANCELLED'],
    admin: ['APPROVED', 'DISPATCHED', 'CANCELLED']
  },
  CANCELLED: {
    admin: ['DRAFT', 'APPROVED']
  },
  RETURNED: {
    accountant: ['CLOSED'],
    admin: ['CLOSED', 'CANCELLED']
  },
  DAMAGED: {
    accountant: ['CLOSED'],
    admin: ['CLOSED', 'CANCELLED']
  }
};

// ============ STATUS MESSAGES ============
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

// ============ TYPES ============
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
```

✅ **Done**: Type definitions created. Commit this first.

---

## 🔧 Step 2: Create State Manager Service (1 hour)

**File**: `src/services/workflow/stateManager.ts`

```typescript
import { supabase } from '@/config/supabase';
import {
  OrderStatus,
  VALID_TRANSITIONS,
  STATUS_MESSAGES,
  StateTransitionRequest,
  StateTransitionResponse,
  UserRole
} from '@/types/workflow';

export class StateManager {
  /**
   * Check if a transition is valid
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
   * Get all valid transitions for current state and role
   */
  static getValidTransitions(
    currentStatus: OrderStatus,
    userRole: UserRole
  ): OrderStatus[] {
    return VALID_TRANSITIONS[currentStatus]?.[userRole] || [];
  }

  /**
   * Execute a state transition with full audit trail
   */
  static async executeTransition(
    request: StateTransitionRequest,
    userRole: UserRole
  ): Promise<StateTransitionResponse> {
    const { orderId, fromStatus, toStatus, userId, reason, metadata } = request;

    // 1. Validate transition
    if (!this.canTransition(fromStatus, toStatus, userRole)) {
      return {
        success: false,
        orderId,
        oldStatus: fromStatus,
        newStatus: toStatus,
        transitionedAt: new Date().toISOString(),
        auditLogId: '',
        errors: [`Invalid transition from ${fromStatus} to ${toStatus} for role ${userRole}`]
      };
    }

    try {
      // 2. Create audit log entry
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
          metadata
        })
        .select('id')
        .single();

      if (auditError) throw auditError;

      // 3. Update order status
      const { error: updateError } = await supabase
        .from('orders')
        .update({
          status: toStatus,
          status_updated_at: new Date().toISOString(),
          status_updated_by: userId
        })
        .eq('id', orderId);

      if (updateError) throw updateError;

      // 4. Create status history entry
      await supabase
        .from('order_status_history')
        .insert({
          order_id: orderId,
          from_status: fromStatus,
          to_status: toStatus,
          reason,
          user_id: userId,
          metadata
        });

      return {
        success: true,
        orderId,
        oldStatus: fromStatus,
        newStatus: toStatus,
        transitionedAt: new Date().toISOString(),
        auditLogId: auditLog?.id || ''
      };
    } catch (error) {
      return {
        success: false,
        orderId,
        oldStatus: fromStatus,
        newStatus: toStatus,
        transitionedAt: new Date().toISOString(),
        auditLogId: '',
        errors: [error instanceof Error ? error.message : 'Unknown error']
      };
    }
  }

  /**
   * Get status display message
   */
  static getStatusMessage(status: OrderStatus): string {
    return STATUS_MESSAGES[status] || status;
  }

  /**
   * Get status history for an order
   */
  static async getStatusHistory(orderId: string) {
    const { data, error } = await supabase
      .from('order_status_history')
      .select('*')
      .eq('order_id', orderId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  /**
   * Get audit log for an order
   */
  static async getAuditLog(orderId: string) {
    const { data, error } = await supabase
      .from('audit_logs')
      .eq('entity_id', orderId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }
}
```

✅ **Done**: Service implementation. Commit this.

---

## 🎨 Step 3: Create UI Components (45 minutes)

**File**: `src/components/shared/StatusBadge.tsx`

```typescript
import React from 'react';
import { OrderStatus, STATUS_MESSAGES } from '@/types/workflow';

interface StatusBadgeProps {
  status: OrderStatus;
  size?: 'sm' | 'md' | 'lg';
  showMessage?: boolean;
}

const STATUS_COLORS: Record<OrderStatus, { bg: string; text: string }> = {
  DRAFT: { bg: 'bg-gray-100', text: 'text-gray-800' },
  APPROVED: { bg: 'bg-blue-100', text: 'text-blue-800' },
  DISPATCHED: { bg: 'bg-purple-100', text: 'text-purple-800' },
  OUT_FOR_DELIVERY: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
  DELIVERED: { bg: 'bg-green-100', text: 'text-green-800' },
  FAILED: { bg: 'bg-red-100', text: 'text-red-800' },
  RESCHEDULED: { bg: 'bg-orange-100', text: 'text-orange-800' },
  CANCELLED: { bg: 'bg-gray-100', text: 'text-gray-600' },
  RETURNED: { bg: 'bg-indigo-100', text: 'text-indigo-800' },
  DAMAGED: { bg: 'bg-red-100', text: 'text-red-800' }
};

const SIZE_CLASSES = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-1.5 text-sm',
  lg: 'px-4 py-2 text-base'
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  showMessage = false
}) => {
  const colors = STATUS_COLORS[status];

  return (
    <div className="flex flex-col gap-1">
      <span
        className={`
          inline-block rounded-full font-medium
          ${SIZE_CLASSES[size]}
          ${colors.bg} ${colors.text}
        `}
      >
        {status}
      </span>
      {showMessage && (
        <span className="text-xs text-gray-600 italic">
          {STATUS_MESSAGES[status]}
        </span>
      )}
    </div>
  );
};
```

✅ **Done**: UI component. Commit this.

---

## 💾 Step 4: Create Supabase Migration (30 minutes)

**File**: `supabase/migrations/20251206_phase_3_1_workflow.sql`

```sql
-- ============ AUDIT LOGS TABLE ============
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  old_data JSONB,
  new_data JSONB NOT NULL,
  reason TEXT,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT now(),
  
  CONSTRAINT valid_entity_type CHECK (entity_type IN ('order', 'trip', 'return', 'payment'))
);

CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- ============ ORDER STATUS HISTORY TABLE ============
CREATE TABLE IF NOT EXISTS order_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  from_status TEXT NOT NULL,
  to_status TEXT NOT NULL,
  reason TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_order_status_history_order_id ON order_status_history(order_id);
CREATE INDEX idx_order_status_history_created_at ON order_status_history(created_at DESC);

-- ============ ADD COLUMNS TO ORDERS TABLE ============
ALTER TABLE orders ADD COLUMN IF NOT EXISTS status_updated_at TIMESTAMP DEFAULT now();
ALTER TABLE orders ADD COLUMN IF NOT EXISTS status_updated_by UUID REFERENCES auth.users(id);

-- ============ ENABLE RLS ============
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY;

-- ============ RLS POLICIES ============
CREATE POLICY "Users can view audit logs for their orders" ON audit_logs
  FOR SELECT USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = audit_logs.entity_id 
      AND (
        orders.user_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM auth.users 
          WHERE auth.users.id = auth.uid() 
          AND auth.users.raw_user_meta_data->>'role' IN ('admin', 'manager')
        )
      )
    )
  );

CREATE POLICY "Users can view status history for their orders" ON order_status_history
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_status_history.order_id 
      AND orders.user_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' IN ('admin', 'manager')
    )
  );
```

✅ **Done**: Database setup ready.

---

## ✅ Step 5: Integration Checklist

### Modify Existing Order Detail Page

Find your `DeliveryOrderDetails.tsx` or `OrderDetail.tsx` and update it:

```typescript
// OLD CODE (replace this):
const handleStatusChange = async (newStatus) => {
  await supabase
    .from('orders')
    .update({ status: newStatus })
    .eq('id', orderId);
  refetch();
};

// NEW CODE (use this):
import { StateManager } from '@/services/workflow/stateManager';
import { triggerStateChangeToast } from '@/components/shared/StateChangeToast';

const handleStatusChange = async (newStatus, reason) => {
  const response = await StateManager.executeTransition(
    {
      orderId,
      fromStatus: order.status,
      toStatus: newStatus,
      userId: user.id,
      reason,
      metadata: { source: 'order_details_page' }
    },
    user.role
  );
  
  if (response.success) {
    triggerStateChangeToast(order.status, newStatus, orderId);
    setOrder({ ...order, status: newStatus });
  } else {
    toast.error(response.errors?.join(', '));
  }
};
```

---

## 📝 Testing Checklist

- [ ] Type definitions compile without errors
- [ ] StateManager imports work
- [ ] Test: `canTransition('DRAFT', 'APPROVED', 'manager')` returns true
- [ ] Test: `canTransition('DRAFT', 'DELIVERED', 'manager')` returns false
- [ ] Run migration: `supabase migration up`
- [ ] Audit log created when status changes
- [ ] Order status_updated_at and status_updated_by are set
- [ ] StatusBadge renders with correct colors
- [ ] Toast notification appears on state change
- [ ] Status history can be queried

---

## 🎯 What's Next

**Once Phase 3.1 is complete:**

1. **Phase 3.2 (Delivery Closure)** - Uses StateManager for transitions
2. **Phase 3.3 (Dispatch Optimizer)** - Tracks status changes for analytics
3. **Phase 3.5 (Dashboards)** - Queries audit logs for reports

---

## 💡 Tips for Success

1. **Start small**: Get types + service working first
2. **Test locally**: Run queries in Supabase dashboard before coding
3. **Commit often**: After types, after service, after components
4. **Ask questions**: If state machine logic is unclear, refer back to PHASE_3_1_STATUS_MODEL_GUIDE.md
5. **Don't over-engineer**: This is intentionally simple - foundation for others to build on

---

## 🚀 Ready to Code?

**Next action**: Create `src/types/workflow.ts` and start building!

**Questions?** Check:
- PHASE_3_1_STATUS_MODEL_GUIDE.md (detailed design)
- PHASE_3_ROADMAP.md (where this fits)
- Inline code comments in these guides

---

**You've got this! Let's build the foundation for Phase 3! 🎯**
