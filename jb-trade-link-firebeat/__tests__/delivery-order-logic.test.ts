/**
 * Delivery Order Business Logic - Unit Tests
 * Tests for calculations, validations, and state management
 */

import {
  calculateSubtotal,
  calculateDamagesTotal,
  calculateReturnTotal,
  calculateNetReceivable,
  calculateRemainingBalance,
  validateMarkDelivered,
  validateSalesReturn,
  validateDelay,
} from '../lib/delivery-order-logic';
import {
  AssignedOrder,
  MarkDeliveredPayload,
  RecordSalesReturnPayload,
  DamagedItem,
  ReturnedItem,
} from '../types/delivery-order';

// ============================================
// CALCULATION TESTS
// ============================================

describe('Calculation Functions', () => {
  describe('calculateSubtotal', () => {
    it('should sum all item totals', () => {
      const items = [
        { productId: '1', productName: 'Item 1', qty: 2, rate: 100, total: 200 },
        { productId: '2', productName: 'Item 2', qty: 3, rate: 50, total: 150 },
      ];
      expect(calculateSubtotal(items)).toBe(350);
    });

    it('should handle empty items array', () => {
      expect(calculateSubtotal([])).toBe(0);
    });

    it('should calculate total if not provided', () => {
      const items = [
        { productId: '1', productName: 'Item 1', qty: 2, rate: 100 },
        { productId: '2', productName: 'Item 2', qty: 3, rate: 50 },
      ];
      expect(calculateSubtotal(items)).toBe(350);
    });
  });

  describe('calculateDamagesTotal', () => {
    it('should sum all damage amounts', () => {
      const damages: DamagedItem[] = [
        {
          productId: '1',
          productName: 'Product 1',
          qty: 1,
          damageType: 'broken',
          amount: 100,
        },
        {
          productId: '2',
          productName: 'Product 2',
          qty: 2,
          damageType: 'expired',
          amount: 200,
        },
      ];
      expect(calculateDamagesTotal(damages)).toBe(300);
    });

    it('should return 0 for undefined damages', () => {
      expect(calculateDamagesTotal(undefined)).toBe(0);
    });

    it('should return 0 for empty damages', () => {
      expect(calculateDamagesTotal([])).toBe(0);
    });
  });

  describe('calculateReturnTotal', () => {
    it('should sum all return amounts', () => {
      const items: ReturnedItem[] = [
        {
          productId: '1',
          productName: 'Product 1',
          qtyDelivered: 5,
          qtyReturned: 2,
          rate: 100,
          returnAmount: 200,
        },
        {
          productId: '2',
          productName: 'Product 2',
          qtyDelivered: 10,
          qtyReturned: 5,
          rate: 50,
          returnAmount: 250,
        },
      ];
      expect(calculateReturnTotal(items)).toBe(450);
    });

    it('should return 0 for empty items', () => {
      expect(calculateReturnTotal([])).toBe(0);
    });
  });

  describe('calculateNetReceivable', () => {
    it('should calculate subtotal - damages - returns', () => {
      const result = calculateNetReceivable(1000, 100, 200);
      expect(result).toBe(700);
    });

    it('should use default values for damages and returns', () => {
      const result = calculateNetReceivable(1000);
      expect(result).toBe(1000);
    });

    it('should not return negative values', () => {
      const result = calculateNetReceivable(100, 200, 300);
      expect(result).toBe(0);
    });
  });

  describe('calculateRemainingBalance', () => {
    it('should calculate netReceivable - amountReceived', () => {
      const result = calculateRemainingBalance(1000, 400);
      expect(result).toBe(600);
    });

    it('should not return negative values', () => {
      const result = calculateRemainingBalance(500, 1000);
      expect(result).toBe(0);
    });

    it('should return full amount when nothing received', () => {
      const result = calculateRemainingBalance(1000, 0);
      expect(result).toBe(1000);
    });
  });
});

// ============================================
// VALIDATION TESTS
// ============================================

describe('Validation Functions', () => {
  const mockOrder: AssignedOrder = {
    id: 'ord-1',
    orderId: 'ORD-001',
    customerId: 'cust-1',
    customerName: 'Test Customer',
    customerPhone: '9999999999',
    customerAddress: 'Test Address',
    items: [
      {
        productId: 'prod-1',
        productName: 'Product 1',
        qty: 5,
        rate: 100,
        total: 500,
      },
      {
        productId: 'prod-2',
        productName: 'Product 2',
        qty: 10,
        rate: 50,
        total: 500,
      },
    ],
    subtotal: 1000,
    netReceivable: 1000,
    status: 'assigned',
    assignedToUserId: 'user-1',
    assignedToUserName: 'Delivery Person',
    assignedDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  describe('validateMarkDelivered', () => {
    it('should validate correct payload', () => {
      const payload: MarkDeliveredPayload = {
        orderId: 'ord-1',
        amountReceived: 1000,
        paymentMode: 'cash',
      };
      const result = validateMarkDelivered(payload, mockOrder);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should require amountReceived', () => {
      const payload: MarkDeliveredPayload = {
        orderId: 'ord-1',
        amountReceived: undefined as any,
        paymentMode: 'cash',
      };
      const result = validateMarkDelivered(payload, mockOrder);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.includes('Amount received is required'))).toBe(true);
    });

    it('should not allow amount > netReceivable', () => {
      const payload: MarkDeliveredPayload = {
        orderId: 'ord-1',
        amountReceived: 1500,
        paymentMode: 'cash',
      };
      const result = validateMarkDelivered(payload, mockOrder);
      expect(result.isValid).toBe(false);
      expect(
        result.errors.some(e => e.includes('cannot exceed net receivable'))
      ).toBe(true);
    });

    it('should require paymentMode', () => {
      const payload: MarkDeliveredPayload = {
        orderId: 'ord-1',
        amountReceived: 1000,
        paymentMode: undefined as any,
      };
      const result = validateMarkDelivered(payload, mockOrder);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.includes('Payment mode is required'))).toBe(true);
    });

    it('should validate payment mode values', () => {
      const payload: MarkDeliveredPayload = {
        orderId: 'ord-1',
        amountReceived: 1000,
        paymentMode: 'invalid' as any,
      };
      const result = validateMarkDelivered(payload, mockOrder);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.includes('Invalid payment mode'))).toBe(true);
    });

    it('should not allow damages > subtotal', () => {
      const damages: DamagedItem[] = [
        {
          productId: 'prod-1',
          productName: 'Product 1',
          qty: 5,
          damageType: 'broken',
          amount: 1500, // More than subtotal
        },
      ];
      const payload: MarkDeliveredPayload = {
        orderId: 'ord-1',
        amountReceived: 1000,
        paymentMode: 'cash',
        damages,
      };
      const result = validateMarkDelivered(payload, mockOrder);
      expect(result.isValid).toBe(false);
      expect(
        result.errors.some(e => e.includes('cannot exceed order subtotal'))
      ).toBe(true);
    });
  });

  describe('validateSalesReturn', () => {
    it('should validate full return', () => {
      const payload: RecordSalesReturnPayload = {
        orderId: 'ord-1',
        returnType: 'full',
        reason: 'customer_rejected',
        items: mockOrder.items.map(item => ({
          productId: item.productId,
          productName: item.productName,
          qtyDelivered: item.qty,
          qtyReturned: item.qty,
          rate: item.rate,
          returnAmount: item.total,
        })),
      };
      const result = validateSalesReturn(payload, mockOrder);
      expect(result.isValid).toBe(true);
    });

    it('should require return type', () => {
      const payload: RecordSalesReturnPayload = {
        orderId: 'ord-1',
        returnType: undefined as any,
        reason: 'customer_rejected',
        items: [],
      };
      const result = validateSalesReturn(payload, mockOrder);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.includes('Return type'))).toBe(true);
    });

    it('should require partial return to have items', () => {
      const payload: RecordSalesReturnPayload = {
        orderId: 'ord-1',
        returnType: 'partial',
        reason: 'customer_rejected',
        items: [],
      };
      const result = validateSalesReturn(payload, mockOrder);
      expect(result.isValid).toBe(false);
      expect(
        result.errors.some(e => e.includes('Partial return requires at least one item'))
      ).toBe(true);
    });

    it('should not allow return qty > delivered qty', () => {
      const payload: RecordSalesReturnPayload = {
        orderId: 'ord-1',
        returnType: 'partial',
        reason: 'customer_rejected',
        items: [
          {
            productId: 'prod-1',
            productName: 'Product 1',
            qtyDelivered: 5,
            qtyReturned: 10, // More than delivered
            rate: 100,
            returnAmount: 1000,
          },
        ],
      };
      const result = validateSalesReturn(payload, mockOrder);
      expect(result.isValid).toBe(false);
      expect(
        result.errors.some(e => e.includes('exceeds delivered quantity'))
      ).toBe(true);
    });
  });

  describe('validateDelay', () => {
    it('should validate correct delay payload', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const payload = {
        orderId: 'ord-1',
        reason: 'customer_not_available' as const,
        rescheduledDate: tomorrow.toISOString().split('T')[0],
        notes: 'Test note',
      };
      const result = validateDelay(payload);
      expect(result.isValid).toBe(true);
    });

    it('should require reason', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const payload = {
        orderId: 'ord-1',
        reason: undefined as any,
        rescheduledDate: tomorrow.toISOString().split('T')[0],
      };
      const result = validateDelay(payload);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.includes('Delay reason is required'))).toBe(true);
    });

    it('should not allow past dates', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const payload = {
        orderId: 'ord-1',
        reason: 'customer_not_available' as const,
        rescheduledDate: yesterday.toISOString().split('T')[0],
      };
      const result = validateDelay(payload);
      expect(result.isValid).toBe(false);
      expect(
        result.errors.some(e => e.includes('cannot be in the past'))
      ).toBe(true);
    });

    it('should not allow dates > 7 days in future', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 10);
      const payload = {
        orderId: 'ord-1',
        reason: 'customer_not_available' as const,
        rescheduledDate: futureDate.toISOString().split('T')[0],
      };
      const result = validateDelay(payload);
      expect(result.isValid).toBe(false);
      expect(
        result.errors.some(e => e.includes('cannot be more than 7 days'))
      ).toBe(true);
    });
  });
});

// ============================================
// INTEGRATION TESTS
// ============================================

describe('Integration Scenarios', () => {
  const mockOrder: AssignedOrder = {
    id: 'ord-1',
    orderId: 'ORD-001',
    customerId: 'cust-1',
    customerName: 'Test Customer',
    customerPhone: '9999999999',
    customerAddress: 'Test Address',
    items: [
      {
        productId: 'prod-1',
        productName: 'Product 1',
        qty: 5,
        rate: 100,
        total: 500,
      },
      {
        productId: 'prod-2',
        productName: 'Product 2',
        qty: 10,
        rate: 50,
        total: 500,
      },
    ],
    subtotal: 1000,
    netReceivable: 1000,
    status: 'assigned',
    assignedToUserId: 'user-1',
    assignedToUserName: 'Delivery Person',
    assignedDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  it('should handle delivery with damages deduction', () => {
    const damages: DamagedItem[] = [
      {
        productId: 'prod-1',
        productName: 'Product 1',
        qty: 2,
        damageType: 'broken',
        amount: 200,
      },
    ];

    const damagesTotal = calculateDamagesTotal(damages);
    expect(damagesTotal).toBe(200);

    const netReceivable = calculateNetReceivable(mockOrder.subtotal, damagesTotal, 0);
    expect(netReceivable).toBe(800);

    const payload: MarkDeliveredPayload = {
      orderId: mockOrder.id,
      amountReceived: 800,
      paymentMode: 'cash',
      damages,
    };

    const validation = validateMarkDelivered(payload, mockOrder);
    expect(validation.isValid).toBe(true);
  });

  it('should handle partial return scenario', () => {
    const returnItems: ReturnedItem[] = [
      {
        productId: 'prod-1',
        productName: 'Product 1',
        qtyDelivered: 5,
        qtyReturned: 2,
        rate: 100,
        returnAmount: 200,
      },
    ];

    const returnTotal = calculateReturnTotal(returnItems);
    expect(returnTotal).toBe(200);

    const netReceivable = calculateNetReceivable(mockOrder.subtotal, 0, returnTotal);
    expect(netReceivable).toBe(800);

    const payload: RecordSalesReturnPayload = {
      orderId: mockOrder.id,
      returnType: 'partial',
      reason: 'customer_rejected',
      items: returnItems,
    };

    const validation = validateSalesReturn(payload, mockOrder);
    expect(validation.isValid).toBe(true);
  });

  it('should handle complex scenario with damages and partial payment', () => {
    const damages: DamagedItem[] = [
      {
        productId: 'prod-1',
        productName: 'Product 1',
        qty: 1,
        damageType: 'expired',
        amount: 100,
      },
    ];

    const damagesTotal = calculateDamagesTotal(damages);
    const netReceivable = calculateNetReceivable(mockOrder.subtotal, damagesTotal, 0);
    expect(netReceivable).toBe(900);

    const amountReceived = 500;
    const balance = calculateRemainingBalance(netReceivable, amountReceived);
    expect(balance).toBe(400);

    const payload: MarkDeliveredPayload = {
      orderId: mockOrder.id,
      amountReceived,
      paymentMode: 'credit',
      damages,
    };

    const validation = validateMarkDelivered(payload, mockOrder);
    expect(validation.isValid).toBe(true);
  });
});
