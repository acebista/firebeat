/**
 * Customer Ledger Page
 * 
 * Shows:
 * - Customer header with credit info and aging summary
 * - Chronological list of invoices, payments, and returns
 * - Running balance
 * - Filters for date range and entry type
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    FileText,
    CreditCard,
    RotateCcw,
    Calendar,
    DollarSign,
    TrendingUp,
    AlertTriangle,
    Filter,
    Download,
    Plus
} from 'lucide-react';
import { Card, Button, Input, Badge } from '../../components/ui/Elements';
import { LedgerService, PaymentsService } from '../../services/ledger';
import type { LedgerEntry, CustomerLedgerSummary } from '../../services/ledger';
import toast from 'react-hot-toast';

// Payment Collection Modal Component
const PaymentCollectionModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    customerId: string;
    customerName: string;
    onSuccess: () => void;
}> = ({ isOpen, onClose, customerId, customerName, onSuccess }) => {
    const [invoiceId, setInvoiceId] = useState('');
    const [amount, setAmount] = useState('');
    const [method, setMethod] = useState<'cash' | 'qr' | 'cheque' | 'bank_transfer'>('cash');
    const [reference, setReference] = useState('');
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);
    const [invoices, setInvoices] = useState<any[]>([]);

    useEffect(() => {
        if (isOpen) {
            loadUnpaidInvoices();
        }
    }, [isOpen, customerId]);

    const loadUnpaidInvoices = async () => {
        try {
            const data = await LedgerService.getCustomerInvoices(customerId);
            setInvoices(data.filter(inv => inv.outstanding > 0));
        } catch (e) {
            console.error('Failed to load invoices', e);
        }
    };

    const handleSubmit = async () => {
        if (!invoiceId || !amount || parseFloat(amount) <= 0) {
            toast.error('Please select invoice and enter valid amount');
            return;
        }

        setLoading(true);
        try {
            await PaymentsService.addPayment({
                invoiceId,
                customerId,
                amount: parseFloat(amount),
                method,
                reference: reference || undefined,
                notes: notes || undefined
            });
            toast.success('Payment recorded successfully!');
            onSuccess();
            onClose();
        } catch (e: any) {
            console.error(e);
            toast.error(e.message || 'Failed to record payment');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    const selectedInvoice = invoices.find(i => i.invoice_id === invoiceId);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                    Record Payment for {customerName}
                </h2>

                <div className="space-y-4">
                    {/* Invoice Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Invoice</label>
                        <select
                            value={invoiceId}
                            onChange={(e) => setInvoiceId(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Select Invoice</option>
                            {invoices.map(inv => (
                                <option key={inv.invoice_id} value={inv.invoice_id}>
                                    {inv.invoice_id} - Outstanding: ₹{inv.outstanding.toFixed(2)}
                                </option>
                            ))}
                        </select>
                    </div>

                    {selectedInvoice && (
                        <div className="p-3 bg-blue-50 rounded-lg text-sm">
                            <p>Invoice Total: ₹{selectedInvoice.invoice_total.toFixed(2)}</p>
                            <p>Already Paid: ₹{(selectedInvoice.invoice_total - selectedInvoice.outstanding).toFixed(2)}</p>
                            <p className="font-semibold text-blue-800">Outstanding: ₹{selectedInvoice.outstanding.toFixed(2)}</p>
                        </div>
                    )}

                    {/* Amount */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.00"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                        {selectedInvoice && (
                            <button
                                type="button"
                                onClick={() => setAmount(selectedInvoice.outstanding.toString())}
                                className="text-xs text-blue-600 mt-1 hover:underline"
                            >
                                Fill outstanding amount
                            </button>
                        )}
                    </div>

                    {/* Payment Method */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Method</label>
                        <div className="grid grid-cols-4 gap-2">
                            {(['cash', 'qr', 'cheque', 'bank_transfer'] as const).map(m => (
                                <button
                                    key={m}
                                    onClick={() => setMethod(m)}
                                    className={`p-2 rounded text-sm font-medium border ${method === m
                                        ? 'bg-blue-100 border-blue-500 text-blue-700'
                                        : 'bg-gray-50 border-gray-200 text-gray-700'
                                        }`}
                                >
                                    {m === 'bank_transfer' ? 'Bank' : m.charAt(0).toUpperCase() + m.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Reference */}
                    {method !== 'cash' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {method === 'qr' ? 'Transaction ID' : method === 'cheque' ? 'Cheque Number' : 'Reference'}
                            </label>
                            <input
                                type="text"
                                value={reference}
                                onChange={(e) => setReference(e.target.value)}
                                placeholder="Enter reference"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    )}

                    {/* Notes */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                        />
                    </div>
                </div>

                <div className="flex gap-3 mt-6">
                    <Button variant="outline" onClick={onClose} className="flex-1">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={loading} className="flex-1 bg-green-600 hover:bg-green-700">
                        {loading ? 'Recording...' : 'Record Payment'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export const CustomerLedgerPage: React.FC = () => {
    const { customerId } = useParams<{ customerId: string }>();
    const navigate = useNavigate();

    const [summary, setSummary] = useState<CustomerLedgerSummary | null>(null);
    const [entries, setEntries] = useState<LedgerEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [showPaymentModal, setShowPaymentModal] = useState(false);

    // Filters
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [entryType, setEntryType] = useState<'all' | 'invoice' | 'payment' | 'return'>('all');

    useEffect(() => {
        if (customerId) {
            loadData();
        }
    }, [customerId, startDate, endDate, entryType]);

    const loadData = async () => {
        if (!customerId) return;
        setLoading(true);
        try {
            const [summaryData, entriesData] = await Promise.all([
                LedgerService.getCustomerLedgerSummary(customerId),
                LedgerService.getCustomerLedger(customerId, {
                    startDate: startDate || undefined,
                    endDate: endDate || undefined,
                    entryType: entryType === 'all' ? undefined : entryType
                })
            ]);
            setSummary(summaryData);
            setEntries(entriesData);
        } catch (e) {
            console.error('Failed to load ledger', e);
            toast.error('Failed to load customer ledger');
        } finally {
            setLoading(false);
        }
    };

    const getEntryIcon = (type: string) => {
        switch (type) {
            case 'invoice': return <FileText className="h-4 w-4 text-blue-600" />;
            case 'payment': return <CreditCard className="h-4 w-4 text-green-600" />;
            case 'return': return <RotateCcw className="h-4 w-4 text-orange-600" />;
            default: return <FileText className="h-4 w-4" />;
        }
    };

    const getEntryColor = (type: string): 'blue' | 'emerald' | 'amber' | 'slate' => {
        switch (type) {
            case 'invoice': return 'blue';
            case 'payment': return 'emerald';
            case 'return': return 'amber';
            default: return 'slate';
        }
    };

    if (loading && !summary) {
        return (
            <div className="p-8 text-center">
                <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-600">Loading customer ledger...</p>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-6 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold text-gray-900">
                        {summary?.customer_name || 'Customer'} Ledger
                    </h1>
                    <p className="text-sm text-gray-600">ID: {customerId}</p>
                </div>
                <Button onClick={() => setShowPaymentModal(true)} className="bg-green-600 hover:bg-green-700">
                    <Plus className="h-4 w-4 mr-2" /> Record Payment
                </Button>
            </div>

            {/* Summary Cards */}
            {summary && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    {/* Outstanding */}
                    <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                        <div className="flex items-center gap-2 mb-2">
                            <DollarSign className="h-5 w-5 text-blue-600" />
                            <span className="text-sm font-medium text-blue-800">Outstanding</span>
                        </div>
                        <p className="text-2xl font-bold text-blue-900">
                            ₹{summary.current_outstanding.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </p>
                    </Card>

                    {/* Credit Limit */}
                    <Card className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200">
                        <div className="flex items-center gap-2 mb-2">
                            <TrendingUp className="h-5 w-5 text-gray-600" />
                            <span className="text-sm font-medium text-gray-700">Credit Limit</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">
                            ₹{(summary.credit_limit || 0).toLocaleString('en-IN')}
                        </p>
                        {summary.credit_limit > 0 && (
                            <p className="text-xs text-gray-600 mt-1">
                                {((summary.current_outstanding / summary.credit_limit) * 100).toFixed(0)}% utilized
                            </p>
                        )}
                    </Card>

                    {/* Total Invoices */}
                    <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                        <div className="flex items-center gap-2 mb-2">
                            <FileText className="h-5 w-5 text-purple-600" />
                            <span className="text-sm font-medium text-purple-800">Invoices</span>
                        </div>
                        <p className="text-2xl font-bold text-purple-900">
                            {summary.total_invoices}
                        </p>
                    </Card>

                    {/* Aging Alert */}
                    <Card className={`p-4 ${summary.aging.overNinety > 0
                        ? 'bg-gradient-to-br from-red-50 to-red-100 border-red-200'
                        : summary.aging.sixtyDays > 0
                            ? 'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200'
                            : 'bg-gradient-to-br from-green-50 to-green-100 border-green-200'
                        }`}>
                        <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle className={`h-5 w-5 ${summary.aging.overNinety > 0 ? 'text-red-600'
                                : summary.aging.sixtyDays > 0 ? 'text-orange-600'
                                    : 'text-green-600'
                                }`} />
                            <span className="text-sm font-medium">Aging</span>
                        </div>
                        <div className="text-xs space-y-1">
                            <p>0-30d: ₹{summary.aging.current.toLocaleString('en-IN')}</p>
                            <p>31-60d: ₹{summary.aging.thirtyDays.toLocaleString('en-IN')}</p>
                            <p>61-90d: ₹{summary.aging.sixtyDays.toLocaleString('en-IN')}</p>
                            <p className="font-semibold">90+d: ₹{summary.aging.overNinety.toLocaleString('en-IN')}</p>
                        </div>
                    </Card>
                </div>
            )}

            {/* Filters */}
            <Card className="p-4 mb-6">
                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700">Filters:</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                        <span className="text-gray-500">to</span>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                    </div>

                    <select
                        value={entryType}
                        onChange={(e) => setEntryType(e.target.value as any)}
                        className="px-3 py-1 border border-gray-300 rounded text-sm"
                    >
                        <option value="all">All Types</option>
                        <option value="invoice">Invoices Only</option>
                        <option value="payment">Payments Only</option>
                        <option value="return">Returns Only</option>
                    </select>

                    <Button size="sm" variant="outline" onClick={() => {
                        setStartDate('');
                        setEndDate('');
                        setEntryType('all');
                    }}>
                        Clear
                    </Button>
                </div>
            </Card>

            {/* Ledger Table */}
            <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Date</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Type</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Reference</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Description</th>
                                <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Debit</th>
                                <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Credit</th>
                                <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Balance</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {entries.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="text-center py-8 text-gray-500">
                                        No ledger entries found
                                    </td>
                                </tr>
                            ) : (
                                entries.map((entry, idx) => (
                                    <tr key={`${entry.entry_type}-${entry.reference_id}-${idx}`} className="hover:bg-gray-50">
                                        <td className="py-3 px-4 text-sm text-gray-900">
                                            {new Date(entry.entry_date).toLocaleDateString('en-IN')}
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-1">
                                                {getEntryIcon(entry.entry_type)}
                                                <Badge color={getEntryColor(entry.entry_type)}>
                                                    <span className="capitalize">{entry.entry_type}</span>
                                                </Badge>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-sm text-blue-600 font-medium">
                                            {entry.reference_id}
                                        </td>
                                        <td className="py-3 px-4 text-sm text-gray-600">
                                            {entry.description}
                                        </td>
                                        <td className="py-3 px-4 text-sm text-right font-medium">
                                            {entry.debit_amount > 0 && (
                                                <span className="text-red-600">₹{entry.debit_amount.toFixed(2)}</span>
                                            )}
                                        </td>
                                        <td className="py-3 px-4 text-sm text-right font-medium">
                                            {entry.credit_amount > 0 && (
                                                <span className="text-green-600">₹{entry.credit_amount.toFixed(2)}</span>
                                            )}
                                        </td>
                                        <td className="py-3 px-4 text-sm text-right font-bold text-gray-900">
                                            ₹{(entry.running_balance || 0).toFixed(2)}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                        {entries.length > 0 && (
                            <tfoot className="bg-gray-100 border-t-2 border-gray-300">
                                <tr>
                                    <td colSpan={4} className="py-3 px-4 text-sm font-bold text-gray-900">
                                        Closing Balance
                                    </td>
                                    <td className="py-3 px-4 text-sm text-right font-bold text-red-600">
                                        ₹{entries.reduce((sum, e) => sum + e.debit_amount, 0).toFixed(2)}
                                    </td>
                                    <td className="py-3 px-4 text-sm text-right font-bold text-green-600">
                                        ₹{entries.reduce((sum, e) => sum + e.credit_amount, 0).toFixed(2)}
                                    </td>
                                    <td className="py-3 px-4 text-sm text-right font-bold text-gray-900">
                                        ₹{(entries[entries.length - 1]?.running_balance || 0).toFixed(2)}
                                    </td>
                                </tr>
                            </tfoot>
                        )}
                    </table>
                </div>
            </Card>

            {/* Payment Collection Modal */}
            <PaymentCollectionModal
                isOpen={showPaymentModal}
                onClose={() => setShowPaymentModal(false)}
                customerId={customerId || ''}
                customerName={summary?.customer_name || ''}
                onSuccess={loadData}
            />
        </div>
    );
};

export default CustomerLedgerPage;
