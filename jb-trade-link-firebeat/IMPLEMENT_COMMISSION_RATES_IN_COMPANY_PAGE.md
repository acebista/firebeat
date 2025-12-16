# HOW TO: Add Commission Rate Management to Company Page

**Goal**: Allow admins to manage commission rates per company directly from the Company Management page

---

## 📋 OVERVIEW

Commission rate management will be added as a new section in the Company Management page, specifically in the Company detail/edit view.

---

## 🏗️ IMPLEMENTATION PLAN

### Step 1: Check Company Management Component
```
File: /pages/admin/Companies.tsx (or similar)
Look for: Company detail/edit modal or page
Add: New section for "Commission Rates"
```

### Step 2: Create Commission Rate Table Component
```typescript
// Optional: Create reusable component
// /components/admin/CompanyCommissionRates.tsx

interface Props {
  companyId: string;
  companyName: string;
}

// Display table of commission rates for this company
// Add button to add new rate
// Edit/Delete buttons per rate
```

### Step 3: Add Rate Management UI
```
Sections to add:
├── Commission Rates Table
│   ├── Min Amount
│   ├── Max Amount
│   ├── Rate %
│   ├── Active toggle
│   └── Actions (Edit/Delete)
└── Add New Rate Button
    └── Modal form
```

### Step 4: Use Existing Services
```typescript
// Already available from /services/hr.ts
CommissionRateService.getActiveByCompany(companyId)
CommissionRateService.upsert(payload)
CommissionRateService.delete(id)
CommissionRateService.hardDelete(id)
```

---

## 💻 CODE EXAMPLE

### Component Structure
```typescript
// /components/admin/CompanyCommissionRates.tsx

import React, { useState, useEffect } from 'react';
import { Card, Button, Input } from '../ui/Elements';
import { CommissionRateService } from '../../services/hr';
import { CommissionRate, UpsertCommissionRatePayload } from '../../types/hr';
import toast from 'react-hot-toast';

interface Props {
  companyId: string;
  companyName: string;
}

export const CompanyCommissionRates: React.FC<Props> = ({ companyId, companyName }) => {
  const [rates, setRates] = useState<CommissionRate[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingRate, setEditingRate] = useState<CommissionRate | null>(null);

  useEffect(() => {
    loadRates();
  }, [companyId]);

  const loadRates = async () => {
    setLoading(true);
    try {
      const data = await CommissionRateService.getActiveByCompany(companyId);
      setRates(data);
    } catch (error) {
      toast.error('Failed to load commission rates');
    }
    setLoading(false);
  };

  const handleAddRate = () => {
    setEditingRate(null);
    setShowModal(true);
  };

  const handleEditRate = (rate: CommissionRate) => {
    setEditingRate(rate);
    setShowModal(true);
  };

  const handleSaveRate = async (rate: CommissionRate) => {
    try {
      const payload: UpsertCommissionRatePayload = {
        ...rate,
        company_id: companyId,
      };
      await CommissionRateService.upsert(payload);
      toast.success('Commission rate saved');
      setShowModal(false);
      loadRates();
    } catch (error) {
      toast.error('Failed to save commission rate');
    }
  };

  const handleDeleteRate = async (id: string) => {
    if (!confirm('Delete this commission rate?')) return;
    try {
      await CommissionRateService.delete(id);
      toast.success('Commission rate deleted');
      loadRates();
    } catch (error) {
      toast.error('Failed to delete commission rate');
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Commission Rates</h2>
          <p className="text-gray-600">{companyName}</p>
        </div>
        <Button onClick={handleAddRate} className="bg-blue-600 text-white">
          Add Rate
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-600">Loading rates...</p>
        </div>
      ) : rates.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">No commission rates configured</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-300 bg-gray-50">
                <th className="text-left py-2 px-4 font-semibold">Min Amount</th>
                <th className="text-left py-2 px-4 font-semibold">Max Amount</th>
                <th className="text-right py-2 px-4 font-semibold">Rate %</th>
                <th className="text-left py-2 px-4 font-semibold">Status</th>
                <th className="text-right py-2 px-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rates.map((rate) => (
                <tr key={rate.id} className="border-b border-gray-200">
                  <td className="py-3 px-4">₹{rate.min_amount.toLocaleString()}</td>
                  <td className="py-3 px-4">
                    {rate.max_amount ? `₹${rate.max_amount.toLocaleString()}` : 'Unlimited'}
                  </td>
                  <td className="py-3 px-4 text-right font-semibold">{rate.rate_pct}%</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      rate.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {rate.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button
                      onClick={() => handleEditRate(rate)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteRate(rate.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for add/edit (reuse from old HRPanel or create new) */}
      {/* ... modal code here ... */}
    </Card>
  );
};
```

### Integration in Company Detail
```typescript
// In /pages/admin/Companies.tsx (or similar)

<CompanyCommissionRates 
  companyId={company.id} 
  companyName={company.name}
/>
```

---

## 🔑 KEY POINTS

### Using Existing Services
The `CommissionRateService` already has all needed methods:
- `getActiveByCompany(companyId)` - Get rates for a company
- `upsert(payload)` - Save new or update existing
- `delete(id)` - Soft delete (set is_active = false)
- `hardDelete(id)` - Permanent delete

### Type Safety
```typescript
// CommissionRate interface from /types/hr.ts
interface CommissionRate {
  id: string;
  company_id: string | null;
  company_name: string | null;
  name: string;
  min_amount: number;
  max_amount: number | null;
  rate_pct: number; // 0-100
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

// UpsertCommissionRatePayload for saving
interface UpsertCommissionRatePayload {
  id?: string;
  company_id: string;
  name: string;
  min_amount: number;
  max_amount: number | null;
  rate_pct: number;
  is_active?: boolean;
}
```

### Validation
The `commissionCalculator.ts` utility has validation functions:
```typescript
validateSlab(slab)      // Check single rate
validateSlabsNoOverlap(slabs)  // Check for overlaps
```

Use these in the modal form to ensure valid data before saving.

---

## 📋 VALIDATION RULES

When adding/editing commission rates:

1. **Rate must be 0-100%**
   ```typescript
   if (rate_pct < 0 || rate_pct > 100) {
     throw new Error('Rate must be between 0 and 100');
   }
   ```

2. **Min amount must be non-negative**
   ```typescript
   if (min_amount < 0) {
     throw new Error('Minimum amount cannot be negative');
   }
   ```

3. **Max must be >= Min (if specified)**
   ```typescript
   if (max_amount !== null && max_amount < min_amount) {
     throw new Error('Maximum amount must be >= minimum amount');
   }
   ```

4. **No overlapping ranges**
   ```typescript
   const errors = validateSlabsNoOverlap([...allRates, newRate]);
   if (errors.length > 0) {
     // Show overlap error
   }
   ```

---

## 🎯 TESTING CHECKLIST

- [ ] Add a commission rate (should work)
- [ ] Edit a commission rate (should update)
- [ ] Delete a commission rate (should be marked inactive)
- [ ] Try to add overlapping rates (should fail with error)
- [ ] Check HR Panel shows correct rates for company
- [ ] Verify commission calculations use the right rates

---

## 🚀 DEPLOYMENT

Once implemented and tested:

1. Deploy code to production
2. Admins can now set commission rates per company
3. HR Panel will use those rates for calculations
4. Salespeople compensation will be calculated based on company rates

---

## 📚 RELATED FILES

- `/services/hr.ts` - Service layer
- `/types/hr.ts` - Type definitions
- `/utils/commissionCalculator.ts` - Validation functions
- `/components/admin/HRPanel.tsx` - Commission calculator
- `/pages/admin/Companies.tsx` - Where to add this

