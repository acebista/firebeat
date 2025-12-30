import React, { useState, useEffect } from 'react';
import { Card, Button } from '../../components/ui/Elements';
import { Modal } from '../../components/ui/Modal';
import { MapPin, CheckCircle, Clock, Navigation, Truck, ChevronDown, ChevronUp, TrendingUp, Users, Zap, Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DispatchTrip, Order, User } from '../../types';

interface TripWithStats {
  trip: DispatchTrip;
  orders: Order[];
  completedCount: number;
  pendingCount: number;
  totalValue: number;
}

interface UserTripsData {
  user: User;
  trips: TripWithStats[];
  totalAssigned: number;
  totalCompleted: number;
  totalPending: number;
  totalValue: number;
  collections: {
    cash: number;
    qr: number;
    cheque: number;
    credit: number;
    total: number;
  };
}

interface AllTripsModalProps {
  isOpen: boolean;
  onClose: () => void;
  allUsersTrips: UserTripsData[];
  allStats: {
    totalTrips: number;
    activeTrips: number;
    totalAssigned: number;
    totalCompleted: number;
    totalPending: number;
    totalValue: number;
    collections: {
      cash: number;
      qr: number;
      cheque: number;
      credit: number;
      total: number;
    };
  };
  onViewSummary?: (tripData: TripWithStats) => void;
}

export const AllTripsModal: React.FC<AllTripsModalProps> = ({
  isOpen,
  onClose,
  allUsersTrips,
  allStats,
  onViewSummary
}) => {
  const navigate = useNavigate();
  const [expandedTripId, setExpandedTripId] = useState<string | null>(null);
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [tripSearchQuery, setTripSearchQuery] = useState(''); // Search within expanded trip

  useEffect(() => {
    if (isOpen && allUsersTrips.length > 0) {
      // Auto-expand first user with active trips
      const userWithActiveTrip = allUsersTrips.find(u => u.trips.some(t => t.trip.status === 'out_for_delivery'));
      if (userWithActiveTrip) {
        setExpandedUserId(userWithActiveTrip.user.id);
        const activeTrip = userWithActiveTrip.trips.find(t => t.trip.status === 'out_for_delivery');
        if (activeTrip) {
          setExpandedTripId(activeTrip.trip.id);
        }
      }
    }
  }, [isOpen, allUsersTrips]);

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'draft':
        return 'bg-yellow-50 border-yellow-100';
      case 'out_for_delivery':
        return 'bg-blue-50 border-blue-100';
      case 'completed':
        return 'bg-green-50 border-green-100';
      default:
        return 'bg-gray-50 border-gray-100';
    }
  };

  const getStatusBadge = (status: string): string => {
    switch (status) {
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'out_for_delivery':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string): string => {
    switch (status) {
      case 'draft':
        return 'Draft';
      case 'out_for_delivery':
        return 'Active';
      case 'completed':
        return 'Completed';
      default:
        return status;
    }
  };

  // Filter trips based on search term (by invoice number or customer name)
  const getFilteredTrips = () => {
    if (!searchTerm.trim()) {
      return allUsersTrips;
    }

    const term = searchTerm.toLowerCase();
    return allUsersTrips
      .map(userData => ({
        ...userData,
        trips: userData.trips.map(tripData => ({
          ...tripData,
          orders: tripData.orders.filter(order =>
            order.id.toLowerCase().includes(term) ||
            order.customerName.toLowerCase().includes(term)
          )
        })).filter(tripData => tripData.orders.length > 0)
      }))
      .filter(userData => userData.trips.length > 0);
  };

  const filteredTrips = getFilteredTrips();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="All Delivery Trips" size="xl">
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card className="p-3 bg-indigo-50 border-indigo-100 text-center">
            <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider">Active Trips</p>
            <h3 className="text-xl font-black text-indigo-900">{allStats.activeTrips}</h3>
          </Card>
          <Card className="p-3 bg-blue-50 border-blue-100 text-center">
            <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">Assigned</p>
            <h3 className="text-xl font-black text-blue-900">{allStats.totalAssigned}</h3>
          </Card>
          <Card className="p-3 bg-green-50 border-green-100 text-center">
            <p className="text-[10px] text-green-600 font-bold uppercase tracking-wider">Completed</p>
            <h3 className="text-xl font-black text-green-900">{allStats.totalCompleted}</h3>
          </Card>
          <Card className="p-3 bg-red-50 border-red-100 text-center">
            <p className="text-[10px] text-red-600 font-bold uppercase tracking-wider">Pending</p>
            <h3 className="text-xl font-black text-red-900">{allStats.totalPending}</h3>
          </Card>
        </div>

        {/* Collection Split Grid */}
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="h-4 w-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-tight">System Collection Summary</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div className="bg-white p-2 rounded-lg border border-gray-200 shadow-sm text-center">
              <p className="text-[10px] text-gray-500 font-bold uppercase">Cash</p>
              <p className="text-sm font-black text-gray-900">₹{allStats.collections.cash.toLocaleString()}</p>
            </div>
            <div className="bg-white p-2 rounded-lg border border-gray-200 shadow-sm text-center">
              <p className="text-[10px] text-gray-500 font-bold uppercase">QR Code</p>
              <p className="text-sm font-black text-gray-900">₹{allStats.collections.qr.toLocaleString()}</p>
            </div>
            <div className="bg-white p-2 rounded-lg border border-gray-200 shadow-sm text-center">
              <p className="text-[10px] text-gray-500 font-bold uppercase">Cheque</p>
              <p className="text-sm font-black text-gray-900">₹{allStats.collections.cheque.toLocaleString()}</p>
            </div>
            <div className="bg-white p-2 rounded-lg border border-gray-200 shadow-sm text-center">
              <p className="text-[10px] text-gray-500 font-bold uppercase">Credit</p>
              <p className="text-sm font-black text-amber-600">₹{allStats.collections.credit.toLocaleString()}</p>
            </div>
            <div className="bg-emerald-600 p-2 rounded-lg border border-emerald-700 shadow-md col-span-2 md:col-span-1 text-center flex flex-col justify-center">
              <p className="text-[10px] text-emerald-100 font-bold uppercase">Total Collected</p>
              <p className="text-sm font-black text-white">₹{allStats.collections.total.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Search Filter */}
        <div className="relative">
          <Search size={18} className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search by invoice number or customer name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Trips List */}
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {allUsersTrips.length === 0 ? (
            <Card className="p-8 text-center bg-gray-50">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-900">No Delivery Users</h3>
              <p className="text-gray-500">No delivery personnel found in the system.</p>
            </Card>
          ) : filteredTrips.length === 0 ? (
            <Card className="p-8 text-center bg-gray-50">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-900">No Invoices Found</h3>
              <p className="text-gray-500">No invoices match "{searchTerm}"</p>
              <button
                onClick={() => setSearchTerm('')}
                className="mt-4 text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                Clear Search
              </button>
            </Card>
          ) : (
            filteredTrips.map((userData) => (
              <Card key={userData.user.id} className="overflow-hidden">
                <button
                  onClick={() => setExpandedUserId(expandedUserId === userData.user.id ? null : userData.user.id)}
                  className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition"
                >
                  <div className="flex items-center gap-3 flex-1 text-left">
                    <Users size={20} className="text-gray-600 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-900">{userData.user.name}</h4>
                      <p className="text-sm text-gray-600">
                        {userData.trips.length} trip{userData.trips.length !== 1 ? 's' : ''} • {userData.totalAssigned} order{userData.totalAssigned !== 1 ? 's' : ''} • ₹{userData.totalValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0 ml-2">
                    <div className="text-right">
                      <p className="text-xs text-gray-600 font-medium">{userData.totalCompleted}/{userData.totalAssigned}</p>
                      <p className="text-xs text-gray-500">{userData.totalAssigned > 0 ? Math.round((userData.totalCompleted / userData.totalAssigned) * 100) : 0}%</p>
                    </div>
                    {expandedUserId === userData.user.id ? (
                      <ChevronUp size={20} className="text-gray-400" />
                    ) : (
                      <ChevronDown size={20} className="text-gray-400" />
                    )}
                  </div>
                </button>

                {/* User Trips */}
                {expandedUserId === userData.user.id && (
                  <div className="px-4 pb-4 border-t border-gray-200">
                    <div className="space-y-3 mt-3">
                      {userData.trips.map((tripData) => (
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
                                <p className="text-xs text-gray-500">{Math.round((tripData.completedCount / tripData.orders.length) * 100)}%</p>
                              </div>
                              {expandedTripId === tripData.trip.id ? (
                                <ChevronUp size={20} className="text-gray-400" />
                              ) : (
                                <ChevronDown size={20} className="text-gray-400" />
                              )}
                            </div>
                          </button>

                          {/* Action Buttons for Trip */}
                          {expandedTripId === tripData.trip.id && onViewSummary && (
                            <div className="px-4 pb-2 flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex-1 text-xs py-1"
                                onClick={() => onViewSummary(tripData as any)}
                              >
                                📊 View Summary
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex-1 text-xs py-1"
                                onClick={() => navigate(`/delivery/packing-list/${tripData.trip.id}`)}
                              >
                                📋 Packing List
                              </Button>
                            </div>
                          )}

                          {/* Progress Bar */}
                          <div className="px-4 pb-3">
                            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                              <div
                                className="bg-gradient-to-r from-green-400 to-green-600 h-full transition-all duration-300"
                                style={{ width: `${(tripData.completedCount / tripData.orders.length) * 100}%` }}
                              />
                            </div>
                          </div>

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
                                                onClick={() => navigate(`/delivery/invoice/${order.id}`)}
                                                className="mt-1 text-xs"
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
                  </div>
                )}
              </Card>
            ))
          )}
        </div>
      </div>
    </Modal>
  );
};
