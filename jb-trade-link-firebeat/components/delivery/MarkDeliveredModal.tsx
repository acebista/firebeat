import React, { useState } from 'react';
import { X, Loader, AlertCircle, CheckCircle } from 'lucide-react';
import { AssignedOrder, MarkDeliveredPayload, DamagedItem } from '../../types/delivery-order';
import { User } from '../../types';
import { markOrderAsDelivered } from '../../services/delivery-orders';
import { calculateNetReceivable, formatCurrency } from '../../lib/delivery-order-logic';

interface MarkDeliveredModalProps {
  isOpen: boolean;
  order: AssignedOrder;
  currentUser: User;
  onClose: () => void;
  onSuccess: (updatedOrder: AssignedOrder) => void;
  onError: (error: string) => void;
}

export const MarkDeliveredModal: React.FC<MarkDeliveredModalProps> = ({
  isOpen,
  order,
  currentUser,
  onClose,
  onSuccess,
  onError,
}) => {
  const [amountReceived, setAmountReceived] = useState<string>(order.netReceivable.toString());
  const [paymentMode, setPaymentMode] = useState<'cash' | 'qr' | 'cheque' | 'credit'>('cash');
  const [paymentReference, setPaymentReference] = useState('');
  const [damages, setDamages] = useState<DamagedItem[]>([]);
  const [damageQty, setDamageQty] = useState('');
  const [damageAmount, setDamageAmount] = useState('');
  const [selectedDamageItem, setSelectedDamageItem] = useState<string>('');
  const [damageType, setDamageType] = useState<'broken' | 'expired' | 'spoiled' | 'leaking' | 'wrong_item' | 'other'>('broken');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  const handleAddDamage = () => {
    if (!selectedDamageItem || !damageQty || !damageAmount) {
      setErrors(['Please fill all damage fields']);
      return;
    }

    const product = order.items.find(item => item.productId === selectedDamageItem);
    if (!product) {
      setErrors(['Product not found']);
      return;
    }

    const newDamage: DamagedItem = {
      productId: selectedDamageItem,
      productName: product.productName,
      qty: parseInt(damageQty),
      damageType,
      amount: parseFloat(damageAmount),
    };

    // Validate
    if (newDamage.qty > product.qty) {
      setErrors([`Cannot damage more than ${product.qty} items`]);
      return;
    }

    setDamages([...damages, newDamage]);
    setDamageQty('');
    setDamageAmount('');
    setSelectedDamageItem('');
    setErrors([]);
  };

  const handleRemoveDamage = (index: number) => {
    setDamages(damages.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    setErrors([]);
    setSuccessMessage('');
    setLoading(true);

    try {
      const payload: MarkDeliveredPayload = {
        orderId: order.id,
        amountReceived: parseFloat(amountReceived),
        paymentMode,
        paymentReference: paymentReference || undefined,
        damages: damages.length > 0 ? damages : undefined,
      };

      const response = await markOrderAsDelivered(payload, order, currentUser);

      if (response.success && response.order) {
        setSuccessMessage('Order marked as delivered successfully!');
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

  const totalDamages = damages.reduce((sum, d) => sum + d.amount, 0);
  const remainingAfterDamages = order.netReceivable - totalDamages;
  const amount = parseFloat(amountReceived) || 0;
  const balance = remainingAfterDamages - amount;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-96 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-green-600 to-green-700 text-white p-6 flex justify-between items-center">
          <h2 className="text-xl font-bold">Mark Order as Delivered</h2>
          <button onClick={onClose} className="hover:bg-green-800 p-2 rounded">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Customer Info */}
          <div className="bg-gray-50 p-4 rounded border border-gray-200">
            <h3 className="font-semibold text-gray-700 mb-2">Order Summary</h3>
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
                <span className="text-gray-600">Subtotal:</span>
                <p className="font-medium">{formatCurrency(order.subtotal)}</p>
              </div>
              <div>
                <span className="text-gray-600">Receivable:</span>
                <p className="font-medium">{formatCurrency(remainingAfterDamages)}</p>
              </div>
            </div>
          </div>

          {/* Damages Section */}
          <div className="border-t pt-4">
            <h3 className="font-semibold text-gray-700 mb-3">Record Damages (Optional)</h3>

            {damages.length > 0 && (
              <div className="mb-4 space-y-2">
                {damages.map((damage, idx) => (
                  <div key={idx} className="bg-red-50 border border-red-200 p-3 rounded flex justify-between items-center">
                    <div className="text-sm">
                      <p className="font-medium">{damage.productName}</p>
                      <p className="text-gray-600">Qty: {damage.qty} | Type: {damage.damageType}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-red-700">{formatCurrency(damage.amount)}</span>
                      <button
                        onClick={() => handleRemoveDamage(idx)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ))}
                <div className="bg-red-100 p-3 rounded text-sm font-medium text-red-700">
                  Total Damages: {formatCurrency(totalDamages)}
                </div>
              </div>
            )}

            {/* Add Damage Form */}
            <div className="bg-gray-50 p-4 rounded space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <select
                  value={selectedDamageItem}
                  onChange={e => setSelectedDamageItem(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded text-sm"
                >
                  <option value="">Select Product</option>
                  {order.items.map(item => (
                    <option key={item.productId} value={item.productId}>
                      {item.productName} ({item.qty} available)
                    </option>
                  ))}
                </select>

                <select
                  value={damageType}
                  onChange={e => setDamageType(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 rounded text-sm"
                >
                  <option value="broken">Broken</option>
                  <option value="expired">Expired</option>
                  <option value="spoiled">Spoiled</option>
                  <option value="leaking">Leaking</option>
                  <option value="wrong_item">Wrong Item</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  placeholder="Qty Damaged"
                  value={damageQty}
                  onChange={e => setDamageQty(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded text-sm"
                  min="0"
                />
                <input
                  type="number"
                  placeholder="Amount"
                  value={damageAmount}
                  onChange={e => setDamageAmount(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded text-sm"
                  min="0"
                  step="0.01"
                />
              </div>

              <button
                onClick={handleAddDamage}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded text-sm font-medium"
              >
                Add Damage
              </button>
            </div>
          </div>

          {/* Payment Section */}
          <div className="border-t pt-4 space-y-3">
            <h3 className="font-semibold text-gray-700">Payment Details</h3>

            <div>
              <label className="text-sm text-gray-600 block mb-1">Amount Received</label>
              <div className="flex items-center gap-2">
                <span className="text-gray-600">₹</span>
                <input
                  type="number"
                  value={amountReceived}
                  onChange={e => setAmountReceived(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded"
                  min="0"
                  max={remainingAfterDamages}
                  step="0.01"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Max receivable: {formatCurrency(remainingAfterDamages)}
              </p>
            </div>

            <div>
              <label className="text-sm text-gray-600 block mb-1">Payment Mode *</label>
              <select
                value={paymentMode}
                onChange={e => setPaymentMode(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              >
                <option value="cash">💵 Cash</option>
                <option value="qr">📱 QR Code</option>
                <option value="cheque">📄 Cheque</option>
                <option value="credit">💳 Credit</option>
              </select>
            </div>

            {paymentMode === 'cheque' && (
              <div>
                <label className="text-sm text-gray-600 block mb-1">Cheque Number</label>
                <input
                  type="text"
                  value={paymentReference}
                  onChange={e => setPaymentReference(e.target.value)}
                  placeholder="e.g., CHQ123456"
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                />
              </div>
            )}

            {paymentMode === 'qr' && (
              <div>
                <label className="text-sm text-gray-600 block mb-1">QR Transaction ID (Optional)</label>
                <input
                  type="text"
                  value={paymentReference}
                  onChange={e => setPaymentReference(e.target.value)}
                  placeholder="e.g., TXN123456789"
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                />
              </div>
            )}

            {paymentMode === 'credit' && (
              <div>
                <label className="text-sm text-gray-600 block mb-1">Reference/Notes (Optional)</label>
                <input
                  type="text"
                  value={paymentReference}
                  onChange={e => setPaymentReference(e.target.value)}
                  placeholder="e.g., Credit terms, account info"
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                />
              </div>
            )}

            {/* Balance Summary */}
            <div className="bg-blue-50 border border-blue-200 p-3 rounded">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Receivable (after damages):</span>
                <span className="font-medium">{formatCurrency(remainingAfterDamages)}</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Amount Received:</span>
                <span className="font-medium">{formatCurrency(amount)}</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className={balance > 0 ? 'text-orange-600' : 'text-green-600'}>
                  {balance > 0 ? 'Balance Due' : 'Overpaid'}:
                </span>
                <span className={`font-bold ${balance > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                  {formatCurrency(Math.abs(balance))}
                </span>
              </div>
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
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded disabled:opacity-50 flex items-center gap-2"
            >
              {loading && <Loader size={16} className="animate-spin" />}
              Mark Delivered
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarkDeliveredModal;
