import React, { useState, useEffect } from 'react';
import { Card, Button, Select, Badge, Input } from '../../components/ui/Elements';
import { Modal } from '../../components/ui/Modal';
import { Eye, CheckCircle, XCircle, Search, Truck, Calendar, Plus } from 'lucide-react';
import { Order, User } from '../../types';
import { useNavigate } from 'react-router-dom';
import { OrderService, UserService } from '../../services/db';
import toast from 'react-hot-toast';

export const OrderManagement: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]); // For salesperson filter

  // Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [salespersonFilter, setSalespersonFilter] = useState('all');

  // Selection State
  const [selectedOrderIds, setSelectedOrderIds] = useState<Set<string>>(new Set());

  // Modal State
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Bulk Status Update Modal State
  const [isBulkStatusModalOpen, setIsBulkStatusModalOpen] = useState(false);
  const [bulkStatusDateRange, setBulkStatusDateRange] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [bulkStatusTarget, setBulkStatusTarget] = useState<Order['status']>('approved');

  // Load initial data (users)
  useEffect(() => {
    loadUsers();
  }, []);

  // Load orders when filters change
  useEffect(() => {
    loadOrders();
  }, [dateFilter, salespersonFilter]);

  const loadUsers = async () => {
    try {
      const usersData = await UserService.getAll();
      // Filter to only sales users for the dropdown
      setUsers(usersData.filter(u => u.role === 'sales' && u.isActive));
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  };

  const loadOrders = async () => {
    try {
      setLoading(true);
      // Use server-side filtering
      const data = await OrderService.getOrdersFiltered(
        dateFilter.startDate,
        dateFilter.endDate,
        salespersonFilter
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
    if (statusFilter !== 'all') {
      result = result.filter(o => o.status === statusFilter);
    }
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(o =>
        o.id.toLowerCase().includes(lower) ||
        o.customerName.toLowerCase().includes(lower) ||
        o.salespersonName.toLowerCase().includes(lower)
      );
    }
    setFilteredOrders(result);
    // Clear selection when filters change
    setSelectedOrderIds(new Set());
  }, [orders, searchTerm, statusFilter]);

  // --- Actions ---

  const handleStatusChange = async (orderId: string, newStatus: Order['status']) => {
    try {
      // Update in database
      await OrderService.updateStatus(orderId, newStatus);

      // Update local state
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
      }
    } catch (error) {
      console.error('Failed to update order status:', error);
      toast.error('Failed to update order status. Please try again.');
    }
  };

  const handleBulkStatusChange = async (newStatus: Order['status']) => {
    if (selectedOrderIds.size === 0) return;

    if (!window.confirm(`Are you sure you want to mark ${selectedOrderIds.size} orders as ${newStatus.toUpperCase()}?`)) return;

    try {
      // Update all selected orders in database
      const updatePromises = Array.from(selectedOrderIds).map(orderId =>
        OrderService.updateStatus(orderId, newStatus)
      );

      await Promise.all(updatePromises);

      // Update local state
      setOrders(prev => prev.map(o => selectedOrderIds.has(o.id) ? { ...o, status: newStatus } : o));
      setSelectedOrderIds(new Set());
    } catch (error) {
      console.error('Failed to bulk update orders:', error);
      toast.error('Failed to update some orders. Please try again.');
      // Reload to get fresh data
      loadOrders();
    }
  };

  const handleBulkStatusUpdateByDateRange = async () => {
    if (!window.confirm(`Are you sure you want to mark ALL orders between ${bulkStatusDateRange.startDate} and ${bulkStatusDateRange.endDate} as ${bulkStatusTarget.toUpperCase()}?`)) return;

    try {
      // Get all orders in the date range
      const data = await OrderService.getOrdersFiltered(
        bulkStatusDateRange.startDate,
        bulkStatusDateRange.endDate,
        'all'
      );

      if (data.length === 0) {
        toast.error('No orders found in the selected date range.');
        return;
      }

      // Update all orders in database
      const updatePromises = data.map(order =>
        OrderService.updateStatus(order.id, bulkStatusTarget)
      );

      await Promise.all(updatePromises);

      toast.success(`Successfully updated ${data.length} orders to ${bulkStatusTarget.toUpperCase()}`);
      setIsBulkStatusModalOpen(false);
      loadOrders();
    } catch (error) {
      console.error('Failed to bulk update orders by date:', error);
      toast.error('Failed to update orders. Please try again.');
    }
  };

  const openOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const goToDispatch = () => {
    setIsModalOpen(false);
    navigate('/admin/dispatch');
  };

  // --- Selection Logic ---

  const handleSelectAll = () => {
    if (selectedOrderIds.size === filteredOrders.length) {
      setSelectedOrderIds(new Set());
    } else {
      setSelectedOrderIds(new Set(filteredOrders.map(o => o.id)));
    }
  };

  const handleSelectRow = (id: string) => {
    const newSet = new Set(selectedOrderIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedOrderIds(newSet);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">Order Management</h2>
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
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Order Management</h2>
        <div className="flex gap-2">
          <Button
            onClick={() => navigate('/admin/create-order')} // Updated 2025-01-15
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            <Plus className="mr-2 h-4 w-4" /> New Order
          </Button>
          <span className="bg-indigo-50 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium flex items-center border border-indigo-100">
            Total: {filteredOrders.length}
          </span>
          <span className="bg-green-50 text-green-800 px-3 py-1 rounded-full text-sm font-medium flex items-center border border-green-100">
            Approved: {filteredOrders.filter(o => o.status === 'approved').length}
          </span>
          <Button
            onClick={() => setIsBulkStatusModalOpen(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white"
            size="sm"
          >
            <Calendar className="mr-2 h-4 w-4" /> Bulk Update by Date
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search Order ID, Customer..."
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

          <Select
            options={[
              { label: 'All Salespeople', value: 'all' },
              ...users.map(u => ({ label: u.name, value: u.id }))
            ]}
            value={salespersonFilter}
            onChange={(value) => setSalespersonFilter(value)}
          />
        </div>
      </Card>

      {/* Bulk Actions Bar */}
      {selectedOrderIds.size > 0 && (
        <div className="bg-indigo-600 text-white px-4 py-3 rounded-lg shadow-md flex items-center justify-between animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-indigo-200" />
            <span className="font-medium">{selectedOrderIds.size} orders selected</span>
          </div>
          <div className="flex gap-3">
            <Button
              variant="danger"
              size="sm"
              onClick={() => handleBulkStatusChange('cancelled')}
              className="bg-red-500 text-white hover:bg-red-600 border-transparent"
            >
              <XCircle className="mr-2 h-4 w-4" /> Cancel Selected
            </Button>
            <div className="w-px bg-indigo-400 mx-1"></div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedOrderIds(new Set())}
              className="bg-transparent text-white border-white hover:bg-indigo-700"
            >
              Clear
            </Button>
          </div>
        </div>
      )}

      {/* Orders Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase w-10">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                    checked={filteredOrders.length > 0 && selectedOrderIds.size === filteredOrders.length}
                    ref={input => { if (input) input.indeterminate = selectedOrderIds.size > 0 && selectedOrderIds.size < filteredOrders.length; }}
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Salesperson</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase">Items</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase">Amount</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-10 text-center text-gray-600">
                    No orders found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className={`hover:bg-gray-50 group ${selectedOrderIds.has(order.id) ? 'bg-indigo-50' : ''}`}
                    onClick={() => handleSelectRow(order.id)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                        checked={selectedOrderIds.has(order.id)}
                        onChange={(e) => { e.stopPropagation(); handleSelectRow(order.id); }}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-indigo-600 cursor-pointer hover:underline" onClick={(e) => { e.stopPropagation(); openOrder(order); }}>
                      {order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {order.customerName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.salespersonName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      {order.totalItems}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 text-right">
                      ₹{order.totalAmount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <Badge color={
                        order.status === 'approved' ? 'emerald' :
                          order.status === 'cancelled' ? 'red' :
                            order.status === 'dispatched' ? 'blue' : 'slate'
                      }>
                        {order.status.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2" onClick={(e) => e.stopPropagation()}>
                      <button onClick={() => openOrder(order)} className="text-gray-500 hover:text-indigo-600 p-1" title="View Details">
                        <Eye className="h-5 w-5" />
                      </button>
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

            {/* Header Status Bar */}
            <div className="flex justify-between items-start bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div>
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  {selectedOrder.id}
                </h3>
                <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> {selectedOrder.date}
                </p>
              </div>
              <div className="text-right">
                <Badge color={
                  selectedOrder.status === 'approved' ? 'emerald' :
                    selectedOrder.status === 'cancelled' ? 'red' : 'blue'
                }>
                  {selectedOrder.status.toUpperCase()}
                </Badge>
                <p className="text-xs text-gray-500 mt-1">Salesperson: {selectedOrder.salespersonName}</p>
              </div>
            </div>

            {/* Customer Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-bold text-gray-700 mb-2 border-b pb-1">Customer Information</h4>
                <p className="text-lg font-medium text-gray-900">{selectedOrder.customerName}</p>
                <p className="text-sm text-gray-500">ID: {selectedOrder.customerId}</p>
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-700 mb-2 border-b pb-1">Order Remarks</h4>
                {selectedOrder.remarks ? (
                  <p className="text-sm text-gray-800 bg-yellow-50 p-2 rounded border border-yellow-100">
                    {selectedOrder.remarks}
                  </p>
                ) : (
                  <p className="text-sm text-gray-400 italic">No remarks provided.</p>
                )}
              </div>
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
                          {item.schemeAppliedText && <div className="text-xs text-green-600">{item.schemeAppliedText}</div>}
                        </td>
                        <td className="px-4 py-2 text-center text-gray-900">{item.qty}</td>
                        <td className="px-4 py-2 text-right text-gray-900">
                          ₹{item.rate}
                          {item.baseRate && item.baseRate > item.rate && (
                            <span className="block text-[10px] text-gray-400 line-through">₹{item.baseRate}</span>
                          )}
                        </td>
                        <td className="px-4 py-2 text-right font-medium text-gray-900">₹{item.total}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    {selectedOrder.items && selectedOrder.items.length > 0 && (
                      <>
                        <tr className="border-t border-gray-200">
                          <td colSpan={3} className="px-4 py-2 text-right text-sm text-gray-600">Subtotal</td>
                          <td className="px-4 py-2 text-right text-sm text-gray-900">
                            ₹{(selectedOrder.totalAmount + (selectedOrder.discount || 0)).toLocaleString()}
                          </td>
                        </tr>
                        {selectedOrder.discount && selectedOrder.discount > 0 && (
                          <tr>
                            <td colSpan={3} className="px-4 py-2 text-right text-sm text-red-600">
                              Discount
                            </td>
                            <td className="px-4 py-2 text-right text-sm text-red-600">
                              -₹{selectedOrder.discount.toLocaleString()}
                            </td>
                          </tr>
                        )}
                        <tr className="border-t-2 border-gray-300">
                          <td colSpan={3} className="px-4 py-2 text-right font-bold text-gray-900">Grand Total</td>
                          <td className="px-4 py-2 text-right font-bold text-indigo-600">₹{selectedOrder.totalAmount.toLocaleString()}</td>
                        </tr>
                      </>
                    )}
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              {selectedOrder.status === 'approved' ? (
                <Button onClick={goToDispatch} className="bg-indigo-600 hover:bg-indigo-700">
                  <Truck className="mr-2 h-4 w-4" /> Assign Delivery
                </Button>
              ) : (
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>Close</Button>
              )}
            </div>

          </div>
        )}
      </Modal>

      {/* Bulk Status Update Modal */}
      <Modal isOpen={isBulkStatusModalOpen} onClose={() => setIsBulkStatusModalOpen(false)} title="Bulk Update Orders by Date Range" size="md">
        <div className="space-y-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>Warning:</strong> This will update ALL orders in the selected date range. This action cannot be easily undone.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
              <Input
                type="date"
                value={bulkStatusDateRange.startDate}
                onChange={(e) => setBulkStatusDateRange({ ...bulkStatusDateRange, startDate: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
              <Input
                type="date"
                value={bulkStatusDateRange.endDate}
                onChange={(e) => setBulkStatusDateRange({ ...bulkStatusDateRange, endDate: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Target Status</label>
              <Select
                options={[
                  { label: 'Approved (Ready for Dispatch)', value: 'approved' },
                  { label: 'Dispatched (Out for Delivery)', value: 'dispatched' },
                  { label: 'Delivered (Completed)', value: 'delivered' },
                  { label: 'Cancelled', value: 'cancelled' },
                ]}
                value={bulkStatusTarget}
                onChange={(value) => setBulkStatusTarget(value as Order['status'])}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={() => setIsBulkStatusModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleBulkStatusUpdateByDateRange}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Update All Orders
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
