/**
 * Delivery Orders List Page
 * Main interface for delivery persons to manage assigned orders
 * Includes card-based view with quick actions and detailed modals
 */

import React, { useEffect, useState } from 'react';
import {
  Loader,
  CheckCircle,
  AlertCircle,
  RotateCw,
  TrendingUp,
  Package,
  Truck,
  Filter,
  Search,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../services/auth';
import {
  getAssignedOrders,
  getDeliveryDayStats,
} from '../../services/delivery-orders';
import {
  AssignedOrder,
  DeliveryDayStats,
  AssignedOrderStatus,
} from '../../types/delivery-order';
import { MarkDeliveredModal } from '../../components/delivery/MarkDeliveredModal';
import { SalesReturnModal } from '../../components/delivery/SalesReturnModal';
import { DelayModal } from '../../components/delivery/DelayModal';
import {
  getStatusColor,
  getStatusLabel,
  formatCurrency,
  getPaymentStatusBadge,
} from '../../lib/delivery-order-logic';

interface FilterState {
  status: AssignedOrderStatus | 'all';
  searchTerm: string;
}

export const DeliveryOrdersList: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [orders, setOrders] = useState<AssignedOrder[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<AssignedOrder[]>([]);
  const [stats, setStats] = useState<DeliveryDayStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    status: 'all',
    searchTerm: '',
  });

  // Modal states
  const [selectedOrder, setSelectedOrder] = useState<AssignedOrder | null>(null);
  const [activeModal, setActiveModal] = useState<'deliver' | 'return' | 'delay' | null>(null);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  useEffect(() => {
    applyFilters();
  }, [orders, filters]);

  const loadData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [assignedOrders, dayStats] = await Promise.all([
        getAssignedOrders(user.id),
        getDeliveryDayStats(user.id, new Date().toISOString().split('T')[0]),
      ]);

      setOrders(assignedOrders);
      setStats(dayStats);
    } catch (error) {
      console.error('Error loading delivery orders:', error);
      showToast('Failed to load orders', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await loadData();
      showToast('Orders refreshed', 'success');
    } catch (error) {
      showToast('Failed to refresh', 'error');
    } finally {
      setRefreshing(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...orders];

    // Apply status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(o => o.status === filters.status);
    }

    // Apply search filter
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(
        o =>
          o.customerName.toLowerCase().includes(term) ||
          o.orderId.toLowerCase().includes(term) ||
          o.id.toLowerCase().includes(term)
      );
    }

    setFilteredOrders(filtered);
  };

  const handleStatusFilterChange = (status: AssignedOrderStatus | 'all') => {
    setFilters({ ...filters, status });
  };

  const handleSearchChange = (term: string) => {
    setFilters({ ...filters, searchTerm: term });
  };

  const handleOpenModal = (order: AssignedOrder, modal: 'deliver' | 'return' | 'delay') => {
    setSelectedOrder(order);
    setActiveModal(modal);
  };

  const handleCloseModal = () => {
    setSelectedOrder(null);
    setActiveModal(null);
  };

  const handleOrderUpdate = (updatedOrder: AssignedOrder) => {
    setOrders(orders.map(o => (o.id === updatedOrder.id ? updatedOrder : o)));
    setSelectedOrder(updatedOrder);
    handleCloseModal();
    showToast('Order updated successfully', 'success');
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => setToastMessage(''), 3000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader className="animate-spin mx-auto mb-4" size={40} />
          <p className="text-gray-600">Loading assigned orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Delivery Orders</h1>
              <p className="text-gray-600 mt-1">Manage assigned deliveries for today</p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50"
            >
              <RotateCw size={18} className={refreshing ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>

          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <StatCard
                label="Assigned"
                value={stats.totalAssigned}
                icon={Package}
                color="bg-blue-50 text-blue-700"
              />
              <StatCard
                label="Delivered"
                value={stats.delivered}
                icon={CheckCircle}
                color="bg-green-50 text-green-700"
              />
              <StatCard
                label="Returns"
                value={stats.returns}
                icon={AlertCircle}
                color="bg-orange-50 text-orange-700"
              />
              <StatCard
                label="Total Value"
                value={formatCurrency(stats.totalValue)}
                icon={TrendingUp}
                color="bg-indigo-50 text-indigo-700"
              />
              <StatCard
                label="Received"
                value={formatCurrency(stats.totalReceived || 0)}
                icon={Truck}
                color="bg-purple-50 text-purple-700"
              />
            </div>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b mx-4 mt-4 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search size={18} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search by customer or order ID..."
              value={filters.searchTerm}
              onChange={e => handleSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={filters.status}
              onChange={e => handleStatusFilterChange(e.target.value as any)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="assigned">Assigned</option>
              <option value="out_for_delivery">Out for Delivery</option>
              <option value="delivered">Delivered</option>
              <option value="partially_returned">Partially Returned</option>
              <option value="fully_returned">Fully Returned</option>
              <option value="delayed">Delayed</option>
            </select>
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-end text-sm text-gray-600">
            <Filter size={16} className="mr-2" />
            {filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Toast */}
      {toastMessage && (
        <div
          className={`fixed top-4 right-4 px-4 py-3 rounded-lg text-white flex items-center gap-2 z-50 ${
            toastType === 'success' ? 'bg-green-600' : 'bg-red-600'
          }`}
        >
          {toastType === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          {toastMessage}
        </div>
      )}

      {/* Orders Grid */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg p-12 text-center border border-gray-200">
            <Package size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {orders.length === 0 ? 'No Orders Assigned' : 'No Orders Match Filters'}
            </h3>
            <p className="text-gray-600 mb-4">
              {orders.length === 0
                ? 'You have no delivery orders assigned for today'
                : 'Try adjusting your search or filters'}
            </p>
            {orders.length === 0 && (
              <button
                onClick={() => navigate('/delivery/dashboard')}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Go to Dashboard
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredOrders.map(order => (
              <OrderCard
                key={order.id}
                order={order}
                onDeliver={() => handleOpenModal(order, 'deliver')}
                onReturn={() => handleOpenModal(order, 'return')}
                onDelay={() => handleOpenModal(order, 'delay')}
                onViewDetails={() => navigate(`/delivery/orders/${order.id}`)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {selectedOrder && (
        <>
          <MarkDeliveredModal
            isOpen={activeModal === 'deliver'}
            order={selectedOrder}
            currentUser={user!}
            onClose={handleCloseModal}
            onSuccess={handleOrderUpdate}
            onError={(error: string) => showToast(error, 'error')}
          />
          <SalesReturnModal
            isOpen={activeModal === 'return'}
            order={selectedOrder}
            currentUser={user!}
            onClose={handleCloseModal}
            onSuccess={handleOrderUpdate}
            onError={(error: string) => showToast(error, 'error')}
          />
          <DelayModal
            isOpen={activeModal === 'delay'}
            order={selectedOrder}
            currentUser={user!}
            onClose={handleCloseModal}
            onSuccess={handleOrderUpdate}
            onError={(error: string) => showToast(error, 'error')}
          />
        </>
      )}
    </div>
  );
};

// ============================================
// SUBCOMPONENTS
// ============================================

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ComponentType<any>;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon: Icon, color }) => (
  <div className={`rounded-lg p-4 ${color}`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs font-medium opacity-75">{label}</p>
        <p className="text-2xl font-bold mt-1">{value}</p>
      </div>
      <Icon size={24} opacity={0.5} />
    </div>
  </div>
);

interface OrderCardProps {
  order: AssignedOrder;
  onDeliver: () => void;
  onReturn: () => void;
  onDelay: () => void;
  onViewDetails: () => void;
}

const OrderCard: React.FC<OrderCardProps> = ({
  order,
  onDeliver,
  onReturn,
  onDelay,
  onViewDetails,
}) => {
  const statusColor = getStatusColor(order.status);
  const paymentStatus = getPaymentStatusBadge(order);

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-bold text-gray-900">{order.customerName}</h3>
            <span className={`px-2 py-1 rounded text-xs font-semibold border ${statusColor}`}>
              {getStatusLabel(order.status)}
            </span>
          </div>
          <p className="text-sm text-gray-600">Order ID: {order.orderId}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-blue-600">{formatCurrency(order.netReceivable)}</p>
          <p className="text-xs text-gray-500 mt-1">Net Receivable</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Items */}
        <div className="border-t pt-4">
          <p className="text-sm font-semibold text-gray-700 mb-2">Items ({order.items.length})</p>
          <div className="space-y-1">
            {order.items.slice(0, 3).map((item, idx) => (
              <div key={idx} className="text-sm text-gray-600 flex justify-between">
                <span>
                  {item.productName} <span className="text-gray-500">x{item.qty}</span>
                </span>
                <span className="font-medium">{formatCurrency(item.total)}</span>
              </div>
            ))}
            {order.items.length > 3 && (
              <p className="text-sm text-gray-500 italic">+{order.items.length - 3} more items</p>
            )}
          </div>
        </div>

        {/* Financial Summary */}
        <div className="bg-gray-50 p-3 rounded space-y-2 text-sm border-t">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal:</span>
            <span>{formatCurrency(order.subtotal)}</span>
          </div>
          {order.damages && order.damages.items.length > 0 && (
            <div className="flex justify-between text-red-600">
              <span>Damages:</span>
              <span>-{formatCurrency(order.damages.totalDamagesAmount)}</span>
            </div>
          )}
          {order.salesReturn && (
            <div className="flex justify-between text-orange-600">
              <span>Returns:</span>
              <span>-{formatCurrency(order.salesReturn.totalReturnAmount)}</span>
            </div>
          )}
          <div className="flex justify-between font-semibold text-gray-900 border-t pt-2">
            <span>Receivable:</span>
            <span>{formatCurrency(order.netReceivable)}</span>
          </div>
        </div>

        {/* Payment Status */}
        {order.payment && (
          <div className="bg-green-50 p-3 rounded text-sm border border-green-200">
            <p className="text-green-700 font-semibold">
              ✓ Payment Received: {formatCurrency(order.payment.amountReceived)}
            </p>
            <p className="text-green-600 text-xs mt-1">
              Mode: {order.payment.paymentMode} • {new Date(order.payment.capturedAt).toLocaleDateString()}
            </p>
          </div>
        )}

        {/* Delay Info */}
        {order.delay && (
          <div className="bg-purple-50 p-3 rounded text-sm border border-purple-200">
            <p className="text-purple-700 font-semibold">
              ⏰ Rescheduled to {new Date(order.delay.rescheduledDate).toLocaleDateString()}
            </p>
            <p className="text-purple-600 text-xs mt-1">Reason: {order.delay.reason}</p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="bg-gray-50 border-t px-4 py-3 flex gap-2 flex-wrap">
        {['assigned', 'out_for_delivery'].includes(order.status) && (
          <>
            <button
              onClick={onDeliver}
              className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded"
            >
              ✓ Mark Delivered
            </button>
            <button
              onClick={onReturn}
              className="flex-1 px-3 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium rounded"
            >
              ↩ Sales Return
            </button>
            <button
              onClick={onDelay}
              className="flex-1 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded"
            >
              ⏱ Record Delay
            </button>
          </>
        )}

        <button
          onClick={onViewDetails}
          className="flex-1 px-3 py-2 border border-gray-300 hover:bg-gray-100 text-gray-700 text-sm font-medium rounded"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default DeliveryOrdersList;
