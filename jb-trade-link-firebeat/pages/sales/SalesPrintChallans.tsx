import React, { useState, useEffect } from 'react';
import { Card, Button } from '../../components/ui/Elements';
import { Printer, Calendar, FileText, Loader2 } from 'lucide-react';
import { useAuth } from '../../services/auth';
import { OrderService } from '../../services/db';
import { Order } from '../../types';
import { printChallans } from '../../components/ChallanPrint';
import toast from 'react-hot-toast';

export const SalesPrintChallans: React.FC = () => {
    const { user } = useAuth();
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [orders, setOrders] = useState<Order[]>([]);
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
            // Get orders for the selected date, filtered by salesperson
            const allOrders = await OrderService.getOrdersFiltered(selectedDate, selectedDate, user.id);
            // Filter only non-cancelled orders
            const validOrders = allOrders.filter(o => o.status !== 'cancelled');
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

        setPrinting(true);
        try {
            // Print all challans in portrait mode
            printChallans(orders, 'portrait');
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
                    <p className="text-gray-500">Print all your challans for a date</p>
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
                    Print All ({orders.length})
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
                        <li>• The challan will be printed in portrait mode for better readability</li>
                        <li>• Each order will be printed on a separate page</li>
                        <li>• Make sure your printer settings are set to "Fit to Page" for best results</li>
                    </ul>
                </Card>
            )}
        </div>
    );
};
