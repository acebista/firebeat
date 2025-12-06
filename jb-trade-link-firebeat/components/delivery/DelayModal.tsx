import React, { useState } from 'react';
import { X, Loader, AlertCircle, CheckCircle, Calendar } from 'lucide-react';
import { AssignedOrder, RecordDelayPayload, DelayReason } from '../../types/delivery-order';
import { User } from '../../types';
import { recordOrderDelay } from '../../services/delivery-orders';
import { formatCurrency, formatDate, getDelayReasonLabel } from '../../lib/delivery-order-logic';

interface DelayModalProps {
  isOpen: boolean;
  order: AssignedOrder;
  currentUser: User;
  onClose: () => void;
  onSuccess: (updatedOrder: AssignedOrder) => void;
  onError: (error: string) => void;
}

export const DelayModal: React.FC<DelayModalProps> = ({
  isOpen,
  order,
  currentUser,
  onClose,
  onSuccess,
  onError,
}) => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  const [reason, setReason] = useState<DelayReason>('customer_not_available');
  const [rescheduledDate, setRescheduledDate] = useState(tomorrowStr);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  const delayReasons: DelayReason[] = [
    'customer_not_available',
    'address_not_found',
    'payment_pending',
    'delivery_slot_full',
    'customer_request',
    'vehicle_issue',
    'traffic',
    'other',
  ];

  const handleSubmit = async () => {
    setErrors([]);
    setSuccessMessage('');
    setLoading(true);

    try {
      const payload: RecordDelayPayload = {
        orderId: order.id,
        reason,
        rescheduledDate,
        notes: notes || undefined,
      };

      const response = await recordOrderDelay(payload, order, currentUser);

      if (response.success && response.order) {
        setSuccessMessage('Delivery delay recorded successfully!');
        setTimeout(() => {
          onSuccess(response.order!);
          onClose();
        }, 1500);
      } else {
        setErrors(response.errors || [response.message]);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setErrors([errorMessage]);
      onError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-xl max-h-96 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6 flex justify-between items-center">
          <h2 className="text-xl font-bold">Record Delivery Delay</h2>
          <button onClick={onClose} className="hover:bg-purple-800 p-2 rounded">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Order Info */}
          <div className="bg-gray-50 p-4 rounded border border-gray-200">
            <h3 className="font-semibold text-gray-700 mb-2">Order Information</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-600">Customer:</span>
                <p className="font-medium">{order.customerName}</p>
              </div>
              <div>
                <span className="text-gray-600">Order ID:</span>
                <p className="font-medium">{order.orderId}</p>
              </div>
              <div>
                <span className="text-gray-600">Order Value:</span>
                <p className="font-medium">{formatCurrency(order.subtotal)}</p>
              </div>
              <div>
                <span className="text-gray-600">Items:</span>
                <p className="font-medium">{order.items.length} items</p>
              </div>
            </div>
          </div>

          {/* Current Status */}
          <div className="bg-blue-50 border border-blue-200 p-4 rounded">
            <p className="text-sm text-blue-700">
              <strong>Current Status:</strong> {order.status === 'out_for_delivery' ? 'Out for Delivery' : 'Assigned'}
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Assigned on: {formatDate(order.assignedDate)}
            </p>
          </div>

          {/* Delay Reason */}
          <div className="border-t pt-4">
            <label className="text-sm font-semibold text-gray-700 block mb-3">Why is delivery delayed? *</label>
            <div className="space-y-2">
              {delayReasons.map(delayReason => (
                <label
                  key={delayReason}
                  className="flex items-center gap-3 p-3 border rounded cursor-pointer hover:bg-gray-50"
                >
                  <input
                    type="radio"
                    checked={reason === delayReason}
                    onChange={() => setReason(delayReason)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-gray-700">{getDelayReasonLabel(delayReason)}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Rescheduled Date */}
          <div className="border-t pt-4">
            <label className="text-sm font-semibold text-gray-700 block mb-2">
              <Calendar size={16} className="inline mr-1" />
              Rescheduled Delivery Date *
            </label>
            <input
              type="date"
              value={rescheduledDate}
              onChange={e => setRescheduledDate(e.target.value)}
              min={tomorrowStr}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
            <p className="text-xs text-gray-500 mt-2">
              Selected date: <strong>{formatDate(rescheduledDate)}</strong>
            </p>
          </div>

          {/* Additional Notes */}
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">Additional Context</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="E.g., Customer requested delay, vehicle broke down, etc."
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
              rows={3}
            />
          </div>

          {/* Summary Card */}
          <div className="bg-purple-50 border border-purple-200 p-4 rounded space-y-2">
            <div className="text-sm">
              <p className="text-gray-600">Reason:</p>
              <p className="font-semibold text-purple-700">{getDelayReasonLabel(reason)}</p>
            </div>
            <div className="text-sm">
              <p className="text-gray-600">New Delivery Date:</p>
              <p className="font-semibold text-purple-700">{formatDate(rescheduledDate)}</p>
            </div>
          </div>

          {/* Errors */}
          {errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded p-3">
              {errors.map((error, idx) => (
                <div key={idx} className="flex gap-2 text-sm text-red-700">
                  <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              ))}
            </div>
          )}

          {/* Success */}
          {successMessage && (
            <div className="bg-green-50 border border-green-200 rounded p-3 flex gap-2 text-sm text-green-700">
              <CheckCircle size={16} className="flex-shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 justify-end border-t pt-4">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded disabled:opacity-50 flex items-center gap-2"
            >
              {loading && <Loader size={16} className="animate-spin" />}
              Record Delay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DelayModal;
