import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Badge } from '../../components/ui/Elements';
import { Truck, MapPin, CheckCircle, Clock, Users, TrendingUp, ArrowRight, Search, Package } from 'lucide-react';
import { TripService, OrderService, UserService } from '../../services/db';
import { DispatchTrip, Order, User } from '../../types';

interface TripWithStats {
  trip: DispatchTrip;
  orders: Order[];
  deliveryPerson: User | null;
  completedCount: number;
  pendingCount: number;
  totalValue: number;
}

export const TripsOverview: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [trips, setTrips] = useState<TripWithStats[]>([]);
  const [deliveryUsers, setDeliveryUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'out_for_delivery' | 'completed'>('all');
  const [stats, setStats] = useState({
    totalTrips: 0,
    activeTrips: 0,
    totalOrders: 0,
    totalValue: 0,
    completedOrders: 0
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // 1. Get all trips
      const allTrips = await TripService.getAll();

      // 2. Get all delivery users for mapping
      const users = await UserService.getAll();
      const deliveryPeopleMap = new Map(
        users.filter(u => u.role === 'delivery').map(u => [u.id, u])
      );
      setDeliveryUsers(Array.from(deliveryPeopleMap.values()));

      // 3. Enrich trips with orders and stats
      const tripsWithStats: TripWithStats[] = await Promise.all(
        allTrips.map(async (trip) => {
          try {
            const orders = trip.orderIds && trip.orderIds.length > 0
              ? await OrderService.getOrdersByIds(trip.orderIds)
              : [];

            const completedCount = orders.filter(o => o.status === 'delivered').length;
            const pendingCount = orders.length - completedCount;
            const totalValue = orders.reduce((sum, o) => sum + o.totalAmount, 0);

            return {
              trip,
              orders,
              deliveryPerson: deliveryPeopleMap.get(trip.deliveryPersonId) || null,
              completedCount,
              pendingCount,
              totalValue
            };
          } catch (e) {
            console.error(`Failed to load details for trip ${trip.id}`, e);
            return {
              trip,
              orders: [],
              deliveryPerson: deliveryPeopleMap.get(trip.deliveryPersonId) || null,
              completedCount: 0,
              pendingCount: 0,
              totalValue: 0
            };
          }
        })
      );

      setTrips(tripsWithStats);

      // 4. Calculate stats
      const activeTrips = tripsWithStats.filter(t =>
        t.trip.status === 'out_for_delivery' || t.trip.status === 'draft'
      ).length;

      const totalOrders = tripsWithStats.reduce((sum, t) => sum + t.orders.length, 0);
      const totalValue = tripsWithStats.reduce((sum, t) => sum + t.totalValue, 0);
      const completedOrders = tripsWithStats.reduce((sum, t) => sum + t.completedCount, 0);

      setStats({
        totalTrips: tripsWithStats.length,
        activeTrips,
        totalOrders,
        totalValue,
        completedOrders
      });
    } catch (e) {
      console.error('Failed to load trips overview', e);
    } finally {
      setLoading(false);
    }
  };

  // Filter trips based on search and status
  const filteredTrips = trips.filter(t => {
    const matchesStatus = statusFilter === 'all' || t.trip.status === statusFilter;
    const matchesSearch = searchQuery.toLowerCase() === '' ||
      t.deliveryPerson?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.trip.vehicleName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.trip.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-yellow-50 border-yellow-100';
      case 'out_for_delivery': return 'bg-blue-50 border-blue-100';
      case 'completed': return 'bg-green-50 border-green-100';
      default: return 'bg-gray-50 border-gray-100';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft': return <Badge color="amber">Draft</Badge>;
      case 'out_for_delivery': return <Badge color="blue">Out for Delivery</Badge>;
      case 'completed': return <Badge color="green">Completed</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading trips...</div>;
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Delivery Trips Overview</h1>
          <p className="text-gray-500 mt-1">Monitor all assigned delivery trips and orders</p>
        </div>
        <Button onClick={() => navigate('/admin/dispatch')} variant="outline">
          <ArrowRight className="mr-2 h-4 w-4" />
          Create New Trip
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Card className="p-4 bg-indigo-50 border-indigo-100">
          <p className="text-xs text-indigo-600 font-medium uppercase">Total Trips</p>
          <h3 className="text-2xl font-bold text-indigo-900 mt-1">{stats.totalTrips}</h3>
        </Card>
        <Card className="p-4 bg-blue-50 border-blue-100">
          <p className="text-xs text-blue-600 font-medium uppercase">Active</p>
          <h3 className="text-2xl font-bold text-blue-900 mt-1">{stats.activeTrips}</h3>
        </Card>
        <Card className="p-4 bg-purple-50 border-purple-100">
          <p className="text-xs text-purple-600 font-medium uppercase">Total Orders</p>
          <h3 className="text-2xl font-bold text-purple-900 mt-1">{stats.totalOrders}</h3>
        </Card>
        <Card className="p-4 bg-green-50 border-green-100">
          <p className="text-xs text-green-600 font-medium uppercase">Completed</p>
          <h3 className="text-2xl font-bold text-green-900 mt-1">{stats.completedOrders}</h3>
        </Card>
        <Card className="p-4 bg-amber-50 border-amber-100">
          <p className="text-xs text-amber-600 font-medium uppercase">Total Value</p>
          <h3 className="text-xl font-bold text-amber-900 mt-1">₹{(stats.totalValue / 100000).toFixed(1)}L</h3>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by delivery person, vehicle, or trip ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="flex gap-2">
          {(['all', 'draft', 'out_for_delivery', 'completed'] as const).map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-2 rounded-lg font-medium text-sm transition-colors ${statusFilter === status
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              {status === 'all' ? 'All' : status === 'out_for_delivery' ? 'Active' : status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Trips Grid */}
      {filteredTrips.length === 0 ? (
        <Card className="p-12 text-center bg-gray-50">
          <Truck className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-900">No Trips Found</h3>
          <p className="text-gray-500 mt-1">
            {searchQuery || statusFilter !== 'all' ? 'Try adjusting your filters' : 'No trips have been created yet'}
          </p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredTrips.map(({ trip, orders, deliveryPerson, completedCount, pendingCount, totalValue }) => (
            <Card
              key={trip.id}
              className={`p-6 border-2 transition-all hover:shadow-lg cursor-pointer ${getStatusColor(trip.status)}`}
              onClick={() => navigate(`/admin/dispatch/trips/${trip.id}`)}
            >
              {/* Header Row */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4 flex-1">
                  {/* Trip Icon & Basic Info */}
                  <div className="bg-indigo-100 rounded-full p-3">
                    <Truck className="h-6 w-6 text-indigo-600" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-bold text-gray-900">
                        {deliveryPerson?.name || 'Unknown'} - {trip.deliveryDate}
                      </h3>
                      {getStatusBadge(trip.status)}
                    </div>
                    <div className="flex flex-wrap gap-3 text-sm text-gray-600 mt-2">
                      <span className="flex items-center gap-1">
                        <Truck className="h-3 w-3" />
                        {trip.vehicleName || 'No Vehicle'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Package className="h-3 w-3" />
                        {orders.length} order{orders.length !== 1 ? 's' : ''}
                      </span>
                      <span className="flex items-center gap-1 font-semibold text-gray-900">
                        ₹{totalValue.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status Indicators */}
                <div className="text-right">
                  <div className="text-2xl font-bold text-indigo-600">{completedCount}/{orders.length}</div>
                  <p className="text-xs text-gray-500">Completed</p>
                </div>
              </div>

              {/* Progress Bar */}
              {orders.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-gray-700">Progress</span>
                    <span className="text-xs text-gray-600">{Math.round((completedCount / orders.length) * 100)}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 transition-all duration-500"
                      style={{ width: `${(completedCount / orders.length) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Orders Summary */}
              {orders.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Orders in Trip</h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {orders.map((order, idx) => (
                      <div key={order.id} className="flex items-center justify-between text-sm p-2 bg-white bg-opacity-50 rounded">
                        <div className="flex items-center gap-3 flex-1">
                          <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-indigo-100 text-indigo-600 text-xs font-bold">
                            {idx + 1}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">{order.customerName}</p>
                            <p className="text-xs text-gray-500">{order.id}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900">₹{order.totalAmount.toLocaleString()}</span>
                          {order.status === 'delivered' ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <Clock className="h-4 w-4 text-blue-500" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Button */}
              <div className="mt-4 pt-4 border-t border-gray-200 flex justify-end">
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/admin/dispatch/trips/${trip.id}`);
                  }}
                >
                  View Details
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Delivery People Summary (Side Panel) */}
      {deliveryUsers.length > 0 && (
        <Card className="p-6 bg-gray-50 border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Users className="h-5 w-5 text-indigo-600" />
            Delivery Personnel Status
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {deliveryUsers.map(person => {
              const personTrips = trips.filter(t => t.trip.deliveryPersonId === person.id);
              const activeTripsCount = personTrips.filter(t =>
                t.trip.status === 'out_for_delivery' || t.trip.status === 'draft'
              ).length;
              const totalOrdersForPerson = personTrips.reduce((sum, t) => sum + t.orders.length, 0);
              const completedOrdersForPerson = personTrips.reduce((sum, t) => sum + t.completedCount, 0);

              return (
                <Card key={person.id} className="p-4 bg-white border-gray-100">
                  <h4 className="font-semibold text-gray-900 truncate">{person.name}</h4>
                  <div className="mt-3 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Trips:</span>
                      <span className="font-bold text-indigo-600">{activeTripsCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Orders:</span>
                      <span className="font-bold text-gray-900">{totalOrdersForPerson}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Completed:</span>
                      <span className="font-bold text-green-600">{completedOrdersForPerson}</span>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
};

export default TripsOverview;
