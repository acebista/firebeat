import React, { useState, useEffect } from 'react';
import { Card, Button, Badge } from '../../components/ui/Elements';
import { Printer, Calendar, FileText, Loader2, CalendarClock } from 'lucide-react';
import { useAuth } from '../../services/auth';
import { OrderService } from '../../services/db';
import { Order } from '../../types';
import { printChallans } from '../../components/ChallanPrint';
import toast from 'react-hot-toast';

export const SalesPrintChallans: React.FC = () => {
    const { user } = useAuth();
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [rescheduledOrders, setRescheduledOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(false);
    const [printing, setPrinting] = useState(false);

    // Load orders for the selected date
    useEffect(() => {
        loadOrders();
    }, [selectedDate, user]);

    const loadOrders = async () => {
        if (!user || !selectedDate) return;

        setLoading(true);
        try {
            const targetUserId = user.role === 'admin' ? 'all' : user.id;
            const allOrders = await OrderService.getOrdersFiltered(selectedDate, selectedDate, targetUserId);

            // Separate regular and rescheduled orders
            const regular = allOrders.filter(o => o.status !== 'cancelled' && !o.rescheduled_from);
            const rescheduled = allOrders.filter(o => o.status !== 'cancelled' && o.rescheduled_from);

            setOrders(regular);
            setRescheduledOrders(rescheduled);
        } catch (error) {
            console.error('Failed to load orders:', error);
            toast.error('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    const handlePrint = (includeRescheduled = false) => {
        const activeOrders = includeRescheduled ? [...orders, ...rescheduledOrders] : orders;

        if (activeOrders.length === 0) {
            toast.error('No orders to print');
            return;
        }

        // Check for orders missing GPS data
        const ordersWithoutGPS = activeOrders.filter(o => {
            const gps = (o as any)?.GPS;
            if (!gps || typeof gps !== 'string') return true;
            const parts = gps.split(',').map((p: string) => p.trim());
            return !(parts.length === 2 && !isNaN(Number(parts[0])) && !isNaN(Number(parts[1])));
        });

        if (ordersWithoutGPS.length > 0) {
            const proceed = window.confirm(
                `⚠️ ${ordersWithoutGPS.length} order(s) are missing GPS location data.\n\n` +
                `QR codes will not appear on these challans. Print anyway?`
            );
            if (!proceed) return;
        }

        setPrinting(true);
        try {
            const getCustomerLocation = (order: Order) => {
                const gps = (order as any)?.GPS;
                if (gps && typeof gps === 'string') {
                    const parts = gps.split(',').map((p: string) => p.trim());
                    if (parts.length === 2 && !isNaN(Number(parts[0])) && !isNaN(Number(parts[1]))) {
                        return gps;
                    }
                }
                return undefined;
            };

            printChallans(activeOrders, 'portrait', getCustomerLocation);
            toast.success(`Printing ${activeOrders.length} challans`);
        } catch (error) {
            console.error('Print failed:', error);
            toast.error('Failed to print challans');
        } finally {
            setPrinting(false);
        }
    };

    const totalOrdersCount = orders.length + rescheduledOrders.length;
    const totalAmount = [...orders, ...rescheduledOrders].reduce((sum, o) => sum + o.totalAmount, 0);
    const totalItems = [...orders, ...rescheduledOrders].reduce((sum, o) => sum + o.totalItems, 0);

    const renderOrderList = (targetOrders: Order[], title: string, isRescheduled = false) => {
        if (targetOrders.length === 0) return null;
        return (
            <Card className={`overflow-hidden ${isRescheduled ? 'border-2 border-amber-200 mt-6' : ''}`}>
                <div className={`p-4 border-b ${isRescheduled ? 'bg-amber-50' : 'bg-gray-50'}`}>
                    <h3 className={`font-semibold flex items-center gap-2 ${isRescheduled ? 'text-amber-800' : 'text-gray-800'}`}>
                        {isRescheduled ? <CalendarClock className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
                        {title}
                    </h3>
                </div>
                <div className="divide-y">
                    {targetOrders.map((order) => (
                        <div key={order.id} className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-3">
                                    <span className={`w-2 h-2 rounded-full ${order.status === 'delivered' ? 'bg-green-500' :
                                        order.status === 'dispatched' ? 'bg-blue-500' :
                                            order.status === 'approved' ? 'bg-yellow-500' : 'bg-gray-400'
                                        }`} />
                                    <div>
                                        <p className="font-medium text-gray-900">{order.customerName}</p>
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <span>#{order.id} • {order.totalItems} items</span>
                                            {order.rescheduled_from && (
                                                <Badge color="amber" size="sm">↩ {order.rescheduled_from}</Badge>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-indigo-600">₹{order.totalAmount.toLocaleString()}</p>
                                <p className="text-xs text-gray-500 capitalize">{order.status}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        );
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Print Challans</h1>
                    <p className="text-gray-500">Generate challans for today's deliveries</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Button
                        variant="outline"
                        onClick={() => handlePrint(false)}
                        disabled={loading || printing || orders.length === 0}
                        className="flex items-center gap-2"
                    >
                        {printing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Printer className="h-4 w-4" />}
                        Today Only ({orders.length})
                    </Button>
                    <Button
                        onClick={() => handlePrint(true)}
                        disabled={loading || printing || totalOrdersCount === 0}
                        className="flex items-center gap-2"
                    >
                        {printing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Printer className="h-4 w-4" />}
                        Today + Rescheduled ({totalOrdersCount})
                    </Button>
                </div>
            </div>

            {/* Date Selector */}
            <Card className="p-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-gray-400" />
                        <label className="text-sm font-medium text-gray-700">Select Date:</label>
                    </div>
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <Button variant="outline" onClick={loadOrders} disabled={loading}>
                        {loading ? 'Loading...' : 'Refresh'}
                    </Button>
                </div>
            </Card>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="p-4 bg-indigo-50 border-indigo-200">
                    <p className="text-sm text-indigo-600 font-medium">Total Orders</p>
                    <p className="text-2xl font-bold text-indigo-900">{totalOrdersCount}</p>
                </Card>
                <Card className="p-4 bg-green-50 border-green-200">
                    <p className="text-sm text-green-600 font-medium">Total Items</p>
                    <p className="text-2xl font-bold text-green-900">{totalItems}</p>
                </Card>
                <Card className="p-4 bg-purple-50 border-purple-200">
                    <p className="text-sm text-purple-600 font-medium">Total Amount</p>
                    <p className="text-2xl font-bold text-purple-900">₹{totalAmount.toLocaleString()}</p>
                </Card>
            </div>

            {/* Orders Sections */}
            {loading ? (
                <div className="p-12 text-center">
                    <Loader2 className="h-10 w-10 animate-spin mx-auto text-indigo-500" />
                    <p className="mt-4 text-gray-500 font-medium">Loading orders for {selectedDate}...</p>
                </div>
            ) : totalOrdersCount === 0 ? (
                <div className="p-12 text-center bg-white rounded-xl shadow-sm border border-gray-100">
                    <FileText className="h-16 w-16 mx-auto text-gray-200 mb-4" />
                    <p className="text-xl font-semibold text-gray-700">Nothing to deliver</p>
                    <p className="text-gray-500 mt-2">No orders found for the selected date.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {renderOrderList(orders, "Today's Original Orders")}
                    {renderOrderList(rescheduledOrders, "Rescheduled Orders (Backlog)", true)}
                </div>
            )}

            {/* Print Instructions */}
            {totalOrdersCount > 0 && (
                <Card className="p-4 bg-blue-50 border-blue-200">
                    <h4 className="font-medium text-blue-900 mb-2">📋 Print Guidelines</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Use **A5 Portrait** paper for best results.</li>
                        <li>• Rescheduled orders are clearly marked with a ↩ icon.</li>
                        <li>• QR codes will show the delivery location for scan-to-map.</li>
                    </ul>
                </Card>
            )}
        </div>
    );
};
