# 🔧 PHASE 3.1 - CODE INTEGRATION GUIDE

**Date**: December 6, 2025  
**Status**: Ready for Integration (Dec 7, 2025)  
**Target**: Delivery Order Details & Dashboard pages

---

## 📋 Quick Summary

All Phase 3.1 code components are complete and ready to integrate. This guide shows exactly what to import and where to use them.

### What You're Integrating
- **1 Service**: StateManager (state transitions + audit logs)
- **4 Components**: StatusBadge, StateTransitionModal, StatusHistoryTimeline, QuickActionButtons
- **1 Type System**: OrderStatus, UserRole, and transition definitions

### Time to Integrate
- StatusBadge: 5 min (add to list items)
- StateTransitionModal: 10 min (add to order details)
- StatusHistoryTimeline: 5 min (add to order details)
- QuickActionButtons: 10 min (add to order details)
- **Total: ~30 minutes**

---

## ✅ Prerequisites

### You Have
- ✅ TypeScript strict mode
- ✅ React Router v6
- ✅ Supabase client configured
- ✅ react-hot-toast for notifications
- ✅ lucide-react for icons
- ✅ date-fns for date formatting
- ✅ TailwindCSS for styling

### Already in Place
- ✅ Database tables (audit_logs, order_status_history, trip_status_history)
- ✅ SQL functions (audit_log_insert, status_transition_validate)
- ✅ RLS policies (all configured)
- ✅ Type definitions (/types/workflow.ts)
- ✅ StateManager service (/services/workflow/stateManager.ts)
- ✅ UI Components (/components/workflow/)

---

## 🚀 Integration Steps

### Step 1: Import the Components & Service

In any file where you want to use workflow features:

```typescript
// Import the StateManager service
import { StateManager } from '@/services/workflow/stateManager';

// Import all workflow components
import {
  StatusBadge,
  StateTransitionModal,
  StatusHistoryTimeline,
  QuickActionButtons
} from '@/components/workflow';

// Import types
import { OrderStatus, UserRole, StateTransitionResponse } from '@/types/workflow';

// Import from Zustand or your state management
import { useAuthStore } from '@/store/authStore'; // Adjust to your store
```

---

### Step 2: Use in Order List (Show Status Badge)

**File**: `pages/delivery/DeliveryOrdersList.tsx`

In your table or list rendering code:

```tsx
{orders.map(order => (
  <tr key={order.id}>
    {/* ...existing columns... */}
    
    {/* Add Status Column */}
    <td className="px-6 py-4 whitespace-nowrap">
      <StatusBadge 
        status={order.status} 
        size="md" 
        showMessage={true}
      />
    </td>
    
    {/* ...existing columns... */}
  </tr>
))}
```

**Result**: Status appears with color coding (green=delivered, red=failed, etc.)

---

### Step 3: Use in Order Details Page

**File**: `pages/delivery/DeliveryOrderDetails.tsx`

Add these imports at the top:

```typescript
import { StateManager } from '@/services/workflow/stateManager';
import {
  StatusBadge,
  StateTransitionModal,
  StatusHistoryTimeline,
  QuickActionButtons
} from '@/components/workflow';
import { OrderStatus, UserRole } from '@/types/workflow';
import { useAuthStore } from '@/store/authStore'; // or your auth store
```

Add state for the modal:

```typescript
export const DeliveryOrderDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Get current user from your auth store
  const { user, userRole } = useAuthStore();
  
  const [order, setOrder] = useState<Order | null>(null);
  const [showTransitionModal, setShowTransitionModal] = useState(false);
  
  // ...existing state...
```

**Add Status Display Section** (in render, after main order info):

```tsx
{/* Status and Actions Section */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
  {/* Current Status */}
  <div className="bg-white rounded-lg shadow p-6">
    <h3 className="text-sm font-medium text-gray-500 mb-3">Current Status</h3>
    <StatusBadge 
      status={order.status as OrderStatus} 
      size="lg" 
      showMessage={true}
    />
    {order.status_updated_at && (
      <p className="text-xs text-gray-500 mt-2">
        Updated: {new Date(order.status_updated_at).toLocaleString()}
      </p>
    )}
  </div>

  {/* Quick Actions */}
  <div className="bg-white rounded-lg shadow p-6">
    <h3 className="text-sm font-medium text-gray-500 mb-3">Actions</h3>
    <QuickActionButtons
      orderId={order.id}
      currentStatus={order.status as OrderStatus}
      userRole={userRole as UserRole}
      userId={user?.id || ''}
      onTransitionSuccess={handleTransitionSuccess}
      compact={true}
    />
  </div>

  {/* Status Timeline */}
  <div className="bg-white rounded-lg shadow p-6">
    <h3 className="text-sm font-medium text-gray-500 mb-3">History</h3>
    <StatusHistoryTimeline
      orderId={order.id}
      className="max-h-48 overflow-y-auto"
    />
  </div>
</div>

{/* Status Transition Modal */}
<StateTransitionModal
  isOpen={showTransitionModal}
  orderId={order.id}
  currentStatus={order.status as OrderStatus}
  targetStatus={/* selected target status */}
  userRole={userRole as UserRole}
  userId={user?.id || ''}
  onSuccess={handleTransitionSuccess}
  onClose={() => setShowTransitionModal(false)}
/>
```

**Add Success Handler**:

```typescript
const handleTransitionSuccess = (response: StateTransitionResponse) => {
  // Reload order data
  if (id) {
    loadOrderData(id);
  }
  
  // Show toast notification
  toast.success(`Order status updated to ${StateManager.getStatusMessage(response.newStatus)}`);
};

const loadOrderData = async (orderId: string) => {
  try {
    const orderData = await OrderService.getById(orderId);
    if (orderData) {
      setOrder(orderData);
    }
  } catch (error) {
    console.error('Failed to reload order:', error);
    toast.error('Failed to refresh order');
  }
};
```

---

### Step 4: Update Order Completion Handler

In the existing `handleMarkDelivered` or status update function:

```typescript
const handleMarkDelivered = async () => {
  if (!order || !user) return;
  
  try {
    setProcessing(true);
    
    // Use StateManager instead of direct database call
    const response = await StateManager.executeTransition({
      orderId: order.id,
      fromStatus: order.status as OrderStatus,
      toStatus: 'DELIVERED',
      userId: user.id,
      reason: remarks || 'Delivery completed',
      metadata: {
        amountCollected: parseFloat(amountCollected),
        paymentMode,
        paymentReference,
        timestamp: new Date().toISOString()
      }
    }, userRole as UserRole);

    if (response.success) {
      toast.success('Order marked as delivered');
      navigate('/delivery/orders');
    } else {
      toast.error(response.errors?.[0] || 'Failed to update order');
    }
  } catch (error) {
    console.error('Error updating order:', error);
    toast.error('An error occurred');
  } finally {
    setProcessing(false);
  }
};
```

---

### Step 5: Use in Dashboard

**File**: `pages/delivery/DeliveryDashboard.tsx`

Show status breakdown:

```typescript
import { StatusBadge } from '@/components/workflow';
import { OrderStatus } from '@/types/workflow';

// In your dashboard summary section:
const ordersByStatus = {
  DRAFT: orders.filter(o => o.status === 'DRAFT').length,
  APPROVED: orders.filter(o => o.status === 'APPROVED').length,
  DISPATCHED: orders.filter(o => o.status === 'DISPATCHED').length,
  OUT_FOR_DELIVERY: orders.filter(o => o.status === 'OUT_FOR_DELIVERY').length,
  DELIVERED: orders.filter(o => o.status === 'DELIVERED').length,
  FAILED: orders.filter(o => o.status === 'FAILED').length,
  CANCELLED: orders.filter(o => o.status === 'CANCELLED').length,
};

return (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    {Object.entries(ordersByStatus).map(([status, count]) => (
      <div key={status} className="bg-white rounded-lg shadow p-4">
        <StatusBadge 
          status={status as OrderStatus} 
          size="sm" 
        />
        <p className="text-2xl font-bold mt-2">{count}</p>
      </div>
    ))}
  </div>
);
```

---

## 🔄 How It Works

### State Transition Flow

```
User clicks action button
    ↓
QuickActionButtons shows valid options
    ↓
User selects target status
    ↓
StateTransitionModal opens
    ↓
Modal validates transition is allowed
    ↓
User confirms with notes/reason
    ↓
StateManager.executeTransition() called
    ↓
Database updates: orders table + audit_logs + order_status_history
    ↓
onSuccess callback fires
    ↓
Order details refresh
    ↓
User sees updated status badge
```

### Audit Trail

Every state transition creates:
1. **orders table update**: status, status_updated_at, status_updated_by
2. **order_status_history entry**: from_status, to_status, reason, user_id
3. **audit_logs entry**: action, entity_type, entity_id, old_data, new_data, reason

---

## 📊 Types Reference

### Main Types to Import

```typescript
// Current status of order
type OrderStatus = 
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

// User role for permission checks
type UserRole = 
  | 'admin' 
  | 'manager' 
  | 'supervisor' 
  | 'dispatch' 
  | 'delivery_agent' 
  | 'accountant';

// Response from state transition
interface StateTransitionResponse {
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

## 🎨 Component Props

### StatusBadge

```typescript
interface StatusBadgeProps {
  status: OrderStatus;           // Required: The status to display
  size?: 'sm' | 'md' | 'lg';     // Optional: Badge size (default: 'md')
  showMessage?: boolean;          // Optional: Show status message text (default: false)
  className?: string;             // Optional: Additional CSS classes
}

// Usage:
<StatusBadge 
  status="DELIVERED" 
  size="lg" 
  showMessage={true}
  className="inline-block"
/>
```

### StateTransitionModal

```typescript
interface StateTransitionModalProps {
  isOpen: boolean;                        // Required: Modal open state
  orderId: string;                        // Required: Order ID
  currentStatus: OrderStatus;             // Required: Current status
  targetStatus: OrderStatus;              // Required: Target status
  userRole: UserRole;                     // Required: User role for permissions
  userId: string;                         // Required: Current user ID
  onSuccess?: (response: StateTransitionResponse) => void;  // Optional: Success callback
  onClose: () => void;                    // Required: Close modal callback
}

// Usage:
<StateTransitionModal
  isOpen={showModal}
  orderId="order-123"
  currentStatus="DISPATCHED"
  targetStatus="OUT_FOR_DELIVERY"
  userRole="delivery_agent"
  userId="user-456"
  onSuccess={handleSuccess}
  onClose={() => setShowModal(false)}
/>
```

### StatusHistoryTimeline

```typescript
interface StatusHistoryTimelineProps {
  orderId: string;                // Required: Order ID to load history for
  className?: string;             // Optional: Additional CSS classes
}

// Usage:
<StatusHistoryTimeline
  orderId="order-123"
  className="bg-white rounded p-4"
/>
```

### QuickActionButtons

```typescript
interface QuickActionButtonsProps {
  orderId: string;                                    // Required: Order ID
  currentStatus: OrderStatus;                         // Required: Current status
  userRole: UserRole;                                 // Required: User role
  userId: string;                                     // Required: Current user ID
  onTransitionSuccess?: (response: StateTransitionResponse) => void;  // Optional
  className?: string;                                 // Optional: CSS classes
  compact?: boolean;                                  // Optional: Compact mode (default: false)
}

// Usage:
<QuickActionButtons
  orderId="order-123"
  currentStatus="APPROVED"
  userRole="dispatch"
  userId="user-456"
  onTransitionSuccess={handleSuccess}
  compact={true}
/>
```

---

## 🧪 Testing the Integration

### Test 1: Display Status Badge
- [ ] Open delivery orders list
- [ ] Verify status badges appear with correct colors
- [ ] Verify status message appears when showMessage={true}

### Test 2: Show History Timeline
- [ ] Open order details
- [ ] Scroll to status history section
- [ ] Verify timeline shows previous transitions
- [ ] Verify user names and timestamps display

### Test 3: Click Action Button
- [ ] Open order details with APPROVED status and dispatch role
- [ ] Click "Actions" button
- [ ] Verify dropdown shows valid transitions (DISPATCHED, CANCELLED)
- [ ] Click "DISPATCHED" option

### Test 4: Complete State Transition
- [ ] Modal opens with current and target status
- [ ] Enter reason/notes
- [ ] Click "Confirm"
- [ ] Verify status updates in real-time
- [ ] Verify new entry in history timeline

### Test 5: Audit Log Created
- [ ] After transition, check audit_logs table:
  ```sql
  SELECT * FROM audit_logs 
  WHERE entity_id = 'order-123' 
  ORDER BY created_at DESC LIMIT 1;
  ```
- [ ] Verify: action='STATUS_CHANGE', old_data, new_data, reason

### Test 6: Permission Check
- [ ] Login as delivery_agent
- [ ] Open order with status DRAFT
- [ ] Verify no actions available (delivery agents can't approve)
- [ ] See "Not Authorized" message

---

## 🐛 Troubleshooting

### Import Errors

**Error**: `Cannot find module '@/components/workflow'`

**Solution**: Check that vite.config.ts has path alias:
```typescript
resolve: {
  alias: {
    '@': path.resolve(__dirname, './'),
  }
}
```

And tsconfig.json has:
```json
"baseUrl": ".",
"paths": {
  "@/*": ["./*"]
}
```

### Status Not Updating

**Check**:
1. Is the response.success === true?
2. Is the order actually being fetched fresh after transition?
3. Check browser console for errors
4. Check Supabase logs for constraint errors

### Modal Not Showing

**Check**:
1. Is showTransitionModal state actually true?
2. Is the component being rendered in JSX?
3. Check useStatus hook is working
4. Verify orderId is passed correctly

### Icons Missing

**Install**:
```bash
npm install lucide-react
```

---

## 📅 Integration Timeline

| Date | Developer | Task | Status |
|------|-----------|------|--------|
| Dec 7 | Dev 1 | Add StatusBadge to lists | ⏳ |
| Dec 7 | Dev 2 | Add StateTransitionModal to details | ⏳ |
| Dec 7 | Dev 3 | Add StatusHistoryTimeline | ⏳ |
| Dec 8 | Dev 1 | Add QuickActionButtons | ⏳ |
| Dec 8 | Dev 2 | Test transitions | ⏳ |
| Dec 9 | QA | Run 50+ test cases | ⏳ |

---

## 📞 Support

### Need Help?

1. **Check Documentation**: `PHASE_3_1_INTEGRATION_EXAMPLES.md`
2. **Review Types**: `types/workflow.ts` (well-commented)
3. **Check Service**: `services/workflow/stateManager.ts` (has JSDoc)
4. **Read Component Docs**: Each component has full JSDoc headers

### Common Questions

**Q: How do I know if a transition is valid?**
```typescript
const isValid = StateManager.canTransition(
  'DRAFT',
  'APPROVED', 
  'manager'  // returns true if manager can do this
);
```

**Q: How do I get all valid transitions for current role?**
```typescript
const options = StateManager.getValidTransitions(
  'APPROVED',  // current status
  'dispatch'   // user role
);
// Returns: ['DISPATCHED', 'CANCELLED']
```

**Q: How do I get the user-friendly message for a status?**
```typescript
const msg = StateManager.getStatusMessage('OUT_FOR_DELIVERY');
// Returns: "Currently being delivered"
```

**Q: How do I view the audit trail?**
```typescript
const logs = await StateManager.getAuditLog(orderId);
// Returns array of all changes for this order
```

---

## ✅ Verification Checklist

Before shipping to production:

- [ ] All imports resolve without errors
- [ ] TypeScript compiles with no errors
- [ ] Status badges appear on all order lists
- [ ] State transition modal opens and closes correctly
- [ ] Status history timeline loads and displays
- [ ] Quick action buttons show valid transitions only
- [ ] Transition creates audit log entry
- [ ] Transition updates order.status field
- [ ] Transition updates order.status_updated_at field
- [ ] Transition updates order.status_updated_by field
- [ ] Permission checks work (unauthorized shows message)
- [ ] Toast notifications appear on success/error
- [ ] Page refreshes show updated status

---

**Document**: PHASE_3_1_CODE_INTEGRATION_GUIDE.md  
**Version**: 1.0  
**Status**: READY FOR INTEGRATION (Dec 7, 2025)
