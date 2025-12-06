/**
 * Delivery Order Management Types
 * Extended types for handling order fulfillment on delivery
 * Includes payment capture, damages, returns, and delays
 */

// ============================================
// PAYMENT RELATED TYPES
// ============================================

export type PaymentMode = 'cash' | 'qr' | 'cheque' | 'credit';

export interface PaymentDetails {
  amountReceived: number;      // Amount paid by customer
  paymentMode: PaymentMode;    // How payment was received
  reference?: string;          // Cheque number, transaction ID, etc.
  notes?: string;              // Additional notes
  capturedAt: string;          // ISO timestamp
  capturedByUserId: string;    // Delivery person who captured
}

// ============================================
// DAMAGES RELATED TYPES
// ============================================

export type DamageType = 'broken' | 'expired' | 'spoiled' | 'leaking' | 'wrong_item' | 'other';

export interface DamagedItem {
  productId: string;
  productName: string;
  qty: number;                 // Quantity of damaged items
  damageType: DamageType;      // Type of damage
  amount: number;              // Damage value (qty * rate)
  notes?: string;              // Damage description
}

export interface DamagesDeduction {
  items: DamagedItem[];
  totalDamagesAmount: number;  // Sum of all damaged items
  recordedAt: string;          // ISO timestamp
  recordedByUserId: string;    // Delivery person who recorded
}

// ============================================
// SALES RETURN RELATED TYPES
// ============================================

export type ReturnType = 'full' | 'partial';
export type ReturnReason =
  | 'customer_rejected'
  | 'quality_issue'
  | 'expiry_issue'
  | 'wrong_item'
  | 'price_negotiation'
  | 'overstock'
  | 'other';

export interface ReturnedItem {
  productId: string;
  productName: string;
  qtyDelivered: number;        // Original qty in delivery
  qtyReturned: number;         // Qty being returned
  rate: number;                // Rate per unit
  returnAmount: number;        // qtyReturned * rate (refund amount)
}

export interface SalesReturnDetails {
  returnType: ReturnType;                    // Full or Partial
  reason: ReturnReason;                      // Why return happened
  items: ReturnedItem[];                     // Items being returned
  totalReturnAmount: number;                 // Total refund amount
  notes?: string;                            // Additional notes
  recordedAt: string;                        // ISO timestamp
  recordedByUserId: string;                  // Delivery person who recorded
}

// ============================================
// DELAY RELATED TYPES
// ============================================

export type DelayReason =
  | 'customer_not_available'
  | 'address_not_found'
  | 'payment_pending'
  | 'delivery_slot_full'
  | 'customer_request'
  | 'vehicle_issue'
  | 'traffic'
  | 'other';

export interface DelayDetails {
  reason: DelayReason;         // Why delivery was delayed
  rescheduledDate: string;     // ISO date for rescheduled delivery
  notes?: string;              // Additional context
  recordedAt: string;          // ISO timestamp
  recordedByUserId: string;    // Delivery person who recorded
}

// ============================================
// ORDER ACTIVITY TIMELINE
// ============================================

export type ActivityAction =
  | 'assigned'
  | 'out_for_delivery'
  | 'delivered'
  | 'delivery_attempted'
  | 'sales_return_created'
  | 'delay_recorded'
  | 'damage_recorded'
  | 'payment_captured';

export interface OrderActivity {
  id?: string;
  action: ActivityAction;      // What action was taken
  performedByUserId: string;   // Who performed it
  performedByUserName: string; // Display name
  timestamp: string;           // ISO timestamp
  description?: string;        // Human-readable description
  metadata?: Record<string, any>; // Additional context
}

// ============================================
// EXTENDED ORDER STATUS
// ============================================

export type AssignedOrderStatus =
  | 'assigned'              // Order assigned to delivery person
  | 'out_for_delivery'      // Currently being delivered
  | 'delivered'             // Successfully delivered with payment
  | 'partially_returned'    // Some items returned
  | 'fully_returned'        // All items returned
  | 'delayed'               // Delivery delayed to next day
  | 'failed';               // Delivery attempt failed

// ============================================
// COMPOSITE DELIVERY ORDER
// ============================================

export interface AssignedOrder {
  id: string;
  orderId: string;                      // Reference to main order
  customerId: string;
  customerName: string;
  customerPhone?: string;               // For contact
  customerAddress?: string;             // Delivery address
  
  // Order items & amounts
  items: OrderItemForDelivery[];
  subtotal: number;                     // Sum of item values
  
  // Derived financial fields
  damages?: DamagesDeduction;           // Deducted from receivable
  salesReturn?: SalesReturnDetails;     // Refund amount
  netReceivable: number;                // subtotal - damages - returnAmount
  payment?: PaymentDetails;             // Payment info when delivered
  
  // Status tracking
  status: AssignedOrderStatus;
  delay?: DelayDetails;                 // If delayed
  
  // Audit fields
  assignedToUserId: string;             // Delivery person ID
  assignedToUserName: string;           // Display name
  assignedDate: string;                 // ISO date
  
  // Timeline
  activities?: OrderActivity[];         // Action history
  
  // Metadata
  tripId?: string;                      // If part of trip
  createdAt: string;
  updatedAt: string;
}

export interface OrderItemForDelivery {
  productId: string;
  productName: string;
  companyName?: string;
  qty: number;              // Delivery qty (may differ from ordered if return)
  rate: number;             // Per unit rate
  total: number;            // qty * rate
}

// ============================================
// API PAYLOAD TYPES
// ============================================

/**
 * Payload for marking order as delivered
 */
export interface MarkDeliveredPayload {
  orderId: string;
  amountReceived: number;               // Validation: 0 <= amount <= netReceivable
  paymentMode: PaymentMode;             // Required
  paymentReference?: string;            // Optional
  damages?: DamagedItem[];              // Optional damages
  notes?: string;
}

/**
 * Payload for recording sales return
 */
export interface RecordSalesReturnPayload {
  orderId: string;
  returnType: ReturnType;               // 'full' or 'partial'
  reason: ReturnReason;
  items: ReturnedItem[];                // For partial, specify what's returned
  notes?: string;
}

/**
 * Payload for recording order delay
 */
export interface RecordDelayPayload {
  orderId: string;
  reason: DelayReason;
  rescheduledDate: string;              // ISO date format
  notes?: string;
}

/**
 * Response from delivery order mutations
 */
export interface DeliveryMutationResponse {
  success: boolean;
  message: string;
  order?: AssignedOrder;
  errors?: string[];
}

// ============================================
// VALIDATION RESULT
// ============================================

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// ============================================
// FILTERS FOR LIST VIEW
// ============================================

export interface DeliveryOrderFilters {
  status?: AssignedOrderStatus[];
  customerId?: string;
  dateFrom?: string;
  dateTo?: string;
  paymentStatus?: 'pending' | 'received' | 'partial';
}

// ============================================
// SUMMARY STATISTICS
// ============================================

export interface DeliveryDayStats {
  totalAssigned: number;
  outForDelivery?: number;
  delivered: number;
  returns: number;
  delayed: number;
  failed?: number;
  totalValue: number;
  totalReceived?: number;
  totalPending?: number;
}
