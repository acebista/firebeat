import React, { useState } from 'react';
import { Card, Button, Badge } from '../../../components/ui/Elements';
import { Download, Printer, Eye, X, TrendingUp, TrendingDown, DollarSign, Package, User } from 'lucide-react';
import { printContent } from '../../../lib/printUtils';
import { Order, SalesReturn } from '../../../types';
import { PaymentMode } from '../../../types/delivery-order';

export interface DeliveryReportRow {
    invoiceId: string;
    invoiceNumber: string;
    customerName: string;
    salespersonName: string;
    deliveryUserName: string;
    deliveryUserId: string;
    status: string;
    subtotal: number;
    discount: number;
    netAmount: number;
    paymentMethod: PaymentMode | string;
    collectedAmount: number;
    returnAmount?: number;
    returnQty?: number;
    hasReturnsInRemarks?: boolean; // Returns detected from order remarks
    date: string;
    order: Order; // Full order for drill-down
    salesReturn?: SalesReturn; // Linked return if exists
}

export interface DeliveryReportData {
    rows: DeliveryReportRow[];
    summary: {
        totalInvoices: number;
        totalDelivered: number;
        totalReturned: number;
        totalPartiallyReturned: number;
        totalFailed: number;
        totalRescheduled: number;
        totalAmount: number;
        totalCollected: number;
        paymentBreakdown: Record<string, { count: number; amount: number }>;
    };
}

interface DeliveryReportProps {
    data: DeliveryReportData;
}

export const DeliveryReport: React.FC<DeliveryReportProps> = ({ data }) => {
    const [selectedInvoice, setSelectedInvoice] = useState<DeliveryReportRow | null>(null);

    const handlePrint = () => {
        printContent('Delivery Report', 'delivery-report-print');
    };

    const { rows, summary } = data;

    // Capitalize first letter of each word
    const capitalize = (str: string): string => {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };

    // Parse payment breakdown from order remarks (format: "Payments: CASH: ₹1000, QR: ₹500")
    const parsePaymentBreakdown = (order: Order): { method: string; amount: number }[] | null => {
        const remarks = order.remarks || '';
        const paymentMatch = remarks.match(/Payments:\s*([^|]+)/);
        if (!paymentMatch) return null;

        const paymentsStr = paymentMatch[1];
        const entries: { method: string; amount: number }[] = [];

        // Match patterns like "CASH: ₹1000" or "QR: ₹500 (ref123)"
        const regex = /(\w+):\s*₹?(\d+(?:\.\d+)?)/g;
        let match;
        while ((match = regex.exec(paymentsStr)) !== null) {
            entries.push({
                method: capitalize(match[1]),
                amount: parseFloat(match[2])
            });
        }

        return entries.length > 0 ? entries : null;
    };

    // Payment method colors
    const getPaymentColor = (method: string): string => {
        switch (method.toLowerCase()) {
            case 'cash': return 'emerald';
            case 'qr': return 'blue';
            case 'cheque': return 'amber';
            case 'credit': return 'red';
            case 'multiple': return 'purple';
            default: return 'slate';
        }
    };

    const getStatusColor = (status: string): string => {
        switch (status.toLowerCase()) {
            case 'delivered':
            case 'completed': return 'emerald';
            case 'dispatched': return 'blue';
            case 'partially_returned': return 'amber';
            case 'returned':
            case 'cancelled': return 'red';
            case 'approved': return 'purple'; // Rescheduled orders
            default: return 'slate';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header with Actions */}
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-800">Delivery Performance Report</h3>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handlePrint}>
                        <Printer className="mr-2 h-4 w-4" /> Print
                    </Button>
                    <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" /> Export Excel
                    </Button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <Card className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 font-medium">Total Invoices</p>
                            <p className="text-2xl font-bold text-gray-900">{summary.totalInvoices}</p>
                        </div>
                        <Package className="h-10 w-10 text-blue-600 opacity-80" />
                    </div>
                </Card>

                <Card className="p-4 bg-gradient-to-br from-emerald-50 to-green-50 border-2 border-emerald-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 font-medium">Delivered</p>
                            <p className="text-2xl font-bold text-emerald-600">{summary.totalDelivered}</p>
                        </div>
                        <TrendingUp className="h-10 w-10 text-emerald-600 opacity-80" />
                    </div>
                </Card>

                <Card className="p-4 bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 font-medium">Partial Returns</p>
                            <p className="text-2xl font-bold text-amber-600">
                                {summary.totalReturned + summary.totalPartiallyReturned}
                            </p>
                        </div>
                        <TrendingDown className="h-10 w-10 text-amber-600 opacity-80" />
                    </div>
                </Card>

                <Card className="p-4 bg-gradient-to-br from-red-50 to-rose-50 border-2 border-red-300">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 font-medium">Failed</p>
                            <p className="text-2xl font-bold text-red-600">{summary.totalFailed}</p>
                        </div>
                        <TrendingDown className="h-10 w-10 text-red-600 opacity-80" />
                    </div>
                </Card>

                <Card className="p-4 bg-gradient-to-br from-violet-50 to-indigo-50 border-2 border-violet-300">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 font-medium">Rescheduled</p>
                            <p className="text-2xl font-bold text-violet-600">{summary.totalRescheduled}</p>
                        </div>
                        <TrendingDown className="h-10 w-10 text-violet-600 opacity-80" />
                    </div>
                </Card>

                <Card className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 font-medium">Total Collected</p>
                            <p className="text-2xl font-bold text-purple-600">₹{summary.totalCollected.toLocaleString()}</p>
                        </div>
                        <DollarSign className="h-10 w-10 text-purple-600 opacity-80" />
                    </div>
                </Card>
            </div>

            {/* Payment Method Breakdown */}
            <Card className="p-4">
                <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-indigo-600" />
                    Payment Method Breakdown
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {Object.entries(summary.paymentBreakdown).map(([method, data]) => (
                        <div key={method} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-medium text-gray-600 uppercase">{method}</span>
                                <Badge color={getPaymentColor(method) as any}>{data.count}</Badge>
                            </div>
                            <p className="text-lg font-bold text-gray-900">₹{data.amount.toLocaleString()}</p>
                        </div>
                    ))}
                </div>
            </Card>

            {/* Invoice List Table */}
            <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">S.N.</th>
                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice</th>
                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salesperson</th>
                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delivery User</th>
                                <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Subtotal</th>
                                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
                                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Net Amount</th>
                                <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Collected</th>
                                <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {rows.length === 0 ? (
                                <tr>
                                    <td colSpan={12} className="p-8 text-center text-gray-500">
                                        No delivery data found for selected filters.
                                    </td>
                                </tr>
                            ) : (
                                rows.map((row, idx) => (
                                    <tr key={row.invoiceId} className="hover:bg-gray-50">
                                        <td className="px-3 py-2 text-center text-gray-900">{idx + 1}</td>
                                        <td className="px-3 py-2">
                                            <div className="font-mono text-xs text-indigo-600 font-medium">{row.invoiceNumber}</div>
                                            <div className="text-xs text-gray-500">{row.date}</div>
                                            {(row.order as any).rescheduled_from && (
                                                <div className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded mt-1 inline-block">
                                                    ↩ From: {(row.order as any).rescheduled_from}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-3 py-2 text-gray-900">{row.customerName}</td>
                                        <td className="px-3 py-2 text-gray-700">{row.salespersonName}</td>
                                        <td className="px-3 py-2">
                                            <div className="flex items-center gap-1">
                                                <User className="h-3 w-3 text-gray-500" />
                                                <span className="text-gray-700">{row.deliveryUserName || 'Not Assigned'}</span>
                                            </div>
                                        </td>
                                        <td className="px-3 py-2 text-center">
                                            <Badge color={getStatusColor(row.status) as any}>
                                                {row.status.toLowerCase() === 'approved' ? 'Rescheduled' :
                                                    row.status.toLowerCase() === 'cancelled' ? 'Failed' :
                                                        capitalize(row.status)}
                                            </Badge>
                                            {row.returnAmount && row.returnAmount > 0 && (
                                                <div className="text-xs text-red-600 mt-1">-₹{row.returnAmount.toFixed(2)}</div>
                                            )}
                                            {row.hasReturnsInRemarks && (
                                                <div className="text-xs bg-amber-100 text-amber-700 px-1 py-0.5 rounded mt-1 inline-block">
                                                    ↩ Return
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-3 py-2 text-right text-gray-900">₹{row.subtotal.toFixed(2)}</td>
                                        <td className="px-3 py-2 text-right text-red-600">₹{row.discount.toFixed(2)}</td>
                                        <td className="px-3 py-2 text-right font-semibold text-gray-900">₹{row.netAmount.toFixed(2)}</td>
                                        <td className="px-3 py-2 text-center">
                                            {row.paymentMethod.toLowerCase() === 'multiple' ? (
                                                <div className="flex flex-col gap-1">
                                                    {parsePaymentBreakdown(row.order)?.map((entry, idx) => (
                                                        <div key={idx} className="flex items-center justify-center gap-1">
                                                            <Badge color={getPaymentColor(entry.method) as any}>
                                                                {entry.method}
                                                            </Badge>
                                                            <span className="text-xs text-gray-600">₹{entry.amount.toFixed(0)}</span>
                                                        </div>
                                                    )) || (
                                                            <Badge color="purple">Multiple</Badge>
                                                        )}
                                                </div>
                                            ) : (
                                                <Badge color={getPaymentColor(row.paymentMethod) as any}>
                                                    {capitalize(row.paymentMethod)}
                                                </Badge>
                                            )}
                                        </td>
                                        <td className="px-3 py-2 text-right font-bold text-emerald-600">
                                            ₹{row.collectedAmount.toFixed(2)}
                                        </td>
                                        <td className="px-3 py-2 text-center">
                                            <button
                                                onClick={() => setSelectedInvoice(row)}
                                                className="text-indigo-600 hover:text-indigo-900 transition-colors"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                        {rows.length > 0 && (
                            <tfoot className="bg-green-100 font-bold">
                                <tr>
                                    <td colSpan={6} className="px-3 py-3 text-right text-gray-900">TOTAL:</td>
                                    <td className="px-3 py-3 text-right text-gray-900">
                                        ₹{rows.reduce((s, r) => s + r.subtotal, 0).toFixed(2)}
                                    </td>
                                    <td className="px-3 py-3 text-right text-red-600">
                                        ₹{rows.reduce((s, r) => s + r.discount, 0).toFixed(2)}
                                    </td>
                                    <td className="px-3 py-3 text-right text-gray-900">
                                        ₹{rows.reduce((s, r) => s + r.netAmount, 0).toFixed(2)}
                                    </td>
                                    <td className="px-3 py-3"></td>
                                    <td className="px-3 py-3 text-right text-emerald-600">
                                        ₹{rows.reduce((s, r) => s + r.collectedAmount, 0).toFixed(2)}
                                    </td>
                                    <td className="px-3 py-3"></td>
                                </tr>
                            </tfoot>
                        )}
                    </table>
                </div>
            </Card>

            {/* Invoice Detail Modal */}
            {selectedInvoice && (
                <InvoiceDetailModal
                    invoice={selectedInvoice}
                    onClose={() => setSelectedInvoice(null)}
                />
            )}

            {/* Print View */}
            <div id="delivery-report-print" style={{ display: 'none' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Delivery Performance Report</h2>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '9pt' }}>
                    <thead style={{ backgroundColor: '#f3f4f6' }}>
                        <tr>
                            <th style={{ border: '2px solid #4b5563', padding: '6px', textAlign: 'center' }}>S.N.</th>
                            <th style={{ border: '2px solid #4b5563', padding: '6px', textAlign: 'left' }}>Invoice</th>
                            <th style={{ border: '2px solid #4b5563', padding: '6px', textAlign: 'left' }}>Customer</th>
                            <th style={{ border: '2px solid #4b5563', padding: '6px', textAlign: 'left' }}>Delivery User</th>
                            <th style={{ border: '2px solid #4b5563', padding: '6px', textAlign: 'center' }}>Status</th>
                            <th style={{ border: '2px solid #4b5563', padding: '6px', textAlign: 'right' }}>Net Amount</th>
                            <th style={{ border: '2px solid #4b5563', padding: '6px', textAlign: 'center' }}>Payment</th>
                            <th style={{ border: '2px solid #4b5563', padding: '6px', textAlign: 'right' }}>Collected</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, idx) => (
                            <tr key={row.invoiceId}>
                                <td style={{ border: '1px solid #4b5563', padding: '4px', textAlign: 'center' }}>{idx + 1}</td>
                                <td style={{ border: '1px solid #4b5563', padding: '4px' }}>{row.invoiceNumber}</td>
                                <td style={{ border: '1px solid #4b5563', padding: '4px' }}>{row.customerName}</td>
                                <td style={{ border: '1px solid #4b5563', padding: '4px' }}>{row.deliveryUserName || 'N/A'}</td>
                                <td style={{ border: '1px solid #4b5563', padding: '4px', textAlign: 'center' }}>
                                    {row.status.toLowerCase() === 'approved' ? 'Rescheduled' :
                                        row.status.toLowerCase() === 'cancelled' ? 'Failed' :
                                            row.status}
                                </td>
                                <td style={{ border: '1px solid #4b5563', padding: '4px', textAlign: 'right' }}>{row.netAmount.toFixed(2)}</td>
                                <td style={{ border: '1px solid #4b5563', padding: '4px', textAlign: 'center' }}>{row.paymentMethod}</td>
                                <td style={{ border: '1px solid #4b5563', padding: '4px', textAlign: 'right' }}>{row.collectedAmount.toFixed(2)}</td>
                            </tr>
                        ))}
                        <tr style={{ backgroundColor: '#86efac', fontWeight: 'bold' }}>
                            <td colSpan={5} style={{ border: '2px solid #4b5563', padding: '8px', textAlign: 'right' }}>TOTAL:</td>
                            <td style={{ border: '2px solid #4b5563', padding: '8px', textAlign: 'right' }}>
                                {rows.reduce((s, r) => s + r.netAmount, 0).toFixed(2)}
                            </td>
                            <td style={{ border: '2px solid #4b5563', padding: '8px' }}></td>
                            <td style={{ border: '2px solid #4b5563', padding: '8px', textAlign: 'right' }}>
                                {rows.reduce((s, r) => s + r.collectedAmount, 0).toFixed(2)}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// Invoice Detail Modal Component
interface InvoiceDetailModalProps {
    invoice: DeliveryReportRow;
    onClose: () => void;
}

const InvoiceDetailModal: React.FC<InvoiceDetailModalProps> = ({ invoice, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-4 flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-bold text-white">Invoice Details</h3>
                        <p className="text-sm text-indigo-100">#{invoice.invoiceNumber}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
                    {/* Invoice Info Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                        <div>
                            <p className="text-xs text-gray-500 font-medium">Customer</p>
                            <p className="text-sm font-semibold text-gray-900">{invoice.customerName}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-medium">Salesperson</p>
                            <p className="text-sm font-semibold text-gray-900">{invoice.salespersonName}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-medium">Delivery User</p>
                            <p className="text-sm font-semibold text-gray-900">{invoice.deliveryUserName || 'Not Assigned'}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-medium">Date</p>
                            <p className="text-sm font-semibold text-gray-900">{invoice.date}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-medium">Status</p>
                            <Badge color={invoice.status === 'delivered' ? 'emerald' : 'amber' as any}>
                                {invoice.status}
                            </Badge>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-medium">Payment Method</p>
                            <Badge color="blue">{invoice.paymentMethod}</Badge>
                        </div>
                    </div>

                    {/* Line Items */}
                    <div className="mb-6">
                        <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                            <Package className="h-5 w-5 text-indigo-600" />
                            Order Items
                        </h4>
                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200 text-sm">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Product</th>
                                        <th className="px-3 py-2 text-center text-xs font-medium text-gray-500">Qty</th>
                                        <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">Rate</th>
                                        <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {invoice.order.items.map((item, idx) => (
                                        <tr key={idx}>
                                            <td className="px-3 py-2">
                                                <div className="font-medium text-gray-900">{item.productName}</div>
                                                {item.companyName && (
                                                    <div className="text-xs text-gray-500">{item.companyName}</div>
                                                )}
                                            </td>
                                            <td className="px-3 py-2 text-center text-gray-900">{item.qty}</td>
                                            <td className="px-3 py-2 text-right text-gray-900">₹{item.rate.toFixed(2)}</td>
                                            <td className="px-3 py-2 text-right font-semibold text-gray-900">₹{item.total.toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Financial Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <Card className="p-4 bg-gray-50">
                            <h4 className="font-bold text-gray-800 mb-3">Financial Summary</h4>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Subtotal:</span>
                                    <span className="font-semibold text-gray-900">₹{invoice.subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Discount:</span>
                                    <span className="font-semibold text-red-600">-₹{invoice.discount.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between pt-2 border-t border-gray-300">
                                    <span className="font-bold text-gray-900">Net Amount:</span>
                                    <span className="font-bold text-gray-900">₹{invoice.netAmount.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between pt-2 border-t border-gray-300">
                                    <span className="font-bold text-emerald-600">Collected:</span>
                                    <span className="font-bold text-emerald-600">₹{invoice.collectedAmount.toFixed(2)}</span>
                                </div>
                            </div>
                        </Card>

                        {/* Sales Return Info */}
                        {invoice.salesReturn && (
                            <Card className="p-4 bg-red-50 border-2 border-red-200">
                                <h4 className="font-bold text-red-800 mb-3 flex items-center gap-2">
                                    <TrendingDown className="h-5 w-5" />
                                    Sales Return
                                </h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-700">Return Type:</span>
                                        <Badge color="red">{invoice.salesReturn.returnType}</Badge>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-700">Reason:</span>
                                        <span className="text-gray-900 capitalize">{invoice.salesReturn.reason.replace(/_/g, ' ')}</span>
                                    </div>
                                    <div className="flex justify-between pt-2 border-t border-red-300">
                                        <span className="font-bold text-red-800">Return Amount:</span>
                                        <span className="font-bold text-red-800">₹{invoice.salesReturn.totalReturnAmount.toFixed(2)}</span>
                                    </div>
                                    {invoice.salesReturn.notes && (
                                        <div className="pt-2 border-t border-red-300">
                                            <p className="text-xs text-gray-600">Notes:</p>
                                            <p className="text-sm text-gray-900">{invoice.salesReturn.notes}</p>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        )}
                    </div>

                    {/* Remarks */}
                    {invoice.order.remarks && (
                        <Card className="p-4 bg-amber-50">
                            <h4 className="font-bold text-gray-800 mb-2">Remarks</h4>
                            <p className="text-sm text-gray-700">{invoice.order.remarks}</p>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};
