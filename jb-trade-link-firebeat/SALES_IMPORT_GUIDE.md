# Sales Order Import Guide

## Overview
The existing import system is in `pages/admin/SystemHealth.tsx`. You can import sales orders from CSV/Excel files with the proper format.

## Current Implementation Location
- **File**: `pages/admin/SystemHealth.tsx`
- **Function**: `importOrders()` (lines 222-245)
- **UI**: System Health → Data Import tab

## Your New Sales Data Format

Your CSV needs these columns (in order):
```
id,customerId,customerName,salespersonId,salespersonName,date,totalItems,totalAmount,status,items,remarks,assignedTripId,discount,GPS,time,paymentMethod,vatRequired?
```

### Example Row:
```
250325-001,ad97bdd1-4ced-4d5c-b215-64aab8e8e45d,Rezi Kirana pasal,5937213a-3380-46c6-8d13-88e45039a3df,Shushant Budathoki,2025-03-25,106,2184.33,completed,"[{""qty"": 24, ""rate"": 7.422743999999999, ...}]",,,0,"27.715034, 85.324468",2025-03-25 00:00:00+00,Cash,false
```

## Database Schema
Your orders table structure:
```sql
CREATE TABLE public.orders (
  id text NOT NULL,
  customerId text,
  customerName text,
  salespersonId text,
  salespersonName text,
  date date,
  totalItems integer,
  totalAmount real,
  status text,
  items jsonb,              -- JSON array of order items
  remarks text,
  assignedTripId text,
  discount real,
  GPS text,
  time timestamp with time zone,
  paymentMethod text,
  vatRequired? boolean,
  PRIMARY KEY (id)
);
```

## How to Use the Import Feature

### Step 1: Navigate to System Health
- Go to Admin → System Health (or similar admin page)
- Click "Data Import" tab

### Step 2: Select Import Type
- Choose "Sales Orders" from the dropdown

### Step 3: Download Template (Optional)
- Click "Download Template" for reference format
- (Current template is basic; you may need to update it)

### Step 4: Upload Your CSV/Excel
- Click the upload area or drag-drop your file
- The system will parse and preview the data

### Step 5: Run Import
- Click "Run Import"
- Monitor the logs in real-time for success/errors

## Current `importOrders` Function (Simplified)

```typescript
const importOrders = async (rows: any[]) => {
  const groups: Record<string, any> = {};
  rows.forEach(row => {
    const id = cleanString(row.invoiceId) || `INV-${Date.now()}`;
    if (!groups[id]) {
      groups[id] = {
        id,
        date: cleanString(row.date) || new Date().toISOString().split('T')[0],
        customerName: cleanString(row.customerName),
        salespersonName: cleanString(row.salespersonName) || 'Office',
        items: [],
        totalAmount: 0,
        totalItems: 0,
        status: 'delivered',
        customerId: 'unknown',
        salespersonId: 'unknown'
      };
    }
    const qty = parseInt(row.qty) || 0;
    const rate = parseFloat(row.rate) || 0;
    groups[id].items.push({ 
      productName: cleanString(row.productName), 
      qty, 
      rate, 
      total: qty * rate 
    });
    groups[id].totalAmount += (qty * rate);
    groups[id].totalItems += qty;
  });
  await runBatchUpsert(COLS.ORDERS, Object.values(groups), 'orders');
};
```

## What Needs to be Updated

The current function expects a "simplified" format. For your data, you need to:

1. **Handle JSON items field**: Your CSV has items as stringified JSON
2. **Map all new columns**: GPS, time, paymentMethod, vatRequired?, discount, assignedTripId, remarks
3. **Parse dates correctly**: Handle both `date` and `time` fields properly
4. **Keep custom IDs**: Use the `id` from your data, not generate new ones

## Improved Import Function for Your Format

Here's what the updated `importOrders` should look like:

```typescript
const importOrders = async (rows: any[]) => {
  const orders = rows.map(row => {
    try {
      // Parse items JSON if it's a string
      let items = [];
      if (typeof row.items === 'string') {
        items = JSON.parse(row.items);
      } else {
        items = row.items || [];
      }

      // Parse GPS coordinates
      let gps = null;
      if (row.GPS) {
        // Format: "27.715034, 85.324468"
        const [lat, lng] = row.GPS.split(',').map(s => s.trim());
        gps = lat && lng ? `${lat}, ${lng}` : null;
      }

      // Parse timestamp
      let timestamp = null;
      if (row.time) {
        timestamp = new Date(row.time).toISOString();
      }

      return {
        id: cleanString(row.id),
        customerId: cleanString(row.customerId),
        customerName: cleanString(row.customerName),
        salespersonId: cleanString(row.salespersonId),
        salespersonName: cleanString(row.salespersonName),
        date: cleanString(row.date), // Format: YYYY-MM-DD
        totalItems: parseInt(row.totalItems) || 0,
        totalAmount: parseFloat(row.totalAmount) || 0,
        status: cleanString(row.status) || 'completed',
        items: items, // JSONB array
        remarks: cleanString(row.remarks),
        assignedTripId: cleanString(row.assignedTripId),
        discount: parseFloat(row.discount) || 0,
        GPS: gps,
        time: timestamp,
        paymentMethod: cleanString(row.paymentMethod),
        'vatRequired?': row['vatRequired?'] === 'true' || row['vatRequired?'] === true
      };
    } catch (err) {
      console.error('Error parsing row:', row, err);
      return null;
    }
  }).filter(Boolean);

  if (orders.length > 0) {
    await runBatchUpsert(COLS.ORDERS, orders, 'orders');
  }
};
```

## Template to Add to CSV_TEMPLATES

Update the `CSV_TEMPLATES` in `SystemHealth.tsx`:

```typescript
orders: `id,customerId,customerName,salespersonId,salespersonName,date,totalItems,totalAmount,status,items,remarks,assignedTripId,discount,GPS,time,paymentMethod,vatRequired?
250325-001,ad97bdd1-4ced-4d5c-b215-64aab8e8e45d,Rezi Kirana pasal,5937213a-3380-46c6-8d13-88e45039a3df,Shushant Budathoki,2025-03-25,2,672.59,completed,"[{""qty"": 24, ""rate"": 7.42, ""total"": 178.14, ""productName"": ""Butter 20-20 25+5gm"", ""companyName"": ""Parle""}]",,0,"27.715034, 85.324468",2025-03-25T00:00:00Z,Cash,false`
```

## Batch Processing

The import uses batching with `BATCH_SIZE = 400`:
- Processes records in chunks of 400
- Logs progress in real-time
- Handles failures gracefully

## Error Handling

The import logs all operations:
- ✅ Success messages
- ❌ Error messages with details
- ➜ Info/progress messages

Check the **Import Logs** panel on the right side for real-time feedback.

## Key Things to Remember

1. **ID field**: Use unique identifiers (don't leave blank)
2. **Customer & Salesperson IDs**: Must match existing records in database
3. **Items JSON**: Properly formatted JSON array with product details
4. **Date format**: YYYY-MM-DD (e.g., 2025-03-25)
5. **Time format**: ISO 8601 with timezone (e.g., 2025-03-25T00:00:00Z)
6. **GPS format**: "latitude, longitude" as string (e.g., "27.715034, 85.324468")
7. **VAT field**: true/false (note: column header has '?' which is unusual)

## Quick Start for Your CSV

Your CSV already has the right structure! Just:
1. Export your sales data from your source system
2. Upload to the import tool
3. Select "Sales Orders"
4. Click "Run Import"

The improved function will handle all the parsing automatically.
