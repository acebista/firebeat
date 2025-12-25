import React, { useState } from 'react';
import { Card, Button, Badge } from '../../../components/ui/Elements';
import { generateVatBills, VatBill } from '../../../utils/vatBilling';
import { Download, Printer, Eye, X, TrendingUp, TrendingDown, DollarSign, Package, User, FileText, PackageX } from 'lucide-react';
import { printContent } from '../../../lib/printUtils';
import { Order, SalesReturn } from '../../../types';
import { PaymentMode } from '../../../types/delivery-order';
import { DeliveryReportRow } from './DeliveryRepo';

interface ReturnsFailedModalProps {
    rows: DeliveryReportRow[];
    onClose: () => void;
}

interface ReturnItem {
    invoiceNumber: string;
    customerName: string;
    productName: string;
    qtyOrdered: number;
    qtyReturned: number;
    qtyFailed: number;
    reason: string;
    amount: number;
}

export const ReturnsFailedModal: React.FC<ReturnsFailedModalProps> = ({ rows, onClose }) => {
    const returnItems: ReturnItem[] = [];

    rows.forEach(row => {
        const status = row.status.toLowerCase();
        const isFailed = status === 'cancelled' || status === 'failed';
        const isReturned = status === 'returned' || status === 'partially_returned';
        const hasReturns = row.salesReturn || row.hasReturnsInRemarks || row.returnAmount;

        if (isFailed) {
            row.order.items.forEach(item => {
                if (!item) return;
                returnItems.push({
                    invoiceNumber: row.invoiceNumber,
                    customerName: row.customerName,
                    productName: item.productName,
                    qtyOrdered: item.qty,
                    qtyReturned: 0,
                    qtyFailed: item.qty,
                    reason: 'Delivery Failed',
                    amount: item.total
                });
            });
        } else if (isReturned || (hasReturns && row.returnAmount && row.returnAmount > 0)) {
            row.order.items.forEach(item => {
                if (!item || !row.netAmount || row.netAmount <= 0) return;
                const returnFraction = row.returnAmount! / row.netAmount;
                const estimatedReturnQty = Math.round(item.qty * returnFraction);

                if (estimatedReturnQty > 0) {
                    returnItems.push({
                        invoiceNumber: row.invoiceNumber,
                        customerName: row.customerName,
                        productName: item.productName || 'Unknown Item',
                        qtyOrdered: item.qty || 0,
                        qtyReturned: estimatedReturnQty,
                        qtyFailed: 0,
                        reason: row.salesReturn?.reason || 'Customer Return',
                        amount: (item.rate || 0) * estimatedReturnQty
                    });
                }
            });
        }
    });

    const totalReturnedQty = returnItems.reduce((sum, i) => sum + i.qtyReturned, 0);
    const totalFailedQty = returnItems.reduce((sum, i) => sum + i.qtyFailed, 0);
    const totalAmount = returnItems.reduce((sum, i) => sum + i.amount, 0);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                <div className="bg-gradient-to-r from-red-600 to-orange-600 px-6 py-4 flex items-center justify-between shrink-0">
                    <div>
                        <h3 className="text-xl font-bold text-white">Returns & Failed Deliveries</h3>
                        <p className="text-sm text-red-100">Items to verify during unloading</p>
                    </div>
                    <button onClick={onClose} className="text-white hover:bg-white/20 rounded-full p-2 transition-colors">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <div className="p-6 overflow-auto flex-1 bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <Card className="p-4 bg-white border-l-4 border-red-500">
                            <div className="text-gray-500 text-xs uppercase font-bold">Total Items to Unload</div>
                            <div className="text-2xl font-bold text-gray-800">{returnItems.length}</div>
                        </Card>
                        <Card className="p-4 bg-white border-l-4 border-orange-500">
                            <div className="text-gray-500 text-xs uppercase font-bold">Total Quantity</div>
                            <div className="text-2xl font-bold text-gray-800">
                                {totalReturnedQty + totalFailedQty} units
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                                Returned: {totalReturnedQty} | Failed: {totalFailedQty}
                            </div>
                        </Card>
                        <Card className="p-4 bg-white border-l-4 border-amber-500">
                            <div className="text-gray-500 text-xs uppercase font-bold">Total Value</div>
                            <div className="text-2xl font-bold text-gray-800">
                                ₹{totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </div>
                        </Card>
                    </div>

                    {returnItems.length === 0 ? (
                        <Card className="p-8 text-center">
                            <PackageX className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 text-lg">No returns or failed deliveries found</p>
                            <p className="text-gray-400 text-sm mt-2">All deliveries were successful!</p>
                        </Card>
                    ) : (
                        <div className="bg-white rounded-lg shadow overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200 text-sm">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-4 py-3 text-left font-medium text-gray-500">Invoice</th>
                                        <th className="px-4 py-3 text-left font-medium text-gray-500">Customer</th>
                                        <th className="px-4 py-3 text-left font-medium text-gray-500">Product</th>
                                        <th className="px-4 py-3 text-center font-medium text-gray-500">Ordered</th>
                                        <th className="px-4 py-3 text-center font-medium text-gray-500">Returned</th>
                                        <th className="px-4 py-3 text-center font-medium text-gray-500">Failed</th>
                                        <th className="px-4 py-3 text-left font-medium text-gray-500">Reason</th>
                                        <th className="px-4 py-3 text-right font-medium text-gray-500">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {returnItems.map((item, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 font-mono text-xs text-indigo-600">{item.invoiceNumber}</td>
                                            <td className="px-4 py-3 text-gray-900">{item.customerName}</td>
                                            <td className="px-4 py-3 text-gray-900 font-medium">{item.productName}</td>
                                            <td className="px-4 py-3 text-center text-gray-600">{item.qtyOrdered}</td>
                                            <td className="px-4 py-3 text-center">
                                                {item.qtyReturned > 0 ? (
                                                    <span className="font-bold text-orange-600">{item.qtyReturned}</span>
                                                ) : (
                                                    <span className="text-gray-300">-</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                {item.qtyFailed > 0 ? (
                                                    <span className="font-bold text-red-600">{item.qtyFailed}</span>
                                                ) : (
                                                    <span className="text-gray-300">-</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-gray-600 text-xs capitalize">
                                                {item.reason.replace(/_/g, ' ')}
                                            </td>
                                            <td className="px-4 py-3 text-right font-bold text-gray-900">
                                                ₹{item.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot className="bg-gray-50 font-bold">
                                    <tr>
                                        <td colSpan={3} className="px-4 py-3 text-right text-gray-900">TOTAL:</td>
                                        <td className="px-4 py-3 text-center text-gray-900">
                                            {returnItems.reduce((sum, i) => sum + i.qtyOrdered, 0)}
                                        </td>
                                        <td className="px-4 py-3 text-center text-orange-600">{totalReturnedQty}</td>
                                        <td className="px-4 py-3 text-center text-red-600">{totalFailedQty}</td>
                                        <td className="px-4 py-3"></td>
                                        <td className="px-4 py-3 text-right text-gray-900">
                                            ₹{totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    )}
                </div>

                <div className="p-4 bg-white border-t flex justify-end gap-3">
                    <Button variant="outline" onClick={onClose}>Close</Button>
                    <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={() => printContent('Returns & Failed Deliveries', 'returns-print-view')}>
                        <Printer className="mr-2 h-4 w-4" /> Print Checklist
                    </Button>
                </div>
            </div>

            <div id="returns-print-view" style={{ display: 'none' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Returns & Failed Deliveries Checklist</h2>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10pt' }}>
                    <thead style={{ backgroundColor: '#f3f4f6' }}>
                        <tr>
                            <th style={{ border: '2px solid #4b5563', padding: '6px' }}>Invoice</th>
                            <th style={{ border: '2px solid #4b5563', padding: '6px' }}>Customer</th>
                            <th style={{ border: '2px solid #4b5563', padding: '6px' }}>Product</th>
                            <th style={{ border: '2px solid #4b5563', padding: '6px' }}>Qty</th>
                            <th style={{ border: '2px solid #4b5563', padding: '6px' }}>Type</th>
                            <th style={{ border: '2px solid #4b5563', padding: '6px' }}>✓</th>
                        </tr>
                    </thead>
                    <tbody>
                        {returnItems.map((item, idx) => (
                            <tr key={idx}>
                                <td style={{ border: '1px solid #4b5563', padding: '4px', fontSize: '9pt' }}>{item.invoiceNumber}</td>
                                <td style={{ border: '1px solid #4b5563', padding: '4px' }}>{item.customerName}</td>
                                <td style={{ border: '1px solid #4b5563', padding: '4px', fontWeight: 'bold' }}>{item.productName}</td>
                                <td style={{ border: '1px solid #4b5563', padding: '4px', textAlign: 'center', fontWeight: 'bold' }}>
                                    {item.qtyReturned || item.qtyFailed}
                                </td>
                                <td style={{ border: '1px solid #4b5563', padding: '4px', textAlign: 'center' }}>
                                    {item.qtyFailed > 0 ? 'FAILED' : 'RETURN'}
                                </td>
                                <td style={{ border: '1px solid #4b5563', padding: '4px', width: '40px' }}></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
