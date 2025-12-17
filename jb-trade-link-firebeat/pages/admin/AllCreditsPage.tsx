/**
 * All Credits Page (Accounts Receivable Report)
 * 
 * Shows:
 * - AR Aging Summary (total outstanding by aging bucket)
 * - Per-customer outstanding list
 * - Per-invoice outstanding list with status and aging
 * - Filters for status, aging, date range, salesperson
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    DollarSign,
    Users,
    FileText,
    Clock,
    AlertTriangle,
    TrendingUp,
    Filter,
    Search,
    ChevronDown,
    ChevronUp
} from 'lucide-react';
import { Card, Button, Input, Badge } from '../../components/ui/Elements';
import { LedgerService } from '../../services/ledger';
import type { CustomerBalance, InvoiceBalance, ARReportFilters } from '../../services/ledger';
import { UserService } from '../../services/db';
import toast from 'react-hot-toast';

type ViewMode = 'customers' | 'invoices';

export const AllCreditsPage: React.FC = () => {
    const navigate = useNavigate();

    const [viewMode, setViewMode] = useState<ViewMode>('customers');
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Data
    const [customerBalances, setCustomerBalances] = useState<CustomerBalance[]>([]);
    const [invoiceBalances, setInvoiceBalances] = useState<InvoiceBalance[]>([]);
    const [agingSummary, setAgingSummary] = useState({
        total: 0,
        current: 0,
        thirtyDays: 0,
        sixtyDays: 0,
        overNinety: 0
    });
    const [salespersons, setSalespersons] = useState<any[]>([]);

    // Filters
    const [filters, setFilters] = useState<ARReportFilters>({
        paymentStatus: 'all',
        agingBucket: 'all',
        salespersonId: undefined,
        startDate: undefined,
        endDate: undefined
    });
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        loadData();
        loadSalespersons();
    }, []);

    useEffect(() => {
        loadData();
    }, [viewMode, filters]);

    const loadSalespersons = async () => {
        try {
            const users = await UserService.getAll();
            setSalespersons(users.filter(u => u.role === 'sales' || u.role === 'admin'));
        } catch (e) {
            console.error('Failed to load salespersons', e);
        }
    };

    const loadData = async () => {
        setLoading(true);
        try {
            const [summary, customers, invoices] = await Promise.all([
                LedgerService.getARAgingSummary(),
                LedgerService.getAllCustomerBalances(filters),
                LedgerService.getInvoiceBalances(filters)
            ]);

            setAgingSummary(summary);
            setCustomerBalances(customers);
            setInvoiceBalances(invoices);
        } catch (e) {
            console.error('Failed to load AR data', e);
            toast.error('Failed to load credits data');
        } finally {
            setLoading(false);
        }
    };

    // Filter data based on search term
    const filteredCustomers = customerBalances.filter(c =>
        c.customer_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredInvoices = invoiceBalances.filter(i =>
        i.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.invoice_id?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'paid':
                return <Badge color="emerald">Paid</Badge>;
            case 'partial':
                return <Badge color="amber">Partial</Badge>;
            case 'unpaid':
                return <Badge color="red">Unpaid</Badge>;
            default:
                return <Badge color="slate">{status}</Badge>;
        }
    };

    const getAgingBadge = (days: number | null) => {
        if (days === null) return <Badge color="slate">N/A</Badge>;
        if (days <= 30) return <Badge color="emerald">{days}d</Badge>;
        if (days <= 60) return <Badge color="amber">{days}d</Badge>;
        if (days <= 90) return <Badge color="amber">{days}d</Badge>;
        return <Badge color="red">{days}d</Badge>;
    };

    return (
        <div className="p-4 md:p-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">All Credits (AR)</h1>
                    <p className="text-sm text-gray-600">Track all outstanding receivables</p>
                </div>
            </div>

            {/* Aging Summary Cards */}
            <div className="grid grid-cols-5 gap-4 mb-6">
                <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="h-5 w-5 text-blue-600" />
                        <span className="text-xs font-medium text-blue-800 uppercase">Total AR</span>
                    </div>
                    <p className="text-xl font-bold text-blue-900">
                        ₹{agingSummary.total.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </p>
                </Card>

                <Card className={`p-4 cursor-pointer transition-all ${filters.agingBucket === '0-30' ? 'ring-2 ring-green-500' : ''
                    }`} onClick={() => setFilters({ ...filters, agingBucket: filters.agingBucket === '0-30' ? 'all' : '0-30' })}>
                    <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-5 w-5 text-green-600" />
                        <span className="text-xs font-medium text-gray-600">0-30 Days</span>
                    </div>
                    <p className="text-xl font-bold text-green-700">
                        ₹{agingSummary.current.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </p>
                </Card>

                <Card className={`p-4 cursor-pointer transition-all ${filters.agingBucket === '31-60' ? 'ring-2 ring-amber-500' : ''
                    }`} onClick={() => setFilters({ ...filters, agingBucket: filters.agingBucket === '31-60' ? 'all' : '31-60' })}>
                    <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-5 w-5 text-amber-600" />
                        <span className="text-xs font-medium text-gray-600">31-60 Days</span>
                    </div>
                    <p className="text-xl font-bold text-amber-700">
                        ₹{agingSummary.thirtyDays.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </p>
                </Card>

                <Card className={`p-4 cursor-pointer transition-all ${filters.agingBucket === '61-90' ? 'ring-2 ring-orange-500' : ''
                    }`} onClick={() => setFilters({ ...filters, agingBucket: filters.agingBucket === '61-90' ? 'all' : '61-90' })}>
                    <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="h-5 w-5 text-orange-600" />
                        <span className="text-xs font-medium text-gray-600">61-90 Days</span>
                    </div>
                    <p className="text-xl font-bold text-orange-700">
                        ₹{agingSummary.sixtyDays.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </p>
                </Card>

                <Card className={`p-4 cursor-pointer transition-all ${filters.agingBucket === '90+' ? 'ring-2 ring-red-500' : ''
                    }`} onClick={() => setFilters({ ...filters, agingBucket: filters.agingBucket === '90+' ? 'all' : '90+' })}>
                    <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                        <span className="text-xs font-medium text-gray-600">90+ Days</span>
                    </div>
                    <p className="text-xl font-bold text-red-700">
                        ₹{agingSummary.overNinety.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </p>
                </Card>
            </div>

            {/* View Toggle & Search */}
            <div className="flex flex-col md:flex-row gap-4 mb-4">
                {/* View Mode Toggle */}
                <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                        onClick={() => setViewMode('customers')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${viewMode === 'customers'
                            ? 'bg-white text-blue-700 shadow'
                            : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        <Users className="h-4 w-4" />
                        By Customer
                    </button>
                    <button
                        onClick={() => setViewMode('invoices')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${viewMode === 'invoices'
                            ? 'bg-white text-blue-700 shadow'
                            : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        <FileText className="h-4 w-4" />
                        By Invoice
                    </button>
                </div>

                {/* Search */}
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder={viewMode === 'customers' ? 'Search customers...' : 'Search invoices...'}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Filter Toggle */}
                <Button
                    variant="outline"
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2"
                >
                    <Filter className="h-4 w-4" />
                    Filters
                    {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
            </div>

            {/* Expanded Filters */}
            {showFilters && (
                <Card className="p-4 mb-4">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Payment Status</label>
                            <select
                                value={filters.paymentStatus}
                                onChange={(e) => setFilters({ ...filters, paymentStatus: e.target.value as any })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            >
                                <option value="all">All</option>
                                <option value="unpaid">Unpaid</option>
                                <option value="partial">Partial</option>
                                <option value="paid">Paid</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Salesperson</label>
                            <select
                                value={filters.salespersonId || ''}
                                onChange={(e) => setFilters({ ...filters, salespersonId: e.target.value || undefined })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            >
                                <option value="">All</option>
                                {salespersons.map(sp => (
                                    <option key={sp.id} value={sp.id}>{sp.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">From Date</label>
                            <input
                                type="date"
                                value={filters.startDate || ''}
                                onChange={(e) => setFilters({ ...filters, startDate: e.target.value || undefined })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">To Date</label>
                            <input
                                type="date"
                                value={filters.endDate || ''}
                                onChange={(e) => setFilters({ ...filters, endDate: e.target.value || undefined })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            />
                        </div>

                        <div className="flex items-end">
                            <Button
                                variant="outline"
                                onClick={() => setFilters({
                                    paymentStatus: 'all',
                                    agingBucket: 'all',
                                    salespersonId: undefined,
                                    startDate: undefined,
                                    endDate: undefined
                                })}
                                className="w-full"
                            >
                                Clear Filters
                            </Button>
                        </div>
                    </div>
                </Card>
            )}

            {/* Data Table */}
            {loading ? (
                <div className="text-center py-12">
                    <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading data...</p>
                </div>
            ) : viewMode === 'customers' ? (
                /* Customer View */
                <Card className="overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Customer</th>
                                    <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Invoices</th>
                                    <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Total Sales</th>
                                    <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Outstanding</th>
                                    <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">0-30d</th>
                                    <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">31-60d</th>
                                    <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">61-90d</th>
                                    <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">90+d</th>
                                    <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredCustomers.length === 0 ? (
                                    <tr>
                                        <td colSpan={9} className="text-center py-8 text-gray-500">
                                            No customers with outstanding balance
                                        </td>
                                    </tr>
                                ) : (
                                    filteredCustomers.map(customer => (
                                        <tr key={customer.customer_id} className="hover:bg-gray-50">
                                            <td className="py-3 px-4">
                                                <button
                                                    onClick={() => navigate(`/admin/customers/${customer.customer_id}/ledger`)}
                                                    className="text-blue-600 hover:text-blue-800 font-medium text-left"
                                                >
                                                    {customer.customer_name}
                                                </button>
                                            </td>
                                            <td className="py-3 px-4 text-right text-sm text-gray-700">
                                                {customer.total_invoices}
                                            </td>
                                            <td className="py-3 px-4 text-right text-sm text-gray-700">
                                                ₹{customer.total_sales?.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                                            </td>
                                            <td className="py-3 px-4 text-right text-sm font-bold text-gray-900">
                                                ₹{customer.total_outstanding?.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                                            </td>
                                            <td className="py-3 px-4 text-center text-sm text-green-700">
                                                {customer.outstanding_0_30 > 0 && `₹${customer.outstanding_0_30.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`}
                                            </td>
                                            <td className="py-3 px-4 text-center text-sm text-amber-700">
                                                {customer.outstanding_31_60 > 0 && `₹${customer.outstanding_31_60.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`}
                                            </td>
                                            <td className="py-3 px-4 text-center text-sm text-orange-700">
                                                {customer.outstanding_61_90 > 0 && `₹${customer.outstanding_61_90.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`}
                                            </td>
                                            <td className="py-3 px-4 text-center text-sm text-red-700 font-semibold">
                                                {customer.outstanding_over_90 > 0 && `₹${customer.outstanding_over_90.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`}
                                            </td>
                                            <td className="py-3 px-4 text-center">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => navigate(`/admin/customers/${customer.customer_id}/ledger`)}
                                                >
                                                    View Ledger
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            ) : (
                /* Invoice View */
                <Card className="overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Invoice</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Customer</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Delivered</th>
                                    <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Total</th>
                                    <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Paid</th>
                                    <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Returns</th>
                                    <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Outstanding</th>
                                    <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Age</th>
                                    <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredInvoices.length === 0 ? (
                                    <tr>
                                        <td colSpan={9} className="text-center py-8 text-gray-500">
                                            No invoices found
                                        </td>
                                    </tr>
                                ) : (
                                    filteredInvoices.map(invoice => (
                                        <tr key={invoice.invoice_id} className="hover:bg-gray-50">
                                            <td className="py-3 px-4 text-sm font-medium text-blue-600">
                                                {invoice.invoice_id}
                                            </td>
                                            <td className="py-3 px-4">
                                                <button
                                                    onClick={() => navigate(`/admin/customers/${invoice.customer_id}/ledger`)}
                                                    className="text-gray-900 hover:text-blue-600 text-sm"
                                                >
                                                    {invoice.customer_name}
                                                </button>
                                            </td>
                                            <td className="py-3 px-4 text-sm text-gray-600">
                                                {invoice.delivered_at
                                                    ? new Date(invoice.delivered_at).toLocaleDateString('en-IN')
                                                    : '-'
                                                }
                                            </td>
                                            <td className="py-3 px-4 text-right text-sm text-gray-700">
                                                ₹{invoice.invoice_total?.toFixed(2)}
                                            </td>
                                            <td className="py-3 px-4 text-right text-sm text-green-700">
                                                ₹{(invoice.payment_at_delivery + invoice.payments_after_delivery)?.toFixed(2)}
                                            </td>
                                            <td className="py-3 px-4 text-right text-sm text-orange-700">
                                                {invoice.returns_total > 0 && `₹${invoice.returns_total?.toFixed(2)}`}
                                            </td>
                                            <td className="py-3 px-4 text-right text-sm font-bold text-gray-900">
                                                ₹{invoice.outstanding?.toFixed(2)}
                                            </td>
                                            <td className="py-3 px-4 text-center">
                                                {getAgingBadge(invoice.days_since_delivery)}
                                            </td>
                                            <td className="py-3 px-4 text-center">
                                                {getStatusBadge(invoice.payment_status)}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            )}
        </div>
    );
};

export default AllCreditsPage;
