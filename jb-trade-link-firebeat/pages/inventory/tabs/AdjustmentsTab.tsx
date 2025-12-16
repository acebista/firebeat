/**
 * Adjustments Tab
 * 
 * Allows admins to manually adjust inventory
 * Includes: manual adjustments (loss/leakage/audit) and opening stock setting (single & bulk)
 */

import React, { useState, useEffect } from 'react';
import { Search, Plus, AlertCircle, Loader, CheckCircle, X, Download, Upload } from 'lucide-react';
import {
  createInventoryAdjustment,
  setOpeningStock,
  getAllProducts,
  batchUpsertOpeningStock,
  InventoryAdjustment,
  InventoryOpening,
} from '../../../services/inventory/inventoryService';
import type { InventoryProduct } from '../../../services/inventory/inventoryUtils';
import { deriveProductSku, getTodayISO, generateOpeningStockTemplate, downloadAsCSV, parseOpeningStockCSV, normalizeDateToISO } from '../../../services/inventory/inventoryUtils';
import { ProductTypeahead } from '../../../components/inventory/ProductTypeahead';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

export function AdjustmentsTab({ isAdmin }: { isAdmin: boolean }) {
  const [products, setProducts] = useState<InventoryProduct[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productError, setProductError] = useState<string | null>(null);
  
  const [activeForm, setActiveForm] = useState<'adjustment' | 'opening' | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      setLoadingProducts(true);
      setProductError(null);
      const data = await getAllProducts();
      setProducts(data);
    } catch (err) {
      console.error('[AdjustmentsTab] Error loading products:', err);
      setProductError(err instanceof Error ? err.message : 'Failed to load products');
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

  // Show loading state
  if (loadingProducts) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-2" />
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  // Show error state with retry
  if (productError) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
          <p className="text-gray-900 font-medium mb-4">{productError}</p>
          <button
            onClick={loadProducts}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
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
  products: InventoryProduct[];
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

      {/* Product Select with Typeahead */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Product *</label>
        <ProductTypeahead
          products={products}
          selectedProductId={formData.product_id}
          onSelect={(product) => setFormData({ ...formData, product_id: product.id })}
          placeholder="Search product name or company..."
          disabled={loading || loadingProducts}
          loading={loadingProducts}
        />
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
  products: InventoryProduct[];
  loadingProducts: boolean;
  onSuccess: (msg: string) => void;
}) {
  const [mode, setMode] = useState<'single' | 'bulk'>('single');
  
  if (mode === 'single') {
    return (
      <SingleOpeningStockForm
        products={products}
        loadingProducts={loadingProducts}
        onSuccess={onSuccess}
        onSwitchMode={() => setMode('bulk')}
      />
    );
  } else {
    return (
      <BulkOpeningStockForm
        products={products}
        loadingProducts={loadingProducts}
        onSuccess={onSuccess}
        onSwitchMode={() => setMode('single')}
      />
    );
  }
}

function SingleOpeningStockForm({
  products,
  loadingProducts,
  onSuccess,
  onSwitchMode,
}: {
  products: InventoryProduct[];
  loadingProducts: boolean;
  onSuccess: (msg: string) => void;
  onSwitchMode: () => void;
}) {
  const [formData, setFormData] = useState({
    product_id: '',
    opening_qty: 0,
    effective_date: getTodayISO(),
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
        effective_date: getTodayISO(),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to set opening stock');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-4 bg-gray-50 border border-gray-200 rounded-lg p-6">
      {/* Mode Toggle */}
      <div className="flex space-x-2 mb-4">
        <button
          type="button"
          className="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-700 rounded"
          disabled
        >
          Single Entry
        </button>
        <button
          type="button"
          onClick={onSwitchMode}
          className="px-3 py-1 text-sm font-medium bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
        >
          Bulk Import
        </button>
      </div>

      {error && (
        <div className="flex items-center space-x-2 bg-red-50 border border-red-200 rounded-lg p-3">
          <AlertCircle size={16} className="text-red-600" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Product Select with Typeahead */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Product *</label>
        <ProductTypeahead
          products={products}
          selectedProductId={formData.product_id}
          onSelect={(product) => setFormData({ ...formData, product_id: product.id })}
          placeholder="Search product name or company..."
          disabled={loading || loadingProducts}
          loading={loadingProducts}
        />
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
            onChange={e => setFormData({ ...formData, effective_date: normalizeDateToISO(e.target.value) })}
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

interface BulkOpeningRecord {
  product_id: string;
  opening_qty: number;
  effective_date: string;
  note?: string;
}

function BulkOpeningStockForm({
  products,
  loadingProducts,
  onSuccess,
  onSwitchMode,
}: {
  products: InventoryProduct[];
  loadingProducts: boolean;
  onSuccess: (msg: string) => void;
  onSwitchMode: () => void;
}) {
  const [records, setRecords] = useState<BulkOpeningRecord[]>([]);
  const [globalDate, setGlobalDate] = useState(getTodayISO());
  const [applyToAll, setApplyToAll] = useState(true);
  const [searchFilter, setSearchFilter] = useState('');
  const [showCSVModal, setShowCSVModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter displayed records based on search
  const filteredRecords = records.filter(r => {
    if (!searchFilter.trim()) return true;
    const product = products.find(p => p.id === r.product_id);
    if (!product) return false;
    const term = searchFilter.toLowerCase();
    return (
      product.name?.toLowerCase().includes(term) ||
      product.companyName?.toLowerCase().includes(term)
    );
  });

  const filledCount = records.filter(r => r.opening_qty > 0).length;
  const totalCount = records.length;

  const addRecord = () => {
    setRecords([
      ...records,
      {
        product_id: '',
        opening_qty: 0,
        effective_date: applyToAll ? globalDate : getTodayISO(),
        note: '',
      },
    ]);
  };

  const updateRecord = (index: number, field: string, value: any) => {
    const updated = [...records];
    updated[index] = { ...updated[index], [field]: value };
    setRecords(updated);
  };

  const removeRecord = (index: number) => {
    setRecords(records.filter((_, i) => i !== index));
  };

  const handleDownloadTemplate = () => {
    const csv = generateOpeningStockTemplate(products);
    downloadAsCSV(csv, 'opening_stock_template.csv');
    toast.success('Template downloaded');
  };

  const handlePasteCSV = (csvText: string) => {
    try {
      const parsed = parseOpeningStockCSV(csvText);
      const newRecords: BulkOpeningRecord[] = parsed.map(p => ({
        product_id: p.product_id,
        opening_qty: p.opening_qty || 0,
        effective_date: p.effective_date || globalDate,
      }));
      
      // Validate product IDs
      const validRecords = newRecords.filter(r => {
        const exists = products.some(p => p.id === r.product_id);
        if (!exists) {
          console.warn(`Product not found: ${r.product_id}`);
        }
        return exists;
      });

      if (validRecords.length === 0) {
        setError('No valid products found in CSV. Please check product IDs.');
        return;
      }

      setRecords(validRecords);
      setShowCSVModal(false);
      toast.success(`Loaded ${validRecords.length} records from CSV`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse CSV');
    }
  };

  const handleSave = async () => {
    if (records.length === 0) {
      setError('No records to save');
      return;
    }

    const withQty = records.filter(r => r.opening_qty > 0);
    if (withQty.length === 0) {
      setError('At least one record must have a quantity > 0');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Prepare records with global date if applyToAll
      const toSave = withQty.map(r => ({
        ...r,
        effective_date: applyToAll ? globalDate : r.effective_date,
      }));

      // Use batch upsert
      await batchUpsertOpeningStock(toSave);

      onSuccess(`Successfully imported ${withQty.length} opening stock records`);
      setRecords([]);
      setSearchFilter('');
      setGlobalDate(getTodayISO());
      toast.success('Opening stock saved');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 bg-gray-50 border border-gray-200 rounded-lg p-6">
      {/* Mode Toggle */}
      <div className="flex space-x-2 mb-4">
        <button
          type="button"
          onClick={onSwitchMode}
          className="px-3 py-1 text-sm font-medium bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
        >
          Single Entry
        </button>
        <button
          type="button"
          className="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-700 rounded"
          disabled
        >
          Bulk Import
        </button>
      </div>

      {error && (
        <div className="flex items-center space-x-2 bg-red-50 border border-red-200 rounded-lg p-3">
          <AlertCircle size={16} className="text-red-600" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Toolbar */}
      <div className="space-y-3 border-b border-gray-300 pb-4">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Global Effective Date</label>
            <input
              type="date"
              value={globalDate}
              onChange={e => setGlobalDate(normalizeDateToISO(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          </div>
          <div className="flex items-end">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={applyToAll}
                onChange={e => setApplyToAll(e.target.checked)}
                className="rounded"
                disabled={loading}
              />
              <span className="text-sm font-medium text-gray-700">Apply to all rows</span>
            </label>
          </div>
          <div>
            <input
              type="text"
              placeholder="Search products..."
              value={searchFilter}
              onChange={e => setSearchFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setRecords([])}
            className="px-3 py-1 text-sm bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            disabled={loading || records.length === 0}
          >
            Clear All
          </button>
          <button
            type="button"
            onClick={() => setShowCSVModal(true)}
            className="px-3 py-1 text-sm bg-purple-500 text-white rounded hover:bg-purple-600 flex items-center space-x-1"
            disabled={loading}
          >
            <Upload size={14} />
            <span>Paste CSV</span>
          </button>
          <button
            type="button"
            onClick={handleDownloadTemplate}
            className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600 flex items-center space-x-1"
            disabled={loading || products.length === 0}
          >
            <Download size={14} />
            <span>Download Template</span>
          </button>
        </div>
      </div>

      {/* Records Grid */}
      <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 border-b border-gray-300">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Product</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Company</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-700">New Qty</th>
                {!applyToAll && <th className="px-4 py-3 text-left font-semibold text-gray-700">Date</th>}
                <th className="px-4 py-3 text-center font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.length > 0 ? (
                filteredRecords.map((record, idx) => {
                  const product = products.find(p => p.id === record.product_id);
                  return (
                    <tr key={idx} className="border-b border-gray-200 hover:bg-blue-50">
                      <td className="px-4 py-2">
                        <select
                          value={record.product_id}
                          onChange={e => {
                            const realIdx = records.indexOf(record);
                            updateRecord(realIdx, 'product_id', e.target.value);
                          }}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                        >
                          <option value="">Select...</option>
                          {products.map(p => (
                            <option key={p.id} value={p.id}>
                              {p.name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-2 text-gray-600">{product?.companyName || '-'}</td>
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          min="0"
                          value={record.opening_qty}
                          onChange={e => {
                            const realIdx = records.indexOf(record);
                            updateRecord(realIdx, 'opening_qty', parseInt(e.target.value) || 0);
                          }}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-xs text-center"
                        />
                      </td>
                      {!applyToAll && (
                        <td className="px-4 py-2">
                          <input
                            type="date"
                            value={record.effective_date}
                            onChange={e => {
                              const realIdx = records.indexOf(record);
                              updateRecord(realIdx, 'effective_date', normalizeDateToISO(e.target.value));
                            }}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                          />
                        </td>
                      )}
                      <td className="px-4 py-2 text-center">
                        <button
                          type="button"
                          onClick={() => {
                            const realIdx = records.indexOf(record);
                            removeRecord(realIdx);
                          }}
                          className="px-2 py-1 text-xs bg-red-100 text-red-600 rounded hover:bg-red-200"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={applyToAll ? 4 : 5} className="px-4 py-8 text-center text-gray-500">
                    No records yet. Add one or paste CSV.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sticky Footer */}
      <div className="border-t border-gray-300 pt-4 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          {filledCount} / {totalCount} rows filled
        </div>
        <div className="flex space-x-3">
          <button
            type="button"
            onClick={addRecord}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400 disabled:opacity-50"
            disabled={loading}
          >
            + Add Row
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
            disabled={loading || filledCount === 0}
          >
            {loading && <Loader size={14} className="animate-spin" />}
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      {/* CSV Modal */}
      {showCSVModal && (
        <CSVPasteModal
          onSubmit={handlePasteCSV}
          onClose={() => setShowCSVModal(false)}
        />
      )}
    </div>
  );
}

function CSVPasteModal({
  onSubmit,
  onClose,
}: {
  onSubmit: (csv: string) => void;
  onClose: () => void;
}) {
  const [csvText, setCsvText] = useState('');

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full space-y-4 p-6">
        <h3 className="text-lg font-semibold text-gray-900">Paste CSV Data</h3>
        <p className="text-sm text-gray-600">
          Expected format: <code className="bg-gray-100 px-2 py-1 rounded">product_id,opening_qty,effective_date</code>
        </p>
        
        <textarea
          value={csvText}
          onChange={e => setCsvText(e.target.value)}
          placeholder="product_id,opening_qty,effective_date
123e4567-e89b-12d3-a456-426614174000,100,2024-01-15
..."
          rows={8}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
        />

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (csvText.trim()) {
                onSubmit(csvText);
              }
            }}
            disabled={!csvText.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"
          >
            Load Data
          </button>
        </div>
      </div>
    </div>
  );
}
