
import { Order } from '../types';
import { DeliveryReportRow } from '../pages/admin/reports/DeliveryRepo';

/**
 * BillItem with IRD-compliant line-level VAT computation.
 * VAT is computed FROM ITEM VALUES, not from money collected.
 */
interface BillItem {
    productName: string;
    quantity: number;
    rate: number;           // Price after VAT (from DB, e.g., ₹113)
    rateBeforeVat: number;  // rate / 1.13 (e.g., ₹100)
    lineTaxable: number;    // qty × rateBeforeVat (Pre-tax line total)
    lineVat: number;        // qty × (rate - rateBeforeVat) (VAT for this line)
    lineGross: number;      // lineTaxable + lineVat = qty × rate
    total: number;          // Same as lineGross (Legacy compatibility)
}

export interface VatBill {
    id: string;
    type: 'Individual' | 'Combined';
    paymentMethod: string;
    invoiceIds: string[];
    invoiceNumbers: string[];
    customerName?: string;
    customerPAN?: string;
    subtotal: number;       // Σ lineTaxable (Pre-tax total)
    discount: number;       // Apportioned discount (Pre-tax)
    vatAmount: number;      // Σ lineVat (from items, NOT back-calculated)
    totalAmount: number;    // subtotal - discount + vatAmount = Final payable
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

const VAT_RATE = 0.13;

/**
 * Creates a BillItem with proper line-level VAT computation.
 * VAT is derived from item rate, NOT from money collected.
 */
const createBillItem = (productName: string, quantity: number, rate: number): BillItem => {
    const rateBeforeVat = rate / (1 + VAT_RATE);
    const lineTaxable = quantity * rateBeforeVat;
    const lineVat = quantity * (rate - rateBeforeVat);
    const lineGross = lineTaxable + lineVat; // = quantity * rate

    return {
        productName,
        quantity,
        rate,
        rateBeforeVat,
        lineTaxable,
        lineVat,
        lineGross,
        total: lineGross
    };
};

const getDeliveredItemsForRow = (
    row: DeliveryReportRow,
    globalReturns: Map<string, number>,
    globalDamages: Map<string, number>
): { items: BillItem[], grossAmount: number } => {
    const orderItems = row.order.items || [];

    const items: BillItem[] = [];
    let grossAmount = 0;

    const findAndSubtractQty = (map: Map<string, number>, targetName: string, requestedQty: number): number => {
        const normTarget = targetName.toLowerCase().trim();
        let totalSubtracted = 0;
        let stillNeeded = requestedQty;

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
            items.push(createBillItem(name, delQty, rate));
            grossAmount += delQty * rate;
        }
    });

    return { items, grossAmount };
};

const getLineKey = (name: string, rate: number) => `${name.trim()}::${rate.toFixed(2)}`;
const getSuffix = (index: number) => String.fromCharCode(65 + index);

/**
 * Aggregates items by unique productName + rate.
 * Sums quantities and recomputes line-level values.
 */
const aggregateItems = (items: BillItem[]): BillItem[] => {
    const map = new Map<string, BillItem>();
    items.forEach(item => {
        const key = getLineKey(item.productName, item.rate);
        const existing = map.get(key);
        if (existing) {
            existing.quantity += item.quantity;
            existing.lineTaxable += item.lineTaxable;
            existing.lineVat += item.lineVat;
            existing.lineGross += item.lineGross;
            existing.total = existing.lineGross;
        } else {
            map.set(key, { ...item });
        }
    });
    return Array.from(map.values());
};

/**
 * Computes invoice-level totals from line items.
 */
const computeInvoiceTotals = (items: BillItem[]) => {
    let invoiceTaxable = 0;
    let invoiceVat = 0;
    let invoiceGross = 0;

    items.forEach(item => {
        invoiceTaxable += item.lineTaxable;
        invoiceVat += item.lineVat;
        invoiceGross += item.lineGross;
    });

    return { invoiceTaxable, invoiceVat, invoiceGross };
};

/**
 * Finalizes a VAT bill using LINE-LEVEL VAT (IRD compliant).
 * 
 * @param chunkDiscount - Pre-computed discount apportioned from parent invoice
 * 
 * MATH:
 * - subtotal = Σ lineTaxable (from items)
 * - vatAmount = Σ lineVat (from items, NOT back-calculated)
 * - totalAmount = subtotal - discount + vatAmount
 */
const finalizeBill = (
    id: string,
    type: 'Individual' | 'Combined',
    paymentMethod: string,
    invoiceIds: string[],
    invoiceNumbers: string[],
    items: BillItem[],
    chunkDiscount: number,
    customerName?: string,
    customerPAN?: string
): VatBill => {
    const aggregated = aggregateItems(items);
    const { invoiceTaxable, invoiceVat } = computeInvoiceTotals(aggregated);

    // ROUND COMPONENTS FIRST - Important for IRD compliance on printed paper
    // The printed total must be exactly Σ(lineTaxable) - Discount + Σ(lineVat)
    const subtotal = Number(invoiceTaxable.toFixed(2));
    const discount = Number(chunkDiscount.toFixed(2));
    const vatAmount = Number(invoiceVat.toFixed(2));
    const totalAmount = Number((subtotal - discount + vatAmount).toFixed(2));

    return {
        id,
        type,
        paymentMethod,
        invoiceIds,
        invoiceNumbers,
        customerName,
        customerPAN,
        subtotal,
        discount,
        vatAmount,
        totalAmount,
        date: new Date().toISOString().split('T')[0],
        items: aggregated
    };
};

interface PackableChunk {
    invoiceId: string;
    invoiceNumber: string;
    items: BillItem[];
    chunkTaxable: number;
    chunkVat: number;
    chunkGross: number;
    chunkDiscount: number;
    lineKeys: Set<string>;
}

export const generateVatBills = (rows: DeliveryReportRow[], forcedIndividualIds: string[] = []): VatBill[] => {
    const bills: VatBill[] = [];
    const VALUE_LIMIT = 50000;
    const LINE_LIMIT = 10;

    // 1. Initial Pass: Parse net delivered items
    interface ParsedEntry {
        invoiceId: string;
        invoiceNumber: string;
        customerName: string;
        customerPAN?: string;
        paymentMethod: string;
        moneyCollected: number;
        items: BillItem[];
        invoiceTaxable: number;
        invoiceVat: number;
        invoiceGross: number;
        invoiceDiscount: number;
    }
    const entries: ParsedEntry[] = [];

    rows.forEach(row => {
        // Only generate VAT bills for delivered orders
        const isDelivered = row.status && ['delivered', 'completed', 'partially_returned'].includes(row.status.toLowerCase());
        if (!isDelivered) return;

        const rowReturns = parseReturnsFromRemarks(row.order?.remarks || '');
        const rowDamages = parseDamagesFromRemarks(row.order?.remarks || '');
        const { items } = getDeliveredItemsForRow(row, rowReturns, rowDamages);

        // Must have a billable amount and items
        if (row.netAmount <= 0 || items.length === 0) return;

        const aggregated = aggregateItems(items);
        const { invoiceTaxable, invoiceVat, invoiceGross } = computeInvoiceTotals(aggregated);

        // The target for this VAT bill is the collected amount
        // Shortfalls (small rounding amounts customer doesn't pay) are absorbed into discount
        const moneyCollected = row.collectedAmount > 0 ? row.collectedAmount : row.netAmount;

        // Discount = (Gross item value) - (What we actually collected)
        // This includes: 1) Regular trade discounts, 2) Shortfalls (e.g., ₹622 → ₹620)
        // The VAT bill total will equal moneyCollected
        const invoiceDiscount = Math.max(0, invoiceGross - moneyCollected);

        entries.push({
            invoiceId: row.invoiceId,
            invoiceNumber: row.invoiceNumber,
            customerName: row.customerName,
            customerPAN: row.order?.customerPAN,
            paymentMethod: (row.paymentMethod || 'cash').toString().toLowerCase(),
            moneyCollected,
            items: aggregated,
            invoiceTaxable,
            invoiceVat,
            invoiceGross,
            invoiceDiscount
        });
    });

    // 2. Processing and Packing
    const combinedToPack: PackableChunk[] = [];

    entries.forEach(entry => {
        const isIndividual = entry.paymentMethod === 'credit' || entry.paymentMethod === 'cheque' || !!entry.customerPAN || forcedIndividualIds.includes(entry.invoiceId);

        if (isIndividual) {
            // Split individual by line count limit only (INV-123-A, INV-123-B)
            if (entry.items.length <= LINE_LIMIT) {
                // No splitting needed - discount stays as computed
                bills.push(finalizeBill(
                    `VAT-INDV-${entry.invoiceId}-${Date.now()}`, 'Individual', entry.paymentMethod,
                    [entry.invoiceId], [entry.invoiceNumber], entry.items, entry.invoiceDiscount,
                    entry.customerName, entry.customerPAN
                ));
            } else {
                // Split into chunks, apportion discount proportionally
                for (let i = 0; i < entry.items.length; i += LINE_LIMIT) {
                    const chunkItems = entry.items.slice(i, i + LINE_LIMIT);
                    const { invoiceTaxable: chunkTaxable, invoiceVat: chunkVat, invoiceGross: chunkGross } = computeInvoiceTotals(chunkItems);

                    // Apportion discount: chunkDiscount = invoiceDiscount × (chunkGross / invoiceGross)
                    const chunkDiscount = entry.invoiceGross > 0
                        ? entry.invoiceDiscount * (chunkGross / entry.invoiceGross)
                        : 0;

                    const suffix = getSuffix(Math.floor(i / LINE_LIMIT));
                    bills.push(finalizeBill(
                        `VAT-INDV-${entry.invoiceId}-${suffix}-${Date.now()}`, 'Individual', entry.paymentMethod,
                        [entry.invoiceId], [`${entry.invoiceNumber}-${suffix}`], chunkItems, chunkDiscount,
                        entry.customerName, entry.customerPAN
                    ));
                }
            }
        } else {
            // Combined: Split pre-packing into chunks that obey both limits (10 lines / 50k)
            let currentItems: BillItem[] = [];
            let currentLineKeys = new Set<string>();
            let currentGross = 0;
            let suffixIdx = 0;

            const flushChunk = (isLast: boolean) => {
                if (currentItems.length === 0) return;

                const { invoiceTaxable: chunkTaxable, invoiceVat: chunkVat, invoiceGross: chunkGross } = computeInvoiceTotals(currentItems);
                const chunkDiscount = entry.invoiceGross > 0
                    ? entry.invoiceDiscount * (chunkGross / entry.invoiceGross)
                    : 0;

                combinedToPack.push({
                    invoiceId: entry.invoiceId,
                    invoiceNumber: suffixIdx === 0 && isLast ? entry.invoiceNumber : `${entry.invoiceNumber}-${getSuffix(suffixIdx++)}`,
                    items: currentItems,
                    chunkTaxable,
                    chunkVat,
                    chunkGross,
                    chunkDiscount,
                    lineKeys: currentLineKeys
                });

                currentItems = [];
                currentLineKeys = new Set();
                currentGross = 0;
            };

            entry.items.forEach((item, idx) => {
                const itemKey = getLineKey(item.productName, item.rate);
                const itemGross = item.lineGross;

                const linesFit = currentLineKeys.has(itemKey) || currentLineKeys.size < LINE_LIMIT;
                const valueFit = (currentGross + itemGross) <= VALUE_LIMIT;

                if ((!linesFit || !valueFit) && currentItems.length > 0) {
                    flushChunk(false);
                }

                // Handle single item > VALUE_LIMIT by splitting its quantity
                let remQty = item.quantity;
                while (remQty * item.rate > VALUE_LIMIT) {
                    const fitQty = Math.floor(VALUE_LIMIT / item.rate);
                    if (fitQty <= 0) break;

                    const splitItem = createBillItem(item.productName, fitQty, item.rate);
                    const splitDiscount = entry.invoiceGross > 0
                        ? entry.invoiceDiscount * (splitItem.lineGross / entry.invoiceGross)
                        : 0;

                    combinedToPack.push({
                        invoiceId: entry.invoiceId,
                        invoiceNumber: `${entry.invoiceNumber}-${getSuffix(suffixIdx++)}`,
                        items: [splitItem],
                        chunkTaxable: splitItem.lineTaxable,
                        chunkVat: splitItem.lineVat,
                        chunkGross: splitItem.lineGross,
                        chunkDiscount: splitDiscount,
                        lineKeys: new Set([itemKey])
                    });
                    remQty -= fitQty;
                }

                if (remQty > 0) {
                    const partialItem = createBillItem(item.productName, remQty, item.rate);
                    currentItems.push(partialItem);
                    currentLineKeys.add(itemKey);
                    currentGross += partialItem.lineGross;
                }
            });

            flushChunk(true);
        }
    });

    // 3. Best-Fit Dual Constraint Packing for Combined Chunks
    interface Batch {
        grossValue: number;
        invoiceIds: string[];
        invoiceNumbers: string[];
        items: BillItem[];
        totalDiscount: number;
        lineKeys: Set<string>;
    }
    const batches: Batch[] = [];

    combinedToPack.forEach(chunk => {
        let bestBatchIdx = -1;
        let minRemaining = Infinity;

        for (let i = 0; i < batches.length; i++) {
            const b = batches[i];
            const newValue = b.grossValue + chunk.chunkGross;
            const newLineKeys = new Set([...b.lineKeys, ...chunk.lineKeys]);

            if (newValue <= VALUE_LIMIT && newLineKeys.size <= LINE_LIMIT) {
                const remaining = VALUE_LIMIT - newValue;
                if (remaining < minRemaining) {
                    minRemaining = remaining;
                    bestBatchIdx = i;
                }
            }
        }

        if (bestBatchIdx !== -1) {
            const b = batches[bestBatchIdx];
            b.grossValue += chunk.chunkGross;
            b.invoiceIds.push(chunk.invoiceId);
            b.invoiceNumbers.push(chunk.invoiceNumber);
            b.items.push(...chunk.items);
            b.totalDiscount += chunk.chunkDiscount;
            chunk.lineKeys.forEach(k => b.lineKeys.add(k));
        } else {
            batches.push({
                grossValue: chunk.chunkGross,
                invoiceIds: [chunk.invoiceId],
                invoiceNumbers: [chunk.invoiceNumber],
                items: [...chunk.items],
                totalDiscount: chunk.chunkDiscount,
                lineKeys: new Set(chunk.lineKeys)
            });
        }
    });

    // Finalize Combined Batches
    batches.forEach((b, i) => {
        bills.push(finalizeBill(
            `VAT-COMB-${i + 1}-${Date.now()}`, 'Combined', 'cash/qr',
            b.invoiceIds, b.invoiceNumbers, b.items, b.totalDiscount, 'Multiple Customers'
        ));
    });

    return bills;
};

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * MATHEMATICAL INVARIANTS (IRD Compliance Proof)
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Given:
 *   - Each line: lineTaxable = qty × (rate / 1.13)
 *   - Each line: lineVat = qty × (rate - rate/1.13)
 *   - Each line: lineGross = lineTaxable + lineVat = qty × rate
 * 
 * For original invoice:
 *   - invoiceTaxable = Σ lineTaxable
 *   - invoiceVat = Σ lineVat
 *   - invoiceGross = Σ lineGross
 *   - invoiceDiscount = invoiceGross - moneyCollected
 * 
 * For each chunk:
 *   - chunkTaxable = Σ chunk.lineTaxable
 *   - chunkVat = Σ chunk.lineVat
 *   - chunkGross = Σ chunk.lineGross
 *   - chunkDiscount = invoiceDiscount × (chunkGross / invoiceGross)
 *   - chunkFinal = chunkTaxable - chunkDiscount + chunkVat
 *              = chunkGross - chunkDiscount
 *              = chunkGross - invoiceDiscount × (chunkGross / invoiceGross)
 *              = chunkGross × (1 - invoiceDiscount / invoiceGross)
 *              = chunkGross × (moneyCollected / invoiceGross)
 * 
 * INVARIANT 1: Σ(chunkVat) = invoiceVat ✓
 *   (VAT is summed from lines, not recomputed)
 * 
 * INVARIANT 2: Σ(chunkTaxable) = invoiceTaxable ✓
 *   (Taxable is summed from lines, not recomputed)
 * 
 * INVARIANT 3: Σ(chunkDiscount) = invoiceDiscount ✓
 *   (Σ invoiceDiscount × (chunkGross / invoiceGross) = invoiceDiscount × Σ(chunkGross)/invoiceGross = invoiceDiscount)
 * 
 * INVARIANT 4: Σ(chunkFinal) = moneyCollected ✓
 *   (Σ chunkGross × (moneyCollected / invoiceGross) = moneyCollected)
 * 
 * INVARIANT 5: Per-unit prices unchanged ✓
 *   (rate and rateBeforeVat copied from original item, never recalculated)
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 * TEST CASES
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Case 1: 12 distinct products @ ₹20,000 cash
 * → Split into chunks of 10 + 2 items
 * → Each chunk's VAT = Σ lineVat (not back-calculated)
 * → Discount apportioned by chunkGross / invoiceGross
 * 
 * Case 2: 8 products @ ₹60,000 cash
 * → Split by value into ≤₹50k chunks
 * → VAT preserved per-line
 * 
 * Case 3: 9 + 2 products (separate invoices)
 * → Best-fit rejects merge (11 > 10 lines)
 * → Kept in separate bills
 * 
 * Case 4: Credit invoice with 15 items
 * → INV-123-A (10 items), INV-123-B (5 items)
 * → Σ(A.vat + B.vat) = original VAT
 * → Σ(A.discount + B.discount) = original discount
 */
