/**
 * Delivery Order Business Logic
 * Handles validations, calculations, and state management for delivery orders
 */

import {
  AssignedOrder,
  MarkDeliveredPayload,
  RecordSalesReturnPayload,
  RecordDelayPayload,
  ValidationResult,
  DamagedItem,
  ReturnedItem,
} from '../types/delivery-order';

// ============================================
// CALCULATION FUNCTIONS
// ============================================

/**
 * Calculate subtotal from items
 */
export const calculateSubtotal = (items: any[]): number => {
  return items.reduce((sum, item) => sum + (item.total || item.qty * item.rate), 0);
};

/**
 * Calculate total damages amount
 */
export const calculateDamagesTotal = (damages?: DamagedItem[]): number => {
  if (!damages || damages.length === 0) return 0;
  return damages.reduce((sum, item) => sum + item.amount, 0);
};

/**
 * Calculate total return amount
 */
export const calculateReturnTotal = (items: ReturnedItem[]): number => {
  return items.reduce((sum, item) => sum + item.returnAmount, 0);
};

/**
 * Calculate net receivable amount
 * Formula: subtotal - damages - return_amount
 */
export const calculateNetReceivable = (
  subtotal: number,
  damagesAmount: number = 0,
  returnAmount: number = 0
): number => {
  const net = subtotal - damagesAmount - returnAmount;
  return Math.max(0, net); // Ensure not negative
};

/**
 * Calculate remaining balance after payment
 */
export const calculateRemainingBalance = (
  netReceivable: number,
  amountReceived: number
): number => {
  return Math.max(0, netReceivable - amountReceived);
};

// ============================================
// VALIDATION FUNCTIONS
// ============================================

/**
 * Validate mark delivered payload
 */
export const validateMarkDelivered = (
  payload: MarkDeliveredPayload,
  order: AssignedOrder
): ValidationResult => {
  const errors: string[] = [];

  // Validate amount received
  if (payload.amountReceived === undefined || payload.amountReceived === null) {
    errors.push('Amount received is required');
  } else if (typeof payload.amountReceived !== 'number') {
    errors.push('Amount received must be a number');
  } else if (payload.amountReceived < 0) {
    errors.push('Amount received cannot be negative');
  } else if (payload.amountReceived > order.netReceivable) {
    errors.push(
      `Amount received (₹${payload.amountReceived}) cannot exceed net receivable (₹${order.netReceivable})`
    );
  }

  // Validate payment mode
  if (!payload.paymentMode) {
    errors.push('Payment mode is required');
  } else if (!['cash', 'qr', 'cheque', 'credit'].includes(payload.paymentMode)) {
    errors.push('Invalid payment mode');
  }

  // Validate damages if provided
  if (payload.damages && payload.damages.length > 0) {
    payload.damages.forEach((damage, idx) => {
      if (damage.qty < 0) {
        errors.push(`Damage item ${idx + 1}: quantity cannot be negative`);
      }
      if (damage.amount < 0) {
        errors.push(`Damage item ${idx + 1}: amount cannot be negative`);
      }
    });
  }

  // Validate that damages won't exceed subtotal
  if (payload.damages) {
    const damagesTotal = calculateDamagesTotal(payload.damages);
    if (damagesTotal > order.subtotal) {
      errors.push(`Damages total (₹${damagesTotal}) cannot exceed order subtotal (₹${order.subtotal})`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate sales return payload
 */
export const validateSalesReturn = (
  payload: RecordSalesReturnPayload,
  order: AssignedOrder
): ValidationResult => {
  const errors: string[] = [];

  // Validate return type
  if (!payload.returnType) {
    errors.push('Return type (full/partial) is required');
  } else if (!['full', 'partial'].includes(payload.returnType)) {
    errors.push('Return type must be "full" or "partial"');
  }

  // Validate reason
  if (!payload.reason) {
    errors.push('Return reason is required');
  }

  // Validate items for partial return
  if (payload.returnType === 'partial') {
    if (!payload.items || payload.items.length === 0) {
      errors.push('Partial return requires at least one item');
    }

    payload.items?.forEach((item, idx) => {
      // Check qty is within delivered qty
      const deliveredQty = order.items.find(oi => oi.productId === item.productId)?.qty || 0;
      if (item.qtyReturned > deliveredQty) {
        errors.push(
          `Item ${idx + 1}: returned quantity (${item.qtyReturned}) exceeds delivered quantity (${deliveredQty})`
        );
      }
      if (item.qtyReturned <= 0) {
        errors.push(`Item ${idx + 1}: returned quantity must be greater than 0`);
      }
    });
  }

  // Validate full return doesn't have items (or has all items)
  if (payload.returnType === 'full' && payload.items && payload.items.length > 0) {
    // For full return, verify all items are being returned in full qty
    payload.items.forEach((item, idx) => {
      const deliveredQty = order.items.find(oi => oi.productId === item.productId)?.qty || 0;
      if (item.qtyReturned !== deliveredQty) {
        errors.push(
          `Item ${idx + 1}: for full return, all quantities must match delivered amounts`
        );
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate delay payload
 */
export const validateDelay = (payload: RecordDelayPayload): ValidationResult => {
  const errors: string[] = [];

  // Validate reason
  if (!payload.reason) {
    errors.push('Delay reason is required');
  }

  // Validate rescheduled date
  if (!payload.rescheduledDate) {
    errors.push('Rescheduled date is required');
  } else {
    const rescheduledDate = new Date(payload.rescheduledDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (rescheduledDate < today) {
      errors.push('Rescheduled date cannot be in the past');
    }

    // Check if date is not too far in the future (max 7 days)
    const maxDate = new Date(today);
    maxDate.setDate(maxDate.getDate() + 7);
    if (rescheduledDate > maxDate) {
      errors.push('Rescheduled date cannot be more than 7 days from today');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Format currency with Indian format (₹)
 */
export const formatCurrency = (amount: number): string => {
  return `₹${amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
};

/**
 * Format date to readable format
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

/**
 * Calculate payment status badge
 */
export const getPaymentStatusBadge = (order: AssignedOrder): string => {
  if (!order.payment) return 'pending';
  if (order.payment.amountReceived >= order.netReceivable) return 'paid';
  return 'partial';
};

/**
 * Get status color for UI
 */
export const getStatusColor = (status: string): string => {
  const colorMap: Record<string, string> = {
    assigned: 'bg-blue-50 text-blue-700 border-blue-200',
    out_for_delivery: 'bg-amber-50 text-amber-700 border-amber-200',
    delivered: 'bg-green-50 text-green-700 border-green-200',
    partially_returned: 'bg-orange-50 text-orange-700 border-orange-200',
    fully_returned: 'bg-red-50 text-red-700 border-red-200',
    delayed: 'bg-purple-50 text-purple-700 border-purple-200',
    failed: 'bg-red-50 text-red-700 border-red-200',
  };
  return colorMap[status] || 'bg-gray-50 text-gray-700 border-gray-200';
};

/**
 * Get readable status label
 */
export const getStatusLabel = (status: string): string => {
  const labelMap: Record<string, string> = {
    assigned: 'Assigned',
    out_for_delivery: 'Out for Delivery',
    delivered: 'Delivered',
    partially_returned: 'Partially Returned',
    fully_returned: 'Fully Returned',
    delayed: 'Delayed',
    failed: 'Failed',
  };
  return labelMap[status] || status;
};

/**
 * Get payment mode icon/label
 */
export const getPaymentModeLabel = (mode: string): string => {
  const modeMap: Record<string, string> = {
    cash: '💵 Cash',
    qr: '📱 QR Code',
    cheque: '📄 Cheque',
    credit: '💳 Credit',
  };
  return modeMap[mode] || mode;
};

/**
 * Generate unique activity ID
 */
export const generateActivityId = (): string => {
  return `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Get damage type emoji/label
 */
export const getDamageTypeLabel = (type: string): string => {
  const typeMap: Record<string, string> = {
    broken: '🔨 Broken',
    expired: '⏰ Expired',
    spoiled: '🚫 Spoiled',
    leaking: '💧 Leaking',
    wrong_item: '❌ Wrong Item',
    other: '❓ Other',
  };
  return typeMap[type] || type;
};

/**
 * Get delay reason label
 */
export const getDelayReasonLabel = (reason: string): string => {
  const reasonMap: Record<string, string> = {
    customer_not_available: 'Customer Not Available',
    address_not_found: 'Address Not Found',
    payment_pending: 'Payment Pending',
    delivery_slot_full: 'Delivery Slot Full',
    customer_request: 'Customer Request',
    vehicle_issue: 'Vehicle Issue',
    traffic: 'Traffic',
    other: 'Other',
  };
  return reasonMap[reason] || reason;
};

// ============================================
// STATE CALCULATION FUNCTIONS
// ============================================

/**
 * Calculate order summary from current state
 */
export const calculateOrderSummary = (order: AssignedOrder) => {
  const subtotal = order.subtotal;
  const damagesAmount = calculateDamagesTotal(order.damages?.items);
  const returnAmount = order.salesReturn ? calculateReturnTotal(order.salesReturn.items) : 0;
  const netReceivable = calculateNetReceivable(subtotal, damagesAmount, returnAmount);
  const amountReceived = order.payment?.amountReceived || 0;
  const remainingBalance = calculateRemainingBalance(netReceivable, amountReceived);

  return {
    subtotal,
    damagesAmount,
    returnAmount,
    netReceivable,
    amountReceived,
    remainingBalance,
  };
};

/**
 * Check if order can be delivered (validation pre-check)
 */
export const canOrderBeDelivered = (order: AssignedOrder): boolean => {
  return ['assigned', 'out_for_delivery'].includes(order.status);
};

/**
 * Check if order can have return recorded
 */
export const canOrderHaveReturnRecorded = (order: AssignedOrder): boolean => {
  return ['assigned', 'out_for_delivery', 'delivered'].includes(order.status);
};

/**
 * Check if order can be delayed
 */
export const canOrderBeDelayed = (order: AssignedOrder): boolean => {
  return ['assigned', 'out_for_delivery'].includes(order.status);
};

/**
 * Check if order can have damages recorded
 */
export const canOrderHaveDamagesRecorded = (order: AssignedOrder): boolean => {
  return ['out_for_delivery', 'delivered'].includes(order.status);
};
