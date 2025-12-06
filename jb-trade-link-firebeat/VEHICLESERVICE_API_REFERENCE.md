# 🚗 VehicleService API Reference

## Overview

The `VehicleService` provides complete CRUD operations for managing vehicles in the JB Trade Link Firebeat application. All methods are type-safe with TypeScript and fully integrated with Supabase.

---

## Service Location

```typescript
import { VehicleService } from '../../services/db';
```

---

## API Methods

### 1. getAll()

Get all active vehicles from the database.

```typescript
const vehicles = await VehicleService.getAll();
```

**Returns:**
```typescript
Promise<Vehicle[]>
```

**Example:**
```typescript
const vehicles = await VehicleService.getAll();
console.log(vehicles);
// Output: [
//   { id: 'veh_12345', name: 'Van 1', registrationNo: 'KA-01-1234', ... },
//   { id: 'veh_67890', name: 'Van 2', registrationNo: 'KA-02-5678', ... }
// ]
```

**Error Handling:**
```typescript
try {
  const vehicles = await VehicleService.getAll();
} catch (error) {
  console.error('Failed to fetch vehicles:', error);
  // Handle error (no active session, database error, etc.)
}
```

---

### 2. add()

Create a new vehicle in the database.

```typescript
const newVehicle = await VehicleService.add(vehicleData);
```

**Parameters:**

```typescript
interface VehicleInput {
  name: string;          // Required, 2-50 chars, UNIQUE
  registrationNo?: string; // Optional, 2-20 chars
  capacityCases?: number; // Optional, non-negative
  isActive?: boolean;     // Optional, defaults to true
}
```

**Example - Minimal:**
```typescript
const vehicle = await VehicleService.add({
  name: 'Van 1',
  isActive: true
});
```

**Example - Full:**
```typescript
const vehicle = await VehicleService.add({
  name: 'Tata Ace Van',
  registrationNo: 'KA-51-XY-1234',
  capacityCases: 100,
  isActive: true
});
```

**Returns:**
```typescript
Promise<Vehicle>
// {
//   id: 'veh_12345678',
//   name: 'Tata Ace Van',
//   registrationNo: 'KA-51-XY-1234',
//   capacityCases: 100,
//   isActive: true,
//   createdAt: '2025-12-05T10:30:00.000Z',
//   updatedAt: '2025-12-05T10:30:00.000Z'
// }
```

**Error Handling:**
```typescript
try {
  const vehicle = await VehicleService.add({
    name: 'Van 1',
    registrationNo: 'KA-51-XY-1234',
    capacityCases: 100
  });
  console.log('Vehicle created:', vehicle.id);
} catch (error: any) {
  if (error.message.includes('duplicate')) {
    console.error('Vehicle name already exists');
  } else {
    console.error('Failed to add vehicle:', error);
  }
}
```

---

### 3. update()

Update an existing vehicle's details.

```typescript
await VehicleService.update(vehicleId, updateData);
```

**Parameters:**

```typescript
id: string;                    // Vehicle ID (required)

updateData: Partial<Vehicle> {
  name?: string;
  registrationNo?: string;
  capacityCases?: number;
  isActive?: boolean;
}
```

**Example - Update Capacity:**
```typescript
await VehicleService.update('veh_12345678', {
  capacityCases: 120
});
```

**Example - Deactivate:**
```typescript
await VehicleService.update('veh_12345678', {
  isActive: false
});
```

**Example - Update Multiple Fields:**
```typescript
await VehicleService.update('veh_12345678', {
  registrationNo: 'KA-51-XY-9999',
  capacityCases: 150,
  isActive: true
});
```

**Returns:**
```typescript
Promise<void>
```

**Error Handling:**
```typescript
try {
  await VehicleService.update('veh_12345678', {
    capacityCases: 120
  });
  console.log('Vehicle updated');
} catch (error) {
  console.error('Failed to update vehicle:', error);
}
```

---

### 4. delete()

Delete a vehicle from the database.

```typescript
await VehicleService.delete(vehicleId);
```

**Parameters:**

```typescript
id: string; // Vehicle ID (required)
```

**Example:**
```typescript
await VehicleService.delete('veh_12345678');
```

**Returns:**
```typescript
Promise<void>
```

**Error Handling:**
```typescript
try {
  await VehicleService.delete('veh_12345678');
  console.log('Vehicle deleted');
} catch (error) {
  console.error('Failed to delete vehicle:', error);
}
```

---

### 5. getById()

Retrieve a single vehicle by ID.

```typescript
const vehicle = await VehicleService.getById(vehicleId);
```

**Parameters:**

```typescript
id: string; // Vehicle ID (required)
```

**Example:**
```typescript
const vehicle = await VehicleService.getById('veh_12345678');
if (vehicle) {
  console.log('Vehicle:', vehicle.name);
} else {
  console.log('Vehicle not found');
}
```

**Returns:**
```typescript
Promise<Vehicle | null>
// Returns null if vehicle not found
```

**Error Handling:**
```typescript
try {
  const vehicle = await VehicleService.getById('veh_12345678');
  if (vehicle) {
    console.log('Found:', vehicle);
  } else {
    console.log('Vehicle not found');
  }
} catch (error) {
  console.error('Error fetching vehicle:', error);
}
```

---

## Type Definitions

### Vehicle Interface

```typescript
interface Vehicle {
  id: string;              // e.g., 'veh_12345678'
  name: string;            // e.g., 'Van 1', 'Truck Alpha'
  registrationNo?: string; // e.g., 'KA-51-XY-1234'
  capacityCases?: number;  // e.g., 100 (cases)
  isActive: boolean;       // true/false
  createdAt: string;       // ISO timestamp
  updatedAt?: string;      // ISO timestamp
}
```

---

## Complete Usage Examples

### Example 1: Add and Use Vehicle

```typescript
import { VehicleService } from '../../services/db';

async function createAndUseVehicle() {
  try {
    // Add new vehicle
    const vehicle = await VehicleService.add({
      name: 'Delivery Van 1',
      registrationNo: 'KA-51-AB-1234',
      capacityCases: 100,
      isActive: true
    });
    
    console.log('Created vehicle:', vehicle.id);
    
    // Use in trip
    const trip = {
      vehicleId: vehicle.id,
      vehicleName: vehicle.name,
      // ... other trip fields
    };
    
    return trip;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
```

### Example 2: List and Filter Vehicles

```typescript
async function listActiveVehicles() {
  try {
    const vehicles = await VehicleService.getAll();
    
    // Filter by status
    const activeVehicles = vehicles.filter(v => v.isActive);
    
    // Filter by capacity
    const largeVehicles = vehicles.filter(v => (v.capacityCases || 0) > 50);
    
    // Display
    activeVehicles.forEach(v => {
      console.log(`${v.name} - Capacity: ${v.capacityCases || 'N/A'}`);
    });
  } catch (error) {
    console.error('Error:', error);
  }
}
```

### Example 3: Update Vehicle

```typescript
async function updateVehicleCapacity(vehicleId: string, newCapacity: number) {
  try {
    // Get current vehicle
    const vehicle = await VehicleService.getById(vehicleId);
    if (!vehicle) {
      throw new Error('Vehicle not found');
    }
    
    // Update capacity
    await VehicleService.update(vehicleId, {
      capacityCases: newCapacity
    });
    
    console.log(`Updated ${vehicle.name} capacity to ${newCapacity}`);
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
```

### Example 4: Delete Vehicle

```typescript
async function decommissionVehicle(vehicleId: string) {
  try {
    // Deactivate instead of delete (safer)
    await VehicleService.update(vehicleId, {
      isActive: false
    });
    
    console.log('Vehicle deactivated');
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
```

---

## Error Scenarios

### Duplicate Vehicle Name
```typescript
try {
  await VehicleService.add({
    name: 'Van 1'  // Already exists
  });
} catch (error: any) {
  if (error.code === '23505') {
    console.error('Vehicle name already exists');
  }
}
```

### Invalid Input
```typescript
try {
  await VehicleService.add({
    name: 'V' // Too short (min 2 chars)
  });
} catch (error) {
  console.error('Invalid vehicle name');
}
```

### Not Found
```typescript
const vehicle = await VehicleService.getById('veh_invalid');
if (!vehicle) {
  console.log('Vehicle not found');
}
```

### No Session
```typescript
try {
  await VehicleService.getAll();
} catch (error: any) {
  if (error.message.includes('session')) {
    console.error('User not logged in');
    // Redirect to login
  }
}
```

---

## Best Practices

### 1. Always Handle Errors
```typescript
try {
  const vehicles = await VehicleService.getAll();
} catch (error) {
  console.error('Failed to load vehicles:', error);
  // Show user-friendly error message
  toast.error('Failed to load vehicles');
}
```

### 2. Validate Before Add
```typescript
import { vehicleSchema } from '../../utils/validation/schemas';

const data = { name: 'Van 1', registrationNo: 'KA-51-XY-1234' };
const validated = vehicleSchema.parse(data);
const vehicle = await VehicleService.add(validated);
```

### 3. Deactivate Instead of Delete
```typescript
// Better than delete for data integrity
await VehicleService.update(vehicleId, {
  isActive: false
});
```

### 4. Use TypeScript Types
```typescript
const vehicles: Vehicle[] = await VehicleService.getAll();
vehicles.forEach(v => {
  console.log(`${v.name}: ${v.capacityCases} cases`);
});
```

---

## Integration Examples

### In React Component

```typescript
import { useEffect, useState } from 'react';
import { VehicleService } from '../../services/db';
import { Vehicle } from '../../types';

export function VehicleList() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadVehicles = async () => {
      try {
        const data = await VehicleService.getAll();
        setVehicles(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    loadVehicles();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <select>
      {vehicles.map(v => (
        <option key={v.id} value={v.id}>
          {v.name}
        </option>
      ))}
    </select>
  );
}
```

### In Form Submission

```typescript
async function handleAddVehicle(formData: FormData) {
  try {
    const vehicle = await VehicleService.add({
      name: formData.get('name') as string,
      registrationNo: formData.get('registration') as string,
      capacityCases: Number(formData.get('capacity')),
      isActive: true
    });

    toast.success(`Added ${vehicle.name}`);
    refreshList();
  } catch (error) {
    toast.error('Failed to add vehicle');
  }
}
```

---

## Performance Considerations

### Caching
```typescript
// Cache vehicles after first load
let vehicleCache: Vehicle[] | null = null;

async function getCachedVehicles() {
  if (vehicleCache) return vehicleCache;
  vehicleCache = await VehicleService.getAll();
  return vehicleCache;
}
```

### Bulk Operations
```typescript
// For multiple updates, consider batching
async function updateMultiple(updates: { id: string; data: Partial<Vehicle> }[]) {
  return Promise.all(
    updates.map(({ id, data }) => VehicleService.update(id, data))
  );
}
```

---

## API Summary Table

| Method | Purpose | Returns | Errors |
|--------|---------|---------|--------|
| `getAll()` | Get all vehicles | `Vehicle[]` | Session, DB |
| `add()` | Create vehicle | `Vehicle` | Validation, Duplicate |
| `update()` | Update vehicle | `void` | Not Found, DB |
| `delete()` | Delete vehicle | `void` | Not Found, DB |
| `getById()` | Get by ID | `Vehicle \| null` | DB Error |

---

## Security Notes

- ✅ RLS policies enforce admin-only management
- ✅ Session validation before all operations
- ✅ Input validation via Zod schema
- ✅ SQL injection protection via Supabase
- ✅ All operations are type-safe

---

For more information, see:
- `VEHICLES_MANAGEMENT_GUIDE.md` - Complete guide
- `VEHICLES_QUICK_START.md` - Quick reference
- `types.ts` - Type definitions
- `services/db.ts` - Implementation
