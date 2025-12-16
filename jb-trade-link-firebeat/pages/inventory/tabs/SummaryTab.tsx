/**
 * Summary Tab
 * 
 * Displays inventory report with opening stock, movements (in/out), and current stock
 * Supports date range and search filters
 */

import React, { useState, useEffect } from 'react';
import { Search, Calendar, AlertCircle, Loader } from 'lucide-react';
import { getInventorySummary, InventorySummaryItem } from '../../../services/inventory/inventoryService';
import { format, subDays } from 'date-fns';

export function SummaryTab({ isAdmin }: { isAdmin: boolean }) {
  const [data, setData] = useState<InventorySummaryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [startDate, setStartDate] = useState(format(subDays(new Date(), 30), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadData();
  }, [startDate, endDate, search]);

  async function loadData() {
    try {
      setLoading(true);
      setError(null);
      const result = await getInventorySummary(startDate, endDate, search || undefined);
      setData(result);
    } catch (err) {
      console.error('[SummaryTab] Error loading data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load inventory summary');
    } finally {
      setLoading(false);
    }
  }

  const totals = {
    openingQty: data.reduce((sum, item) => sum + item.opening_qty, 0),
    totalIn: data.reduce((sum, item) => sum + item.total_in, 0),
    totalOut: data.reduce((sum, item) => sum + item.total_out, 0),
    netChange: data.reduce((sum, item) => sum + item.net_change, 0),
    currentStock: data.reduce((sum, item) => sum + item.current_stock, 0),
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
                onChange={e => setStartDate(e.target.value)}
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
                placeholder="Product, company, SKU..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="flex-1 outline-none text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <SummaryCard label="Opening Stock" value={totals.openingQty.toLocaleString()} color="blue" />
        <SummaryCard label="Total In" value={totals.totalIn.toLocaleString()} color="green" />
        <SummaryCard label="Total Out" value={totals.totalOut.toLocaleString()} color="red" />
        <SummaryCard label="Net Change" value={`${totals.netChange > 0 ? '+' : ''}${totals.netChange.toLocaleString()}`} color={totals.netChange > 0 ? 'green' : 'red'} />
        <SummaryCard label="Current Stock" value={totals.currentStock.toLocaleString()} color="purple" highlight />
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

      {/* Table */}
      {!loading && !error && (
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Product</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Company</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">SKU</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Opening</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">In</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Out</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Net</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Current</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                    No inventory data found for the selected period.
                  </td>
                </tr>
              ) : (
                data.map(item => (
                  <tr key={item.product_id} className="border-t border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.product_name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{item.company}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 font-mono">{item.sku}</td>
                    <td className="px-4 py-3 text-sm text-right text-gray-900 font-mono">{item.opening_qty.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-right text-green-600 font-mono">{item.total_in.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-right text-red-600 font-mono">{item.total_out.toLocaleString()}</td>
                    <td className={`px-4 py-3 text-sm text-right font-mono ${item.net_change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {item.net_change >= 0 ? '+' : ''}{item.net_change.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-right font-semibold text-gray-900 font-mono">{item.current_stock.toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function SummaryCard({ label, value, color, highlight = false }: any) {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    green: 'bg-green-50 border-green-200 text-green-700',
    red: 'bg-red-50 border-red-200 text-red-700',
    purple: 'bg-purple-50 border-purple-200 text-purple-700',
  };

  return (
    <div className={`border rounded-lg p-4 ${colorClasses[color] || colorClasses.blue} ${highlight ? 'ring-2 ring-offset-2 ring-purple-500' : ''}`}>
      <p className="text-xs font-medium opacity-75">{label}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  );
}
