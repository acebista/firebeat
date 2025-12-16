import React, { useState, useEffect } from 'react';
import { Card, Button, Select, Badge, Input } from '../../components/ui/Elements';
import { Modal } from '../../components/ui/Modal';
import { Eye, Calendar, Search, Filter, Printer, Edit } from 'lucide-react';
import { Order, User, Product, Customer } from '../../types';
import { OrderService, UserService, ProductService, CustomerService } from '../../services/db';
import { useAuth } from '../../services/auth';
import { printChallanV2 } from '../../utils/printChallan';
import { useNavigate } from 'react-router-dom';

export const MyOrders: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState<Order[]>([]);
    const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState<User[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [customers, setCustomers] = useState<Customer[]>([]);

    // Filter State
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [dateFilter, setDateFilter] = useState({
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0]
    });
    const [salespersonFilter, setSalespersonFilter] = useState('all');

    // Modal State
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Load initial data
    useEffect(() => {
        loadData();
    }, []);

    // Load orders when filters change
    useEffect(() => {
        loadOrders();
    }, [dateFilter, salespersonFilter, user]);

    const loadData = async () => {
        try {
            const [usersData, productsData, customersData] = await Promise.all([
                UserService.getAll(),
                ProductService.getAll(),
                CustomerService.getAll()
            ]);
            const salesUsers = usersData.filter(u => (u.role === 'sales') && u.isActive);
            setUsers(salesUsers);
            setProducts(productsData);
            setCustomers(customersData);
        } catch (error) {
            console.error('Failed to load data:', error);
        }
    };

    const loadOrders = async () => {
        if (!user) return;

        try {
            setLoading(true);

            // Determine salesperson ID to filter by
            let spId = 'all';
            if (user.role === 'sales') {
                // Sales users can only see their own orders
                spId = user.id;
            } else if (user.role === 'admin' && salespersonFilter !== 'all') {
                spId = salespersonFilter;
            }

            const data = await OrderService.getOrdersFiltered(
                dateFilter.startDate,
                dateFilter.endDate,
                spId
            );

            setOrders(data);
        } catch (error) {
            console.error('Failed to load orders:', error);
        } finally {
            setLoading(false);
        }
    };

    // Client-side Filter Logic (Search & Status)
    useEffect(() => {
        let result = orders;

        // Status filter
        if (statusFilter !== 'all') {
            result = result.filter(o => o.status === statusFilter);
        }

        // Search filter
        if (searchTerm) {
            const lower = searchTerm.toLowerCase();
            result = result.filter(o =>
                o.id.toLowerCase().includes(lower) ||
                o.customerName.toLowerCase().includes(lower)
            );
        }

        setFilteredOrders(result);
    }, [orders, searchTerm, statusFilter]);

    const openOrder = (order: Order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    const handlePrint = (e: React.MouseEvent, order: Order) => {
        e.stopPropagation();
        const customer = customers.find(c => c.id === order.customerId);
        printChallanV2(order, products, customer);
    };

    const handleEdit = (e: React.MouseEvent, order: Order) => {
        e.stopPropagation();
        // Navigate to edit page (we'll create this route)
        navigate(`/sales/edit-order/${order.id}`);
    };

    const isEditable = (order: Order) => {
        const today = new Date().toISOString().split('T')[0];
        return order.date === today;
    };

    // Calculate stats
    const stats = {
        total: filteredOrders.length,
        approved: filteredOrders.filter(o => o.status === 'approved').length,
        dispatched: filteredOrders.filter(o => o.status === 'dispatched').length,
        delivered: filteredOrders.filter(o => o.status === 'delivered').length,
        cancelled: filteredOrders.filter(o => o.status === 'cancelled').length,
        totalAmount: filteredOrders.reduce((sum, o) => sum + o.totalAmount, 0),
        // Net sales = all orders except cancelled
        netSales: filteredOrders.filter(o => o.status !== 'cancelled').reduce((sum, o) => sum + o.totalAmount, 0),
        totalItems: filteredOrders.reduce((sum, o) => sum + (o.totalItems || 0), 0),
        avgOrderValue: filteredOrders.length > 0
            ? filteredOrders.filter(o => o.status !== 'cancelled').reduce((sum, o) => sum + o.totalAmount, 0) /
            filteredOrders.filter(o => o.status !== 'cancelled').length
            : 0
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800">My Orders</h2>
                <Card className="p-12">
                    <div className="flex flex-col items-center justify-center text-gray-500">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
                        <p>Loading orders...</p>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center flex-wrap gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                        {user?.role === 'sales' ? 'My Orders' : 'All Sales Orders'}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Showing {dateFilter.startDate} to {dateFilter.endDate}
                        <span className="text-indigo-600 ml-2">({stats.total} orders)</span>
                    </p>
                </div>
                <div className="flex gap-2 flex-wrap">
                    <span className="bg-indigo-100 text-indigo-800 px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 border border-indigo-200 shadow-sm">
                        <span className="text-xs uppercase tracking-wide opacity-70">Net Sales:</span>
                        ₹{stats.netSales.toLocaleString()}
                    </span>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <Card className="p-4 bg-gradient-to-br from-indigo-500 to-indigo-600 text-white">
                    <p className="text-sm font-medium opacity-90">Net Sales</p>
                    <p className="text-2xl font-bold">₹{stats.netSales.toLocaleString()}</p>
                    <p className="text-xs opacity-75 mt-1">{stats.total - stats.cancelled} orders</p>
                </Card>
                <Card className="p-4 bg-green-50 border-green-200">
                    <p className="text-sm text-green-800 font-medium">Approved</p>
                    <p className="text-2xl font-bold text-green-900">{stats.approved}</p>
                    <p className="text-xs text-green-600">Ready for dispatch</p>
                </Card>
                <Card className="p-4 bg-blue-50 border-blue-200">
                    <p className="text-sm text-blue-800 font-medium">Dispatched</p>
                    <p className="text-2xl font-bold text-blue-900">{stats.dispatched}</p>
                    <p className="text-xs text-blue-600">Out for delivery</p>
                </Card>
                <Card className="p-4 bg-purple-50 border-purple-200">
                    <p className="text-sm text-purple-800 font-medium">Delivered</p>
                    <p className="text-2xl font-bold text-purple-900">{stats.delivered}</p>
                    <p className="text-xs text-purple-600">Completed</p>
                </Card>
                <Card className="p-4 bg-red-50 border-red-200">
                    <p className="text-sm text-red-800 font-medium">Cancelled</p>
                    <p className="text-2xl font-bold text-red-900">{stats.cancelled}</p>
                    <p className="text-xs text-red-600">Not counted in net</p>
                </Card>
                <Card className="p-4 bg-amber-50 border-amber-200">
                    <p className="text-sm text-amber-800 font-medium">Avg Order</p>
                    <p className="text-2xl font-bold text-amber-900">₹{Math.round(stats.avgOrderValue).toLocaleString()}</p>
                    <p className="text-xs text-amber-600">{stats.totalItems} items total</p>
                </Card>
            </div>

            {/* Filters */}
            <Card className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search Order ID or Customer..."
                            className="w-full pl-9 pr-3 py-2 rounded-md border border-gray-300 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <Input
                        type="date"
                        placeholder="Start Date"
                        value={dateFilter.startDate}
                        onChange={(e) => setDateFilter({ ...dateFilter, startDate: e.target.value })}
                    />

                    <Input
                        type="date"
                        placeholder="End Date"
                        value={dateFilter.endDate}
                        onChange={(e) => setDateFilter({ ...dateFilter, endDate: e.target.value })}
                    />

                    <Select
                        options={[
                            { label: 'All Status', value: 'all' },
                            { label: 'Approved', value: 'approved' },
                            { label: 'Dispatched', value: 'dispatched' },
                            { label: 'Delivered', value: 'delivered' },
                            { label: 'Cancelled', value: 'cancelled' },
                        ]}
                        value={statusFilter}
                        onChange={(value) => setStatusFilter(value)}
                    />

                    {user?.role === 'admin' && (
                        <Select
                            options={[
                                { label: 'All Salespeople', value: 'all' },
                                ...users.map(u => ({ label: u.name, value: u.id }))
                            ]}
                            value={salespersonFilter}
                            onChange={(value) => setSalespersonFilter(value)}
                        />
                    )}
                </div>
            </Card>

            {/* Orders Table */}
            <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Order ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Customer</th>
                                {user?.role === 'admin' && (
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Salesperson</th>
                                )}
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase">Items</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase">Amount</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={user?.role === 'admin' ? 8 : 7} className="px-6 py-10 text-center text-gray-600">
                                        No orders found matching your criteria.
                                    </td>
                                </tr>
                            ) : (
                                filteredOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap font-medium text-indigo-600">
                                            {order.id}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {order.date}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                                            {order.customerName}
                                        </td>
                                        {user?.role === 'admin' && (
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {order.salespersonName}
                                            </td>
                                        )}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                                            {order.totalItems}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 text-right">
                                            ₹{order.totalAmount.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <Badge color={
                                                order.status === 'approved' ? 'green' :
                                                    order.status === 'cancelled' ? 'red' :
                                                        order.status === 'dispatched' ? 'blue' : 'gray'
                                            }>
                                                {order.status.toUpperCase()}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end gap-2">
                                                {isEditable(order) && (
                                                    <button
                                                        onClick={(e) => handleEdit(e, order)}
                                                        className="text-blue-600 hover:text-blue-900 p-1"
                                                        title="Edit Order"
                                                    >
                                                        <Edit className="h-5 w-5" />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={(e) => handlePrint(e, order)}
                                                    className="text-gray-600 hover:text-gray-900 p-1"
                                                    title="Print Challan"
                                                >
                                                    <Printer className="h-5 w-5" />
                                                </button>
                                                <button
                                                    onClick={() => openOrder(order)}
                                                    className="text-indigo-600 hover:text-indigo-900 p-1"
                                                    title="View Details"
                                                >
                                                    <Eye className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Order Detail Modal */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Order Details" size="xl">
                {selectedOrder && (
                    <div className="space-y-6">
                        {/* Header */}
                        <div className="flex justify-between items-start bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">{selectedOrder.id}</h3>
                                <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                                    <Calendar className="h-3 w-3" /> {selectedOrder.date}
                                </p>
                            </div>
                            <div className="text-right">
                                <Badge color={
                                    selectedOrder.status === 'approved' ? 'green' :
                                        selectedOrder.status === 'cancelled' ? 'red' : 'blue'
                                }>
                                    {selectedOrder.status.toUpperCase()}
                                </Badge>
                                <p className="text-xs text-gray-500 mt-1">By: {selectedOrder.salespersonName}</p>
                            </div>
                        </div>

                        {/* Customer Info */}
                        <div>
                            <h4 className="text-sm font-bold text-gray-700 mb-2 border-b pb-1">Customer</h4>
                            <p className="text-lg font-medium text-gray-900">{selectedOrder.customerName}</p>
                            {selectedOrder.remarks && (
                                <p className="text-sm text-gray-600 mt-2 bg-yellow-50 p-2 rounded border border-yellow-100">
                                    {selectedOrder.remarks}
                                </p>
                            )}
                        </div>

                        {/* Items Table */}
                        <div>
                            <h4 className="text-sm font-bold text-gray-700 mb-2">Order Items</h4>
                            <div className="border rounded-lg overflow-hidden">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                                            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Qty</th>
                                            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Rate</th>
                                            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {selectedOrder.items.map((item, idx) => (
                                            <tr key={idx} className="text-sm">
                                                <td className="px-4 py-2 text-gray-900">
                                                    {item.productName}
                                                    {item.schemeAppliedText && (
                                                        <div className="text-xs text-green-600">{item.schemeAppliedText}</div>
                                                    )}
                                                </td>
                                                <td className="px-4 py-2 text-center text-gray-900">{item.qty}</td>
                                                <td className="px-4 py-2 text-right text-gray-900">₹{item.rate}</td>
                                                <td className="px-4 py-2 text-right font-medium text-gray-900">₹{item.total}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot className="bg-gray-50">
                                        <tr>
                                            <td colSpan={3} className="px-4 py-2 text-right font-bold text-gray-900">Grand Total</td>
                                            <td className="px-4 py-2 text-right font-bold text-indigo-600">
                                                ₹{selectedOrder.totalAmount.toLocaleString()}
                                            </td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>

                        <div className="flex justify-end pt-4 border-t">
                            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Close</Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};
