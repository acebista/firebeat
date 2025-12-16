# Phase 3.1 Integration Quick Start - For Developers

**Status**: Database schema DEPLOYED ✅  
**Your Focus**: Integrate UI components + StateManager into existing pages  
**Timeline**: December 6-12, 2025

---

## What's Ready For You

### ✅ In the Database (Just Deployed)
```
✅ audit_logs table - For complete audit trails
✅ order_status_history table - For tracking order state changes
✅ trip_status_history table - For tracking trip state changes
✅ Updated orders table - Added status_updated_at, status_updated_by columns
✅ Updated trips table - Added status_updated_at, status_updated_by columns
✅ Two SQL functions - For secure audit logging
✅ RLS policies - For data access control
```

### ✅ In TypeScript/React (Already Coded)
```
✅ types/workflow.ts (193 lines)
  - OrderStatus, TripStatus, ReturnStatus, PaymentStatus types
  - UserRole type with 6 roles
  - VALID_TRANSITIONS matrix for role-based access control
  - TYPE_MESSAGES and STATUS_MESSAGES for UI display

✅ services/workflow/stateManager.ts (343 lines)
  - StateManager class with 8 static methods
  - Full Supabase integration
  - Error handling and validation
  - Audit logging on every transition

✅ components/shared/StatusBadge.tsx (124 lines)
  - Reusable status display component
  - Color-coded by status type
  - Three sizes: sm, md, lg

✅ components/workflow/StateTransitionModal.tsx (234 lines)
  - Modal for changing status
  - Validates transitions
  - Captures reason/notes
  - Shows loading state

✅ components/workflow/StatusHistoryTimeline.tsx (177 lines)
  - Visual timeline of all status changes
  - Shows who/when/why for each transition
  - Error and loading states

✅ components/workflow/QuickActionButtons.tsx (150 lines)
  - Auto-generates valid action buttons
  - Role-based filtering
  - Compact dropdown mode available

✅ components/workflow/index.ts
  - Central export point for all workflow components
```

---

## Integration Steps (Do This)

### Step 1: Import the Components
In the file where you want to use them:

```typescript
// Import types
import { OrderStatus, UserRole } from '@/types/workflow';

// Import state manager
import { StateManager } from '@/services/workflow/stateManager';

// Import UI components
import {
  StatusBadge,
  StateTransitionModal,
  StatusHistoryTimeline,
  QuickActionButtons
} from '@/components/workflow';
```

### Step 2: Use StatusBadge (Display Status)
```typescript
// In your order details page
<StatusBadge 
  status={order.status} 
  size="md"
  showMessage={true}
/>

// Or in a list
<StatusBadge 
  status={order.status} 
  size="sm"
/>
```

### Step 3: Use QuickActionButtons (Allow Status Changes)
```typescript
// In your order details page
const [transitionModalOpen, setTransitionModalOpen] = useState(false);
const [targetStatus, setTargetStatus] = useState<OrderStatus | null>(null);

<QuickActionButtons
  orderId={order.id}
  currentStatus={order.status as OrderStatus}
  userRole={userRole as UserRole}
  userId={userId}
  onTransitionSuccess={() => {
    // Refresh order data
    refetchOrder();
  }}
  compact={false}
/>
```

### Step 4: Show Status History (Timeline)
```typescript
// In a details panel or modal
<StatusHistoryTimeline 
  orderId={order.id}
/>
```

### Step 5: Advanced - Direct StateManager Usage
```typescript
// Check if a transition is valid
const canDeliver = StateManager.canTransition(
  'OUT_FOR_DELIVERY',
  'DELIVERED',
  userRole
);

// Get available actions
const actions = StateManager.getAvailableActions(
  order.status,
  userRole
);

// Execute a transition
const result = await StateManager.executeTransition({
  entityId: order.id,
  entityType: 'order',
  fromStatus: order.status,
  toStatus: 'DELIVERED',
  reason: 'Customer received order',
  userId: currentUserId,
  userRole: userRole
});

if (result.success) {
  // Update local state
  console.log('Transitioned successfully');
  // Refresh data
} else {
  // Show error
  console.error('Transition failed:', result.error);
}
```

---

## Integration Checklist

### Phase 1: Setup (Dec 6-7)
- [ ] Import all workflow components in your pages
- [ ] Import StateManager service
- [ ] Import workflow types
- [ ] Verify TypeScript compilation succeeds

### Phase 2: Display Current Status (Dec 7-8)
- [ ] Add StatusBadge to order list pages
- [ ] Add StatusBadge to order details pages
- [ ] Add StatusHistoryTimeline to details view
- [ ] Test badge colors display correctly

### Phase 3: Enable Status Changes (Dec 8-9)
- [ ] Add QuickActionButtons to order details
- [ ] Add StateTransitionModal (if using custom flow)
- [ ] Test status transitions
- [ ] Verify audit logs are created

### Phase 4: Testing (Dec 9-10)
- [ ] Test all role-based permissions (6 roles)
- [ ] Test invalid transitions are blocked
- [ ] Test audit logs capture all changes
- [ ] Test RLS policies work correctly

### Phase 5: Deployment (Dec 11-12)
- [ ] Deploy to staging
- [ ] QA testing
- [ ] Deploy to production
- [ ] Monitor audit logs in production

---

## Key Files Locations

| What | Where | Lines |
|------|-------|-------|
| Type Definitions | `types/workflow.ts` | 193 |
| State Manager | `services/workflow/stateManager.ts` | 343 |
| Status Badge Component | `components/shared/StatusBadge.tsx` | 124 |
| Transition Modal | `components/workflow/StateTransitionModal.tsx` | 234 |
| History Timeline | `components/workflow/StatusHistoryTimeline.tsx` | 177 |
| Quick Actions | `components/workflow/QuickActionButtons.tsx` | 150 |
| Component Exports | `components/workflow/index.ts` | - |
| Database Migration | `supabase/migrations/20251206_phase_3_1_workflow.sql` | 240 |

---

## API Reference

### StateManager Methods

#### `canTransition(from: OrderStatus, to: OrderStatus, role: UserRole): boolean`
Check if a transition is allowed for a role.

```typescript
const allowed = StateManager.canTransition('DRAFT', 'APPROVED', 'manager');
// true if manager can do DRAFT → APPROVED
```

#### `getValidTransitions(status: OrderStatus, role: UserRole): OrderStatus[]`
Get all valid next statuses for a role.

```typescript
const actions = StateManager.getValidTransitions('APPROVED', 'dispatch');
// ['DISPATCHED', 'CANCELLED']
```

#### `getStatusMessage(status: OrderStatus): string`
Get human-readable status message.

```typescript
const msg = StateManager.getStatusMessage('OUT_FOR_DELIVERY');
// 'Out for Delivery'
```

#### `async executeTransition(request: StateTransitionRequest): Promise<StateTransitionResponse>`
Execute a status transition with audit logging.

```typescript
const result = await StateManager.executeTransition({
  entityId: 'ord_123',
  entityType: 'order',
  fromStatus: 'APPROVED',
  toStatus: 'DISPATCHED',
  reason: 'Ready to ship',
  userId: 'user_456',
  userRole: 'dispatch'
});

if (result.success) {
  console.log('Transitioned:', result.data);
} else {
  console.error('Error:', result.error);
}
```

#### `async getStatusHistory(orderId: string): Promise<StatusHistoryEntry[]>`
Get all status transitions for an order.

```typescript
const history = await StateManager.getStatusHistory('ord_123');
// Array of all status changes with timestamps and users
```

#### `async getAuditLog(orderId: string): Promise<AuditLogEntry[]>`
Get complete audit trail for an order.

```typescript
const audit = await StateManager.getAuditLog('ord_123');
// All changes (status, data, etc.) with complete details
```

#### `getAvailableActions(status: OrderStatus, role: UserRole): OrderStatus[]`
Get valid next statuses (same as getValidTransitions).

```typescript
const nextSteps = StateManager.getAvailableActions('DELIVERED', 'admin');
// What actions are available from current state
```

#### `async validateTransitionRequirements(entityId: string, status: OrderStatus): Promise<boolean>`
Validate if all requirements are met for a transition.

```typescript
const valid = await StateManager.validateTransitionRequirements('ord_123', 'DELIVERED');
// Check business logic (all items in order, payment verified, etc.)
```

---

## Component Props

### StatusBadge Props
```typescript
interface StatusBadgeProps {
  status: OrderStatus | TripStatus | ReturnStatus | PaymentStatus;
  size?: 'sm' | 'md' | 'lg';  // default: 'md'
  showMessage?: boolean;        // Show text label, default: true
  className?: string;           // Additional CSS classes
}
```

### QuickActionButtons Props
```typescript
interface QuickActionButtonsProps {
  orderId: string;
  currentStatus: OrderStatus;
  userRole: UserRole;
  userId: string;
  onTransitionSuccess?: () => void;
  compact?: boolean;  // Show as dropdown, default: false
}
```

### StatusHistoryTimeline Props
```typescript
interface StatusHistoryTimelineProps {
  orderId: string;
  maxItems?: number;  // Limit visible items, default: all
}
```

### StateTransitionModal Props
```typescript
interface StateTransitionModalProps {
  isOpen: boolean;
  orderId: string;
  currentStatus: OrderStatus;
  targetStatus: OrderStatus;
  userRole: UserRole;
  userId: string;
  onSuccess?: (result: StateTransitionResponse) => void;
  onClose?: () => void;
}
```

---

## Common Integration Patterns

### Pattern 1: Simple Status Display
```typescript
export function OrderCard({ order }) {
  return (
    <div className="card">
      <h3>{order.id}</h3>
      <StatusBadge status={order.status} size="md" />
    </div>
  );
}
```

### Pattern 2: Order Details with History
```typescript
export function OrderDetails({ orderId }) {
  const [order, setOrder] = useState(null);

  return (
    <div>
      <h2>{order.id}</h2>
      <StatusBadge status={order.status} size="lg" />
      
      <QuickActionButtons
        orderId={orderId}
        currentStatus={order.status as OrderStatus}
        userRole={userRole}
        userId={userId}
        onTransitionSuccess={() => refetchOrder()}
      />
      
      <StatusHistoryTimeline orderId={orderId} />
    </div>
  );
}
```

### Pattern 3: List with Status Filtering
```typescript
export function OrdersList() {
  const [status, setStatus] = useState<OrderStatus>('DRAFT');
  const orders = useOrders(status);

  return (
    <div>
      <div>
        {Object.values(OrderStatus).map(s => (
          <button 
            key={s}
            onClick={() => setStatus(s)}
          >
            {StateManager.getStatusMessage(s)}
          </button>
        ))}
      </div>
      
      <div>
        {orders.map(order => (
          <div key={order.id}>
            <StatusBadge status={order.status} />
            {order.id} - {order.customerName}
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Pattern 4: Admin Bulk Status Update
```typescript
export function BulkStatusUpdate() {
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [targetStatus, setTargetStatus] = useState<OrderStatus>('APPROVED');

  const handleBulkUpdate = async () => {
    for (const orderId of selectedOrders) {
      const order = orders.find(o => o.id === orderId);
      await StateManager.executeTransition({
        entityId: orderId,
        entityType: 'order',
        fromStatus: order.status,
        toStatus: targetStatus,
        reason: 'Bulk update',
        userId: userId,
        userRole: 'admin'
      });
    }
    refetchOrders();
  };

  return (
    // UI for bulk update...
  );
}
```

---

## Troubleshooting

### Issue: "Cannot read property 'status' of undefined"
**Solution**: Ensure order data is loaded before rendering components
```typescript
if (!order) return <Loading />;
return <StatusBadge status={order.status} />;
```

### Issue: Transition button is disabled
**Solution**: Check user role and current status are valid
```typescript
const valid = StateManager.canTransition(current, next, role);
console.log('Can transition?', valid);
console.log('Role:', role, 'From:', current, 'To:', next);
```

### Issue: Audit logs not appearing
**Solution**: Check user has SELECT permission and order exists
```typescript
// Verify order exists
const order = await supabase.from('orders').select().eq('id', orderId);
// Check auth user has proper role
```

### Issue: RLS policy blocking access
**Solution**: Ensure user is authenticated and role is set
```typescript
// Check auth is working
const { user } = await supabase.auth.getUser();
// Check user has role in auth metadata
console.log(user?.user_metadata?.role);
```

---

## Database Schema for Reference

### audit_logs table
```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  action TEXT,  -- 'CREATE', 'UPDATE', 'DELETE', 'STATUS_CHANGE'
  entity_type TEXT,  -- 'order', 'trip', 'return', 'payment'
  entity_id TEXT,  -- The ID of what was changed
  old_data JSONB,
  new_data JSONB,
  reason TEXT,
  metadata JSONB,
  created_at TIMESTAMP
);
```

### order_status_history table
```sql
CREATE TABLE order_status_history (
  id UUID PRIMARY KEY,
  order_id TEXT REFERENCES orders(id),
  from_status TEXT,
  to_status TEXT,
  reason TEXT,
  user_id UUID REFERENCES auth.users(id),
  metadata JSONB,
  created_at TIMESTAMP
);
```

### trip_status_history table
```sql
CREATE TABLE trip_status_history (
  id UUID PRIMARY KEY,
  trip_id TEXT REFERENCES trips(id),
  from_status TEXT,
  to_status TEXT,
  reason TEXT,
  user_id UUID REFERENCES auth.users(id),
  metadata JSONB,
  created_at TIMESTAMP
);
```

---

## Next Steps

1. **Today (Dec 6)**: Review this guide, import components
2. **Tomorrow (Dec 7)**: Add StatusBadge to pages
3. **Dec 8**: Add QuickActionButtons + Timeline
4. **Dec 9**: Test all transitions
5. **Dec 10**: QA and bug fixes
6. **Dec 11-12**: Production deployment

---

## Questions?

Refer to:
- **Type definitions**: `types/workflow.ts`
- **Implementation guide**: `PHASE_3_1_STATUS_MODEL_GUIDE.md`
- **Integration examples**: `PHASE_3_1_INTEGRATION_EXAMPLES.md`
- **Testing guide**: `PHASE_3_1_TESTING_CHECKLIST.md`

**All code is documented and ready for integration!** ✅
