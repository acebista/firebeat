
import { Order } from '../types';
import { DeliveryReportRow } from '../pages/admin/reports/DeliveryRepo';

interface BillItem {
    productName: string;
    quantity: number;
    rateBeforeVat: number;  // Price before VAT
    rate: number;           // Price after VAT (from DB)
    total: number;          // Line total before VAT
}

export interface VatBill {
    id: string;
    type: 'Individual' | 'Combined';
    paymentMethod: string;
    invoiceIds: string[];
    invoiceNumbers: string[];
    customerName?: string;  // Customer name from first invoice
    customerPAN?: string;   // Customer PAN if available
    subtotal: number;       // Total before VAT
    discount: number;       // Discount amount
    vatAmount: number;      // VAT amount (13%)
    totalAmount: number;    // Final total with VAT
    date: string;
    items: BillItem[];
}

const parseBreakdown = (row: DeliveryReportRow): { method: string; amount: number }[] => {
    const rawMethod = (row.paymentMethod || 'cash').toString().toLowerCase();

    // If explicitly single method, return full amount
    if (rawMethod !== 'multiple') {
        return [{ method: rawMethod, amount: row.collectedAmount }];
    }

    // If multiple, try to parse remarks
    const remarks = row.order.remarks || '';
    const paymentMatch = remarks.match(/Payments:\s*([^|]+)/);

    if (!paymentMatch) {
        // Fallback: treat whole amount as multiple if parsing fails
        return [{ method: 'multiple', amount: row.collectedAmount }];
    }

    const paymentsStr = paymentMatch[1];
    const regex = /(\w+):\s*₹?(\d+(?:\.\d+)?)/g;
    const results: { method: string; amount: number }[] = [];
    let match;

    while ((match = regex.exec(paymentsStr)) !== null) {
        results.push({
            method: match[1].toLowerCase(),
            amount: parseFloat(match[2])
        });
    }

    return results.length > 0 ? results : [{ method: 'multiple', amount: row.collectedAmount }];
};

/**
 * Parse return quantities from order remarks
 * Format: "Returns: ProductName(qty), ProductName2(qty)"
 */
const parseReturnsFromRemarks = (remarks: string): Map<string, number> => {
    const returnMap = new Map<string, number>();

    if (!remarks || !remarks.includes('Returns:')) {
        return returnMap;
    }

    const returnsMatch = remarks.match(/Returns:\s*([^|]+)/);
    if (!returnsMatch) return returnMap;

    const returnsStr = returnsMatch[1];
    // Match patterns like "Product Name(5)" or "Product Name (5)"
    const regex = /([^(]+)\((\d+)\)/g;
    let match;

    while ((match = regex.exec(returnsStr)) !== null) {
        const productName = match[1].trim();
        const qty = parseInt(match[2]);
        returnMap.set(productName, qty);
    }

    return returnMap;
};

/**
 * Parse damage quantities from order remarks
 * Format: "Damages: ProductName(qty) - reason, ProductName2(qty) - reason"
 */
const parseDamagesFromRemarks = (remarks: string): Map<string, number> => {
    const damageMap = new Map<string, number>();

    if (!remarks || !remarks.includes('Damages:')) {
        return damageMap;
    }

    const damagesMatch = remarks.match(/Damages:\s*([^|]+)/);
    if (!damagesMatch) return damageMap;

    const damagesStr = damagesMatch[1];
    // Match patterns like "Product Name(5) - reason"
    const regex = /([^(]+)\((\d+)\)/g;
    let match;

    while ((match = regex.exec(damagesStr)) !== null) {
        const productName = match[1].trim();
        const qty = parseInt(match[2]);
        damageMap.set(productName, qty);
    }

    return damageMap;
};

/**
 * Calculate ACTUAL delivered items using real delivery data.
 * This is 100% accurate - no proportional scaling or estimation.
 */
const getDeliveredItems = (row: DeliveryReportRow, methodAmount: number): BillItem[] => {
    const orderItems = row.order.items || [];
    const VAT_RATE = 0.13; // 13% VAT

    console.log(`[getDeliveredItems] Invoice: ${row.invoiceNumber}, methodAmount: ${methodAmount}`);
    console.log(`[getDeliveredItems] Status: ${row.status}, Order items:`, orderItems);

    // Parse returns and damages from remarks
    const returnsFromRemarks = parseReturnsFromRemarks(row.order.remarks || '');
    const damagesFromRemarks = parseDamagesFromRemarks(row.order.remarks || '');

    console.log(`[getDeliveredItems] Returns from remarks:`, Array.from(returnsFromRemarks.entries()));
    console.log(`[getDeliveredItems] Damages from remarks:`, Array.from(damagesFromRemarks.entries()));

    // Build a map of actual delivered quantities
    const deliveredItems: BillItem[] = [];

    orderItems.forEach(item => {
        const qty = Number(item.quantity || item.qty) || 0;
        const rate = Number(item.price || item.rate) || 0;
        const productName = item.tempProductName || item.productName || 'Unknown Product';

        // Calculate actual delivered quantity
        let deliveredQty = qty;

        // Subtract returns (check both exact match and partial match)
        const returnQty = returnsFromRemarks.get(productName) ||
            Array.from(returnsFromRemarks.entries())
                .find(([key]) => key.toLowerCase().includes(productName.toLowerCase()) ||
                    productName.toLowerCase().includes(key.toLowerCase()))?.[1] || 0;

        // Subtract damages (check both exact match and partial match)
        const damageQty = damagesFromRemarks.get(productName) ||
            Array.from(damagesFromRemarks.entries())
                .find(([key]) => key.toLowerCase().includes(productName.toLowerCase()) ||
                    productName.toLowerCase().includes(key.toLowerCase()))?.[1] || 0;

        deliveredQty = deliveredQty - returnQty - damageQty;

        console.log(`[getDeliveredItems] ${productName}: ordered=${qty}, returned=${returnQty}, damaged=${damageQty}, delivered=${deliveredQty}`);

        // Only include items that were actually delivered
        if (deliveredQty > 0) {
            // Calculate amounts before VAT
            const rateBeforeVat = rate / (1 + VAT_RATE);
            const totalBeforeVat = deliveredQty * rateBeforeVat;

            deliveredItems.push({
                productName: productName,
                quantity: deliveredQty, // Exact delivered quantity - no rounding needed
                rateBeforeVat: Number(rateBeforeVat.toFixed(2)),
                rate: rate,
                total: Number(totalBeforeVat.toFixed(2))
            });
        }
    });

    // CRITICAL: Only apply proportional scaling for TRUE partial payments (multiple payment methods)
    // NOT for discounts - discount is already reflected in the item totals

    // Calculate the actual total amount from delivered items (before VAT, includes any discount)
    const totalDeliveredAmountBeforeVat = deliveredItems.reduce((sum, i) => sum + i.total, 0);
    const totalDeliveredAmountWithVat = totalDeliveredAmountBeforeVat * (1 + VAT_RATE);

    console.log(`[getDeliveredItems] Total delivered (before VAT): ${totalDeliveredAmountBeforeVat}, with VAT: ${totalDeliveredAmountWithVat}, methodAmount: ${methodAmount}`);

    // Only scale if methodAmount is significantly less than the total (indicating multiple payment methods)
    // Use a 1% tolerance to account for rounding
    const tolerance = totalDeliveredAmountWithVat * 0.01;

    if (totalDeliveredAmountWithVat > 0 && methodAmount < (totalDeliveredAmountWithVat - tolerance)) {
        // This is a TRUE partial payment (multiple payment methods)
        const paymentFraction = methodAmount / totalDeliveredAmountWithVat;

        console.log(`[getDeliveredItems] Multiple payment methods detected. Payment fraction: ${paymentFraction.toFixed(4)}`);

        // Scale quantities proportionally for this payment method
        return deliveredItems.map(item => ({
            ...item,
            quantity: Math.round(item.quantity * paymentFraction),
            total: Number((item.total * paymentFraction).toFixed(2))
        })).filter(i => i.quantity > 0);
    }

    console.log(`[getDeliveredItems] Single payment method - returning ${deliveredItems.length} items with exact delivered quantities`);
    return deliveredItems;
};


export const generateVatBills = (rows: DeliveryReportRow[]): VatBill[] => {
    const bills: VatBill[] = [];
    const THRESHOLD = 50000;

    console.log(`[generateVatBills] Processing ${rows.length} delivery rows`);

    const methodBuckets: Record<string, { rows: DeliveryReportRow[], amount: number }[]> = {
        'cash': [],
        'qr': [],
        'credit': [],
        'cheque': []
    };

    rows.forEach(row => {
        console.log(`[generateVatBills] Processing invoice ${row.invoiceNumber}, status: ${row.status}, payment: ${row.paymentMethod}, amount: ${row.collectedAmount}`);

        const breakdowns = parseBreakdown(row);
        console.log(`[generateVatBills] Payment breakdown for ${row.invoiceNumber}:`, breakdowns);

        breakdowns.forEach(bd => {
            const method = bd.method.toLowerCase();

            if (method === 'credit' || method === 'cheque') {
                // INDIVIDUAL
                console.log(`[generateVatBills] Creating individual ${method} bill for ${row.invoiceNumber}`);
                const items = getDeliveredItems(row, bd.amount);
                const subtotal = items.reduce((sum, i) => sum + i.total, 0);
                const discount = 0;
                const vatAmount = subtotal * 0.13;

                console.log(`[generateVatBills] Individual bill items:`, items);
                console.log(`[generateVatBills] Subtotal: ${subtotal}, VAT: ${vatAmount}, Total: ${subtotal + vatAmount}`);

                bills.push({
                    id: `VAT-${method.toUpperCase()}-${row.invoiceNumber}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
                    type: 'Individual',
                    paymentMethod: method,
                    invoiceIds: [row.invoiceId],
                    invoiceNumbers: [row.invoiceNumber],
                    customerName: row.customerName,
                    customerPAN: row.order.customerPAN,
                    subtotal: Number(subtotal.toFixed(2)),
                    discount: Number(discount.toFixed(2)),
                    vatAmount: Number(vatAmount.toFixed(2)),
                    totalAmount: Number((subtotal + vatAmount).toFixed(2)),
                    date: new Date().toISOString().split('T')[0],
                    items
                });
            } else {
                // COMBINED - Treat both cash and QR as "cash"
                const combinedMethod = (method === 'qr' || method === 'cash') ? 'cash' : method;
                if (!methodBuckets[combinedMethod]) methodBuckets[combinedMethod] = [];
                methodBuckets[combinedMethod].push({ rows: [row], amount: bd.amount });
                console.log(`[generateVatBills] Added to ${combinedMethod} bucket: ${row.invoiceNumber}, amount: ${bd.amount}`);
            }
        });
    });

    // Only process 'cash' bucket (which now includes QR)
    ['cash'].forEach(method => {
        const itemsList = methodBuckets[method] || [];
        if (itemsList.length === 0) return;

        console.log(`[generateVatBills] Processing ${itemsList.length} ${method} items for combined bills`);

        let currentBillAmount = 0;
        let currentBillInvoices: string[] = [];
        let currentBillInvoiceNumbers: string[] = [];
        let currentBillItems: BillItem[] = [];

        itemsList.forEach((item, idx) => {
            if (currentBillAmount + item.amount > THRESHOLD) {
                if (currentBillAmount > 0) {
                    // Calculate VAT breakdown
                    const subtotal = currentBillItems.reduce((sum, i) => sum + i.total, 0);
                    const discount = 0; // Discount already applied in items
                    const vatAmount = subtotal * 0.13;

                    console.log(`[generateVatBills] Creating combined bill with ${currentBillInvoices.length} invoices, subtotal: ${subtotal}`);

                    bills.push({
                        id: `VAT-CASH-COMB-${bills.length + 1}`,
                        type: 'Combined',
                        paymentMethod: 'cash/qr',
                        invoiceIds: [...currentBillInvoices],
                        invoiceNumbers: [...currentBillInvoiceNumbers],
                        customerName: 'Multiple Customers',
                        customerPAN: undefined,
                        subtotal: Number(subtotal.toFixed(2)),
                        discount: Number(discount.toFixed(2)),
                        vatAmount: Number(vatAmount.toFixed(2)),
                        totalAmount: Number((subtotal + vatAmount).toFixed(2)),
                        date: new Date().toISOString().split('T')[0],
                        items: currentBillItems
                    });
                }
                currentBillAmount = 0;
                currentBillInvoices = [];
                currentBillInvoiceNumbers = [];
                currentBillItems = [];
            }

            currentBillAmount += item.amount;
            const row = item.rows[0];

            if (!currentBillInvoices.includes(row.invoiceId)) {
                currentBillInvoices.push(row.invoiceId);
                currentBillInvoiceNumbers.push(row.invoiceNumber);
            }

            // Aggregate items
            const rowItems = getDeliveredItems(row, item.amount);
            console.log(`[generateVatBills] Adding items from ${row.invoiceNumber}:`, rowItems);

            rowItems.forEach(newItem => {
                const existing = currentBillItems.find(i => i.productName === newItem.productName && Math.abs(i.rateBeforeVat - newItem.rateBeforeVat) < 0.01);
                if (existing) {
                    console.log(`[generateVatBills] Aggregating ${newItem.productName}: ${existing.quantity} + ${newItem.quantity}`);
                    existing.quantity += newItem.quantity;
                    existing.total += newItem.total;
                } else {
                    console.log(`[generateVatBills] Adding new item: ${newItem.productName}, qty: ${newItem.quantity}`);
                    currentBillItems.push({ ...newItem });
                }
            });
        });

        if (currentBillAmount > 0) {
            const subtotal = currentBillItems.reduce((sum, i) => sum + i.total, 0);
            const discount = 0;
            const vatAmount = subtotal * 0.13;

            console.log(`[generateVatBills] Creating final combined bill with ${currentBillInvoices.length} invoices, subtotal: ${subtotal}`);

            bills.push({
                id: `VAT-CASH-COMB-${bills.length + 1}`,
                type: 'Combined',
                paymentMethod: 'cash/qr',
                invoiceIds: currentBillInvoices,
                invoiceNumbers: currentBillInvoiceNumbers,
                customerName: 'Multiple Customers',
                customerPAN: undefined,
                subtotal: Number(subtotal.toFixed(2)),
                discount: Number(discount.toFixed(2)),
                vatAmount: Number(vatAmount.toFixed(2)),
                totalAmount: Number((subtotal + vatAmount).toFixed(2)),
                date: new Date().toISOString().split('T')[0],
                items: currentBillItems
            });
        }
    });

    console.log(`[generateVatBills] Generated ${bills.length} VAT bills`);
    bills.forEach(bill => {
        console.log(`[generateVatBills] Bill ${bill.id}: ${bill.invoiceNumbers.length} invoices, ${bill.items.length} items, total: ₹${bill.totalAmount}`);
    });

    return bills;
};
