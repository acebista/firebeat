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
    rate: number;
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
    const [editStatus, setEditStatus] = useState<'delivered' | 'cancelled'>('delivered'); // Status toggle in edit mode
    const [editFailReason, setEditFailReason] = useState(''); // Failure reason if marking as failed

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
                            productName: item.productName || item.product_name || item.tempProductName || item.name || 'Unknown Item',
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

    // Parse existing returns and damages from remarks when entering edit mode
    useEffect(() => {
        console.log('[DeliveryOrderDetails] Remarks parsing useEffect triggered', {
            isEditing,
            hasOrder: !!order,
            hasRemarks: !!order?.remarks,
            remarks: order?.remarks
        });

        if (isEditing && order?.remarks) {
            const remarks = order.remarks;
            console.log('[DeliveryOrderDetails] Parsing remarks:', remarks);

            // Parse Returns: ProductName(qty), ProductName2(qty)
            const returnsMatch = remarks.match(/Returns:\s*([^|]+)/);
            console.log('[DeliveryOrderDetails] Returns match:', returnsMatch);

            if (returnsMatch) {
                const returnsStr = returnsMatch[1].trim();
                console.log('[DeliveryOrderDetails] Returns string:', returnsStr);
                const returnRegex = /([^(]+)\((\d+)\)/g;
                const parsedReturns: ReturnItem[] = [];
                let match;

                while ((match = returnRegex.exec(returnsStr)) !== null) {
                    const productName = match[1].trim();
                    const returnQty = parseInt(match[2]);
                    console.log('[DeliveryOrderDetails] Found return:', { productName, returnQty });

                    // Find the product in order items to get rate and original qty
                    const orderItem = order.items?.find(item =>
                        (item.productName || item.tempProductName || '').toLowerCase() === productName.toLowerCase()
                    );

                    console.log('[DeliveryOrderDetails] Matched order item:', orderItem);

                    if (orderItem) {
                        parsedReturns.push({
                            productId: orderItem.productId || '',
                            productName: productName,
                            originalQty: Number(orderItem.qty || orderItem.quantity || 0),
                            returnQty: returnQty,
                            rate: Number(orderItem.rate || orderItem.price || 0)
                        });
                    }
                }

                console.log('[DeliveryOrderDetails] Parsed returns:', parsedReturns);
                if (parsedReturns.length > 0) {
                    setReturnItems(parsedReturns);
                    console.log('[DeliveryOrderDetails] Set return items:', parsedReturns);
                }
            }

            // Parse Damages: ProductName(qty) - reason, ProductName2(qty) - reason
            const damagesMatch = remarks.match(/Damages:\s*([^|]+)/);
            console.log('[DeliveryOrderDetails] Damages match:', damagesMatch);

            if (damagesMatch) {
                const damagesStr = damagesMatch[1].trim();
                console.log('[DeliveryOrderDetails] Damages string:', damagesStr);
                const damageRegex = /([^(]+)\((\d+)\)\s*-\s*([^,]+)/g;
                const parsedDamages: DamageItem[] = [];
                let match;

                while ((match = damageRegex.exec(damagesStr)) !== null) {
                    const productName = match[1].trim();
                    const quantity = parseInt(match[2]);
                    const reason = match[3].trim();
                    console.log('[DeliveryOrderDetails] Found damage:', { productName, quantity, reason });

                    // Find the product in order items to get rate and product ID
                    const orderItem = order.items?.find(item =>
                        (item.productName || item.tempProductName || '').toLowerCase() === productName.toLowerCase()
                    );

                    console.log('[DeliveryOrderDetails] Matched order item:', orderItem);

                    if (orderItem) {
                        parsedDamages.push({
                            productId: orderItem.productId || '',
                            productName: productName,
                            quantity: quantity,
                            reason: reason,
                            rate: Number(orderItem.rate || orderItem.price || 0)
                        });
                    }
                }

                console.log('[DeliveryOrderDetails] Parsed damages:', parsedDamages);
                if (parsedDamages.length > 0) {
                    setDamages(parsedDamages);
                    console.log('[DeliveryOrderDetails] Set damages:', parsedDamages);
                }
            }
        }
        // Note: Removed the clearing logic here - it was causing issues
        // Returns and damages will be cleared when the component unmounts or when explicitly needed
    }, [isEditing, order]);


    const calculateOriginalTotal = () => {
        if (!order?.items) return 0;
        return order.items.reduce((sum, item) => sum + ((Number(item.total) || (Number(item.qty) * Number(item.rate))) || 0), 0);
    };

    const calculateCurrentNetTotal = () => {
        const gross = calculateOriginalTotal();
        const discount = Number(order?.discount || 0);
        const returns = calculateReturnTotal();
        const damages = calculateDamageTotal();
        return Math.max(0, gross - discount - returns - damages);
    };

    const calculateDamageTotal = () => {
        const raw = damages.reduce((sum, d) => sum + (d.rate * d.quantity), 0);
        const gross = calculateOriginalTotal();
        const discount = Number(order?.discount || 0);
        if (gross <= 0 || discount <= 0) return raw;
        // Apply pro-rated invoice discount to damage value
        return raw * (1 - (discount / gross));
    };

    const calculateReturnTotal = () => {
        const raw = returnItems.reduce((sum, r) => sum + (r.rate * r.returnQty), 0);
        const gross = calculateOriginalTotal();
        const discount = Number(order?.discount || 0);
        if (gross <= 0 || discount <= 0) return raw;
        // Apply pro-rated invoice discount to return value
        return raw * (1 - (discount / gross));
    };

    const addPaymentEntry = () => {
        const remaining = calculateCurrentNetTotal() - paymentEntries.reduce((s, p) => s + p.amount, 0);
        setPaymentEntries([...paymentEntries, { method: 'cash', amount: Math.max(0, Number(remaining.toFixed(2))) }]);
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
        const netTotal = calculateCurrentNetTotal();

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
            let remarkText = `Payments: ${paymentEntries.map(p => `${p.method.toUpperCase()}: ₹${Number(p.amount).toFixed(2)}${p.reference ? ` (${p.reference})` : ''}`).join(', ')}`;
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

            // 0. CLEANUP: Ensure no active payments exist before adding (to prevent duplicates)
            const existingPayments = await PaymentsService.getPaymentsByInvoice(order.id);
            for (const p of existingPayments) {
                await PaymentsService.voidPayment(p.id, "Auto-cleanup before fresh capture");
            }

            // Create individual payment records in ledger
            for (const entry of paymentEntries) {
                if (entry.amount > 0 && entry.method !== 'credit' && order.customerId) {
                    try {
                        console.log(`[DeliveryOrderDetails] Adding payment: ${entry.method} ₹${entry.amount}`);
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

        // Validate if marking as failed
        if (editStatus === 'cancelled' && !editFailReason.trim()) {
            toast.error("Please provide a reason for failed delivery");
            return;
        }

        const totalCollected = editStatus === 'cancelled'
            ? 0
            : paymentEntries.reduce((sum, p) => sum + (p.method !== 'credit' ? Number(p.amount) : 0), 0);

        const confirmMsg = editStatus === 'cancelled'
            ? "Are you sure you want to mark this as a FAILED delivery? This will reset payment data."
            : "Are you sure you want to update this delivery record?";

        if (!window.confirm(confirmMsg)) return;

        setProcessing(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const userId = session?.user?.id;

            let remarkText = '';
            let updateData: any = {};

            if (editStatus === 'cancelled') {
                // Marking as failed delivery
                remarkText = `Delivery Attempt Failed: ${editFailReason}`;
                if (remarks) remarkText += ` | ${remarks}`;

                updateData = {
                    status: 'cancelled',
                    remarks: remarkText,
                    payment_collected: 0,
                    payment_method_at_delivery: null,
                    delivered_at: null,
                    delivered_by: null
                };
            } else {
                // Regular update - keep as delivered
                remarkText = `[EDITED] Payments: ${paymentEntries.map(p => `${p.method.toUpperCase()}: ₹${Number(p.amount).toFixed(2)}${p.reference ? ` (${p.reference})` : ''}`).join(', ')}`;

                // Add returns info if any
                if (returnItems.length > 0) {
                    remarkText += ` | Returns: ${returnItems.map(r => `${r.productName}(${r.returnQty})`).join(', ')}`;
                }

                // Add damages info if any
                if (damages.length > 0) {
                    remarkText += ` | Damages: ${damages.map(d => `${d.productName}(${d.quantity}) - ${d.reason}`).join(', ')}`;
                }

                if (remarks) remarkText += ` | ${remarks}`;

                const mainPaymentMethod = paymentEntries.length === 1 ? paymentEntries[0].method : 'Multiple';
                const currentNetTotal = calculateCurrentNetTotal();

                updateData = {
                    remarks: remarkText,
                    payment_collected: totalCollected,
                    payment_method_at_delivery: mainPaymentMethod,
                    totalAmount: Math.max(0, currentNetTotal)
                };
            }

            // Update order record
            await OrderService.update(order.id, updateData);

            // SYNC PAYMENTS: Update invoice_payments table to match edited entries
            if (editStatus === 'delivered') {
                try {
                    // 1. Get existing non-voided payments for this invoice
                    const existingPayments = await PaymentsService.getPaymentsByInvoice(order.id);

                    // 2. Void all existing payments for this invoice
                    for (const p of existingPayments) {
                        console.log(`[DeliveryOrderDetails] Voiding payment: ${p.id}`);
                        await PaymentsService.voidPayment(p.id, "Delivery Detail Correction");
                    }

                    // 3. Create new payment records from current paymentEntries
                    for (const entry of paymentEntries) {
                        if (entry.amount > 0 && entry.method !== 'credit' && order.customerId) {
                            await PaymentsService.addPayment({
                                invoiceId: order.id,
                                customerId: order.customerId,
                                amount: entry.amount,
                                method: entry.method,
                                reference: entry.reference || undefined,
                                notes: `Delivery correction (${entry.method})${remarks ? ` - ${remarks}` : ''}`
                            });
                        }
                    }
                    console.log('[DeliveryOrderDetails] Synced payments for audit log');
                } catch (payError) {
                    console.error('Failed to sync payments during edit:', payError);
                    toast.error("Order details saved, but payment sync failed. Ledger might be inconsistent.");
                }
            } else if (editStatus === 'cancelled') {
                // If marked as failed, void all existing payments
                try {
                    const existingPayments = await PaymentsService.getPaymentsByInvoice(order.id);
                    for (const p of existingPayments) {
                        await PaymentsService.voidPayment(p.id, "Order marked as FAILED after delivery");
                    }
                } catch (failError) {
                    console.error('Failed to void payments on delivery failure:', failError);
                }
            }

            toast.success(editStatus === 'cancelled'
                ? "Order marked as failed delivery!"
                : "Delivery record updated successfully!"
            );
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
            const currentTripId = order.assignedTripId;
            const originalDate = order.rescheduled_from || order.date; // Keep original if already rescheduled

            // Update order: change status, date, track original date, and clear trip assignment
            await OrderService.update(order.id, {
                status: 'approved',
                date: newDate, // CRITICAL: Move order to the new date
                rescheduled_from: originalDate, // Track original date for reports
                assignedTripId: undefined,
                remarks: `Rescheduled from ${originalDate} to ${newDate}${remarks ? ` | ${remarks}` : ''}`
            } as any);

            // CRITICAL: Remove order from trip's orderIds array
            if (currentTripId) {
                try {
                    const trip = await TripService.getById(currentTripId);
                    if (trip && trip.orderIds) {
                        const updatedOrderIds = trip.orderIds.filter(id => id !== order.id);
                        await TripService.update(trip.id, {
                            orderIds: updatedOrderIds,
                            totalOrders: updatedOrderIds.length
                        });
                    }
                } catch (tripError) {
                    console.error('Failed to update trip orderIds', tripError);
                }
            }

            toast.success(`Delivery rescheduled to ${newDate} and removed from current trip.`);
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
                    <span className="font-bold text-gray-900">Items Gross Total</span>
                    <span className="text-lg font-bold text-gray-900">₹{calculateOriginalTotal().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
            </Card>

            {/* Delivery Actions Card */}
            {order.status !== 'delivered' && order.status !== 'cancelled' && (
                <Card className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl shadow-sm mb-4">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center justify-between">
                        <span>Complete Delivery</span>
                        <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded">₹{calculateCurrentNetTotal().toFixed(2)} Due</span>
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
                    <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200 shadow-sm space-y-3">
                        <div className="flex justify-between text-sm text-gray-500">
                            <span>Order Total (Gross):</span>
                            <span>₹{calculateOriginalTotal().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>

                        {(order.discount || 0) > 0 && (
                            <div className="flex justify-between text-sm text-red-600 font-medium italic">
                                <span>Invoice Discount (-) :</span>
                                <span>₹{(order.discount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            </div>
                        )}

                        {calculateReturnTotal() > 0 && (
                            <div className="flex justify-between text-sm text-purple-600">
                                <span>Returns (Net) (-) :</span>
                                <span>₹{calculateReturnTotal().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            </div>
                        )}

                        {calculateDamageTotal() > 0 && (
                            <div className="flex justify-between text-sm text-orange-600">
                                <span>Damages (Net) (-) :</span>
                                <span>₹{calculateDamageTotal().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            </div>
                        )}

                        <div className="pt-2 border-t border-dashed border-gray-200 flex justify-between items-center bg-blue-50/50 p-2 rounded">
                            <span className="font-semibold text-gray-800">Order Net Total:</span>
                            <span className="text-lg font-bold text-gray-900">₹{calculateCurrentNetTotal().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>

                        <div className="flex justify-between items-center pt-1 px-2">
                            <span className="text-sm font-medium text-emerald-600">Total Collected:</span>
                            <span className="text-md font-bold text-emerald-600">₹{paymentEntries.reduce((s, p) => s + (p.method !== 'credit' ? (Number(p.amount) || 0) : 0), 0).toFixed(2)}</span>
                        </div>

                        {paymentEntries.some(p => p.method === 'credit') && (
                            <div className="flex justify-between items-center text-amber-600 font-bold px-2">
                                <span>Credit Recorded:</span>
                                <span>₹{paymentEntries.reduce((s, p) => s + (p.method === 'credit' ? (Number(p.amount) || 0) : 0), 0).toFixed(2)}</span>
                            </div>
                        )}
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
                            <span className="font-semibold text-emerald-600">₹{Number((order as any).payment_collected || order.totalAmount || 0).toFixed(2)}</span>
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
                        onClick={() => {
                            setEditStatus('delivered');
                            setEditFailReason('');
                            setIsEditing(true);
                        }}
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

                    {/* Delivery Status Toggle */}
                    <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200">
                        <label className="block text-sm font-semibold text-gray-900 mb-3">Delivery Status</label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setEditStatus('delivered')}
                                className={`px-4 py-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${editStatus === 'delivered'
                                    ? 'bg-emerald-100 border-2 border-emerald-500 text-emerald-800'
                                    : 'bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                <CheckCircle className="h-4 w-4" />
                                Delivered ✓
                            </button>
                            <button
                                type="button"
                                onClick={() => setEditStatus('cancelled')}
                                className={`px-4 py-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${editStatus === 'cancelled'
                                    ? 'bg-red-100 border-2 border-red-500 text-red-800'
                                    : 'bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                <XCircle className="h-4 w-4" />
                                Failed ✗
                            </button>
                        </div>

                        {/* Show failure reason input if marking as failed */}
                        {editStatus === 'cancelled' && (
                            <div className="mt-4">
                                <label className="block text-sm font-medium text-red-700 mb-2">Reason for Failed Delivery *</label>
                                <select
                                    value={editFailReason}
                                    onChange={(e) => setEditFailReason(e.target.value)}
                                    className="w-full px-3 py-2 border border-red-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 bg-white"
                                >
                                    <option value="">Select a reason...</option>
                                    <option value="Shop closed">Shop closed</option>
                                    <option value="No money">No money</option>
                                    <option value="Customer not available">Customer not available</option>
                                    <option value="Wrong address">Wrong address</option>
                                    <option value="Customer refused">Customer refused</option>
                                    <option value="Other">Other</option>
                                </select>
                                {editFailReason === 'Other' && (
                                    <input
                                        type="text"
                                        placeholder="Enter custom reason..."
                                        onChange={(e) => setEditFailReason(e.target.value)}
                                        className="w-full mt-2 px-3 py-2 border border-red-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500"
                                    />
                                )}
                            </div>
                        )}
                    </div>

                    {/* Only show payment/returns/damages if keeping as delivered */}
                    {editStatus === 'delivered' && (
                        <>
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
                                                    step="0.01"
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

                            {/* Summary Calculations (Breakdown) */}
                            <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200 shadow-sm space-y-2">
                                <div className="flex justify-between text-xs text-gray-500">
                                    <span>Original Order Total (Gross):</span>
                                    <span>₹{calculateOriginalTotal().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                </div>

                                {(order.discount || 0) > 0 && (
                                    <div className="flex justify-between text-xs text-red-600 font-medium italic">
                                        <span>Invoice Discount (-) :</span>
                                        <span>₹{(order.discount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                    </div>
                                )}

                                {calculateReturnTotal() > 0 && (
                                    <div className="flex justify-between text-xs text-purple-600">
                                        <span>Returns (Net) (-) :</span>
                                        <span>₹{calculateReturnTotal().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                    </div>
                                )}

                                {calculateDamageTotal() > 0 && (
                                    <div className="flex justify-between text-xs text-orange-600">
                                        <span>Damages (Net) (-) :</span>
                                        <span>₹{calculateDamageTotal().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                    </div>
                                )}

                                <div className="pt-2 border-t border-dashed border-gray-200 flex justify-between items-center mt-1">
                                    <span className="font-semibold text-gray-800 text-sm">Revised Net Total:</span>
                                    <span className="font-bold text-gray-900">₹{calculateCurrentNetTotal().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                </div>

                                <div className="flex justify-between text-emerald-600 font-bold text-sm pt-1">
                                    <span>Total Collected:</span>
                                    <span>₹{paymentEntries.reduce((s, p) => s + (p.method !== 'credit' ? (Number(p.amount) || 0) : 0), 0).toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Returns Section */}
                            <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200">
                                <div className="flex items-center justify-between mb-3">
                                    <label className="text-sm font-semibold text-gray-900">Returns</label>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-amber-600 border-amber-300"
                                        onClick={() => setShowReturnModal(true)}
                                    >
                                        <Plus className="h-3 w-3 mr-1" /> Add Return
                                    </Button>
                                </div>
                                {returnItems.length > 0 ? (
                                    <div className="space-y-2">
                                        {returnItems.map((item, idx) => (
                                            <div key={idx} className="flex justify-between items-center text-sm bg-amber-50 p-2 rounded">
                                                <span>{item.productName} x{item.returnQty}</span>
                                                <button onClick={() => setReturnItems(prev => prev.filter((_, i) => i !== idx))} className="text-red-500">
                                                    <Trash2 className="h-3 w-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-xs text-gray-500">No returns added</p>
                                )}
                            </div>

                            {/* Damages Section */}
                            <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200">
                                <div className="flex items-center justify-between mb-3">
                                    <label className="text-sm font-semibold text-gray-900">Damages</label>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-red-600 border-red-300"
                                        onClick={() => setShowDamageModal(true)}
                                    >
                                        <Plus className="h-3 w-3 mr-1" /> Add Damage
                                    </Button>
                                </div>
                                {damages.length > 0 ? (
                                    <div className="space-y-2">
                                        {damages.map((item, idx) => (
                                            <div key={idx} className="flex justify-between items-center text-sm bg-red-50 p-2 rounded">
                                                <span>{item.productName} x{item.quantity} - {item.reason}</span>
                                                <button onClick={() => setDamages(prev => prev.filter((_, i) => i !== idx))} className="text-red-500">
                                                    <Trash2 className="h-3 w-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-xs text-gray-500">No damages added</p>
                                )}
                            </div>
                        </>
                    )}

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
                            className={`flex-1 ${editStatus === 'cancelled' ? 'bg-red-600 hover:bg-red-700' : 'bg-amber-600 hover:bg-amber-700'}`}
                            disabled={processing}
                            onClick={handleUpdateDelivery}
                        >
                            {processing ? 'Saving...' : editStatus === 'cancelled' ? '⚠️ Mark as Failed' : '💾 Save Changes'}
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

        const productInInvoice = order.items.find(i => i.productId === selectedProduct) ||
            order.items.find(i => i.productName.toLowerCase() === (product.name || product.productName || '').toLowerCase());

        const rate = productInInvoice ? Number(productInInvoice.rate) : (Number(product.discountedRate) || Number(product.baseRate) || Number(product.price) || Number(product.rate) || 0);

        const newDamage: DamageItem = {
            productId: selectedProduct,
            productName: product.name || product.productName || 'Unknown Product',
            quantity: parseInt(quantity),
            reason: damageReason,
            rate: rate
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
    const [allProducts, setAllProducts] = useState<any[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
    const [loadingProducts, setLoadingProducts] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);

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
            ).slice(0, 10);
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

    const returnQtyNum = parseInt(returnQty) || 0;
    const isReturnQtyValid = returnQtyNum > 0;

    const handleSelectProduct = (product: any) => {
        setSelectedProduct(product.id);
        setSearchTerm(product.name || product.productName || '');
        setShowDropdown(false);
    };

    const handleAddReturn = () => {
        if (!selectedProduct || !returnQty) {
            toast.error('Please select product and quantity');
            return;
        }

        const product = allProducts.find(p => p.id === selectedProduct);
        if (!product) return;

        const returnQtyNum = parseInt(returnQty);
        if (returnQtyNum <= 0) {
            toast.error('Return quantity must be at least 1');
            return;
        }

        // Find product in invoice to get rate if available
        const productInInvoice = order.items.find(i => i.productId === selectedProduct) ||
            order.items.find(i => (i.productName || '').toLowerCase() === (product.name || product.productName || '').toLowerCase());

        const rate = productInInvoice ? Number(productInInvoice.rate) : (Number(product.discountedRate) || Number(product.baseRate) || Number(product.price) || Number(product.rate) || 0);

        const newReturn: ReturnItem = {
            productId: selectedProduct,
            productName: product.name || product.productName || 'Unknown Product',
            originalQty: productInInvoice ? productInInvoice.qty : 0,
            returnQty: returnQtyNum,
            rate: rate
        };

        const existing = returnItems.findIndex(r => r.productId === selectedProduct);
        if (existing >= 0) {
            const updated = [...returnItems];
            updated[existing].returnQty += returnQtyNum;
            setReturnItems(updated);
        } else {
            setReturnItems([...returnItems, newReturn]);
        }

        setSelectedProduct('');
        setReturnQty('1');
        setSearchTerm('');
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
                                placeholder={loadingProducts ? 'Loading products...' : 'Search products to return...'}
                                disabled={loadingProducts}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 transition-all font-medium"
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
                                {filteredProducts.map(product => {
                                    const inInvoice = order.items.some(i => i.productId === product.id);
                                    return (
                                        <button
                                            key={product.id}
                                            onClick={() => handleSelectProduct(product)}
                                            className={`w-full text-left px-4 py-3 hover:bg-purple-50 border-b border-gray-100 last:border-b-0 transition-colors ${selectedProduct === product.id ? 'bg-purple-100 font-medium' : ''
                                                }`}
                                        >
                                            <div className="flex justify-between items-center">
                                                <div className="font-medium text-gray-900">{product.name || product.productName}</div>
                                                {inInvoice && <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-bold">IN INVOICE</span>}
                                            </div>
                                            <div className="text-xs text-gray-600">SKU: {product.sku || 'N/A'}</div>
                                        </button>
                                    );
                                })}
                            </div>
                        )}

                        <p className="text-xs text-gray-600 mt-2">
                            🔄 Search from catalog (not limited to invoice items)
                        </p>
                    </div>

                    {/* Quantity Selection */}
                    {selectedProduct && (
                        <div className="p-4 bg-purple-50 rounded-lg border border-purple-200 animate-in fade-in zoom-in duration-200">
                            <label className="block text-sm font-semibold text-gray-900 mb-3 text-center">
                                Quantity to Return
                            </label>
                            <div className="flex items-center gap-3 mb-2">
                                <button
                                    onClick={() => setReturnQty(Math.max(1, returnQtyNum - 1).toString())}
                                    className="p-3 rounded-xl bg-white border border-purple-200 shadow-sm hover:bg-purple-100 transition-all text-purple-700"
                                >
                                    <Minus className="h-5 w-5" />
                                </button>
                                <input
                                    type="number"
                                    min="1"
                                    value={returnQty}
                                    onChange={(e) => setReturnQty(e.target.value)}
                                    className="flex-1 px-4 py-3 border border-purple-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-center font-black text-2xl bg-white shadow-inner"
                                />
                                <button
                                    onClick={() => setReturnQty((returnQtyNum + 1).toString())}
                                    className="p-3 rounded-xl bg-white border border-purple-200 shadow-sm hover:bg-purple-100 transition-all text-purple-700"
                                >
                                    <Plus className="h-5 w-5" />
                                </button>
                            </div>
                            <p className="text-[10px] text-center text-purple-600 font-medium mt-1">Enter total return quantity</p>
                        </div>
                    )}

                    <button
                        onClick={handleAddReturn}
                        disabled={!selectedProduct || !isReturnQtyValid}
                        className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-black py-4 rounded-xl flex items-center justify-center gap-3 transition-all shadow-lg active:scale-95"
                    >
                        <Plus className="h-5 w-5" /> ADD TO RETURN LIST
                    </button>
                </div>

                {/* Return Items List */}
                {returnItems.length > 0 && (
                    <div className="border-t pt-6">
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Package className="h-5 w-5 text-purple-600" />
                            Return Summary ({returnItems.length})
                        </h3>
                        <div className="space-y-3">
                            {returnItems.map((item, idx) => (
                                <div key={idx} className="p-4 bg-white rounded-xl border-2 border-purple-100 hover:border-purple-300 transition-all shadow-sm">
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <p className="font-bold text-gray-900">{item.productName}</p>
                                            <p className="text-[10px] text-gray-500 mt-0.5">Rate: ₹{item.rate.toFixed(2)}</p>
                                        </div>
                                        <button
                                            onClick={() => setReturnItems(returnItems.filter((_, i) => i !== idx))}
                                            className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all"
                                            title="Remove item"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    </div>
                                    <div className="flex justify-between items-center pt-2 border-t border-dashed border-gray-100">
                                        <span className="text-sm font-bold text-purple-700">Qty: {item.returnQty}</span>
                                        <span className="text-sm font-black text-purple-900">₹{(item.returnQty * item.rate).toFixed(2)}</span>
                                    </div>
                                </div>
                            ))}
                            <div className="p-4 bg-purple-900 rounded-xl text-white flex justify-between items-center shadow-lg transform hover:scale-[1.01] transition-all">
                                <span className="font-bold">Total Return Value</span>
                                <span className="text-xl font-black">₹{returnItems.reduce((s, i) => s + (i.returnQty * i.rate), 0).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                )}

                <button
                    onClick={onClose}
                    className="w-full mt-6 bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold py-3 rounded-xl transition-all"
                >
                    Done
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
