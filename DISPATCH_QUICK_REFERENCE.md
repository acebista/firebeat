# Dispatch Improvements - Quick Reference Guide

## Overview

This document provides quick access to all the dispatch improvements implemented in Phase 5.

---

## Feature Summary

### 1. Assignment Prevention
**What**: Prevents orders from being re-selected after assignment
**Where**: `pages/admin/Dispatch.tsx` lines 71-72, 84, 276-279
**Key Code**: 
```tsx
disabled={!!order.assignedTripId}
const selectable = groupOrders.filter(o => !o.assignedTripId);
```

### 2. Assignment Display
**What**: Shows delivery person, vehicle, and date for assigned orders
**Where**: `pages/admin/Dispatch.tsx` lines 291-300
**Key Code**:
```tsx
const getOrderAssignmentDetails = (orderId: string) => {
  const trip = trips.find(t => t.orderIds.includes(orderId));
  return trip ? { tripId, deliveryPersonName, vehicleName, deliveryDate } : null;
};
```

### 3. Group Counts
**What**: Shows "X total • Y available" in group headers
**Where**: `pages/admin/Dispatch.tsx` lines 232, 240-242
**Key Code**:
```tsx
const unassignedCount = group.orders.filter((o: Order) => !o.assignedTripId).length;
// Display: {group.orders.length} total • {unassignedCount} available
```

---

## File Locations

```
jb-trade-link-firebeat/
├── pages/
│   ├── admin/
│   │   ├── Dispatch.tsx          ← PRIMARY (482 lines)
│   │   ├── Orders.tsx            ← Bulk update feature
│   │   └── DispatchTripDetails.tsx  ← Order completion
│   └── sales/
│       ├── CreateOrder.tsx       ← Status 'approved'
│       └── EditOrder.tsx         ← Removed 'pending'
├── types.ts                      ← Order type with assignedTripId
└── DISPATCH_*.md                 ← Documentation
```

---

## Database Schema

### Order Type

```typescript
interface Order {
  // ... existing fields ...
  status: 'approved' | 'dispatched' | 'delivered' | 'cancelled';  // No 'pending'
  assignedTripId?: string;  // Links to DispatchTrip.id
  // ... other fields ...
}
```

**Key Change**: Added `assignedTripId?: string` field

---

## UI Components

### Order Row States

**Unassigned Order**
- Checkbox: Enabled (clickable)
- Background: White/default
- Hover: Light indigo

**Assigned Order**
- Checkbox: Disabled (grayed out)
- Background: Light blue (`bg-blue-50`)
- Badge: Blue assignment details
- Opacity: Slightly reduced

### Group Header

**Format**: 
```
[Group Name]
X total • Y available
₹[Amount]
```

**Selection**:
- Checkbox toggles all unassigned orders in group
- Assigned orders never selected by group toggle

---

## Key Functions

### `getOrderAssignmentDetails(orderId: string)`
**Purpose**: Fetch assignment info for order
**Returns**: `{ tripId, deliveryPersonName, vehicleName, deliveryDate }` or `null`
**Location**: Line 58-61

### `toggleGroupSelection(groupOrders: Order[])`
**Purpose**: Toggle all unassigned orders in group
**Logic**: Only affects orders where `!assignedTripId`
**Location**: Line 84

### `toggleOrderSelection(orderId: string)`
**Purpose**: Toggle single order selection
**Guard**: Only works if order not assigned
**Location**: Line 83

---

## State Variables

```typescript
// Core state
const [orders, setOrders] = useState<Order[]>([]);
const [trips, setTrips] = useState<DispatchTrip[]>([]);
const [selectedOrderIds, setSelectedOrderIds] = useState<Set<string>>(new Set());

// Derived state
const unassignedOrders = filteredOrders.filter(o => !o.assignedTripId);
const assignedOrders = filteredOrders.filter(o => o.assignedTripId);
```

---

## CSS Classes

### Order States
```tsx
// Available order
className={`px-4 py-2 flex items-start gap-3 hover:bg-indigo-50 cursor-pointer`}

// Assigned order (light blue background)
className={`px-4 py-2 flex items-start gap-3 bg-blue-50 opacity-75 cursor-pointer`}
```

### Assignment Badge
```tsx
className="text-xs text-blue-800 bg-blue-100 px-2 py-1 rounded border border-blue-200"
```

### Group Header
```tsx
className="flex items-center bg-gradient-to-r from-indigo-50 to-white px-4 py-3 hover:from-indigo-100"
```

---

## Common Tasks

### Add New Order Filtering

1. Go to `filteredOrders` (line 64-69)
2. Add new filter condition
3. Example:
```tsx
const matchesStatus = o.status === 'approved';
return matchesSearch && matchesDate && matchesSalesperson && matchesStatus;
```

### Change Assignment Visual

1. Find order rendering (lines 258-302)
2. Modify `className` or styling
3. Key areas:
   - Disabled checkbox: line 276
   - Background color: line 263
   - Badge styling: lines 296-298

### Modify Assignment Details

1. Edit `getOrderAssignmentDetails()` (lines 58-61)
2. Change what fields are returned
3. Update badge display (lines 296-298)

### Update Group Count Logic

1. Change `unassignedCount` calculation (line 232)
2. Update display text (line 240-242)

---

## Testing Scenarios

### Test 1: Assignment Prevention
1. Assign order to trip
2. Page refreshes
3. Verify checkbox is disabled
4. Try to select assigned order (should not work)
5. Group toggle should skip assigned orders

### Test 2: Assignment Details
1. Assign order to trip with vehicle
2. Verify badge appears below order ID
3. Check delivery person name displays
4. Check vehicle name displays
5. Check date displays correctly

### Test 3: Group Counts
1. Have group with 5 orders, 2 assigned
2. Header should show "5 total • 3 available"
3. Unassign one order
4. Header should update to "5 total • 4 available"

### Test 4: Group Toggle
1. Select group checkbox
2. Only unassigned orders selected
3. Assigned orders remain unselected
4. Click again to deselect all unassigned

---

## Build & Deploy

```bash
# Build
npm run build

# Expected output
# ✓ 2532 modules transformed
# ✓ built in 4.25s

# Verify no errors
npm run build 2>&1 | grep error  # Should be empty
```

---

## Performance Tips

1. **Avoid re-filtering**: Cache `unassignedOrders` and `assignedOrders`
2. **Memoize components**: Use React.memo for OrderGroup
3. **Lazy load trips**: Load trips on demand if list grows large
4. **Index searches**: Consider database indexes for orderIds

---

## Common Issues & Solutions

### Issue: Assigned order checkbox still selectable
**Solution**: Verify `disabled={!!order.assignedTripId}` is in checkbox
**File**: Line 276

### Issue: Assignment badge not showing
**Solution**: Check `getOrderAssignmentDetails()` returns correct data
**File**: Line 58-61
**Debug**: Log result in JSX

### Issue: Group count wrong
**Solution**: Verify `unassignedCount` filter logic
**File**: Line 232
**Check**: Are you filtering on correct field?

### Issue: Build fails with syntax error
**Solution**: Check for unclosed JSX tags or string quotes
**File**: Dispatch.tsx
**Verify**: All opening tags have closing tags

---

## Related Documentation

- **Full Implementation**: `DISPATCH_IMPROVEMENTS_SUMMARY.md`
- **Completion Status**: `DISPATCH_PHASE5_COMPLETION.md`
- **Bulk Updates**: `BULK_UPDATE_DOCUMENTATION_INDEX.md`
- **Type Definitions**: `types.ts` (lines 85-105)

---

## Links to Code

| Component | File | Lines |
|-----------|------|-------|
| Assignment Details | Dispatch.tsx | 58-61 |
| Unassigned Filter | Dispatch.tsx | 71-72 |
| Group Selection | Dispatch.tsx | 84 |
| Order Display | Dispatch.tsx | 258-302 |
| Group Header | Dispatch.tsx | 232-255 |
| Assignment Badge | Dispatch.tsx | 291-300 |

---

## Contact & Support

For questions:
1. Review the related documentation files
2. Check the source code with line numbers above
3. Run build verification: `npm run build`
4. Check browser console for error messages

---

**Last Updated**: December 5, 2025
**Version**: 1.0
**Status**: Production Ready ✅
