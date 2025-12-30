import React, { useState } from 'react';
import { Card, Button, Badge } from '../../../components/ui/Elements';
import { generateVatBills, VatBill } from '../../../utils/vatBilling';
import { Download, Printer, Eye, X, TrendingUp, TrendingDown, DollarSign, Package, User, FileText, PackageX } from 'lucide-react';
import { printContent } from '../../../lib/printUtils';
import { Order, SalesReturn } from '../../../types';
import { PaymentMode } from '../../../types/delivery-order';
import { ReturnsFailedModal } from './ReturnsFailedModal';
import { VatBillDetailModal } from './VatBillDetailModal';
import { VatTallyModal } from '../../../components/delivery/VatTallyModal';
import { CheckSquare } from 'lucide-react';

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
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
    const [showVatModal, setShowVatModal] = useState(false);
    const [generatedBills, setGeneratedBills] = useState<VatBill[]>([]);
    const [showReturnsModal, setShowReturnsModal] = useState(false);
    const [selectedVatBill, setSelectedVatBill] = useState<VatBill | null>(null);
    const [showTallyModal, setShowTallyModal] = useState(false);
    const [forcedIndividualIds, setForcedIndividualIds] = useState<string[]>([]);

    const handlePrint = () => {
        printContent('Delivery Report', 'delivery-report-print');
    };

    const { rows, summary } = data;

    // DEBUG: Log the first row's order structure
    if (rows.length > 0) {
        console.log('[DeliveryReport] First row:', rows[0]);
        console.log('[DeliveryReport] First row order:', rows[0].order);
        console.log('[DeliveryReport] First row order.items:', rows[0].order?.items);
    }

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


    // Effect to generate bills when modal opens
    React.useEffect(() => {
        if ((showVatModal || showTallyModal) && rows.length > 0) {
            const bills = generateVatBills(rows, forcedIndividualIds);
            setGeneratedBills(bills);
        }
    }, [showVatModal, showTallyModal, rows, forcedIndividualIds]);

    const toggleBillingMode = (invoiceId: string) => {
        setForcedIndividualIds(prev =>
            prev.includes(invoiceId)
                ? prev.filter(id => id !== invoiceId)
                : [...prev, invoiceId]
        );
    };

    return (
        <div className="space-y-6">
            {/* Header with Actions */}
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-800">Delivery Performance Report</h3>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setShowReturnsModal(true)}>
                        <PackageX className="mr-2 h-4 w-4" /> Returns/Failed
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setShowVatModal(true)}>
                        <FileText className="mr-2 h-4 w-4" /> VAT Bills
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowTallyModal(true)}
                        className="border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                    >
                        <CheckSquare className="mr-2 h-4 w-4" /> Billing Tally
                    </Button>
                    <Button variant="outline" size="sm" onClick={handlePrint}>
                        <Printer className="mr-2 h-4 w-4" /> Print
                    </Button>
                    <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" /> Export Excel
                    </Button>
                </div>
            </div>

            {/* ... rest of the existing UI ... */}

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
                        <div key={method} className="bg-gray-50 rounded-lg p-3 border border-gray-200 relative group hover:border-indigo-300 transition-colors">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-medium text-gray-600 uppercase">{method}</span>
                                <Badge color={getPaymentColor(method) as any}>{data.count}</Badge>
                            </div>
                            <p className="text-lg font-bold text-gray-900">₹{data.amount.toLocaleString()}</p>

                            <button
                                onClick={() => setSelectedPaymentMethod(method)}
                                className="absolute top-2 right-2 p-1 text-gray-400 hover:text-indigo-600 bg-white rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                title="View Details"
                            >
                                <Eye className="h-4 w-4" />
                            </button>
                        </div>
                    ))}
                </div>
            </Card>

            {/* Payment Method Detail Modal */}
            {selectedPaymentMethod && (
                <PaymentMethodDetailModal
                    method={selectedPaymentMethod}
                    allRows={rows}
                    onClose={() => setSelectedPaymentMethod(null)}
                    parsePaymentBreakdown={parsePaymentBreakdown}
                />
            )}

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
                                <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Billing</th>
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
                                            {['cash', 'qr'].includes(row.paymentMethod.toLowerCase()) ? (
                                                <Button
                                                    size="sm" // Changed from "xs" to "sm"
                                                    variant={forcedIndividualIds.includes(row.invoiceId) ? 'outline' : 'ghost'}
                                                    className={`text-[10px] h-6 px-1.5 rounded-md ${forcedIndividualIds.includes(row.invoiceId)
                                                        ? 'border-purple-200 text-purple-700 hover:bg-purple-50'
                                                        : 'text-blue-600 hover:bg-blue-50'
                                                        }`}
                                                    onClick={() => toggleBillingMode(row.invoiceId)}
                                                >
                                                    {forcedIndividualIds.includes(row.invoiceId) ? 'Individual' : 'Combined'}
                                                </Button>
                                            ) : (
                                                <span className="text-[10px] text-gray-400 font-medium uppercase tracking-tight">System Forced</span>
                                            )}
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

            {/* VAT Bill Calculation Modal */}
            {showVatModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                        <div className="bg-gradient-to-r from-teal-600 to-green-600 px-6 py-4 flex items-center justify-between shrink-0">
                            <div>
                                <h3 className="text-xl font-bold text-white">Generated VAT Bills</h3>
                                <p className="text-sm text-teal-100">Based on {rows.length} invoices in current view</p>
                            </div>
                            <button onClick={() => setShowVatModal(false)} className="text-white hover:bg-white/20 rounded-full p-2 transition-colors">
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <div className="p-6 overflow-auto flex-1 bg-gray-50">
                            {/* Stats Summary */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                                <Card className="p-4 bg-white border-l-4 border-emerald-500">
                                    <div className="text-gray-500 text-xs uppercase font-bold">Total Bills</div>
                                    <div className="text-2xl font-bold text-gray-800">{generatedBills.length}</div>
                                </Card>
                                <Card className="p-4 bg-white border-l-4 border-blue-500">
                                    <div className="text-gray-500 text-xs uppercase font-bold">Cash/QR Bill Sets</div>
                                    <div className="text-2xl font-bold text-gray-800">
                                        {generatedBills.filter(b => b.type === 'Combined').length}
                                    </div>
                                </Card>
                                <Card className="p-4 bg-white border-l-4 border-purple-500">
                                    <div className="text-gray-500 text-xs uppercase font-bold">Credit/Cheque Bills</div>
                                    <div className="text-2xl font-bold text-gray-800">
                                        {generatedBills.filter(b => b.type === 'Individual').length}
                                    </div>
                                </Card>
                                <Card className="p-4 bg-white border-l-4 border-amber-500">
                                    <div className="text-gray-500 text-xs uppercase font-bold">Total VAT Amount</div>
                                    <div className="text-2xl font-bold text-gray-800">
                                        ₹{generatedBills.reduce((sum, b) => sum + b.totalAmount, 0).toLocaleString()}
                                    </div>
                                </Card>
                            </div>

                            {/* Table */}
                            <div className="bg-white rounded-lg shadow overflow-hidden">
                                <table className="min-w-full divide-y divide-gray-200 text-sm">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="px-4 py-3 text-left font-medium text-gray-500">Bill ID</th>
                                            <th className="px-4 py-3 text-center font-medium text-gray-500">Type</th>
                                            <th className="px-4 py-3 text-center font-medium text-gray-500">Method</th>
                                            <th className="px-4 py-3 text-left font-medium text-gray-500">Invoices Included</th>
                                            <th className="px-4 py-3 text-right font-medium text-gray-500">Total Amount</th>
                                            <th className="px-4 py-3 text-center font-medium text-gray-500">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {generatedBills.map(bill => (
                                            <tr key={bill.id} className="hover:bg-gray-50">
                                                <td className="px-4 py-3 font-mono text-xs text-indigo-600 font-medium">{bill.id}</td>
                                                <td className="px-4 py-3 text-center">
                                                    <Badge color={bill.type === 'Combined' ? 'blue' : 'purple' as any}>{bill.type}</Badge>
                                                </td>
                                                <td className="px-4 py-3 text-center uppercase text-xs font-bold text-gray-700">
                                                    {bill.paymentMethod}
                                                </td>
                                                <td className="px-4 py-3 text-xs text-gray-600 max-w-md">
                                                    <div className="truncate" title={bill.invoiceNumbers.join(', ')}>
                                                        {bill.invoiceNumbers.length > 5
                                                            ? `${bill.invoiceNumbers.slice(0, 5).join(', ')} ... +${bill.invoiceNumbers.length - 5} more`
                                                            : bill.invoiceNumbers.join(', ')
                                                        }
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-right font-bold text-gray-900">
                                                    ₹{bill.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <button
                                                        onClick={() => setSelectedVatBill(bill)}
                                                        className="text-indigo-600 hover:text-indigo-900 transition-colors"
                                                        title="View Bill"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="p-4 bg-white border-t flex justify-end gap-3">
                            <Button variant="outline" onClick={() => setShowVatModal(false)}>Close</Button>
                            <Button className="bg-teal-600 hover:bg-teal-700 text-white">
                                <Download className="mr-2 h-4 w-4" /> Save / Export
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Returns/Failed Deliveries Modal */}
            {showReturnsModal && (
                <ReturnsFailedModal
                    rows={rows}
                    onClose={() => setShowReturnsModal(false)}
                />
            )}

            {/* VAT Bill Detail Modal */}
            {selectedVatBill && (
                <VatBillDetailModal
                    bill={selectedVatBill}
                    onClose={() => setSelectedVatBill(null)}
                />
            )}

            {/* VAT Tally Modal */}
            {showTallyModal && (
                <VatTallyModal
                    isOpen={showTallyModal}
                    onClose={() => setShowTallyModal(false)}
                    rows={rows}
                    generatedBills={generatedBills}
                />
            )}
        </div>
    );
};

interface PaymentMethodDetailModalProps {
    method: string;
    allRows: DeliveryReportRow[];
    onClose: () => void;
    parsePaymentBreakdown: (order: Order) => { method: string; amount: number }[] | null;
}

const PaymentMethodDetailModal: React.FC<PaymentMethodDetailModalProps> = ({ method, allRows, onClose, parsePaymentBreakdown }) => {
    // Filter rows relevant to this method
    const relevantRows = allRows.map(row => {
        let methodAmount = 0;
        let isRelevant = false;

        const rowMethod = (row.paymentMethod || '').toString().toLowerCase();

        if (rowMethod === method.toLowerCase()) {
            isRelevant = true;
            methodAmount = row.collectedAmount;
        } else if (rowMethod === 'multiple') {
            const breakdown = parsePaymentBreakdown(row.order);
            if (breakdown) {
                const entry = breakdown.find(e => e.method.toLowerCase() === method.toLowerCase());
                if (entry) {
                    isRelevant = true;
                    methodAmount = entry.amount;
                }
            }
        }

        return { ...row, methodAmount, isRelevant };
    }).filter(r => r.isRelevant);

    const totalMethodAmount = relevantRows.reduce((sum, r) => sum + r.methodAmount, 0);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-4 flex items-center justify-between shrink-0">
                    <div>
                        <h3 className="text-xl font-bold text-white capitalize">{method} Collections</h3>
                        <p className="text-sm text-indigo-100">{relevantRows.length} transactions</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-0 overflow-auto flex-1">
                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                        <thead className="bg-gray-50 sticky top-0 z-10 shadow-sm">
                            <tr>
                                <th className="px-4 py-3 text-left font-medium text-gray-500">Invoice</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-500">Customer</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-500">Delivery User</th>
                                <th className="px-4 py-3 text-right font-medium text-gray-500">Net Amount</th>
                                <th className="px-4 py-3 text-center font-medium text-gray-500">Type</th>
                                <th className="px-4 py-3 text-right font-bold text-gray-900">{method.toUpperCase()} Amount</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {relevantRows.map((row) => (
                                <tr key={row.invoiceId} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 font-mono text-indigo-600">{row.invoiceNumber}</td>
                                    <td className="px-4 py-3 text-gray-900">{row.customerName}</td>
                                    <td className="px-4 py-3 text-gray-600">{row.deliveryUserName}</td>
                                    <td className="px-4 py-3 text-right text-gray-500">₹{row.netAmount.toFixed(2)}</td>
                                    <td className="px-4 py-3 text-center">
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${row.paymentMethod.toString().toLowerCase() === 'multiple' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'
                                            }`}>
                                            {row.paymentMethod.toString().toLowerCase() === 'multiple' ? 'Split' : 'Single'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-right font-bold text-emerald-600">₹{row.methodAmount.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot className="bg-gray-50 sticky bottom-0 z-10 font-bold border-t-2 border-gray-200">
                            <tr>
                                <td colSpan={5} className="px-4 py-3 text-right text-gray-900">TOTAL {method.toUpperCase()} COLLECTED:</td>
                                <td className="px-4 py-3 text-right text-emerald-700 text-lg">₹{totalMethodAmount.toFixed(2)}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
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
                    < div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6" >
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
                        {
                            invoice.salesReturn && (
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
                            )
                        }
                    </div >

                    {/* Remarks */}
                    {
                        invoice.order.remarks && (
                            <Card className="p-4 bg-amber-50">
                                <h4 className="font-bold text-gray-800 mb-2">Remarks</h4>
                                <p className="text-sm text-gray-700">{invoice.order.remarks}</p>
                            </Card>
                        )
                    }
                </div >
            </div >
        </div >
    );
};
