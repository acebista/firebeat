# ⚡ Quick Start: Bulk Update Orders by Date Range

## In 30 Seconds

1. Go to **Order Management** (Admin Dashboard)
2. Click purple **"📅 Bulk Update by Date"** button (top right)
3. Pick start and end dates
4. Select a status (Approved, Dispatched, Delivered, Cancelled)
5. Click **"Update All Orders"**
6. Confirm in popup
7. ✅ Done! Orders updated and dashboard refreshes

---

## Common Scenarios

### Scenario 1: "I need to test dispatch, reset all orders to Approved"
```
Button: Bulk Update by Date
Start: Today
End: Today  
Status: Approved (Ready for Dispatch)
Click: Update All Orders
```

### Scenario 2: "Mark all orders as delivered for testing"
```
Button: Bulk Update by Date
Start: Today
End: Today
Status: Delivered (Completed)
Click: Update All Orders
```

### Scenario 3: "Reset last week's orders"
```
Button: Bulk Update by Date
Start: Last Monday
End: Last Friday
Status: Approved (Ready for Dispatch)
Click: Update All Orders
```

### Scenario 4: "Simulate mixed delivery states"
```
1. Bulk update to Dispatched first
2. Bulk update to Delivered after
3. Create more test orders as needed
```

---

## What Each Status Means

| Status | Meaning | Use When |
|--------|---------|----------|
| **Approved** | Ready for dispatch | Testing dispatch assignment |
| **Dispatched** | Out for delivery | Testing active delivery |
| **Delivered** | Completed | Testing completed orders |
| **Cancelled** | Cancelled order | Testing cancellations |

---

## ⚠️ Important

- ✅ Only updates orders in the date range you select
- ✅ You can run it multiple times
- ✅ Changes save to database immediately
- ❌ No undo button - be careful!
- ❌ Updates ALL orders in date range (cannot exclude specific ones)

---

## Need More Details?

Read: `BULK_ORDER_STATUS_UPDATE.md` (full documentation)
