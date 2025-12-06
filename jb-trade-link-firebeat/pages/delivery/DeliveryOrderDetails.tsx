import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Input } from '../../components/ui/Elements';
import { MapPin, Phone, CheckCircle, XCircle, ArrowLeft, Banknote, CreditCard, Clock, Package, Trash2, Plus, Minus, X, AlertCircle } from 'lucide-react';
import { OrderService, CustomerService, ProductService } from '../../services/db';
import { Order, Customer } from '../../types';
import toast from 'react-hot-toast';

interface DamageItem {
  productId: string;
  productName: string;
  quantity: number;
  reason: string;
}

interface ReturnItem {
  productId: string;
  productName: string;
  originalQty: number;
  returnQty: number;
  rate: number;
}

export const DeliveryOrderDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [order, setOrder] = useState<Order | null>(null);
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);

    // Delivery Form State
    const [paymentMode, setPaymentMode] = useState<'cash' | 'qr' | 'cheque' | 'credit'>('cash');
    const [amountCollected, setAmountCollected] = useState('');
    const [paymentReference, setPaymentReference] = useState('');
    const [remarks, setRemarks] = useState('');

    // Modals
    const [showDamageModal, setShowDamageModal] = useState(false);
    const [showReturnModal, setShowReturnModal] = useState(false);
    const [showQRModal, setShowQRModal] = useState(false);
    const [damages, setDamages] = useState<DamageItem[]>([]);
    const [returnItems, setReturnItems] = useState<ReturnItem[]>([]);

    useEffect(() => {
        const loadData = async () => {
            if (!id) return;
            try {
                const orderData = await OrderService.getById(id);
                if (orderData) {
                    setOrder(orderData);
                    setAmountCollected(orderData.totalAmount.toString());

                    if (orderData.customerId) {
                        const custData = await CustomerService.getById(orderData.customerId);
                        setCustomer(custData);
                    }
                }
            } catch (e) {
                console.error("Failed to load order", e);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [id]);

    const calculateDamageTotal = () => damages.reduce((sum, d) => {
        const item = order?.items.find(i => i.productId === d.productId);
        return sum + (item ? (item.rate * d.quantity) : 0);
    }, 0);

    const calculateReturnTotal = () => returnItems.reduce((sum, r) => sum + (r.rate * r.returnQty), 0);

    const handleMarkDelivered = async () => {
        if (!order) return;
        if (!amountCollected || parseFloat(amountCollected) < 0) {
            toast.error("Please enter a valid amount");
            return;
        }

        if (!window.confirm("Confirm delivery?")) return;

        setProcessing(true);
        try {
            let remarkText = `Payment: ${paymentMode.toUpperCase()}`;
            if (paymentReference) remarkText += ` (${paymentReference})`;
            if (remarks) remarkText += ` | ${remarks}`;
            
            if (damages.length > 0) {
                remarkText += ` | Damages: ${damages.map(d => `${d.productName}(${d.quantity}) - ${d.reason}`).join(', ')}`;
            }
            if (returnItems.length > 0) {
                remarkText += ` | Returns: ${returnItems.map(r => `${r.productName}(${r.returnQty})`).join(', ')}`;
            }

            const finalAmount = parseFloat(amountCollected) - calculateDamageTotal() - calculateReturnTotal();

            await OrderService.update(order.id, {
                status: 'delivered',
                remarks: remarkText,
                totalAmount: Math.max(0, finalAmount)
            });

            toast.success("Order marked as delivered!");
            navigate('/delivery/dashboard');
        } catch (e) {
            console.error(e);
            toast.error("Failed to update status");
        } finally {
            setProcessing(false);
        }
    };

    const handleReschedule = async () => {
        if (!order) return;
        const nextDay = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        const newDate = prompt("Enter new delivery date (YYYY-MM-DD):", nextDay);
        if (!newDate) return;

        setProcessing(true);
        try {
            await OrderService.update(order.id, {
                status: 'approved',
                assignedTripId: undefined,
                remarks: `Rescheduled to ${newDate}${remarks ? ` | ${remarks}` : ''}`
            });
            toast.success("Delivery rescheduled and order returned to dispatch pool.");
            navigate('/delivery/dashboard');
        } catch (e) {
            console.error(e);
            toast.error("Failed to reschedule");
        } finally {
            setProcessing(false);
        }
    };

    const handleMarkFailed = async () => {
        if (!order) return;
        const reason = prompt("Please enter reason for failure (e.g. Shop Closed):");
        if (!reason) return;

        setProcessing(true);
        try {
            await OrderService.update(order.id, {
                status: 'cancelled',
                assignedTripId: undefined,
                remarks: `Delivery Attempt Failed: ${reason} | ${order.remarks || ''}`
            });
            toast.success("Delivery failure recorded.");
            navigate('/delivery/dashboard');
        } catch (e) {
            console.error(e);
            toast.error("Failed to update");
        } finally {
            setProcessing(false);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading details...</div>;
    if (!order) return <div className="p-8 text-center">Order not found</div>;

    const finalAmount = parseFloat(amountCollected || '0') - calculateDamageTotal() - calculateReturnTotal();

    return (
        <div className="p-4 pb-20 max-w-2xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-2 mb-6">
                <Button variant="ghost" size="sm" onClick={() => navigate('/delivery/dashboard')}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <h1 className="text-2xl font-bold text-gray-900">Delivery</h1>
                <span className="ml-auto text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">{order.id}</span>
            </div>

            {/* Customer Info Card */}
            <Card className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm mb-4">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">{order.customerName}</h2>
                        <p className="text-sm text-gray-600 mt-1">Invoice: {order.id}</p>
                    </div>
                    <Package className="h-6 w-6 text-blue-500" />
                </div>
                
                <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-3 text-gray-700">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{customer?.locationText || customer?.routeName || 'No location'}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-700">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <a href={`tel:${customer?.phone}`} className="text-sm font-medium text-blue-600 hover:underline">
                            {customer?.phone || 'No phone'}
                        </a>
                    </div>
                </div>

                {customer?.locationText && (
                    <Button
                        variant="outline"
                        className="w-full flex items-center justify-center gap-2 text-sm"
                        onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${customer.locationText}`, '_blank')}
                    >
                        <MapPin className="h-4 w-4" /> Open in Google Maps
                    </Button>
                )}
            </Card>

            {/* Order Items Card */}
            <Card className="p-5 bg-white border border-gray-200 rounded-xl shadow-sm mb-4">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Package className="h-5 w-5 text-gray-600" />
                    Order Items ({order.totalItems})
                </h3>
                <div className="space-y-3 divide-y">
                    {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center py-2 first:pt-0 last:pb-0">
                            <div className="flex-1">
                                <p className="font-medium text-gray-900 text-sm">{item.productName}</p>
                                <p className="text-xs text-gray-600">{item.qty} × ₹{item.rate.toFixed(2)}</p>
                            </div>
                            <p className="font-semibold text-gray-900">₹{item.total.toFixed(2)}</p>
                        </div>
                    ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                    <span className="font-bold text-gray-900">Total</span>
                    <span className="text-lg font-bold text-gray-900">₹{order.totalAmount.toFixed(2)}</span>
                </div>
            </Card>

            {/* Delivery Actions Card */}
            {order.status !== 'delivered' && order.status !== 'cancelled' && (
                <Card className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl shadow-sm mb-4">
                    <h3 className="font-bold text-gray-900 mb-5">Complete Delivery</h3>

                    {/* Payment Mode */}
                    <div className="mb-5">
                        <label className="block text-sm font-semibold text-gray-900 mb-3">Payment Method</label>
                        <div className="grid grid-cols-2 gap-2">
                            {[
                                { value: 'cash', label: '💵 Cash', icon: Banknote },
                                { value: 'qr', label: '📱 QR Code', icon: CreditCard },
                                { value: 'cheque', label: '📄 Cheque', icon: CreditCard },
                                { value: 'credit', label: '💳 Credit', icon: CreditCard }
                            ].map(method => (
                                <button
                                    key={method.value}
                                    onClick={() => {
                                        setPaymentMode(method.value as any);
                                        if (method.value === 'qr') {
                                            setShowQRModal(true);
                                        }
                                    }}
                                    className={`p-3 rounded-lg font-medium text-sm transition-all ${
                                        paymentMode === method.value
                                            ? 'bg-white text-blue-700 border-2 border-blue-500 shadow-md'
                                            : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-400'
                                    }`}
                                >
                                    {method.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Amount Collected */}
                    {paymentMode !== 'credit' && (
                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-gray-900 mb-2">Amount Collected</label>
                            <input
                                type="number"
                                value={amountCollected}
                                onChange={(e) => setAmountCollected(e.target.value)}
                                placeholder="0.00"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold text-lg"
                            />
                        </div>
                    )}

                    {/* Payment Reference */}
                    {(paymentMode === 'qr' || paymentMode === 'cheque' || paymentMode === 'credit') && (
                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                                {paymentMode === 'qr' && 'QR Transaction ID'}
                                {paymentMode === 'cheque' && 'Cheque Number'}
                                {paymentMode === 'credit' && 'Reference/Notes'}
                            </label>
                            <input
                                type="text"
                                value={paymentReference}
                                onChange={(e) => setPaymentReference(e.target.value)}
                                placeholder={
                                    paymentMode === 'qr' ? 'e.g., TXN123456789'
                                    : paymentMode === 'cheque' ? 'e.g., CHQ123456'
                                    : 'e.g., Credit terms'
                                }
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                        </div>
                    )}

                    {/* Remarks */}
                    <div className="mb-5">
                        <label className="block text-sm font-semibold text-gray-900 mb-2">Remarks (Optional)</label>
                        <textarea
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                            placeholder="e.g. Left at gate, store closed..."
                            rows={2}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                        />
                    </div>

                    {/* Additional Actions */}
                    <div className="grid grid-cols-2 gap-2 mb-5">
                        <button
                            onClick={() => setShowDamageModal(true)}
                            className="p-3 rounded-lg bg-white border border-orange-200 text-orange-700 hover:bg-orange-50 font-medium text-sm transition-all flex items-center justify-center gap-2"
                        >
                            <AlertCircle className="h-4 w-4" /> Damage
                        </button>
                        <button
                            onClick={() => setShowReturnModal(true)}
                            className="p-3 rounded-lg bg-white border border-purple-200 text-purple-700 hover:bg-purple-50 font-medium text-sm transition-all flex items-center justify-center gap-2"
                        >
                            <Package className="h-4 w-4" /> Return
                        </button>
                    </div>

                    {/* Summary */}
                    {(damages.length > 0 || returnItems.length > 0) && (
                        <div className="mb-5 p-3 bg-white rounded-lg border border-gray-200">
                            {damages.length > 0 && (
                                <p className="text-sm text-orange-700 font-medium">Damage Deduction: ₹{calculateDamageTotal().toFixed(2)}</p>
                            )}
                            {returnItems.length > 0 && (
                                <p className="text-sm text-purple-700 font-medium">Return Deduction: ₹{calculateReturnTotal().toFixed(2)}</p>
                            )}
                            <p className="text-sm font-bold text-gray-900 mt-2 border-t pt-2">
                                Final Amount: ₹{Math.max(0, finalAmount).toFixed(2)}
                            </p>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={handleReschedule}
                            disabled={processing}
                            className="p-3 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium text-sm disabled:opacity-50"
                        >
                            <Clock className="h-4 w-4 inline mr-2" /> Reschedule
                        </button>
                        <button
                            onClick={handleMarkFailed}
                            disabled={processing}
                            className="p-3 rounded-lg bg-white border border-red-200 text-red-700 hover:bg-red-50 font-medium text-sm disabled:opacity-50"
                        >
                            <XCircle className="h-4 w-4 inline mr-2" /> Failed
                        </button>
                        <button
                            onClick={handleMarkDelivered}
                            disabled={processing}
                            className="col-span-2 p-4 rounded-lg bg-green-600 hover:bg-green-700 text-white font-bold flex items-center justify-center gap-2 disabled:opacity-50 transition-all shadow-lg"
                        >
                            <CheckCircle className="h-5 w-5" /> Mark Delivered
                        </button>
                    </div>
                </Card>
            )}

            {order.status === 'delivered' && (
                <Card className="p-6 bg-green-50 border border-green-200 rounded-xl text-center">
                    <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-2" />
                    <p className="text-xl font-bold text-green-800">Order Delivered ✓</p>
                </Card>
            )}

            {/* Damage Modal */}
            {showDamageModal && (
                <DamageModal
                    isOpen={showDamageModal}
                    onClose={() => setShowDamageModal(false)}
                    order={order}
                    damages={damages}
                    setDamages={setDamages}
                />
            )}

            {/* Return Modal */}
            {showReturnModal && (
                <ReturnModal
                    isOpen={showReturnModal}
                    onClose={() => setShowReturnModal(false)}
                    order={order}
                    returnItems={returnItems}
                    setReturnItems={setReturnItems}
                />
            )}

            {/* QR Code Modal */}
            <QRModal
                isOpen={showQRModal}
                onClose={() => setShowQRModal(false)}
            />

            {/* QR Modal */}
            {showQRModal && (
                <QRModal
                    isOpen={showQRModal}
                    onClose={() => setShowQRModal(false)}
                />
            )}
        </div>
    );
};

// Damage Modal Component with Enhanced Search UI
const DamageModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    order: Order;
    damages: DamageItem[];
    setDamages: (items: DamageItem[]) => void;
}> = ({ isOpen, onClose, order, damages, setDamages }) => {
    const [selectedProduct, setSelectedProduct] = useState('');
    const [quantity, setQuantity] = useState('1');
    const [reason, setReason] = useState('broken');
    const [otherReason, setOtherReason] = useState('');
    const [allProducts, setAllProducts] = useState<any[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
    const [loadingProducts, setLoadingProducts] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);

    // Damage reason options with emojis
    const damageReasons = [
        { value: 'broken', label: '🔨 Broken', emoji: '🔨' },
        { value: 'expired', label: '📅 Expired', emoji: '📅' },
        { value: 'spoiled', label: '🤢 Spoiled', emoji: '🤢' },
        { value: 'leaking', label: '💧 Leaking', emoji: '💧' },
        { value: 'wrong_item', label: '❌ Wrong Item', emoji: '❌' },
        { value: 'other', label: '📝 Other (specify)', emoji: '📝' }
    ];

    // Load all products when modal opens
    useEffect(() => {
        if (isOpen) {
            loadAllProducts();
        }
    }, [isOpen]);

    // Filter products based on search term
    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredProducts([]);
            setShowDropdown(false);
        } else {
            const filtered = allProducts.filter(p => 
                (p.name || p.productName || '').toLowerCase().includes(searchTerm.toLowerCase())
            ).slice(0, 10); // Limit to 10 results
            setFilteredProducts(filtered);
            setShowDropdown(filtered.length > 0);
        }
    }, [searchTerm, allProducts]);

    const loadAllProducts = async () => {
        try {
            setLoadingProducts(true);
            const products = await ProductService.getAll();
            setAllProducts(products || []);
        } catch (e) {
            console.error('Failed to load products', e);
            toast.error('Failed to load products');
        } finally {
            setLoadingProducts(false);
        }
    };

    if (!isOpen) return null;

    const selectedProductData = allProducts.find(p => p.id === selectedProduct);
    const reasonLabel = damageReasons.find(r => r.value === reason);

    const handleSelectProduct = (product: any) => {
        setSelectedProduct(product.id);
        setSearchTerm(product.name || product.productName || '');
        setShowDropdown(false);
    };

    const handleAddDamage = () => {
        if (!selectedProduct || !quantity) {
            toast.error('Please select product and quantity');
            return;
        }

        if (reason === 'other' && !otherReason.trim()) {
            toast.error('Please enter reason for damage');
            return;
        }

        const product = allProducts.find(p => p.id === selectedProduct);
        if (!product) return;

        const damageReason = reason === 'other' ? otherReason : reasonLabel?.label || reason;

        const newDamage: DamageItem = {
            productId: selectedProduct,
            productName: product.name || product.productName || 'Unknown Product',
            quantity: parseInt(quantity),
            reason: damageReason
        };

        const existing = damages.findIndex(d => d.productId === selectedProduct && d.reason === damageReason);
        if (existing >= 0) {
            const updated = [...damages];
            updated[existing].quantity += parseInt(quantity);
            setDamages(updated);
        } else {
            setDamages([...damages, newDamage]);
        }

        // Reset form
        setSelectedProduct('');
        setQuantity('1');
        setReason('broken');
        setOtherReason('');
        setSearchTerm('');
        toast.success('Damage recorded ✓');
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center z-50">
            <div className="bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl shadow-xl p-6 animate-in slide-in-from-bottom sm:scale-in max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6 sticky top-0 bg-white">
                    <h2 className="text-xl font-bold text-gray-900">Record Damage</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <div className="space-y-4 mb-6">
                    {/* Product Search with Autocomplete */}
                    <div className="relative">
                        <label className="block text-sm font-semibold text-gray-900 mb-2">Product</label>
                        <div className="relative">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    if (e.target.value === '') {
                                        setSelectedProduct('');
                                    }
                                }}
                                onFocus={() => searchTerm && setShowDropdown(filteredProducts.length > 0)}
                                placeholder={loadingProducts ? 'Loading products...' : 'Search products...'}
                                disabled={loadingProducts}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50 transition-all"
                            />
                            {selectedProduct && (
                                <button
                                    onClick={() => {
                                        setSelectedProduct('');
                                        setSearchTerm('');
                                    }}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>

                        {/* Dropdown Results */}
                        {showDropdown && filteredProducts.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-48 overflow-y-auto">
                                {filteredProducts.map(product => (
                                    <button
                                        key={product.id}
                                        onClick={() => handleSelectProduct(product)}
                                        className={`w-full text-left px-4 py-3 hover:bg-orange-50 border-b border-gray-100 last:border-b-0 transition-colors ${
                                            selectedProduct === product.id ? 'bg-orange-100 font-medium' : ''
                                        }`}
                                    >
                                        <div className="font-medium text-gray-900">{product.name || product.productName}</div>
                                        <div className="text-xs text-gray-600">SKU: {product.sku || 'N/A'}</div>
                                    </button>
                                ))}
                            </div>
                        )}

                        {searchTerm && !showDropdown && filteredProducts.length === 0 && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 p-3 text-center">
                                <p className="text-sm text-gray-600">No products found</p>
                            </div>
                        )}

                        <p className="text-xs text-gray-600 mt-2">
                            📦 Search from 500+ products in catalog (not limited to invoice items)
                        </p>
                    </div>

                    {/* Damage Reason with Emoji Grid */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-3">Damage Reason</label>
                        <div className="grid grid-cols-2 gap-2">
                            {damageReasons.map(dmgReason => (
                                <button
                                    key={dmgReason.value}
                                    onClick={() => {
                                        setReason(dmgReason.value);
                                        if (dmgReason.value !== 'other') {
                                            setOtherReason('');
                                        }
                                    }}
                                    className={`p-3 rounded-lg text-sm font-medium transition-all border-2 ${
                                        reason === dmgReason.value
                                            ? 'bg-orange-100 border-orange-500 text-orange-700'
                                            : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    {dmgReason.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Other Reason Text Input */}
                    {reason === 'other' && (
                        <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                            <label className="block text-sm font-semibold text-gray-900 mb-2">Specify Damage Reason</label>
                            <input
                                type="text"
                                value={otherReason}
                                onChange={(e) => setOtherReason(e.target.value)}
                                placeholder="e.g., Water damage, Dent, Sticker issue..."
                                maxLength={100}
                                className="w-full px-4 py-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                            />
                            <p className="text-xs text-gray-600 mt-1">{otherReason.length}/100 characters</p>
                        </div>
                    )}

                    {/* Quantity */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">Quantity Damaged</label>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setQuantity(Math.max(1, parseInt(quantity) - 1).toString())}
                                className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-all"
                            >
                                <Minus className="h-4 w-4 text-gray-700" />
                            </button>
                            <input
                                type="number"
                                min="1"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-center font-semibold"
                            />
                            <button
                                onClick={() => setQuantity((parseInt(quantity) + 1).toString())}
                                className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-all"
                            >
                                <Plus className="h-4 w-4 text-gray-700" />
                            </button>
                        </div>
                    </div>

                    <button
                        onClick={handleAddDamage}
                        disabled={!selectedProduct}
                        className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition-all shadow-md"
                    >
                        <Plus className="h-4 w-4" /> Add Damage Record
                    </button>
                </div>

                {/* Recorded Damages List */}
                {damages.length > 0 && (
                    <div className="border-t pt-6">
                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <AlertCircle className="h-5 w-5 text-orange-600" />
                            Recorded Damages ({damages.length})
                        </h3>
                        <div className="space-y-2">
                            {damages.map((damage, idx) => (
                                <div key={idx} className="flex items-start justify-between bg-orange-50 p-4 rounded-lg border border-orange-200 hover:border-orange-300 transition-all">
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900">{damage.productName}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="inline-block px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded">
                                                {damage.quantity} unit{damage.quantity !== 1 ? 's' : ''}
                                            </span>
                                            <span className="text-sm text-gray-700">{damage.reason}</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setDamages(damages.filter((_, i) => i !== idx))}
                                        className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-all"
                                        title="Remove damage record"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <button
                    onClick={onClose}
                    className="w-full mt-6 bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium py-2 rounded-lg transition-all"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

// Return Modal Component with Enhanced UX
const ReturnModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    order: Order;
    returnItems: ReturnItem[];
    setReturnItems: (items: ReturnItem[]) => void;
}> = ({ isOpen, onClose, order, returnItems, setReturnItems }) => {
    const [selectedProduct, setSelectedProduct] = useState('');
    const [returnQty, setReturnQty] = useState('1');

    if (!isOpen) return null;

    const selectedOrderItem = order.items.find(i => i.productId === selectedProduct);
    const maxReturnQty = selectedOrderItem?.qty || 0;
    const returnQtyNum = parseInt(returnQty) || 0;
    const isReturnQtyValid = returnQtyNum > 0 && returnQtyNum <= maxReturnQty;

    const handleAddReturn = () => {
        if (!selectedProduct || !returnQty) {
            toast.error('Please select product and quantity');
            return;
        }

        const product = order.items.find(i => i.productId === selectedProduct);
        if (!product) return;

        // Validate return quantity doesn't exceed invoice quantity
        const returnQtyNum = parseInt(returnQty);
        if (returnQtyNum <= 0 || returnQtyNum > product.qty) {
            toast.error(`Return quantity must be between 1 and ${product.qty} (available in invoice)`);
            return;
        }

        // Check if already returning this product
        const existing = returnItems.findIndex(r => r.productId === selectedProduct);
        const currentReturnQty = existing >= 0 ? returnItems[existing].returnQty : 0;
        
        if (currentReturnQty + returnQtyNum > product.qty) {
            toast.error(`Total return quantity cannot exceed ${product.qty}. Currently returning: ${currentReturnQty}, Trying to add: ${returnQtyNum}`);
            return;
        }

        const newReturn: ReturnItem = {
            productId: selectedProduct,
            productName: product.productName,
            originalQty: product.qty,
            returnQty: returnQtyNum,
            rate: product.rate
        };

        if (existing >= 0) {
            const updated = [...returnItems];
            updated[existing].returnQty += returnQtyNum;
            setReturnItems(updated);
        } else {
            setReturnItems([...returnItems, newReturn]);
        }

        setSelectedProduct('');
        setReturnQty('1');
        toast.success('Return item added ✓');
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center z-50">
            <div className="bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl shadow-xl p-6 animate-in slide-in-from-bottom sm:scale-in max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6 sticky top-0 bg-white">
                    <h2 className="text-xl font-bold text-gray-900">Sales Return</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <div className="space-y-4 mb-6">
                    {/* Product Selection */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-3">Select Product</label>
                        <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
                            {order.items.length > 0 ? (
                                order.items.map(item => {
                                    const alreadyReturning = returnItems.find(r => r.productId === item.productId);
                                    const remainingQty = item.qty - (alreadyReturning?.returnQty || 0);
                                    const isSelected = selectedProduct === item.productId;
                                    
                                    return (
                                        <button
                                            key={item.productId}
                                            onClick={() => {
                                                setSelectedProduct(item.productId);
                                                setReturnQty('1');
                                            }}
                                            className={`text-left p-3 rounded-lg border-2 transition-all ${
                                                isSelected
                                                    ? 'bg-purple-50 border-purple-500'
                                                    : 'bg-gray-50 border-gray-200 hover:border-purple-300'
                                            }`}
                                        >
                                            <div className="font-medium text-gray-900">{item.productName}</div>
                                            <div className="text-xs text-gray-600 mt-1 space-y-0.5">
                                                <p>💰 Rate: ₹{item.rate.toFixed(2)}</p>
                                                <p>📦 Ordered: {item.qty} unit{item.qty !== 1 ? 's' : ''}</p>
                                                <p className={remainingQty === 0 ? 'text-red-600 font-medium' : 'text-green-600 font-medium'}>
                                                    ✅ Available: {remainingQty} unit{remainingQty !== 1 ? 's' : ''}
                                                </p>
                                            </div>
                                        </button>
                                    );
                                })
                            ) : (
                                <div className="text-center py-6 text-gray-600">
                                    <p className="text-sm">No items in this order</p>
                                </div>
                            )}
                        </div>
                        <p className="text-xs text-gray-600 mt-2">💡 Returns are limited to items in this invoice</p>
                    </div>

                    {/* Quantity Selection */}
                    {selectedOrderItem && (
                        <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                            <label className="block text-sm font-semibold text-gray-900 mb-3">
                                Quantity to Return
                            </label>
                            <div className="flex items-center gap-3 mb-4">
                                <button
                                    onClick={() => setReturnQty(Math.max(1, returnQtyNum - 1).toString())}
                                    className="p-2 rounded-lg bg-purple-200 hover:bg-purple-300 transition-all disabled:opacity-50"
                                    disabled={returnQtyNum <= 1}
                                >
                                    <Minus className="h-4 w-4 text-purple-700" />
                                </button>
                                <input
                                    type="number"
                                    min="1"
                                    max={maxReturnQty}
                                    value={returnQty}
                                    onChange={(e) => setReturnQty(e.target.value)}
                                    className={`flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 text-center font-bold text-lg ${
                                        selectedProduct && !isReturnQtyValid
                                            ? 'border-red-500 focus:ring-red-500 bg-red-50'
                                            : 'border-purple-300 focus:ring-purple-500 bg-white'
                                    }`}
                                />
                                <button
                                    onClick={() => setReturnQty(Math.min(maxReturnQty, returnQtyNum + 1).toString())}
                                    className="p-2 rounded-lg bg-purple-200 hover:bg-purple-300 transition-all disabled:opacity-50"
                                    disabled={returnQtyNum >= maxReturnQty}
                                >
                                    <Plus className="h-4 w-4 text-purple-700" />
                                </button>
                            </div>

                            {/* Validation Feedback */}
                            {selectedProduct && returnQtyNum > 0 && (
                                <div className="space-y-2">
                                    {!isReturnQtyValid ? (
                                        <div className="p-2 bg-red-50 rounded border border-red-200">
                                            <p className="text-xs text-red-700 font-medium">
                                                ❌ Return quantity must be 1 to {maxReturnQty}
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="p-2 bg-green-50 rounded border border-green-200">
                                            <p className="text-xs text-green-700 font-medium">
                                                ✅ Valid return: {returnQtyNum} × ₹{selectedOrderItem.rate.toFixed(2)} = ₹{(returnQtyNum * selectedOrderItem.rate).toFixed(2)}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    <button
                        onClick={handleAddReturn}
                        disabled={!selectedProduct || !isReturnQtyValid}
                        className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all shadow-md"
                    >
                        <Plus className="h-4 w-4" /> Add Item to Return
                    </button>
                </div>

                {/* Return Items List */}
                {returnItems.length > 0 && (
                    <div className="border-t pt-6">
                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Package className="h-5 w-5 text-purple-600" />
                            Return Items ({returnItems.length})
                        </h3>
                        <div className="space-y-3">
                            {returnItems.map((item, idx) => (
                                <div key={idx} className="p-4 bg-purple-50 rounded-lg border border-purple-200 hover:border-purple-300 transition-all">
                                    <div className="flex items-start justify-between mb-2">
                                        <p className="font-medium text-gray-900">{item.productName}</p>
                                        <button
                                            onClick={() => setReturnItems(returnItems.filter((_, i) => i !== idx))}
                                            className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1.5 rounded transition-all"
                                            title="Remove return"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                    <div className="text-sm text-gray-700 space-y-1">
                                        <p className="flex justify-between">
                                            <span className="text-gray-600">Return Qty:</span>
                                            <span className="font-semibold text-purple-700">{item.returnQty} / {item.originalQty}</span>
                                        </p>
                                        <p className="flex justify-between">
                                            <span className="text-gray-600">Rate:</span>
                                            <span className="font-semibold">₹{item.rate.toFixed(2)}</span>
                                        </p>
                                        <div className="pt-2 border-t border-purple-300 flex justify-between font-bold text-purple-700">
                                            <span>Return Value:</span>
                                            <span>₹{(item.returnQty * item.rate).toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <button
                    onClick={onClose}
                    className="w-full mt-6 bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium py-2 rounded-lg transition-all"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

// QR Code Modal Component
const QRModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
}> = ({ isOpen, onClose }) => {
    const qrUrl = 'https://qlosefnvwvmqeebfqdcg.supabase.co/storage/v1/object/sign/general/J.B.%20TRADE%20LINK%20PVT.%20LTD._Qr_4.39_5.98.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV82NDM0ODZmYS1kOTZkLTQyMzItYThiYi1iZDZkZGYzMTI5N2IiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJnZW5lcmFsL0ouQi4gVFJBREUgTElOSyBQVlQuIExURC5fUXJfNC4zOV81Ljk4LmpwZyIsImlhdCI6MTc2NTAwMDMyNiwiZXhwIjoyMDgwMzYwMzI2fQ.MlJlzvzw15nYuVDeg_--jHnO7fjEo4b2vJUt6ccIeWQ';

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-sm w-full overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <CreditCard className="h-5 w-5" />
                        QR Payment Code
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-white hover:bg-white hover:bg-opacity-20 p-1.5 rounded-lg transition-all"
                        title="Close"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col items-center">
                    {/* QR Code Image */}
                    <div className="bg-gray-100 p-4 rounded-lg mb-4 border-2 border-gray-200">
                        <img 
                            src={qrUrl}
                            alt="QR Payment Code"
                            className="w-64 h-64 object-cover rounded-lg"
                        />
                    </div>

                    {/* Instructions */}
                    <div className="w-full space-y-3 text-center mb-6">
                        <p className="text-gray-900 font-semibold text-lg">Scan to Pay</p>
                        <p className="text-gray-600 text-sm">
                            Customer can scan this QR code with any UPI app to make payment
                        </p>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <p className="text-xs text-blue-900 font-medium">
                                💡 Tip: You can screenshot this QR code or show it on your device
                            </p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="w-full grid grid-cols-2 gap-3">
                        <button
                            onClick={() => {
                                // Open QR in new tab for fullscreen view
                                window.open(qrUrl, '_blank');
                            }}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all flex items-center justify-center gap-2"
                        >
                            Open Fullscreen
                        </button>
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium rounded-lg transition-all"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
