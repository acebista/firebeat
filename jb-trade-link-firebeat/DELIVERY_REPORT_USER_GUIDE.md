# Delivery Report - User Guide

## Accessing the Delivery Report

1. Navigate to **Reports & Analytics** from the admin sidebar
2. Click on the **"Delivery Report"** tab (icon: UserCheck)
3. The report will automatically load for today's date

## Using the Filters

The Delivery Report has dedicated filters to help you analyze specific data:

### Date Range Filter
1. **Start Date**: Click the calendar icon and select your desired start date
2. **End Date**: Click the calendar icon and select your desired end date
3. The report will show all deliveries within this date range

**Examples:**
- Single day: Set both dates to the same day (e.g., 2025-12-15)
- Week view: Set start to Monday, end to Sunday
- Month view: Set start to 1st, end to last day of month

### Delivery User Filter
1. Click the **Delivery User** dropdown
2. Select a specific delivery person to see only their deliveries
3. Or select **"All Delivery Users"** to see everyone's deliveries

**Use Cases:**
- Track individual performance
- Compare delivery personnel
- Investigate specific user's issues
- Generate user-specific reports

### Generating the Report
1. After selecting your filters, click the **"Generate Report"** button
2. The report will update with filtered data
3. Loading spinner shows while data is being fetched

### Clearing Filters
- Click **"Clear Filters"** to reset to defaults (today's date, all users)
- Useful for starting a new analysis

### Active Filters Summary
At the bottom of the filter panel, you'll see badges showing:
- 📅 **Date Range**: If viewing more than one day
- 👤 **Delivery User**: If a specific user is selected

This helps you remember what filters are currently applied.

## Understanding the Dashboard

### Summary Cards (Top Row)

#### 📦 Total Invoices
- Shows the total number of invoices in the selected date range
- Includes all delivery-related statuses

#### ✅ Delivered
- Count of successfully delivered invoices
- Includes both 'delivered' and 'completed' statuses

#### ↓ Returns
- Combined count of full and partial returns
- Helps track return rate

#### 💰 Total Collected
- Sum of all payments collected
- Excludes credit (outstanding) amounts

### Payment Method Breakdown

Visual grid showing payment distribution:
- **Cash** (Green): Cash payments
- **QR** (Blue): Digital/QR code payments
- **Cheque** (Yellow): Cheque payments
- **Credit** (Red): Credit/Outstanding payments
- Each shows: Count of transactions + Total amount

## Invoice List Table

### Columns Explained

| Column | Description |
|--------|-------------|
| **S.N.** | Serial number |
| **Invoice** | Invoice number and date |
| **Customer** | Customer name |
| **Salesperson** | Sales representative |
| **Delivery User** | Person who delivered (or "Not Assigned") |
| **Status** | Current invoice status with color badge |
| **Subtotal** | Amount before discount |
| **Discount** | Discount amount (in red) |
| **Net Amount** | Final invoice amount |
| **Payment** | Payment method used |
| **Collected** | Amount actually collected |
| **Actions** | 👁️ Eye icon to view details |

### Status Badge Colors

- 🟢 **Green (Emerald)**: Delivered/Completed
- 🔵 **Blue**: Dispatched
- 🟡 **Yellow (Amber)**: Partially Returned
- 🔴 **Red**: Fully Returned
- ⚪ **Gray (Slate)**: Other statuses

## Viewing Invoice Details

### How to Open
Click the **👁️ eye icon** in the Actions column of any invoice

### What You'll See

#### 1. Header Information
- Invoice number
- Customer, Salesperson, Delivery User
- Date, Status, Payment Method

#### 2. Order Items Table
Complete list of products with:
- Product name and company
- Quantity ordered
- Rate per unit
- Line total

#### 3. Financial Summary
- **Subtotal**: Total before discount
- **Discount**: Amount discounted
- **Net Amount**: Final amount
- **Collected**: Amount received

#### 4. Sales Return Information (if applicable)
If the invoice has a return:
- Return type (Full/Partial)
- Reason for return
- Return amount
- Notes

#### 5. Remarks
Any additional notes or comments on the order

### Closing the Modal
Click the **X** button in the top-right corner

## Understanding Payment Collection

### Cash/QR/Cheque
- **Collected Amount** = Net Amount - Return Amount
- Shows actual money received

### Credit
- **Collected Amount** = ₹0
- Indicates outstanding payment
- Full amount still owed by customer

## Print Functionality

1. Click the **🖨️ Print** button in the top-right
2. A print-optimized view will open
3. Use your browser's print function (Ctrl+P / Cmd+P)
4. Select printer or save as PDF

### Print View Includes
- All invoices in the current view
- Essential columns (simplified for printing)
- Total row at the bottom
- Clean, professional formatting

## Export to Excel (Coming Soon)

Click the **📥 Export Excel** button to download the report as a spreadsheet.

## Interpreting the Data

### High Return Rate?
If you see many red "Returned" badges:
- Check the return reasons in drill-down
- Identify patterns (specific products, customers, delivery users)
- Take corrective action

### Credit Payments
Red payment badges with ₹0 collected:
- These are outstanding amounts
- Follow up for payment collection
- Monitor credit limits

### Delivery User Performance
Compare invoices by delivery user:
- Check delivery success rate
- Identify top performers
- Spot training opportunities

### Payment Method Trends
Use the breakdown to:
- Understand customer payment preferences
- Plan cash handling requirements
- Promote digital payments if desired

## Tips for Best Results

1. **Select Specific Dates**: Use the date filter to focus on specific periods
2. **Check Returns**: Always drill down on returned invoices to understand why
3. **Monitor Credit**: Keep an eye on credit payments for cash flow management
4. **Compare Delivery Users**: Look for patterns in delivery success
5. **Print for Records**: Print end-of-day reports for physical records

## Troubleshooting

### "Not Assigned" Delivery User
- The invoice hasn't been assigned to a delivery person yet
- Or delivery user data is missing from the order
- Check dispatch/trip assignments

### Missing Data
- Ensure orders have proper status (delivered/completed/etc.)
- Verify payment method is recorded
- Check that returns are properly linked to invoices

### Totals Don't Match
- Returns reduce the collected amount
- Credit payments show ₹0 collected
- Discounts are already applied in net amount

## Best Practices

1. **Daily Review**: Check the report at end of each day
2. **Weekly Analysis**: Compare week-over-week trends
3. **Monthly Reconciliation**: Match with accounting records
4. **Return Analysis**: Investigate high return rates immediately
5. **Credit Monitoring**: Follow up on outstanding credits weekly

## Quick Reference

| Action | How To |
|--------|--------|
| View report | Click "Delivery Report" tab |
| See invoice details | Click 👁️ eye icon |
| Print report | Click 🖨️ Print button |
| Close detail view | Click X in modal |
| Check payment method | Look at Payment column badge |
| Identify returns | Look for red Status badges |
| Find outstanding | Look for red Payment badges with ₹0 |

## Need Help?

If you encounter issues:
1. Check that orders have proper delivery status
2. Verify payment methods are recorded
3. Ensure returns are properly created and linked
4. Contact system administrator if data appears incorrect
