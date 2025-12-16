/**
 * Movements Tab
 * 
 * Displays detailed transaction history of all inventory movements
 * Color-coded by type (purchase/sale/return/damage/adjustment)
 */

import React, { useState, useEffect } from 'react';
import { Search, Calendar, AlertCircle, Loader, TrendingUp, TrendingDown, Package, RefreshCcw, AlertTriangle } from 'lucide-react';
import { getInventoryMovements, InventoryMovement } from '../../../services/inventory/inventoryService';
import { getTodayISO, normalizeDateToISO } from '../../../services/inventory/inventoryUtils';
import { format, subDays, parseISO } from 'date-fns';

export function MovementsTab({ isAdmin }: { isAdmin: boolean }) {
  const [data, setData] = useState<InventoryMovement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [startDate, setStartDate] = useState(normalizeDateToISO(subDays(new Date(), 7)));
  const [endDate, setEndDate] = useState(getTodayISO());
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadData();
  }, [startDate, endDate, search]);

  async function loadData() {
    try {
      setLoading(true);
      setError(null);
      const result = await getInventoryMovements(startDate, endDate, undefined, search || undefined);
      setData(result);
    } catch (err) {
      console.error('[MovementsTab] Error loading data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load inventory movements');
    } finally {
      setLoading(false);
    }
  }

  const getMovementIcon = (type: string) => {
    switch (type) {
      case 'purchase':
        return <TrendingUp size={16} />;
      case 'sale':
        return <TrendingDown size={16} />;
      case 'return':
        return <RefreshCcw size={16} />;
      case 'damage':
        return <AlertTriangle size={16} />;
      case 'adjustment':
        return <Package size={16} />;
      default:
        return <Package size={16} />;
    }
  };

  const getMovementBadgeColor = (type: string) => {
    switch (type) {
      case 'purchase':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'sale':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'return':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'damage':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'adjustment':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Date range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
            <div className="flex items-center space-x-2 bg-white border border-gray-300 rounded-lg px-3 py-2">
              <Calendar size={16} className="text-gray-400" />
              <input
                type="date"
                value={startDate}
                onChange={e => setStartDate(normalizeDateToISO(e.target.value))}
                className="flex-1 outline-none text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
            <div className="flex items-center space-x-2 bg-white border border-gray-300 rounded-lg px-3 py-2">
              <Calendar size={16} className="text-gray-400" />
              <input
                type="date"
                value={endDate}
                onChange={e => setEndDate(normalizeDateToISO(e.target.value))}
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
                placeholder="Product, company, reference..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="flex-1 outline-none text-sm"
              />
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-4 border-t border-gray-200">
          {['purchase', 'sale', 'return', 'damage', 'adjustment'].map(type => (
            <div key={type} className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${getMovementBadgeColor(type).split(' ')[0]}`} />
              <span className="text-xs font-medium text-gray-600 capitalize">{type}</span>
            </div>
          ))}
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

      {/* Timeline */}
      {!loading && !error && (
        <div className="space-y-2">
          {data.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No inventory movements found for the selected period.
            </div>
          ) : (
            <div className="space-y-2">
              {data.map((movement, idx) => (
                <div key={movement.id} className="border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="p-4 flex items-start space-x-4">
                    {/* Timeline line */}
                    <div className="flex flex-col items-center">
                      <div className={`p-2 rounded-full ${getMovementBadgeColor(movement.type).split(' ')[0]} text-white flex items-center justify-center`}>
                        {getMovementIcon(movement.type)}
                      </div>
                      {idx < data.length - 1 && (
                        <div className="w-0.5 h-12 bg-gray-200 mt-2" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold border ${getMovementBadgeColor(movement.type)}`}>
                          {movement.type.charAt(0).toUpperCase() + movement.type.slice(1)}
                        </span>
                        <span className="text-xs text-gray-500">
                          {format(parseISO(movement.date), 'MMM d, yyyy HH:mm')}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                        <div>
                          <p className="text-xs text-gray-500 uppercase">Product</p>
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {movement.product_name || movement.product_id}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase">Quantity</p>
                          <p className={`text-sm font-semibold font-mono ${movement.quantity >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {movement.quantity >= 0 ? '+' : ''}{movement.quantity.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase">Company</p>
                          <p className="text-sm text-gray-700 truncate">{movement.company || '-'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase">Reference</p>
                          <p className="text-sm font-mono text-gray-700 truncate">{movement.reference_id}</p>
                        </div>
                      </div>

                      {movement.note && (
                        <p className="text-xs text-gray-600 mt-2 italic">{movement.note}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
