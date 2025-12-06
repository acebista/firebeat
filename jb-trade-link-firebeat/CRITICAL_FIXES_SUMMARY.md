# Critical Fixes Summary - December 5, 2025

## Overview
Three critical issues fixed preventing product creation, validation, and session persistence on hard refresh.

---

## Issue 1: Missing Product ID on Insert ✅

### Problem
- `ProductService.add()` was sending products without `id` to Supabase
- Supabase `products` table has `id TEXT PRIMARY KEY` with no default
- Upsert failed silently, "Save Product" button appeared broken
- Users couldn't create new products

### Root Cause
```typescript
// BEFORE: Used upsert without providing ID
const { data, error } = await supabase
  .from(COLS.PRODUCTS)
  .upsert(product)  // ❌ No ID = upsert tries to update nothing
  .select()
  .single();
```

### Solution
Generate short UUID prefix for new products:

```typescript
// AFTER: Generate ID for new products
export const ProductService = {
  add: async (product: Omit<Product, 'id'>) => {
    // Generate unique ID with short prefix (e.g., "prod_a1b2c3d4")
    const id = (product as any).id || `prod_${crypto.randomUUID().split('-')[0]}`;
    
    // Use INSERT instead of UPSERT for new products
    const { data, error } = await supabase
      .from(COLS.PRODUCTS)
      .insert({ ...product, id })  // ✅ Always has ID
      .select()
      .single();
    if (error) throw error;
    return data as Product;
  },
  // ...
};
```

### Testing
- Create new product in admin/Products
- Verify product appears in table immediately
- Verify data persisted in Supabase

---

## Issue 2: Validation Schema Mismatches ✅

### Problem
- `productSchema` in utils/validation/schemas.ts omitted required fields
- Fields missing from schema:
  - `discountedRate` (required, used in pricing)
  - `currentStock` (required, used in inventory)
  - `secondaryAvailable` (required, checkbox in form)
  - Multiple numeric fields defaulted to `undefined`
- Zod passed validation without catching NaN/undefined values
- Supabase received incomplete/invalid data

### Root Cause
```typescript
// BEFORE: Schema incomplete, omits required fields
export const productSchema = z.object({
    name: z.string().min(2),
    companyId: z.string().min(1),
    baseRate: z.number().min(0),
    // ❌ Missing: discountedRate, currentStock, secondaryAvailable
    productDiscountPct: z.number().min(0).max(100).optional(),
    // ❌ Numeric fields not normalized
    orderMultiple: z.number().int().min(1).optional(),
    // ...
});
```

### Solution
Align schema with Product type and add all required fields with defaults:

```typescript
// AFTER: Complete schema with all fields
export const productSchema = z.object({
    name: z.string().min(2, 'Product name must be at least 2 characters'),
    companyId: z.string().min(1, 'Company is required'),
    baseRate: z.number().min(0, 'Base rate must be non-negative'),
    discountedRate: z.number().min(0, 'Discounted rate must be non-negative'), // ✅ Added
    orderMultiple: z.number().int().min(1, 'Order multiple must be at least 1'),
    isActive: z.boolean(),
    stockOut: z.boolean(),
    currentStock: z.number().int().min(0, 'Stock must be non-negative').default(0), // ✅ Added
    secondaryAvailable: z.boolean().default(false), // ✅ Added
    discountEditable: z.boolean().default(false),
    productDiscountPct: z.number().min(0).max(100).default(0),
    packetsPerCarton: z.number().int().min(1).default(1),
    piecesPerPacket: z.number().int().min(1).default(1),
    marginPct: z.number().min(0).default(0),
    secondaryDiscountPct: z.number().min(0).max(100).default(0),
    secondaryQualifyingQty: z.number().int().min(0).default(0),
    additionalSecondaryDiscountPct: z.number().min(0).max(100).default(0),
    additionalQualifyingQty: z.number().int().min(0).default(0),
});
```

### Benefits
- All form fields validated
- NaN/undefined values caught before Supabase
- Better error messages for users
- Type-safe defaults

### Testing
- Try submitting empty/partial product form
- Verify validation errors appear
- Try invalid numeric values
- Verify toasts show correct errors

---

## Issue 3: Hard Refresh Logs Out Users ✅

### Problem
- On hard refresh (F5/Cmd+R), user was logged out even with valid session
- AuthProvider started in `IDLE` state
- ProtectedRoute redirected to `/login` before boot process could restore session
- Valid Supabase sessions were destroyed

### Root Cause
```typescript
// BEFORE: Starts in IDLE, redirects before boot completes
const initialState: AuthState = {
    status: AuthStatus.IDLE,  // ❌ Treated as unauthenticated
};

// In ProtectedRoute:
if (!user) {  // ❌ True during boot, redirects before session restored
    return <Navigate to="/login" replace />;
}
```

### Solution
Three-part fix:

#### 1. Start with LOADING state
```typescript
// AFTER: Starts in LOADING to prevent early redirect
const initialState: AuthState = {
    status: AuthStatus.LOADING,
    message: 'Checking session...',  // ✅ Clear what's happening
};
```

#### 2. Add `isInitialized` flag to track boot completion
```typescript
// In AuthProvider:
const [isInitialized, setIsInitialized] = React.useState(false);

// In boot effect - set to true AFTER validating session
const boot = async () => {
    const { data, error } = await supabase.auth.getSession();
    
    if (!session?.user) {
        setIsInitialized(true);  // ✅ Mark as done
        dispatch({ type: 'SET_UNAUTHENTICATED' });
        return;
    }
    
    // Valid session found
    const user = await loadUserProfile(session.user.id);
    setIsInitialized(true);  // ✅ Mark as done
    dispatch({ type: 'SET_AUTHENTICATED', user, session });
};
```

#### 3. Update ProtectedRoute to gate on `isInitialized`
```typescript
// BEFORE:
if (isLoading) {
    return <LoadingOverlay />;
}
if (!user) {  // ❌ Redirects during boot
    return <Navigate to="/login" />;
}

// AFTER:
if (!isInitialized || isLoading) {  // ✅ Wait for boot to complete
    return <LoadingOverlay />;
}
if (!user) {  // ✅ Only redirect after boot confirms no session
    return <Navigate to="/login" />;
}
```

#### 4. Update AuthContextValue type
```typescript
export interface AuthContextValue {
    state: AuthState;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    refreshSession: () => Promise<void>;
    isAuthenticated: boolean;
    isLoading: boolean;
    isInitialized: boolean;  // ✅ New flag
    user: User | null;
    error: AuthErrorType | null;
}
```

### Behavior Changes

| Scenario | Before | After |
|----------|--------|-------|
| Hard refresh with valid session | Redirects to login | Keeps session, shows loading |
| Hard refresh without session | Redirects to login | Confirms logout, shows login |
| Intentional logout | Clears data | Clears data, marks initialized |
| 3-hour inactivity | ❌ Not implemented | Auto-logout, toast notification |

### Testing
1. **Hard refresh with valid session**:
   - Login to app
   - Press F5 or Cmd+R
   - Verify: Still logged in, loading overlay shows briefly
   - Verify: No redirect to login

2. **Hard refresh without session**:
   - Logout
   - Press F5 or Cmd+R
   - Verify: At login page
   - Verify: No unexpected redirects

3. **Inactivity timeout**:
   - Login
   - Don't interact for 3 hours (or reduce timeout in dev)
   - Verify: Auto-logout with toast notification
   - Verify: Redirects to login

---

## Files Modified

### 1. `services/db.ts` (ProductService.add)
- Added UUID generation for new products
- Changed from `upsert()` to `insert()` for new records
- Ensures every product has unique ID before submission

### 2. `utils/validation/schemas.ts` (productSchema)
- Added all required fields to schema
- Added default values for optional fields
- Proper numeric validation and error messages

### 3. `services/auth/authTypes.ts`
- Added `isInitialized: boolean` to `AuthContextValue`
- Documents new flag for session restoration tracking

### 4. `services/auth/AuthProvider.tsx`
- Changed initial state from `IDLE` to `LOADING`
- Added `isInitialized` state variable
- Set `isInitialized=true` after boot completes
- Set `isInitialized=true` on logout
- 3-hour inactivity timeout with activity tracking

### 5. `App.tsx` (ProtectedRoute)
- Gate redirects on `isInitialized` flag
- Show loading overlay until boot completes
- Prevents premature logout on hard refresh

---

## Build Status
✅ **TypeScript**: 0 errors
✅ **Production Build**: 4.33s, successful
✅ **Bundle**: 2531 modules, ~1.6MB JS

---

## Deployment Checklist
- [ ] Verify product creation works
- [ ] Test form validation with missing fields
- [ ] Test hard refresh preserves session
- [ ] Verify logout clears all data
- [ ] Test 3-hour inactivity timeout (adjust timeout value in dev)
- [ ] Monitor browser console for errors
- [ ] Check Supabase product inserts are working

---

## Future Improvements
1. **Code splitting** - Bundle is 1.6MB, consider route-based splitting
2. **Cross-tab logout** - Sync logout events across browser tabs
3. **Offline support** - Queue actions while offline
4. **Token refresh** - Auto-refresh before expiry
5. **Accessibility** - Add ARIA labels to loading states

---

## References
- Product creation flow: `pages/admin/Products.tsx`
- Auth initialization: `services/auth/AuthProvider.tsx`
- Session persistence: `services/auth/userStore.ts`
- Validation: `utils/validation/schemas.ts`
