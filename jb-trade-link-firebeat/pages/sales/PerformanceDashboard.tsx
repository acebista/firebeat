import React, { useState, useEffect } from 'react';
import { Card, Button } from '../../components/ui/Elements';
import { TrendingUp, TrendingDown, Target, Award, Sparkles, RefreshCw, Calendar, DollarSign, ShoppingBag, Users } from 'lucide-react';
import { useAuth } from '../../services/auth';
import { OrderService, ProductService, CustomerService } from '../../services/db';
import { Order } from '../../types';
import { getSalesInsights, getPerformanceTips } from '../../services/aiService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

export const PerformanceDashboard: React.FC = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [aiLoading, setAiLoading] = useState(false);
    const [orders, setOrders] = useState<Order[]>([]);
    const [aiInsights, setAiInsights] = useState<string>('');
    const [aiTips, setAiTips] = useState<string>('');

    // Performance metrics
    const [metrics, setMetrics] = useState({
        todaySales: 0,
        yesterdaySales: 0,
        weekSales: 0,
        lastWeekSales: 0,
        monthSales: 0,
        lastMonthSales: 0,
        todayOrders: 0,
        avgOrderValue: 0,
        topProducts: [] as { name: string; count: number; value: number }[],
        topCustomers: [] as { name: string; orders: number; value: number }[],
        dailyTrend: [] as { date: string; sales: number; orders: number }[],
    });

    useEffect(() => {
        loadPerformanceData();
    }, [user]);

    const loadPerformanceData = async () => {
        if (!user) return;

        try {
            setLoading(true);

            // Get last 60 days of data for comparison
            const endDate = new Date();
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - 60);

            const startStr = startDate.toISOString().split('T')[0];
            const endStr = endDate.toISOString().split('T')[0];

            // Filter by user ID for sales role
            const salespersonId = (user.role === 'sales') ? user.id : 'all';
            const data = await OrderService.getOrdersFiltered(startStr, endStr, salespersonId);
            setOrders(data);

            await calculateMetrics(data);
        } catch (error) {
            console.error('Failed to load performance data:', error);
        } finally {
            setLoading(false);
        }
    };

    const calculateMetrics = async (data: Order[]) => {
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

        const now = new Date();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        const startOfLastWeek = new Date(startOfWeek);
        startOfLastWeek.setDate(startOfWeek.getDate() - 7);

        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

        let todaySales = 0, yesterdaySales = 0;
        let weekSales = 0, lastWeekSales = 0;
        let monthSales = 0, lastMonthSales = 0;
        let todayOrders = 0;

        // Product and customer tracking
        const productMap = new Map<string, { count: number; value: number }>();
        const customerMap = new Map<string, { orders: number; value: number }>();

        data.forEach(order => {
            const orderDate = new Date(order.date);
            const orderDateStr = order.date;

            // Today vs Yesterday
            if (orderDateStr === today) {
                todaySales += order.totalAmount;
                todayOrders++;
            } else if (orderDateStr === yesterday) {
                yesterdaySales += order.totalAmount;
            }

            // This week vs last week
            if (orderDate >= startOfWeek) {
                weekSales += order.totalAmount;
            } else if (orderDate >= startOfLastWeek && orderDate < startOfWeek) {
                lastWeekSales += order.totalAmount;
            }

            // This month vs last month
            if (orderDate >= startOfMonth) {
                monthSales += order.totalAmount;
            } else if (orderDate >= startOfLastMonth && orderDate <= endOfLastMonth) {
                lastMonthSales += order.totalAmount;
            }

            // Track products
            order.items.forEach(item => {
                const existing = productMap.get(item.productName) || { count: 0, value: 0 };
                productMap.set(item.productName, {
                    count: existing.count + item.qty,
                    value: existing.value + (item.total || 0),
                });
            });

            // Track customers
            const existing = customerMap.get(order.customerName) || { orders: 0, value: 0 };
            customerMap.set(order.customerName, {
                orders: existing.orders + 1,
                value: existing.value + order.totalAmount,
            });
        });

        // Top products
        const topProducts = Array.from(productMap.entries())
            .map(([name, data]) => ({ name, ...data }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 5);

        // Top customers
        const topCustomers = Array.from(customerMap.entries())
            .map(([name, data]) => ({ name, ...data }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 5);

        // Daily trend (last 14 days)
        const dailyTrend = [];
        for (let i = 13; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            const dayOrders = data.filter(o => o.date === dateStr);
            dailyTrend.push({
                date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                sales: dayOrders.reduce((sum, o) => sum + o.totalAmount, 0),
                orders: dayOrders.length,
            });
        }

        const avgOrderValue = data.length > 0 ? data.reduce((sum, o) => sum + o.totalAmount, 0) / data.length : 0;

        setMetrics({
            todaySales,
            yesterdaySales,
            weekSales,
            lastWeekSales,
            monthSales,
            lastMonthSales,
            todayOrders,
            avgOrderValue,
            topProducts,
            topCustomers,
            dailyTrend,
        });
    };

    const loadAIInsights = async () => {
        setAiLoading(true);
        try {
            const insights = await getSalesInsights({
                todaySales: metrics.todaySales,
                weekSales: metrics.weekSales,
                monthSales: metrics.monthSales,
                todayOrders: metrics.todayOrders,
                totalOrders: orders.length,
                topProducts: metrics.topProducts.slice(0, 3).map(p => p.name),
                topCustomers: metrics.topCustomers.slice(0, 3).map(c => c.name),
            });

            if (insights.error) {
                setAiInsights(`Error: ${insights.error}`);
            } else {
                setAiInsights(insights.content);
            }

            // Get performance tips
            const performanceDesc = `Today: ₹${metrics.todaySales.toLocaleString()}, Week: ₹${metrics.weekSales.toLocaleString()}, Month: ₹${metrics.monthSales.toLocaleString()}`;
            const tips = await getPerformanceTips(performanceDesc);

            if (!tips.error) {
                setAiTips(tips.content);
            }
        } catch (error) {
            console.error('Failed to load AI insights:', error);
            setAiInsights('Failed to load AI insights. Please try again.');
        } finally {
            setAiLoading(false);
        }
    };

    const calculateChange = (current: number, previous: number) => {
        if (previous === 0) return current > 0 ? 100 : 0;
        return ((current - previous) / previous) * 100;
    };

    const todayChange = calculateChange(metrics.todaySales, metrics.yesterdaySales);
    const weekChange = calculateChange(metrics.weekSales, metrics.lastWeekSales);
    const monthChange = calculateChange(metrics.monthSales, metrics.lastMonthSales);

    const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

    if (loading) return <div className="p-8 text-center">Loading performance data...</div>;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Performance Dashboard</h2>
                    <p className="text-gray-500">AI-powered insights for {user?.name}</p>
                </div>
                <Button onClick={loadAIInsights} disabled={aiLoading}>
                    {aiLoading ? (
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Sparkles className="mr-2 h-4 w-4" />
                    )}
                    {aiLoading ? 'Generating...' : 'Get AI Insights'}
                </Button>
            </div>

            {/* AI Insights */}
            {aiInsights && (
                <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
                    <div className="p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Sparkles className="h-5 w-5 text-purple-600" />
                            <h3 className="text-lg font-bold text-purple-900">AI Insights</h3>
                        </div>
                        <div className="prose prose-sm max-w-none">
                            <pre className="whitespace-pre-wrap font-sans text-gray-700 bg-white/50 p-4 rounded-lg">
                                {aiInsights}
                            </pre>
                        </div>
                        {aiTips && (
                            <div className="mt-4 pt-4 border-t border-purple-200">
                                <h4 className="font-semibold text-purple-900 mb-2">Performance Tips:</h4>
                                <pre className="whitespace-pre-wrap font-sans text-gray-700 bg-white/50 p-4 rounded-lg">
                                    {aiTips}
                                </pre>
                            </div>
                        )}
                    </div>
                </Card>
            )}

            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <Card className="p-5">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Today vs Yesterday</p>
                            <h3 className="text-2xl font-bold mt-1 text-gray-800">₹{metrics.todaySales.toLocaleString()}</h3>
                        </div>
                        <DollarSign className="h-8 w-8 text-indigo-500 opacity-20" />
                    </div>
                    <div className="flex items-center gap-2">
                        {todayChange >= 0 ? (
                            <TrendingUp className="h-4 w-4 text-green-500" />
                        ) : (
                            <TrendingDown className="h-4 w-4 text-red-500" />
                        )}
                        <span className={`text-sm font-medium ${todayChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {todayChange >= 0 ? '+' : ''}{todayChange.toFixed(1)}%
                        </span>
                        <span className="text-xs text-gray-500">vs yesterday</span>
                    </div>
                </Card>

                <Card className="p-5">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">This Week vs Last Week</p>
                            <h3 className="text-2xl font-bold mt-1 text-gray-800">₹{metrics.weekSales.toLocaleString()}</h3>
                        </div>
                        <Calendar className="h-8 w-8 text-green-500 opacity-20" />
                    </div>
                    <div className="flex items-center gap-2">
                        {weekChange >= 0 ? (
                            <TrendingUp className="h-4 w-4 text-green-500" />
                        ) : (
                            <TrendingDown className="h-4 w-4 text-red-500" />
                        )}
                        <span className={`text-sm font-medium ${weekChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {weekChange >= 0 ? '+' : ''}{weekChange.toFixed(1)}%
                        </span>
                        <span className="text-xs text-gray-500">vs last week</span>
                    </div>
                </Card>

                <Card className="p-5">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">This Month vs Last Month</p>
                            <h3 className="text-2xl font-bold mt-1 text-gray-800">₹{metrics.monthSales.toLocaleString()}</h3>
                        </div>
                        <Award className="h-8 w-8 text-blue-500 opacity-20" />
                    </div>
                    <div className="flex items-center gap-2">
                        {monthChange >= 0 ? (
                            <TrendingUp className="h-4 w-4 text-green-500" />
                        ) : (
                            <TrendingDown className="h-4 w-4 text-red-500" />
                        )}
                        <span className={`text-sm font-medium ${monthChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {monthChange >= 0 ? '+' : ''}{monthChange.toFixed(1)}%
                        </span>
                        <span className="text-xs text-gray-500">vs last month</span>
                    </div>
                </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Daily Trend */}
                <Card title="14-Day Sales Trend" className="min-h-[350px]">
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={metrics.dailyTrend}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                                <YAxis tick={{ fontSize: 12 }} />
                                <Tooltip
                                    formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Sales']}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Line type="monotone" dataKey="sales" stroke="#6366f1" strokeWidth={2} dot={{ fill: '#6366f1' }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Top Products */}
                <Card title="Top 5 Products by Revenue" className="min-h-[350px]">
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={metrics.topProducts}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name.substring(0, 15)}... (${(percent * 100).toFixed(0)}%)`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {metrics.topProducts.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value: number) => `₹${value.toLocaleString()}`} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>

            {/* Top Customers & Products Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card title="Top Customers">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Orders</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenue</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {metrics.topCustomers.map((customer, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{customer.name}</td>
                                        <td className="px-4 py-3 text-sm text-gray-500">{customer.orders}</td>
                                        <td className="px-4 py-3 text-sm font-semibold text-indigo-600">₹{customer.value.toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>

                <Card title="Top Products">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenue</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {metrics.topProducts.map((product, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{product.name}</td>
                                        <td className="px-4 py-3 text-sm text-gray-500">{product.count}</td>
                                        <td className="px-4 py-3 text-sm font-semibold text-indigo-600">₹{product.value.toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>

            {/* Additional Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                <Card className="p-5 border-l-4 border-indigo-500">
                    <p className="text-gray-500 text-sm font-medium">Today's Orders</p>
                    <h3 className="text-2xl font-bold mt-1 text-gray-800">{metrics.todayOrders}</h3>
                </Card>

                <Card className="p-5 border-l-4 border-green-500">
                    <p className="text-gray-500 text-sm font-medium">Avg Order Value</p>
                    <h3 className="text-2xl font-bold mt-1 text-gray-800">₹{metrics.avgOrderValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</h3>
                </Card>

                <Card className="p-5 border-l-4 border-purple-500">
                    <p className="text-gray-500 text-sm font-medium">Total Orders (60d)</p>
                    <h3 className="text-2xl font-bold mt-1 text-gray-800">{orders.length}</h3>
                </Card>

                <Card className="p-5 border-l-4 border-blue-500">
                    <p className="text-gray-500 text-sm font-medium">Active Customers</p>
                    <h3 className="text-2xl font-bold mt-1 text-gray-800">{metrics.topCustomers.length}</h3>
                </Card>
            </div>
        </div>
    );
};
