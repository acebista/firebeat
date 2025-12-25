import React from 'react';
import { Button } from '../../../components/ui/Elements';
import { X, Download } from 'lucide-react';
import { VatBill } from '../../../utils/vatBilling';

interface VatBillDetailModalProps {
    bill: VatBill;
    onClose: () => void;
}

export const VatBillDetailModal: React.FC<VatBillDetailModalProps> = ({ bill, onClose }) => {
    const handleExportPDF = () => {
        // Trigger print which can be saved as PDF
        const printWindow = window.open('', '_blank');
        if (!printWindow) return;

        const billHTML = document.getElementById(`vat-bill-${bill.id}`)?.innerHTML || '';

        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>VAT Bill - ${bill.id}</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    .bill-container { max-width: 800px; margin: 0 auto; }
                    .header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #333; padding-bottom: 20px; }
                    .company-name { font-size: 24px; font-weight: bold; margin-bottom: 5px; }
                    .bill-title { font-size: 20px; color: #666; margin-top: 10px; }
                    .bill-info { display: flex; justify-content: space-between; margin: 20px 0; }
                    .info-block { flex: 1; }
                    .info-label { font-weight: bold; color: #666; font-size: 12px; }
                    .info-value { font-size: 14px; margin-top: 5px; }
                    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                    th { background-color: #f3f4f6; padding: 12px; text-align: left; border: 1px solid #ddd; font-size: 13px; }
                    td { padding: 10px; border: 1px solid #ddd; font-size: 13px; }
                    .text-right { text-align: right; }
                    .text-center { text-align: center; }
                    .total-row { background-color: #f9fafb; font-weight: bold; }
                    .footer { margin-top: 40px; padding-top: 20px; border-top: 2px solid #ddd; font-size: 12px; color: #666; }
                    @media print {
                        body { margin: 0; }
                        .no-print { display: none; }
                    }
                </style>
            </head>
            <body>
                ${billHTML}
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
                    <div id={`vat-bill-${bill.id}`} className="bg-white p-8 rounded-lg shadow">
                        {/* Bill Header */}
                        <div className="header">
                            <div className="company-name">YOUR COMPANY NAME</div>
                            <div style={{ fontSize: '12px', color: '#666' }}>
                                Address Line 1, Address Line 2<br />
                                Phone: +977-XXXXXXXXXX | Email: info@company.com<br />
                                PAN: XXXXXXXXX | VAT No: XXXXXXXXX
                            </div>
                            <div className="bill-title">TAX INVOICE</div>
                        </div>

                        {/* Bill Info */}
                        <div className="bill-info">
                            <div className="info-block">
                                <div className="info-label">BILL ID</div>
                                <div className="info-value">{bill.id}</div>
                            </div>
                            <div className="info-block">
                                <div className="info-label">DATE</div>
                                <div className="info-value">{new Date(bill.date).toLocaleDateString()}</div>
                            </div>
                            <div className="info-block">
                                <div className="info-label">PAYMENT METHOD</div>
                                <div className="info-value">{bill.paymentMethod.toUpperCase()}</div>
                            </div>
                            <div className="info-block">
                                <div className="info-label">TYPE</div>
                                <div className="info-value">{bill.type}</div>
                            </div>
                        </div>

                        {bill.type === 'Combined' && (
                            <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#f0f9ff', borderLeft: '4px solid #3b82f6' }}>
                                <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#1e40af' }}>INVOICES INCLUDED</div>
                                <div style={{ fontSize: '11px', color: '#1e3a8a', marginTop: '5px' }}>
                                    {bill.invoiceNumbers.join(', ')}
                                </div>
                            </div>
                        )}

                        {/* Items Table */}
                        <table>
                            <thead>
                                <tr>
                                    <th style={{ width: '50px' }}>S.N.</th>
                                    <th>DESCRIPTION</th>
                                    <th className="text-center" style={{ width: '100px' }}>QTY</th>
                                    <th className="text-right" style={{ width: '120px' }}>RATE</th>
                                    <th className="text-right" style={{ width: '120px' }}>AMOUNT</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bill.items.map((item, idx) => (
                                    <tr key={idx}>
                                        <td className="text-center">{idx + 1}</td>
                                        <td>{item.productName}</td>
                                        <td className="text-center">{item.quantity}</td>
                                        <td className="text-right">₹{item.rate.toFixed(2)}</td>
                                        <td className="text-right">₹{item.total.toFixed(2)}</td>
                                    </tr>
                                ))}
                                <tr className="total-row">
                                    <td colSpan={4} className="text-right" style={{ fontWeight: 'bold' }}>TOTAL</td>
                                    <td className="text-right" style={{ fontWeight: 'bold', fontSize: '15px' }}>
                                        ₹{bill.totalAmount.toFixed(2)}
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        {/* Amount in Words */}
                        <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f9fafb', borderRadius: '4px' }}>
                            <div style={{ fontSize: '12px', fontWeight: 'bold' }}>Amount in Words:</div>
                            <div style={{ fontSize: '13px', marginTop: '5px' }}>
                                {/* You can add a number-to-words converter here */}
                                Rupees {bill.totalAmount.toFixed(2)} Only
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="footer">
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '60px' }}>
                                <div>
                                    <div>_____________________</div>
                                    <div style={{ marginTop: '5px' }}>Prepared By</div>
                                </div>
                                <div>
                                    <div>_____________________</div>
                                    <div style={{ marginTop: '5px' }}>Authorized Signature</div>
                                </div>
                            </div>
                            <div style={{ textAlign: 'center', marginTop: '30px', fontSize: '11px' }}>
                                This is a computer-generated document. No signature required.
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-white border-t flex justify-end gap-3">
                    <Button variant="outline" onClick={onClose}>Close</Button>
                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white" onClick={handleExportPDF}>
                        <Download className="mr-2 h-4 w-4" /> Export as PDF
                    </Button>
                </div>
            </div>
        </div>
    );
};
