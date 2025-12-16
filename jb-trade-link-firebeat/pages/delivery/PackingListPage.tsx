import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Circle, Search, Check, AlertCircle } from 'lucide-react';
import {
  getTripWithOrders,
  getPackingProgress,
  upsertPackingProgress,
  markAllDone,
  PackingItem,
  TripWithOrders,
} from '../../services/packing/packingService';

type FilterType = 'all' | 'done' | 'pending';

export function PackingListPage() {
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();

  const [trip, setTrip] = useState<TripWithOrders | null>(null);
  const [allItems, setAllItems] = useState<PackingItem[]>([]);
  const [progressMap, setProgressMap] = useState<Map<string, boolean>>(new Map());
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Fetch trip and progress data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!tripId) {
          throw new Error('No trip ID provided');
        }

        // Fetch trip with orders
        const tripData = await getTripWithOrders(tripId);
        if (!tripData) {
          throw new Error('Trip not found');
        }

        setTrip(tripData);

        // Flatten items from all orders
        const items: PackingItem[] = [];
        tripData.orders.forEach(order => {
          items.push(...order.items);
        });
        setAllItems(items);

        // Fetch packing progress
        const progress = await getPackingProgress(tripId);
        const progressMap = new Map(progress.map(p => [p.item_id, p.is_done]));
        setProgressMap(progressMap);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load packing list';
        setError(message);
        console.error('[PackingList] Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tripId]);

  // Show toast and auto-hide
  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  };

  // Toggle item done state
  const handleToggleDone = async (item: PackingItem) => {
    if (!tripId) return;

    try {
      setSaving(true);
      const currentState = progressMap.get(item.id) || false;
      const newState = !currentState;

      // Optimistic update
      const newProgressMap = new Map(progressMap);
      newProgressMap.set(item.id, newState);
      setProgressMap(newProgressMap);

      // Persist to server
      await upsertPackingProgress(tripId, item.order_id, item.id, newState);
      showToast('success', newState ? 'Item marked as done' : 'Item marked as pending');
    } catch (err) {
      // Rollback
      const progressMap_copy = new Map(progressMap);
      const oldState = progressMap.get(item.id) || false;
      progressMap_copy.set(item.id, !oldState);
      setProgressMap(progressMap_copy);

      const message = err instanceof Error ? err.message : 'Failed to update item';
      setError(message);
      showToast('error', message);
    } finally {
      setSaving(false);
    }
  };

  // Mark all items as done
  const handleMarkAllDone = async () => {
    if (!tripId || allItems.length === 0) return;

    try {
      setSaving(true);
      await markAllDone(tripId, allItems);

      // Update progress map
      const newProgressMap = new Map<string, boolean>();
      allItems.forEach(item => {
        newProgressMap.set(item.id, true);
      });
      setProgressMap(newProgressMap);

      showToast('success', `All ${allItems.length} items marked as done`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to mark all items';
      setError(message);
      showToast('error', message);
    } finally {
      setSaving(false);
    }
  };

  // Filter and search items
  const filteredItems = allItems.filter(item => {
    // Apply search filter
    if (search.trim()) {
      const searchLower = search.toLowerCase();
      const matchesSearch =
        item.product_name.toLowerCase().includes(searchLower) ||
        item.company.toLowerCase().includes(searchLower) ||
        item.customer_name.toLowerCase().includes(searchLower);

      if (!matchesSearch) return false;
    }

    // Apply done/pending filter
    const isDone = progressMap.get(item.id) || false;
    if (filter === 'done') return isDone;
    if (filter === 'pending') return !isDone;

    return true;
  });

  const doneCount = allItems.filter(item => progressMap.get(item.id)).length;
  const pendingCount = allItems.length - doneCount;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin mb-4">
            <Circle className="w-12 h-12 text-blue-500" />
          </div>
          <p className="text-gray-600">Loading packing list...</p>
        </div>
      </div>
    );
  }

  if (error && !trip) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 p-4">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <p className="text-red-700 text-center mb-4">{error}</p>
        <button
          onClick={() => navigate('/delivery')}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Back to Delivery
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => navigate('/delivery')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Packing List</h1>
              <p className="text-sm text-gray-600">Trip {trip?.id}</p>
            </div>
          </div>

          {/* Trip Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <p className="text-xs text-gray-600 uppercase tracking-wider">Delivery Person</p>
              <p className="font-medium text-gray-900">{trip?.deliveryPersonName}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 uppercase tracking-wider">Route</p>
              <p className="font-medium text-gray-900">{trip?.routeNames?.join(', ') || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 uppercase tracking-wider">Delivery Date</p>
              <p className="font-medium text-gray-900">
                {trip?.deliveryDate ? new Date(trip.deliveryDate).toLocaleDateString() : 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600 uppercase tracking-wider">Status</p>
              <p className="font-medium text-gray-900 capitalize">{trip?.status}</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: allItems.length > 0 ? `${(doneCount / allItems.length) * 100}%` : '0%',
                  }}
                />
              </div>
            </div>
            <p className="text-sm text-gray-600 whitespace-nowrap">
              {doneCount}/{allItems.length} done
            </p>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-4 right-4 px-4 py-3 rounded-lg shadow-lg text-white transition-all ${
            toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-yellow-800">{error}</p>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by product, company, or customer..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2">
            {(['all', 'pending', 'done'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === f
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {f === 'all' && `All (${allItems.length})`}
                {f === 'pending' && `Pending (${pendingCount})`}
                {f === 'done' && `Done (${doneCount})`}
              </button>
            ))}
          </div>

          {/* Mark All Done */}
          {allItems.length > 0 && pendingCount > 0 && (
            <button
              onClick={handleMarkAllDone}
              disabled={saving}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
            >
              Mark All Done
            </button>
          )}
        </div>

        {/* Items Table */}
        {filteredItems.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center">
            <Circle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 font-medium">
              {allItems.length === 0
                ? 'No items in this trip'
                : 'No items match your search or filter'}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Company
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Qty
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Order ID
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredItems.map(item => {
                    const isDone = progressMap.get(item.id) || false;
                    return (
                      <tr
                        key={item.id}
                        className={`transition-colors hover:bg-gray-50 ${
                          isDone ? 'bg-gray-50 opacity-75' : 'bg-white'
                        }`}
                      >
                        <td className="px-6 py-4 text-left">
                          <button
                            onClick={() => handleToggleDone(item)}
                            disabled={saving}
                            className="p-1.5 hover:bg-gray-200 rounded transition-colors disabled:opacity-50"
                            title={isDone ? 'Mark as pending' : 'Mark as done'}
                          >
                            {isDone ? (
                              <CheckCircle2 className="w-5 h-5 text-green-500" />
                            ) : (
                              <Circle className="w-5 h-5 text-gray-400" />
                            )}
                          </button>
                        </td>
                        <td className={`px-6 py-4 font-medium ${isDone ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                          {item.product_name}
                        </td>
                        <td className={`px-6 py-4 ${isDone ? 'line-through text-gray-500' : 'text-gray-600'}`}>
                          {item.company}
                        </td>
                        <td className={`px-6 py-4 ${isDone ? 'line-through text-gray-500' : 'text-gray-600'}`}>
                          {item.customer_name}
                        </td>
                        <td className={`px-6 py-4 text-right font-medium ${isDone ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                          {item.quantity}
                        </td>
                        <td className="px-6 py-4 text-gray-600 text-sm font-mono">
                          {item.order_id.substring(0, 8)}...
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
