import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Circle, Search, Printer, Package, ChevronDown, ChevronUp } from 'lucide-react';
import {
  getTripWithOrders,
  getPackingProgress,
  upsertPackingProgress,
  PackingItem,
  TripWithOrders,
} from '../../services/packing/packingService';
import { ProductService } from '../../services/db';
import { Product } from '../../types';
import { DispatchRow } from '../../types/reports';

export function PackingListPage() {
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();

  const [trip, setTrip] = useState<TripWithOrders | null>(null);
  const [allItems, setAllItems] = useState<PackingItem[]>([]);
  const [progressMap, setProgressMap] = useState<Map<string, boolean>>(new Map());
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

  // Expanded cards state for mobile
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (!tripId) throw new Error('No trip ID provided');

        const [tripData, allProducts, progress] = await Promise.all([
          getTripWithOrders(tripId),
          ProductService.getAll(),
          getPackingProgress(tripId)
        ]);

        if (!tripData) throw new Error('Trip not found');

        setTrip(tripData);
        setProducts(allProducts);

        // Flatten items
        const items: PackingItem[] = [];
        tripData.orders.forEach(order => items.push(...order.items));
        setAllItems(items);

        // Progress map
        const pMap = new Map(progress.map(p => [p.item_id, p.is_done]));
        setProgressMap(pMap);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [tripId]);

  // Aggregate Data (Dispatch Style)
  const aggregatedRows = useMemo(() => {
    const productLookup = new Map(products.map(p => [p.id, p]));
    const rowMap = new Map<string, DispatchRow & { itemIds: string[], isFullyLoaded: boolean }>();

    // Helper to check if item is done
    const isItemDone = (itemId: string) => progressMap.get(itemId) || false;

    // Group items by Product ID
    allItems.forEach(item => {
      const pId = item.product_id || '';
      if (!pId) return;

      const masterProduct = productLookup.get(pId);
      const name = masterProduct?.name || item.product_name || 'Unknown';
      const company = masterProduct?.companyName || item.company || 'Unknown';
      const qty = Number(item.quantity) || 0;
      const total = Number(item.total) || 0;

      if (!rowMap.has(pId)) {
        rowMap.set(pId, {
          productId: pId,
          productName: name,
          companyName: company,
          totalQty: 0,
          cartons: 0,
          packets: 0,
          pieces: 0,
          totalAmount: 0,
          itemIds: [],
          isFullyLoaded: true // starts true, becomes false if any item is not done
        });
      }

      const row = rowMap.get(pId)!;
      row.totalQty += qty;
      row.totalAmount += total;
      row.itemIds.push(item.id);
      if (!isItemDone(item.id)) {
        row.isFullyLoaded = false;
      }
    });

    // Calculate cartons/packets/pieces
    const rows = Array.from(rowMap.values()).map(row => {
      // Search filter
      if (search.trim()) {
        const s = search.toLowerCase();
        if (!row.productName.toLowerCase().includes(s) && !row.companyName.toLowerCase().includes(s)) {
          return null;
        }
      }

      const product = productLookup.get(row.productId);
      const packetsPerCarton = product?.packetsPerCarton || 0;
      const piecesPerPacket = product?.piecesPerPacket || 0;
      const totalPieces = row.totalQty;

      const piecesPerCartonTotal = packetsPerCarton * piecesPerPacket;
      let cartons = 0, packets = 0, pieces = 0;

      if (piecesPerCartonTotal > 0) {
        cartons = Math.floor(totalPieces / piecesPerCartonTotal);
        let rem = totalPieces % piecesPerCartonTotal;
        if (piecesPerPacket > 0) {
          packets = Math.floor(rem / piecesPerPacket);
          pieces = rem % piecesPerPacket;
        } else {
          pieces = rem;
        }
      } else {
        pieces = totalPieces;
      }

      return { ...row, cartons, packets, pieces };
    }).filter(Boolean) as (DispatchRow & { itemIds: string[], isFullyLoaded: boolean })[];

    // Sort by Company then Product
    return rows.sort((a, b) =>
      a.companyName.localeCompare(b.companyName) || a.productName.localeCompare(b.productName)
    );

  }, [allItems, products, progressMap, search]);

  const totalTripValue = aggregatedRows.reduce((sum, r) => sum + r.totalAmount, 0);

  // Mark all items for a specific product as Loaded/Unloaded
  const handleToggleProduct = async (row: typeof aggregatedRows[0]) => {
    if (!tripId) return;

    // Toggle Logic: If not fully loaded, mark ALL as true. If fully loaded, mark ALL as false.
    const targetState = !row.isFullyLoaded;

    // Optimistic Update
    const newMap = new Map(progressMap);
    row.itemIds.forEach(id => newMap.set(id, targetState));
    setProgressMap(newMap);

    try {
      setSaving(true);
      // Find items that actually need updating to save bandwidth? 
      // Or just update all to be safe. We'll update only changed ones for efficiency locally, but server needs specific calls.
      // Parallel requests might be heavy if chunks are large.

      const promises = row.itemIds.map(itemId => {
        // Only update if changed (optional optimization, but good for reducing calls)
        /* if (progressMap.get(itemId) === targetState) return Promise.resolve(); */
        return upsertPackingProgress(tripId, allItems.find(i => i.id === itemId)?.order_id!, itemId, targetState);
      });

      await Promise.all(promises);
    } catch (err) {
      console.error(err);
      // Revert on error could be complex, just refetch?
      alert("Failed to save progress. Resyncing...");
      window.location.reload();
    } finally {
      setSaving(false);
    }
  };

  const toggleExpand = (id: string) => {
    const newSet = new Set(expandedRows);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setExpandedRows(newSet);
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Sticky Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm print:hidden">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3 mb-3">
            <button onClick={() => navigate('/delivery')} className="p-1 rounded hover:bg-gray-100">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-gray-900 leading-tight">Packing List</h1>
              <p className="text-xs text-gray-500">{new Date().toDateString()}</p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <div className="text-right hidden sm:block">
                <p className="text-xs text-gray-500">Trip Value</p>
                <p className="font-bold text-green-700">₹{totalTripValue.toLocaleString()}</p>
              </div>
              <button onClick={() => window.print()} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
                <Printer className="w-5 h-5 text-gray-700" />
              </button>
            </div>
          </div>

          {/* Mobile Value Summary Line */}
          <div className="sm:hidden flex justify-between items-center bg-green-50 px-3 py-2 rounded-lg mb-3 border border-green-100">
            <span className="text-xs font-semibold text-green-800 uppercase">Total Value</span>
            <span className="font-bold text-green-700">₹{totalTripValue.toLocaleString()}</span>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search product or company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-4 space-y-3">
        {aggregatedRows.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            No items found.
          </div>
        ) : (
          aggregatedRows.map(row => (
            <div
              key={row.productId}
              className={`bg-white rounded-xl shadow-sm border transition-all duration-200 ${row.isFullyLoaded ? 'border-green-200 bg-green-50/30' : 'border-gray-200'
                }`}
            >
              {/* Card Header / Main Row */}
              <div className="p-4 flex items-start gap-4">
                <button
                  onClick={() => handleToggleProduct(row)}
                  disabled={saving}
                  className={`flex-shrink-0 w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all ${row.isFullyLoaded
                      ? 'bg-green-500 border-green-500 text-white shadow-md scale-105'
                      : 'border-gray-300 text-transparent hover:border-gray-400 bg-white'
                    }`}
                >
                  <CheckCircle2 className="w-8 h-8" fill="currentColor" />
                </button>

                <div className="flex-1 min-w-0" onClick={() => toggleExpand(row.productId)}>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className={`text-base font-bold text-gray-900 leading-tight ${row.isFullyLoaded ? 'line-through text-gray-500' : ''}`}>
                        {row.productName}
                      </h3>
                      <p className="text-sm text-gray-500 font-medium">{row.companyName}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Total</div>
                      <div className="text-lg font-black text-gray-800 leading-none">
                        {row.totalQty}
                      </div>
                      <div className="text-xs text-green-600 font-medium mt-1">
                        ₹{row.totalAmount.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Prominent Packaging Breakdown */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {row.cartons > 0 && (
                      <div className="flex flex-col items-center justify-center bg-amber-100 border-l-4 border-amber-500 px-3 py-1.5 rounded pr-4 min-w-[3.5rem]">
                        <span className="text-xl font-bold text-amber-900 leading-none">{row.cartons}</span>
                        <span className="text-[10px] uppercase font-bold text-amber-700 tracking-wide">Cartons</span>
                      </div>
                    )}
                    {row.packets > 0 && (
                      <div className="flex flex-col items-center justify-center bg-blue-100 border-l-4 border-blue-500 px-3 py-1.5 rounded pr-4 min-w-[3.5rem]">
                        <span className="text-xl font-bold text-blue-900 leading-none">{row.packets}</span>
                        <span className="text-[10px] uppercase font-bold text-blue-700 tracking-wide">Packets</span>
                      </div>
                    )}
                    {row.pieces > 0 && (
                      <div className="flex flex-col items-center justify-center bg-gray-100 border-l-4 border-gray-500 px-3 py-1.5 rounded pr-4 min-w-[3.5rem]">
                        <span className="text-xl font-bold text-gray-900 leading-none">{row.pieces}</span>
                        <span className="text-[10px] uppercase font-bold text-gray-600 tracking-wide">Pieces</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Print View (Only visible when printing) */}
      <div className="hidden print:block absolute top-0 left-0 w-full bg-white p-8">
        <h1 className="text-2xl font-bold mb-4">Packing List</h1>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-sm text-gray-600">Trip ID: {tripId?.slice(0, 8)}</p>
            <p className="text-sm text-gray-600">Delivery: {trip?.deliveryPersonName}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Date: {new Date().toLocaleDateString()}</p>
            <p className="font-bold">Total Value: ₹{totalTripValue.toLocaleString()}</p>
          </div>
        </div>

        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b-2 border-black">
              <th className="text-left py-2">Company</th>
              <th className="text-left py-2">Product</th>
              <th className="text-center py-2">Ctn</th>
              <th className="text-center py-2">Pkt</th>
              <th className="text-center py-2">Pcs</th>
              <th className="text-center py-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {aggregatedRows.map(row => (
              <tr key={row.productId} className="border-b border-gray-200">
                <td className="py-2">{row.companyName}</td>
                <td className="py-2">{row.productName}</td>
                <td className="py-2 text-center">{row.cartons || '-'}</td>
                <td className="py-2 text-center">{row.packets || '-'}</td>
                <td className="py-2 text-center">{row.pieces || '-'}</td>
                <td className="py-2 text-center font-bold">{row.totalQty}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
