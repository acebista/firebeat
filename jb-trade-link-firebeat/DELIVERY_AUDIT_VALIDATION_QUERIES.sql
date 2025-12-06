-- ============================================================================
-- DELIVERY AUDIT - VALIDATION QUERIES
-- ============================================================================
-- Run these queries to verify the data flow after deploying fixes
-- These queries validate that damages, returns, and order statuses are 
-- properly synchronized across all tables
-- ============================================================================

-- ============================================================================
-- 1. DAMAGE LOGGING VALIDATION
-- ============================================================================

-- Check if damages are being logged to damage_logs table
SELECT 
  dl.id,
  dl.productId,
  dl.productName,
  dl.companyName,
  dl.qtyPieces,
  dl.damageReason,
  dl.sourceType,
  dl.sourceInvoiceId,
  dl.createdAt,
  dl.notes
FROM damage_logs dl
WHERE dl.createdAt >= DATE_SUB(NOW(), INTERVAL 7 DAY)
ORDER BY dl.createdAt DESC
LIMIT 50;

-- Count damages by reason
SELECT 
  damageReason,
  COUNT(*) as count
FROM damage_logs
WHERE createdAt >= DATE_SUB(NOW(), INTERVAL 7 DAY)
GROUP BY damageReason
ORDER BY count DESC;

-- ============================================================================
-- 2. SALES RETURNS VALIDATION
-- ============================================================================

-- Check if returns headers are being logged
SELECT 
  r.id,
  r.invoiceId,
  r.customerId,
  r.returnType,
  r.reason,
  r.totalReturnAmount,
  r.createdByUserId,
  r.createdAt,
  COUNT(ri.id) as lineItemCount
FROM returns r
LEFT JOIN return_items ri ON r.id = ri.salesReturnId
WHERE r.createdAt >= DATE_SUB(NOW(), INTERVAL 7 DAY)
GROUP BY r.id
ORDER BY r.createdAt DESC
LIMIT 50;

-- Check return line items
SELECT 
  ri.id,
  ri.salesReturnId,
  ri.productId,
  ri.qtyInvoiced,
  ri.qtyReturned,
  ri.rate,
  ri.lineReturnAmount
FROM return_items ri
WHERE ri.createdAt >= DATE_SUB(NOW(), INTERVAL 7 DAY)
ORDER BY ri.createdAt DESC
LIMIT 50;

-- Count returns by reason
SELECT 
  reason,
  COUNT(*) as count,
  SUM(totalReturnAmount) as totalAmount
FROM returns
WHERE createdAt >= DATE_SUB(NOW(), INTERVAL 7 DAY)
GROUP BY reason
ORDER BY count DESC;

-- ============================================================================
-- 3. ORDER STATUS SYNCHRONIZATION VALIDATION
-- ============================================================================

-- Check if order statuses are being updated
SELECT 
  o.orderId,
  o.invoiceNumber,
  o.status,
  o.paymentMethod,
  o.createdAt,
  o.updatedAt
FROM orders o
WHERE o.updatedAt >= DATE_SUB(NOW(), INTERVAL 7 DAY)
  AND o.status IN ('delivered', 'returned', 'cancelled', 'delayed')
ORDER BY o.updatedAt DESC
LIMIT 50;

-- Distribution of order statuses
SELECT 
  status,
  COUNT(*) as count
FROM orders
WHERE updatedAt >= DATE_SUB(NOW(), INTERVAL 7 DAY)
GROUP BY status
ORDER BY count DESC;

-- ============================================================================
-- 4. DELIVERY ORDERS vs ORDERS SYNCHRONIZATION
-- ============================================================================

-- Check for delivery_orders that are marked as delivered but orders.status might be different
SELECT 
  do.id,
  do.orderId,
  do.status as deliveryStatus,
  o.status as orderStatus,
  o.paymentMethod,
  do.deliveredAt,
  o.updatedAt
FROM delivery_orders do
LEFT JOIN orders o ON do.orderId = o.orderId
WHERE do.status = 'delivered'
  AND o.updatedAt >= DATE_SUB(NOW(), INTERVAL 7 DAY)
ORDER BY do.deliveredAt DESC
LIMIT 50;

-- ============================================================================
-- 5. PAYMENT METHOD VALIDATION
-- ============================================================================

-- Check payment methods across delivery orders
SELECT 
  paymentMode,
  COUNT(*) as count,
  SUM(CASE WHEN paymentMode IN ('QR', 'Credit', 'Cheque') THEN 1 ELSE 0 END) as validCount
FROM delivery_orders
WHERE createdAt >= DATE_SUB(NOW(), INTERVAL 30 DAY)
GROUP BY paymentMode
ORDER BY count DESC;

-- Verify no UPI payments (should be 0)
SELECT 
  paymentMode,
  COUNT(*) as upiCount
FROM delivery_orders
WHERE paymentMode = 'UPI'
  AND createdAt >= DATE_SUB(NOW(), INTERVAL 30 DAY);

-- ============================================================================
-- 6. ACTIVITY TIMELINE VALIDATION
-- ============================================================================

-- Check if order activities are being logged correctly
SELECT 
  oa.id,
  oa.orderId,
  oa.action,
  oa.details,
  oa.createdBy,
  oa.createdAt
FROM order_activities oa
WHERE oa.createdAt >= DATE_SUB(NOW(), INTERVAL 7 DAY)
ORDER BY oa.createdAt DESC
LIMIT 50;

-- Count activities by action type
SELECT 
  action,
  COUNT(*) as count
FROM order_activities
WHERE createdAt >= DATE_SUB(NOW(), INTERVAL 7 DAY)
GROUP BY action
ORDER BY count DESC;

-- ============================================================================
-- 7. COMPREHENSIVE DATA INTEGRITY CHECKS
-- ============================================================================

-- Find delivery_orders with damages but no damage_logs entries
SELECT 
  do.id,
  do.orderId,
  JSON_EXTRACT(do.damageSummary, '$.totalDamagedQty') as totalDamagedQty,
  (SELECT COUNT(*) FROM damage_logs WHERE sourceInvoiceId = do.invoiceNumber) as damageLogsCount
FROM delivery_orders do
WHERE JSON_EXTRACT(do.damageSummary, '$.totalDamagedQty') > 0
  AND do.createdAt >= DATE_SUB(NOW(), INTERVAL 7 DAY)
HAVING damageLogsCount = 0
LIMIT 20;

-- Find delivery_orders with returns but no return entries
SELECT 
  do.id,
  do.orderId,
  JSON_EXTRACT(do.salesReturnSummary, '$.totalReturnedQty') as totalReturnedQty,
  (SELECT COUNT(*) FROM returns WHERE sourceInvoiceId = do.invoiceNumber) as returnsCount
FROM delivery_orders do
WHERE JSON_EXTRACT(do.salesReturnSummary, '$.totalReturnedQty') > 0
  AND do.createdAt >= DATE_SUB(NOW(), INTERVAL 7 DAY)
HAVING returnsCount = 0
LIMIT 20;

-- ============================================================================
-- 8. TESTING SCENARIO VALIDATION
-- ============================================================================

-- Scenario 1: Complete delivery with no issues
SELECT 
  do.id,
  do.orderId,
  'Complete Delivery' as scenario,
  o.status,
  do.status as deliveryStatus,
  o.paymentMethod
FROM delivery_orders do
LEFT JOIN orders o ON do.orderId = o.orderId
WHERE do.status = 'delivered'
  AND JSON_EXTRACT(do.damageSummary, '$.totalDamagedQty') = 0
  AND JSON_EXTRACT(do.salesReturnSummary, '$.totalReturnedQty') = 0
  AND do.createdAt >= DATE_SUB(NOW(), INTERVAL 7 DAY)
LIMIT 10;

-- Scenario 2: Delivery with damages
SELECT 
  do.id,
  do.orderId,
  'Delivery with Damages' as scenario,
  JSON_EXTRACT(do.damageSummary, '$.totalDamagedQty') as damagedQty,
  (SELECT COUNT(*) FROM damage_logs WHERE sourceInvoiceId = do.invoiceNumber) as damageLogsCount,
  o.status
FROM delivery_orders do
LEFT JOIN orders o ON do.orderId = o.orderId
WHERE JSON_EXTRACT(do.damageSummary, '$.totalDamagedQty') > 0
  AND do.createdAt >= DATE_SUB(NOW(), INTERVAL 7 DAY)
LIMIT 10;

-- Scenario 3: Delivery with returns
SELECT 
  do.id,
  do.orderId,
  'Delivery with Returns' as scenario,
  JSON_EXTRACT(do.salesReturnSummary, '$.totalReturnedQty') as returnedQty,
  (SELECT COUNT(*) FROM return_items ri 
    JOIN returns r ON ri.salesReturnId = r.id 
    WHERE r.sourceInvoiceId = do.invoiceNumber) as returnLineItemsCount,
  o.status
FROM delivery_orders do
LEFT JOIN orders o ON do.orderId = o.orderId
WHERE JSON_EXTRACT(do.salesReturnSummary, '$.totalReturnedQty') > 0
  AND do.createdAt >= DATE_SUB(NOW(), INTERVAL 7 DAY)
LIMIT 10;

-- ============================================================================
-- 9. QUICK HEALTH CHECK
-- ============================================================================

-- Run this for a quick health check after deployment
SELECT 
  'Damage Logs' as checkName,
  COUNT(*) as recordCount,
  MAX(createdAt) as latestEntry
FROM damage_logs
WHERE createdAt >= DATE_SUB(NOW(), INTERVAL 7 DAY)
UNION ALL
SELECT 
  'Returns Headers' as checkName,
  COUNT(*) as recordCount,
  MAX(createdAt) as latestEntry
FROM returns
WHERE createdAt >= DATE_SUB(NOW(), INTERVAL 7 DAY)
UNION ALL
SELECT 
  'Return Items' as checkName,
  COUNT(*) as recordCount,
  MAX(createdAt) as latestEntry
FROM return_items
WHERE createdAt >= DATE_SUB(NOW(), INTERVAL 7 DAY)
UNION ALL
SELECT 
  'Orders Updated' as checkName,
  COUNT(*) as recordCount,
  MAX(updatedAt) as latestEntry
FROM orders
WHERE updatedAt >= DATE_SUB(NOW(), INTERVAL 7 DAY)
  AND status IN ('delivered', 'returned', 'cancelled', 'delayed');

-- ============================================================================
-- 10. ERROR DETECTION QUERIES
-- ============================================================================

-- Find orphaned returns (no matching order)
SELECT 
  r.id,
  r.invoiceId,
  'No matching order' as issue
FROM returns r
LEFT JOIN orders o ON r.invoiceId = o.invoiceNumber
WHERE o.orderId IS NULL
  AND r.createdAt >= DATE_SUB(NOW(), INTERVAL 7 DAY);

-- Find orphaned damages (no matching order)
SELECT 
  dl.id,
  dl.sourceInvoiceId,
  'No matching order' as issue
FROM damage_logs dl
LEFT JOIN orders o ON dl.sourceInvoiceId = o.invoiceNumber
WHERE o.orderId IS NULL
  AND dl.createdAt >= DATE_SUB(NOW(), INTERVAL 7 DAY);

-- Find inconsistent payment methods
SELECT 
  do.id,
  do.orderId,
  do.paymentMode as deliveryPaymentMode,
  o.paymentMethod as orderPaymentMethod,
  'Mismatch' as issue
FROM delivery_orders do
LEFT JOIN orders o ON do.orderId = o.orderId
WHERE do.paymentMode != o.paymentMethod
  AND do.createdAt >= DATE_SUB(NOW(), INTERVAL 7 DAY)
  AND o.paymentMethod IS NOT NULL;
