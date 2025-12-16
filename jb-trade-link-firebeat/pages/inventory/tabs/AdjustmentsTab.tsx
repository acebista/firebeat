/**
 * Adjustments Tab
 * 
 * Allows admins to manually adjust inventory
 * Includes: manual adjustments (loss/leakage/audit) and opening stock setting
 */

import React, { useState, useEffect } from 'react';
import { Search, Plus, AlertCircle, Loader, CheckCircle, X } from 'lucide-react';
import {
  createInventoryAdjustment,
  setOpeningStock,
  InventoryAdjustment,
  InventoryOpening,
} from '../../../services/inventory/inventoryService';
import { supabase } from '../../../lib/supabase';
import { format } from 'date-fns';

interface Product {
  id: string;
  name: string;
  sku: string;
  company: string;
}

export function AdjustmentsTab({ isAdmin }: { isAdmin: boolean }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  
  const [activeForm, setActiveForm] = useState<'adjustment' | 'opening' | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, sku, company')
        .order('name');

      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      console.error('[AdjustmentsTab] Error loading products:', err);
    } finally {
      setLoadingProducts(false);
    }
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <AlertCircle size={48} className="mx-auto text-amber-600 mb-4" />
          <p className="text-lg font-medium text-gray-900">Admin Access Required</p>
          <p className="text-sm text-gray-600 mt-2">
            Only administrators can create inventory adjustments or set opening stock.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex space-x-4 border-b border-gray-200">
        <button
          onClick={() => setActiveForm('adjustment')}
          className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
            activeForm === 'adjustment'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          <Plus size={16} className="inline mr-2" />
          Manual Adjustment
        </button>
        <button
          onClick={() => setActiveForm('opening')}
          className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
            activeForm === 'opening'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          <Plus size={16} className="inline mr-2" />
          Set Opening Stock
        </button>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="flex items-center space-x-3 bg-green-50 border border-green-200 rounded-lg p-4">
          <CheckCircle size={20} className="text-green-600" />
          <p className="text-sm text-green-700">{successMessage}</p>
          <button
            onClick={() => setShowSuccess(false)}
            className="ml-auto"
          >
            <X size={16} className="text-green-600" />
          </button>
        </div>
      )}

      {/* Forms */}
      {activeForm === 'adjustment' && (
        <AdjustmentForm
          products={products}
          loadingProducts={loadingProducts}
          onSuccess={(msg) => {
            setSuccessMessage(msg);
            setShowSuccess(true);
            setActiveForm(null);
            setTimeout(() => setShowSuccess(false), 4000);
          }}
        />
      )}

      {activeForm === 'opening' && (
        <OpeningStockForm
          products={products}
          loadingProducts={loadingProducts}
          onSuccess={(msg) => {
            setSuccessMessage(msg);
            setShowSuccess(true);
            setActiveForm(null);
            setTimeout(() => setShowSuccess(false), 4000);
          }}
        />
      )}

      {!activeForm && (
        <div className="text-center py-12 text-gray-500">
          <p>Click a button above to create a new adjustment or set opening stock.</p>
        </div>
      )}
    </div>
  );
}

function AdjustmentForm({
  products,
  loadingProducts,
  onSuccess,
}: {
  products: Product[];
  loadingProducts: boolean;
  onSuccess: (msg: string) => void;
}) {
  const [formData, setFormData] = useState({
    product_id: '',
    qty_delta: 0,
    reason: 'audit' as const,
    note: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!formData.product_id) {
      setError('Please select a product');
      return;
    }

    if (formData.qty_delta === 0) {
      setError('Adjustment quantity cannot be zero');
      return;
    }

    if (Math.abs(formData.qty_delta) > 10000) {
      setError('Adjustment quantity seems too large. Please verify.');
      return;
    }

    try {
      setLoading(true);
      await createInventoryAdjustment({
        product_id: formData.product_id,
        qty_delta: formData.qty_delta,
        reason: formData.reason,
        note: formData.note,
      });

      const product = products.find(p => p.id === formData.product_id);
      onSuccess(`Adjustment recorded: ${formData.qty_delta > 0 ? '+' : ''}${formData.qty_delta} units of ${product?.name}`);

      // Reset form
      setFormData({
        product_id: '',
        qty_delta: 0,
        reason: 'audit',
        note: '',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create adjustment');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-4 bg-gray-50 border border-gray-200 rounded-lg p-6">
      {error && (
        <div className="flex items-center space-x-2 bg-red-50 border border-red-200 rounded-lg p-3">
          <AlertCircle size={16} className="text-red-600" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Product Select */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Product *</label>
        {loadingProducts ? (
          <div className="flex items-center space-x-2 text-gray-500">
            <Loader size={16} className="animate-spin" />
            <span className="text-sm">Loading products...</span>
          </div>
        ) : (
          <select
            value={formData.product_id}
            onChange={e => setFormData({ ...formData, product_id: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          >
            <option value="">Select a product...</option>
            {products.map(p => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.sku}) - {p.company}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Quantity */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Adjustment Qty *</label>
          <input
            type="number"
            value={formData.qty_delta}
            onChange={e => setFormData({ ...formData, qty_delta: parseInt(e.target.value) || 0 })}
            placeholder="e.g., +5 or -3"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
          <p className="text-xs text-gray-500 mt-1">Positive for additions, negative for removals</p>
        </div>

        {/* Reason */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Reason *</label>
          <select
            value={formData.reason}
            onChange={e => setFormData({ ...formData, reason: e.target.value as any })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          >
            <option value="audit">Audit Discrepancy</option>
            <option value="loss">Loss</option>
            <option value="leakage">Leakage/Spillage</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      {/* Note */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
        <textarea
          value={formData.note}
          onChange={e => setFormData({ ...formData, note: e.target.value })}
          placeholder="Additional details about this adjustment..."
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        />
      </div>

      {/* Submit */}
      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="reset"
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          disabled={loading}
        >
          Clear
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
          disabled={loading}
        >
          {loading && <Loader size={16} className="animate-spin" />}
          <span>{loading ? 'Saving...' : 'Record Adjustment'}</span>
        </button>
      </div>
    </form>
  );
}

function OpeningStockForm({
  products,
  loadingProducts,
  onSuccess,
}: {
  products: Product[];
  loadingProducts: boolean;
  onSuccess: (msg: string) => void;
}) {
  const [formData, setFormData] = useState({
    product_id: '',
    opening_qty: 0,
    effective_date: format(new Date(), 'yyyy-MM-dd'),
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!formData.product_id) {
      setError('Please select a product');
      return;
    }

    if (formData.opening_qty < 0) {
      setError('Opening stock cannot be negative');
      return;
    }

    try {
      setLoading(true);
      await setOpeningStock({
        product_id: formData.product_id,
        opening_qty: formData.opening_qty,
        effective_date: formData.effective_date,
      });

      const product = products.find(p => p.id === formData.product_id);
      onSuccess(`Opening stock set: ${formData.opening_qty} units of ${product?.name} (effective ${formData.effective_date})`);

      // Reset form
      setFormData({
        product_id: '',
        opening_qty: 0,
        effective_date: format(new Date(), 'yyyy-MM-dd'),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to set opening stock');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-4 bg-gray-50 border border-gray-200 rounded-lg p-6">
      {error && (
        <div className="flex items-center space-x-2 bg-red-50 border border-red-200 rounded-lg p-3">
          <AlertCircle size={16} className="text-red-600" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Product Select */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Product *</label>
        {loadingProducts ? (
          <div className="flex items-center space-x-2 text-gray-500">
            <Loader size={16} className="animate-spin" />
            <span className="text-sm">Loading products...</span>
          </div>
        ) : (
          <select
            value={formData.product_id}
            onChange={e => setFormData({ ...formData, product_id: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          >
            <option value="">Select a product...</option>
            {products.map(p => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.sku}) - {p.company}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Quantity and Date */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Opening Quantity *</label>
          <input
            type="number"
            min="0"
            value={formData.opening_qty}
            onChange={e => setFormData({ ...formData, opening_qty: parseInt(e.target.value) || 0 })}
            placeholder="e.g., 100"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Effective Date *</label>
          <input
            type="date"
            value={formData.effective_date}
            onChange={e => setFormData({ ...formData, effective_date: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
        </div>
      </div>

      {/* Submit */}
      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="reset"
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          disabled={loading}
        >
          Clear
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
          disabled={loading}
        >
          {loading && <Loader size={16} className="animate-spin" />}
          <span>{loading ? 'Saving...' : 'Set Opening Stock'}</span>
        </button>
      </div>
    </form>
  );
}
