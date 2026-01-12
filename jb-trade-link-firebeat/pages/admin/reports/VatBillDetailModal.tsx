import React from 'react';
import { Button } from '../../../components/ui/Elements';
import { X, Download, Printer } from 'lucide-react';
import { VatBill } from '../../../utils/vatBilling';
// UNIFIED VAT INVOICE RENDERER - Single source of truth
import { renderSingleVatInvoicePDF, renderVatInvoiceHTML } from '../../../utils/VatInvoiceRenderer';

interface VatBillDetailModalProps {
    bill: VatBill;
    onClose: () => void;
}

export const VatBillDetailModal: React.FC<VatBillDetailModalProps> = ({ bill, onClose }) => {
    const handleExportPDF = () => {
        // UNIFIED: Uses the single VatInvoiceRenderer - identical to Print All
        const doc = renderSingleVatInvoicePDF(bill);
        doc.save(`vat-invoice-${bill.id}.pdf`);
    };

    const handlePrint = () => {
        // Open unified invoice HTML in new window for printing
        const printWindow = window.open('', '_blank');
        if (!printWindow) return;

        const invoiceHTML = renderVatInvoiceHTML(bill);

        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>VAT Invoice - ${bill.id}</title>
                <style>
                    body { margin: 20px; font-family: Arial, sans-serif; }
                    @media print {
                        body { margin: 0; }
                    }
                </style>
            </head>
            <body>
                ${invoiceHTML}
            </body>
            </html>
        `);

        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
            printWindow.print();
        }, 250);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 flex items-center justify-between shrink-0">
                    <div>
                        <h3 className="text-xl font-bold text-white">VAT Bill - {bill.id}</h3>
                        <p className="text-sm text-indigo-100">{bill.type} Bill | {bill.paymentMethod.toUpperCase()}</p>
                    </div>
                    <button onClick={onClose} className="text-white hover:bg-white/20 rounded-full p-2 transition-colors">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <div className="p-6 overflow-auto flex-1 bg-gray-50">
                    <div
                        id={`vat-bill-${bill.id}`}
                        className="bg-white p-2 rounded-lg shadow"
                        dangerouslySetInnerHTML={{ __html: renderVatInvoiceHTML(bill) }}
                    />
                </div>

                <div className="p-4 bg-white border-t flex justify-end gap-3">
                    <Button variant="outline" onClick={onClose}>Close</Button>
                    <Button variant="outline" className="border-indigo-600 text-indigo-600 hover:bg-indigo-50" onClick={handlePrint}>
                        <Printer className="mr-2 h-4 w-4" /> Print
                    </Button>
                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white" onClick={handleExportPDF}>
                        <Download className="mr-2 h-4 w-4" /> Export as PDF
                    </Button>
                </div>
            </div>
        </div>
    );
};
