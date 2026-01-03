
import { Order } from '../types';
import { DeliveryReportRow } from '../pages/admin/reports/DeliveryRepo';

interface BillItem {
    productName: string;
    quantity: number;
    rateBeforeVat: number;  // Price before VAT
    rate: number;           // Price after VAT (from DB)
    total: number;          // Line total before VAT (qty * rateBeforeVat)
}

export interface VatBill {
    id: string;
    type: 'Individual' | 'Combined';
    paymentMethod: string;
    invoiceIds: string[];
    invoiceNumbers: string[];
    customerName?: string;
    customerPAN?: string;
    subtotal: number;       // Sum of all items (Pre-tax)
    discount: number;       // Pre-tax discount to reach target totalAmount
    vatAmount: number;      // 13% of (subtotal - discount)
    totalAmount: number;    // Exactly equal to total collected (Post-tax)
    date: string;
    items: BillItem[];
}

export const parseReturnsFromRemarks = (remarks: string): Map<string, number> => {
    const returnMap = new Map<string, number>();
    if (!remarks || !remarks.includes('Returns:')) return returnMap;
    const match = remarks.match(/Returns:\s*([^|]+)/);
    if (!match) return returnMap;

    const parts = match[1].split(',').map(p => p.trim());
    parts.forEach(part => {
        const m = part.match(/(.+)\((\d+)\)/);
        if (m) returnMap.set(m[1].trim(), parseInt(m[2]));
    });
    return returnMap;
};

export const parseDamagesFromRemarks = (remarks: string): Map<string, number> => {
    const damageMap = new Map<string, number>();
    if (!remarks || !remarks.includes('Damages:')) return damageMap;
    const match = remarks.match(/Damages:\s*([^|]+)/);
    if (!match) return damageMap;

    const parts = match[1].split(',').map(p => p.trim());
    parts.forEach(part => {
        const m = part.match(/(.+)\((\d+)\)/);
        if (m) damageMap.set(m[1].trim(), parseInt(m[2]));
    });
    return damageMap;
};

const getDeliveredItemsForRow = (
    row: DeliveryReportRow,
    globalReturns: Map<string, number>,
    globalDamages: Map<string, number>
): { items: BillItem[], grossAmount: number } => {
    const VAT_RATE = 0.13;
    const orderItems = row.order.items || [];

    const items: BillItem[] = [];
    let grossAmount = 0;

    const findAndSubtractQty = (map: Map<string, number>, targetName: string, requestedQty: number): number => {
        const normTarget = targetName.toLowerCase().trim();
        let totalSubtracted = 0;
        let stillNeeded = requestedQty;

        // Try exact/partial matches in the map
        for (const [key, val] of map.entries()) {
            const kNorm = key.toLowerCase().trim();
            if (kNorm === normTarget || kNorm.includes(normTarget) || normTarget.includes(kNorm)) {
                const canTake = Math.min(val, stillNeeded);
                if (canTake > 0) {
                    map.set(key, val - canTake);
                    totalSubtracted += canTake;
                    stillNeeded -= canTake;
                }
            }
            if (stillNeeded <= 0) break;
        }
        return totalSubtracted;
    };

    orderItems.forEach(item => {
        const name = item.tempProductName || item.productName || 'Unknown';
        const qty = Number(item.quantity || item.qty) || 0;
        const rate = Number(item.price || item.rate) || 0;

        const retQty = findAndSubtractQty(globalReturns, name, qty);
        const dmgQty = findAndSubtractQty(globalDamages, name, qty - retQty);
        const delQty = Math.max(0, qty - retQty - dmgQty);

        if (delQty > 0) {
            const rateBeforeVat = rate / (1 + VAT_RATE);
            items.push({
                productName: name,
                quantity: delQty,
                rateBeforeVat: Number(rateBeforeVat.toFixed(2)),
                rate: rate,
                total: Number((delQty * rateBeforeVat).toFixed(2))
            });
            grossAmount += delQty * rate;
        }
    });

    return { items, grossAmount };
};

export const generateVatBills = (rows: DeliveryReportRow[], forcedIndividualIds: string[] = []): VatBill[] => {
    const bills: VatBill[] = [];
    const THRESHOLD = 50000;
    const VAT_RATE = 0.13;

    // 1. Create global adjustment pools for the entire set of rows
    const globalReturns = new Map<string, number>();
    const globalDamages = new Map<string, number>();

    rows.forEach(row => {
        const isDelivered = ['delivered', 'completed', 'partially_returned'].includes(row.status.toLowerCase());
        if (!isDelivered) return;

        const rowReturns = parseReturnsFromRemarks(row.order.remarks || '');
        const rowDamages = parseDamagesFromRemarks(row.order.remarks || '');

        // Only include returns/damages for products that were actually in this invoice
        const orderItemNames = new Set((row.order.items || []).map(i =>
            (i.tempProductName || i.productName || '').toLowerCase().trim()
        ));

        rowReturns.forEach((qty, name) => {
            const normName = name.toLowerCase().trim();
            // Basic matching: if invoice has this product name (or it's a partial match)
            const hasProduct = Array.from(orderItemNames).some(oname =>
                oname === normName || oname.includes(normName) || normName.includes(oname)
            );

            if (hasProduct) {
                globalReturns.set(name, (globalReturns.get(name) || 0) + qty);
            }
        });

        rowDamages.forEach((qty, name) => {
            const normName = name.toLowerCase().trim();
            const hasProduct = Array.from(orderItemNames).some(oname =>
                oname === normName || oname.includes(normName) || normName.includes(oname)
            );

            if (hasProduct) {
                globalDamages.set(name, (globalDamages.get(name) || 0) + qty);
            }
        });
    });

    let combinedItems: BillItem[] = [];
    let combinedInvoices: string[] = [];
    let combinedNumbers: string[] = [];
    let combinedTargetCollection = 0;

    const flushCombined = () => {
        if (combinedTargetCollection <= 0) return;

        const subtotal = combinedItems.reduce((s, i) => s + i.total, 0);
        // Pre-tax taxable base must be target / 1.13
        const targetTaxable = combinedTargetCollection / (1 + VAT_RATE);
        const preTaxDiscount = Math.max(0, subtotal - targetTaxable);
        const vat = (subtotal - preTaxDiscount) * VAT_RATE;

        bills.push({
            id: `VAT-COMB-${bills.length + 1}`,
            type: 'Combined',
            paymentMethod: 'cash/qr',
            invoiceIds: [...combinedInvoices],
            invoiceNumbers: [...combinedNumbers],
            customerName: 'Multiple Customers',
            subtotal: Number(subtotal.toFixed(2)),
            discount: Number(preTaxDiscount.toFixed(2)),
            vatAmount: Number(vat.toFixed(2)),
            totalAmount: Number(combinedTargetCollection.toFixed(2)),
            date: new Date().toISOString().split('T')[0],
            items: [...combinedItems]
        });
        combinedItems = []; combinedInvoices = []; combinedNumbers = []; combinedTargetCollection = 0;
    };

    rows.forEach(row => {
        const isDelivered = row.status.toLowerCase() === 'delivered' || row.status.toLowerCase() === 'completed';

        // ONLY skip if net amount is non-positive (full return) or status isn't delivered
        if (row.netAmount <= 0 || !isDelivered) return;

        const method = (row.paymentMethod || 'cash').toString().toLowerCase();
        // Use the global adjustment pools
        const { items } = getDeliveredItemsForRow(row, globalReturns, globalDamages);

        // For billing purposes:
        // 1. If we have a collected amount, that's our target (matches money in hand)
        // 2. If collected is 0 (Credit), the target is the full net amount
        const targetPayment = row.collectedAmount > 0 ? row.collectedAmount : row.netAmount;

        const isCombinedCandidate =
            method !== 'cheque' &&
            method !== 'credit' &&
            !forcedIndividualIds.includes(row.invoiceId) &&
            row.collectedAmount > 0; // Credit must be individual to show full amount

        if (!isCombinedCandidate) {
            const subtotal = items.reduce((s, i) => s + i.total, 0);
            const targetTaxable = targetPayment / (1 + VAT_RATE);
            const preTaxDiscount = Math.max(0, subtotal - targetTaxable);
            const vat = (subtotal - preTaxDiscount) * VAT_RATE;

            bills.push({
                id: `VAT-INDV-${row.invoiceNumber}-${Date.now()}`,
                type: 'Individual',
                paymentMethod: method,
                invoiceIds: [row.invoiceId],
                invoiceNumbers: [row.invoiceNumber],
                customerName: row.customerName,
                customerPAN: row.order.customerPAN,
                subtotal: Number(subtotal.toFixed(2)),
                discount: Number(preTaxDiscount.toFixed(2)),
                vatAmount: Number(vat.toFixed(2)),
                totalAmount: Number(targetPayment.toFixed(2)),
                date: new Date().toISOString().split('T')[0],
                items
            });
        } else {
            if (combinedTargetCollection + targetPayment > THRESHOLD && combinedTargetCollection > 0) flushCombined();
            combinedTargetCollection += targetPayment;
            if (!combinedInvoices.includes(row.invoiceId)) {
                combinedInvoices.push(row.invoiceId);
                combinedNumbers.push(row.invoiceNumber);
            }
            items.forEach(ni => {
                const ex = combinedItems.find(i => i.productName === ni.productName && Math.abs(i.rate - ni.rate) < 0.01);
                if (ex) {
                    ex.quantity += ni.quantity;
                    ex.total += ni.total;
                } else {
                    combinedItems.push({ ...ni });
                }
            });
        }
    });

    flushCombined();
    return bills;
};
