import React, { useEffect, useState, useMemo } from 'react';
import { Card, Button } from '../../components/ui/Elements';
import { TripSummaryModal } from '../../components/delivery/TripSummaryModal';
import { Truck, ChevronDown, ChevronUp, History, Search, Package, ArrowLeft, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../services/auth';
import { TripService, OrderService } from '../../services/db';
import { PaymentsService, Payment } from '../../services/ledger/PaymentsService';
import { DispatchTrip, Order } from '../../types';

interface TripWithStats {
    trip: DispatchTrip;
    orders: Order[];
    payments: Payment[];
    completedCount: number;
    pendingCount: number;
    totalValue: number;
}

export const PastTrips: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [trips, setTrips] = useState<TripWithStats[]>([]);
    const [expandedTripId, setExpandedTripId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [summaryTripData, setSummaryTripData] = useState<TripWithStats | null>(null);

    useEffect(() => {
        if (user) {
            loadPastTrips();
        }
    }, [user]);

    const loadPastTrips = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const allTrips = await TripService.getByDeliveryPerson(user.id);
            // Only show completed trips
            const completedTrips = allTrips.filter(t => t.status === 'completed');
            const enrichedTrips = await processTrips(completedTrips);
            setTrips(enrichedTrips);
        } catch (e) {
            console.error("Failed to load past trips", e);
        } finally {
            setLoading(false);
        }
    };

    const processTrips = async (tripsData: DispatchTrip[]) => {
        const processed: TripWithStats[] = [];
        for (const trip of tripsData) {
            if (trip.orderIds && trip.orderIds.length > 0) {
                const orders = await OrderService.getOrdersByIds(trip.orderIds);
                const payments = await PaymentsService.getPaymentsByInvoices(trip.orderIds);

                const completed = orders.filter(o =>
                    o.status === 'delivered' || o.status === 'cancelled' || o.status === 'completed'
                ).length;

                processed.push({
                    trip,
                    orders,
                    payments,
                    completedCount: completed,
                    pendingCount: orders.length - completed,
                    totalValue: orders.reduce((sum, o) => sum + o.totalAmount, 0)
                });
            }
        }
        // Sort by date descending
        return processed.sort((a, b) => new Date(b.trip.deliveryDate).getTime() - new Date(a.trip.deliveryDate).getTime());
    };

    const filteredTrips = useMemo(() => {
        if (!searchQuery.trim()) return trips;
        const lowerQ = searchQuery.toLowerCase();
        return trips.filter(t =>
            t.trip.id.toLowerCase().includes(lowerQ) ||
            t.orders.some(o => o.customerName.toLowerCase().includes(lowerQ) || o.id.toLowerCase().includes(lowerQ))
        );
    }, [trips, searchQuery]);

    if (loading) return <div className="p-8 text-center">Loading past trips...</div>;

    return (
        <div className="space-y-6 pb-20">
            <div className="flex items-center gap-4">
                <button onClick={() => navigate('/delivery/dashboard')} className="p-2 hover:bg-gray-100 rounded-lg">
                    <ArrowLeft className="h-5 w-5" />
                </button>
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <History className="h-6 w-6 text-indigo-600" />
                    Past Trips Archive
                </h2>
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search past trips or customers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
            </div>

            {filteredTrips.length === 0 ? (
                <Card className="p-12 text-center bg-gray-50 border-dashed border-2">
                    <History className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-gray-900">No Past Trips Found</h3>
                    <p className="text-gray-500">Your completed delivery trips will appear here.</p>
                </Card>
            ) : (
                <div className="space-y-3">
                    {filteredTrips.map((tripData) => (
                        <Card key={tripData.trip.id} className="overflow-hidden border-green-100 bg-green-50/30">
                            <button
                                onClick={() => setExpandedTripId(expandedTripId === tripData.trip.id ? null : tripData.trip.id)}
                                className="w-full p-4 flex items-center justify-between hover:bg-black/5 transition"
                            >
                                <div className="flex items-center gap-3 text-left">
                                    <div className="p-2 bg-green-100 rounded-lg">
                                        <Truck size={20} className="text-green-700" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">Trip #{tripData.trip.id.slice(0, 8)}</h4>
                                        <p className="text-sm text-gray-600">
                                            {tripData.trip.deliveryDate} • {tripData.orders.length} orders • ₹{tripData.totalValue.toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                                {expandedTripId === tripData.trip.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                            </button>

                            {expandedTripId === tripData.trip.id && (
                                <div className="p-4 border-t border-green-100 bg-white">
                                    <div className="flex gap-2 mb-4">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="flex-1"
                                            onClick={() => setSummaryTripData(tripData)}
                                        >
                                            📊 View Trip Summary
                                        </Button>
                                    </div>

                                    <div className="space-y-2">
                                        {tripData.orders.map((order) => (
                                            <div
                                                key={order.id}
                                                onClick={() => navigate(`/delivery/invoice/${order.id}`)}
                                                className="p-3 border border-gray-100 rounded-lg flex items-center justify-between hover:bg-gray-50 cursor-pointer"
                                            >
                                                <div>
                                                    <p className="font-medium text-gray-900">{order.customerName}</p>
                                                    <p className="text-xs text-gray-500">#{order.id.slice(0, 8)} • ₹{order.totalAmount.toLocaleString()}</p>
                                                </div>
                                                <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${order.status === 'delivered' || order.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                    }`}>
                                                    {order.status === 'delivered' || order.status === 'completed' ? '✓ Delivered' : '✗ Failed'}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </Card>
                    ))}
                </div>
            )}

            {summaryTripData && (
                <TripSummaryModal
                    isOpen={!!summaryTripData}
                    onClose={() => setSummaryTripData(null)}
                    tripData={summaryTripData as any}
                />
            )}
        </div>
    );
};
