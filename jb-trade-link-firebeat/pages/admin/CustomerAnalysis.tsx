import React, { useState, useEffect, useMemo } from 'react';
import { Card, Button, Input, Select, Badge } from '../../components/ui/Elements';
import { Modal } from '../../components/ui/Modal';
import {
    Users, TrendingUp, TrendingDown, AlertTriangle, MapPin, Search,
    Download, ChevronDown, ChevronUp, ArrowUpDown, Eye, Target,
    BarChart3, Clock, DollarSign, ShieldAlert, Activity, Zap,
    Calendar, Package, CreditCard, RefreshCw, Phone
} from 'lucide-react';
import { Customer, Order, Product } from '../../types';
import { CustomerService, OrderService, ProductService } from '../../services/db';
import { analyzeCustomers, CustomerMetrics, AnalysisSummary } from '../../services/customerAnalysis';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import toast from 'react-hot-toast';

// ============================================================
// STAT CARD
// ============================================================
const StatCard = ({ title, value, subtitle, icon: Icon, color, trend }: {
    title: string; value: string | number; subtitle?: string;
    icon: any; color: string; trend?: 'up' | 'down' | 'neutral';
}) => (
    <div className={`bg-white rounded-xl border-l-4 border-${color}-500 p-4 shadow-sm hover:shadow-md transition-shadow`}>
        <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider truncate">{title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
                {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
            </div>
            <div className={`p-2.5 rounded-lg bg-${color}-50 shrink-0 ml-2`}>
                <Icon className={`h-5 w-5 text-${color}-600`} />
            </div>
        </div>
        {trend && (
            <div className="mt-2 flex items-center gap-1">
                {trend === 'up' ? <TrendingUp className="h-3 w-3 text-green-500" /> : trend === 'down' ? <TrendingDown className="h-3 w-3 text-red-500" /> : null}
            </div>
        )}
    </div>
);

// ============================================================
// SEGMENT & RISK BADGES
// ============================================================
const SegmentBadge = ({ segment }: { segment: string }) => {
    const colorMap: Record<string, string> = {
        '🏆 Champion': 'bg-amber-100 text-amber-800 border-amber-200',
        '💪 Loyal': 'bg-emerald-100 text-emerald-800 border-emerald-200',
        '🌟 Potential': 'bg-blue-100 text-blue-800 border-blue-200',
        '🆕 New': 'bg-cyan-100 text-cyan-800 border-cyan-200',
        '⚠️ At Risk': 'bg-orange-100 text-orange-800 border-orange-200',
        '🔄 Sleepy': 'bg-yellow-100 text-yellow-800 border-yellow-200',
        '😴 Hibernating': 'bg-gray-100 text-gray-700 border-gray-200',
        '💀 Lost': 'bg-red-100 text-red-800 border-red-200',
        '📊 Regular': 'bg-indigo-100 text-indigo-800 border-indigo-200',
    };
    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${colorMap[segment] || 'bg-gray-100 text-gray-700'}`}>
            {segment}
        </span>
    );
};

const RiskBadge = ({ risk }: { risk: string }) => {
    const cls: Record<string, string> = {
        low: 'bg-green-100 text-green-800',
        medium: 'bg-yellow-100 text-yellow-800',
        high: 'bg-orange-100 text-orange-800',
        critical: 'bg-red-100 text-red-800 animate-pulse',
    };
    return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${cls[risk] || cls.low}`}>{risk.toUpperCase()}</span>;
};

const TierBadge = ({ tier, icon }: { tier: string; icon: string }) => (
    <span className="text-xs font-bold">{icon} {tier}</span>
);

// ============================================================
// PIE CHART COLORS
// ============================================================
const SEGMENT_COLORS = ['#f59e0b', '#10b981', '#3b82f6', '#06b6d4', '#f97316', '#eab308', '#6b7280', '#ef4444', '#6366f1'];
const CHURN_COLORS = { low: '#22c55e', medium: '#eab308', high: '#f97316', critical: '#ef4444' };

// ============================================================
// SORT HELPER
// ============================================================
type SortKey = keyof CustomerMetrics;
type SortDir = 'asc' | 'desc';

// ============================================================
// MAIN COMPONENT
// ============================================================
export const CustomerAnalysis: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [loadingProgress, setLoadingProgress] = useState('');
    const [metrics, setMetrics] = useState<CustomerMetrics[]>([]);
    const [summary, setSummary] = useState<AnalysisSummary | null>(null);

    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [filterSegment, setFilterSegment] = useState('all');
    const [filterTier, setFilterTier] = useState('all');
    const [filterChurn, setFilterChurn] = useState('all');
    const [filterRoute, setFilterRoute] = useState('all');
    const [filterGps, setFilterGps] = useState('all');

    // Sort
    const [sortKey, setSortKey] = useState<SortKey>('totalRevenue');
    const [sortDir, setSortDir] = useState<SortDir>('desc');

    // Detail modal
    const [selectedCustomer, setSelectedCustomer] = useState<CustomerMetrics | null>(null);
    const [customerOrders, setCustomerOrders] = useState<Order[]>([]);

    // Tab
    const [activeTab, setActiveTab] = useState<'table' | 'insights' | 'alerts' | 'actions' | 'salesperson' | 'portfolio'>('table');

    // ========== DATA LOADING ==========
    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            setLoadingProgress('Loading customers...');
            const customers = await CustomerService.getAll();
            setLoadingProgress(`Loaded ${customers.length} customers. Loading products...`);
            const products = await ProductService.getAll();
            setLoadingProgress(`Loaded ${products.length} products. Loading orders...`);

            // Load orders in batches - last 365 days for analysis
            const endDate = new Date().toISOString().split('T')[0];
            const startDate = new Date();
            startDate.setFullYear(startDate.getFullYear() - 1);
            const startStr = startDate.toISOString().split('T')[0];

            const orders = await OrderService.getOrdersByDateRangePaged(startStr, endDate);
            setLoadingProgress(`Analyzing ${customers.length} customers × ${orders.length} orders...`);

            const { metrics: m, summary: s } = analyzeCustomers(customers, orders, products);
            setMetrics(m);
            setSummary(s);
            toast.success(`Analysis complete: ${m.length} customers analyzed`);
        } catch (e: any) {
            console.error('[CustomerAnalysis] Failed:', e);
            toast.error(e?.message || 'Failed to load data');
        } finally {
            setLoading(false);
            setLoadingProgress('');
        }
    };

    // ========== FILTERS + SORT ==========
    const routes = useMemo(() => Array.from(new Set(metrics.map(m => m.routeName).filter(Boolean))).sort(), [metrics]);
    const segments = useMemo(() => Array.from(new Set(metrics.map(m => m.rfmSegment))).sort(), [metrics]);

    const filtered = useMemo(() => {
        let result = metrics;
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(m => m.customerName.toLowerCase().includes(term) || m.routeName.toLowerCase().includes(term) || m.primarySalesperson.toLowerCase().includes(term));
        }
        if (filterSegment !== 'all') result = result.filter(m => m.rfmSegment === filterSegment);
        if (filterTier !== 'all') result = result.filter(m => m.tier === filterTier);
        if (filterChurn !== 'all') result = result.filter(m => m.churnRisk === filterChurn);
        if (filterRoute !== 'all') result = result.filter(m => m.routeName === filterRoute);
        if (filterGps !== 'all') result = result.filter(m => filterGps === 'yes' ? m.hasGps : !m.hasGps);

        // Sort
        result = [...result].sort((a, b) => {
            const av = a[sortKey] ?? 0;
            const bv = b[sortKey] ?? 0;
            if (typeof av === 'string' && typeof bv === 'string') return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
            return sortDir === 'asc' ? (av as number) - (bv as number) : (bv as number) - (av as number);
        });
        return result;
    }, [metrics, searchTerm, filterSegment, filterTier, filterChurn, filterRoute, filterGps, sortKey, sortDir]);

    const handleSort = (key: SortKey) => {
        if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
        else { setSortKey(key); setSortDir('desc'); }
    };

    // ========== ALERTS ==========
    const alerts = useMemo(() => {
        const overdueCustomers = metrics.filter(m => m.daysOverdue && m.daysOverdue > 7 && m.totalRevenue > 0).sort((a, b) => (b.daysOverdue || 0) - (a.daysOverdue || 0));
        const approachingDormancy = metrics.filter(m => m.expectedNextOrderDate && !m.daysOverdue && m.daysSinceLastOrder !== null && m.avgGapDays !== null && m.daysSinceLastOrder > m.avgGapDays * 0.8);
        const creditBreach = metrics.filter(m => m.creditUtilization > 100);
        const churnCritical = metrics.filter(m => m.churnRisk === 'critical' && m.totalRevenue > 0);
        return { overdueCustomers, approachingDormancy, creditBreach, churnCritical };
    }, [metrics]);

    // ========== EXPORT ==========
    const handleExport = () => {
        const headers = ['Customer', 'Route', 'Segment', 'Tier', 'Total Orders', 'Total Revenue', 'AOV', 'Last Order', 'Days Since', 'Avg Gap', 'Days Overdue', 'Churn Risk', 'Outstanding', 'Credit Util%', 'GPS', 'Primary SP'];
        const rows = filtered.map(m => [
            m.customerName, m.routeName, m.rfmSegment, m.tier, m.totalOrders, m.totalRevenue.toFixed(0), m.avgOrderValue.toFixed(0),
            m.lastOrderDate || 'Never', m.daysSinceLastOrder ?? '', m.avgGapDays?.toFixed(0) ?? '', m.daysOverdue ?? '',
            m.churnRisk, m.currentOutstanding, m.creditUtilization.toFixed(0), m.hasGps ? 'Yes' : 'No', m.primarySalesperson
        ]);
        const csv = [headers.join(','), ...rows.map(r => r.map(v => `"${v}"`).join(','))].join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = `customer_analysis_${new Date().toISOString().split('T')[0]}.csv`;
        a.click(); URL.revokeObjectURL(url);
        toast.success(`Exported ${filtered.length} customers`);
    };

    // ========== DETAIL VIEW ==========
    const openDetail = async (m: CustomerMetrics) => {
        setSelectedCustomer(m);
        try {
            const { data } = await (await import('../../lib/supabase')).supabase
                .from('orders').select('*').eq('customerId', m.customerId)
                .order('date', { ascending: false }).limit(20);
            setCustomerOrders((data || []) as Order[]);
        } catch { setCustomerOrders([]); }
    };

    // ========== RENDER ==========
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-96 gap-4">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
                    <BarChart3 className="h-6 w-6 text-indigo-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
                <p className="text-sm text-gray-600 font-medium">{loadingProgress || 'Preparing analysis...'}</p>
                <p className="text-xs text-gray-400">This may take 15-30 seconds for large datasets</p>
            </div>
        );
    }

    if (!summary) return <div className="p-8 text-center text-gray-500">No data available.</div>;

    // Chart data
    const segmentChartData = Object.entries(summary.segmentDistribution).map(([name, count]) => ({ name, value: count }));
    const churnChartData = Object.entries(summary.churnDistribution).map(([name, count]) => ({ name: name.toUpperCase(), value: count }));

    const SortHeader = ({ label, field, className = '' }: { label: string; field: SortKey; className?: string }) => (
        <th className={`px-3 py-2.5 text-left text-[10px] font-bold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none ${className}`}
            onClick={() => handleSort(field)}>
            <div className="flex items-center gap-1">
                {label}
                {sortKey === field ? (sortDir === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />) : <ArrowUpDown className="h-2.5 w-2.5 opacity-30" />}
            </div>
        </th>
    );

    return (
        <div className="space-y-5">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Target className="h-6 w-6 text-indigo-600" /> Customer Intelligence
                    </h2>
                    <p className="text-sm text-gray-500 mt-0.5">
                        RFM scoring • Churn prediction • Gap analysis • {metrics.length.toLocaleString()} customers
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={loadData}><RefreshCw className="h-4 w-4 mr-1" />Refresh</Button>
                    <Button variant="outline" onClick={handleExport}><Download className="h-4 w-4 mr-1" />Export CSV</Button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <StatCard title="Active Customers" value={summary.activeCustomers.toLocaleString()} subtitle={`of ${summary.totalCustomers.toLocaleString()} total`} icon={Users} color="blue" />
                <StatCard title="Ordering This Month" value={summary.orderingThisMonth.toLocaleString()} subtitle={`${summary.totalCustomers > 0 ? ((summary.orderingThisMonth / summary.totalCustomers) * 100).toFixed(0) : 0}% penetration`} icon={TrendingUp} color="green" />
                <StatCard title="Dormant / At Risk" value={summary.dormantCount.toLocaleString()} subtitle="Need attention" icon={AlertTriangle} color="orange" />
                <StatCard title="Avg Order Value" value={`₹${summary.avgOrderValue.toFixed(0)}`} subtitle={`MTD: ₹${(summary.totalRevenueMTD / 100000).toFixed(1)}L`} icon={DollarSign} color="indigo" />
            </div>

            {/* Sub-KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <StatCard title="New This Month" value={summary.newThisMonth} icon={Zap} color="cyan" />
                <StatCard title="GPS Compliance" value={`${summary.gpsComplianceRate.toFixed(0)}%`} subtitle="Orders with GPS" icon={MapPin} color="emerald" />
                <StatCard title="Critical Churn" value={summary.churnDistribution['critical'] || 0} subtitle="Urgent outreach needed" icon={ShieldAlert} color="red" />
                <StatCard title="Champions" value={summary.segmentDistribution['🏆 Champion'] || 0} subtitle="Top revenue drivers" icon={Activity} color="amber" />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card className="p-4">
                    <h3 className="text-sm font-bold text-gray-800 mb-3">Customer Segments (RFM)</h3>
                    <div className="h-52">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={segmentChartData} cx="50%" cy="50%" outerRadius={80} innerRadius={40}
                                    dataKey="value" label={({ name, percent }) => `${name.split(' ')[1] || name} ${(percent * 100).toFixed(0)}%`}
                                    labelLine={false} fontSize={9}>
                                    {segmentChartData.map((_, i) => <Cell key={i} fill={SEGMENT_COLORS[i % SEGMENT_COLORS.length]} />)}
                                </Pie>
                                <Tooltip formatter={(v: number) => [v, 'Customers']} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
                <Card className="p-4">
                    <h3 className="text-sm font-bold text-gray-800 mb-3">Churn Risk Distribution</h3>
                    <div className="h-52">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={churnChartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" fontSize={10} />
                                <YAxis fontSize={10} />
                                <Tooltip />
                                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                                    {churnChartData.map((entry, i) => <Cell key={i} fill={(CHURN_COLORS as any)[entry.name.toLowerCase()] || '#6b7280'} />)}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>

            {/* Route Analysis Table */}
            <Card className="p-4">
                <h3 className="text-sm font-bold text-gray-800 mb-3">📍 Route Performance</h3>
                <div className="overflow-x-auto max-h-64 overflow-y-auto">
                    <table className="min-w-full text-sm">
                        <thead className="bg-gray-50 sticky top-0">
                            <tr>
                                <th className="px-3 py-2 text-left text-[10px] font-bold text-gray-600 uppercase">Route</th>
                                <th className="px-3 py-2 text-right text-[10px] font-bold text-gray-600 uppercase">Customers</th>
                                <th className="px-3 py-2 text-right text-[10px] font-bold text-gray-600 uppercase">Ordering</th>
                                <th className="px-3 py-2 text-right text-[10px] font-bold text-gray-600 uppercase">Revenue</th>
                                <th className="px-3 py-2 text-right text-[10px] font-bold text-gray-600 uppercase">AOV</th>
                                <th className="px-3 py-2 text-right text-[10px] font-bold text-gray-600 uppercase">Dormant</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {(() => {
                                const routeMap = new Map<string, { total: number; ordering: number; revenue: number; orders: number; dormant: number }>();
                                metrics.forEach(m => {
                                    const r = m.routeName || 'Unknown';
                                    const existing = routeMap.get(r) || { total: 0, ordering: 0, revenue: 0, orders: 0, dormant: 0 };
                                    existing.total++;
                                    if (m.totalOrders > 0) existing.ordering++;
                                    existing.revenue += m.totalRevenue;
                                    existing.orders += m.totalOrders;
                                    if (m.churnRisk === 'critical' || m.churnRisk === 'high') existing.dormant++;
                                    routeMap.set(r, existing);
                                });
                                return Array.from(routeMap.entries())
                                    .sort((a, b) => b[1].revenue - a[1].revenue)
                                    .slice(0, 20)
                                    .map(([route, data]) => (
                                        <tr key={route} className="hover:bg-gray-50">
                                            <td className="px-3 py-1.5 font-medium text-gray-900">{route}</td>
                                            <td className="px-3 py-1.5 text-right text-gray-700">{data.total}</td>
                                            <td className="px-3 py-1.5 text-right">
                                                <span className={data.ordering / data.total > 0.5 ? 'text-green-600' : 'text-orange-600'}>
                                                    {data.ordering} ({(data.ordering / data.total * 100).toFixed(0)}%)
                                                </span>
                                            </td>
                                            <td className="px-3 py-1.5 text-right font-bold text-gray-900">₹{data.revenue >= 100000 ? `${(data.revenue / 100000).toFixed(1)}L` : data.revenue.toLocaleString()}</td>
                                            <td className="px-3 py-1.5 text-right text-gray-700">₹{data.orders > 0 ? (data.revenue / data.orders).toFixed(0) : '0'}</td>
                                            <td className="px-3 py-1.5 text-right">
                                                {data.dormant > 0 ? <span className="text-red-600 font-medium">{data.dormant}</span> : <span className="text-green-600">0</span>}
                                            </td>
                                        </tr>
                                    ));
                            })()}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Tabs */}
            <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit flex-wrap">
                {([['table', '📋 Health Table'], ['alerts', '⚡ Alerts'], ['actions', '📞 Daily Actions'], ['salesperson', '👤 Salesperson'], ['portfolio', '💼 Strategic Portfolio']] as const).map(([key, label]) => (
                    <button key={key} onClick={() => setActiveTab(key)}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === key ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                        {label}
                    </button>
                ))}
            </div>

            {/* ALERTS TAB */}
            {activeTab === 'alerts' && (
                <div className="space-y-4">
                    {/* Overdue */}
                    <Card className="p-4">
                        <h3 className="text-sm font-bold text-red-700 mb-3 flex items-center gap-2"><AlertTriangle className="h-4 w-4" /> 🔴 Overdue Customers ({alerts.overdueCustomers.length})</h3>
                        {alerts.overdueCustomers.length === 0 ? <p className="text-sm text-gray-500">No overdue customers 🎉</p> : (
                            <div className="space-y-2 max-h-64 overflow-y-auto">
                                {alerts.overdueCustomers.slice(0, 20).map(m => (
                                    <div key={m.customerId} className="flex items-center justify-between p-2.5 bg-red-50 rounded-lg border border-red-100 text-sm cursor-pointer hover:bg-red-100" onClick={() => openDetail(m)}>
                                        <div><span className="font-bold text-gray-900">{m.customerName}</span> <span className="text-gray-500">• {m.routeName}</span></div>
                                        <div className="text-right"><span className="font-bold text-red-700">{m.daysOverdue}d overdue</span> <span className="text-xs text-gray-500 ml-2">~{m.missedOrderCount} missed</span></div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>
                    {/* Critical churn */}
                    <Card className="p-4">
                        <h3 className="text-sm font-bold text-orange-700 mb-3 flex items-center gap-2"><ShieldAlert className="h-4 w-4" /> 🟠 Critical Churn Risk ({alerts.churnCritical.length})</h3>
                        {alerts.churnCritical.length === 0 ? <p className="text-sm text-gray-500">No critical churn risk</p> : (
                            <div className="space-y-2 max-h-64 overflow-y-auto">
                                {alerts.churnCritical.slice(0, 20).map(m => (
                                    <div key={m.customerId} className="flex items-center justify-between p-2.5 bg-orange-50 rounded-lg border border-orange-100 text-sm cursor-pointer hover:bg-orange-100" onClick={() => openDetail(m)}>
                                        <div><span className="font-bold text-gray-900">{m.customerName}</span> <span className="text-gray-500">• ₹{m.totalRevenue.toLocaleString()} lifetime</span></div>
                                        <div className="text-right"><span className="text-xs text-gray-500">Last order: {m.daysSinceLastOrder}d ago</span> <RiskBadge risk={m.churnRisk} /></div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>
                    {/* Credit breach */}
                    <Card className="p-4">
                        <h3 className="text-sm font-bold text-purple-700 mb-3 flex items-center gap-2"><CreditCard className="h-4 w-4" /> 🟣 Credit Limit Breach ({alerts.creditBreach.length})</h3>
                        {alerts.creditBreach.length === 0 ? <p className="text-sm text-gray-500">No credit breaches</p> : (
                            <div className="space-y-2 max-h-64 overflow-y-auto">
                                {alerts.creditBreach.slice(0, 20).map(m => (
                                    <div key={m.customerId} className="flex items-center justify-between p-2.5 bg-purple-50 rounded-lg border border-purple-100 text-sm cursor-pointer hover:bg-purple-100" onClick={() => openDetail(m)}>
                                        <div><span className="font-bold text-gray-900">{m.customerName}</span></div>
                                        <div className="text-right"><span className="text-red-700 font-bold">₹{m.currentOutstanding.toLocaleString()}</span> / <span className="text-gray-500">₹{m.creditLimit.toLocaleString()}</span> <span className="font-bold text-red-600 ml-1">({m.creditUtilization.toFixed(0)}%)</span></div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>
                </div>
            )}

            {/* DAILY ACTIONS TAB - MAXIMIZE SALES POWER PLAN */}
            {activeTab === 'actions' && (
                <div className="space-y-4">
                    <Card className="p-4 bg-gradient-to-r from-indigo-600 to-blue-700 text-white border-none">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-black flex items-center gap-2 italic tracking-tighter">
                                    <Zap className="h-5 w-5 fill-yellow-400 text-yellow-400" /> TODAYS REVENUE MAXIMIZER
                                </h3>
                                <p className="text-xs text-indigo-100 opacity-90">Prioritized follow-ups for {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-black">₹{(metrics.filter(m => m.suggestedActionScore > 50).reduce((s, m) => s + m.avgOrderValue, 0) / 100000).toFixed(1)}L</div>
                                <div className="text-[10px] uppercase font-bold text-indigo-200">Potential pipeline value</div>
                            </div>
                        </div>
                    </Card>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        {/* THE PRIORITY QUEUE (TOP 15) */}
                        <div className="lg:col-span-2 space-y-4">
                            <Card className="p-4">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                                        🎯 High Priority Queue
                                        <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded-full uppercase">Action Required</span>
                                    </h3>
                                    <div className="flex gap-1">
                                        {['Recovery', 'Growth', 'Relationship'].map(t => (
                                            <span key={t} className={`text-[9px] px-1.5 py-0.5 rounded border ${t === 'Recovery' ? 'bg-red-50 text-red-600 border-red-100' : t === 'Growth' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>{t}</span>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                                    {metrics
                                        .filter(m => m.suggestedActionScore > 0)
                                        .sort((a, b) => b.suggestedActionScore - a.suggestedActionScore)
                                        .slice(0, 20)
                                        .map((m, idx) => (
                                            <div key={m.customerId} 
                                                className="group flex items-start gap-3 p-3 bg-white border border-gray-100 rounded-xl hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer relative overflow-hidden"
                                                onClick={() => openDetail(m)}>
                                                
                                                {/* Priority Marker */}
                                                <div className={`absolute left-0 top-0 bottom-0 w-1 ${m.suggestedActionType === 'Recovery' ? 'bg-red-500' : m.suggestedActionType === 'Growth' ? 'bg-emerald-500' : 'bg-blue-500'}`} />

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-[10px] font-black text-gray-400">#{idx + 1}</span>
                                                        <h4 className="font-bold text-gray-900 truncate text-sm">{m.customerName}</h4>
                                                        <span className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase ${m.suggestedActionType === 'Recovery' ? 'bg-red-50 text-red-600' : m.suggestedActionType === 'Growth' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>{m.suggestedActionType}</span>
                                                    </div>
                                                    <div className="flex items-center gap-3 text-[11px] text-gray-500">
                                                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {m.routeName}</span>
                                                        <span className="flex items-center gap-1"><Package className="h-3 w-3" /> LTV: ₹{(m.totalRevenue/1000).toFixed(0)}k</span>
                                                        <span className="flex items-center gap-1"><TrendingUp className="h-3 w-3" /> Grade {m.abcClassification}</span>
                                                    </div>
                                                    <div className="mt-2 text-xs font-medium text-gray-700 bg-gray-50 p-2 rounded-lg border border-gray-100 italic">
                                                        {m.suggestedActionType === 'Recovery' ? `🚨 CRITICAL: Missing for ${m.daysSinceLastOrder}d. Expected gap was ${m.avgGapDays?.toFixed(0)}d.` : 
                                                         m.suggestedActionType === 'Growth' ? `💰 UPSELL: Only buying ${m.brandPenetrationCount} brands. Low brand depth identified.` : 
                                                         `🤝 NURTURE: New relationship. Ensure ${m.totalOrders === 1 ? 'second' : 'third'} order is secured.`}
                                                    </div>
                                                </div>

                                                <div className="text-right shrink-0">
                                                    <div className="text-xs font-black text-indigo-600 uppercase mb-1">Impact: High</div>
                                                    <div className="flex flex-col gap-1">
                                                        <button className="px-2 py-1 bg-indigo-600 text-white rounded text-[10px] font-bold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-1">
                                                            <Phone className="h-2.5 w-2.5" /> CALL
                                                        </button>
                                                        <button className="px-2 py-1 bg-white border border-gray-200 text-gray-700 rounded text-[10px] font-bold hover:bg-gray-50 transition-colors flex items-center justify-center gap-1">
                                                            <Calendar className="h-2.5 w-2.5" /> VISIT
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </Card>
                        </div>

                        {/* SIDEBAR: ROUTE & FOCUS */}
                        <div className="space-y-4">
                            {/* Route Planner */}
                            <Card className="p-4">
                                <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">📍 Efficient Route Targets</h3>
                                <div className="space-y-2">
                                    {(() => {
                                        const routeGroups = new Map<string, number>();
                                        metrics.filter(m => m.suggestedActionScore > 40).forEach(m => {
                                            routeGroups.set(m.routeName, (routeGroups.get(m.routeName) || 0) + 1);
                                        });
                                        return Array.from(routeGroups.entries())
                                            .sort((a, b) => b[1] - a[1])
                                            .slice(0, 5)
                                            .map(([route, count]) => (
                                                <div key={route} className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg border border-gray-100">
                                                    <div>
                                                        <div className="text-xs font-bold text-gray-900">{route}</div>
                                                        <div className="text-[10px] text-gray-500">{count} urgent follow-ups</div>
                                                    </div>
                                                    <span className="text-[10px] bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded font-bold uppercase">Plan Visit</span>
                                                </div>
                                            ));
                                    })()}
                                </div>
                            </Card>

                            {/* Momentum Wins */}
                            <Card className="p-4 border-l-4 border-emerald-500">
                                <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">🚀 Growth Acceleration</h3>
                                <p className="text-[10px] text-gray-500 mb-3">Customers with 50%+ momentum. Nurture these for rapid expansion.</p>
                                <div className="space-y-2 max-h-64 overflow-y-auto">
                                    {metrics
                                        .filter(m => m.revenueMomentum > 30 && m.abcClassification !== 'C')
                                        .sort((a, b) => b.revenueMomentum - a.revenueMomentum)
                                        .slice(0, 10)
                                        .map(m => (
                                            <div key={m.customerId} className="flex justify-between items-center p-2 hover:bg-emerald-50 rounded transition-colors cursor-pointer" onClick={() => openDetail(m)}>
                                                <div className="min-w-0">
                                                    <div className="text-xs font-bold text-gray-900 truncate">{m.customerName}</div>
                                                    <div className="text-[9px] text-emerald-600 font-bold">+{m.revenueMomentum.toFixed(0)}% growth</div>
                                                </div>
                                                <div className="text-[9px] text-gray-400">AOV ₹{(m.avgOrderValue/1000).toFixed(1)}k</div>
                                            </div>
                                        ))}
                                </div>
                            </Card>

                            {/* Hygiene Alerts */}
                            <Card className="p-4 bg-slate-50 border border-slate-200">
                                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-widest mb-3">🛠️ Admin Maintenance</h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-[11px]">
                                        <span className="text-gray-500">Missing GPS</span>
                                        <span className="font-bold text-red-600">{metrics.filter(m => m.isActive && !m.hasGps).length} accounts</span>
                                    </div>
                                    <div className="flex justify-between text-[11px]">
                                        <span className="text-gray-500">Missing PAN</span>
                                        <span className="font-bold text-amber-600">{metrics.filter(m => m.abcClassification === 'A' && m.profileCompleteness < 100).length} premium</span>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            )}


            {/* SALESPERSON TAB */}
            {activeTab === 'salesperson' && (
                <div className="space-y-4">
                    <Card className="p-4">
                        <h3 className="text-sm font-bold text-gray-800 mb-3">👤 Salesperson — Customer Coverage Matrix</h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-2.5 text-left text-[10px] font-bold text-gray-600 uppercase">Salesperson</th>
                                        <th className="px-3 py-2.5 text-right text-[10px] font-bold text-gray-600 uppercase">Customers</th>
                                        <th className="px-3 py-2.5 text-right text-[10px] font-bold text-gray-600 uppercase">Active</th>
                                        <th className="px-3 py-2.5 text-right text-[10px] font-bold text-gray-600 uppercase">Revenue</th>
                                        <th className="px-3 py-2.5 text-right text-[10px] font-bold text-gray-600 uppercase">AOV</th>
                                        <th className="px-3 py-2.5 text-right text-[10px] font-bold text-gray-600 uppercase">Orders</th>
                                        <th className="px-3 py-2.5 text-right text-[10px] font-bold text-gray-600 uppercase">Dormant</th>
                                        <th className="px-3 py-2.5 text-right text-[10px] font-bold text-gray-600 uppercase">Coverage%</th>
                                        <th className="px-3 py-2.5 text-right text-[10px] font-bold text-gray-600 uppercase">Champions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {(() => {
                                        const spMap = new Map<string, {
                                            name: string; customers: Set<string>; revenue: number;
                                            orders: number; dormant: number; active: number; champions: number;
                                        }>();
                                        metrics.forEach(m => {
                                            if (!m.primarySalesperson || m.primarySalesperson === 'N/A') return;
                                            const key = m.primarySalespersonId || m.primarySalesperson;
                                            const existing = spMap.get(key) || {
                                                name: m.primarySalesperson, customers: new Set<string>(),
                                                revenue: 0, orders: 0, dormant: 0, active: 0, champions: 0
                                            };
                                            existing.customers.add(m.customerId);
                                            existing.revenue += m.totalRevenue;
                                            existing.orders += m.totalOrders;
                                            if (m.churnRisk === 'critical' || m.churnRisk === 'high') existing.dormant++;
                                            if (m.totalOrders > 0 && m.daysSinceLastOrder !== null && m.daysSinceLastOrder < 45) existing.active++;
                                            if (m.rfmSegment === '🏆 Champion' || m.rfmSegment === '💪 Loyal') existing.champions++;
                                            spMap.set(key, existing);
                                        });
                                        return Array.from(spMap.entries())
                                            .sort((a, b) => b[1].revenue - a[1].revenue)
                                            .map(([id, sp]) => {
                                                const custCount = sp.customers.size;
                                                const coverage = custCount > 0 ? (sp.active / custCount * 100) : 0;
                                                return (
                                                    <tr key={id} className="hover:bg-indigo-50/30">
                                                        <td className="px-4 py-2.5 font-medium text-gray-900">{sp.name}</td>
                                                        <td className="px-3 py-2.5 text-right text-gray-700">{custCount}</td>
                                                        <td className="px-3 py-2.5 text-right text-green-600 font-medium">{sp.active}</td>
                                                        <td className="px-3 py-2.5 text-right font-bold text-gray-900">₹{sp.revenue >= 100000 ? `${(sp.revenue / 100000).toFixed(1)}L` : sp.revenue.toLocaleString()}</td>
                                                        <td className="px-3 py-2.5 text-right text-gray-700">₹{sp.orders > 0 ? (sp.revenue / sp.orders).toFixed(0) : '0'}</td>
                                                        <td className="px-3 py-2.5 text-right text-gray-700">{sp.orders}</td>
                                                        <td className="px-3 py-2.5 text-right">
                                                            {sp.dormant > 0 ? <span className="text-red-600 font-bold">{sp.dormant}</span> : <span className="text-green-600">0</span>}
                                                        </td>
                                                        <td className="px-3 py-2.5 text-right">
                                                            <span className={`font-bold ${coverage >= 70 ? 'text-green-600' : coverage >= 40 ? 'text-amber-600' : 'text-red-600'}`}>
                                                                {coverage.toFixed(0)}%
                                                            </span>
                                                        </td>
                                                        <td className="px-3 py-2.5 text-right">
                                                            {sp.champions > 0 ? <span className="text-amber-600 font-bold">🏆 {sp.champions}</span> : <span className="text-gray-400">0</span>}
                                                        </td>
                                                    </tr>
                                                );
                                            });
                                    })()}
                                </tbody>
                            </table>
                        </div>
                    </Card>

                    {/* Under-served / Over-served */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <Card className="p-4">
                            <h3 className="text-sm font-bold text-orange-700 mb-3">⚠️ Under-Served Customers ({metrics.filter(m => m.totalOrders > 3 && m.daysSinceLastOrder !== null && m.avgGapDays !== null && m.daysSinceLastOrder > m.avgGapDays * 1.5).length})</h3>
                            <p className="text-xs text-gray-500 mb-2">Active customers visited less frequently than their buying pattern suggests.</p>
                            <div className="space-y-1.5 max-h-56 overflow-y-auto">
                                {metrics
                                    .filter(m => m.totalOrders > 3 && m.daysSinceLastOrder !== null && m.avgGapDays !== null && m.daysSinceLastOrder > m.avgGapDays * 1.5)
                                    .sort((a, b) => b.totalRevenue - a.totalRevenue)
                                    .slice(0, 15)
                                    .map(m => (
                                        <div key={m.customerId} className="flex justify-between items-center p-2 bg-orange-50 rounded text-sm cursor-pointer hover:bg-orange-100" onClick={() => openDetail(m)}>
                                            <span className="font-medium text-gray-900">{m.customerName} <span className="text-xs text-gray-500">({m.primarySalesperson})</span></span>
                                            <span className="text-xs text-orange-700">{m.daysSinceLastOrder}d / avg {m.avgGapDays?.toFixed(0)}d</span>
                                        </div>
                                    ))}
                            </div>
                        </Card>
                        <Card className="p-4">
                            <h3 className="text-sm font-bold text-blue-700 mb-3">📍 Unvisited Active Customers ({metrics.filter(m => m.isActive && m.totalOrders === 0).length})</h3>
                            <p className="text-xs text-gray-500 mb-2">Active customers in the system who have never placed an order.</p>
                            <div className="space-y-1.5 max-h-56 overflow-y-auto">
                                {metrics
                                    .filter(m => m.isActive && m.totalOrders === 0)
                                    .slice(0, 15)
                                    .map(m => (
                                        <div key={m.customerId} className="flex justify-between items-center p-2 bg-blue-50 rounded text-sm cursor-pointer hover:bg-blue-100" onClick={() => openDetail(m)}>
                                            <span className="font-medium text-gray-900">{m.customerName}</span>
                                            <span className="text-xs text-gray-500">{m.routeName || 'No route'}</span>
                                        </div>
                                    ))}
                                {metrics.filter(m => m.isActive && m.totalOrders === 0).length === 0 && (
                                    <p className="text-sm text-gray-500 py-2">All active customers have ordered</p>
                                )}
                            </div>
                        </Card>
                    </div>
                </div>
            )}

            {/* PORTFOLIO STRATEGY TAB */}
            {activeTab === 'portfolio' && (
                <div className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {/* ABC Revenue Pareto Chart */}
                        <Card className="p-4">
                            <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center justify-between">
                                📊 ABC Revenue Concentration (A=80%)
                                <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded uppercase font-bold">Salesforce Tier View</span>
                            </h3>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={['A', 'B', 'C'].map(grade => {
                                        const subset = metrics.filter(m => m.abcClassification === grade);
                                        const rev = subset.reduce((s, m) => s + m.totalRevenue, 0);
                                        return { name: `Grade ${grade}`, count: subset.length, revenue: Math.round(rev) };
                                    })}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="name" fontSize={10} />
                                        <YAxis yAxisId="left" orientation="left" stroke="#6366f1" fontSize={10} />
                                        <YAxis yAxisId="right" orientation="right" stroke="#10b981" fontSize={10} tickFormatter={(v) => `₹${(v/100000).toFixed(1)}L`} />
                                        <Tooltip />
                                        <Bar yAxisId="left" dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} name="Account count" />
                                        <Bar yAxisId="right" dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} name="Revenue" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="mt-3 flex gap-4 justify-center text-[10px] text-gray-500">
                                <span className="flex items-center gap-1"><div className="w-2 h-2 bg-indigo-500 rounded-sm"></div> Count</span>
                                <span className="flex items-center gap-1"><div className="w-2 h-2 bg-emerald-500 rounded-sm"></div> Revenue contribution</span>
                            </div>
                        </Card>

                        {/* Revenue Momentum Index */}
                        <Card className="p-4">
                            <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center justify-between">
                                📈 Portfolio Growth Vector
                                <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded uppercase font-bold">Momentum Index</span>
                            </h3>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={[
                                        { range: 'Crit Decline (-50% )', val: metrics.filter(m => m.revenueMomentum <= -50 && m.totalOrders > 0).length, fill: '#ef4444' },
                                        { range: 'Declining (-10 to -50%)', val: metrics.filter(m => m.revenueMomentum > -50 && m.revenueMomentum < -10).length, fill: '#f97316' },
                                        { range: 'Stable (±10%)', val: metrics.filter(m => Math.abs(m.revenueMomentum) <= 10 && m.totalOrders > 0).length, fill: '#94a3b8' },
                                        { range: 'Growing (+10 to +50%)', val: metrics.filter(m => m.revenueMomentum > 10 && m.revenueMomentum < 50).length, fill: '#3b82f6' },
                                        { range: 'High Growth (+50% )', val: metrics.filter(m => m.revenueMomentum >= 50).length, fill: '#10b981' },
                                    ]}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="range" fontSize={10} interval={0} angle={-30} textAnchor="end" height={60} />
                                        <YAxis fontSize={10} />
                                        <Tooltip />
                                        <Bar dataKey="val" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>
                    </div>

                    {/* Quality Index & Brands */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="p-4 bg-indigo-50 border-indigo-100">
                            <h4 className="text-xs font-bold text-indigo-800 mb-2 uppercase tracking-tighter">Account Quality Index</h4>
                            <div className="flex items-end gap-2">
                                <div className="text-3xl font-black text-indigo-900">
                                    {(metrics.reduce((s, m) => s + m.profileCompleteness, 0) / metrics.length).toFixed(1)}%
                                </div>
                                <div className="text-xs text-indigo-600 mb-1">Avg completeness</div>
                            </div>
                            <div className="mt-2 w-full h-1.5 bg-indigo-100 rounded-full overflow-hidden">
                                <div className="h-full bg-indigo-600" style={{ width: `${(metrics.reduce((s, m) => s + m.profileCompleteness, 0) / metrics.length)}%` }} />
                            </div>
                        </Card>
                        <Card className="p-4 bg-emerald-50 border-emerald-100">
                            <h4 className="text-xs font-bold text-emerald-800 mb-2 uppercase tracking-tighter">Average Brand Depth</h4>
                            <div className="flex items-end gap-2">
                                <div className="text-3xl font-black text-emerald-900">
                                    {(metrics.filter(m => m.totalOrders > 0).reduce((s, m) => s + m.brandPenetrationCount, 0) / (metrics.filter(m => m.totalOrders > 0).length || 1)).toFixed(1)}
                                </div>
                                <div className="text-xs text-emerald-600 mb-1">Brands per client</div>
                            </div>
                            <p className="text-[10px] text-emerald-700 mt-2">Available global brands: {metrics[0]?.totalAvailableBrands || 0}</p>
                        </Card>
                        <Card className="p-4 bg-amber-50 border-amber-100">
                            <h4 className="text-xs font-bold text-amber-800 mb-2 uppercase tracking-tighter">High Yield Efficiency</h4>
                            <div className="flex items-end gap-2">
                                <div className="text-3xl font-black text-amber-900">
                                    {(metrics.filter(m => m.abcClassification === 'A').length / metrics.length * 100).toFixed(0)}%
                                </div>
                                <div className="text-xs text-amber-600 mb-1">Customers = 80% Rev</div>
                            </div>
                            <p className="text-[10px] text-amber-700 mt-2">Concentration ratio: 80/{(metrics.filter(m => m.abcClassification === 'A').length / metrics.length * 100).toFixed(0)}</p>
                        </Card>
                    </div>

                    {/* Strategic Portfolio Table */}
                    <Card className="p-4">
                        <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">🧺 Brand Penetration matrix</h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm">
                                <thead className="bg-gray-50 uppercase text-[10px] font-bold text-gray-500">
                                    <tr>
                                        <th className="px-4 py-2 text-left">Revenue Classification</th>
                                        <th className="px-3 py-2 text-right">Count</th>
                                        <th className="px-3 py-2 text-right">Revenue Contrib.</th>
                                        <th className="px-3 py-2 text-right">Avg Brand Depth</th>
                                        <th className="px-3 py-2 text-right">Churn Risk</th>
                                        <th className="px-3 py-2 text-right">Momentum Index</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {['A', 'B', 'C'].map(rank => {
                                        const sub = metrics.filter(m => m.abcClassification === rank);
                                        const totalRev = sub.reduce((s, m) => s + m.totalRevenue, 0);
                                        const avgDepth = sub.reduce((s, m) => s + m.brandPenetrationCount, 0) / (sub.length || 1);
                                        const avgMomentum = sub.reduce((s, m) => s + m.revenueMomentum, 0) / (sub.length || 1);
                                        const highRiskCount = sub.filter(m => m.churnRisk === 'critical' || m.churnRisk === 'high').length;

                                        return (
                                            <tr key={rank} className="border-t border-gray-100 hover:bg-gray-50/50">
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-2">
                                                        <span className={`w-6 h-6 rounded flex items-center justify-center font-bold text-xs ${rank === 'A' ? 'bg-indigo-100 text-indigo-700' : rank === 'B' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'}`}>{rank}</span>
                                                        <span className="font-medium text-gray-900">
                                                            {rank === 'A' ? 'Core Assets' : rank === 'B' ? 'Growth Potentials' : 'Marginal Accounts'}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-3 py-3 text-right text-gray-700">{sub.length}</td>
                                                <td className="px-3 py-3 text-right font-bold text-gray-900">₹{(totalRev/100000).toFixed(1)}L</td>
                                                <td className="px-3 py-3 text-right">{avgDepth.toFixed(1)} brands</td>
                                                <td className="px-3 py-3 text-right">
                                                   {highRiskCount > 0 ? <span className="text-red-600 font-bold">{highRiskCount} at risk</span> : <span className="text-green-600">Stable</span>}
                                                </td>
                                                <td className={`px-3 py-3 text-right font-bold ${avgMomentum > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                    {avgMomentum > 0 ? '+' : ''}{avgMomentum.toFixed(1)}%
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
            )}

            {/* TABLE TAB */}
            {activeTab === 'table' && (
                <>
                    {/* Filters */}
                    <Card className="p-3">
                        <div className="flex flex-wrap gap-2 items-end">
                            <div className="w-56">
                                <div className="relative">
                                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                                    <input type="text" placeholder="Search name, route, SP..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                                        className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                                </div>
                            </div>
                            <select className="border border-gray-200 rounded-lg px-2 py-2 text-sm" value={filterSegment} onChange={e => setFilterSegment(e.target.value)}>
                                <option value="all">All Segments</option>
                                {segments.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                            <select className="border border-gray-200 rounded-lg px-2 py-2 text-sm" value={filterTier} onChange={e => setFilterTier(e.target.value)}>
                                <option value="all">All Tiers</option>
                                {['Platinum', 'Gold', 'Silver', 'Bronze'].map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                            <select className="border border-gray-200 rounded-lg px-2 py-2 text-sm" value={filterChurn} onChange={e => setFilterChurn(e.target.value)}>
                                <option value="all">All Risk</option>
                                {['critical', 'high', 'medium', 'low'].map(r => <option key={r} value={r}>{r.toUpperCase()}</option>)}
                            </select>
                            <select className="border border-gray-200 rounded-lg px-2 py-2 text-sm" value={filterRoute} onChange={e => setFilterRoute(e.target.value)}>
                                <option value="all">All Routes</option>
                                {routes.map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                            <select className="border border-gray-200 rounded-lg px-2 py-2 text-sm" value={filterGps} onChange={e => setFilterGps(e.target.value)}>
                                <option value="all">GPS: All</option>
                                <option value="yes">Has GPS</option>
                                <option value="no">No GPS</option>
                            </select>
                            <span className="text-xs text-gray-500 ml-auto">{filtered.length} results</span>
                        </div>
                    </Card>

                    {/* Table */}
                    <Card className="overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-3 py-2.5 text-[10px] font-bold text-gray-600 uppercase">Rank</th>
                                        <th className="px-3 py-2.5 text-[10px] font-bold text-gray-600 uppercase">Trend</th>
                                        <SortHeader label="Customer" field="customerName" />
                                        <SortHeader label="Segment" field="rfmSegment" />
                                        <SortHeader label="Tier" field="tier" />
                                        <SortHeader label="Orders" field="totalOrders" />
                                        <SortHeader label="Revenue" field="totalRevenue" />
                                        <SortHeader label="AOV" field="avgOrderValue" />
                                        <SortHeader label="Last Order" field="daysSinceLastOrder" />
                                        <SortHeader label="Avg Gap" field="avgGapDays" />
                                        <SortHeader label="Overdue" field="daysOverdue" />
                                        <SortHeader label="Churn" field="churnScore" />
                                        <SortHeader label="Outstanding" field="currentOutstanding" />
                                        <th className="px-3 py-2.5 text-[10px] font-bold text-gray-600 uppercase">GPS</th>
                                        <th className="px-3 py-2.5 text-[10px] font-bold text-gray-600 uppercase text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100">
                                    {filtered.slice(0, 200).map(m => (
                                        <tr key={m.customerId} className="hover:bg-indigo-50/30 transition-colors">
                                            <td className="px-3 py-2.5 whitespace-nowrap">
                                                <span className={`px-1.5 py-0.5 text-[9px] font-black rounded ${m.abcClassification === 'A' ? 'bg-indigo-600 text-white' : m.abcClassification === 'B' ? 'bg-blue-500 text-white' : 'bg-slate-400 text-white'}`}>
                                                    {m.abcClassification}
                                                </span>
                                            </td>
                                            <td className="px-3 py-2.5 whitespace-nowrap">
                                                <div className="flex flex-col">
                                                    <span className={`text-[11px] font-bold ${m.revenueMomentum > 10 ? 'text-green-600' : m.revenueMomentum < -10 ? 'text-red-600' : 'text-gray-500'}`}>
                                                        {m.revenueMomentum > 10 ? '📈' : m.revenueMomentum < -10 ? '📉' : '↔️'} {m.revenueMomentum.toFixed(0)}%
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-3 py-2.5 whitespace-nowrap">
                                                <div className="font-medium text-sm text-gray-900 max-w-[180px] truncate">{m.customerName}</div>
                                                <div className="text-[10px] text-gray-500">{m.routeName || '—'} • {m.primarySalesperson}</div>
                                            </td>
                                            <td className="px-3 py-2.5"><SegmentBadge segment={m.rfmSegment} /></td>
                                            <td className="px-3 py-2.5"><TierBadge tier={m.tier} icon={m.tierIcon} /></td>
                                            <td className="px-3 py-2.5 text-sm font-medium text-gray-900">{m.totalOrders}</td>
                                            <td className="px-3 py-2.5 text-sm font-bold text-gray-900">₹{m.totalRevenue >= 100000 ? `${(m.totalRevenue / 100000).toFixed(1)}L` : m.totalRevenue.toLocaleString()}</td>
                                            <td className="px-3 py-2.5 text-sm text-gray-700">₹{m.avgOrderValue.toFixed(0)}</td>
                                            <td className="px-3 py-2.5">
                                                {m.lastOrderDate ? (
                                                    <div>
                                                        <div className={`text-sm font-medium ${(m.daysSinceLastOrder || 0) > 30 ? 'text-red-600' : 'text-gray-900'}`}>{m.daysSinceLastOrder}d ago</div>
                                                        <div className="text-[10px] text-gray-400">{m.lastOrderDate}</div>
                                                    </div>
                                                ) : <span className="text-xs text-gray-400">Never</span>}
                                            </td>
                                            <td className="px-3 py-2.5 text-sm text-gray-700">{m.avgGapDays ? `${m.avgGapDays.toFixed(0)}d` : '—'}</td>
                                            <td className="px-3 py-2.5">
                                                {m.daysOverdue ? <span className="text-sm font-bold text-red-600">{m.daysOverdue}d</span> : <span className="text-xs text-green-600">✓</span>}
                                            </td>
                                            <td className="px-3 py-2.5"><RiskBadge risk={m.churnRisk} /></td>
                                            <td className="px-3 py-2.5 text-sm">
                                                {m.currentOutstanding > 0 ? (
                                                    <span className={m.creditUtilization > 100 ? 'text-red-600 font-bold' : 'text-gray-700'}>₹{m.currentOutstanding.toLocaleString()}</span>
                                                ) : <span className="text-gray-400">—</span>}
                                            </td>
                                            <td className="px-3 py-2.5">{m.hasGps ? <span className="text-green-600 text-xs">📍</span> : <span className="text-red-400 text-xs">✗</span>}</td>
                                            <td className="px-3 py-2.5 text-right">
                                                <button onClick={() => openDetail(m)} className="text-indigo-600 hover:text-indigo-800 p-1 hover:bg-indigo-50 rounded"><Eye className="h-4 w-4" /></button>
                                            </td>
                                        </tr>
                                    ))}
                                    {filtered.length === 0 && <tr><td colSpan={13} className="p-8 text-center text-gray-500">No customers match filters</td></tr>}
                                </tbody>
                            </table>
                        </div>
                        {filtered.length > 200 && <div className="text-center py-2 text-xs text-gray-500 bg-gray-50 border-t">Showing 200 of {filtered.length} results. Use filters to narrow down.</div>}
                    </Card>
                </>
            )}

            {/* DETAIL MODAL */}
            <Modal isOpen={!!selectedCustomer} onClose={() => setSelectedCustomer(null)} title={selectedCustomer?.customerName || ''} size="lg">
                {selectedCustomer && (
                    <div className="space-y-4 max-h-[70vh] overflow-y-auto">
                        {/* Top badges */}
                        <div className="flex flex-wrap gap-2 items-center">
                            <SegmentBadge segment={selectedCustomer.rfmSegment} />
                            <TierBadge tier={selectedCustomer.tier} icon={selectedCustomer.tierIcon} />
                            <RiskBadge risk={selectedCustomer.churnRisk} />
                            {selectedCustomer.hasGps ? <span className="text-xs text-green-600 font-medium">📍 GPS ✓</span> : <span className="text-xs text-red-500 font-medium">⚠ No GPS</span>}
                        </div>

                        {/* Key Metrics Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <div className="bg-gray-50 rounded-lg p-3"><p className="text-[10px] text-gray-500 uppercase font-bold">Total Orders</p><p className="text-lg font-bold text-gray-900">{selectedCustomer.totalOrders}</p></div>
                            <div className="bg-gray-50 rounded-lg p-3"><p className="text-[10px] text-gray-500 uppercase font-bold">Lifetime Revenue</p><p className="text-lg font-bold text-indigo-700">₹{selectedCustomer.totalRevenue.toLocaleString()}</p></div>
                            <div className="bg-gray-50 rounded-lg p-3"><p className="text-[10px] text-gray-500 uppercase font-bold">Avg Order Value</p><p className="text-lg font-bold text-gray-900">₹{selectedCustomer.avgOrderValue.toFixed(0)}</p></div>
                            <div className="bg-gray-50 rounded-lg p-3"><p className="text-[10px] text-gray-500 uppercase font-bold">Days Since Last</p><p className={`text-lg font-bold ${(selectedCustomer.daysSinceLastOrder || 0) > 30 ? 'text-red-600' : 'text-green-600'}`}>{selectedCustomer.daysSinceLastOrder ?? 'N/A'}</p></div>
                        </div>

                        {/* Detail cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Frequency */}
                            <div className="border rounded-lg p-3">
                                <h4 className="text-xs font-bold text-gray-700 mb-2 flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> Frequency & Gap</h4>
                                <div className="space-y-1 text-sm">
                                    <div className="flex justify-between"><span className="text-gray-500">Avg Gap</span><span className="font-medium">{selectedCustomer.avgGapDays?.toFixed(0) || '—'} days</span></div>
                                    <div className="flex justify-between"><span className="text-gray-500">Median Gap</span><span className="font-medium">{selectedCustomer.medianGapDays?.toFixed(0) || '—'} days</span></div>
                                    <div className="flex justify-between"><span className="text-gray-500">Shortest</span><span className="font-medium">{selectedCustomer.shortestGap ?? '—'}d</span></div>
                                    <div className="flex justify-between"><span className="text-gray-500">Longest</span><span className="font-medium">{selectedCustomer.longestGap ?? '—'}d</span></div>
                                    <div className="flex justify-between"><span className="text-gray-500">Regularity</span><span className="font-medium">{selectedCustomer.regularityScore ? `${(selectedCustomer.regularityScore * 100).toFixed(0)}%` : '—'}</span></div>
                                    <div className="flex justify-between"><span className="text-gray-500">Expected Next</span><span className="font-medium">{selectedCustomer.expectedNextOrderDate || '—'}</span></div>
                                    {selectedCustomer.daysOverdue && <div className="flex justify-between"><span className="text-red-600 font-medium">Overdue</span><span className="font-bold text-red-600">{selectedCustomer.daysOverdue}d ({selectedCustomer.missedOrderCount} missed)</span></div>}
                                </div>
                            </div>
                            {/* Financial */}
                            <div className="border rounded-lg p-3">
                                <h4 className="text-xs font-bold text-gray-700 mb-2 flex items-center gap-1"><DollarSign className="h-3.5 w-3.5" /> Financial</h4>
                                <div className="space-y-1 text-sm">
                                    <div className="flex justify-between"><span className="text-gray-500">Outstanding</span><span className={`font-medium ${selectedCustomer.creditUtilization > 100 ? 'text-red-600' : ''}`}>₹{selectedCustomer.currentOutstanding.toLocaleString()}</span></div>
                                    <div className="flex justify-between"><span className="text-gray-500">Credit Limit</span><span className="font-medium">₹{selectedCustomer.creditLimit.toLocaleString()}</span></div>
                                    <div className="flex justify-between"><span className="text-gray-500">Utilization</span><span className="font-medium">{selectedCustomer.creditUtilization.toFixed(0)}%</span></div>
                                    <div className="flex justify-between"><span className="text-gray-500">Payment Pref</span><span className="font-medium">{selectedCustomer.paymentPreference}</span></div>
                                    <div className="flex justify-between"><span className="text-gray-500">Cash Ratio</span><span className="font-medium">{selectedCustomer.cashRatio.toFixed(0)}%</span></div>
                                    <div className="flex justify-between"><span className="text-gray-500">Total Discount</span><span className="font-medium">₹{selectedCustomer.totalDiscount.toLocaleString()}</span></div>
                                </div>
                            </div>
                        </div>

                        {/* Strategic Profile Section */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Brand Penetration */}
                            <div className="bg-indigo-50/50 rounded-lg p-3 border border-indigo-100/50">
                                <h4 className="text-[10px] font-black text-indigo-800 uppercase tracking-widest mb-2 flex items-center justify-between">
                                    <span>🧺 Brand Coverage</span>
                                    <span className="text-indigo-600">{selectedCustomer.brandPenetrationCount} / {selectedCustomer.totalAvailableBrands}</span>
                                </h4>
                                <div className="h-2 w-full bg-indigo-100 rounded-full overflow-hidden mb-2">
                                    <div className="h-full bg-indigo-600 rounded-full transition-all duration-700" style={{ width: `${(selectedCustomer.brandPenetrationCount / (selectedCustomer.totalAvailableBrands || 1)) * 100}%` }} />
                                </div>
                                <p className="text-[10px] text-indigo-700/70 italic">
                                    {selectedCustomer.brandPenetrationCount >= 5 ? 'Strong brand reach' : 'Cross-sell opportunity: Expand to more brands'}
                                </p>
                            </div>

                            {/* Revenue Momentum */}
                            <div className={`rounded-lg p-3 border ${selectedCustomer.revenueMomentum > 0 ? 'bg-emerald-50/50 border-emerald-100/50' : selectedCustomer.revenueMomentum < -10 ? 'bg-red-50/50 border-red-100/50' : 'bg-slate-50 border-slate-200'}`}>
                                <h4 className={`text-[10px] font-black uppercase tracking-widest mb-1 ${selectedCustomer.revenueMomentum > 0 ? 'text-emerald-800' : selectedCustomer.revenueMomentum < -10 ? 'text-red-800' : 'text-slate-700'}`}>
                                    🚀 Revenue Momentum
                                </h4>
                                <div className="flex items-center gap-2">
                                    <div className={`text-xl font-black ${selectedCustomer.revenueMomentum > 0 ? 'text-emerald-700' : selectedCustomer.revenueMomentum < -10 ? 'text-red-700' : 'text-slate-600'}`}>
                                        {selectedCustomer.revenueMomentum > 0 ? '+' : ''}{selectedCustomer.revenueMomentum.toFixed(1)}%
                                    </div>
                                    <span className="text-[10px] text-gray-400">vs Prev 90d</span>
                                </div>
                                <div className="mt-1 h-3 w-full flex gap-0.5 items-end">
                                    {[1,2,3,4,5,6].map(i => (
                                        <div key={i} className={`flex-1 rounded-sm ${selectedCustomer.revenueMomentum > 0 ? 'bg-emerald-300' : selectedCustomer.revenueMomentum < -10 ? 'bg-red-300' : 'bg-slate-300'}`} style={{ height: `${20 + (i * 12)}%`, opacity: 0.3 + (i * 0.1) }} />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Profile Completeness Advice */}
                        <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                             <h4 className="text-[10px] font-black text-slate-700 uppercase tracking-widest mb-2 flex items-center justify-between">
                                📋 Data Hygiene Score
                                <span className={selectedCustomer.profileCompleteness === 100 ? 'text-emerald-600' : 'text-amber-600'}>{selectedCustomer.profileCompleteness.toFixed(0)}%</span>
                             </h4>
                             <div className="flex flex-wrap gap-1.5">
                                 {selectedCustomer.profileCompleteness < 100 ? (
                                     <>
                                        <span className="text-[9px] text-slate-500 font-bold uppercase">Missing:</span>
                                        {selectedCustomer.profileCompleteness < 100 && (
                                            <div className="flex flex-wrap gap-1 max-w-full">
                                                {!selectedCustomer.hasGps && <span className="bg-white px-1.5 py-0.5 rounded border border-slate-200 text-red-500 text-[9px] uppercase font-bold">Location GPS</span>}
                                                {selectedCustomer.currentOutstanding === 0 && selectedCustomer.creditLimit === 0 && <span className="bg-white px-1.5 py-0.5 rounded border border-slate-200 text-amber-600 text-[9px] uppercase font-bold">Credit Limit</span>}
                                            </div>
                                        )}
                                     </>
                                 ) : <span className="text-[10px] text-emerald-600 font-bold">✓ Profile is fully optimized</span>}
                             </div>
                        </div>

                        {/* RFM Scores */}
                        <div className="border rounded-lg p-3">
                            <h4 className="text-xs font-bold text-gray-700 mb-2">RFM Scores</h4>
                            <div className="flex gap-4">
                                {[['R', selectedCustomer.rfmR, 'Recency'], ['F', selectedCustomer.rfmF, 'Frequency'], ['M', selectedCustomer.rfmM, 'Monetary']].map(([label, score, desc]) => (
                                    <div key={label as string} className="flex-1 text-center">
                                        <div className="text-2xl font-black text-indigo-600">{score as number}</div>
                                        <div className="text-[10px] text-gray-500 font-medium">{label as string} — {desc as string}</div>
                                        <div className="mt-1 h-1.5 bg-gray-200 rounded-full overflow-hidden"><div className="h-full bg-indigo-500 rounded-full" style={{ width: `${((score as number) / 5) * 100}%` }} /></div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Order Timeline Chart */}
                        {customerOrders.length > 1 && (
                            <div className="border rounded-lg p-3">
                                <h4 className="text-xs font-bold text-gray-700 mb-2 flex items-center gap-1">📊 Order Timeline</h4>
                                <div className="h-40">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={[...customerOrders].reverse().map(o => ({
                                            date: o.date?.substring(5) || '',
                                            amount: o.totalAmount || 0,
                                        }))}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                            <XAxis dataKey="date" fontSize={9} angle={-30} textAnchor="end" height={40} />
                                            <YAxis fontSize={9} tickFormatter={(v: number) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)} />
                                            <Tooltip formatter={(v: number) => [`₹${v.toLocaleString()}`, 'Amount']} />
                                            <Bar dataKey="amount" fill="#6366f1" radius={[3, 3, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        )}

                        {/* AOV Trend (rolling avg) */}
                        {customerOrders.length > 2 && (
                            <div className="border rounded-lg p-3">
                                <h4 className="text-xs font-bold text-gray-700 mb-2">📈 AOV Trend (Rolling 3-Order Avg)</h4>
                                <div className="h-36">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={(() => {
                                            const reversed = [...customerOrders].reverse();
                                            const result: { date: string; aov: number }[] = [];
                                            for (let i = 0; i < reversed.length; i++) {
                                                const window = reversed.slice(Math.max(0, i - 2), i + 1);
                                                const avg = window.reduce((s, o) => s + (o.totalAmount || 0), 0) / window.length;
                                                result.push({ date: reversed[i].date?.substring(5) || '', aov: Math.round(avg) });
                                            }
                                            return result;
                                        })()}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                            <XAxis dataKey="date" fontSize={9} angle={-30} textAnchor="end" height={40} />
                                            <YAxis fontSize={9} tickFormatter={(v: number) => `₹${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`} />
                                            <Tooltip formatter={(v: number) => [`₹${v.toLocaleString()}`, 'Rolling AOV']} />
                                            <Line type="monotone" dataKey="aov" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        )}

                        {/* Recent Orders */}
                        <div className="border rounded-lg p-3">
                            <h4 className="text-xs font-bold text-gray-700 mb-2 flex items-center gap-1"><Package className="h-3.5 w-3.5" /> Recent Orders</h4>
                            {customerOrders.length === 0 ? <p className="text-sm text-gray-500">No orders found</p> : (
                                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                                    {customerOrders.map(o => (
                                        <div key={o.id} className="flex items-center justify-between py-1.5 px-2 bg-gray-50 rounded text-sm">
                                            <div><span className="font-medium text-gray-900">#{typeof o.id === 'string' ? o.id.slice(0, 10) : o.id}</span> <span className="text-gray-500 text-xs ml-1">{o.date}</span></div>
                                            <div className="text-right"><span className="font-bold">₹{o.totalAmount?.toLocaleString()}</span> <span className={`ml-1 text-[10px] px-1.5 py-0.5 rounded ${o.status === 'delivered' ? 'bg-green-100 text-green-700' : o.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{o.status}</span></div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Meta */}
                        <div className="text-xs text-gray-400 flex justify-between">
                            <span>Route: {selectedCustomer.routeName || '—'} • SP: {selectedCustomer.primarySalesperson}</span>
                            <span>Tenure: {selectedCustomer.customerTenureDays}d • GPS Orders: {selectedCustomer.ordersWithGps}/{selectedCustomer.totalOrders}</span>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};
