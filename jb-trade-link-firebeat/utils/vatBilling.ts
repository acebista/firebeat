
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
 * Calculate actual delivered items for a row using proportional scaling.
 * Converts prices to before-VAT amounts (assuming 13% VAT rate).
 */
const getDeliveredItems = (row: DeliveryReportRow, methodAmount: number): BillItem[] => {
    const orderItems = row.order.items || [];
    const VAT_RATE = 0.13; // 13% VAT

    console.log(`[getDeliveredItems] Invoice: ${row.invoiceNumber}, methodAmount: ${methodAmount}`);
    console.log(`[getDeliveredItems] Order items:`, orderItems);

    // Calculate subtotal from items, using qty * rate if total is missing
    // Explicitly cast to Number to prevent string-math issues
    // Handle database field compatibility (quantity/price/amount vs qty/rate/total)
    const derivedSubtotal = orderItems.reduce((acc, i) => {
        const qty = Number(i.quantity || i.qty) || 0;
        const rate = Number(i.price || i.rate) || 0;
        const total = Number(i.amount || i.total) || (qty * rate);
        return acc + total;
    }, 0);

    console.log(`[getDeliveredItems] derivedSubtotal: ${derivedSubtotal}`);

    if (derivedSubtotal <= 0) {
        console.warn(`[getDeliveredItems] derivedSubtotal is 0 or negative, returning empty array`);
        return [];
    }

    // Scaling factor for partial payments/returns
    const scalingFactor = methodAmount / derivedSubtotal;

    const result = orderItems.map(item => {
        // Explicit Number casting to prevent string-math issues
        const qty = Number(item.quantity || item.qty) || 0;
        const rate = Number(item.price || item.rate) || 0;
        const total = Number(item.amount || item.total) || (qty * rate);

        const billedQty = qty * scalingFactor;

        // item.rate and item.total are AFTER VAT (from DB)
        // First scale the total, then remove VAT
        const itemTotalAfterVat = total * scalingFactor;
        const itemTotalBeforeVat = itemTotalAfterVat / (1 + VAT_RATE);
        const rateBeforeVat = rate / (1 + VAT_RATE);

        console.log(`[getDeliveredItems] Item: ${item.tempProductName || item.productName}, qty: ${qty}, rate: ${rate}, total: ${total}`);
        console.log(`[getDeliveredItems]   -> billedQty: ${billedQty}, itemTotalAfterVat: ${itemTotalAfterVat}, itemTotalBeforeVat: ${itemTotalBeforeVat}`);

        return {
            productName: item.tempProductName || item.productName || 'Unknown Product',
            quantity: Math.round(billedQty), // CRITICAL: Round to whole number to avoid decimals
            rateBeforeVat: Number(rateBeforeVat.toFixed(2)),
            rate: rate,
            total: Number(itemTotalBeforeVat.toFixed(2))
        };
    }).filter(i => i.total > 0.01);

    console.log(`[getDeliveredItems] Returning ${result.length} items`);
    return result;
};

export const generateVatBills = (rows: DeliveryReportRow[]): VatBill[] => {
    const bills: VatBill[] = [];
    const THRESHOLD = 50000;

    const methodBuckets: Record<string, { rows: DeliveryReportRow[], amount: number }[]> = {
        'cash': [],
        'qr': [],
        'credit': [],
        'cheque': []
    };

    rows.forEach(row => {
        const breakdowns = parseBreakdown(row);
        breakdowns.forEach(bd => {
            const method = bd.method.toLowerCase();

            if (method === 'credit' || method === 'cheque') {
                // INDIVIDUAL
                const items = getDeliveredItems(row, bd.amount);
                const subtotal = items.reduce((sum, i) => sum + i.total, 0);
                const discount = 0;
                const vatAmount = subtotal * 0.13;

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
            }
        });
    });

    // Only process 'cash' bucket (which now includes QR)
    ['cash'].forEach(method => {
        const itemsList = methodBuckets[method] || [];
        if (itemsList.length === 0) return;

        let currentBillAmount = 0;
        let currentBillInvoices: string[] = [];
        let currentBillInvoiceNumbers: string[] = [];
        let currentBillItems: BillItem[] = [];

        itemsList.forEach(item => {
            if (currentBillAmount + item.amount > THRESHOLD) {
                if (currentBillAmount > 0) {
                    // Calculate VAT breakdown
                    const subtotal = currentBillItems.reduce((sum, i) => sum + i.total, 0);
                    const discount = 0; // Discount already applied in items
                    const vatAmount = subtotal * 0.13;

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
            rowItems.forEach(newItem => {
                const existing = currentBillItems.find(i => i.productName === newItem.productName && Math.abs(i.rateBeforeVat - newItem.rateBeforeVat) < 0.01);
                if (existing) {
                    existing.quantity += newItem.quantity;
                    existing.total += newItem.total;
                } else {
                    currentBillItems.push({ ...newItem });
                }
            });
        });

        if (currentBillAmount > 0) {
            const subtotal = currentBillItems.reduce((sum, i) => sum + i.total, 0);
            const discount = 0;
            const vatAmount = subtotal * 0.13;

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

    return bills;
};
