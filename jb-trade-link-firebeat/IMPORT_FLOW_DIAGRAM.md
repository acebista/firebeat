# Sales Import Flow Diagram

## Complete Import Process

```
┌─────────────────────────────────────────────────────────────────┐
│                     YOUR SALES CSV FILE                         │
│  (17 columns: id, customerId, customerName, salespersonId, ...) │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│           ADMIN DASHBOARD → SYSTEM HEALTH                       │
│           Data Import Tab → Select "Sales Orders"               │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│    FILE UPLOAD & PARSING (XLSX.utils.sheet_to_json)            │
│  - Reads Excel/CSV                                              │
│  - Converts to JSON array                                       │
│  - Validates row count                                          │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│           IMPORT PROCESSING (importOrders)                      │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ For each row:                                              │ │
│  │  1. Parse items JSON string → array                        │ │
│  │  2. Parse GPS coordinates (\"lat, lng\")                     │ │
│  │  3. Parse ISO timestamp                                    │ │
│  │  4. Map all 17 fields with type conversion                │ │
│  │  5. Validate each field                                    │ │
│  │  6. Catch errors per row (skip bad, keep good)            │ │
│  │  7. Return clean order object or null                      │ │
│  └────────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Filter out null/invalid rows                               │ │
│  └────────────────────────────────────────────────────────────┘ │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│       BATCH UPSERT TO SUPABASE (BATCH_SIZE = 400)              │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ For batches of 400 records:                                │ │
│  │  1. Send to supabase.from('orders').upsert()              │ │
│  │  2. Log progress: \"Progress: 400/2000 records...\"         │ │
│  │  3. Handle errors (continue with next batch)              │ │
│  │  4. Update processed count                                 │ │
│  └────────────────────────────────────────────────────────────┘ │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│              SUPABASE ORDERS TABLE                              │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ id            │ 250325-001                                  │ │
│  │ customerId    │ ad97bdd1-4ced-4d5c-b215-64aab8e8e45d       │ │
│  │ customerName  │ Rezi Kirana pasal                           │ │
│  │ totalAmount   │ 2184.33                                     │ │
│  │ items         │ [{qty: 24, rate: 7.42, ...}, ...]          │ │
│  │ GPS           │ 27.715034, 85.324468                        │ │
│  │ time          │ 2025-03-25T00:00:00Z                        │ │
│  │ paymentMethod │ Cash                                        │ │
│  │ vatRequired   │ false                                       │ │
│  │ ...           │ (12 more fields)                            │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│              IMPORT COMPLETE                                    │
│         ✅ \"Successfully processed 2000 orders.\"               │
│                                                                 │
│  Real-time Logs:                                                │
│  ✅ [14:32:05] Loaded 2000 rows from sales_data.csv            │
│  ➜  [14:32:06] Analyzing 2000 rows for orders...               │
│  ➜  [14:32:07] Progress: 400/2000 records...                   │
│  ➜  [14:32:08] Progress: 800/2000 records...                   │
│  ➜  [14:32:09] Progress: 1200/2000 records...                  │
│  ➜  [14:32:10] Progress: 1600/2000 records...                  │
│  ➜  [14:32:11] Progress: 2000/2000 records...                  │
│  ✅ [14:32:12] Successfully processed 2000 orders.             │
└─────────────────────────────────────────────────────────────────┘
```

## Data Transformation Detail

```
YOUR CSV ROW
├─ id: \"250325-001\"
├─ customerId: \"ad97bdd1-4ced-4d5c-b215-64aab8e8e45d\"
├─ customerName: \"Rezi Kirana pasal\"
├─ salespersonId: \"5937213a-3380-46c6-8d13-88e45039a3df\"
├─ salespersonName: \"Shushant Budathoki\"
├─ date: \"2025-03-25\"
├─ totalItems: \"106\"
├─ totalAmount: \"2184.33\"
├─ status: \"completed\"
├─ items: \"[{\"qty\": 24, \"rate\": 7.42, ...}]\"  ← JSON STRING
├─ remarks: \"\"
├─ assignedTripId: \"\"
├─ discount: \"0\"
├─ GPS: \"27.715034, 85.324468\"  ← COORDINATE STRING
├─ time: \"2025-03-25 00:00:00+00\"  ← TIMESTAMP STRING
├─ paymentMethod: \"Cash\"
└─ vatRequired?: \"false\"  ← STRING BOOLEAN
             │
             │ importOrders() PARSING
             ▼
PROCESSED ORDER OBJECT
├─ id: \"250325-001\" (string)
├─ customerId: \"ad97bdd1-4ced-4d5c-b215-64aab8e8e45d\" (string)
├─ customerName: \"Rezi Kirana pasal\" (string)
├─ salespersonId: \"5937213a-3380-46c6-8d13-88e45039a3df\" (string)
├─ salespersonName: \"Shushant Budathoki\" (string)
├─ date: \"2025-03-25\" (date string)
├─ totalItems: 106 (integer)
├─ totalAmount: 2184.33 (float)
├─ status: \"completed\" (string)
├─ items: [{qty: 24, rate: 7.42, ...}] (JSON array) ← PARSED
├─ remarks: \"\" (string)
├─ assignedTripId: \"\" (string)
├─ discount: 0 (float)
├─ GPS: \"27.715034, 85.324468\" (string) ← VALIDATED FORMAT
├─ time: \"2025-03-25T00:00:00.000Z\" (ISO timestamp) ← CONVERTED
├─ paymentMethod: \"Cash\" (string)
└─ vatRequired?: false (boolean) ← CONVERTED
             │
             │ DATABASE UPSERT
             ▼
DATABASE STORAGE (Supabase)
└─ All data stored with correct types
```

## Error Handling Flow

```
IMPORT ROW
    │
    ├─→ Parse JSON items
    │       ├─→ Success? ✅ Continue
    │       └─→ Error? ⚠️  Log error, skip items
    │
    ├─→ Parse GPS
    │       ├─→ Valid format? ✅ Keep
    │       └─→ Invalid? ⚠️  Set to null, continue
    │
    ├─→ Parse timestamp
    │       ├─→ Valid? ✅ Convert to ISO
    │       └─→ Invalid? ⚠️  Set to null, continue
    │
    ├─→ Convert types (int, float, bool)
    │       ├─→ Success? ✅ Use value
    │       └─→ Error? ⚠️  Use default (0 or empty)
    │
    └─→ Validate all fields present
            ├─→ All good? ✅ Add to batch
            └─→ Critical missing? ❌ Skip row, log error
```

## Column Mapping

```
CSV COLUMN                FIELD TYPE      PROCESSING
───────────────────────────────────────────────────────────
id                    →   text            cleanString()
customerId            →   text            cleanString()
customerName          →   text            cleanString()
salespersonId         →   text            cleanString()
salespersonName       →   text            cleanString()
date                  →   date string     cleanString() + validate YYYY-MM-DD
totalItems            →   integer         parseInt()
totalAmount           →   real            parseFloat()
status                →   text            cleanString() (default: \"completed\")
items                 →   jsonb           JSON.parse(string) or use array as-is
remarks               →   text            cleanString()
assignedTripId        →   text            cleanString()
discount              →   real            parseFloat() (default: 0)
GPS                   →   text            cleanString() format check \"lat, lng\"
time                  →   timestamp       new Date().toISOString()
paymentMethod         →   text            cleanString()
vatRequired?          →   boolean         === 'true' || === true
```

## Processing Timeline

```
User Uploads File
      │
      ├─ 0.5s: XLSX parse & validation
      │
      ├─ 2s: Row iteration & JSON parsing
      │
      ├─ 3s: Batch 1 (400 records) upload
      │       ├─ Network request
      │       └─ Supabase upsert
      │
      ├─ 4s: Batch 2 (400 records) upload
      │
      ├─ 5s: Batch 3 (400 records) upload
      │
      ├─ 6s: Batch 4 (400 records) upload
      │
      ├─ 7s: Batch 5 (400 records) upload
      │
      └─ 8-10s: COMPLETE ✅
         \"Successfully processed 2000 orders.\"
```

## File Structure

```
Your Workspace
├── pages/admin/
│   └── SystemHealth.tsx ← MODIFIED (importOrders function)
│
├── SALES_IMPORT_README.md ← NEW (Overview & summary)
├── SALES_IMPORT_QUICK_START.md ← NEW (30-second guide)
├── SALES_IMPORT_GUIDE.md ← NEW (Technical details)
├── SALES_IMPORT_EXAMPLES.md ← NEW (Examples & troubleshooting)
└── CHANGES_SUMMARY.md ← NEW (What changed)
```

---

That's it! Your import system is ready to handle your sales data format. 🚀
