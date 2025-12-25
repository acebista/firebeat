
import { Order } from '../types';
import { DeliveryReportRow } from '../pages/admin/reports/DeliveryRepo';

interface BillItem {
    productName: string;
    quantity: number;
    rate: number;
    total: number;
}

export interface VatBill {
    id: string;
    type: 'Individual' | 'Combined';
    paymentMethod: string;
    invoiceIds: string[];
    invoiceNumbers: string[];
    totalAmount: number;
    date: string;
    itemsFormatted?: string;
    items: BillItem[]; // Added items array
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
 * This implicitly accounts for returns/damages by scaling down the original items
 * so that their total equals the bill amount (methodAmount).
 */
const getDeliveredItems = (row: DeliveryReportRow, methodAmount: number): BillItem[] => {
    const orderItems = row.order.items || [];

    // Calculate subtotal from items to ensure consistency
    const derivedSubtotal = orderItems.reduce((acc, i) => acc + (i.total || 0), 0);

    // Avoid division by zero
    if (derivedSubtotal <= 0) return [];

    // Scaling factor: How much of the original scope does this payment cover?
    // Formula: (ItemTotal / Subtotal) * MethodAmount
    const scalingFactor = methodAmount / derivedSubtotal;

    return orderItems.map(item => {
        // Calculate scaled quantity and total
        const billedTotal = (item.total || 0) * scalingFactor;
        const billedQty = item.qty * scalingFactor;

        return {
            productName: item.productName,
            quantity: Number(billedQty.toFixed(2)),
            rate: item.rate,
            total: Number(billedTotal.toFixed(2))
        };
    }).filter(i => i.total > 0.01); // Filter out negligible amounts
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
                bills.push({
                    id: `VAT-${method.toUpperCase()}-${row.invoiceNumber}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
                    type: 'Individual',
                    paymentMethod: method,
                    invoiceIds: [row.invoiceId],
                    invoiceNumbers: [row.invoiceNumber],
                    totalAmount: bd.amount,
                    date: new Date().toISOString().split('T')[0],
                    items: getDeliveredItems(row, bd.amount)
                });
            } else {
                // COMBINED
                if (!methodBuckets[method]) methodBuckets[method] = [];
                methodBuckets[method].push({ rows: [row], amount: bd.amount });
            }
        });
    });

    ['cash', 'qr'].forEach(method => {
        const itemsList = methodBuckets[method] || [];
        if (itemsList.length === 0) return;

        let currentBillAmount = 0;
        let currentBillInvoices: string[] = [];
        let currentBillInvoiceNumbers: string[] = [];
        let currentBillItems: BillItem[] = [];

        itemsList.forEach(item => {
            if (currentBillAmount + item.amount > THRESHOLD) {
                if (currentBillAmount > 0) {
                    bills.push({
                        id: `VAT-${method.toUpperCase()}-COMB-${bills.length + 1}`,
                        type: 'Combined',
                        paymentMethod: method,
                        invoiceIds: [...currentBillInvoices],
                        invoiceNumbers: [...currentBillInvoiceNumbers],
                        totalAmount: currentBillAmount,
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
                currentBillInvoiceNumbers.push(row.invoiceNumber); // Use number for display
            }

            // Aggregate items
            const rowItems = getDeliveredItems(row, item.amount);
            rowItems.forEach(newItem => {
                const existing = currentBillItems.find(i => i.productName === newItem.productName && Math.abs(i.rate - newItem.rate) < 0.01);
                if (existing) {
                    existing.quantity += newItem.quantity;
                    existing.total += newItem.total;
                } else {
                    currentBillItems.push({ ...newItem });
                }
            });
        });

        if (currentBillAmount > 0) {
            bills.push({
                id: `VAT-${method.toUpperCase()}-COMB-${bills.length + 1}`,
                type: 'Combined',
                paymentMethod: method,
                invoiceIds: currentBillInvoices,
                invoiceNumbers: currentBillInvoiceNumbers,
                totalAmount: currentBillAmount,
                date: new Date().toISOString().split('T')[0],
                items: currentBillItems
            });
        }
    });

    return bills;
};
