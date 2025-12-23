import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Truck, Plus, ChevronDown, ChevronRight, Package, ArrowRight, Calendar, X } from 'lucide-react';
import { Card, Button, Select, Input } from '../../components/ui/Elements';
import { tripSchema } from '../../utils/validation/schemas';
import { z } from 'zod';
import { Modal } from '../../components/ui/Modal';
import { Order, DispatchTrip, User, Vehicle } from '../../types';
import { OrderService, TripService, UserService, VehicleService } from '../../services/db';
import toast from 'react-hot-toast';

interface OrderGroup {
  id: string;
  name: string;
  orders: Order[];
  totalAmount: number;
}

export const DispatchPlanner: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [trips, setTrips] = useState<DispatchTrip[]>([]);
  const [salesUsers, setSalesUsers] = useState<User[]>([]);
  const [deliveryUsers, setDeliveryUsers] = useState<User[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrderIds, setSelectedOrderIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [filterByDate, setFilterByDate] = useState(true);
  const [selectedSalespersons, setSelectedSalespersons] = useState<Set<string>>(new Set());
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [isCreateTripModalOpen, setCreateTripModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isCreatingTrip, setIsCreatingTrip] = useState(false);
  const [newTripData, setNewTripData] = useState({ deliveryPersonId: '', vehicleId: '', deliveryDate: new Date().toISOString().split('T')[0] });
  const [isVehicleModalOpen, setVehicleModalOpen] = useState(false);
  const [newVehicle, setNewVehicle] = useState<Partial<Vehicle>>({ name: '', registrationNo: '', capacityCases: undefined });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Pass date to backend if filtering by date
        const dateParam = filterByDate ? selectedDate : undefined;
        const pendingOrders = await OrderService.getPendingDispatch(dateParam);
        console.log('🔍 DEBUG: Total pending orders fetched:', pendingOrders.length);
        console.log('🔍 DEBUG: Date filter enabled:', filterByDate, 'Selected date:', selectedDate);

        // Debug: Log unique dates to see the format
        const uniqueDates = Array.from(new Set(pendingOrders.map(o => o.date)));
        console.log('🔍 DEBUG: Unique order dates found:', uniqueDates);
        console.log('🔍 DEBUG: Selected date for comparison:', selectedDate);

        // Debug: Log a few sample orders
        if (pendingOrders.length > 0) {
          console.log('🔍 DEBUG: Sample order:', {
            id: pendingOrders[0].id,
            date: pendingOrders[0].date,
            dateType: typeof pendingOrders[0].date,
            time: pendingOrders[0].time,
            customerName: pendingOrders[0].customerName
          });
        }

        setOrders(pendingOrders);
        const allTrips = await TripService.getAll();
        // Filter out completed trips - only show active/in-progress trips in dispatch planner
        const activeTrips = allTrips.filter(t => t.status !== 'completed');
        setTrips(activeTrips.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));

        try {
          const users = await UserService.getAll();
          const salesPeople = users.filter(u => u.role === 'sales');
          const deliveryPeople = users.filter(u => u.role === 'delivery');
          console.log('🔍 DEBUG: Users loaded:', users.length);
          console.log('🔍 DEBUG: Sales users:', salesPeople.length, salesPeople.map(u => u.name));
          console.log('🔍 DEBUG: Delivery users:', deliveryPeople.length);
          setSalesUsers(salesPeople);
          setDeliveryUsers(deliveryPeople);
        } catch (userErr) {
          console.error('Failed to load users:', userErr);
          setSalesUsers([]);
          setDeliveryUsers([]);
        }

        try { const vehs = await VehicleService.getAll(); setVehicles(vehs); } catch (vehErr) { console.error('Failed to load vehicles', vehErr); setVehicles([]); }
      } catch (e) { console.error("Error loading dispatch data", e); }
      finally { setLoading(false); }
    };
    loadData();
  }, [refreshKey, filterByDate, selectedDate]);

  const getOrderAssignmentDetails = (orderId: string) => {
    const trip = trips.find(t => t.orderIds.includes(orderId));
    if (!trip) return null;
    return { tripId: trip.id, deliveryPersonName: trip.deliveryPersonName, vehicleName: trip.vehicleName, deliveryDate: trip.deliveryDate };
  };

  // Helper function to normalize dates to YYYY-MM-DD format
  const normalizeDateToYYYYMMDD = (dateStr: string | undefined): string => {
    if (!dateStr) return '';
    // If it's already in YYYY-MM-DD format, return as is
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
    // If it's a full ISO timestamp, extract the date part
    if (dateStr.includes('T')) return dateStr.split('T')[0];
    // Try to parse and format
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr; // Invalid date, return as is
      return date.toISOString().split('T')[0];
    } catch {
      return dateStr;
    }
  };

  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) || o.id.toLowerCase().includes(searchQuery.toLowerCase());
    // Normalize both dates before comparing
    const orderDate = normalizeDateToYYYYMMDD(o.date);
    const matchesDate = !filterByDate || orderDate === selectedDate;
    const matchesSalesperson = selectedSalespersons.size === 0 || selectedSalespersons.has(o.salespersonId);

    // Debug logging for first few orders
    if (orders.indexOf(o) < 3) {
      console.log(`🔍 Order ${o.id}: original date="${o.date}", normalized="${orderDate}", selected="${selectedDate}", matches=${matchesDate}`);
    }

    return matchesSearch && matchesDate && matchesSalesperson;
  });

  const unassignedOrders = filteredOrders.filter(o => !o.assignedTripId);
  const assignedOrders = filteredOrders.filter(o => o.assignedTripId);

  const groupedOrders = filteredOrders.reduce((acc, order) => {
    const key = order.salespersonId;
    if (!acc[key]) { acc[key] = { id: key, name: order.salespersonName, orders: [], totalAmount: 0 }; }
    acc[key].orders.push(order);
    acc[key].totalAmount += order.totalAmount;
    return acc;
  }, {} as Record<string, OrderGroup>);

  const toggleGroup = (groupId: string) => { const newSet = new Set(expandedGroups); if (newSet.has(groupId)) newSet.delete(groupId); else newSet.add(groupId); setExpandedGroups(newSet); };
  const toggleOrderSelection = (orderId: string) => { const newSet = new Set(selectedOrderIds); if (newSet.has(orderId)) newSet.delete(orderId); else newSet.add(orderId); setSelectedOrderIds(newSet); };
  const toggleGroupSelection = (groupOrders: Order[]) => { const selectable = groupOrders.filter(o => !o.assignedTripId); const newSet = new Set(selectedOrderIds); const allSelected = selectable.length > 0 && selectable.every(o => newSet.has(o.id)); if (allSelected) { selectable.forEach(o => newSet.delete(o.id)); } else { selectable.forEach(o => newSet.add(o.id)); } setSelectedOrderIds(newSet); };

  const handleCreateTrip = async () => { try { if (isCreatingTrip) return; const validatedData = tripSchema.parse(newTripData); setValidationErrors({}); setIsCreatingTrip(true); const dp = deliveryUsers.find(d => d.id === validatedData.deliveryPersonId); const veh = vehicles.find((v: Vehicle) => v.id === validatedData.vehicleId); const newTrip: Omit<DispatchTrip, 'id'> = { deliveryDate: newTripData.deliveryDate, deliveryPersonId: dp!.id, deliveryPersonName: dp!.name, vehicleId: veh?.id, vehicleName: veh?.name, routeIds: [], routeNames: [], orderIds: [], totalOrders: 0, totalAmount: 0, status: 'draft', createdAt: new Date().toISOString() }; const createdTrip = await TripService.add(newTrip); if (selectedOrderIds.size > 0) { const selectedOrdersList = orders.filter(o => selectedOrderIds.has(o.id)); await TripService.assignOrders(createdTrip.id, Array.from(selectedOrderIds), createdTrip as DispatchTrip, selectedOrdersList); setSelectedOrderIds(new Set()); } setCreateTripModalOpen(false); setNewTripData({ deliveryPersonId: '', vehicleId: '', deliveryDate: new Date().toISOString().split('T')[0] }); setRefreshKey(k => k + 1); toast.success('Trip created successfully'); } catch (e: any) { if (e instanceof z.ZodError) { const errors: Record<string, string> = {}; (e as any).errors.forEach((err: any) => { if (err.path[0]) { errors[err.path[0] as string] = err.message; } }); setValidationErrors(errors); } else { console.error(e); toast.error("Failed to create trip"); } } finally { setIsCreatingTrip(false); } };

  const handleAssignToTrip = async (tripId: string) => { if (selectedOrderIds.size === 0) return; const trip = trips.find(t => t.id === tripId); if (!trip) return; const selectedOrdersList = orders.filter(o => selectedOrderIds.has(o.id)); try { await TripService.assignOrders(tripId, Array.from(selectedOrderIds), trip, selectedOrdersList); setSelectedOrderIds(new Set()); setRefreshKey(k => k + 1); } catch (e) { console.error(e); toast.error("Failed to assign orders"); } };

  const handleCreateVehicle = async () => {
    try {
      if (!newVehicle.name || !newVehicle.registrationNo) {
        toast.error("Vehicle name and registration are required");
        return;
      }
      const vehicleToSave: Vehicle = {
        id: `veh_${crypto.randomUUID().split('-')[0]}`,
        name: newVehicle.name || '',
        registrationNo: newVehicle.registrationNo,
        capacityCases: newVehicle.capacityCases,
        isActive: true,
        createdAt: new Date().toISOString(),
      };
      await VehicleService.add(vehicleToSave);
      setVehicles(prev => [...prev, vehicleToSave]);
      setVehicleModalOpen(false);
      setNewVehicle({ name: '', registrationNo: '', capacityCases: undefined });
    } catch (e) {
      console.error("Failed to save vehicle", e);
      toast.error("Could not save vehicle. Please try again.");
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex flex-col gap-4 shrink-0">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Dispatch Planner</h1>
            <p className="text-xs text-gray-500">Assign approved orders to delivery trips</p>
          </div>
          <div className="flex gap-3">
            <div className="bg-green-50 text-green-800 px-3 py-1 rounded-full text-sm font-medium border border-green-100">
              Available: {unassignedOrders.length} Orders
            </div>
            {assignedOrders.length > 0 && (
              <div className="bg-blue-50 text-blue-800 px-3 py-1 rounded-full text-sm font-medium border border-blue-100">
                Assigned: {assignedOrders.length} Orders
              </div>
            )}
            <div className="bg-indigo-50 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium border border-indigo-100">
              Value: ₹{filteredOrders.reduce((s, o) => s + o.totalAmount, 0).toLocaleString()}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Date</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  disabled={!filterByDate}
                  className="w-full pl-9 pr-3 py-2 rounded-md border border-gray-300 text-sm focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:text-gray-500"
                />
              </div>
              <button
                onClick={() => setFilterByDate(!filterByDate)}
                className={`px-3 py-2 rounded-md text-xs font-medium border transition-colors whitespace-nowrap ${filterByDate
                  ? 'bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
                  }`}
                title={filterByDate ? 'Date filter enabled - Click to show all dates' : 'Date filter disabled - Click to filter by date'}
              >
                {filterByDate ? '✓ Filter' : 'All Dates'}
              </button>
            </div>
          </div>

          <div className="flex-1 min-w-[250px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Salespersons</label>
            <div className="mt-2 flex flex-wrap gap-2 max-h-24 overflow-y-auto p-1 border border-gray-200 rounded-md bg-gray-50">
              <button
                onClick={() => setSelectedSalespersons(new Set())}
                className={`px-3 py-1 text-xs rounded-full border font-medium transition-colors whitespace-nowrap ${selectedSalespersons.size === 0
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
                  }`}
              >
                All Sales
              </button>
              {salesUsers.map(sp => (
                <button
                  key={sp.id}
                  onClick={() => {
                    const newSet = new Set(selectedSalespersons);
                    if (newSet.has(sp.id)) {
                      newSet.delete(sp.id);
                    } else {
                      newSet.add(sp.id);
                    }
                    setSelectedSalespersons(newSet);
                  }}
                  className={`px-3 py-1 text-xs rounded-full border font-medium transition-colors whitespace-nowrap ${selectedSalespersons.has(sp.id)
                    ? 'bg-indigo-100 text-indigo-800 border-indigo-200'
                    : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
                    }`}
                >
                  {sp.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Orders Panel */}
        <div className="w-full lg:w-7/12 flex flex-col border-r border-gray-200 bg-white h-1/2 lg:h-auto">
          <div className="p-4 border-b border-gray-100 bg-gray-50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search Customer or Order #"
                className="w-full pl-9 pr-3 py-2 rounded-md border border-gray-300 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {selectedOrderIds.size > 0 && (
            <div className="bg-indigo-600 text-white px-4 py-2 text-sm font-medium flex justify-between items-center shadow-sm shrink-0 z-10">
              <span>{selectedOrderIds.size} Orders Selected</span>
              <button
                onClick={() => setSelectedOrderIds(new Set())}
                className="text-indigo-100 hover:text-white underline text-xs"
              >
                Clear
              </button>
            </div>
          )}

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {loading ? (
              <div className="p-10 text-center text-gray-500">Loading...</div>
            ) : Object.keys(groupedOrders).length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-500 p-6">
                <Package className="h-16 w-16 mb-4 opacity-40" />
                <p className="font-bold text-lg mb-2">No orders match your filters</p>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4 max-w-md text-sm text-left">
                  <p className="font-semibold text-blue-900 mb-2">📊 Diagnostic Information:</p>
                  <ul className="space-y-1 text-blue-800">
                    <li>• <strong>Total pending orders:</strong> {orders.length}</li>
                    <li>• <strong>Date filter:</strong> {filterByDate ? `ON (${selectedDate})` : 'OFF (all dates)'}</li>
                    <li>• <strong>Salesperson filter:</strong> {selectedSalespersons.size === 0 ? 'All' : `${selectedSalespersons.size} selected`}</li>
                    <li>• <strong>Search query:</strong> {searchQuery || 'None'}</li>
                  </ul>

                  {orders.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-blue-200">
                      <p className="font-semibold text-blue-900 mb-1">Available order dates:</p>
                      <div className="text-xs text-blue-700">
                        {Array.from(new Set(orders.map(o => normalizeDateToYYYYMMDD(o.date))))
                          .filter(d => d) // Remove empty dates
                          .sort()
                          .slice(0, 5)
                          .map(date => (
                            <span key={date} className="inline-block bg-blue-100 px-2 py-0.5 rounded mr-1 mb-1">
                              {date}
                            </span>
                          ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-3 pt-3 border-t border-blue-200">
                    <p className="font-semibold text-blue-900 mb-1">💡 Suggestions:</p>
                    <ul className="text-xs text-blue-700 space-y-0.5">
                      {filterByDate && <li>• Try clicking "All Dates" button to see all orders</li>}
                      {selectedSalespersons.size > 0 && <li>• Clear salesperson filters</li>}
                      {searchQuery && <li>• Clear search query</li>}
                      {orders.length === 0 && <li>• No approved orders in system - check order statuses</li>}
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {Object.values(groupedOrders).map((group: any) => {
                  const isExpanded = expandedGroups.has(group.id);
                  const unassignedCount = group.orders.filter((o: Order) => !o.assignedTripId).length;
                  return (
                    <div key={group.id} className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
                      <div
                        className="flex items-center bg-gradient-to-r from-indigo-50 to-white px-4 py-3 hover:from-indigo-100 transition-colors cursor-pointer"
                        onClick={() => toggleGroup(group.id)}
                      >
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600"
                          onChange={() => toggleGroupSelection(group.orders)}
                          onClick={e => e.stopPropagation()}
                        />
                        <button className="mr-2 text-gray-400">
                          {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                        </button>
                        <div className="flex-1">
                          <h3 className="text-sm font-bold text-gray-900">{group.name}</h3>
                          <p className="text-xs text-gray-500">
                            {group.orders.length} total • {unassignedCount} available
                          </p>
                        </div>
                        <div className="text-lg font-bold text-indigo-600">₹{group.totalAmount.toLocaleString()}</div>
                      </div>

                      {isExpanded && (
                        <div className="divide-y divide-gray-100 border-t border-gray-100 bg-gray-50">
                          {group.orders.map((order: Order) => (
                            <div
                              key={order.id}
                              className={`px-4 py-2 flex items-start gap-3 cursor-pointer text-xs transition-colors ${order.assignedTripId
                                ? 'bg-blue-50 opacity-75'
                                : 'hover:bg-indigo-50'
                                }`}
                              onClick={() => {
                                if (!order.assignedTripId) {
                                  toggleOrderSelection(order.id);
                                }
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={selectedOrderIds.has(order.id)}
                                disabled={!!order.assignedTripId}
                                className="mt-0.5 h-3 w-3 rounded border-gray-300 text-indigo-600 disabled:opacity-50"
                                onChange={() => {
                                  if (!order.assignedTripId) toggleOrderSelection(order.id);
                                }}
                                onClick={e => e.stopPropagation()}
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex justify-between gap-2 mb-0.5">
                                  <span className="font-medium text-gray-900 truncate">{order.customerName}</span>
                                  <span className="font-semibold text-gray-900">₹{order.totalAmount.toLocaleString()}</span>
                                </div>
                                <div className="text-xs">
                                  <span className="bg-gray-200 px-1.5 py-0.5 rounded text-gray-600">{order.id}</span>
                                </div>
                                {order.assignedTripId && (() => {
                                  const a = getOrderAssignmentDetails(order.id);
                                  return a ? (
                                    <div className="text-xs text-blue-800 bg-blue-100 px-2 py-1 rounded border border-blue-200 mt-1 inline-flex gap-1">
                                      <strong>✓ Assigned:</strong> {a.deliveryPersonName}
                                      {a.vehicleName && ` • ${a.vehicleName}`} {a.deliveryDate}
                                    </div>
                                  ) : null;
                                })()}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </>
            )}
          </div>
        </div>

        {/* Trips Panel */}
        <div className="w-full lg:w-5/12 flex flex-col bg-gray-50 h-1/2 lg:h-auto border-t lg:border-t-0">
          <div className="p-4 flex justify-between items-center border-b border-gray-200 bg-white shrink-0">
            <h2 className="font-bold text-gray-800 flex items-center gap-2">
              <Truck size={20} className="text-indigo-600" /> Trips
            </h2>
            <Button onClick={() => setCreateTripModalOpen(true)} size="sm">
              <Plus size={16} className="mr-1" /> New Trip
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {trips.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400">
                <Truck size={48} className="mb-3 opacity-20" />
                <p className="text-sm font-medium">No trips</p>
              </div>
            ) : (
              trips.map(trip => (
                <Card key={trip.id} className="border-l-4 border-l-indigo-600 bg-white">
                  <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">{trip.deliveryPersonName}</h3>
                        <div className="flex items-center gap-2 text-xs text-gray-600 mt-1">
                          <span className="bg-gray-100 px-2 py-0.5 rounded">{trip.vehicleName || 'No Vehicle'}</span>
                          <span>{trip.deliveryDate}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-indigo-600">₹{trip.totalAmount.toLocaleString()}</div>
                        <div className="text-xs font-medium text-gray-600">{trip.totalOrders} Orders</div>
                      </div>
                    </div>

                    {selectedOrderIds.size > 0 && trip.status === 'draft' ? (
                      <Button
                        className="w-full animate-pulse bg-indigo-600 hover:bg-indigo-700 text-white"
                        onClick={() => handleAssignToTrip(trip.id)}
                      >
                        <ArrowRight size={16} className="mr-2" />
                        Assign {selectedOrderIds.size}
                      </Button>
                    ) : (
                      <div className="h-px bg-gray-200"></div>
                    )}

                    <div className="flex justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/admin/dispatch/trips/${trip.id}`)}
                      >
                        Manage
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Create Trip Modal */}
      <Modal isOpen={isCreateTripModalOpen} onClose={() => setCreateTripModalOpen(false)} title="Create New Dispatch Trip">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleCreateTrip();
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              <input
                type="date"
                value={newTripData.deliveryDate}
                onChange={(e) => setNewTripData({ ...newTripData, deliveryDate: e.target.value })}
                className="w-full pl-9 pr-3 py-2 rounded-md border border-gray-300 text-sm"
              />
            </div>
          </div>

          <div>
            <Select
              label="Delivery Person"
              options={[
                { label: 'Select...', value: '' },
                ...deliveryUsers.map(dp => ({ label: dp.name, value: dp.id }))
              ]}
              value={newTripData.deliveryPersonId}
              onChange={(value: string) =>
                setNewTripData({ ...newTripData, deliveryPersonId: value, vehicleId: '' })
              }
              error={validationErrors.deliveryPersonId}
            />
          </div>

          <div>
            <Select
              label="Vehicle"
              options={[
                { label: 'Select...', value: '' },
                ...vehicles.map(v => ({ label: v.name, value: v.id }))
              ]}
              value={newTripData.vehicleId}
              onChange={(value: string) => setNewTripData({ ...newTripData, vehicleId: value })}
              error={validationErrors.vehicleId}
            />
            <div className="mt-2">
              <Button size="sm" variant="outline" onClick={() => setVehicleModalOpen(true)}>
                Add Vehicle
              </Button>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setCreateTripModalOpen(false)}
              type="button"
              disabled={isCreatingTrip}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isCreatingTrip}>
              {isCreatingTrip ? 'Creating...' : 'Create Trip'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Add Vehicle Modal */}
      <Modal isOpen={isVehicleModalOpen} onClose={() => setVehicleModalOpen(false)} title="Add Vehicle">
        <div className="space-y-3">
          <Input
            label="Vehicle Name"
            value={newVehicle.name || ''}
            onChange={(e: any) => setNewVehicle(v => ({ ...v, name: e.target.value }))}
            required
          />
          <Input
            label="Registration"
            value={newVehicle.registrationNo || ''}
            onChange={(e: any) => setNewVehicle(v => ({ ...v, registrationNo: e.target.value }))}
            required
          />
          <Input
            label="Capacity (cases)"
            type="number"
            value={newVehicle.capacityCases?.toString() || ''}
            onChange={(e: any) => setNewVehicle(v => ({ ...v, capacityCases: Number(e.target.value) || undefined }))}
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setVehicleModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateVehicle}>Save</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DispatchPlanner;
