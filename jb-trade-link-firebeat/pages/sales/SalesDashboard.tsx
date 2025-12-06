
import React, { useState, useEffect } from 'react';
import { Card, Button } from '../../components/ui/Elements';
import { ShoppingBag, TrendingUp, Plus, Calendar, DollarSign, Award, Users, Trash2, Download, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../services/auth';
import { OrderService, UserService } from '../../services/db';
import { Order, User } from '../../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export const SalesDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [devMode, setDevMode] = useState(false);
  const [allSalesUsers, setAllSalesUsers] = useState<User[]>([]);
  const [selectedSalesUserId, setSelectedSalesUserId] = useState<string | null>(null);
  const [demoDate, setDemoDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [demoDataLoaded, setDemoDataLoaded] = useState(false);

  // Stats State
  const [stats, setStats] = useState({
    todaySales: 0,
    todayOrders: 0,
    weekSales: 0,
    monthSales: 0,
    totalOrders: 0
  });

  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    loadDashboardData();
    loadSalesUsers();
  }, [user, selectedSalesUserId]);

  const loadSalesUsers = async () => {
    try {
      const allUsers = await UserService.getAll();
      const salesUsers = allUsers.filter(u => u.role === 'sales');
      setAllSalesUsers(salesUsers);
    } catch (error) {
      console.error("Failed to load sales users:", error);
    }
  };

  const loadDashboardData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);

      const startStr = startDate.toISOString().split('T')[0];
      const endStr = endDate.toISOString().split('T')[0];

      // Use selected user in dev mode, or current user
      let targetUserId = selectedSalesUserId || (user.role === 'sales' ? user.id : 'all');
      const data = await OrderService.getOrdersFiltered(startStr, endStr, targetUserId);
      setOrders(data);

      calculateStats(data);
      prepareChartData(data);
    } catch (error) {
      console.error("Failed to load dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadDemoData = async () => {
    if (!demoDate) return;
    try {
      setLoading(true);
      // Generate 10 demo orders for the selected date
      const demoOrders: Order[] = [];
      const targetUserId = selectedSalesUserId || user?.id;
      if (!targetUserId) return;

      const customerNames = ['John\'s Shop', 'Sharma Store', 'Patel Retail', 'Kumar Mart', 'Gupta Goods', 'Singh Store', 'Verma Retail', 'Bhat Mart', 'Nair Shop', 'Desai Store'];
      
      for (let i = 0; i < 10; i++) {
        const demoOrder: Order = {
          id: `DEMO-${demoDate}-${i + 1}`,
          customerName: customerNames[i],
          totalAmount: Math.floor(Math.random() * 50000) + 5000,
          totalItems: Math.floor(Math.random() * 20) + 1,
          status: Math.random() > 0.3 ? 'approved' : 'pending',
          date: demoDate,
          salespersonId: targetUserId,
          notes: `Demo order created on ${new Date().toLocaleString()}`
        } as any;
        demoOrders.push(demoOrder);
      }

      // Add to existing orders
      setOrders(prev => [...prev, ...demoOrders]);
      setDemoDataLoaded(true);
      calculateStats([...orders, ...demoOrders]);
      prepareChartData([...orders, ...demoOrders]);
    } catch (error) {
      console.error("Failed to load demo data:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteDemoData = () => {
    const nonDemoOrders = orders.filter(o => !o.id.startsWith('DEMO-'));
    setOrders(nonDemoOrders);
    calculateStats(nonDemoOrders);
    prepareChartData(nonDemoOrders);
    setDemoDataLoaded(false);
  };

  const calculateStats = (data: Order[]) => {
    const today = new Date().toISOString().split('T')[0];
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay())); // Sunday
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

    let todaySales = 0;
    let todayOrders = 0;
    let weekSales = 0;
    let monthSales = 0;

    data.forEach(o => {
      const orderDate = new Date(o.date);
      const orderDateStr = o.date; // YYYY-MM-DD

      // Today
      if (orderDateStr === today) {
        todaySales += o.totalAmount;
        todayOrders++;
      }

      // Week
      if (orderDate >= startOfWeek) {
        weekSales += o.totalAmount;
      }

      // Month
      if (orderDate >= startOfMonth) {
        monthSales += o.totalAmount;
      }
    });

    setStats({
      todaySales,
      todayOrders,
      weekSales,
      monthSales,
      totalOrders: data.length
    });
  };

  const prepareChartData = (data: Order[]) => {
    // Group by date for last 7 days
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      last7Days.push(d.toISOString().split('T')[0]);
    }

    const chart = last7Days.map(date => {
      const dayOrders = data.filter(o => o.date === date);
      const total = dayOrders.reduce((sum, o) => sum + o.totalAmount, 0);
      return {
        date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }), // Mon, Tue
        sales: total,
        count: dayOrders.length
      };
    });

    setChartData(chart);
  };

  if (loading) return <div className="p-8 text-center">Loading dashboard...</div>;

  const viewingUser = selectedSalesUserId 
    ? allSalesUsers.find(u => u.id === selectedSalesUserId) 
    : user;

  return (
    <div className="space-y-6">
      {/* Header and Dev Mode Toggle */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Welcome, {viewingUser?.name}</h2>
          <p className="text-gray-500">Here's your performance overview</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => navigate('/sales/create-order')}>
            <Plus className="mr-2 h-4 w-4" /> Create Order
          </Button>
          <button
            onClick={() => setDevMode(!devMode)}
            className="px-3 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition text-sm font-medium"
          >
            <Zap size={16} className="inline mr-1" /> Dev Mode
          </button>
        </div>
      </div>

      {/* Developer Mode Panel */}
      {devMode && (
        <Card className="p-4 bg-blue-50 border-2 border-blue-200">
          <h3 className="font-bold text-blue-900 mb-3">🔧 Developer Mode</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Sales User Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Sales User:</label>
              <select
                value={selectedSalesUserId || ''}
                onChange={(e) => setSelectedSalesUserId(e.target.value || null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">My Dashboard ({user?.name})</option>
                {allSalesUsers.map(salesUser => (
                  <option key={salesUser.id} value={salesUser.id}>
                    {salesUser.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Demo Data Controls */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Demo Data Date:</label>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={demoDate}
                  onChange={(e) => setDemoDate(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <Button
                  onClick={loadDemoData}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Download size={16} className="mr-1" /> Load
                </Button>
                {demoDataLoaded && (
                  <Button
                    onClick={deleteDemoData}
                    size="sm"
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    <Trash2 size={16} className="mr-1" /> Clear
                  </Button>
                )}
              </div>
            </div>
          </div>
          {demoDataLoaded && (
            <p className="text-sm text-green-700 mt-2">✓ Demo data loaded for {demoDate}</p>
          )}
        </Card>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-5 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-indigo-100 text-sm font-medium">Today's Sales</p>
              <h3 className="text-2xl font-bold mt-1">₹{stats.todaySales.toLocaleString()}</h3>
              <p className="text-xs text-indigo-200 mt-1">{stats.todayOrders} Orders</p>
            </div>
            <TrendingUp className="h-8 w-8 text-indigo-200" />
          </div>
        </Card>

        <Card className="p-5 border-l-4 border-green-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-medium">This Week</p>
              <h3 className="text-2xl font-bold mt-1 text-gray-800">₹{stats.weekSales.toLocaleString()}</h3>
            </div>
            <Calendar className="h-8 w-8 text-green-500 opacity-20" />
          </div>
        </Card>

        <Card className="p-5 border-l-4 border-blue-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-medium">This Month</p>
              <h3 className="text-2xl font-bold mt-1 text-gray-800">₹{stats.monthSales.toLocaleString()}</h3>
            </div>
            <Award className="h-8 w-8 text-blue-500 opacity-20" />
          </div>
        </Card>

        <Card className="p-5 border-l-4 border-purple-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Orders (30d)</p>
              <h3 className="text-2xl font-bold mt-1 text-gray-800">{stats.totalOrders}</h3>
            </div>
            <ShoppingBag className="h-8 w-8 text-purple-500 opacity-20" />
          </div>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Last 7 Days Sales" className="min-h-[300px]">
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Sales']}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="sales" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Recent Activity Log">
          <div className="overflow-y-auto max-h-[250px] pr-2">
            {orders.slice(0, 10).map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${order.status === 'approved' ? 'bg-green-500' :
                    order.status === 'dispatched' ? 'bg-blue-500' : 'bg-gray-300'
                    }`} />
                  <div>
                    <p className="text-sm font-medium text-gray-800">{order.customerName}</p>
                    <p className="text-xs text-gray-500">{order.id} • {order.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-indigo-600">₹{order.totalAmount.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">{order.totalItems} Items</p>
                </div>
              </div>
            ))}
            {orders.length === 0 && (
              <p className="text-center text-gray-500 py-8">No recent activity</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
