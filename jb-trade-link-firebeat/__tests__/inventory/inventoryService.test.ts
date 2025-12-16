/**
 * Inventory Service Tests
 * 
 * Unit tests for inventory aggregation and calculations
 */

import { calculateCurrentStock, InventoryMovement } from '../../services/inventory/inventoryService';

describe('inventoryService', () => {
  describe('calculateCurrentStock', () => {
    it('should calculate current stock with no movements', () => {
      const result = calculateCurrentStock(100, []);
      expect(result).toBe(100);
    });

    it('should add positive movements (purchases, returns)', () => {
      const movements: InventoryMovement[] = [
        {
          id: '1',
          date: '2024-01-01',
          type: 'purchase',
          quantity: 50,
          reference_id: 'PO-001',
          reference_type: 'purchase',
          product_id: 'prod-1',
        },
        {
          id: '2',
          date: '2024-01-02',
          type: 'return',
          quantity: 10,
          reference_id: 'RET-001',
          reference_type: 'return',
          product_id: 'prod-1',
        },
      ];

      const result = calculateCurrentStock(100, movements);
      expect(result).toBe(160); // 100 + 50 + 10
    });

    it('should subtract negative movements (sales, damage)', () => {
      const movements: InventoryMovement[] = [
        {
          id: '1',
          date: '2024-01-01',
          type: 'sale',
          quantity: -30,
          reference_id: 'ORD-001',
          reference_type: 'order',
          product_id: 'prod-1',
        },
        {
          id: '2',
          date: '2024-01-02',
          type: 'damage',
          quantity: -5,
          reference_id: 'DMG-001',
          reference_type: 'damage',
          product_id: 'prod-1',
        },
      ];

      const result = calculateCurrentStock(100, movements);
      expect(result).toBe(65); // 100 - 30 - 5
    });

    it('should handle mixed movements', () => {
      const movements: InventoryMovement[] = [
        {
          id: '1',
          date: '2024-01-01',
          type: 'purchase',
          quantity: 100,
          reference_id: 'PO-001',
          reference_type: 'purchase',
          product_id: 'prod-1',
        },
        {
          id: '2',
          date: '2024-01-02',
          type: 'sale',
          quantity: -30,
          reference_id: 'ORD-001',
          reference_type: 'order',
          product_id: 'prod-1',
        },
        {
          id: '3',
          date: '2024-01-03',
          type: 'adjustment',
          quantity: -5,
          reference_id: 'ADJ-001',
          reference_type: 'adjustment',
          product_id: 'prod-1',
        },
        {
          id: '4',
          date: '2024-01-04',
          type: 'return',
          quantity: 15,
          reference_id: 'RET-001',
          reference_type: 'return',
          product_id: 'prod-1',
        },
      ];

      const result = calculateCurrentStock(50, movements);
      expect(result).toBe(130); // 50 + 100 - 30 - 5 + 15
    });

    it('should handle zero opening stock', () => {
      const movements: InventoryMovement[] = [
        {
          id: '1',
          date: '2024-01-01',
          type: 'purchase',
          quantity: 50,
          reference_id: 'PO-001',
          reference_type: 'purchase',
          product_id: 'prod-1',
        },
      ];

      const result = calculateCurrentStock(0, movements);
      expect(result).toBe(50);
    });

    it('should result in negative stock if outflows exceed opening', () => {
      const movements: InventoryMovement[] = [
        {
          id: '1',
          date: '2024-01-01',
          type: 'sale',
          quantity: -150,
          reference_id: 'ORD-001',
          reference_type: 'order',
          product_id: 'prod-1',
        },
      ];

      const result = calculateCurrentStock(100, movements);
      expect(result).toBe(-50);
    });
  });
});

// Export for running in test environment
export {};
