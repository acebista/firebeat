import React, { useState } from 'react';
import { X, Loader, AlertCircle, CheckCircle } from 'lucide-react';
import { AssignedOrder, RecordSalesReturnPayload, ReturnType, ReturnReason } from '../../types/delivery-order';
import { User } from '../../types';
import { recordSalesReturn } from '../../services/delivery-orders';
import { calculateReturnTotal, formatCurrency } from '../../lib/delivery-order-logic';

interface SalesReturnModalProps {
  isOpen: boolean;
  order: AssignedOrder;
  currentUser: User;
  onClose: () => void;
  onSuccess: (updatedOrder: AssignedOrder) => void;
  onError: (error: string) => void;
}

export const SalesReturnModal: React.FC<SalesReturnModalProps> = ({
  isOpen,
  order,
  currentUser,
  onClose,
  onSuccess,
  onError,
}) => {
  const [returnType, setReturnType] = useState<ReturnType>('partial');
  const [reason, setReason] = useState<ReturnReason>('customer_rejected');
  const [notes, setNotes] = useState('');
  const [selectedItems, setSelectedItems] = useState<Record<string, number | undefined>>({});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  const handleItemQtyChange = (productId: string, qty: number) => {
    const maxQty = order.items.find(i => i.productId === productId)?.qty || 0;
    if (qty > maxQty) {
      setErrors([`Cannot return more than ${maxQty} items`]);
      return;
    }
    setSelectedItems({
      ...selectedItems,
      [productId]: qty > 0 ? qty : undefined,
    });
    setErrors([]);
  };

  const handleSubmit = async () => {
    setErrors([]);
    setSuccessMessage('');
    setLoading(true);

    try {
      const returnItems =
        returnType === 'full'
          ? order.items.map(item => ({
              productId: item.productId,
              productName: item.productName,
              qtyDelivered: item.qty,
              qtyReturned: item.qty,
              rate: item.rate,
              returnAmount: item.total,
            }))
          : order.items
              .filter(item => selectedItems[item.productId])
              .map(item => ({
                productId: item.productId,
                productName: item.productName,
                qtyDelivered: item.qty,
                qtyReturned: selectedItems[item.productId] || 0,
                rate: item.rate,
                returnAmount: (selectedItems[item.productId] || 0) * item.rate,
              }));

      if (returnType === 'partial' && returnItems.length === 0) {
        setErrors(['Please select at least one item for partial return']);
        setLoading(false);
        return;
      }

      const payload: RecordSalesReturnPayload = {
        orderId: order.id,
        returnType,
        reason,
        items: returnItems,
        notes: notes || undefined,
      };

      const response = await recordSalesReturn(payload, order, currentUser);

      if (response.success && response.order) {
        setSuccessMessage('Sales return recorded successfully!');
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

  const returnAmount =
    returnType === 'full'
      ? order.subtotal
      : calculateReturnTotal(
          order.items
            .filter(item => selectedItems[item.productId])
            .map(item => ({
              productId: item.productId,
              productName: item.productName,
              qtyDelivered: item.qty,
              qtyReturned: selectedItems[item.productId] || 0,
              rate: item.rate,
              returnAmount: (selectedItems[item.productId] || 0) * item.rate,
            }))
        );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-96 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-orange-600 to-orange-700 text-white p-6 flex justify-between items-center">
          <h2 className="text-xl font-bold">Record Sales Return</h2>
          <button onClick={onClose} className="hover:bg-orange-800 p-2 rounded">
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
                <span className="text-gray-600">Total Items:</span>
                <p className="font-medium">{order.items.length} items</p>
              </div>
              <div>
                <span className="text-gray-600">Order Total:</span>
                <p className="font-medium">{formatCurrency(order.subtotal)}</p>
              </div>
              <div>
                <span className="text-gray-600">Order ID:</span>
                <p className="font-medium">{order.orderId}</p>
              </div>
            </div>
          </div>

          {/* Return Type Selection */}
          <div className="border-t pt-4">
            <h3 className="font-semibold text-gray-700 mb-3">Return Type</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-3 p-3 border rounded cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  checked={returnType === 'full'}
                  onChange={() => {
                    setReturnType('full');
                    setSelectedItems({});
                  }}
                  className="w-4 h-4"
                />
                <div>
                  <p className="font-medium text-gray-700">Full Return</p>
                  <p className="text-sm text-gray-500">Return all items - Refund: {formatCurrency(order.subtotal)}</p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 border rounded cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  checked={returnType === 'partial'}
                  onChange={() => setReturnType('partial')}
                  className="w-4 h-4"
                />
                <div>
                  <p className="font-medium text-gray-700">Partial Return</p>
                  <p className="text-sm text-gray-500">Return specific items - Refund: {formatCurrency(returnAmount)}</p>
                </div>
              </label>
            </div>
          </div>

          {/* Items Selection (for partial return) */}
          {returnType === 'partial' && (
            <div className="border-t pt-4">
              <h3 className="font-semibold text-gray-700 mb-3">Items to Return</h3>
              <div className="space-y-2">
                {order.items.map(item => (
                  <div key={item.productId} className="border rounded p-3 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-700">{item.productName}</p>
                        <p className="text-sm text-gray-500">
                          {formatCurrency(item.rate)} per unit | Total: {formatCurrency(item.total)}
                        </p>
                      </div>
                      <span className="text-sm font-medium text-gray-600">Delivered: {item.qty}</span>
                    </div>
                    <input
                      type="number"
                      min="0"
                      max={item.qty}
                      placeholder="Qty to return"
                      value={selectedItems[item.productId] || ''}
                      onChange={e =>
                        handleItemQtyChange(item.productId, parseInt(e.target.value) || 0)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Return Reason */}
          <div className="border-t pt-4">
            <h3 className="font-semibold text-gray-700 mb-3">Return Reason</h3>
            <select
              value={reason}
              onChange={e => setReason(e.target.value as ReturnReason)}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            >
              <option value="customer_rejected">Customer Rejected</option>
              <option value="quality_issue">Quality Issue</option>
              <option value="expiry_issue">Expiry Issue</option>
              <option value="wrong_item">Wrong Item</option>
              <option value="price_negotiation">Price Negotiation</option>
              <option value="overstock">Overstock</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="text-sm text-gray-600 block mb-2">Additional Notes</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Any additional information..."
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
              rows={3}
            />
          </div>

          {/* Refund Summary */}
          <div className="bg-orange-50 border border-orange-200 p-4 rounded">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-700">Total Refund:</span>
              <span className="text-2xl font-bold text-orange-600">{formatCurrency(returnAmount)}</span>
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
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded disabled:opacity-50 flex items-center gap-2"
            >
              {loading && <Loader size={16} className="animate-spin" />}
              Record Return
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesReturnModal;
