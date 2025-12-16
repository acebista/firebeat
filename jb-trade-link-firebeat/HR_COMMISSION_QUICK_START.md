# HR & Commission System - Quick Start Guide

## Access the HR Panel

1. **Login** as an admin user
2. **Navigate** to the left sidebar
3. **Click** "HR & Commissions" (📊 icon)
4. **URL**: `http://localhost:5173/#/admin/hr`

## Tab 1: Compensation Settings

### Purpose
Configure commission rate slabs for compensation calculations.

### How to Add a Commission Rate

1. Click **"Add Rate Slab"** button
2. Enter the following:
   - **Slab Name**: e.g., "Tier 1", "Silver", "Gold"
   - **Min Amount**: Minimum sales amount for this slab (e.g., 0)
   - **Max Amount**: Maximum sales amount (leave blank for unlimited)
   - **Rate (%)**: Commission percentage (e.g., 5.5)
3. Click **"Save"**

### Example Tiered Structure
```
Tier 1: ₹0 - ₹50,000 = 3% commission
Tier 2: ₹50,000 - ₹100,000 = 5% commission  
Tier 3: ₹100,000+ = 7% commission
```

### How to Edit a Commission Rate
1. Find the rate in the table
2. Click **"Edit"** button
3. Modify fields as needed
4. Click **"Save"**

### How to Delete a Commission Rate
1. Find the rate in the table
2. Click **"Delete"** button
3. Confirm deletion in the dialog
4. Rate is soft-deleted (can be restored if needed)

### Filter by Company
- Use **"Company Filter"** dropdown to view:
  - **All / Default**: Global rates applied to all companies
  - **Company 1, 2, etc.**: Company-specific rates

## Tab 2: User Compensation

### Purpose
View and manage salesperson compensation including base salary and commission calculations.

### Key Columns

| Column | Description |
|--------|-------------|
| **Name** | Salesperson name |
| **Plan Type** | "Fixed" or "Commission" |
| **Base Salary** | Monthly base salary (₹) |
| **Monthly Sales** | Total sales this month (₹) |
| **Commission** | Calculated commission (₹) |
| **Total Payout** | Base Salary + Commission (₹) |
| **Actions** | Edit button |

### How to Edit User Compensation

1. Find the salesperson in the table
2. Click **"Edit"** button
3. Update:
   - **Base Salary**: Monthly fixed salary
   - **Plan Type**: 
     - "Fixed Salary" = No commission
     - "Commission-Based" = Earns commission on sales
   - **Commission Rate Set**: 
     - "Default" = Uses company rates
     - "Standard Rate" = Standard tier
     - "Premium Rate" = Premium tier
4. Click **"Save"**

### Filters

**Month Filter**: 
- Use date picker to select any month
- Shows sales and commissions for that month

**Company Filter**:
- View salespeople by company
- "All" shows all salespeople

### Summary Row

At the bottom of the table, see totals:
- **Total Sales**: Sum of all salespeople's sales
- **Total Commission**: Sum of all commissions
- **Total Base Salary**: Sum of all base salaries
- **Total Payout**: Total salary + total commission
- **Employees**: Number of active salespeople

## Commission Calculation Example

**Scenario**: Salesperson with tiered rates
```
Rates:
- Tier 1: ₹0 - ₹50,000 @ 3%
- Tier 2: ₹50,000 - ₹100,000 @ 5%
- Tier 3: ₹100,000+ @ 7%

Monthly Sales: ₹120,000

Calculation:
- ₹50,000 × 3% = ₹1,500
- ₹50,000 × 5% = ₹2,500
- ₹20,000 × 7% = ₹1,400
- Total Commission = ₹5,400

Total Payout (if base salary = ₹20,000):
- ₹20,000 (base) + ₹5,400 (commission) = ₹25,400
```

## Validation Rules

### Commission Rates
- ✅ Min Amount must be less than Max Amount
- ✅ Rate must be between 0-100%
- ✅ No overlapping rate ranges
- ❌ Overlap detected = Error toast message

### User Compensation
- ✅ All fields are optional
- ✅ Non-negative values only
- ✅ Plan type must be "fixed" or "commission"

## Tips & Tricks

1. **Test Data**: Use the Company Filter to see different company rates
2. **Calculations**: All commission calculations are automatic, you don't need to enter them manually
3. **Soft Delete**: Deleting a rate won't affect historical data
4. **Export**: You can copy the table data for external reports (future feature)
5. **Validation**: If you see an error, check that rate slabs don't overlap

## Common Tasks

### Add a New Salesperson with Commission
1. Create user in Users management (must have role = 'sales')
2. Go to User Compensation tab
3. Edit the new user:
   - Set Base Salary (e.g., ₹20,000)
   - Set Plan Type = "Commission-Based"
   - Set Commission Rate Set = "Default"
4. Save

### Change a Salesperson to Fixed Salary
1. Go to User Compensation tab
2. Edit the salesperson
3. Change Plan Type = "Fixed Salary"
4. Commission field will show ₹0.00
5. Save

### View All Salespeople Earnings for a Month
1. Go to User Compensation tab
2. Select desired month in "Month" filter
3. See all sales, commissions, and payouts
4. Check Summary row for totals

### Adjust Commission Rates Mid-Month
1. Go to Compensation Settings tab
2. Edit or add new rate slabs
3. Changes apply to calculations immediately
4. Historical data isn't affected (uses rates in effect at time of data entry)

## Troubleshooting

**Problem**: Can't see HR Panel in sidebar
- **Solution**: Make sure you're logged in as admin
- **Check**: URL should be `/admin/hr`

**Problem**: Overlap validation error when adding rates
- **Solution**: Check existing rates for gaps
- **Example**: If you have 0-50k and 75k-100k, add 50k-75k

**Problem**: Commission shows ₹0.00 for sales
- **Solution**: Check if Plan Type = "Commission-Based"
- **Check**: Rates are configured correctly in Compensation Settings

**Problem**: Can't edit a user
- **Solution**: User must exist in Users management first
- **Check**: User has role = 'sales'

## Data Accuracy

- ✅ All calculations are automatic and real-time
- ✅ Monthly sales aggregated from APPROVED, DISPATCHED, DELIVERED orders
- ✅ Commission calculated at transaction time
- ✅ Summary totals calculated on-demand
- ✅ No manual entry needed for commission calculations

## Performance Notes

- Reports load instantly for single month
- Large datasets may take a moment to filter
- Use Company filter to narrow down data
- Month filter helps focus on specific periods

---

**Need Help?** Contact your system administrator or refer to the main documentation.
