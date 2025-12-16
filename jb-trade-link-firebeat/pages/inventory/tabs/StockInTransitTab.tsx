/**
 * Stock in Transit Tab
 * 
 * Displays items that are dispatched but not yet delivered/returned
 * Shows by product and by trip/order with filters
 */

import React, { useState, useEffect } from 'react';
import { Search, Calendar, AlertCircle, Loader, Package, Truck, ChevronDown } from 'lucide-react';
import {
  getStockInTransitByProduct,
  getStockInTransitByTrip,
  StockInTransitByProduct,
  StockInTransitByTrip,
} from '../../../services/inventory/inventoryService';
import { format, subDays } from 'date-fns';

type ViewType = 'byProduct' | 'byTrip';

export function StockInTransitTab({ isAdmin }: { isAdmin: boolean }) {
  const [view, setView] = useState<ViewType>('byProduct');
  const [dataByProduct, setDataByProduct] = useState<StockInTransitByProduct[]>([]);
  const [dataByTrip, setDataByTrip] = useState<StockInTransitByTrip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [startDate, setStartDate] = useState(format(subDays(new Date(), 30), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadData();
  }, [view, startDate, endDate, search]);

  async function loadData() {
    try {
      setLoading(true);
      setError(null);

      if (view === 'byProduct') {
        const result = await getStockInTransitByProduct(startDate, endDate, search || undefined);
        setDataByProduct(result);
      } else {
        const result = await getStockInTransitByTrip(startDate, endDate, search || undefined);
        setDataByTrip(result);
      }
    } catch (err) {
      console.error('[StockInTransitTab] Error loading data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load stock in transit data');
    } finally {
      setLoading(false);
    }
  }

  const totalQtyInTransit = view === 'byProduct'
    ? dataByProduct.reduce((sum, item) => sum + item.total_qty_in_transit, 0)
    : dataByTrip.reduce((sum, trip) => sum + trip.items.reduce((s, i) => s + i.qty_in_transit, 0), 0);

  return (
    <div className="space-y-6">
      {/* View Tabs */}
      <div className="flex space-x-4 border-b border-gray-200">
        <button
          onClick={() => setView('byProduct')}
          className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
            view === 'byProduct'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          <Package size={16} className="inline mr-2" />
          By Product
        </button>
        <button
          onClick={() => setView('byTrip')}
          className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
            view === 'byTrip'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          <Truck size={16} className="inline mr-2" />
          By Trip/Order
        </button>
      </div>

      {/* Filters */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Date range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Dispatch Start Date</label>
            <div className="flex items-center space-x-2 bg-white border border-gray-300 rounded-lg px-3 py-2">
              <Calendar size={16} className="text-gray-400" />
              <input
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="flex-1 outline-none text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Dispatch End Date</label>
            <div className="flex items-center space-x-2 bg-white border border-gray-300 rounded-lg px-3 py-2">
              <Calendar size={16} className="text-gray-400" />
              <input
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                className="flex-1 outline-none text-sm"
              />
            </div>
          </div>

          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="flex items-center space-x-2 bg-white border border-gray-300 rounded-lg px-3 py-2">
              <Search size={16} className="text-gray-400" />
              <input
                type="text"
                placeholder={view === 'byProduct' ? 'Product, company...' : 'Destination, customer...'}
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="flex-1 outline-none text-sm"
              />
            </div>
          </div>
        </div>

        <div className="text-sm text-gray-600">
          <strong>Total In Transit:</strong> {totalQtyInTransit.toLocaleString()} units
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="flex items-center space-x-3 bg-red-50 border border-red-200 rounded-lg p-4">
          <AlertCircle size={20} className="text-red-600" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-800">{error}</p>
          </div>
          <button
            onClick={loadData}
            className="text-sm text-red-600 hover:text-red-700 font-medium"
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader size={24} className="text-gray-400 animate-spin" />
        </div>
      )}

      {/* By Product View */}
      {!loading && !error && view === 'byProduct' && (
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Product</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Company</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">SKU</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Qty in Transit</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Trips</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Orders</th>
              </tr>
            </thead>
            <tbody>
              {dataByProduct.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    No items in transit for the selected period.
                  </td>
                </tr>
              ) : (
                dataByProduct.map(item => (
                  <tr key={item.product_id} className="border-t border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.product_name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{item.company}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 font-mono">{item.sku}</td>
                    <td className="px-4 py-3 text-sm text-right font-semibold text-orange-600 font-mono">
                      {item.total_qty_in_transit.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-gray-600 font-mono">{item.trip_count}</td>
                    <td className="px-4 py-3 text-sm text-right text-gray-600 font-mono">{item.order_count}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* By Trip/Order View */}
      {!loading && !error && view === 'byTrip' && (
        <div className="space-y-4">
          {dataByTrip.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No items in transit for the selected period.
            </div>
          ) : (
            dataByTrip.map(trip => (
              <TripCard key={trip.trip_id} trip={trip} />
            ))
          )}
        </div>
      )}
    </div>
  );
}

function TripCard({ trip }: { trip: StockInTransitByTrip }) {
  const [expanded, setExpanded] = useState(false);
  const totalQty = trip.items.reduce((sum, item) => sum + item.qty_in_transit, 0);

  const statusColors: Record<string, string> = {
    dispatched: 'bg-blue-100 text-blue-800 border-blue-300',
    shipped: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    out_for_delivery: 'bg-amber-100 text-amber-800 border-amber-300',
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-4 hover:bg-gray-50 transition-colors flex items-center justify-between"
      >
        <div className="flex items-center space-x-4 flex-1 min-w-0">
          <Truck size={20} className="text-gray-600 flex-shrink-0" />
          <div className="text-left min-w-0 flex-1">
            <div className="flex items-center space-x-2">
              <p className="font-mono text-sm font-semibold text-gray-900 truncate">{trip.trip_id}</p>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold border ${statusColors[trip.status] || 'bg-gray-100 text-gray-800'}`}>
                {trip.status}
              </span>
            </div>
            <p className="text-sm text-gray-600 truncate">{trip.destination || 'N/A'}</p>
            {trip.customer_name && (
              <p className="text-xs text-gray-500">{trip.customer_name}</p>
            )}
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-lg font-semibold text-orange-600">{totalQty.toLocaleString()}</p>
            <p className="text-xs text-gray-500">units</p>
          </div>
        </div>
        <ChevronDown
          size={20}
          className={`text-gray-400 flex-shrink-0 ml-2 transition-transform ${expanded ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Expanded Content */}
      {expanded && (
        <div className="border-t border-gray-200 bg-gray-50 p-4 space-y-3">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-4 border-b border-gray-200">
            {trip.dispatch_date && (
              <div>
                <p className="text-xs text-gray-500 uppercase">Dispatch Date</p>
                <p className="text-sm font-medium text-gray-900">{format(new Date(trip.dispatch_date), 'MMM d, yyyy')}</p>
              </div>
            )}
            {trip.dispatcher_name && (
              <div>
                <p className="text-xs text-gray-500 uppercase">Dispatcher</p>
                <p className="text-sm font-medium text-gray-900">{trip.dispatcher_name}</p>
              </div>
            )}
            {trip.delivery_user_name && (
              <div>
                <p className="text-xs text-gray-500 uppercase">Delivery User</p>
                <p className="text-sm font-medium text-gray-900">{trip.delivery_user_name}</p>
              </div>
            )}
            <div>
              <p className="text-xs text-gray-500 uppercase">Items</p>
              <p className="text-sm font-medium text-gray-900">{trip.items.length}</p>
            </div>
          </div>

          {/* Items */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">Items in Transit:</p>
            <div className="space-y-2">
              {trip.items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between bg-white border border-gray-200 rounded px-3 py-2">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.product_name}</p>
                    <p className="text-xs text-gray-500 font-mono">{item.product_id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-orange-600 font-mono">{item.qty_in_transit.toLocaleString()} units</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function format(date: Date, pattern: string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: '2-digit',
    month: 'short',
    day: '2-digit',
  }).format(date).replace(/(\w+)\s(\d+),\s(\d+)/, '$1 $2');
}
