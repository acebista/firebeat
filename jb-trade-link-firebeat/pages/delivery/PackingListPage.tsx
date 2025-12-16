import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Circle, Search, Check, AlertCircle, FileText, ListChecks, Printer } from 'lucide-react';
import {
  getTripWithOrders,
  getPackingProgress,
  upsertPackingProgress,
  markAllDone,
  PackingItem,
  TripWithOrders,
} from '../../services/packing/packingService';
import { ProductService } from '../../services/db';
import { Product } from '../../types';
import { DispatchRow } from '../../types/reports';

type FilterType = 'all' | 'done' | 'pending';
type TabType = 'checklist' | 'summary';

export function PackingListPage() {
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();

  const [trip, setTrip] = useState<TripWithOrders | null>(null);
  const [allItems, setAllItems] = useState<PackingItem[]>([]);
  const [progressMap, setProgressMap] = useState<Map<string, boolean>>(new Map());
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [activeTab, setActiveTab] = useState<TabType>('summary'); // Default to summary as per request
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Data for summary view
  const [products, setProducts] = useState<Product[]>([]);
  const [dispatchRows, setDispatchRows] = useState<DispatchRow[]>([]);

  // Fetch trip and progress data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!tripId) {
          throw new Error('No trip ID provided');
        }

        // Fetch parallel: Trip data and All Products (for packaging metadata)
        const [tripData, allProducts] = await Promise.all([
          getTripWithOrders(tripId),
          ProductService.getAll() // Ensure this returns Product[]
        ]);

        if (!tripData) {
          throw new Error('Trip not found');
        }

        setTrip(tripData);
        setProducts(allProducts);

        // Flatten items from all orders (for checklist)
        const items: PackingItem[] = [];
        tripData.orders.forEach(order => {
          items.push(...order.items);
        });
        setAllItems(items);

        // Fetch packing progress
        const progress = await getPackingProgress(tripId);
        const progressMap = new Map(progress.map(p => [p.item_id, p.is_done]));
        setProgressMap(progressMap);

        // --- Calculate Dispatch Rows (Summary View) ---
        calculateDispatchRows(tripData.orders, allProducts);

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

  // Copy of logic from Reports.tsx -> calculateMetrics
  const calculateDispatchRows = (orders: any[], products: Product[]) => {
    const productLookup = new Map<string, Product>();
    products.forEach(p => productLookup.set(p.id, p));

    const productMap = new Map<string, DispatchRow>();

    orders.forEach((order: any) => {
      // Items are already parsed in tripData.orders
      const items = order.items || [];

      items.forEach((item: any) => {
        // Handle both PackingItem (snake_case) and OrderItem (camelCase) keys
        const pId = item.product_id || item.productId;
        const masterProduct = productLookup.get(pId);

        const resolvedProductName = masterProduct?.name || item.product_name || item.productName || 'Unknown Product';
        const resolvedCompanyName = masterProduct?.companyName || item.company || item.companyName || 'Unknown';
        const resolvedQty = Number(item.quantity) || Number(item.qty) || 0;
        // PackingItem doesn't have amount, so we might miss value here unless we fetch orders fully
        const resolvedTotal = Number(item.total) || Number(item.amount) || 0;

        if (!pId) return; // Skip if no product ID

        if (!productMap.has(pId)) {
          productMap.set(pId, {
            productId: pId,
            productName: resolvedProductName,
            companyName: resolvedCompanyName,
            totalQty: 0,
            cartons: 0,
            packets: 0,
            pieces: 0,
            totalAmount: 0
          });
        }
        const entry = productMap.get(pId)!;
        entry.totalQty += resolvedQty;
        entry.totalAmount += resolvedTotal;
      });
    });

    // Breakdown Logic
    const rows = Array.from(productMap.values()).map(row => {
      const product = productLookup.get(row.productId);
      const packetsPerCarton = product?.packetsPerCarton || 0;
      const piecesPerPacket = product?.piecesPerPacket || 0;
      const totalPieces = row.totalQty;

      const piecesPerCartonTotal = packetsPerCarton * piecesPerPacket;

      let cartons = 0;
      let packets = 0;
      let pieces = 0;

      if (piecesPerCartonTotal > 0) {
        cartons = Math.floor(totalPieces / piecesPerCartonTotal);
        const remainingAfterCartons = totalPieces - (cartons * piecesPerCartonTotal);

        if (piecesPerPacket > 0) {
          packets = Math.floor(remainingAfterCartons / piecesPerPacket);
          pieces = remainingAfterCartons % piecesPerPacket;
        } else {
          pieces = remainingAfterCartons;
        }
      } else {
        pieces = totalPieces;
      }

      return {
        ...row,
        cartons,
        packets,
        pieces
      };
    });

    // Sort by Company then Product Name
    rows.sort((a, b) => {
      // Handle missing company names
      const companyA = a.companyName || '';
      const companyB = b.companyName || '';
      if (companyA !== companyB) return companyA.localeCompare(companyB);
      return a.productName.localeCompare(b.productName);
    });

    setDispatchRows(rows);
  };

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

  const handlePrint = () => {
    // Simple print implementation
    window.print();
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
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 print:static">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/delivery')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors print:hidden"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Packing List</h1>
                <p className="text-sm text-gray-600">Trip {trip?.id?.slice(0, 8)}</p>
              </div>
            </div>
            <button
              onClick={handlePrint}
              className="p-2 border border-gray-300 rounded hover:bg-gray-50 print:hidden"
              title="Print Packing List"
            >
              <Printer className="w-5 h-5 text-gray-700" />
            </button>
          </div>

          {/* Trip Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
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
              <p className="text-xs text-gray-600 uppercase tracking-wider">Total Orders</p>
              <p className="font-medium text-gray-900">{trip?.orders.length}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-6xl mx-auto px-4 print:hidden">
          <div className="flex space-x-4 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('summary')}
              className={`pb-3 px-1 flex items-center gap-2 font-medium text-sm transition-colors border-b-2 ${activeTab === 'summary'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
            >
              <FileText className="w-4 h-4" /> Summary (Packing List)
            </button>
            <button
              onClick={() => setActiveTab('checklist')}
              className={`pb-3 px-1 flex items-center gap-2 font-medium text-sm transition-colors border-b-2 ${activeTab === 'checklist'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
            >
              <ListChecks className="w-4 h-4" /> Item Checklist
            </button>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-4 right-4 px-4 py-3 rounded-lg shadow-lg text-white transition-all z-50 print:hidden ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
            }`}
        >
          {toast.message}
        </div>
      )}

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-6">

        {/* SUMMARY TAB (Dispatch style) */}
        {(activeTab === 'summary' || typeof window !== 'undefined' && window.matchMedia('print').matches) && (
          <div className="bg-white rounded-lg shadow overflow-hidden print:shadow-none">
            <div className="p-4 bg-gray-50 border-b border-gray-200 print:hidden">
              <h2 className="font-bold text-gray-800">Consolidated Packing List</h2>
              <p className="text-xs text-gray-500">Aggregate items across all orders for this trip.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-100 print:bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">Company</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">Product</th>
                    <th className="px-4 py-3 text-center font-medium text-gray-600">Cartons</th>
                    <th className="px-4 py-3 text-center font-medium text-gray-600">Packets</th>
                    <th className="px-4 py-3 text-center font-medium text-gray-600">Pieces</th>
                    <th className="px-4 py-3 text-center font-bold text-indigo-700 bg-indigo-50 print:bg-gray-100 print:text-black">Total Qty</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {dispatchRows.map((row, idx) => (
                    <tr key={row.productId} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-4 py-2 text-gray-900 font-medium">{row.companyName}</td>
                      <td className="px-4 py-2 text-gray-600">{row.productName}</td>
                      <td className="px-4 py-2 text-center text-gray-900">{row.cartons > 0 ? row.cartons : '-'}</td>
                      <td className="px-4 py-2 text-center text-gray-900">{row.packets > 0 ? row.packets : '-'}</td>
                      <td className="px-4 py-2 text-center text-gray-900">{row.pieces > 0 ? row.pieces : '-'}</td>
                      <td className="px-4 py-2 text-center font-bold bg-indigo-50 text-indigo-700 print:bg-gray-50 print:text-black">{row.totalQty}</td>
                    </tr>
                  ))}
                  {dispatchRows.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center p-8 text-gray-500">
                        No items found in this trip.
                      </td>
                    </tr>
                  )}
                </tbody>
                {dispatchRows.length > 0 && (
                  <tfoot className="bg-gray-100 font-bold text-gray-900 border-t-2 border-gray-300">
                    <tr>
                      <td colSpan={2} className="px-4 py-3 text-right text-gray-700 uppercase">Grand Total</td>
                      <td className="px-4 py-3 text-center">{dispatchRows.reduce((sum, row) => sum + row.cartons, 0)}</td>
                      <td className="px-4 py-3 text-center">{dispatchRows.reduce((sum, row) => sum + row.packets, 0)}</td>
                      <td className="px-4 py-3 text-center">{dispatchRows.reduce((sum, row) => sum + row.pieces, 0)}</td>
                      <td className="px-4 py-3 text-center bg-indigo-100 text-indigo-900 text-lg print:bg-gray-200 print:text-black">
                        {dispatchRows.reduce((sum, row) => sum + row.totalQty, 0)}
                      </td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          </div>
        )}

        {/* CHECKLIST TAB (Original Logic) */}
        {activeTab === 'checklist' && (
          <div className="space-y-4 print:hidden">
            {/* Progress Bar */}
            <div className="bg-white p-4 rounded-lg shadow">
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

            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search terms..."
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
                    className={`px-3 py-2 rounded-lg font-medium text-xs md:text-sm transition-colors ${filter === f
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                  >
                    {f === 'all' && `All`}
                    {f === 'pending' && `Pending`}
                    {f === 'done' && `Done`}
                  </button>
                ))}
              </div>

              {/* Mark All Done */}
              {allItems.length > 0 && pendingCount > 0 && (
                <button
                  onClick={handleMarkAllDone}
                  disabled={saving}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors whitespace-nowrap"
                >
                  Mark All Done
                </button>
              )}
            </div>

            {/* Items List */}
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
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="px-4 py-3 text-left font-medium text-gray-600 w-12">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left font-medium text-gray-600">
                          Product
                        </th>
                        <th className="px-4 py-3 text-left font-medium text-gray-600">
                          Company
                        </th>
                        <th className="px-4 py-3 text-left font-medium text-gray-600">
                          Customer
                        </th>
                        <th className="px-4 py-3 text-right font-medium text-gray-600">
                          Qty
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredItems.map(item => {
                        const isDone = progressMap.get(item.id) || false;
                        return (
                          <tr
                            key={item.id}
                            className={`transition-colors hover:bg-gray-50 ${isDone ? 'bg-gray-50 opacity-75' : 'bg-white'
                              }`}
                          >
                            <td className="px-4 py-3 text-left">
                              <button
                                onClick={() => handleToggleDone(item)}
                                disabled={saving}
                                className="p-1 hover:bg-gray-200 rounded transition-colors disabled:opacity-50"
                              >
                                {isDone ? (
                                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                                ) : (
                                  <Circle className="w-5 h-5 text-gray-400" />
                                )}
                              </button>
                            </td>
                            <td className={`px-4 py-3 font-medium ${isDone ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                              {item.product_name}
                            </td>
                            <td className={`px-4 py-3 ${isDone ? 'line-through text-gray-500' : 'text-gray-600'}`}>
                              {item.company}
                            </td>
                            <td className={`px-4 py-3 ${isDone ? 'line-through text-gray-500' : 'text-gray-600'}`}>
                              {item.customer_name}
                            </td>
                            <td className={`px-4 py-3 text-right font-medium ${isDone ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                              {item.quantity}
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
        )}
      </div>
    </div>
  );
}
