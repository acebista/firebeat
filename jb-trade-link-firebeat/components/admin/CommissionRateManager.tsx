/**
 * Commission Rate Manager Component
 * Manages commission rates for a specific company
 * Allows CRUD operations for commission slabs
 */

import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Badge } from '../ui/Elements';
import { Modal } from '../ui/Modal';
import { Plus, Edit2, Trash2, AlertCircle } from 'lucide-react';
import { CommissionRate, UpsertCommissionRatePayload } from '../../types/hr';
import { CommissionRateService } from '../../services/hr';
import toast from 'react-hot-toast';

interface CommissionRateManagerProps {
  companyId: string | null;
  companyName: string;
}

interface RateFormData {
  min_amount: number | '';
  max_amount: number | '';
  rate_pct: number | '';
}

type CommissionMode = 'slab' | 'level';

export const CommissionRateManager: React.FC<CommissionRateManagerProps> = ({ 
  companyId, 
  companyName 
}) => {
  const [rates, setRates] = useState<CommissionRate[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRate, setEditingRate] = useState<CommissionRate | null>(null);
  const [selectedMode, setSelectedMode] = useState<CommissionMode>('slab');
  const [formData, setFormData] = useState<RateFormData>({
    min_amount: '',
    max_amount: '',
    rate_pct: '',
  });
  const [validationError, setValidationError] = useState<string | null>(null);

  // Load commission rates when component mounts or company changes
  useEffect(() => {
    loadRates();
  }, [companyId]);

  const loadRates = async () => {
    try {
      setLoading(true);
      const data = await CommissionRateService.getActiveByCompany(companyId);
      setRates(data);
    } catch (error) {
      console.error('Failed to load commission rates:', error);
      toast.error('Failed to load commission rates');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    setValidationError(null);

    if (formData.min_amount === '' || formData.rate_pct === '') {
      setValidationError('Min Amount and Rate % are required');
      return false;
    }

    const minAmount = Number(formData.min_amount);
    const maxAmount = formData.max_amount !== '' ? Number(formData.max_amount) : null;
    const rate = Number(formData.rate_pct);

    if (isNaN(minAmount) || minAmount < 0) {
      setValidationError('Min Amount must be a positive number');
      return false;
    }

    if (maxAmount !== null && isNaN(maxAmount)) {
      setValidationError('Max Amount must be a valid number');
      return false;
    }

    if (maxAmount !== null && maxAmount <= minAmount) {
      setValidationError('Max Amount must be greater than Min Amount');
      return false;
    }

    if (isNaN(rate) || rate < 0 || rate > 100) {
      setValidationError('Rate % must be between 0 and 100');
      return false;
    }

    // Check for overlapping ranges with other rates
    for (const existingRate of rates) {
      if (editingRate && existingRate.id === editingRate.id) continue; // Skip self

      const existingMin = existingRate.min_amount;
      const existingMax = existingRate.max_amount;

      // Check if ranges overlap
      if (maxAmount === null) {
        // New range is open-ended
        if (minAmount < (existingMax ?? Infinity)) {
          if (existingMax === null || minAmount <= existingMax) {
            setValidationError(
              `Range overlaps with existing rate: ${existingMin} - ${existingMax || '∞'}`
            );
            return false;
          }
        }
      } else {
        // New range is bounded
        if (
          (minAmount >= existingMin && minAmount < (existingMax ?? Infinity)) ||
          (maxAmount > existingMin && maxAmount <= (existingMax ?? Infinity)) ||
          (minAmount <= existingMin && maxAmount >= (existingMax ?? Infinity))
        ) {
          setValidationError(
            `Range overlaps with existing rate: ${existingMin} - ${existingMax || '∞'}`
          );
          return false;
        }
      }
    }

    return true;
  };

  const handleAdd = () => {
    setEditingRate(null);
    setFormData({ min_amount: '', max_amount: '', rate_pct: '' });
    setValidationError(null);
    setIsModalOpen(true);
  };

  const handleEdit = (rate: CommissionRate) => {
    setEditingRate(rate);
    setFormData({
      min_amount: rate.min_amount,
      max_amount: rate.max_amount || '',
      rate_pct: rate.rate_pct,
    });
    setValidationError(null);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      const payload: UpsertCommissionRatePayload = {
        company_id: companyId,
        company_name: companyName,
        name: `${companyName} - ${formData.min_amount}${formData.max_amount ? `-${formData.max_amount}` : '+'}`,
        min_amount: Number(formData.min_amount),
        max_amount: formData.max_amount !== '' ? Number(formData.max_amount) : null,
        rate_pct: Number(formData.rate_pct),
        is_active: true,
        mode: selectedMode,
      };

      if (editingRate) {
        payload.id = editingRate.id;
      }

      await CommissionRateService.upsert(payload);
      toast.success(editingRate ? 'Commission rate updated' : 'Commission rate added');
      await loadRates();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to save commission rate:', error);
      toast.error('Failed to save commission rate');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this commission rate?')) return;

    try {
      await CommissionRateService.delete(id);
      toast.success('Commission rate deleted');
      await loadRates();
    } catch (error) {
      console.error('Failed to delete commission rate:', error);
      toast.error('Failed to delete commission rate');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">Commission Rate Slabs</h3>
        <Button onClick={handleAdd} size="sm">
          <Plus className="mr-2 h-4 w-4" /> Add Rate
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading commission rates...</div>
      ) : rates.length === 0 ? (
        <Card>
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 mb-4">No commission rates configured for this company</p>
            <Button onClick={handleAdd} size="sm">Add First Rate</Button>
          </div>
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                    Mode
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                    Min Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                    Max Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                    Rate %
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {rates.map((rate) => (
                  <tr key={rate.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge color={rate.mode === 'slab' ? 'blue' : 'green'}>
                        {rate.mode?.toUpperCase() || 'SLAB'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-gray-900">
                      ₹{rate.min_amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-gray-900">
                      {rate.max_amount ? `₹${rate.max_amount.toLocaleString()}` : '∞'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-semibold text-sm text-gray-900">
                      {rate.rate_pct}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge color={rate.is_active ? 'green' : 'gray'}>
                        {rate.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleEdit(rate)}
                        className="text-indigo-600 hover:text-indigo-900 p-1"
                        title="Edit rate"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(rate.id)}
                        className="text-red-600 hover:text-red-900 p-1"
                        title="Delete rate"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingRate ? 'Edit Commission Rate' : 'Add Commission Rate'}
      >
        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-4">
          {validationError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
              <p className="text-sm text-red-700">{validationError}</p>
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Commission Mode</label>
            <select
              value={selectedMode}
              onChange={(e) => setSelectedMode(e.target.value as CommissionMode)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="slab">
                Slab (Tiered) - Each range gets its own rate
              </option>
              <option value="level">
                Level (Bracket) - Entire sales at bracket rate
              </option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              {selectedMode === 'slab' 
                ? 'Example: 0-400k @ 1%, 400-600k @ 1.2%, 600k+ @ 1.4%' 
                : 'Example: If sales < 400k: 1% of entire sales. If 400-600k: 1.2% of entire sales'}
            </p>
          </div>

          <Input
            label="Minimum Amount (₹)"
            type="number"
            step="0.01"
            value={formData.min_amount}
            onChange={(e) => setFormData({ ...formData, min_amount: e.target.value ? Number(e.target.value) : '' })}
            placeholder="e.g. 0"
            required
          />

          <Input
            label="Maximum Amount (₹) (Optional - leave blank for unlimited)"
            type="number"
            step="0.01"
            value={formData.max_amount}
            onChange={(e) => setFormData({ ...formData, max_amount: e.target.value ? Number(e.target.value) : '' })}
            placeholder="e.g. 100000"
          />

          <Input
            label="Rate (%)"
            type="number"
            step="0.01"
            min="0"
            max="100"
            value={formData.rate_pct}
            onChange={(e) => setFormData({ ...formData, rate_pct: e.target.value ? Number(e.target.value) : '' })}
            placeholder="e.g. 5.5"
            required
          />

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
            <p className="text-sm text-blue-800">
              <strong>Slab Range:</strong> {formData.min_amount || '0'} to {formData.max_amount || '∞'} at {formData.rate_pct || '0'}%
            </p>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setIsModalOpen(false)} type="button">
              Cancel
            </Button>
            <Button type="submit">
              {editingRate ? 'Update Rate' : 'Add Rate'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
