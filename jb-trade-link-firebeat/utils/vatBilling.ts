
import { Order } from '../types';
import { DeliveryReportRow } from '../pages/admin/reports/DeliveryRepo';

export interface VatBill {
    id: string; // generated ID
    type: 'Individual' | 'Combined';
    paymentMethod: string;
    invoiceIds: string[];
    invoiceNumbers: string[];
    totalAmount: number;
    date: string;
    itemsFormatted?: string; // Optional: Description of what is in this bill
}

/**
 * Helper to parse payment breakdown from remarks
 * Duplicated from DeliveryRepo for utility usage, or should be exported from there.
 * For now, re-implementing to keep util standalone.
 */
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

export const generateVatBills = (rows: DeliveryReportRow[]): VatBill[] => {
    const bills: VatBill[] = [];
    const THRESHOLD = 50000;

    // Bucket for accumulation
    const methodBuckets: Record<string, { rows: DeliveryReportRow[], amount: number }[]> = {
        'cash': [],
        'qr': [],
        'credit': [],
        'cheque': []
    };

    // 1. Distribute amounts to buckets
    rows.forEach(row => {
        const breakdowns = parseBreakdown(row);
        breakdowns.forEach(bd => {
            const method = bd.method.toLowerCase();
            // Simplify method mapping if needed (e.g., 'phonepe' -> 'qr')
            // For now assuming standard keys: cash, qr, credit, cheque

            // Just push the row reference + specific amount for this method
            // We can't really split the DeliveryReportRow object easily, so we track the amount

            if (method === 'credit' || method === 'cheque') {
                // INDIVIDUAL BILLS
                bills.push({
                    id: `VAT-${method.toUpperCase()}-${row.invoiceNumber}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
                    type: 'Individual',
                    paymentMethod: method,
                    invoiceIds: [row.invoiceId],
                    invoiceNumbers: [row.invoiceNumber],
                    totalAmount: bd.amount,
                    date: new Date().toISOString().split('T')[0]
                });
            } else {
                // COMBINED BILLS (Cash / QR)
                // Initialize bucket if new method found
                if (!methodBuckets[method]) methodBuckets[method] = [];
                methodBuckets[method].push({ rows: [row], amount: bd.amount });
            }
        });
    });

    // 2. Process Cash and QR buckets
    ['cash', 'qr'].forEach(method => {
        const items = methodBuckets[method] || [];
        if (items.length === 0) return;

        let currentBillAmount = 0;
        let currentBillInvoices: string[] = [];
        let currentBillInvoiceNumbers: string[] = [];

        items.forEach(item => {
            // Check if adding this amount exceeds threshold
            if (currentBillAmount + item.amount > THRESHOLD) {
                // Finalize current bill
                if (currentBillAmount > 0) {
                    bills.push({
                        id: `VAT-${method.toUpperCase()}-COMB-${bills.length + 1}`,
                        type: 'Combined',
                        paymentMethod: method,
                        invoiceIds: [...currentBillInvoices],
                        invoiceNumbers: [...currentBillInvoiceNumbers],
                        totalAmount: currentBillAmount,
                        date: new Date().toISOString().split('T')[0]
                    });
                }

                // Reset
                currentBillAmount = 0;
                currentBillInvoices = [];
                currentBillInvoiceNumbers = [];
            }

            // Do we assume a SINGLE item > 50000? 
            // If item.amount > THRESHOLD, we technically should split it into multiple bills.
            // But per "create a combined vat bill... split into multiple", it usually means
            // chunking the total.
            // If a single transaction is > 50k, we add it alone (it will trigger the check above next loop)
            // If it's effectively > 50k by itself, we might need to split IT. 
            // For now, let's assume we just start a new bill with it, even if > 50k, 
            // unless we want to implement logic to chop up a single transaction. 
            // Let's stick to simple aggregation logic first. 

            currentBillAmount += item.amount;
            // Only add ID if not already there (though here we mapped one-to-one per split)
            if (!currentBillInvoices.includes(item.rows[0].invoiceId)) {
                currentBillInvoices.push(item.rows[0].invoiceId);
                currentBillInvoiceNumbers.push(item.rows[0].invoiceNumber);
            }
        });

        // Finalize last bill
        if (currentBillAmount > 0) {
            bills.push({
                id: `VAT-${method.toUpperCase()}-COMB-${bills.length + 1}`,
                type: 'Combined',
                paymentMethod: method,
                invoiceIds: currentBillInvoices,
                invoiceNumbers: currentBillInvoiceNumbers,
                totalAmount: currentBillAmount,
                date: new Date().toISOString().split('T')[0]
            });
        }
    });

    return bills;
};
