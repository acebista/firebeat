import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Input } from '../../components/ui/Elements';
import { MapPin, Phone, CheckCircle, XCircle, ArrowLeft, Banknote, CreditCard, Clock, Package, Trash2, Plus, Minus, X, AlertCircle } from 'lucide-react';
import { OrderService, CustomerService, ProductService, TripService } from '../../services/db';
import { PaymentsService } from '../../services/ledger';
import { Order, Customer, DispatchTrip } from '../../types';
import { supabase } from '../../lib/supabase';
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

interface PaymentEntry {
    method: 'cash' | 'qr' | 'cheque' | 'credit';
    amount: number;
    reference?: string;
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
    const [paymentEntries, setPaymentEntries] = useState<PaymentEntry[]>([]);
    const [isEditing, setIsEditing] = useState(false); // For editing already delivered orders

    useEffect(() => {
        const loadData = async () => {
            if (!id) return;
            try {
                const orderData = await OrderService.getById(id);
                if (orderData) {
                    // Handle potential string format for items
                    let parsedItems = orderData.items;
                    if (typeof parsedItems === 'string') {
                        try {
                            parsedItems = JSON.parse(parsedItems);
                        } catch (e) {
                            console.error('Failed to parse order items', e);
                            parsedItems = [];
                        }
                    }

                    // Normalize items to ensure strict types and prevent crashes
                    if (Array.isArray(parsedItems)) {
                        let normalizedItems = parsedItems.map((item: any) => ({
                            ...item,
                            productId: item.productId || item.product_id || item.id || '',
                            productName: item.productName || item.product_name || item.name || 'Unknown Item',
                            qty: Number(item.qty || item.quantity || 0),
                            rate: Number(item.rate || item.price || item.unit_price || 0),
                            total: Number(item.total || item.amount || 0)
                        }));

                        // Enrichment: Fetch product names if missing and ID exists
                        const hasUnknown = normalizedItems.some((i: any) => i.productName === 'Unknown Item' && i.productId);
                        if (hasUnknown) {
                            try {
                                const allProducts = await ProductService.getAll();
                                const productMap = new Map(allProducts.map((p: any) => [p.id, p.name || p.productName]));

                                normalizedItems = normalizedItems.map((item: any) => {
                                    if (item.productName === 'Unknown Item' && item.productId) {
                                        const foundName = productMap.get(item.productId);
                                        if (foundName) {
                                            item.productName = foundName;
                                        } else {
                                            item.productName = `Unknown (ID: ${item.productId})`;
                                        }
                                    } else if (item.productName === 'Unknown Item' && !item.productId) {
                                        item.productName = 'Unknown (No ID)';
                                    }
                                    return item;
                                });
                            } catch (e) {
                                console.error("Enrichment failed", e);
                            }
                        }
                        orderData.items = normalizedItems;
                    } else {
                        orderData.items = [];
                    }
                    setOrder(orderData);
                    setAmountCollected(orderData.totalAmount.toString());

                    // Initialize payment entries based on order status
                    const existingPaymentMethod = (orderData as any).payment_method_at_delivery || (orderData as any).paymentMode || 'cash';
                    const existingPaymentAmount = (orderData as any).payment_collected !== undefined
                        ? Number((orderData as any).payment_collected)
                        : orderData.totalAmount;

                    setPaymentEntries([{
                        method: existingPaymentMethod as any,
                        amount: existingPaymentAmount
                    }]);

                    // Initialize remarks from existing order remarks for edit mode
                    if (orderData.remarks) {
                        setRemarks(''); // Start fresh in edit, but show existing in display
                    }

                    // Fetch customer details
                    if (orderData.customerId) {
                        const custData = await CustomerService.getById(orderData.customerId);
                        if (custData) setCustomer(custData);
                    }
                }
            } catch (error) {
                console.error("Failed to load order", error);
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

    const addPaymentEntry = () => {
        const remaining = (order?.totalAmount || 0) - calculateDamageTotal() - calculateReturnTotal() - paymentEntries.reduce((s, p) => s + p.amount, 0);
        setPaymentEntries([...paymentEntries, { method: 'cash', amount: Math.max(0, remaining) }]);
    };

    const removePaymentEntry = (index: number) => {
        setPaymentEntries(paymentEntries.filter((_, i) => i !== index));
    };

    const updatePaymentEntry = (index: number, field: keyof PaymentEntry, value: any) => {
        const newEntries = [...paymentEntries];
        newEntries[index] = { ...newEntries[index], [field]: value };
        setPaymentEntries(newEntries);
    };

    const handleMarkDelivered = async () => {
        if (!order) return;

        const totalCollected = paymentEntries.reduce((sum, p) => sum + (p.method !== 'credit' ? Number(p.amount) : 0), 0);
        const netTotal = order.totalAmount - calculateDamageTotal() - calculateReturnTotal();

        if (paymentEntries.some(p => p.amount < 0)) {
            toast.error("Payment amounts cannot be negative");
            return;
        }

        if (!window.confirm("Confirm delivery and payment recording?")) return;

        setProcessing(true);
        try {
            // Get current user for delivered_by tracking
            const { data: { session } } = await supabase.auth.getSession();
            const userId = session?.user?.id;

            // Build remarks
            let remarkText = `Payments: ${paymentEntries.map(p => `${p.method.toUpperCase()}: ₹${p.amount}${p.reference ? ` (${p.reference})` : ''}`).join(', ')}`;
            if (remarks) remarkText += ` | ${remarks}`;

            if (damages.length > 0) {
                remarkText += ` | Damages: ${damages.map(d => `${d.productName}(${d.quantity}) - ${d.reason}`).join(', ')}`;
            }
            if (returnItems.length > 0) {
                remarkText += ` | Returns: ${returnItems.map(r => `${r.productName}(${r.returnQty})`).join(', ')}`;
            }

            // Update order with delivery info
            const mainPaymentMethod = paymentEntries.length === 1 ? paymentEntries[0].method : 'Multiple';

            await OrderService.update(order.id, {
                status: 'delivered',
                remarks: remarkText,
                totalAmount: Math.max(0, netTotal),
                delivered_at: new Date().toISOString(),
                delivered_by: userId || null,
                payment_collected: totalCollected,
                payment_method_at_delivery: mainPaymentMethod as any
            } as any);

            // Create individual payment records in ledger
            for (const entry of paymentEntries) {
                if (entry.amount > 0 && entry.method !== 'credit' && order.customerId) {
                    try {
                        await PaymentsService.addPayment({
                            invoiceId: order.id,
                            customerId: order.customerId,
                            amount: entry.amount,
                            method: entry.method,
                            reference: entry.reference || undefined,
                            notes: `Delivery payment (${entry.method})`
                        });
                    } catch (paymentError) {
                        console.error('Failed to create payment record', paymentError);
                    }
                }
            }

            // Trip completion logic
            if (order.assignedTripId) {
                try {
                    const trip = await TripService.getById(order.assignedTripId);
                    if (trip && trip.orderIds) {
                        const tripOrders = await OrderService.getOrdersByIds(trip.orderIds);
                        const deliveredCount = tripOrders.filter(o => o.id === order.id || o.status === 'delivered').length;
                        if (deliveredCount >= trip.orderIds.length) {
                            await TripService.update(trip.id, { status: 'completed' });
                        }
                    }
                } catch (tripError) {
                    console.error('Failed to update trip status', tripError);
                }
            }

            toast.success("Order marked as delivered!");
            navigate('/delivery/dashboard');
        } catch (e) {
            console.error(e);
            toast.error("Failed to update status");
        } finally {
            setProcessing(false);
        }
    };

    // Handler for updating already delivered orders
    const handleUpdateDelivery = async () => {
        if (!order) return;

        const totalCollected = paymentEntries.reduce((sum, p) => sum + (p.method !== 'credit' ? Number(p.amount) : 0), 0);

        if (!window.confirm("Are you sure you want to update this delivery record?")) return;

        setProcessing(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const userId = session?.user?.id;

            // Build updated remarks
            let remarkText = `[EDITED] Payments: ${paymentEntries.map(p => `${p.method.toUpperCase()}: ₹${p.amount}${p.reference ? ` (${p.reference})` : ''}`).join(', ')}`;
            if (remarks) remarkText += ` | ${remarks}`;

            const mainPaymentMethod = paymentEntries.length === 1 ? paymentEntries[0].method : 'Multiple';

            // Update order record
            await OrderService.update(order.id, {
                remarks: remarkText,
                payment_collected: totalCollected,
                payment_method_at_delivery: mainPaymentMethod as any
            } as any);

            // Note: We don't create new payment records here to avoid duplicates
            // Payment corrections should be handled through the admin ledger module

            toast.success("Delivery record updated successfully!");
            setIsEditing(false);

            // Refresh order data
            const updatedOrder = await OrderService.getById(order.id);
            if (updatedOrder) {
                setOrder(updatedOrder);
            }
        } catch (e) {
            console.error(e);
            toast.error("Failed to update delivery record");
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
                date: newDate, // CRITICAL: Move order to the new date
                assignedTripId: undefined,
                remarks: `Rescheduled to ${newDate}${remarks ? ` | ${remarks}` : ''}`
            });
            toast.success(`Delivery rescheduled to ${newDate} and order returned to dispatch pool.`);
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
                    Order Items ({order.totalItems || 0})
                </h3>
                <div className="space-y-3 divide-y">
                    {(order.items || []).map((item: any, idx) => (
                        <div key={idx} className="flex justify-between items-center py-2 first:pt-0 last:pb-0">
                            <div className="flex-1">
                                <p className="font-medium text-gray-900 text-sm">{item.productName || item.product_name || 'Unknown Item'}</p>
                                <p className="text-xs text-gray-600">
                                    {item.qty || item.quantity || 0} × ₹{(Number(item.rate) || 0).toFixed(2)}
                                </p>
                            </div>
                            <p className="font-semibold text-gray-900">₹{(Number(item.total) || 0).toFixed(2)}</p>
                        </div>
                    ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                    <span className="font-bold text-gray-900">Total</span>
                    <span className="text-lg font-bold text-gray-900">₹{(Number(order.totalAmount) || 0).toFixed(2)}</span>
                </div>
            </Card>

            {/* Delivery Actions Card */}
            {order.status !== 'delivered' && order.status !== 'cancelled' && (
                <Card className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl shadow-sm mb-4">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center justify-between">
                        <span>Complete Delivery</span>
                        <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded">₹{Math.max(0, order.totalAmount - calculateDamageTotal() - calculateReturnTotal()).toFixed(2)} Due</span>
                    </h3>

                    {/* Multi-Payment Section */}
                    <div className="space-y-4 mb-6">
                        <label className="block text-sm font-semibold text-gray-900">Payment Breakdown</label>
                        {paymentEntries.map((entry, idx) => (
                            <div key={idx} className="bg-white p-3 rounded-lg border border-gray-200 space-y-3 shadow-sm">
                                <div className="flex items-center justify-between gap-2">
                                    <div className="flex-1 grid grid-cols-2 gap-2">
                                        <select
                                            value={entry.method}
                                            onChange={(e) => updatePaymentEntry(idx, 'method', e.target.value)}
                                            className="px-2 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="cash">💵 Cash</option>
                                            <option value="qr">📱 QR Code</option>
                                            <option value="cheque">📄 Cheque</option>
                                            <option value="credit">💳 Credit</option>
                                        </select>
                                        <input
                                            type="number"
                                            value={entry.amount}
                                            onChange={(e) => updatePaymentEntry(idx, 'amount', parseFloat(e.target.value) || 0)}
                                            placeholder="Amount"
                                            className="px-2 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 font-semibold"
                                        />
                                    </div>
                                    <button
                                        onClick={() => removePaymentEntry(idx)}
                                        className="text-red-500 p-1 hover:bg-red-50 rounded"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                                {entry.method !== 'cash' && (
                                    <input
                                        type="text"
                                        value={entry.reference || ''}
                                        onChange={(e) => updatePaymentEntry(idx, 'reference', e.target.value)}
                                        placeholder={entry.method === 'qr' ? 'Transaction ID' : entry.method === 'cheque' ? 'Cheque Numbers' : 'Notes'}
                                        className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded"
                                    />
                                )}
                            </div>
                        ))}
                        <Button
                            variant="outline"
                            size="sm"
                            className="w-full py-2 bg-white flex items-center justify-center gap-2 border-dashed border-2 hover:border-indigo-500 hover:text-indigo-600 border-indigo-200 text-indigo-500"
                            onClick={addPaymentEntry}
                        >
                            <Plus className="h-4 w-4" /> Add Payment Row
                        </Button>
                    </div>

                    {/* Summary Calculations */}
                    <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200 shadow-inner">
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between text-gray-600">
                                <span>Order Net Total:</span>
                                <span>₹{(order.totalAmount - calculateDamageTotal() - calculateReturnTotal()).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-emerald-600 font-bold">
                                <span>Total Collected:</span>
                                <span>₹{paymentEntries.reduce((s, p) => s + (p.method !== 'credit' ? (Number(p.amount) || 0) : 0), 0).toFixed(2)}</span>
                            </div>
                            {paymentEntries.some(p => p.method === 'credit') && (
                                <div className="flex justify-between text-amber-600 font-bold">
                                    <span>Credit Recorded:</span>
                                    <span>₹{paymentEntries.reduce((s, p) => s + (p.method === 'credit' ? (Number(p.amount) || 0) : 0), 0).toFixed(2)}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Remarks Area */}
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-900 mb-2">Delivery Remarks</label>
                        <textarea
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                            placeholder="Store was busy, left with security, etc."
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Additional Actions (Damage/Return) */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                        <button
                            onClick={() => setShowDamageModal(true)}
                            className="p-3 rounded-lg bg-white border border-orange-200 text-orange-700 hover:bg-orange-50 font-bold text-sm flex items-center justify-center gap-2 shadow-sm"
                        >
                            <AlertCircle className="h-4 w-4" /> Record Damage
                        </button>
                        <button
                            onClick={() => setShowReturnModal(true)}
                            className="p-3 rounded-lg bg-white border border-purple-200 text-purple-700 hover:bg-purple-50 font-bold text-sm flex items-center justify-center gap-2 shadow-sm"
                        >
                            <Package className="h-4 w-4" /> Record Return
                        </button>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={handleReschedule}
                                disabled={processing}
                                className="p-3 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-bold text-sm shadow-sm"
                            >
                                <Clock className="h-4 w-4 inline mr-2" /> Reschedule
                            </button>
                            <button
                                onClick={handleMarkFailed}
                                disabled={processing}
                                className="p-3 rounded-lg bg-white border border-red-200 text-red-700 hover:bg-red-50 font-bold text-sm shadow-sm"
                            >
                                <XCircle className="h-4 w-4 inline mr-2" /> Mark Failed
                            </button>
                        </div>
                        <button
                            onClick={handleMarkDelivered}
                            disabled={processing}
                            className="w-full p-4 rounded-xl bg-green-600 hover:bg-green-700 text-white font-black text-lg flex items-center justify-center gap-3 transition-all shadow-xl hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                        >
                            <CheckCircle className="h-6 w-6" /> COMPLETE DELIVERY
                        </button>
                    </div>
                </Card>
            )}

            {(order.status === 'delivered' || order.status === 'completed') && !isEditing && (
                <Card className="p-6 bg-green-50 border border-green-200 rounded-xl">
                    <div className="text-center mb-4">
                        <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-2" />
                        <p className="text-xl font-bold text-green-800">Order Delivered ✓</p>
                    </div>

                    {/* Show delivery details */}
                    <div className="bg-white p-4 rounded-lg border border-green-100 mb-4 text-sm space-y-2">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Payment Method:</span>
                            <span className="font-semibold">{(order as any).payment_method_at_delivery || order.paymentMode || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Amount Collected:</span>
                            <span className="font-semibold text-emerald-600">₹{((order as any).payment_collected || order.totalAmount || 0).toLocaleString()}</span>
                        </div>
                        {(order as any).delivered_at && (
                            <div className="flex justify-between">
                                <span className="text-gray-600">Delivered At:</span>
                                <span className="font-semibold">{new Date((order as any).delivered_at).toLocaleString()}</span>
                            </div>
                        )}
                        {order.remarks && (
                            <div className="pt-2 border-t border-gray-100">
                                <span className="text-gray-600">Remarks:</span>
                                <p className="text-gray-800 mt-1">{order.remarks}</p>
                            </div>
                        )}
                    </div>

                    <Button
                        variant="outline"
                        className="w-full border-2 border-amber-400 text-amber-700 hover:bg-amber-50 font-bold"
                        onClick={() => setIsEditing(true)}
                    >
                        ✏️ Edit Delivery Details
                    </Button>
                </Card>
            )}

            {/* Edit Mode for Delivered Orders */}
            {(order.status === 'delivered' || order.status === 'completed') && isEditing && (
                <Card className="p-5 bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 rounded-xl shadow-sm mb-4">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center justify-between">
                        <span>✏️ Edit Delivery Details</span>
                        <button
                            onClick={() => setIsEditing(false)}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </h3>

                    {/* Multi-Payment Section */}
                    <div className="space-y-4 mb-6">
                        <label className="block text-sm font-semibold text-gray-900">Payment Breakdown</label>
                        {paymentEntries.map((entry, idx) => (
                            <div key={idx} className="bg-white p-3 rounded-lg border border-gray-200 space-y-3 shadow-sm">
                                <div className="flex items-center justify-between gap-2">
                                    <div className="flex-1 grid grid-cols-2 gap-2">
                                        <select
                                            value={entry.method}
                                            onChange={(e) => updatePaymentEntry(idx, 'method', e.target.value)}
                                            className="px-2 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-amber-500"
                                        >
                                            <option value="cash">💵 Cash</option>
                                            <option value="qr">📱 QR Code</option>
                                            <option value="cheque">📄 Cheque</option>
                                            <option value="credit">💳 Credit</option>
                                        </select>
                                        <input
                                            type="number"
                                            value={entry.amount}
                                            onChange={(e) => updatePaymentEntry(idx, 'amount', parseFloat(e.target.value) || 0)}
                                            placeholder="Amount"
                                            className="px-2 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-amber-500 font-semibold"
                                        />
                                    </div>
                                    <button
                                        onClick={() => removePaymentEntry(idx)}
                                        className="text-red-500 p-1 hover:bg-red-50 rounded"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                                {entry.method !== 'cash' && (
                                    <input
                                        type="text"
                                        value={entry.reference || ''}
                                        onChange={(e) => updatePaymentEntry(idx, 'reference', e.target.value)}
                                        placeholder={entry.method === 'qr' ? 'Transaction ID' : entry.method === 'cheque' ? 'Cheque Number' : 'Notes'}
                                        className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded"
                                    />
                                )}
                            </div>
                        ))}
                        <Button
                            variant="outline"
                            size="sm"
                            className="w-full py-2 bg-white flex items-center justify-center gap-2 border-dashed border-2 hover:border-amber-500 hover:text-amber-600 border-amber-200 text-amber-500"
                            onClick={addPaymentEntry}
                        >
                            <Plus className="h-4 w-4" /> Add Payment Row
                        </Button>
                    </div>

                    {/* Summary */}
                    <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200">
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between text-emerald-600 font-bold">
                                <span>Total Collected:</span>
                                <span>₹{paymentEntries.reduce((s, p) => s + (p.method !== 'credit' ? (Number(p.amount) || 0) : 0), 0).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Remarks */}
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-900 mb-2">Updated Remarks</label>
                        <textarea
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                            placeholder="Update delivery notes..."
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500"
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => setIsEditing(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            className="flex-1 bg-amber-600 hover:bg-amber-700"
                            disabled={processing}
                            onClick={handleUpdateDelivery}
                        >
                            {processing ? 'Saving...' : '💾 Save Changes'}
                        </Button>
                    </div>
                </Card>
            )}

            {/* Cancelled/Failed Order Display */}
            {order.status === 'cancelled' && !isEditing && (
                <Card className="p-6 bg-red-50 border border-red-200 rounded-xl">
                    <div className="text-center mb-4">
                        <XCircle className="h-12 w-12 text-red-600 mx-auto mb-2" />
                        <p className="text-xl font-bold text-red-800">Delivery Failed ✗</p>
                    </div>

                    {/* Show failure details */}
                    <div className="bg-white p-4 rounded-lg border border-red-100 mb-4 text-sm space-y-2">
                        {order.remarks && (
                            <div>
                                <span className="text-gray-600">Reason:</span>
                                <p className="text-red-800 mt-1 font-medium">{order.remarks}</p>
                            </div>
                        )}
                        <div className="flex justify-between">
                            <span className="text-gray-600">Order Amount:</span>
                            <span className="font-semibold">₹{(order.totalAmount || 0).toLocaleString()}</span>
                        </div>
                    </div>

                    <Button
                        variant="outline"
                        className="w-full border-2 border-red-400 text-red-700 hover:bg-red-50 font-bold"
                        onClick={() => setIsEditing(true)}
                    >
                        ✏️ Edit / Reactivate Order
                    </Button>
                </Card>
            )}

            {/* Edit Mode for Cancelled Orders */}
            {order.status === 'cancelled' && isEditing && (
                <Card className="p-5 bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-300 rounded-xl shadow-sm mb-4">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center justify-between">
                        <span>✏️ Edit Failed Order</span>
                        <button
                            onClick={() => setIsEditing(false)}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </h3>

                    {/* Remarks */}
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-900 mb-2">Updated Remarks</label>
                        <textarea
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                            placeholder="Update failure reason or notes..."
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500"
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => setIsEditing(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            className="flex-1 bg-red-600 hover:bg-red-700"
                            disabled={processing}
                            onClick={async () => {
                                setProcessing(true);
                                try {
                                    await OrderService.update(order.id, {
                                        remarks: remarks || order.remarks
                                    } as any);
                                    toast.success("Order updated!");
                                    setIsEditing(false);
                                    const updatedOrder = await OrderService.getById(order.id);
                                    if (updatedOrder) setOrder(updatedOrder);
                                } catch (e) {
                                    console.error(e);
                                    toast.error("Failed to update order");
                                } finally {
                                    setProcessing(false);
                                }
                            }}
                        >
                            {processing ? 'Saving...' : '💾 Save Changes'}
                        </Button>
                    </div>
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
                                        className={`w-full text-left px-4 py-3 hover:bg-orange-50 border-b border-gray-100 last:border-b-0 transition-colors ${selectedProduct === product.id ? 'bg-orange-100 font-medium' : ''
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
                                    className={`p-3 rounded-lg text-sm font-medium transition-all border-2 ${reason === dmgReason.value
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
                                            className={`text-left p-3 rounded-lg border-2 transition-all ${isSelected
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
                                    className={`flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 text-center font-bold text-lg ${selectedProduct && !isReturnQtyValid
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
