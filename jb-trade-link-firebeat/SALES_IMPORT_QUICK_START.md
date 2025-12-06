# Quick Start: Import Your Sales Data

## TL;DR - Just the Steps

1. **Go to**: Admin → System Health → Data Import tab
2. **Select**: "Sales Orders" dropdown
3. **Upload**: Your CSV file with these columns:
   ```
   id,customerId,customerName,salespersonId,salespersonName,date,totalItems,totalAmount,status,items,remarks,assignedTripId,discount,GPS,time,paymentMethod,vatRequired?
   ```
4. **Click**: "Run Import"
5. **Wait**: See progress in the logs
6. **Done**: Your orders are now in the database

## Your CSV Format (What You Have)

Your attachment shows sales data like this:
```
250325-001,ad97bdd1-4ced-4d5c-b215-64aab8e8e45d,Rezi Kirana pasal,5937213a-3380-46c6-8d13-88e45039a3df,Shushant Budathoki,2025-03-25,106,2184.33,completed,"[{""qty"": 24, ""rate"": 7.42, ...}]",,,0,"27.715034, 85.324468",2025-03-25 00:00:00+00,Cash,false
```

✅ **This format is already compatible!**

## What You Need

- ✅ CSV/Excel file with the correct columns
- ✅ IDs for customers and salespersons already in the system
- ✅ JSON items array (properly formatted)
- ✅ That's it!

## The Code You Had

The system already had an import function in:
- **File**: `pages/admin/SystemHealth.tsx`
- **Function**: `importOrders()` 

We just updated it to handle your exact CSV format perfectly.

## What Was Changed

### Before (Old Format)
```
invoiceId,date,customerName,salespersonName,productName,qty,rate
INV-1001,2025-02-20,Gupta General Store,Rahul Sharma,Parle-G 100g,50,10
```

### After (Your Format)
```
id,customerId,customerName,salespersonId,salespersonName,date,totalItems,totalAmount,status,items,remarks,assignedTripId,discount,GPS,time,paymentMethod,vatRequired?
250325-001,ad97bdd1-4ced-4d5c-b215-64aab8e8e45d,Rezi Kirana pasal,5937213a-3380-46c6-8d13-88e45039a3df,Shushant Budathoki,2025-03-25,106,2184.33,completed,"[...]",,,...
```

## Key Improvements Made

1. ✅ Parses complex JSON items field
2. ✅ Handles GPS coordinates properly  
3. ✅ Converts ISO 8601 timestamps
4. ✅ Maps all your new fields (discount, GPS, time, paymentMethod, vatRequired)
5. ✅ Better error handling with detailed logs
6. ✅ Validates each row before inserting

## Files Updated

- `pages/admin/SystemHealth.tsx` - Updated importOrders() function and template
- Created `SALES_IMPORT_GUIDE.md` - Comprehensive guide
- Created `SALES_IMPORT_EXAMPLES.md` - Practical examples

## Next Action

You're ready to import! Just:

1. Export your sales data as CSV
2. Go to Admin → System Health → Data Import
3. Select "Sales Orders" 
4. Upload your file
5. Click "Run Import"

That's it! 🚀
