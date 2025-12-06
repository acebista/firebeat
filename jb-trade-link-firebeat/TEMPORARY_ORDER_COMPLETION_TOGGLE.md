# Temporary Order Completion Toggle Feature

## Overview
A temporary feature has been added to the **Dispatch Trip Details** modal to allow manual toggling of order completion status between "COMPLETED" (delivered) and "UNFINISHED" (dispatched).

## Why This Feature Exists
- Currently, orders are created as "approved" and remain so until manually marked as "delivered"
- There's no automatic mechanism to mark orders as completed based on delivery confirmation
- This temporary UI allows testing and managing order states for development/testing purposes

## Location
**File:** `/pages/admin/DispatchTripDetails.tsx`

**Component:** `DispatchTripDetails` modal

## How It Works

### Bulk Toggle - "Mark All Completed" Button
- **Location:** Top right of the orders table
- **Visibility:** Only shows when trip is NOT in draft status
- **Colors:**
  - Green button with "✓ Mark All Completed" - when orders are unfinished
  - Amber button with "↩️ Mark Unfinished" - when orders are already completed
- **Action:** Toggles all orders in the trip between:
  - `dispatched` status (UNFINISHED)
  - `delivered` status (COMPLETED)

### Individual Toggle - Per-Order Toggle Buttons
- **Location:** Last column of the orders table
- **Visibility:** Only shows when trip is NOT in draft status
- **Button Text:**
  - "✓ Done" (green background) - for unfinished orders
  - "↩️ Undo" (amber background) - for finished orders
- **Action:** Toggles individual order status

### Order Status Indicators
- **Table Row Background:** 
  - Green tint (bg-green-50) for completed orders
  - Normal for unfinished orders
- **Status Badge in Status Column:**
  - Green badge: "✓ DONE" (for delivered)
  - Blue badge: "PENDING" (for dispatched)

## User Flow

1. Create a dispatch trip in the Dispatch Planner
2. Assign orders to the trip
3. Mark trip as "ready for packing", "packed", or "out for delivery"
4. In Trip Details, use the toggle buttons to manually mark orders as completed/unfinished
5. View the status updates immediately in the table

## Implementation Details

### Functions Added
```tsx
// Toggle all orders in a trip
handleToggleAllOrdersCompletion()

// Toggle individual order
handleToggleOrderCompletion(orderId: string)
```

### Order Status Flow (Temporary)
```
approved (when created)
    ↓
dispatched (when assigned to trip and trip sent out)
    ↓
delivered/dispatched (can be toggled manually via this feature)
```

## Important Notes

⚠️ **This is a TEMPORARY feature and should be replaced with:**
- Automatic order completion when delivery is confirmed by delivery person
- Completion based on actual delivery events (scanned at door, photo confirmation, etc.)
- Integration with mobile app delivery flow
- Logic for partial deliveries, returns, and refusals

## Future Removal

This feature will be removed once proper delivery confirmation workflow is implemented:

1. Delivery person scans/confirms delivery on mobile app
2. System automatically marks order as "delivered"
3. Handles special cases:
   - Partial delivery
   - Customer not available → reschedule
   - Order refused → return to stock
   - Damaged/short supply → create claim

## Testing Scenarios

### Test Case 1: Mark Single Order Complete
1. Create trip with orders
2. Send trip out for delivery
3. Click "✓ Done" on one order
4. Verify order row turns green and badge changes to "✓ DONE"

### Test Case 2: Bulk Complete All Orders
1. Create trip with 5+ orders
2. Send trip out for delivery
3. Click "✓ Mark All Completed" button
4. Verify all rows turn green and show "✓ DONE"

### Test Case 3: Undo Completion
1. Follow Test Case 2
2. Click "↩️ Mark Unfinished"
3. Verify all orders return to normal and show "PENDING"

### Test Case 4: Draft Trip (No Toggle Buttons)
1. Create trip but DON'T mark for packing
2. Verify toggle buttons are NOT visible
3. You can only remove orders in draft state

## Database Impact
- Orders in the `orders` table will have their `status` field updated
- Changes persist in Supabase
- Orders with `delivered` status are excluded from future dispatch pools
- Orders with `dispatched` status can be toggled back if needed

## Related Files
- `types.ts` - Order interface with status type
- `services/db.ts` - OrderService.updateStatus() method
- `DispatchTripDetails.tsx` - Main implementation

---

**Status:** TEMPORARY - To be replaced with automatic delivery confirmation workflow
**Priority:** Medium - Testing only, not for production use
