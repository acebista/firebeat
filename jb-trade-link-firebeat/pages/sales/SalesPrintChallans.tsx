import React, { useState, useEffect } from 'react';
import { Card, Button } from '../../components/ui/Elements';
import { Printer, Calendar, FileText, Loader2 } from 'lucide-react';
import { useAuth } from '../../services/auth';
import { OrderService, CustomerService, UserService } from '../../services/db';
import { Order, Customer, User } from '../../types';
import { printChallans } from '../../components/ChallanPrint';
import toast from 'react-hot-toast';

export const SalesPrintChallans: React.FC = () => {
    const { user } = useAuth();
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [users, setUsers] = useState<User[]>([]);
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
            // Determine the salesperson ID to filter by
            // Admins should see all orders (including 'office') for printing, sales see only theirs
            const targetUserId = user.role === 'admin' ? 'all' : user.id;

            // Get orders, customers, and users
            const allOrders = await OrderService.getOrdersFiltered(selectedDate, selectedDate, targetUserId);

            // Filter non-cancelled orders AND exclude rescheduled orders (they belong to a different day/salesperson)
            const validOrders = allOrders.filter(o => o.status !== 'cancelled' && !o.rescheduled_from);
            setOrders(validOrders);
        } catch (error) {
            console.error('Failed to load orders:', error);
            toast.error('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    const handlePrintAll = () => {
        if (orders.length === 0) {
            toast.error('No orders to print');
            return;
        }

        // Check for orders missing GPS data
        const ordersWithoutGPS = orders.filter(o => {
            const gps = (o as any)?.GPS;
            if (!gps || typeof gps !== 'string') return true;
            const parts = gps.split(',').map((p: string) => p.trim());
            return !(parts.length === 2 && !isNaN(Number(parts[0])) && !isNaN(Number(parts[1])));
        });

        if (ordersWithoutGPS.length > 0) {
            const proceed = window.confirm(
                `⚠️ ${ordersWithoutGPS.length} order(s) are missing GPS location data.\n\n` +
                `Customers without location:\n${ordersWithoutGPS.slice(0, 5).map(o => `• ${o.customerName}`).join('\n')}` +
                `${ordersWithoutGPS.length > 5 ? `\n... and ${ordersWithoutGPS.length - 5} more` : ''}\n\n` +
                `QR codes will not appear on these challans.\n\n` +
                `To fix: Re-create orders with "Capture GPS" enabled before placing.\n\n` +
                `Print anyway?`
            );
            if (!proceed) return;
        }

        setPrinting(true);
        try {
            // Orders are already enriched by OrderService
            const enrichedOrders = [...orders];

            // Get GPS coordinates for QR code - only return valid lat,lng format
            const getCustomerLocation = (order: Order) => {
                const gps = (order as any)?.GPS;
                if (gps && typeof gps === 'string') {
                    const parts = gps.split(',').map((p: string) => p.trim());
                    if (parts.length === 2 && !isNaN(Number(parts[0])) && !isNaN(Number(parts[1]))) {
                        return gps;
                    }
                }
                return undefined; // No valid GPS - QR code won't appear
            };

            // Print all challans in portrait mode
            printChallans(enrichedOrders, 'portrait', getCustomerLocation);
            toast.success(`Printing ${orders.length} challans`);
        } catch (error) {
            console.error('Print failed:', error);
            toast.error('Failed to print challans');
        } finally {
            setPrinting(false);
        }
    };

    const totalAmount = orders.reduce((sum, o) => sum + o.totalAmount, 0);
    const totalItems = orders.reduce((sum, o) => sum + o.totalItems, 0);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Print Challans</h1>
                    <p className="text-gray-500">Print only original orders placed on this day (excludes rescheduled)</p>
                </div>
                <Button
                    onClick={handlePrintAll}
                    disabled={loading || printing || orders.length === 0}
                    className="flex items-center gap-2"
                >
                    {printing ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <Printer className="h-4 w-4" />
                    )}
                    Print Today's Original Challans ({orders.length})
                </Button>
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
                    <p className="text-2xl font-bold text-indigo-900">{orders.length}</p>
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

            {/* Orders List */}
            <Card className="overflow-hidden">
                <div className="p-4 border-b bg-gray-50">
                    <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Orders for {new Date(selectedDate).toLocaleDateString('en-IN', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </h3>
                </div>

                {loading ? (
                    <div className="p-8 text-center">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto text-indigo-500" />
                        <p className="mt-2 text-gray-500">Loading orders...</p>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="p-8 text-center">
                        <FileText className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                        <p className="text-gray-500">No orders found for this date</p>
                        <p className="text-sm text-gray-400 mt-1">Try selecting a different date</p>
                    </div>
                ) : (
                    <div className="divide-y">
                        {orders.map((order) => (
                            <div
                                key={order.id}
                                className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between"
                            >
                                <div className="flex-1">
                                    <div className="flex items-center gap-3">
                                        <span className={`w-2 h-2 rounded-full ${order.status === 'delivered' ? 'bg-green-500' :
                                            order.status === 'dispatched' ? 'bg-blue-500' :
                                                order.status === 'approved' ? 'bg-yellow-500' :
                                                    'bg-gray-400'
                                            }`} />
                                        <div>
                                            <p className="font-medium text-gray-900">{order.customerName}</p>
                                            <p className="text-sm text-gray-500">
                                                #{order.id} • {order.totalItems} items
                                                {user?.role === 'admin' && (
                                                    <span className="ml-2 text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase">
                                                        {order.salespersonName || 'Office'}
                                                    </span>
                                                )}
                                            </p>
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
                )}
            </Card>

            {/* Print Instructions */}
            {orders.length > 0 && (
                <Card className="p-4 bg-blue-50 border-blue-200">
                    <h4 className="font-medium text-blue-900 mb-2">📋 Print Tips</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                        <li>• The challan is optimized for **A5 size** paper</li>
                        <li>• Each order will be printed on a separate page</li>
                        <li>• Set your printer settings to **A5 paper size** and "Fit to Page"</li>
                    </ul>
                </Card>
            )}
        </div>
    );
};
