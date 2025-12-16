# Delivery Packing List - Quick Reference Guide

## Quick Start

### For Delivery Users
1. Log in to dashboard
2. Find your assigned trip in the "My Trips" section
3. Click **"📦 Packing List"** button
4. You're on the packing list page!

### For Developers
```bash
# Route
GET /delivery/packing-list/:tripId

# Service location
services/packing/packingService.ts

# Component location
pages/delivery/PackingListPage.tsx

# Database table
packing_progress (created via migration)
```

## User Guide

### Viewing Items
- **Table shows**: Product Name | Company | Customer | Qty | Order ID
- **All items**: From all orders in your assigned trip
- **Search**: Type to filter by product, company, or customer
- **Filters**: All / Pending / Done (with counts)

### Marking Items Done
1. **Click the circle icon** next to an item
2. Item immediately shows with **green checkmark** ✓
3. **Text becomes strikethrough** and **gray**
4. **Saves automatically** to server
5. **Persists** even after closing app

### Bulk Actions
- **Mark All Done**: Marks all pending items as done instantly
- **Undo**: Click checkmark again to mark as pending

### Progress Tracking
- **Progress Bar**: Shows completion percentage at top
- **Counter**: Shows X/Y items done
- **Status**: Visual feedback on all operations

## Common Tasks

### I marked something wrong
**Solution**: Click the green checkmark to toggle it back to pending

### I need to find a specific item
**Solution**: Use the search box to filter by product name, company, or customer name

### How do I mark everything as done?
**Solution**: Click the "Mark All Done" button (appears when there are pending items)

### Will my progress save if I close the app?
**Yes!** All progress is saved to the server immediately. You can close, open a different browser, or use a different device—your progress stays.

## Technical Details

### Item IDs
Items are identified by: `order_id-item_index`
- Example: `ORD-123-456-0` means first item in order ORD-123-456

### Status Storage
Done/pending status is stored in `packing_progress` table with:
- `trip_id`: Which trip
- `order_id`: Which order
- `item_id`: Which item
- `is_done`: True/False
- `updated_at`: When last changed
- `updated_by`: Which user changed it

### Search Behavior
- **Case-insensitive** (HELLO = hello)
- **Partial matches** (Pro = Product Name)
- **Real-time** (updates as you type)

### Filtering Logic
- **All**: Shows everything
- **Pending**: Only unchecked items
- **Done**: Only checked items
- **Combines with search**: Filter + search = both applied

## API / Service Functions

### Get Trip with Orders
```typescript
const trip = await getTripWithOrders(tripId);
// Returns: {
//   id, deliveryDate, deliveryPersonId, deliveryPersonName,
//   routeNames, status,
//   orders: [{ id, customerName, items: PackingItem[] }]
// }
```

### Get Packing Progress
```typescript
const progress = await getPackingProgress(tripId);
// Returns: PackingProgress[]
// [{trip_id, order_id, item_id, is_done, ...}, ...]
```

### Mark Item Done/Pending
```typescript
await upsertPackingProgress(tripId, orderId, itemId, true); // Mark done
await upsertPackingProgress(tripId, orderId, itemId, false); // Mark pending
```

### Mark All Done
```typescript
await markAllDone(tripId, items);
// Marks all items in array as done in one operation
```

## Database Schema

### packing_progress Table
| Column | Type | Notes |
|--------|------|-------|
| id | TEXT (UUID) | Primary key |
| trip_id | TEXT | Foreign key → trips(id) |
| order_id | TEXT | Foreign key → orders(id) |
| item_id | TEXT | Item identifier |
| is_done | BOOLEAN | Default: FALSE |
| updated_at | TIMESTAMP | Auto-updated |
| updated_by | UUID | User who changed it |

**Indexes**:
- trip_id (fast lookup by trip)
- order_id (fast lookup by order)
- trip_id + order_id (fast lookup by trip + order)

**Unique Constraint**: (trip_id, order_id, item_id)
- Only one progress record per item per trip

### RLS Policies
✓ Delivery users can only see/edit their own trip's progress
✓ Admins can see/edit all progress
✓ Enforced at database level (not just application)

## Troubleshooting

### "Trip not found" error
**Cause**: Invalid trip ID or trip doesn't exist
**Fix**: Go back and select a valid trip

### "Unauthorized" error
**Cause**: You're not assigned to this trip
**Fix**: Only view trips assigned to you

### "Failed to update item" toast
**Cause**: Network error or RLS violation
**Fix**: Check connection; try again. If persistent, contact admin

### Search doesn't work
**Cause**: Item fields might be empty
**Fix**: Check that product name, company, or customer name is filled

### Done state not saving
**Cause**: Network issue or RLS policy
**Fix**: Check internet connection; wait a moment; try again

### Page stuck loading
**Cause**: Slow network or database issue
**Fix**: Refresh page; check internet; wait a moment

## Performance Tips

- **Search as you type**: No performance issues, searches happen client-side
- **Mark all done**: Fast bulk operation, use instead of individual clicks
- **Refresh if stuck**: Page will refetch all data fresh

## Keyboard Shortcuts

Currently supported:
- **Tab**: Move between checkboxes
- **Space**: Toggle checkbox (when focused)
- **Enter**: Navigate to selected item

## Accessibility

- **Keyboard navigation**: Full support via Tab and Space
- **Screen readers**: Icons have `title` attributes
- **High contrast**: Dark text on light backgrounds
- **Checkbox sizes**: Large clickable targets (44x44px minimum)

## Integration Points

### DeliveryDashboard
- Button appears when trip is expanded
- Navigates to `/delivery/packing-list/:tripId`

### Authentication
- Requires 'delivery' or 'admin' role
- Verifies user is assigned to trip

### Notifications
- Toast messages for success/failure
- Error banner for critical issues
- Loading spinner while fetching

## Files Modified

```
✓ App.tsx                         - Added route
✓ pages/delivery/DeliveryDashboard.tsx  - Added button
✓ services/packing/packingService.ts    - New service layer
✓ pages/delivery/PackingListPage.tsx    - New component
✓ Database migration applied             - packing_progress table
```

## Next Steps

### For Users
- Start using the packing list on your next delivery
- Report any issues or feature requests

### For Developers
- Monitor error logs for common issues
- Consider mobile optimization (swipe, barcode)
- Plan for analytics (packing time, efficiency)

## Support

For issues:
1. Check Troubleshooting section above
2. Review console errors (F12)
3. Contact admin with:
   - Trip ID
   - Error message
   - Steps to reproduce
   - Browser/device info

---

**Version**: 1.0
**Last Updated**: December 16, 2025
**Status**: Production Ready
