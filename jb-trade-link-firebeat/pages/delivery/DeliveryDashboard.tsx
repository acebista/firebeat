import React, { useEffect, useState, useMemo } from 'react';
import { Card, Button } from '../../components/ui/Elements';
import { AllTripsModal } from '../../components/delivery/AllTripsModal';
import { MapPin, CheckCircle, Clock, Navigation, Truck, ChevronDown, ChevronUp, TrendingUp, Users, Zap, Search, Package, AlertCircle, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../services/auth';
import { TripService, OrderService, UserService } from '../../services/db';
import { getPackingProgress } from '../../services/packing/packingService';
import { DispatchTrip, Order, User } from '../../types';

interface TripWithStats {
  trip: DispatchTrip;
  orders: Order[];
  completedCount: number;
  pendingCount: number;
  totalValue: number;
  isPackingComplete: boolean;
  totalItems: number;
  packedItems: number;
}

interface UserTripsData {
  user: User;
  trips: TripWithStats[];
  totalAssigned: number;
  totalCompleted: number;
  totalPending: number;
  totalValue: number;
}

export const DeliveryDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isAllTripsModalOpen, setIsAllTripsModalOpen] = useState(false);
  const [myTrips, setMyTrips] = useState<TripWithStats[]>([]);
  const [allUsersTrips, setAllUsersTrips] = useState<UserTripsData[]>([]);
  const [expandedTripId, setExpandedTripId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [tripSearchQuery, setTripSearchQuery] = useState(''); // Search within expanded trip

  const [myStats, setMyStats] = useState({
    totalTrips: 0,
    activeTrips: 0,
    totalAssigned: 0,
    totalCompleted: 0,
    totalPending: 0,
    totalValue: 0
  });
  const [allStats, setAllStats] = useState({
    totalTrips: 0,
    activeTrips: 0,
    totalAssigned: 0,
    totalCompleted: 0,
    totalPending: 0,
    totalValue: 0
  });

  useEffect(() => {
    if (user) {
      loadMyTrips();
      loadAllUsersTrips();
    }
  }, [user]);

  const loadMyTrips = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const trips = await TripService.getByDeliveryPerson(user.id);
      // Filter out completed trips - only show active/in-progress trips
      const activeTrips = trips.filter(t => t.status !== 'completed');
      const tripsWithStats = await processTrips(activeTrips);

      setMyTrips(tripsWithStats);
      calculateMyStats(tripsWithStats);

      // Auto-expand first active trip
      const activeTrip = tripsWithStats.find(t => t.trip.status === 'out_for_delivery');
      if (activeTrip) {
        setExpandedTripId(activeTrip.trip.id);
      }
    } catch (e) {
      console.error("Failed to load my trips", e);
    } finally {
      setLoading(false);
    }
  };

  const loadAllUsersTrips = async () => {
    if (!user) return;
    try {
      const allUsers = await UserService.getAll();
      const deliveryUsers = allUsers.filter(u => u.role === 'delivery');

      const usersTripsData: UserTripsData[] = [];
      let grandTotalTrips = 0;
      let grandTotalActive = 0;
      let grandTotalAssigned = 0;
      let grandTotalCompleted = 0;
      let grandTotalValue = 0;

      for (const deliveryUser of deliveryUsers) {
        try {
          const trips = await TripService.getByDeliveryPerson(deliveryUser.id);
          // Filter out completed trips - only show active/in-progress trips
          const activeTrips = trips.filter(t => t.status !== 'completed');
          const tripsWithStats = await processTrips(activeTrips);

          let userAssigned = 0;
          let userCompleted = 0;
          let userValue = 0;
          let userActive = 0;

          tripsWithStats.forEach(t => {
            userAssigned += t.orders.length;
            userCompleted += t.completedCount;
            userValue += t.totalValue;
            if (t.trip.status === 'out_for_delivery' || t.trip.status === 'draft') {
              userActive++;
            }
          });

          usersTripsData.push({
            user: deliveryUser,
            trips: tripsWithStats,
            totalAssigned: userAssigned,
            totalCompleted: userCompleted,
            totalPending: userAssigned - userCompleted,
            totalValue: userValue
          });

          grandTotalTrips += trips.length;
          grandTotalActive += userActive;
          grandTotalAssigned += userAssigned;
          grandTotalCompleted += userCompleted;
          grandTotalValue += userValue;
        } catch (error) {
          console.error(`Failed to load trips for user ${deliveryUser.id}:`, error);
        }
      }

      setAllUsersTrips(usersTripsData);
      setAllStats({
        totalTrips: grandTotalTrips,
        activeTrips: grandTotalActive,
        totalAssigned: grandTotalAssigned,
        totalCompleted: grandTotalCompleted,
        totalPending: grandTotalAssigned - grandTotalCompleted,
        totalValue: grandTotalValue
      });
    } catch (e) {
      console.error("Failed to load all users trips", e);
    }
  };

  const processTrips = async (trips: DispatchTrip[]) => {
    const tripsWithStats: TripWithStats[] = [];

    for (const trip of trips) {
      if (trip.orderIds && trip.orderIds.length > 0) {
        const orders = await OrderService.getOrdersByIds(trip.orderIds);
        const completed = orders.filter(o => o.status === 'delivered').length;
        const pending = orders.length - completed;
        const tripValue = orders.reduce((sum, o) => sum + o.totalAmount, 0);

        // Check packing progress
        // Calculate total items (handling JSON string parsing safety)
        let totalItems = 0;
        orders.forEach(o => {
          let items = o.items;
          if (typeof items === 'string') {
            try { items = JSON.parse(items); } catch { items = []; }
          }
          if (Array.isArray(items)) {
            totalItems += items.length;
          }
        });

        // Get done progress
        const progress = await getPackingProgress(trip.id);
        const packedItems = progress.filter(p => p.is_done).length;
        // Packing is complete if ALL items are marked done
        const isPackingComplete = totalItems > 0 && packedItems >= totalItems;

        tripsWithStats.push({
          trip,
          orders,
          completedCount: completed,
          pendingCount: pending,
          totalValue: tripValue,
          isPackingComplete,
          totalItems,
          packedItems
        });
      }
    }

    // Sort: active first, then by date
    tripsWithStats.sort((a, b) => {
      const aActive = a.trip.status === 'out_for_delivery' ? 0 : 1;
      const bActive = b.trip.status === 'out_for_delivery' ? 0 : 1;
      if (aActive !== bActive) return aActive - bActive;
      return new Date(b.trip.deliveryDate).getTime() - new Date(a.trip.deliveryDate).getTime();
    });

    return tripsWithStats;
  };

  const calculateMyStats = (tripsData: TripWithStats[]) => {
    let totalAssigned = 0;
    let totalCompleted = 0;
    let totalValue = 0;
    let activeCount = 0;

    tripsData.forEach(t => {
      totalAssigned += t.orders.length;
      totalCompleted += t.completedCount;
      totalValue += t.totalValue;
      if (t.trip.status === 'out_for_delivery' || t.trip.status === 'draft') {
        activeCount++;
      }
    });

    setMyStats({
      totalTrips: tripsData.length,
      activeTrips: activeCount,
      totalAssigned,
      totalCompleted,
      totalPending: totalAssigned - totalCompleted,
      totalValue
    });
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'draft': return 'bg-yellow-50 border-yellow-100';
      case 'out_for_delivery': return 'bg-blue-50 border-blue-100';
      case 'completed': return 'bg-green-50 border-green-100';
      default: return 'bg-gray-50 border-gray-100';
    }
  };

  const getStatusBadge = (status: string): string => {
    switch (status) {
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'out_for_delivery': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string): string => {
    switch (status) {
      case 'draft': return 'Draft';
      case 'out_for_delivery': return 'Active';
      case 'completed': return 'Completed';
      default: return status;
    }
  };

  const filteredTrips = useMemo(() => {
    if (!searchQuery.trim()) return myTrips;
    const lowerQ = searchQuery.toLowerCase();

    return myTrips.filter(t => {
      // Search in trip ID
      if (t.trip.id.toLowerCase().includes(lowerQ)) return true;

      // Search in orders (customer or ID)
      const hasMatchingOrder = t.orders.some(o =>
        o.customerName.toLowerCase().includes(lowerQ) ||
        o.id.toLowerCase().includes(lowerQ)
      );
      return hasMatchingOrder;
    });
  }, [myTrips, searchQuery]);

  if (loading) return <div className="p-8 text-center">Loading dashboard...</div>;

  return (
    <div className="space-y-6 pb-20">
      {/* Header with View Toggle */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">
          My Delivery Trips
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAllTripsModalOpen(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition whitespace-nowrap"
          >
            All Trips
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search invoice number or customer name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <Card className="p-3 bg-indigo-50 border-indigo-100">
          <p className="text-xs text-indigo-600 font-medium">Active Trips</p>
          <h3 className="text-2xl font-bold text-indigo-900">{myStats.activeTrips}</h3>
        </Card>
        <Card className="p-3 bg-blue-50 border-blue-100">
          <p className="text-xs text-blue-600 font-medium">Total Assigned</p>
          <h3 className="text-2xl font-bold text-blue-900">{myStats.totalAssigned}</h3>
        </Card>
        <Card className="p-3 bg-green-50 border-green-100">
          <p className="text-xs text-green-600 font-medium">Completed</p>
          <h3 className="text-2xl font-bold text-green-900">{myStats.totalCompleted}</h3>
        </Card>
        <Card className="p-3 bg-yellow-50 border-yellow-100">
          <p className="text-xs text-yellow-600 font-medium">Pending</p>
          <h3 className="text-2xl font-bold text-yellow-900">{myStats.totalPending}</h3>
        </Card>
        <Card className="p-3 bg-purple-50 border-purple-100 col-span-2 md:col-span-1">
          <p className="text-xs text-purple-600 font-medium">Total Value</p>
          <h3 className="text-lg font-bold text-purple-900">₹{myStats.totalValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</h3>
        </Card>
      </div>

      {/* MY TRIPS VIEW */}
      {filteredTrips.length === 0 ? (
        <Card className="p-8 text-center bg-gray-50">
          <Truck className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-900">No Trips Found</h3>
          <p className="text-gray-500">
            {searchQuery ? 'No trips match your search.' : "You don't have any delivery trips assigned."}
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredTrips.map((tripData) => (
            <Card key={tripData.trip.id} className={`overflow-hidden transition ${getStatusColor(tripData.trip.status)}`}>
              <button
                onClick={() => setExpandedTripId(expandedTripId === tripData.trip.id ? null : tripData.trip.id)}
                className="w-full p-4 flex items-center justify-between hover:bg-black hover:bg-opacity-5 transition"
              >
                <div className="flex items-center gap-3 flex-1 text-left">
                  <Truck size={20} className="text-gray-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-gray-900">Trip #{tripData.trip.id.slice(0, 8)}</h4>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${getStatusBadge(tripData.trip.status)}`}>
                        {getStatusLabel(tripData.trip.status)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {tripData.trip.deliveryDate} • {tripData.orders.length} order{tripData.orders.length !== 1 ? 's' : ''} • ₹{tripData.totalValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0 ml-2">
                  <div className="text-right">
                    <p className="text-xs text-gray-600 font-medium">{tripData.completedCount}/{tripData.orders.length}</p>
                    <p className="text-xs text-gray-500">{tripData.orders.length > 0 ? Math.round((tripData.completedCount / tripData.orders.length) * 100) : 0}%</p>
                  </div>
                  {expandedTripId === tripData.trip.id ? (
                    <ChevronUp size={20} className="text-gray-400" />
                  ) : (
                    <ChevronDown size={20} className="text-gray-400" />
                  )}
                </div>
              </button>

              {/* Progress Bar */}
              <div className="px-4 pb-3">
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-green-400 to-green-600 h-full transition-all duration-300"
                    style={{ width: `${tripData.orders.length > 0 ? (tripData.completedCount / tripData.orders.length) * 100 : 0}%` }}
                  />
                </div>
              </div>

              {/* Packing Status Alert */}
              {expandedTripId === tripData.trip.id && !tripData.isPackingComplete && tripData.orders.length > 0 && (
                <div className="mx-4 mb-2 p-2 bg-amber-100 border border-amber-200 rounded text-xs text-amber-800 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>Packing Incomplete ({tripData.packedItems}/{tripData.totalItems} items). Please pack all items before delivering.</span>
                </div>
              )}

              {/* Packing List Button */}
              {expandedTripId === tripData.trip.id && (
                <div className="px-4 py-2 bg-white bg-opacity-50 border-t border-opacity-20 border-current flex gap-2">
                  <Button
                    size="sm"
                    className={`flex-1 ${!tripData.isPackingComplete ? 'animate-pulse ring-2 ring-amber-400' : ''}`}
                    onClick={() => navigate(`/delivery/packing-list/${tripData.trip.id}`)}
                  >
                    📦 {tripData.isPackingComplete ? 'Packing List' : 'Start Packing'}
                  </Button>
                </div>
              )}

              {/* Trip Details */}
              {expandedTripId === tripData.trip.id && (
                <div className="px-4 pb-4 border-t border-opacity-20 border-current">
                  {/* Search within trip */}
                  <div className="mt-3 mb-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search stops by customer or invoice..."
                        value={tripSearchQuery}
                        onChange={(e) => setTripSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                      {tripSearchQuery && (
                        <button
                          onClick={() => setTripSearchQuery('')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    {tripSearchQuery && (
                      <p className="text-xs text-gray-500 mt-1 ml-1">
                        {(() => {
                          const matchCount = tripData.orders.filter(o =>
                            o.customerName.toLowerCase().includes(tripSearchQuery.toLowerCase()) ||
                            o.id.toLowerCase().includes(tripSearchQuery.toLowerCase())
                          ).length;
                          return `${matchCount} of ${tripData.orders.length} stops match`;
                        })()}
                      </p>
                    )}
                  </div>


                  <div className="space-y-2">
                    {(() => {
                      // Show only matching orders when searching, all orders when not
                      const lowerQ = tripSearchQuery.toLowerCase();

                      const filteredOrders = tripSearchQuery.trim()
                        ? tripData.orders
                          .map((order, idx) => ({ ...order, originalIndex: idx }))
                          .filter((order) =>
                            order.customerName.toLowerCase().includes(lowerQ) ||
                            order.id.toLowerCase().includes(lowerQ)
                          )
                        : tripData.orders.map((o, idx) => ({ ...o, originalIndex: idx }));

                      return filteredOrders.map((order: any) => {
                        const isMatch = tripSearchQuery.trim();

                        return (
                          <div
                            key={order.id}
                            className={`p-3 rounded-lg text-sm transition-all ${order.status === 'delivered'
                              ? 'bg-white bg-opacity-40'
                              : isMatch
                                ? 'bg-yellow-50 border-2 border-yellow-400 shadow-md'
                                : 'bg-white'
                              }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className={`font-medium text-xs px-2 py-0.5 rounded ${isMatch ? 'bg-yellow-200 text-yellow-900' : 'bg-gray-200 text-gray-700'
                                    }`}>
                                    Stop #{order.originalIndex + 1}
                                  </span>
                                  {order.status === 'delivered' && (
                                    <CheckCircle size={14} className="text-green-600 flex-shrink-0" />
                                  )}
                                  {isMatch && (
                                    <span className="text-xs font-semibold text-yellow-700 bg-yellow-100 px-2 py-0.5 rounded">
                                      Match
                                    </span>
                                  )}
                                </div>
                                <h5 className="font-semibold text-gray-900 truncate">{order.customerName}</h5>
                                <p className="text-xs text-gray-500 mt-0.5">Order: {order.id.slice(0, 12)}</p>
                              </div>
                              <div className="text-right flex-shrink-0">
                                <p className="font-bold text-indigo-600">₹{order.totalAmount.toFixed(0)}</p>
                                {order.status === 'delivered' ? (
                                  <p className="text-xs text-green-600 font-medium mt-0.5">Delivered</p>
                                ) : (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    disabled={!tripData.isPackingComplete}
                                    onClick={() => navigate(`/delivery/invoice/${order.id}`)}
                                    className={`mt-1 text-xs ${!tripData.isPackingComplete ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    title={!tripData.isPackingComplete ? "Finish packing first" : ""}
                                  >
                                    Deliver
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* All Trips Modal */}
      <AllTripsModal
        isOpen={isAllTripsModalOpen}
        onClose={() => setIsAllTripsModalOpen(false)}
        allUsersTrips={allUsersTrips}
        allStats={allStats}
      />
    </div>
  );
};