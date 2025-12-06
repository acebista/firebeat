import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button } from '../../components/ui/Elements';
import { DollarSign, Truck, Users, ArrowRight, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { OrderService, CustomerService } from '../../services/db';
import { Order } from '../../types';

const StatCard = ({ title, value, icon: Icon, color }: any) => (
  <Card className="p-4">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <h3 className="text-2xl font-bold mt-1 text-gray-900">{value}</h3>
      </div>
      <div className={`p-3 rounded-full bg-${color}-100`}>
        <Icon className={`h-6 w-6 text-${color}-600`} />
      </div>
    </div>
  </Card>
);

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    todaySales: 0,
    pendingDeliveries: 0,
    totalCustomers: 0
  });
  const [weeklyData, setWeeklyData] = useState<{ name: string; sales: number }[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const today = new Date().toISOString().split('T')[0];

      // 1. Today's Sales & Recent Orders
      // We'll fetch orders for today to calculate sales
      // And we'll fetch a small batch of recent orders for the list (or just use today's if volume is low)
      // For "Recent Orders" list, ideally we want the last 5 orders regardless of date.
      // But for "Today's Sales", we need today's orders.

      // Let's fetch orders for the last 7 days for the chart, and filter for today's sales.
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
      const startDate = sevenDaysAgo.toISOString().split('T')[0];

      const ordersLast7Days = await OrderService.getOrdersByDateRange(startDate, today);

      // Calculate Today's Sales
      const todayOrders = ordersLast7Days.filter(o => o.date === today);
      const todaySales = todayOrders.reduce((sum, o) => sum + o.totalAmount, 0);

      // Calculate Weekly Trend
      const trendMap: Record<string, number> = {};
      // Initialize map with 0 for all 7 days
      for (let i = 0; i < 7; i++) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        trendMap[dateStr] = 0;
      }

      ordersLast7Days.forEach(o => {
        if (trendMap[o.date] !== undefined) {
          trendMap[o.date] += o.totalAmount;
        }
      });

      const chartData = Object.keys(trendMap).sort().map(date => ({
        name: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
        sales: trendMap[date]
      }));

      setWeeklyData(chartData);

      // 2. Pending Deliveries (Approved but not delivered)
      const pendingOrders = await OrderService.getPendingDispatch();

      // 3. Total Customers
      const customerCount = await CustomerService.getCount(); // We added this method

      // 4. Recent Orders (Just take the last 5 from the fetched batch, or fetch specifically if needed)
      // Since we only fetched last 7 days, if there are no orders in 7 days, this might be empty.
      // But for a dashboard, showing recent activity from the last week is reasonable.
      // Sort by date descending
      const sortedOrders = [...ordersLast7Days].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);
      setRecentOrders(sortedOrders);

      setStats({
        todaySales,
        pendingDeliveries: pendingOrders.length,
        totalCustomers: customerCount || 0
      });

    } catch (error) {
      console.error("Failed to fetch dashboard data", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex h-full items-center justify-center">Loading Dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Admin Dashboard</h2>
        <Button variant="outline" onClick={() => navigate('/admin/health')}>
          <Activity className="mr-2 h-4 w-4" /> System Setup & Health
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Sales Today"
          value={`₹${stats.todaySales.toLocaleString()}`}
          icon={DollarSign}
          color="green"
        />
        <StatCard
          title="Pending Deliveries"
          value={stats.pendingDeliveries}
          icon={Truck}
          color="orange"
        />
        <StatCard
          title="Total Customers"
          value={stats.totalCustomers}
          icon={Users}
          color="blue"
        />

        <Card className="p-4 border-l-4 border-indigo-500 cursor-pointer hover:shadow-md transition-all" onClick={() => navigate('/admin/health')}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">System Status</p>
              <h3 className="text-lg font-bold mt-1 text-indigo-700">Configure DB</h3>
            </div>
            <div className="p-3 rounded-full bg-indigo-100">
              <Activity className="h-6 w-6 text-indigo-600" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Weekly Sales Trend">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Sales']} />
                <Bar dataKey="sales" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Recent Orders">
          <div className="space-y-4">
            {recentOrders.length === 0 ? (
              <p className="text-center text-gray-500 py-4">No recent orders found.</p>
            ) : (
              recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded border border-gray-100">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Order #{order.id.slice(0, 8)}...</p>
                    <p className="text-xs text-gray-500">{order.customerName} • {order.totalItems} items</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">₹{order.totalAmount.toLocaleString()}</p>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                      }`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))
            )}
            <button
              onClick={() => navigate('/admin/orders')}
              className="w-full text-center text-sm text-indigo-600 font-medium hover:text-indigo-800 mt-2 flex items-center justify-center"
            >
              Go to Orders <ArrowRight className="ml-1 h-4 w-4" />
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};
