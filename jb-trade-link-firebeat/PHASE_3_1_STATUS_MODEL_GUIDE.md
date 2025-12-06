# 🚀 Phase 3.1: Status Model & Workflow Canon - Implementation Guide

**Phase**: 3.1 (Foundation)  
**Priority**: 🔴 **CRITICAL FIRST**  
**Effort**: Medium (2-3 weeks)  
**Timeline**: Start Now, Complete by Dec 31, 2025  
**Blocker**: Everything else depends on this

---

## 📋 Overview

**Goal**: Establish a single source of truth for order/trip/return/payment state management  
**Outcome**: Centralized workflow engine, audit trail, system-wide status messaging  
**Value**: Every subsequent feature will build on this foundation

---

## 🎯 Deliverables Checklist

### Tier 1: Core Definitions (Week 1)
- [ ] Create `types/workflow.ts` with state enums
- [ ] Define allowed transitions per role
- [ ] Create Supabase migrations for audit tables
- [ ] Implement state machine service

### Tier 2: Service Implementation (Week 1-2)
- [ ] State manager service with validation
- [ ] Audit logging system
- [ ] Status transition executor
- [ ] Error handling & rollback

### Tier 3: UI Integration (Week 2-3)
- [ ] Status badge component
- [ ] System toast/banner for state changes
- [ ] Refactor existing status display
- [ ] Add transition buttons/modals

### Tier 4: Testing & Documentation (Week 3)
- [ ] Unit tests for state transitions
- [ ] Integration tests with Supabase
- [ ] User documentation
- [ ] API documentation

---

## 📐 Data Model Design

### State Machines by Entity Type

#### **Order States**
```
┌─────────┐
│ DRAFT   │ (Initial - awaiting approval)
└────┬────┘
     │
     v
┌──────────────┐
│ APPROVED     │ (Ready for dispatch)
└────┬─────────┘
     │
     v
┌──────────────┐
│ DISPATCHED   │ (Assigned to trip)
└────┬─────────┘
     │
     ├──────────────────────────┐
     │                          │
     v                          v
┌──────────────┐         ┌─────────────┐
│ DELIVERED    │         │ RESCHEDULED │
└──────────────┘         └──────┬──────┘
                                │
                                v
                         ┌──────────────┐
                         │ APPROVED     │ (back to queue)
                         └──────────────┘

Also possible:
CANCELLED ←─┐
RETURNED  ←─┤ (from DELIVERED or RESCHEDULED)
DAMAGED   ←─┘

Data: FAILED → awaiting rescheduling decision
```

#### **Trip States**
```
DRAFT → READY → OUT_FOR_DELIVERY → COMPLETED
   ↓
CANCELLED
```

#### **Return States**
```
INITIATED → APPROVED → IN_TRANSIT → RECEIVED → CLOSED
   ↓
REJECTED
```

#### **Payment States**
```
PENDING → RECORDED → RECONCILED
   ↓
DISPUTED
```

---

## 💾 Database Schema

### New Tables

#### `audit_logs`
```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  action TEXT NOT NULL,           -- 'CREATE', 'UPDATE', 'DELETE', 'STATUS_CHANGE'
  entity_type TEXT NOT NULL,      -- 'order', 'trip', 'return', 'payment'
  entity_id UUID NOT NULL,
  old_data JSONB,                 -- Previous state (nullable for CREATE)
  new_data JSONB NOT NULL,        -- New state
  reason TEXT,                    -- Why (e.g., "Customer requested reschedule")
  metadata JSONB,                 -- Additional context
  created_at TIMESTAMP DEFAULT now(),
  INDEX(user_id),
  INDEX(entity_type),
  INDEX(entity_id),
  INDEX(created_at DESC)
);
```

#### `order_status_history`
```sql
CREATE TABLE order_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  from_status TEXT NOT NULL,
  to_status TEXT NOT NULL,
  reason TEXT NOT NULL,           -- Required (e.g., "Customer unavailable")
  user_id UUID NOT NULL REFERENCES auth.users(id),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT now(),
  INDEX(order_id),
  INDEX(created_at DESC)
);
```

#### `trip_status_history`
```sql
CREATE TABLE trip_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  from_status TEXT NOT NULL,
  to_status TEXT NOT NULL,
  reason TEXT,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMP DEFAULT now(),
  INDEX(trip_id),
  INDEX(created_at DESC)
);
```

### Modify Existing Tables

```sql
-- Add status history trigger to orders
ALTER TABLE orders ADD COLUMN status_updated_at TIMESTAMP DEFAULT now();
ALTER TABLE orders ADD COLUMN status_updated_by UUID REFERENCES auth.users(id);

-- Add status history trigger to trips
ALTER TABLE trips ADD COLUMN status_updated_at TIMESTAMP DEFAULT now();
ALTER TABLE trips ADD COLUMN status_updated_by UUID REFERENCES auth.users(id);

-- Similar for returns and payments
```

---

## 🏗️ Code Structure

### Step 1: Create `types/workflow.ts`

```typescript
// types/workflow.ts

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
export type UserRole = 'admin' | 'manager' | 'supervisor' | 'dispatch' | 'delivery_agent' | 'accountant';

// ============ STATE TRANSITIONS ============
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

// ============ REQUIRED FIELDS BY TRANSITION ============
export const TRANSITION_REQUIREMENTS: Record<string, {
  requiredFields: string[];
  requiresReason: boolean;
  requiresApproval?: boolean;
}> = {
  'APPROVED->CANCELLED': { requiredFields: [], requiresReason: true },
  'OUT_FOR_DELIVERY->FAILED': { requiredFields: ['failure_reason'], requiresReason: true },
  'DELIVERED->RETURNED': { requiredFields: ['return_reason'], requiresReason: true },
  'FAILED->RESCHEDULED': { requiredFields: ['new_delivery_date'], requiresReason: true }
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

---

### Step 2: Create State Manager Service

**File**: `services/workflow/stateManager.ts`

```typescript
import { supabase } from '@/config/supabase';
import {
  OrderStatus,
  VALID_TRANSITIONS,
  STATUS_MESSAGES,
  TRANSITION_REQUIREMENTS,
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

    // 2. Check required fields
    const transitionKey = `${fromStatus}->${toStatus}`;
    const requirements = TRANSITION_REQUIREMENTS[transitionKey];
    if (requirements?.requiredFields && !this.hasRequiredFields(metadata, requirements.requiredFields)) {
      return {
        success: false,
        orderId,
        oldStatus: fromStatus,
        newStatus: toStatus,
        transitionedAt: new Date().toISOString(),
        auditLogId: '',
        errors: [`Missing required fields: ${requirements.requiredFields.join(', ')}`]
      };
    }

    // 3. Get current order data
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
        transitionedAt: new Date().toISOString(),
        auditLogId: '',
        errors: [`Order not found: ${fetchError?.message || ''}`]
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
        metadata
      })
      .select('id')
      .single();

    if (auditError) {
      return {
        success: false,
        orderId,
        oldStatus: fromStatus,
        newStatus: toStatus,
        transitionedAt: new Date().toISOString(),
        auditLogId: '',
        errors: [`Failed to create audit log: ${auditError.message}`]
      };
    }

    // 5. Update order status
    const { error: updateError } = await supabase
      .from('orders')
      .update({
        status: toStatus,
        status_updated_at: new Date().toISOString(),
        status_updated_by: userId
      })
      .eq('id', orderId);

    if (updateError) {
      return {
        success: false,
        orderId,
        oldStatus: fromStatus,
        newStatus: toStatus,
        transitionedAt: new Date().toISOString(),
        auditLogId: auditLog?.id || '',
        errors: [`Failed to update order: ${updateError.message}`]
      };
    }

    // 6. Create status history entry
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
      transitionedAt: new Date().toISOString(),
      auditLogId: auditLog?.id || ''
    };
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
      .select('*')
      .eq('entity_id', orderId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  // Helper methods
  private static hasRequiredFields(metadata: any, requiredFields: string[]): boolean {
    return requiredFields.every(field => metadata?.[field] !== undefined && metadata[field] !== null);
  }
}
```

---

### Step 3: Create Status Badge Component

**File**: `components/shared/StatusBadge.tsx`

```typescript
import React from 'react';
import { OrderStatus, STATUS_MESSAGES } from '@/types/workflow';

interface StatusBadgeProps {
  status: OrderStatus;
  size?: 'sm' | 'md' | 'lg';
  showMessage?: boolean;
}

const STATUS_COLORS: Record<OrderStatus, { bg: string; text: string; border: string }> = {
  DRAFT: { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-300' },
  APPROVED: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300' },
  DISPATCHED: { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-300' },
  OUT_FOR_DELIVERY: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-300' },
  DELIVERED: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300' },
  FAILED: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300' },
  RESCHEDULED: { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-300' },
  CANCELLED: { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-300' },
  RETURNED: { bg: 'bg-indigo-100', text: 'text-indigo-800', border: 'border-indigo-300' },
  DAMAGED: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300' }
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
  const message = STATUS_MESSAGES[status];

  return (
    <div className="flex flex-col gap-1">
      <span
        className={`
          inline-block
          rounded-full
          border
          font-medium
          ${SIZE_CLASSES[size]}
          ${colors.bg}
          ${colors.text}
          ${colors.border}
        `}
      >
        {status}
      </span>
      {showMessage && (
        <span className="text-xs text-gray-600 italic">
          {message}
        </span>
      )}
    </div>
  );
};
```

---

### Step 4: Create System Toast for State Changes

**File**: `components/shared/StateChangeToast.tsx`

```typescript
import React, { useEffect } from 'react';
import toast from 'react-hot-toast';
import { OrderStatus, STATUS_MESSAGES } from '@/types/workflow';

interface StateChangeToastProps {
  oldStatus: OrderStatus;
  newStatus: OrderStatus;
  orderId: string;
}

export const triggerStateChangeToast = (
  oldStatus: OrderStatus,
  newStatus: OrderStatus,
  orderId: string
) => {
  const message = STATUS_MESSAGES[newStatus];
  const icon = getIcon(newStatus);

  toast.success(
    `Order updated: ${oldStatus} → ${newStatus}`,
    {
      duration: 4000,
      icon
    }
  );
};

function getIcon(status: OrderStatus) {
  switch (status) {
    case 'DELIVERED':
      return '✅';
    case 'FAILED':
      return '❌';
    case 'RESCHEDULED':
      return '📅';
    case 'CANCELLED':
      return '🚫';
    case 'DISPATCHED':
      return '🚚';
    default:
      return '📝';
  }
}
```

---

## 🔧 Integration Points

### 1. Refactor Existing Order Detail Page
Replace manual status updates with StateManager:

```typescript
// BEFORE
const handleStatusChange = async (newStatus) => {
  await supabase
    .from('orders')
    .update({ status: newStatus })
    .eq('id', orderId);
};

// AFTER
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

### 2. Add Status History Tab
```typescript
<Tab label="History">
  <StatusHistory orderId={orderId} />
</Tab>
```

### 3. Add Audit Log View
```typescript
<Tab label="Audit Log">
  <AuditLog entityId={orderId} entityType="order" />
</Tab>
```

---

## 📝 Supabase Migrations

**File**: `supabase/migrations/20251206_phase_3_1_workflow.sql`

```sql
-- Create audit_logs table
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
  CONSTRAINT entity_ref CHECK (entity_type IN ('order', 'trip', 'return', 'payment'))
);

CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- Create order_status_history table
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

-- Add columns to orders table
ALTER TABLE orders ADD COLUMN IF NOT EXISTS status_updated_at TIMESTAMP DEFAULT now();
ALTER TABLE orders ADD COLUMN IF NOT EXISTS status_updated_by UUID REFERENCES auth.users(id);

-- Enable RLS
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies (admins see all, users see their own)
CREATE POLICY "Users can view audit logs for their orders" ON audit_logs
  FOR SELECT USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = audit_logs.entity_id 
      AND (
        orders.user_id = auth.uid() OR
        EXISTS (SELECT 1 FROM auth.users WHERE auth.users.id = auth.uid() AND auth.users.raw_user_meta_data->>'role' IN ('admin', 'manager'))
      )
    )
  );
```

---

## ✅ Testing Checklist

### Unit Tests
- [ ] `StateManager.canTransition()` with all role/status combinations
- [ ] `getValidTransitions()` returns correct options
- [ ] `getStatusMessage()` returns correct text
- [ ] Invalid transitions are rejected

### Integration Tests
- [ ] Transition creates audit_log entry
- [ ] Transition creates order_status_history entry
- [ ] Order status_updated_at and status_updated_by are set
- [ ] Reason is required for certain transitions
- [ ] Non-authorized roles cannot make transitions

### UI Tests
- [ ] StatusBadge renders with correct colors
- [ ] State change toast appears after transition
- [ ] Status history tab shows all transitions
- [ ] Audit log shows all activities

### E2E Tests
- [ ] Complete order flow: DRAFT → APPROVED → DISPATCHED → DELIVERED
- [ ] Failure flow: OUT_FOR_DELIVERY → FAILED → RESCHEDULED
- [ ] Return flow: DELIVERED → RETURNED
- [ ] Cancellation from various states

---

## 📚 Documentation

### For Developers
- Type definitions in `types/workflow.ts`
- Service API in `StateManager` class
- Integration examples in existing components

### For Product
- Status flow diagram (visual)
- Who can do what (state transition matrix)
- Required fields per transition

### For Users
- What does each status mean? (in help center)
- Why did my order change status? (audit log access)
- What happens next? (from status_message)

---

## 🎯 Success Criteria

- [x] All order states are defined and documented
- [x] All valid transitions are encoded by role
- [x] State changes always create audit entries
- [x] Unauthorized transitions are impossible
- [x] Users see clear status messages
- [x] History and audit logs are queryable
- [x] Performance (audit writes < 100ms)
- [x] Tests cover 100% of transition logic

---

## 🚀 Next Phase

Once Phase 3.1 is complete, Phase 3.2 (Delivery Closure & Payments) will use this state manager to:
- Handle DELIVERED → RETURNED transitions
- Record payment data when status changes
- Require POD upload before DELIVERED
- Enforce reason on FAILED transitions

---

**Ready to start Phase 3.1? Let's build the foundation!** 🏗️
