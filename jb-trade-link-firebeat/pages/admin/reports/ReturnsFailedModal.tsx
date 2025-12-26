import React from 'react';
import { Card, Button } from '../../../components/ui/Elements';
import { X, Printer, PackageX } from 'lucide-react';
import { printContent } from '../../../lib/printUtils';
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

interface ConsolidatedItem {
    productName: string;
    totalQtyReturned: number;
    totalQtyFailed: number;
    totalQty: number;
    invoices: string[];
}

export const ReturnsFailedModal: React.FC<ReturnsFailedModalProps> = ({ rows, onClose }) => {
    const returnItems: ReturnItem[] = [];

    console.log('[ReturnsFailedModal] Processing', rows.length, 'rows');

    rows.forEach((row, idx) => {
        const status = (row.status || '').toLowerCase();
        const isFailed = status === 'cancelled' || status === 'failed';
        const isReturned = status === 'returned' || status === 'partially_returned';
        const hasReturns = row.salesReturn || row.hasReturnsInRemarks || (row.returnAmount && row.returnAmount > 0);

        console.log(`Row ${idx}: ${row.invoiceNumber}, status=${status}, isFailed=${isFailed}, isReturned=${isReturned}, hasReturns=${hasReturns}`);

        if (!row.order || !row.order.items) {
            console.warn(`Row ${idx}: No order or items`);
            return;
        }

        if (isFailed) {
            row.order.items.forEach(item => {
                if (!item) return;

                // Explicit Number casting
                // Handle database field compatibility
                const qty = Number(item.quantity || item.qty) || 0;
                const rate = Number(item.price || item.rate) || 0;
                const total = Number(item.amount || item.total) || (qty * rate);
                const productName = item.tempProductName || item.productName || 'Unknown Product';

                returnItems.push({
                    invoiceNumber: row.invoiceNumber || 'N/A',
                    customerName: row.customerName || 'Unknown',
                    productName: productName,
                    qtyOrdered: qty,
                    qtyReturned: 0,
                    qtyFailed: qty,
                    reason: 'Delivery Failed',
                    amount: total
                });
            });
        } else if (isReturned || hasReturns) {
            // For partial returns, only include items that were actually returned
            // Don't include all items from the order
            const netAmount = Number(row.netAmount) || 0;
            const returnAmount = Number(row.returnAmount) || 0;

            // Skip if this is a delivered order with no actual returns
            if (status === 'delivered' && returnAmount === 0 && !row.salesReturn) {
                console.log(`Row ${idx}: Delivered with no returns, skipping`);
                return;
            }

            if (netAmount <= 0 && returnAmount === 0) {
                console.warn(`Row ${idx}: Invalid netAmount: ${netAmount}`);
                return;
            }

            row.order.items.forEach(item => {
                if (!item) return;

                // Explicit Number casting
                // Handle database field compatibility
                const qty = Number(item.quantity || item.qty) || 0;
                const rate = Number(item.price || item.rate) || 0;
                const productName = item.tempProductName || item.productName || 'Unknown Product';

                let estimatedReturnQty = 0;

                // If we have return amount data, calculate proportionally
                if (returnAmount > 0 && netAmount > 0) {
                    const returnFraction = returnAmount / netAmount;
                    estimatedReturnQty = Math.round(qty * returnFraction);
                } else if (status === 'returned') {
                    // If status is fully returned, assume full return
                    estimatedReturnQty = qty;
                }

                console.log(`Row ${idx} Item: ${productName}, qty=${qty}, returnAmount=${returnAmount}, estimatedReturnQty=${estimatedReturnQty}`);

                // CRITICAL: Only add items that were actually returned (estimatedReturnQty > 0)
                if (estimatedReturnQty > 0) {
                    returnItems.push({
                        invoiceNumber: row.invoiceNumber || 'N/A',
                        customerName: row.customerName || 'Unknown',
                        productName: productName,
                        qtyOrdered: qty,
                        qtyReturned: estimatedReturnQty,
                        qtyFailed: 0,
                        reason: row.salesReturn?.reason || 'Customer Return',
                        amount: rate * estimatedReturnQty
                    });
                }
            });
        }
    });

    console.log('[ReturnsFailedModal] Total items:', returnItems.length);

    // Consolidate items by product name
    const consolidatedMap = returnItems.reduce((acc, item) => {
        const key = item.productName;
        if (!acc[key]) {
            acc[key] = {
                productName: item.productName,
                totalQtyReturned: 0,
                totalQtyFailed: 0,
                totalQty: 0,
                invoices: []
            };
        }
        acc[key].totalQtyReturned += item.qtyReturned;
        acc[key].totalQtyFailed += item.qtyFailed;
        acc[key].totalQty += item.qtyReturned + item.qtyFailed;
        if (!acc[key].invoices.includes(item.invoiceNumber)) {
            acc[key].invoices.push(item.invoiceNumber);
        }
        return acc;
    }, {} as Record<string, ConsolidatedItem>);

    const consolidatedItems = Object.values(consolidatedMap);

    const totalReturnedQty = returnItems.reduce((sum, i) => sum + i.qtyReturned, 0);
    const totalFailedQty = returnItems.reduce((sum, i) => sum + i.qtyFailed, 0);
    const totalAmount = returnItems.reduce((sum, i) => sum + (i.amount || 0), 0);

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
                                                ₹{(item.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
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

            {/* Consolidated Print View */}
            <div id="returns-print-view" style={{ display: 'none' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '20px', fontSize: '18pt', fontWeight: 'bold' }}>
                    Returns & Failed Deliveries Checklist
                </h2>
                <p style={{ textAlign: 'center', marginBottom: '30px', fontSize: '10pt', color: '#666' }}>
                    Generated on: {new Date().toLocaleString()}
                </p>

                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11pt', marginBottom: '20px' }}>
                    <thead style={{ backgroundColor: '#f3f4f6' }}>
                        <tr>
                            <th style={{ border: '2px solid #4b5563', padding: '8px', textAlign: 'left' }}>Product</th>
                            <th style={{ border: '2px solid #4b5563', padding: '8px', textAlign: 'center', width: '100px' }}>Qty</th>
                            <th style={{ border: '2px solid #4b5563', padding: '8px', textAlign: 'center', width: '80px' }}>Type</th>
                            <th style={{ border: '2px solid #4b5563', padding: '8px', textAlign: 'center', width: '50px' }}>✓</th>
                        </tr>
                    </thead>
                    <tbody>
                        {consolidatedItems.map((item, idx) => (
                            <tr key={idx}>
                                <td style={{ border: '1px solid #4b5563', padding: '6px', fontWeight: 'bold' }}>
                                    {item.productName}
                                    <div style={{ fontSize: '9pt', color: '#666', fontWeight: 'normal', marginTop: '2px' }}>
                                        Invoices: {item.invoices.join(', ')}
                                    </div>
                                </td>
                                <td style={{ border: '1px solid #4b5563', padding: '6px', textAlign: 'center', fontWeight: 'bold', fontSize: '12pt' }}>
                                    {item.totalQty}
                                </td>
                                <td style={{ border: '1px solid #4b5563', padding: '6px', textAlign: 'center', fontSize: '9pt' }}>
                                    {item.totalQtyFailed > 0 ? 'FAILED' : 'RETURN'}
                                    {item.totalQtyReturned > 0 && item.totalQtyFailed > 0 && ' / BOTH'}
                                </td>
                                <td style={{ border: '1px solid #4b5563', padding: '6px' }}></td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot style={{ backgroundColor: '#f9fafb', fontWeight: 'bold' }}>
                        <tr>
                            <td style={{ border: '2px solid #4b5563', padding: '8px', textAlign: 'right' }}>TOTAL:</td>
                            <td style={{ border: '2px solid #4b5563', padding: '8px', textAlign: 'center', fontSize: '13pt' }}>
                                {totalReturnedQty + totalFailedQty}
                            </td>
                            <td colSpan={2} style={{ border: '2px solid #4b5563', padding: '8px' }}></td>
                        </tr>
                    </tfoot>
                </table>

                <div style={{ marginTop: '40px', fontSize: '9pt', color: '#666' }}>
                    <p><strong>Summary:</strong></p>
                    <p>Total Items: {consolidatedItems.length} | Total Quantity: {totalReturnedQty + totalFailedQty} units</p>
                    <p>Returned: {totalReturnedQty} | Failed: {totalFailedQty}</p>
                </div>
            </div>
        </div>
    );
};
