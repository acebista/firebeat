/**
 * ============================================================================
 * UNIFIED VAT INVOICE RENDERER
 * ============================================================================
 * 
 * Single source of truth for VAT invoice PDF generation.
 * ALL paths must use this renderer:
 *   - Individual print
 *   - Combined print  
 *   - Export all
 *   - Print all
 * 
 * Format: Nepal IRD-compliant Tax Invoice
 * ============================================================================
 */

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { VatBill } from './vatBilling';

// ============================================================================
// CONFIGURATION - Company Details (Should be fetched from config in production)
// ============================================================================
const COMPANY_CONFIG = {
    name: 'JB TRADE LINK PVT. LTD.',
    address: 'Kathmandu, Nepal',
    phone: '+977-XXXXXXXXXX',
    email: 'info@jbtradelink.com',
    pan: 'XXXXXXXXX',
    vatNo: 'XXXXXXXXX'
};

// ============================================================================
// NUMBER TO WORDS CONVERTER (Nepali Rupees)
// ============================================================================
const numberToWords = (num: number): string => {
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
        'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    const convert = (n: number): string => {
        if (n < 20) return ones[n];
        if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
        if (n < 1000) return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + convert(n % 100) : '');
        if (n < 100000) return convert(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 ? ' ' + convert(n % 1000) : '');
        if (n < 10000000) return convert(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 ? ' ' + convert(n % 100000) : '');
        return convert(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 ? ' ' + convert(n % 10000000) : '');
    };

    const rupees = Math.floor(num);
    const paisa = Math.round((num - rupees) * 100);

    let result = 'Rupees ' + convert(rupees);
    if (paisa > 0) {
        result += ' and ' + convert(paisa) + ' Paisa';
    }
    result += ' Only';

    return result;
};

// ============================================================================
// RENDER SINGLE VAT INVOICE
// ============================================================================
/**
 * Renders a single VAT invoice to the PDF document at current page
 * This is the GOLD STANDARD format - identical for Individual and Combined bills
 */
export const renderVatInvoice = (doc: jsPDF, bill: VatBill, pageNumber?: number, totalPages?: number): void => {
    let y = 15;
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;
    const contentWidth = pageWidth - (margin * 2);

    // =========================================================================
    // HEADER - Company Information
    // =========================================================================
    doc.setFillColor(79, 70, 229); // Indigo
    doc.rect(0, 0, pageWidth, 35, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(COMPANY_CONFIG.name, pageWidth / 2, 12, { align: 'center' });

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(COMPANY_CONFIG.address, pageWidth / 2, 19, { align: 'center' });
    doc.text(`Phone: ${COMPANY_CONFIG.phone} | Email: ${COMPANY_CONFIG.email}`, pageWidth / 2, 24, { align: 'center' });
    doc.text(`PAN: ${COMPANY_CONFIG.pan} | VAT No: ${COMPANY_CONFIG.vatNo}`, pageWidth / 2, 29, { align: 'center' });

    // =========================================================================
    // TITLE - TAX INVOICE
    // =========================================================================
    y = 45;
    doc.setTextColor(0, 0, 0);
    doc.setFillColor(243, 244, 246);
    doc.rect(margin, y - 6, contentWidth, 12, 'F');

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('TAX INVOICE', pageWidth / 2, y, { align: 'center' });

    // =========================================================================
    // BILL INFORMATION BOX
    // =========================================================================
    y = 58;

    // Left side - Bill details
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(100, 100, 100);
    doc.text('BILL ID:', margin, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    doc.text(bill.id, margin + 25, y);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(100, 100, 100);
    doc.text('DATE:', margin, y + 6);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    doc.text(new Date(bill.date).toLocaleDateString('en-NP', { year: 'numeric', month: 'long', day: 'numeric' }), margin + 25, y + 6);

    // Right side - Payment & Type
    const rightCol = pageWidth / 2 + 10;
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(100, 100, 100);
    doc.text('PAYMENT:', rightCol, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    doc.text(bill.paymentMethod.toUpperCase(), rightCol + 30, y);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(100, 100, 100);
    doc.text('TYPE:', rightCol, y + 6);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    doc.text(bill.type, rightCol + 30, y + 6);

    // =========================================================================
    // CUSTOMER INFORMATION
    // =========================================================================
    y = 75;

    // Customer box
    doc.setFillColor(240, 253, 244); // Light green
    doc.setDrawColor(16, 185, 129); // Green border
    doc.rect(margin, y, contentWidth, bill.customerPAN ? 22 : 16, 'FD');

    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(6, 95, 70);
    doc.text('CUSTOMER DETAILS', margin + 3, y + 5);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(4, 120, 87);
    doc.text(`Name: ${bill.customerName || 'Multiple Customers'}`, margin + 3, y + 12);

    if (bill.customerPAN) {
        doc.text(`PAN: ${bill.customerPAN}`, margin + 3, y + 18);
        y += 6;
    }

    // =========================================================================
    // INVOICES INCLUDED (for Combined bills)
    // =========================================================================
    y = bill.customerPAN ? 105 : 99;

    if (bill.type === 'Combined' && bill.invoiceNumbers.length > 0) {
        doc.setFillColor(240, 249, 255); // Light blue
        doc.setDrawColor(59, 130, 246); // Blue border

        const invoicesText = bill.invoiceNumbers.join(', ');
        const splitInvoices = doc.splitTextToSize(invoicesText, contentWidth - 10);
        const boxHeight = 8 + (splitInvoices.length * 4);

        doc.rect(margin, y, contentWidth, boxHeight, 'FD');

        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(30, 64, 175);
        doc.text(`INVOICES INCLUDED (${bill.invoiceNumbers.length})`, margin + 3, y + 5);

        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(30, 58, 138);
        doc.text(splitInvoices, margin + 3, y + 10);

        y += boxHeight + 5;
    } else {
        y += 5;
    }

    // =========================================================================
    // LINE ITEMS TABLE
    // =========================================================================
    const tableData = bill.items.map((item, idx) => [
        (idx + 1).toString(),
        item.productName,
        item.quantity.toString(),
        `Rs. ${item.rateBeforeVat.toFixed(2)}`,
        `Rs. ${item.total.toFixed(2)}`
    ]);

    autoTable(doc, {
        startY: y,
        head: [['S.N.', 'DESCRIPTION', 'QTY', 'RATE', 'AMOUNT']],
        body: tableData,
        margin: { left: margin, right: margin },
        styles: {
            fontSize: 9,
            cellPadding: 4,
            lineColor: [200, 200, 200],
            lineWidth: 0.1
        },
        headStyles: {
            fillColor: [79, 70, 229],
            textColor: 255,
            fontStyle: 'bold',
            halign: 'center'
        },
        columnStyles: {
            0: { halign: 'center', cellWidth: 15 },
            1: { cellWidth: 'auto' },
            2: { halign: 'center', cellWidth: 20 },
            3: { halign: 'right', cellWidth: 35 },
            4: { halign: 'right', cellWidth: 40 }
        },
        theme: 'grid'
    });

    // @ts-ignore - autoTable adds finalY to doc
    y = doc.lastAutoTable.finalY + 5;

    // =========================================================================
    // TOTALS SECTION
    // =========================================================================
    const totalsX = pageWidth - margin - 90;

    // Subtotal
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('SUBTOTAL:', totalsX, y);
    doc.setFont('helvetica', 'normal');
    doc.text(`Rs. ${bill.subtotal.toFixed(2)}`, pageWidth - margin - 5, y, { align: 'right' });
    y += 6;

    // Discount (if any)
    if (bill.discount > 0) {
        doc.setFont('helvetica', 'normal');
        doc.text('Discount:', totalsX, y);
        doc.setTextColor(220, 38, 38); // Red
        doc.text(`-Rs. ${bill.discount.toFixed(2)}`, pageWidth - margin - 5, y, { align: 'right' });
        doc.setTextColor(0, 0, 0);
        y += 6;
    }

    // VAT
    doc.text('VAT (13%):', totalsX, y);
    doc.text(`Rs. ${bill.vatAmount.toFixed(2)}`, pageWidth - margin - 5, y, { align: 'right' });
    y += 2;

    // Grand Total box
    y += 4;
    doc.setFillColor(220, 252, 231); // Light green
    doc.setDrawColor(34, 197, 94); // Green
    doc.rect(totalsX - 5, y - 4, 95, 12, 'FD');

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('GRAND TOTAL:', totalsX, y + 3);
    doc.text(`Rs. ${bill.totalAmount.toFixed(2)}`, pageWidth - margin - 5, y + 3, { align: 'right' });

    y += 15;

    // =========================================================================
    // AMOUNT IN WORDS
    // =========================================================================
    doc.setFillColor(249, 250, 251);
    doc.rect(margin, y, contentWidth, 14, 'F');

    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('Amount in Words:', margin + 3, y + 5);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(numberToWords(bill.totalAmount), margin + 3, y + 11);

    y += 20;

    // =========================================================================
    // SIGNATURE SECTION
    // =========================================================================
    const signY = Math.max(y + 15, 250);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);

    // Left signature
    doc.line(margin, signY, margin + 50, signY);
    doc.text('Prepared By', margin + 10, signY + 5);

    // Right signature
    doc.line(pageWidth - margin - 50, signY, pageWidth - margin, signY);
    doc.text('Authorized Signature', pageWidth - margin - 45, signY + 5);

    // =========================================================================
    // FOOTER
    // =========================================================================
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('This is a computer-generated document. No signature required.', pageWidth / 2, 280, { align: 'center' });

    // Page number (if multi-page export)
    if (pageNumber !== undefined && totalPages !== undefined) {
        doc.text(`Bill ${pageNumber} of ${totalPages}`, pageWidth / 2, 287, { align: 'center' });
    }
};

// ============================================================================
// RENDER SINGLE VAT INVOICE TO STANDALONE PDF
// ============================================================================
/**
 * Creates a new PDF with a single VAT invoice
 * Used for individual bill printing/download
 */
export const renderSingleVatInvoicePDF = (bill: VatBill): jsPDF => {
    const doc = new jsPDF();
    renderVatInvoice(doc, bill);
    return doc;
};

// ============================================================================
// PRINT VAT BILLS - UNIFIED PRINT ENGINE
// ============================================================================
/**
 * Prints multiple VAT bills as a single PDF document
 * Each bill is rendered on its own page with IDENTICAL format
 * This is the ONLY function that should be used for bulk printing/export
 */
export const printVatBills = (bills: VatBill[]): jsPDF => {
    if (bills.length === 0) {
        throw new Error('No bills to print');
    }

    const doc = new jsPDF();

    bills.forEach((bill, index) => {
        if (index > 0) {
            doc.addPage();
        }
        renderVatInvoice(doc, bill, index + 1, bills.length);
    });

    return doc;
};

// ============================================================================
// EXPORT VAT BILLS TO PDF FILE
// ============================================================================
/**
 * Exports all VAT bills to a downloadable PDF file
 * REPLACES the old exportVatBillsToPDF function
 */
export const exportAllVatBillsPDF = (bills: VatBill[], reportDate: string): string => {
    if (bills.length === 0) {
        throw new Error('No bills to export');
    }

    const doc = printVatBills(bills);
    const fileName = `vat-invoices-${reportDate}.pdf`;
    doc.save(fileName);

    return fileName;
};

// ============================================================================
// PRINT VAT BILLS IN BROWSER
// ============================================================================
/**
 * Opens a new window with all VAT bills ready for printing
 * Uses the same renderer as PDF export for consistency
 */
export const printAllVatBillsInBrowser = (bills: VatBill[]): void => {
    if (bills.length === 0) {
        throw new Error('No bills to print');
    }

    const doc = printVatBills(bills);

    // Open in new window for printing
    const pdfData = doc.output('datauristring');
    const printWindow = window.open('', '_blank');

    if (printWindow) {
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>VAT Invoices - Print</title>
                <style>
                    body { margin: 0; padding: 0; }
                    iframe { width: 100%; height: 100vh; border: none; }
                </style>
            </head>
            <body>
                <iframe src="${pdfData}" onload="setTimeout(() => { window.print(); }, 500);"></iframe>
            </body>
            </html>
        `);
        printWindow.document.close();
    }
};

// ============================================================================
// RENDER SINGLE BILL FOR PREVIEW (HTML)
// ============================================================================
/**
 * Returns HTML for a single bill preview - used in modals
 * This uses the SAME structure as PDF rendering for visual consistency
 */
export const renderVatInvoiceHTML = (bill: VatBill): string => {
    const itemsHTML = bill.items.map((item, idx) => `
        <tr>
            <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">${idx + 1}</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${item.productName}</td>
            <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">${item.quantity}</td>
            <td style="text-align: right; padding: 8px; border: 1px solid #ddd;">Rs. ${item.rateBeforeVat.toFixed(2)}</td>
            <td style="text-align: right; padding: 8px; border: 1px solid #ddd;">Rs. ${item.total.toFixed(2)}</td>
        </tr>
    `).join('');

    const invoicesSection = bill.type === 'Combined' ? `
        <div style="margin: 15px 0; padding: 10px; background-color: #f0f9ff; border-left: 4px solid #3b82f6; border-radius: 4px;">
            <div style="font-size: 11px; font-weight: bold; color: #1e40af;">INVOICES INCLUDED (${bill.invoiceNumbers.length})</div>
            <div style="font-size: 10px; color: #1e3a8a; margin-top: 5px;">${bill.invoiceNumbers.join(', ')}</div>
        </div>
    ` : '';

    return `
        <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto;">
            <!-- Header -->
            <div style="background: linear-gradient(to right, #4f46e5, #7c3aed); padding: 20px; text-align: center; color: white; border-radius: 8px 8px 0 0;">
                <div style="font-size: 22px; font-weight: bold;">${COMPANY_CONFIG.name}</div>
                <div style="font-size: 11px; margin-top: 5px;">${COMPANY_CONFIG.address}</div>
                <div style="font-size: 10px;">Phone: ${COMPANY_CONFIG.phone} | Email: ${COMPANY_CONFIG.email}</div>
                <div style="font-size: 10px;">PAN: ${COMPANY_CONFIG.pan} | VAT No: ${COMPANY_CONFIG.vatNo}</div>
            </div>

            <!-- Title -->
            <div style="background-color: #f3f4f6; padding: 10px; text-align: center; border-bottom: 2px solid #4f46e5;">
                <span style="font-size: 18px; font-weight: bold;">TAX INVOICE</span>
            </div>

            <!-- Bill Info -->
            <div style="display: flex; justify-content: space-between; padding: 15px; background-color: #fafafa;">
                <div>
                    <div style="font-size: 11px; color: #666; font-weight: bold;">BILL ID</div>
                    <div style="font-size: 13px;">${bill.id}</div>
                    <div style="font-size: 11px; color: #666; font-weight: bold; margin-top: 8px;">DATE</div>
                    <div style="font-size: 13px;">${new Date(bill.date).toLocaleDateString()}</div>
                </div>
                <div style="text-align: right;">
                    <div style="font-size: 11px; color: #666; font-weight: bold;">PAYMENT METHOD</div>
                    <div style="font-size: 13px;">${bill.paymentMethod.toUpperCase()}</div>
                    <div style="font-size: 11px; color: #666; font-weight: bold; margin-top: 8px;">TYPE</div>
                    <div style="font-size: 13px;">${bill.type}</div>
                </div>
            </div>

            <!-- Customer -->
            <div style="margin: 15px; padding: 12px; background-color: #f0fdf4; border-left: 4px solid #10b981; border-radius: 4px;">
                <div style="font-size: 11px; font-weight: bold; color: #065f46;">CUSTOMER DETAILS</div>
                <div style="font-size: 13px; color: #047857; margin-top: 5px;">
                    <strong>Name:</strong> ${bill.customerName || 'Multiple Customers'}
                    ${bill.customerPAN ? `<br/><strong>PAN:</strong> ${bill.customerPAN}` : ''}
                </div>
            </div>

            ${invoicesSection}

            <!-- Items Table -->
            <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
                <thead>
                    <tr style="background-color: #4f46e5; color: white;">
                        <th style="padding: 10px; text-align: center; width: 50px;">S.N.</th>
                        <th style="padding: 10px; text-align: left;">DESCRIPTION</th>
                        <th style="padding: 10px; text-align: center; width: 60px;">QTY</th>
                        <th style="padding: 10px; text-align: right; width: 100px;">RATE</th>
                        <th style="padding: 10px; text-align: right; width: 100px;">AMOUNT</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsHTML}
                </tbody>
            </table>

            <!-- Totals -->
            <div style="display: flex; justify-content: flex-end; margin: 15px;">
                <div style="width: 250px;">
                    <div style="display: flex; justify-content: space-between; padding: 5px 0; border-bottom: 1px solid #ddd;">
                        <span style="font-weight: bold;">SUBTOTAL:</span>
                        <span>Rs. ${bill.subtotal.toFixed(2)}</span>
                    </div>
                    ${bill.discount > 0 ? `
                    <div style="display: flex; justify-content: space-between; padding: 5px 0; border-bottom: 1px solid #ddd;">
                        <span>Discount:</span>
                        <span style="color: #dc2626;">-Rs. ${bill.discount.toFixed(2)}</span>
                    </div>
                    ` : ''}
                    <div style="display: flex; justify-content: space-between; padding: 5px 0; border-bottom: 1px solid #ddd;">
                        <span>VAT (13%):</span>
                        <span>Rs. ${bill.vatAmount.toFixed(2)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 10px; background-color: #dcfce7; border: 2px solid #22c55e; margin-top: 5px; border-radius: 4px;">
                        <span style="font-weight: bold; font-size: 14px;">GRAND TOTAL:</span>
                        <span style="font-weight: bold; font-size: 14px;">Rs. ${bill.totalAmount.toFixed(2)}</span>
                    </div>
                </div>
            </div>

            <!-- Amount in Words -->
            <div style="margin: 15px; padding: 10px; background-color: #f9fafb; border-radius: 4px;">
                <div style="font-size: 11px; font-weight: bold;">Amount in Words:</div>
                <div style="font-size: 12px; margin-top: 3px;">${numberToWords(bill.totalAmount)}</div>
            </div>

            <!-- Signatures -->
            <div style="display: flex; justify-content: space-between; margin: 40px 20px 20px 20px;">
                <div style="text-align: center;">
                    <div style="border-top: 1px solid #000; width: 120px; margin-bottom: 5px;"></div>
                    <div style="font-size: 11px; color: #666;">Prepared By</div>
                </div>
                <div style="text-align: center;">
                    <div style="border-top: 1px solid #000; width: 120px; margin-bottom: 5px;"></div>
                    <div style="font-size: 11px; color: #666;">Authorized Signature</div>
                </div>
            </div>

            <!-- Footer -->
            <div style="text-align: center; font-size: 10px; color: #999; padding: 15px; border-top: 1px solid #eee;">
                This is a computer-generated document. No signature required.
            </div>
        </div>
    `;
};

// ============================================================================
// EXPORTS
// ============================================================================
export default {
    renderVatInvoice,
    renderSingleVatInvoicePDF,
    printVatBills,
    exportAllVatBillsPDF,
    printAllVatBillsInBrowser,
    renderVatInvoiceHTML
};
