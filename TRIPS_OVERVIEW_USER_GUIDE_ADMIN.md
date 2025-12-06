# How to Use: Delivery Trips Overview (Admin Guide)

## Quick Start

### Access the Feature
1. **Log in as Admin**
2. **Navigate to**: Admin Dashboard
3. **Click**: "Delivery Trips Overview" (or go to `/admin/trips`)

---

## Step-by-Step Walkthrough

### Step 1: Check Overall Status

When you first open the Trips Overview page, you see 5 stat cards at the top:

```
Total Trips: 12 | Active: 5 | Total Orders: 48 | Completed: 32 | Value: ₹45.2L
```

**What this tells you:**
- ✓ 12 trips have been created
- ✓ 5 are currently being delivered
- ✓ You have 48 orders in system
- ✓ 32 have been delivered (67% complete)
- ✓ Total order value is ₹45.2 Lakh

**Action**: If completion rate is low, consider reassigning workload.

---

### Step 2: Use Search to Find Specific Trips

**Scenario**: You want to check on Rajesh's trips

1. Click the **search box** at top
2. Type **"Rajesh"**
3. The page filters to show only Rajesh's trips

```
[🔍 Search by delivery person, vehicle, or trip ID...]
```

**Search Examples:**
- Search **"Rajesh"** → All trips for Rajesh
- Search **"Mahindra"** → All trips with Mahindra vehicle
- Search **"trip_abc"** → Specific trip by ID

---

### Step 3: Filter by Trip Status

**Scenario**: You want to see only active deliveries happening right now

1. Look at the **filter buttons** below search:
   ```
   [All] [Draft] [Active] [Completed]
   ```

2. Click **"Active"**
3. Page shows only trips with status "out_for_delivery"

**Filter Options:**
- **All**: Show everything
- **Draft**: Not yet started (ready to assign)
- **Active**: Currently being delivered (in progress)
- **Completed**: All orders delivered

**Common Workflows:**
- Click **"Active"** to see live deliveries
- Click **"Draft"** to see trips ready to start
- Click **"Completed"** to review finished trips

---

### Step 4: View Trip Card Details

Each trip is displayed as a card:

```
┌──────────────────────────────────────────────┐
│ 🚚 Rajesh Kumar - 2025-12-05  [Active]       │
│    Vehicle: Mahindra • Orders: 8 • ₹24,500  │
│                                               │
│    Progress: 50% [████░░░░░░░░░░░░░░░░]     │
│                                               │
│    1 | John's Grocery   | ORD-123 | ₹5,000 ✓ │
│    2 | Mike's Shop      | ORD-124 | ₹3,200   │
│    3 | Sarah's Store    | ORD-125 | ₹2,100 ✓ │
│    4 | Ahmed's Market   | ORD-126 | ₹4,100   │
│    ... (4 more orders)                       │
│                                               │
│                      [View Details] [×]      │
└──────────────────────────────────────────────┘
```

**What each section shows:**

**Header**: 
- Delivery person name
- Delivery date
- Status badge (Draft/Active/Completed)

**Info Row**:
- Vehicle assigned
- Number of orders
- Total value

**Progress Bar**:
- Visual % complete
- Percentage number
- Helps identify which trips are falling behind

**Orders List**:
- Sequential stop number (#1, #2, etc.)
- Customer/shop name
- Order ID
- Order amount (₹)
- Status (✓ = delivered, blank = pending)

---

### Step 5: Take Action on a Trip

#### Option A: View Full Trip Details

Click **"View Details"** button to:
- See full trip management interface
- Edit trip assignments
- Add or remove orders
- Change delivery person
- Mark orders complete manually
- Change trip status

```
[View Details] →  /admin/dispatch/trips/:id
```

#### Option B: Expand/Collapse Orders List

Click anywhere on the trip card to expand/collapse the orders list:

```
🚚 Rajesh Kumar - 2025-12-05  [Click to expand]
```

---

### Step 6: Monitor Delivery Personnel

Scroll to the bottom of the page to see the **Personnel Summary Panel**:

```
┌────────────────────────────────────────────────┐
│  Delivery Personnel Status                      │
├────────────────────────────────────────────────┤
│                                                 │
│  ┌─────────────────────┐  ┌─────────────────┐ │
│  │ Rajesh Kumar        │  │ Priya Singh     │ │
│  │ Trips: 3            │  │ Trips: 2        │ │
│  │ Orders: 24          │  │ Orders: 16      │ │
│  │ Completed: 15       │  │ Completed: 8    │ │
│  └─────────────────────┘  └─────────────────┘ │
│                                                 │
│  ┌─────────────────────┐  ┌─────────────────┐ │
│  │ Anil Kumar          │  │ Meera Sharma    │ │
│  │ Trips: 1            │  │ Trips: 2        │ │
│  │ Orders: 8           │  │ Orders: 12      │ │
│  │ Completed: 8        │  │ Completed: 5    │ │
│  └─────────────────────┘  └─────────────────┘ │
│                                                 │
└────────────────────────────────────────────────┘
```

**What this shows:**
- Each delivery person's active trips count
- Total orders they're handling
- How many they've completed

**Use this to:**
- Identify who's overloaded
- Balance workload (reassign from busy people)
- Recognize high performers
- Plan staffing

**Example Insight**: 
- Meera has 12 orders but only completed 5 (42%)
- Rajesh completed 15/24 (63%)
- Anil completed 8/8 (100%) ← Star performer!

---

## Common Tasks

### Task 1: Check Active Deliveries

1. Click filter: **[Active]**
2. See all trips currently being delivered
3. Check progress bars to identify any stuck trips
4. Click "View Details" on slow ones to investigate

---

### Task 2: Find a Specific Delivery Person

1. Type their name in search box
2. See all their trips across all statuses
3. Check their total orders and completed count
4. Monitor their progress

---

### Task 3: Check Delivery Progress by Vehicle

1. Type vehicle name in search box
   - Example: "Mahindra", "Tata", "Bajaj"
2. See all trips using that vehicle
3. Check if vehicle utilization is optimal

---

### Task 4: Identify Bottlenecks

1. Look at Progress bars on trip cards
2. Find trips with 0% or very low progress
3. Click "View Details" on those trips
4. Check why orders aren't being completed
5. Consider:
   - Reassigning some orders to other trips
   - Checking with delivery person
   - Identifying problem customers/locations

---

### Task 5: Create New Trip

1. Click **"Create New Trip"** button (top right)
2. This takes you to Dispatch Planner
3. Create and assign new trip there
4. Return to Trips Overview to see it

---

### Task 6: Reassign Orders

1. Find trip with too many orders
2. Click **"View Details"**
3. Click **"X"** button on specific orders to remove
4. Orders go back to "pending dispatch" pool
5. Create another trip or assign to different trip

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd/Ctrl + F` | Browser search within page |
| `Tab` | Navigate between filters and cards |
| `Enter` | Expand/collapse trip card |

---

## Tips & Tricks

### Tip 1: Real-time Monitoring
The page doesn't auto-refresh. To see latest data:
- Press **F5** or **Cmd+R** to refresh
- Check back frequently if doing live monitoring

### Tip 2: Quick Workload Check
Look at Completed Orders stat:
```
Completed: 32 out of 48 = 67% done
```

If below 50% late in the day, you might have issues.

### Tip 3: Vehicle Utilization
Search by vehicle name to see:
- How many orders per vehicle
- Which vehicles are overloaded
- If any vehicles are sitting idle

### Tip 4: Star Performers
Look at Personnel Summary:
- Find people with highest completion rates
- Consider giving them bonus/recognition
- Ask them for tips on efficiency

### Tip 5: Identify Problem Routes
If specific delivery person has low completion:
- Check their trip card orders
- See if certain customers are problematic
- Consider changing their route

---

## Understanding the Colors

### Status Badge Colors

| Color | Status | Meaning |
|-------|--------|---------|
| 🟨 Yellow | Draft | Not yet started |
| 🔵 Blue | Out for Delivery | Currently happening |
| 🟢 Green | Completed | All orders done |

### Card Background Colors

| Background | Status | Meaning |
|-----------|--------|---------|
| Yellow tint | Draft | Ready to go, not started |
| Blue tint | Out for Delivery | Currently delivering |
| Green tint | Completed | Finished |

---

## Troubleshooting

### Problem: Page says "No Trips Found"

**Cause**: 
- No trips exist yet, OR
- Your filter is too restrictive

**Solution**:
- Click **[All]** to remove status filter
- Clear search box
- Try different status filter
- Go to Dispatch Planner to create a trip

---

### Problem: Trip shows 0% progress but orders exist

**Cause**: 
- Orders not marked as completed
- Data sync issue

**Solution**:
- Click "View Details"
- Manually mark orders as delivered
- Refresh page

---

### Problem: Delivery person count doesn't match my team

**Cause**:
- Some delivery persons have no trips assigned
- Person is deactivated in system

**Solution**:
- Check User Management page
- Verify all delivery persons are active
- Create trips to include all persons

---

## Scenario: Evening Delivery Report

**Time**: 5 PM (End of delivery day)

**Your Task**: Send report to management

**Steps**:

1. Open Trips Overview (`/admin/trips`)

2. Note the stats:
   ```
   Total Trips: 12
   Completed: 12
   Total Orders: 48
   Delivered: 45
   Pending: 3
   Success Rate: 93.75%
   ```

3. Check "Completed" filter to see finished trips

4. Identify the 3 pending orders:
   - Search or filter to find them
   - Check if delivery person completed them
   - If not, contact delivery person

5. Check Personnel Summary:
   - Anil: 8/8 (100%)
   - Rajesh: 18/20 (90%)
   - Priya: 15/16 (94%)
   - Meera: 4/4 (100%)

6. Create report:
   ```
   Daily Delivery Report - Dec 5, 2025
   - Total Orders: 48
   - Delivered: 45 (93.75%)
   - Pending: 3
   - Total Value: ₹45.2L
   - Top Performer: Anil & Meera (100%)
   ```

---

## Summary

**Trips Overview lets you:**

✓ See all active deliveries at a glance
✓ Monitor progress with visual progress bars
✓ Find specific trips by search
✓ Filter by status
✓ View order details for each trip
✓ Track delivery person performance
✓ Identify bottlenecks
✓ Navigate to full trip management
✓ Make data-driven operational decisions

**Best for:**
- Daily monitoring
- Shift handoffs
- Evening reports
- Operational oversight
- Performance tracking

---

## Next Steps

Once comfortable with Trips Overview, explore:

1. **Dispatch Planner** (`/admin/dispatch`)
   - Create and assign new trips

2. **Trip Details** (`/admin/dispatch/trips/:id`)
   - Manage individual trips in depth
   - Add/remove orders
   - Change delivery people
   - Mark orders complete

3. **Orders** (`/admin/orders`)
   - Manage all orders
   - Bulk status updates
   - Customer details

---

## Questions?

For more help:
- See `ADMIN_TRIPS_OVERVIEW_FEATURE.md` for full feature documentation
- See `DELIVERY_DASHBOARD_COMPARISON_ADMIN_VS_USER.md` for admin vs user comparison
- Check `DISPATCH_PLANNER_USER_GUIDE.md` for dispatch workflow
