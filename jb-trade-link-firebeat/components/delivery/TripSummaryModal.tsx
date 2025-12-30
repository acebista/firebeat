import React, { useState, useMemo } from 'react';
import { Card, Button, Badge } from '../ui/Elements';
import { Modal } from '../ui/Modal';
import {
    CheckCircle,
    XCircle,
    Clock,
    Package,
    DollarSign,
    AlertCircle,
    Truck,
    User,
    Search,
    ChevronDown,
    ChevronUp,
    ExternalLink,
    Edit2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Order, OrderItem } from '../../types';

interface TripWithStats {
    trip: any;
    orders: Order[];
    completedCount: number;
    pendingCount: number;
    totalValue: number;
    isPackingComplete: boolean;
}

interface TripSummaryModalProps {
    isOpen: boolean;
    onClose: () => void;
    tripData: TripWithStats;
}

export const TripSummaryModal: React.FC<TripSummaryModalProps> = ({
    isOpen,
    onClose,
    tripData
}) => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');

    const { trip, orders } = tripData;

    // Parsing logic for payments, damages, and returns
    const parsedOrders = useMemo(() => {
        return orders.map(order => {
            const remarks = order.remarks || '';

            // Parse Payments
            const paymentsStr = remarks.match(/Payments:\s*([^|]+)/)?.[1] ||
                remarks.match(/Payment:\s*([^|]+)/)?.[1];

            const payments: { method: string; amount: number }[] = [];

            if (paymentsStr) {
                const regex = /(\w+):\s*₹?(\d+(?:\.\d+)?)/g;
                let match;
                while ((match = regex.exec(paymentsStr)) !== null) {
                    payments.push({
                        method: match[1],
                        amount: parseFloat(match[2])
                    });
                }
            }

            // Fallback: If no detailed payments parsed, check order level fields
            if (payments.length === 0 && order.payment_collected && order.payment_collected > 0) {
                payments.push({
                    method: order.payment_method_at_delivery || 'Collected',
                    amount: order.payment_collected
                });
            } else if (payments.length === 0 && paymentsStr && !paymentsStr.includes(':')) {
                // Handle cases like "Payment: QR" where there's no amount in remarks but we have totalAmount
                payments.push({
                    method: paymentsStr.trim(),
                    amount: order.payment_collected || order.totalAmount
                });
            }

            // Parse Damages
            const damagesMatch = remarks.match(/Damages:\s*([^|]+)/);
            const damages: { name: string; qty: number; reason: string }[] = [];
            if (damagesMatch) {
                const regex = /([^(]+)\((\d+)\)\s*(?:-\s*([^,]+))?/g;
                let match;
                while ((match = regex.exec(damagesMatch[1])) !== null) {
                    damages.push({
                        name: match[1].trim(),
                        qty: parseInt(match[2]),
                        reason: (match[3] || '').trim()
                    });
                }
            }

            // Parse Returns
            const returnsMatch = remarks.match(/Returns:\s*([^|]+)/);
            const returns: { name: string; qty: number }[] = [];
            if (returnsMatch) {
                const regex = /([^(]+)\((\d+)\)/g;
                let match;
                while ((match = regex.exec(returnsMatch[1])) !== null) {
                    returns.push({
                        name: match[1].trim(),
                        qty: parseInt(match[2])
                    });
                }
            }

            return {
                ...order,
                parsedPayments: payments,
                parsedDamages: damages,
                parsedReturns: returns,
                totalCollected: payments.reduce((sum, p) => sum + p.amount, 0)
            };
        });
    }, [orders]);

    const filteredOrders = useMemo(() => {
        if (!searchTerm.trim()) return parsedOrders;
        const s = searchTerm.toLowerCase();
        return parsedOrders.filter(o =>
            o.customerName.toLowerCase().includes(s) ||
            o.id.toLowerCase().includes(s)
        );
    }, [parsedOrders, searchTerm]);

    const stats = useMemo(() => {
        return {
            totalAmount: orders.reduce((sum, o) => sum + o.totalAmount, 0),
            totalCollected: parsedOrders.reduce((sum, o) => sum + o.totalCollected, 0),
            deliveredCount: orders.filter(o => o.status === 'delivered' || o.status === 'completed').length,
            failedCount: orders.filter(o => o.status === 'cancelled').length,
            pendingCount: orders.filter(o => o.status !== 'delivered' && o.status !== 'completed' && o.status !== 'cancelled').length,
        };
    }, [orders, parsedOrders]);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'delivered':
            case 'completed':
                return <Badge color="emerald">Delivered</Badge>;
            case 'cancelled':
                return <Badge color="red">Failed</Badge>;
            default:
                return <Badge color="amber">Pending</Badge>;
        }
    };

    const getPaymentBadgeColor = (method: string) => {
        switch (method.toLowerCase()) {
            case 'cash': return 'emerald';
            case 'qr': return 'blue';
            case 'cheque': return 'amber';
            case 'credit': return 'red';
            default: return 'slate';
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Trip Summary: #${trip.id.slice(0, 8)}`} size="xl">
            <div className="space-y-6">
                {/* Trip Header Info */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card className="p-3 bg-indigo-50 border-indigo-100">
                        <p className="text-xs text-indigo-600 font-medium uppercase tracking-wider">Progress</p>
                        <div className="flex items-end justify-between mt-1">
                            <h3 className="text-2xl font-bold text-indigo-900">{stats.deliveredCount}/{orders.length}</h3>
                            <p className="text-sm font-medium text-indigo-600 mb-1">
                                {Math.round((stats.deliveredCount / orders.length) * 100)}%
                            </p>
                        </div>
                        <div className="w-full bg-indigo-200 rounded-full h-1.5 mt-2">
                            <div
                                className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                                style={{ width: `${(stats.deliveredCount / orders.length) * 100}%` }}
                            />
                        </div>
                    </Card>

                    <Card className="p-3 bg-emerald-50 border-emerald-100">
                        <p className="text-xs text-emerald-600 font-medium uppercase tracking-wider">Collected</p>
                        <h3 className="text-2xl font-bold text-emerald-900 mt-1">₹{stats.totalCollected.toLocaleString()}</h3>
                        <p className="text-xs text-emerald-600 mt-1">of ₹{stats.totalAmount.toLocaleString()}</p>
                    </Card>

                    <Card className="p-3 bg-amber-50 border-amber-100">
                        <p className="text-xs text-amber-600 font-medium uppercase tracking-wider">Pending</p>
                        <h3 className="text-2xl font-bold text-amber-900 mt-1">{stats.pendingCount}</h3>
                        <p className="text-xs text-amber-600 mt-1">Stops remaining</p>
                    </Card>

                    <Card className="p-3 bg-red-50 border-red-100">
                        <p className="text-xs text-red-600 font-medium uppercase tracking-wider">Failed / Returns</p>
                        <h3 className="text-2xl font-bold text-red-900 mt-1">{stats.failedCount}</h3>
                        <p className="text-xs text-red-600 mt-1">Orders failed</p>
                    </Card>
                </div>

                {/* Search and Table */}
                <div className="space-y-4">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="relative flex-1 w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search shops or invoice numbers..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm"
                            />
                        </div>
                        <div className="flex gap-2 shrink-0">
                            <Badge color="slate">Total: {orders.length} Stops</Badge>
                        </div>
                    </div>

                    <div className="overflow-x-auto border border-gray-100 rounded-2xl shadow-sm bg-white">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Stop</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Shop / Invoice</th>
                                    <th className="px-4 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Order Val</th>
                                    <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Payments</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Returns/Damages</th>
                                    <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {filteredOrders.map((order, idx) => (
                                    <tr key={order.id} className="hover:bg-indigo-50/30 transition-colors">
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 text-gray-600 text-xs font-bold">
                                                {idx + 1}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="text-sm font-bold text-gray-900">{order.customerName}</div>
                                            <div className="text-[10px] font-mono text-indigo-500 mt-0.5">{order.id.slice(0, 12)}</div>
                                        </td>
                                        <td className="px-4 py-4 text-right">
                                            <div className="text-sm font-bold text-gray-900">₹{order.totalAmount.toLocaleString()}</div>
                                            <div className="text-[10px] text-gray-400 mt-0.5">{order.items.length} items</div>
                                        </td>
                                        <td className="px-4 py-4 text-center">
                                            {getStatusBadge(order.status)}
                                        </td>
                                        <td className="px-4 py-4">
                                            {order.parsedPayments.length > 0 ? (
                                                <div className="flex flex-col gap-1">
                                                    {order.parsedPayments.map((p, i) => (
                                                        <div key={i} className="flex items-center gap-1.5">
                                                            <Badge color={getPaymentBadgeColor(p.method) as any}>
                                                                {p.method.toUpperCase()}
                                                            </Badge>
                                                            <span className="text-xs font-medium text-gray-700">₹{p.amount.toLocaleString()}</span>
                                                        </div>
                                                    ))}
                                                    {order.parsedPayments.length > 1 && (
                                                        <div className="text-[10px] font-bold text-emerald-600 border-t border-emerald-100 pt-0.5 mt-0.5">
                                                            Tot: ₹{order.totalCollected.toLocaleString()}
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-xs text-gray-400 italic">No payments</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex flex-col gap-1">
                                                {order.parsedReturns.length > 0 && (
                                                    <div className="flex flex-wrap gap-1">
                                                        {order.parsedReturns.map((r, i) => (
                                                            <div key={i} className="flex items-center gap-1 bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded text-[10px] border border-amber-100">
                                                                <Package size={10} />
                                                                <span>{r.name.slice(0, 10)}... ({r.qty})</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                                {order.parsedDamages.length > 0 && (
                                                    <div className="flex flex-wrap gap-1">
                                                        {order.parsedDamages.map((d, i) => (
                                                            <div key={i} className="flex items-center gap-1 bg-red-50 text-red-700 px-1.5 py-0.5 rounded text-[10px] border border-red-100">
                                                                <AlertCircle size={10} />
                                                                <span>{d.name.slice(0, 10)}... ({d.qty})</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                                {order.parsedReturns.length === 0 && order.parsedDamages.length === 0 && (
                                                    <span className="text-xs text-gray-400">-</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-center">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => navigate(`/delivery/invoice/${order.id}`)}
                                                className="h-8 w-8 p-0 rounded-full border-indigo-200 text-indigo-600 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all"
                                                title="Quick Edit"
                                            >
                                                <Edit2 size={14} />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div className="mt-6 flex justify-between items-center bg-gray-50 p-4 rounded-xl">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                    <AlertCircle size={14} className="text-indigo-400" />
                    <span>Review all entries before finishing the trip.</span>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" onClick={onClose}>Close</Button>
                    <Button
                        className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200"
                        onClick={() => {
                            // Maybe add a print current summary feature?
                            const printContent = document.querySelector('.overflow-x-auto')?.innerHTML;
                            if (printContent) {
                                const win = window.open('', '', 'height=700,width=900');
                                win?.document.write('<html><head><title>Trip Summary</title>');
                                win?.document.write('<style>table { width: 100%; border-collapse: collapse; } th, td { border: 1px solid #ccc; padding: 8px; text-align: left; font-size: 12px; } </style>');
                                win?.document.write('</head><body>');
                                win?.document.write(`<h1>Trip Summary: #${trip.id.slice(0, 8)}</h1>`);
                                win?.document.write(printContent);
                                win?.document.write('</body></html>');
                                win?.document.close();
                                win?.print();
                            }
                        }}
                    >
                        Print Summary
                    </Button>
                </div>
            </div>
        </Modal>
    );
};
