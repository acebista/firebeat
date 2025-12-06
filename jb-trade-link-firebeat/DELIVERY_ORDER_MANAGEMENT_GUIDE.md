# 📦 Delivery Order Management System - Complete Implementation Guide

## 📋 Table of Contents

1. [Overview](#overview)
2. [Feature Specifications](#feature-specifications)
3. [Architecture](#architecture)
4. [API Endpoints](#api-endpoints)
5. [Data Models](#data-models)
6. [UI Components](#ui-components)
7. [Business Logic](#business-logic)
8. [Testing](#testing)
9. [Usage Guide](#usage-guide)
10. [Troubleshooting](#troubleshooting)

---

## Overview

The **Delivery Order Management System** is a comprehensive solution for delivery personnel to manage order fulfillment with support for:

- ✅ **Payment Capture** - Multiple payment modes (cash, QR, cheque, credit)
- 📸 **Damage Recording** - Track damaged items with deductions
- ↩️ **Sales Returns** - Full or partial returns with refund calculations
- ⏱️ **Delivery Delays** - Record delays with rescheduling
- 📊 **Activity Timeline** - Complete audit trail of all actions
- 🎯 **Real-time Validation** - Form-level and API-level validations

---

## Feature Specifications

### 1. Mark Order as Delivered

**Purpose**: Record successful delivery with payment capture and optional damage reporting

**Inputs**:
- `amountReceived`: Numeric amount (0 ≤ amount ≤ netReceivable) ✓ Required
- `paymentMode`: One of 'cash' | 'qr' | 'cheque' | 'credit' ✓ Required
- `paymentReference`: String (for cheque/transaction ID) - Optional
- `damages`: Array of damaged items - Optional

**Outputs**:
- Order status updated to 'delivered'
- Payment details recorded with timestamp
- Damages recorded if provided
- Activity logged with user and timestamp

**Validations**:
```
✓ amountReceived must be numeric ≥ 0
✓ amountReceived ≤ netReceivable
✓ paymentMode must be valid
✓ If damages provided:
  - Each damage must have qty ≥ 0
  - Each damage must have amount ≥ 0
  - Total damages ≤ subtotal
```

**Example**:
```typescript
const payload: MarkDeliveredPayload = {
  orderId: 'ord-123',
  amountReceived: 5000,
  paymentMode: 'cash',
  damages: [
    {
      productId: 'prod-1',
      productName: 'Widget A',
      qty: 1,
      damageType: 'broken',
      amount: 500,
      notes: 'Broken during delivery'
    }
  ]
};
```

---

### 2. Record Sales Return

**Purpose**: Process customer returns (full or partial) with automatic refund calculation

**Return Types**:
- **Full Return**: All items returned, full refund issued
- **Partial Return**: Specific items/quantities returned, proportional refund

**Inputs**:
- `returnType`: 'full' | 'partial' ✓ Required
- `reason`: Return reason enum ✓ Required
- `items`: Array of returned items (for partial) ✓ Required for partial
- `notes`: Additional context - Optional

**Outputs**:
- Order status updated to 'partially_returned' or 'fully_returned'
- Return details with refund amount calculated
- Activity logged

**Return Reasons**:
- `customer_rejected` - Customer rejected the order
- `quality_issue` - Product quality issue
- `expiry_issue` - Product expiry issue
- `wrong_item` - Wrong item delivered
- `price_negotiation` - Customer negotiated price
- `overstock` - Customer overstock
- `other` - Other reasons

**Validations**:
```
✓ returnType must be 'full' or 'partial'
✓ reason must be from enum
✓ For partial return:
  - items array must not be empty
  - qtyReturned ≤ qtyDelivered for each item
  - qtyReturned > 0 for each item
✓ For full return:
  - If items provided, all qtys must match delivered
```

**Example**:
```typescript
const payload: RecordSalesReturnPayload = {
  orderId: 'ord-123',
  returnType: 'partial',
  reason: 'quality_issue',
  items: [
    {
      productId: 'prod-1',
      productName: 'Widget A',
      qtyDelivered: 5,
      qtyReturned: 2,
      rate: 100,
      returnAmount: 200
    }
  ],
  notes: 'Customer found defects in 2 units'
};
```

---

### 3. Record Delivery Delay

**Purpose**: Mark order as delayed and reschedule delivery

**Inputs**:
- `reason`: Delay reason enum ✓ Required
- `rescheduledDate`: ISO date format ✓ Required
- `notes`: Additional context - Optional

**Outputs**:
- Order status updated to 'delayed'
- Rescheduled date recorded
- Activity logged

**Delay Reasons**:
- `customer_not_available`
- `address_not_found`
- `payment_pending`
- `delivery_slot_full`
- `customer_request`
- `vehicle_issue`
- `traffic`
- `other`

**Validations**:
```
✓ reason must be from enum
✓ rescheduledDate must be provided
✓ rescheduledDate cannot be in the past
✓ rescheduledDate cannot be > 7 days in future
```

**Example**:
```typescript
const payload: RecordDelayPayload = {
  orderId: 'ord-123',
  reason: 'customer_not_available',
  rescheduledDate: '2025-12-07',
  notes: 'Customer will be available tomorrow'
};
```

---

## Architecture

### File Structure

```
jb-trade-link-firebeat/
├── types/
│   └── delivery-order.ts           # TypeScript interfaces
├── lib/
│   └── delivery-order-logic.ts     # Business logic & validations
├── services/
│   └── delivery-orders.ts          # API service layer
├── components/
│   └── delivery/
│       ├── MarkDeliveredModal.tsx  # Delivery modal
│       ├── SalesReturnModal.tsx    # Return modal
│       └── DelayModal.tsx          # Delay modal
├── pages/
│   └── delivery/
│       └── DeliveryOrdersList.tsx  # Main list page
└── __tests__/
    └── delivery-order-logic.test.ts # Unit tests
```

### Data Flow

```
┌─────────────────────────────────────────────────────────┐
│ User selects action (Deliver/Return/Delay)              │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ Modal opens with order details and form                 │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ User fills form (amount, damages, reason, etc.)         │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ Client-side validation (format, ranges)                 │
└────────────────────┬────────────────────────────────────┘
                     │
           ┌─────────┴─────────┐
           │                   │
     ✗ Invalid         ✓ Valid
           │                   │
           ▼                   ▼
    Display errors    Submit to API
           │                   │
           │           ┌───────┴────────┐
           │           │                │
           │     Server-side        Optimistic
           │     validation         update UI
           │           │                │
           │     ┌─────┴─────┐         │
           │     │           │         │
           │  ✗ Fail     ✓ Pass       │
           │     │           │         │
           └─┬───┴─┬─────────┴─────┬───┘
             │     │               │
             ▼     ▼               ▼
         Rollback Success        Update
         Display   Display       Order
         error     toast
```

---

## API Endpoints

### Service Layer Methods

#### Assignment Retrieval

**`getAssignedOrders(deliveryPersonId: string)`**
```typescript
// Returns all orders assigned to delivery person
const orders = await getAssignedOrders('user-123');
```

**`getOrdersByStatus(deliveryPersonId: string, status: string)`**
```typescript
// Returns filtered orders by status
const pending = await getOrdersByStatus('user-123', 'assigned');
```

**`getDeliveryDayStats(deliveryPersonId: string, date: string)`**
```typescript
// Returns statistics for a specific day
const stats = await getDeliveryDayStats('user-123', '2025-12-05');
// Returns: { totalAssigned, delivered, returns, delayed, totalValue, etc. }
```

#### Order Mutations

**`markOrderAsDelivered(payload, order, currentUser)`**
```typescript
// Records delivery with payment
const response = await markOrderAsDelivered(payload, order, user);
// Returns: { success, message, order?, errors? }
```

**`recordSalesReturn(payload, order, currentUser)`**
```typescript
// Records return and refund
const response = await recordSalesReturn(payload, order, user);
// Returns: { success, message, order?, errors? }
```

**`recordOrderDelay(payload, order, currentUser)`**
```typescript
// Records delay and reschedules
const response = await recordOrderDelay(payload, order, user);
// Returns: { success, message, order?, errors? }
```

#### Activity Tracking

**`getOrderActivities(orderId: string)`**
```typescript
// Returns timeline of all actions on order
const activities = await getOrderActivities('ord-123');
// Returns: OrderActivity[]
```

---

## Data Models

### AssignedOrder

```typescript
interface AssignedOrder {
  id: string;
  orderId: string;
  customerId: string;
  customerName: string;
  customerPhone?: string;
  customerAddress?: string;
  
  // Items & amounts
  items: OrderItemForDelivery[];
  subtotal: number;
  damages?: DamagesDeduction;
  salesReturn?: SalesReturnDetails;
  netReceivable: number;
  payment?: PaymentDetails;
  
  // Status
  status: AssignedOrderStatus;
  delay?: DelayDetails;
  
  // Audit
  assignedToUserId: string;
  assignedToUserName: string;
  assignedDate: string;
  activities?: OrderActivity[];
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
}
```

### PaymentDetails

```typescript
interface PaymentDetails {
  amountReceived: number;
  paymentMode: 'cash' | 'qr' | 'cheque' | 'credit';
  reference?: string;           // Cheque#, Txn ID
  notes?: string;
  capturedAt: string;           // ISO timestamp
  capturedByUserId: string;     // Delivery person
}
```

### DamagesDeduction

```typescript
interface DamagesDeduction {
  items: DamagedItem[];
  totalDamagesAmount: number;
  recordedAt: string;
  recordedByUserId: string;
}

interface DamagedItem {
  productId: string;
  productName: string;
  qty: number;
  damageType: 'broken' | 'expired' | 'spoiled' | 'leaking' | 'wrong_item' | 'other';
  amount: number;
  notes?: string;
}
```

### SalesReturnDetails

```typescript
interface SalesReturnDetails {
  returnType: 'full' | 'partial';
  reason: ReturnReason;
  items: ReturnedItem[];
  totalReturnAmount: number;
  notes?: string;
  recordedAt: string;
  recordedByUserId: string;
}

interface ReturnedItem {
  productId: string;
  productName: string;
  qtyDelivered: number;
  qtyReturned: number;
  rate: number;
  returnAmount: number;
}
```

### DelayDetails

```typescript
interface DelayDetails {
  reason: DelayReason;
  rescheduledDate: string;      // ISO date
  notes?: string;
  recordedAt: string;
  recordedByUserId: string;
}
```

### OrderActivity

```typescript
interface OrderActivity {
  id?: string;
  action: 'assigned' | 'out_for_delivery' | 'delivered' | 'sales_return_created' | 'delay_recorded' | 'damage_recorded' | 'payment_captured';
  performedByUserId: string;
  performedByUserName: string;
  timestamp: string;
  description?: string;
  metadata?: Record<string, any>;
}
```

---

## UI Components

### MarkDeliveredModal

**Features**:
- Order summary display
- Amount input with max validation
- Payment mode selector
- Optional damage recording inline
- Balance calculation
- Real-time validation errors

**Props**:
```typescript
interface MarkDeliveredModalProps {
  isOpen: boolean;
  order: AssignedOrder;
  currentUser: User;
  onClose: () => void;
  onSuccess: (updatedOrder: AssignedOrder) => void;
  onError: (error: string) => void;
}
```

**Usage**:
```tsx
<MarkDeliveredModal
  isOpen={activeModal === 'deliver'}
  order={selectedOrder}
  currentUser={user}
  onClose={handleCloseModal}
  onSuccess={handleOrderUpdate}
  onError={showError}
/>
```

### SalesReturnModal

**Features**:
- Full vs Partial return selection
- Item-wise quantity controls (for partial)
- Return reason selector
- Refund amount calculation
- Validation for partial returns

**Props**:
```typescript
interface SalesReturnModalProps {
  isOpen: boolean;
  order: AssignedOrder;
  currentUser: User;
  onClose: () => void;
  onSuccess: (updatedOrder: AssignedOrder) => void;
  onError: (error: string) => void;
}
```

### DelayModal

**Features**:
- Delay reason selector
- Date picker (next day min, 7 days max)
- Current status display
- Rescheduled date summary
- Additional notes field

**Props**:
```typescript
interface DelayModalProps {
  isOpen: boolean;
  order: AssignedOrder;
  currentUser: User;
  onClose: () => void;
  onSuccess: (updatedOrder: AssignedOrder) => void;
  onError: (error: string) => void;
}
```

### DeliveryOrdersList

**Features**:
- Card-based order view
- Search and filter capabilities
- Status-based quick actions
- Summary statistics
- Order details expansion
- Responsive layout

---

## Business Logic

### Calculations

#### 1. Subtotal
```typescript
subtotal = sum(item.qty * item.rate for all items)
```

#### 2. Net Receivable
```typescript
netReceivable = subtotal - damagesAmount - returnAmount
(minimum: 0)
```

#### 3. Remaining Balance
```typescript
balance = netReceivable - amountReceived
(minimum: 0)
```

### Validations

#### Payment Validation
```
✓ amountReceived is numeric
✓ amountReceived ≥ 0
✓ amountReceived ≤ netReceivable
✓ paymentMode is valid enum value
```

#### Damages Validation
```
✓ Each damage qty ≥ 0
✓ Each damage amount ≥ 0
✓ Total damages ≤ subtotal
```

#### Return Validation
```
✓ For partial: at least one item selected
✓ For each item: qtyReturned ≤ qtyDelivered
✓ For each item: qtyReturned > 0
```

#### Delay Validation
```
✓ Reason is valid enum value
✓ Date is provided
✓ Date is not in past
✓ Date is ≤ 7 days from today
```

---

## Testing

### Unit Tests Coverage

```
✓ Calculations
  - calculateSubtotal
  - calculateDamagesTotal
  - calculateReturnTotal
  - calculateNetReceivable
  - calculateRemainingBalance

✓ Validations
  - validateMarkDelivered (5 scenarios)
  - validateSalesReturn (4 scenarios)
  - validateDelay (3 scenarios)

✓ Integration
  - Delivery with damages
  - Partial returns
  - Complex scenarios
```

### Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test delivery-order-logic.test.ts

# Run with coverage
npm test -- --coverage

# Watch mode
npm test -- --watch
```

### Test Examples

```typescript
// Calculate subtotal
it('should sum all item totals', () => {
  const items = [
    { qty: 2, rate: 100, total: 200 },
    { qty: 3, rate: 50, total: 150 }
  ];
  expect(calculateSubtotal(items)).toBe(350);
});

// Validate payment
it('should not allow amount > netReceivable', () => {
  const payload = { amountReceived: 1500 };
  const result = validateMarkDelivered(payload, order);
  expect(result.isValid).toBe(false);
});
```

---

## Usage Guide

### For Delivery Personnel

#### Step 1: View Assigned Orders
```
1. Navigate to Delivery workspace
2. Click "My Delivery Orders"
3. See all assigned orders for the day
```

#### Step 2: Mark Order as Delivered
```
1. Find the order in the list
2. Click "✓ Mark Delivered" button
3. Enter amount received
4. Select payment mode
5. (Optional) Add damages
6. Click "Mark Delivered"
7. See success confirmation
```

#### Step 3: Record Return
```
1. Find the order in the list
2. Click "↩ Sales Return" button
3. Choose Full or Partial return
4. Select reason
5. (If partial) Select items and quantities
6. Click "Record Return"
7. See refund calculated
```

#### Step 4: Record Delay
```
1. Find the order in the list
2. Click "⏱ Record Delay" button
3. Select reason for delay
4. Choose rescheduled date
5. (Optional) Add notes
6. Click "Record Delay"
7. See confirmation
```

### For Developers

#### Integrating with Existing Pages

```typescript
// In DeliveryDashboard.tsx
import { DeliveryOrdersList } from '../pages/delivery/DeliveryOrdersList';

// Add route
<Route path="/delivery/orders" element={<DeliveryOrdersList />} />

// Add navigation
<button onClick={() => navigate('/delivery/orders')}>
  View Orders
</button>
```

#### Extending with Custom Actions

```typescript
// Create custom mutation in services/delivery-orders.ts
export const customAction = async (orderId: string, data: any) => {
  const { data: updatedData, error } = await supabase
    .from(COLS.DELIVERY_ORDERS)
    .update({ status: 'custom_status' })
    .eq('id', orderId)
    .select()
    .single();
  
  if (error) throw error;
  return updatedData;
};
```

---

## Troubleshooting

### Common Issues

#### Issue: "Amount received cannot exceed net receivable"

**Cause**: Entered amount is greater than available balance

**Solution**:
- Check damages and returns are correctly recorded
- Verify netReceivable calculation
- Enter amount ≤ netReceivable

#### Issue: "Partial return requires at least one item"

**Cause**: Selected partial return but didn't select any items

**Solution**:
- Click on each item to select it
- Enter return quantity for selected items
- Or choose "Full Return" instead

#### Issue: "Rescheduled date cannot be in the past"

**Cause**: Selected a date that already passed

**Solution**:
- Choose a future date
- Minimum is tomorrow
- Maximum is 7 days from today

#### Issue: "Payment mode is required"

**Cause**: Forgot to select payment method

**Solution**:
- Select one of: Cash, QR, Cheque, Credit
- Cheque requires cheque number

### Database Issues

#### Verify Tables Exist

```sql
-- Check delivery_orders table
SELECT * FROM delivery_orders LIMIT 1;

-- Check order_activities table
SELECT * FROM order_activities LIMIT 1;
```

#### Check RLS Policies

```sql
-- Verify user can access their orders
SELECT * FROM delivery_orders 
WHERE assignedToUserId = current_user_id;
```

### Performance

#### Slow Loading

**Solution**:
- Add indexes on frequently queried columns:
  ```sql
  CREATE INDEX idx_delivery_orders_user ON delivery_orders(assignedToUserId);
  CREATE INDEX idx_delivery_orders_status ON delivery_orders(status);
  CREATE INDEX idx_order_activities_order ON order_activities(orderId);
  ```

#### Many Orders

**Optimization**:
- Implement pagination in DeliveryOrdersList
- Add date range filtering
- Cache statistics

---

## Summary

The Delivery Order Management System provides:

✅ **Complete order fulfillment workflow**
✅ **Real-time validation and error handling**
✅ **Flexible payment and deduction management**
✅ **Full audit trail with activity logging**
✅ **Responsive UI with modal-based actions**
✅ **Comprehensive test coverage**
✅ **Production-ready code**

**Status**: 🟢 **COMPLETE & READY FOR DEPLOYMENT**
