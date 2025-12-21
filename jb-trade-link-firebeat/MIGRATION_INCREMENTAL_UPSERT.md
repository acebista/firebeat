# Migration Page Enhancement - Incremental Upsert Support

## Overview
Modified the migration page at `https://firebeat.vercel.app/#/admin/migration` to support **partial/incremental upserts** instead of only allowing full database deletion and rebuild.

## Key Changes

### 1. Default Migration Mode Changed
- **Previous Default**: `'clean-slate'` - Always deleted all orders before importing
- **New Default**: `'upsert'` - Safely adds/updates only the data from CSV
- This makes the migration process **safer by default**

### 2. New Migration Mode Selector UI
Added a prominent UI card that allows users to choose between two migration modes:

#### 📥 **Incremental Upsert Mode** (Recommended - Default)
- **What it does**:
  - Updates existing orders if they match (by Invoice ID)
  - Adds new orders that don't exist in the database
  - Preserves all other existing data untouched
  - Safe for partial data updates

- **Use Cases**:
  - Adding missing orders from a specific date range
  - Updating specific order records
  - Syncing new data without affecting existing records
  - Daily/weekly incremental imports

#### 🗑️ **Clean Slate Mode** (Caution)
- **What it does**:
  - Deletes **ALL** existing orders first
  - Rebuilds the entire database from CSV
  - CSV becomes the single source of truth

- **Use Cases**:
  - Complete data refresh
  - Initial migration
  - When you want to replace everything

### 3. Visual Design
- **Green-themed card** for Incremental Upsert (safe mode)
- **Red-themed card** for Clean Slate (caution mode)
- Clear checkmark (✓) indicator for selected mode
- Context-specific warning messages:
  - Green alert for Upsert: "Your existing data will be preserved"
  - Red alert for Clean Slate: "This will permanently delete all existing orders"

### 4. User Experience Improvements
- Mode selection available immediately after CSV parsing (Step 1)
- Cannot change mode once migration starts (prevents accidents)
- Clear visual feedback on which mode is active
- Detailed explanations of what each mode does
- Positioned prominently between data summary and migration steps

## Technical Implementation

### Backend (Already Implemented)
The `OrderService.batchUpsert()` function was already implemented in the codebase:
- Uses Supabase's `upsert()` with `onConflict: 'id'`
- Handles conflicts by updating existing records
- Falls back to individual upserts with retry logic
- Returns success/failure counts

### Frontend Changes
1. **State Management**:
   ```tsx
   const [migrationMode, setMigrationMode] = useState<'clean-slate' | 'upsert'>('upsert');
   ```

2. **Step 4 Logic** (already existed):
   - Checks `migrationMode` state
   - If `'upsert'`: Calls `OrderService.batchUpsert()`
   - If `'clean-slate'`: Deletes all, then calls `OrderService.batchInsert()`

3. **New UI Card**: 
   - Located between stats display and migration progress
   - Interactive buttons to toggle between modes
   - Conditional styling based on selection

## Files Modified
- `/Users/babi/Downloads/firebeat-main/jb-trade-link-firebeat/pages/admin/Migration.tsx`
  - Changed default `migrationMode` from `'clean-slate'` to `'upsert'`
  - Added migration mode selector UI card (~100 lines)

## Benefits
1. ✅ **Safety First**: Default mode now preserves existing data
2. ✅ **Flexibility**: Users can still choose full rebuild when needed
3. ✅ **Clarity**: Clear visual indicators and warnings
4. ✅ **Efficiency**: No need to re-upload entire database for partial updates
5. ✅ **User Control**: Explicit choice between modes prevents accidents

## Usage Instructions

### For Incremental Updates (Recommended):
1. Upload CSV file with only the new/updated data
2. Ensure **Incremental Upsert** mode is selected (green card)
3. Proceed through migration steps
4. Only orders from CSV will be added/updated
5. All other existing data remains unchanged

### For Complete Refresh:
1. Upload CSV file with complete dataset
2. Select **Clean Slate** mode (red card)
3. Read the warning carefully
4. Proceed through migration steps
5. All old orders will be deleted and replaced

## Migration Workflow
1. **Step 0**: Upload CSV or paste CSV data
2. **Step 1**: Select migration mode (new UI)
3. **Step 2**: Migrate Users & Companies
4. **Step 3**: Migrate Products
5. **Step 4**: Migrate Customers (with smart deduplication)
6. **Step 5**: Migrate Orders (using selected mode)

## Testing Recommendations
1. Test with a small CSV (5-10 orders) in Upsert mode
2. Verify existing orders are preserved
3. Verify new orders are added
4. Verify updated orders reflect changes
5. Test Clean Slate mode with backup data
6. Verify all old orders are deleted before new import
