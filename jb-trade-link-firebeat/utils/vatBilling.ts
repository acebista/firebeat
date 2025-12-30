
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

const getDeliveredItemsForRow = (row: DeliveryReportRow): { items: BillItem[], grossAmount: number } => {
    const VAT_RATE = 0.13;
    const orderItems = row.order.items || [];
    const returns = parseReturnsFromRemarks(row.order.remarks || '');
    const damages = parseDamagesFromRemarks(row.order.remarks || '');

    const items: BillItem[] = [];
    let grossAmount = 0;

    orderItems.forEach(item => {
        const name = item.tempProductName || item.productName || 'Unknown';
        const qty = Number(item.quantity || item.qty) || 0;
        const rate = Number(item.price || item.rate) || 0;

        const retQty = returns.get(name) || 0;
        const dmgQty = damages.get(name) || 0;
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
        if (row.collectedAmount <= 0) return;

        const method = (row.paymentMethod || 'cash').toString().toLowerCase();
        const { items } = getDeliveredItemsForRow(row);
        const targetPayment = row.collectedAmount;

        const isCombinedCandidate = (method === 'cash' || method === 'qr') && !forcedIndividualIds.includes(row.invoiceId);

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
