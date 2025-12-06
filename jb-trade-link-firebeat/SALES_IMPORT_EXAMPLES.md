# Sales Import - Practical Examples

## Your CSV Data Format

Your CSV file from the attachment has these columns in this exact order:
```
id,customerId,customerName,salespersonId,salespersonName,date,totalItems,totalAmount,status,items,remarks,assignedTripId,discount,GPS,time,paymentMethod,vatRequired?
```

## Example Record from Your Data

```
250325-001,ad97bdd1-4ced-4d5c-b215-64aab8e8e45d,Rezi Kirana pasal,5937213a-3380-46c6-8d13-88e45039a3df,Shushant Budathoki,2025-03-25,106,2184.33,completed,"[{""qty"": 24, ""rate"": 7.422743999999999, ""total"": 178.14585599999998, ""baseRate"": 7.422743999999999, ""companyId"": ""c2"", ""productId"": ""c7391527-e80d-438c-9c09-5b968be50cf2"", ""companyName"": ""Parle"", ""discountPct"": 0, ""productName"": ""Butter 20-20 25+5gm (1*144) Mrp 9"", ""schemeAppliedText"": """"}, {""qty"": 2, ""rate"": 224.2146, ""total"": 448.4292, ""baseRate"": 224.2146, ""companyId"": ""c2"", ""productId"": ""d84f001f-d5f2-4f28-bbc7-ae8cbfb4ca9d"", ""companyName"": ""Parle"", ""discountPct"": 0, ""productName"": ""H&s Choco 412.5gm (1*12) Mrp250"", ""schemeAppliedText"": """"}]",,,0,"27.715034, 85.324468",2025-03-25 00:00:00+00,Cash,false
```

## Step-by-Step Import Process

### 1. Prepare Your CSV File
   - Ensure it has exactly these columns (order matters)
   - Save as `.csv` or `.xlsx` format
   - The `items` column must have escaped JSON: `"{[...]}"`

### 2. Navigate to the Import Tool
   - Go to Admin Dashboard
   - Click "System Health" 
   - Go to "Data Import" tab
   - Select "Sales Orders" from dropdown

### 3. Download Template (Optional)
   - For reference of exact format expected
   - Current template structure

### 4. Upload Your CSV
   - Click the upload area or drag-drop
   - File gets parsed automatically
   - You'll see "Loaded X rows" in the logs

### 5. Review Parsed Data
   - Check the preview (if shown)
   - Verify all fields are correct
   - Look for any parsing errors in logs

### 6. Click "Run Import"
   - Records will upload in batches of 400
   - Progress shown in logs: `Progress: 400/2000 records...`
   - Each batch takes 1-5 seconds depending on size

### 7. Monitor Logs
   - ✅ Success messages for completed batches
   - ❌ Error messages if anything fails
   - ➜ Info messages for progress

## Field Descriptions

| Column | Type | Required | Notes |
|--------|------|----------|-------|
| id | text | YES | Unique identifier (e.g., "250325-001") |
| customerId | text | YES | Must exist in customers table |
| customerName | text | YES | Display name of customer |
| salespersonId | text | YES | Must exist in users table |
| salespersonName | text | YES | Display name of salesperson |
| date | date | YES | Format: YYYY-MM-DD (e.g., "2025-03-25") |
| totalItems | integer | YES | Total quantity ordered |
| totalAmount | real | YES | Total order value in rupees |
| status | text | YES | e.g., "completed", "pending", "delivered" |
| items | jsonb | YES | JSON array of order line items |
| remarks | text | NO | Additional notes |
| assignedTripId | text | NO | Delivery trip reference |
| discount | real | NO | Discount amount (default: 0) |
| GPS | text | NO | Format: "latitude, longitude" |
| time | timestamp | NO | ISO format: "2025-03-25 00:00:00+00" |
| paymentMethod | text | NO | e.g., "Cash", "Cheque", "Online" |
| vatRequired? | boolean | NO | true/false for VAT applicability |

## Items JSON Structure

Each item in the `items` array should have:

```json
{
  "qty": 24,
  "rate": 7.422743999999999,
  "total": 178.14585599999998,
  "baseRate": 7.422743999999999,
  "productId": "c7391527-e80d-438c-9c09-5b968be50cf2",
  "companyId": "c2",
  "companyName": "Parle",
  "productName": "Butter 20-20 25+5gm (1*144) Mrp 9",
  "discountPct": 0,
  "schemeAppliedText": ""
}
```

**Important**: When writing in CSV, escape quotes with double quotes:
- `"[{""qty"": 24, ""rate"": 7.42}]"`

## Troubleshooting Common Issues

### Issue: "Invalid JSON in items field"
**Solution**: 
- Ensure JSON is properly escaped with double quotes
- Use: `"{[...]}"` not `'[...]'`
- Valid JSON: `"[{""key"": ""value""}]"`

### Issue: "customerId/salespersonId not found"
**Solution**:
- Verify IDs exist in customers/users table first
- Import Customers and Users before Orders
- Use exact IDs from your database

### Issue: "Date parsing error"
**Solution**:
- Use format: YYYY-MM-DD (e.g., 2025-03-25)
- Time format: YYYY-MM-DD HH:MM:SS+00 or ISO 8601

### Issue: "GPS parsing failed"
**Solution**:
- Format: "latitude, longitude" with space after comma
- Example: "27.715034, 85.324468"
- Leave empty if not available

### Issue: "Row X skipped - error parsing"
**Solution**:
- Check console logs for specific error
- Validate all required fields present
- Look for special characters needing escaping

## Batch Processing Details

- **Batch Size**: 400 records per batch
- **Processing Time**: ~1-5 seconds per batch
- **Retry**: Current version attempts once; failed records are logged
- **Partial Success**: If batch 1 succeeds and batch 2 fails, batch 1 stays in DB

## Performance Tips

1. **Keep batches under 5000 records** for optimal performance
2. **Pre-validate data** before upload to save time
3. **Split large imports** into multiple files if >10,000 records
4. **Check system logs** after import completes

## Validating After Import

Run Health Checks to verify:
1. Admin Dashboard → System Health
2. Click "Health Checks" tab
3. Click "Run Checks"
4. Verify "orders" table shows "Accessible"

Query to verify import:
```sql
SELECT COUNT(*) FROM public.orders WHERE date >= '2025-03-25';
SELECT * FROM public.orders LIMIT 5;
```

## Next Steps After Import

1. **Verify data**: Check a few records in the database
2. **Test features**: View orders in the sales module
3. **Run reports**: Generate sales reports to validate
4. **Validate totals**: Ensure amounts match your source data

---

For questions or issues, check the import logs panel for detailed error messages.
