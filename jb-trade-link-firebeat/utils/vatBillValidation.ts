import { VatBill } from './vatBilling';
import { DeliveryReportRow } from '../pages/admin/reports/DeliveryRepo';

export interface VatBillValidation {
    billId: string;
    isValid: boolean;
    errors: string[];
    warnings: string[];
    details: {
        billTotal: number;
        orderTotal: number;
        difference: number;
        itemCount: number;
        invoiceCount: number;
    };
}

/**
 * Validate that a VAT bill matches its source orders
 */
export const validateVatBill = (bill: VatBill, rows: DeliveryReportRow[]): VatBillValidation => {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Find all orders that should be in this bill
    const billOrders = rows.filter(r => bill.invoiceIds.includes(r.invoiceId));

    if (billOrders.length === 0) {
        errors.push(`No orders found for bill ${bill.id}`);
        return {
            billId: bill.id,
            isValid: false,
            errors,
            warnings,
            details: {
                billTotal: bill.totalAmount,
                orderTotal: 0,
                difference: bill.totalAmount,
                itemCount: bill.items.length,
                invoiceCount: 0
            }
        };
    }

    // Calculate expected total from orders
    let expectedTotal = 0;
    const orderItemsMap = new Map<string, number>(); // productName -> total quantity

    billOrders.forEach(row => {
        if (!row.order || !row.order.items) {
            warnings.push(`Order ${row.invoiceNumber} has no items`);
            return;
        }

        row.order.items.forEach(item => {
            const qty = Number(item.quantity || item.qty) || 0;
            const rate = Number(item.price || item.rate) || 0;
            const productName = item.tempProductName || item.productName || 'Unknown';

            // Parse returns and damages from remarks
            const remarks = row.order.remarks || '';
            let returnQty = 0;
            let damageQty = 0;

            // Simple parsing for validation
            if (remarks.includes('Returns:')) {
                const match = remarks.match(new RegExp(`${productName}\\((\\d+)\\)`, 'i'));
                if (match) returnQty = parseInt(match[1]);
            }
            if (remarks.includes('Damages:')) {
                const match = remarks.match(new RegExp(`${productName}\\((\\d+)\\)`, 'i'));
                if (match) damageQty = parseInt(match[1]);
            }

            const deliveredQty = qty - returnQty - damageQty;

            if (deliveredQty > 0) {
                const current = orderItemsMap.get(productName) || 0;
                orderItemsMap.set(productName, current + deliveredQty);
                expectedTotal += deliveredQty * rate;
            }
        });
    });

    // Validate bill items against order items
    const billItemsMap = new Map<string, number>();
    bill.items.forEach(item => {
        const current = billItemsMap.get(item.productName) || 0;
        billItemsMap.set(item.productName, current + item.quantity);
    });

    // Check for missing items
    orderItemsMap.forEach((qty, productName) => {
        const billQty = billItemsMap.get(productName) || 0;
        if (billQty === 0) {
            errors.push(`Product "${productName}" missing from bill (expected ${qty} units)`);
        } else if (Math.abs(billQty - qty) > 1) {
            warnings.push(`Product "${productName}" quantity mismatch: bill has ${billQty}, expected ${qty}`);
        }
    });

    // Check for extra items
    billItemsMap.forEach((qty, productName) => {
        if (!orderItemsMap.has(productName)) {
            warnings.push(`Product "${productName}" in bill but not in orders (${qty} units)`);
        }
    });

    // Validate totals (with VAT)
    const billTotalWithVat = bill.totalAmount;
    const expectedTotalWithVat = expectedTotal; // Orders already include VAT
    const difference = Math.abs(billTotalWithVat - expectedTotalWithVat);

    if (difference > 1) {
        errors.push(`Total amount mismatch: bill shows ₹${billTotalWithVat.toFixed(2)}, expected ₹${expectedTotalWithVat.toFixed(2)} (diff: ₹${difference.toFixed(2)})`);
    }

    return {
        billId: bill.id,
        isValid: errors.length === 0,
        errors,
        warnings,
        details: {
            billTotal: billTotalWithVat,
            orderTotal: expectedTotalWithVat,
            difference: difference,
            itemCount: bill.items.length,
            invoiceCount: billOrders.length
        }
    };
};

/**
 * Validate all VAT bills against their source orders
 */
export const validateAllVatBills = (bills: VatBill[], rows: DeliveryReportRow[]): VatBillValidation[] => {
    console.log(`[VAT Validation] Validating ${bills.length} bills against ${rows.length} orders`);

    const validations = bills.map(bill => validateVatBill(bill, rows));

    const invalidCount = validations.filter(v => !v.isValid).length;
    const warningCount = validations.filter(v => v.warnings.length > 0).length;

    console.log(`[VAT Validation] Results: ${validations.length - invalidCount} valid, ${invalidCount} invalid, ${warningCount} with warnings`);

    return validations;
};

/**
 * Generate a validation report for display
 */
export const generateValidationReport = (validations: VatBillValidation[]): string => {
    let report = '=== VAT BILL VALIDATION REPORT ===\n\n';

    const valid = validations.filter(v => v.isValid && v.warnings.length === 0);
    const withWarnings = validations.filter(v => v.isValid && v.warnings.length > 0);
    const invalid = validations.filter(v => !v.isValid);

    report += `✅ Valid: ${valid.length}\n`;
    report += `⚠️  With Warnings: ${withWarnings.length}\n`;
    report += `❌ Invalid: ${invalid.length}\n\n`;

    if (invalid.length > 0) {
        report += '--- INVALID BILLS ---\n';
        invalid.forEach(v => {
            report += `\nBill: ${v.billId}\n`;
            report += `  Total: ₹${v.details.billTotal.toFixed(2)} (Expected: ₹${v.details.orderTotal.toFixed(2)})\n`;
            report += `  Difference: ₹${v.details.difference.toFixed(2)}\n`;
            v.errors.forEach(e => report += `  ❌ ${e}\n`);
        });
    }

    if (withWarnings.length > 0) {
        report += '\n--- BILLS WITH WARNINGS ---\n';
        withWarnings.forEach(v => {
            report += `\nBill: ${v.billId}\n`;
            v.warnings.forEach(w => report += `  ⚠️  ${w}\n`);
        });
    }

    return report;
};
