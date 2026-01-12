/**
 * FinPro Dashboard Page
 * 
 * Admin interface for:
 * - Viewing trips ready for closure
 * - Stock reconciliation
 * - Trip closure
 * - FinPro batch generation
 * - Export to FinPro
 */

import React, { useState, useEffect } from 'react';
import {
    Package,
    Truck,
    Lock,
    FileOutput,
    AlertTriangle,
    CheckCircle,
    XCircle,
    RefreshCw,
    Download,
    Trash2,
    ChevronDown,
    ChevronUp
} from 'lucide-react';
import { Card, Button } from '../../components/ui/Elements';
import {
    useTripStock,
    useTripClosure,
    useFinProBatches,
    useTripsReadyForClosure
} from '../../hooks/useFinPro';
import { TripService } from '../../services/db';
import { DispatchTrip } from '../../types';
import toast from 'react-hot-toast';

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const FinProDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'closure' | 'batches'>('closure');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedTripId, setSelectedTripId] = useState<string | null>(null);

    const { tripIds, loading: tripsLoading, refresh: refreshTrips } = useTripsReadyForClosure();
    const [tripDetails, setTripDetails] = useState<DispatchTrip[]>([]);

    // Load trip details
    useEffect(() => {
        const loadTrips = async () => {
            if (tripIds.length === 0) {
                setTripDetails([]);
                return;
            }
            const trips = await Promise.all(tripIds.map(id => TripService.getById(id)));
            setTripDetails(trips.filter(Boolean) as DispatchTrip[]);
        };
        loadTrips();
    }, [tripIds]);

    const tabs = [
        { id: 'closure', label: 'Trip Closure', icon: Lock },
        { id: 'batches', label: 'FinPro Batches', icon: FileOutput }
    ];

    return (
        <div className="space-y-6 p-4">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">FinPro Dashboard</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Manage trip closures and generate FinPro export batches
                    </p>
                </div>
                <Button onClick={refreshTrips} disabled={tripsLoading}>
                    <RefreshCw className={`h-4 w-4 mr-2 ${tripsLoading ? 'animate-spin' : ''}`} />
                    Refresh
                </Button>
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === tab.id
                            ? 'bg-white text-indigo-600 shadow-sm'
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        <tab.icon className="mr-2 h-4 w-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content */}
            {activeTab === 'closure' && (
                <TripClosureTab
                    trips={tripDetails}
                    selectedTripId={selectedTripId}
                    onSelectTrip={setSelectedTripId}
                    onRefresh={refreshTrips}
                />
            )}

            {activeTab === 'batches' && (
                <FinProBatchesTab
                    selectedDate={selectedDate}
                    onDateChange={setSelectedDate}
                />
            )}
        </div>
    );
};

// ============================================================================
// TRIP CLOSURE TAB
// ============================================================================

interface TripClosureTabProps {
    trips: DispatchTrip[];
    selectedTripId: string | null;
    onSelectTrip: (id: string | null) => void;
    onRefresh: () => void;
}

const TripClosureTab: React.FC<TripClosureTabProps> = ({
    trips,
    selectedTripId,
    onSelectTrip,
    onRefresh
}) => {
    if (trips.length === 0) {
        return (
            <Card className="p-8 text-center">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900">All Trips Closed</h3>
                <p className="text-gray-500 mt-2">
                    No trips are pending closure. All delivered trips have been processed.
                </p>
            </Card>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Trip List */}
            <div className="lg:col-span-1">
                <Card className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-4">
                        Trips Ready for Closure ({trips.length})
                    </h3>
                    <div className="space-y-2">
                        {trips.map((trip) => (
                            <button
                                key={trip.id}
                                onClick={() => onSelectTrip(trip.id)}
                                className={`w-full text-left p-3 rounded-lg border transition-all ${selectedTripId === trip.id
                                    ? 'border-indigo-500 bg-indigo-50'
                                    : 'border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-gray-900">
                                            {trip.deliveryPersonName}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {trip.deliveryDate} • {trip.totalOrders} orders
                                        </p>
                                    </div>
                                    <Truck className="h-5 w-5 text-gray-400" />
                                </div>
                            </button>
                        ))}
                    </div>
                </Card>
            </div>

            {/* Trip Details */}
            <div className="lg:col-span-2">
                {selectedTripId ? (
                    <TripClosurePanel tripId={selectedTripId} onClosed={onRefresh} />
                ) : (
                    <Card className="p-8 text-center">
                        <Truck className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">Select a trip to view details</p>
                    </Card>
                )}
            </div>
        </div>
    );
};

// ============================================================================
// TRIP CLOSURE PANEL
// ============================================================================

interface TripClosurePanelProps {
    tripId: string;
    onClosed: () => void;
}

const TripClosurePanel: React.FC<TripClosurePanelProps> = ({ tripId, onClosed }) => {
    const {
        loads,
        reconciliation,
        loading: stockLoading,
        error: stockError,
        isClosed,
        autoGenerateLoads,
        refreshReconciliation
    } = useTripStock(tripId);

    const {
        closurePreview,
        loading: closureLoading,
        error: closureError,
        previewClosure,
        closeTrip
    } = useTripClosure(tripId);

    const [showReconciliation, setShowReconciliation] = useState(true);

    // Load preview on mount
    useEffect(() => {
        previewClosure();
    }, [tripId, previewClosure]);

    // Count items expected to return
    const expectedReturns = reconciliation.filter(r => r.expected_unload > 0).length;
    const totalExpectedUnload = reconciliation.reduce((sum, r) => sum + r.expected_unload, 0);

    const handleAutoLoad = async () => {
        const success = await autoGenerateLoads();
        if (success) {
            toast.success('Truck loaded from order data');
            await previewClosure();
        }
    };

    const handleClose = async () => {
        // No variance approval needed - just close the trip
        const success = await closeTrip(false, '');
        if (success) {
            toast.success('Trip closed successfully!');
            onClosed();
        }
    };

    if (isClosed) {
        return (
            <Card className="p-6">
                <div className="text-center">
                    <Lock className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900">Trip Already Closed</h3>
                    <p className="text-gray-500 mt-2">
                        This trip has been closed and is ready for FinPro batch generation.
                    </p>
                </div>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            {/* Stock Loading Status */}
            <Card className="p-4">
                <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-gray-900">Stock Loading</h4>
                    {loads.length === 0 ? (
                        <Button size="sm" onClick={handleAutoLoad} disabled={stockLoading}>
                            <Package className="h-4 w-4 mr-2" />
                            Auto-Load from Orders
                        </Button>
                    ) : (
                        <span className="text-sm text-green-600 flex items-center">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            {loads.length} products loaded
                        </span>
                    )}
                </div>
                {loads.length === 0 && (
                    <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
                        ⚠️ No loading data recorded. Click "Auto-Load" to generate from order items.
                    </p>
                )}
            </Card>

            {/* Reconciliation */}
            <Card className="p-4">
                <button
                    onClick={() => setShowReconciliation(!showReconciliation)}
                    className="w-full flex items-center justify-between"
                >
                    <h4 className="font-semibold text-gray-900">Stock Reconciliation</h4>
                    {showReconciliation ? <ChevronUp /> : <ChevronDown />}
                </button>

                {showReconciliation && (
                    <div className="mt-4">
                        {expectedReturns > 0 ? (
                            <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg mb-4">
                                <div className="flex items-center text-blue-700">
                                    <Package className="h-5 w-5 mr-2" />
                                    <span className="font-medium">
                                        Expected {totalExpectedUnload} units in van ({expectedReturns} products)
                                    </span>
                                </div>
                            </div>
                        ) : loads.length > 0 && (
                            <div className="bg-green-50 border border-green-200 p-3 rounded-lg mb-4">
                                <div className="flex items-center text-green-700">
                                    <CheckCircle className="h-5 w-5 mr-2" />
                                    <span className="font-medium">All items delivered successfully</span>
                                </div>
                            </div>
                        )}

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th className="text-left p-2">Product</th>
                                        <th className="text-right p-2">Loaded</th>
                                        <th className="text-right p-2">Delivered</th>
                                        <th className="text-right p-2">Returned</th>
                                        <th className="text-right p-2">Damaged</th>
                                        <th className="text-right p-2 bg-blue-100 font-semibold">Expected Unload</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reconciliation.map((row) => (
                                        <tr
                                            key={row.product_id}
                                            className={row.expected_unload > 0 ? 'bg-blue-50' : ''}
                                        >
                                            <td className="p-2">{row.product_name}</td>
                                            <td className="text-right p-2">{row.qty_loaded}</td>
                                            <td className="text-right p-2">{row.qty_delivered}</td>
                                            <td className="text-right p-2 text-amber-600">{row.qty_returned}</td>
                                            <td className="text-right p-2 text-red-600">{row.qty_damaged}</td>
                                            <td className={`text-right p-2 font-semibold bg-blue-50 ${row.expected_unload > 0 ? 'text-blue-600' : 'text-green-600'
                                                }`}>
                                                {row.expected_unload}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-4 p-3 bg-gray-50 rounded-lg text-xs text-gray-600">
                            <p><strong>Expected Unload</strong> = What should be in the van at end of day</p>
                            <p>Calculated from: Loaded - Delivered (returns/damages already subtracted)</p>
                        </div>
                    </div>
                )}
            </Card>

            {/* Financial Summary */}
            {closurePreview?.financials && (
                <Card className="p-4">
                    <h4 className="font-semibold text-gray-900 mb-4">Financial Summary</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-sm text-gray-500">Total Orders</p>
                            <p className="text-xl font-bold">{closurePreview.financials.orderBreakdown.total}</p>
                        </div>
                        <div className="bg-green-50 p-3 rounded-lg">
                            <p className="text-sm text-gray-500">Delivered</p>
                            <p className="text-xl font-bold text-green-600">
                                {closurePreview.financials.orderBreakdown.delivered}
                            </p>
                        </div>
                        <div className="bg-blue-50 p-3 rounded-lg">
                            <p className="text-sm text-gray-500">Net Value</p>
                            <p className="text-xl font-bold text-blue-600">
                                ₹{closurePreview.financials.totalNet.toLocaleString()}
                            </p>
                        </div>
                        <div className="bg-emerald-50 p-3 rounded-lg">
                            <p className="text-sm text-gray-500">Collected</p>
                            <p className="text-xl font-bold text-emerald-600">
                                ₹{closurePreview.financials.totalCollected.toLocaleString()}
                            </p>
                        </div>
                    </div>
                    {closurePreview.financials.totalCredit > 0 && (
                        <div className="mt-4 bg-amber-50 p-3 rounded-lg">
                            <p className="text-sm text-amber-700">
                                Credit Outstanding: ₹{closurePreview.financials.totalCredit.toLocaleString()}
                            </p>
                        </div>
                    )}
                </Card>
            )}

            {/* Close Button */}
            <div className="flex justify-end gap-4">
                <Button
                    variant="outline"
                    onClick={previewClosure}
                    disabled={closureLoading}
                >
                    <RefreshCw className={`h-4 w-4 mr-2 ${closureLoading ? 'animate-spin' : ''}`} />
                    Refresh Preview
                </Button>
                <Button
                    onClick={handleClose}
                    disabled={closureLoading}
                >
                    <Lock className="h-4 w-4 mr-2" />
                    Close Trip
                </Button>
            </div>

            {/* Errors */}
            {(stockError || closureError) && (
                <div className="bg-red-50 border border-red-200 p-4 rounded-lg text-red-700">
                    {stockError || closureError}
                </div>
            )}
        </div>
    );
};

// ============================================================================
// FINPRO BATCHES TAB
// ============================================================================

interface FinProBatchesTabProps {
    selectedDate: string;
    onDateChange: (date: string) => void;
}

const FinProBatchesTab: React.FC<FinProBatchesTabProps> = ({ selectedDate, onDateChange }) => {
    const {
        batches,
        generateResult,
        loading,
        error,
        generateBatches,
        saveBatches,
        loadBatches,
        exportForFinPro,
        deleteBatches
    } = useFinProBatches();

    const [showJson, setShowJson] = useState(false);
    const [exportData, setExportData] = useState<string | null>(null);

    // Load existing batches on date change
    useEffect(() => {
        loadBatches(selectedDate);
    }, [selectedDate, loadBatches]);

    const handleGenerate = async () => {
        const success = await generateBatches(selectedDate);
        if (success) {
            toast.success(`Generated ${generateResult?.summary.totalBatches || 0} batches`);
        }
    };

    const handleSave = async () => {
        const success = await saveBatches();
        if (success) {
            toast.success('Batches saved to database');
            await loadBatches(selectedDate);
        }
    };

    const handleExport = async () => {
        const data = await exportForFinPro(selectedDate);
        if (data) {
            setExportData(JSON.stringify(data, null, 2));
            setShowJson(true);
        }
    };

    const handleDownload = () => {
        if (!exportData) return;
        const blob = new Blob([exportData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `finpro-export-${selectedDate}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleDelete = async () => {
        if (!confirm('Delete all batches for this date? This cannot be undone.')) return;
        const success = await deleteBatches(selectedDate);
        if (success) {
            toast.success('Batches deleted');
        }
    };

    return (
        <div className="space-y-6">
            {/* Date Selector and Actions */}
            <Card className="p-4">
                <div className="flex flex-wrap items-center gap-4">
                    <div>
                        <label className="text-sm text-gray-500">Select Date</label>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => onDateChange(e.target.value)}
                            className="ml-2 p-2 border rounded-lg"
                        />
                    </div>
                    <div className="flex gap-2 ml-auto">
                        <Button variant="outline" onClick={handleGenerate} disabled={loading}>
                            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                            Generate Batches
                        </Button>
                        {batches.length > 0 && !batches[0].id && (
                            <Button onClick={handleSave} disabled={loading}>
                                Save Batches
                            </Button>
                        )}
                        {batches.length > 0 && batches[0].id && (
                            <>
                                <Button onClick={handleExport} disabled={loading}>
                                    <FileOutput className="h-4 w-4 mr-2" />
                                    Export JSON
                                </Button>
                                <Button variant="outline" onClick={handleDelete} disabled={loading}>
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </Card>

            {/* Summary */}
            {generateResult?.summary && (
                <Card className="p-4">
                    <h4 className="font-semibold text-gray-900 mb-4">Batch Summary</h4>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <div className="bg-indigo-50 p-3 rounded-lg text-center">
                            <p className="text-sm text-gray-500">Total Batches</p>
                            <p className="text-2xl font-bold text-indigo-600">
                                {generateResult.summary.totalBatches}
                            </p>
                        </div>
                        <div className="bg-blue-50 p-3 rounded-lg text-center">
                            <p className="text-sm text-gray-500">Individual</p>
                            <p className="text-2xl font-bold text-blue-600">
                                {generateResult.summary.individualBatches}
                            </p>
                        </div>
                        <div className="bg-green-50 p-3 rounded-lg text-center">
                            <p className="text-sm text-gray-500">Merged</p>
                            <p className="text-2xl font-bold text-green-600">
                                {generateResult.summary.mergedBatches}
                            </p>
                        </div>
                        <div className="bg-emerald-50 p-3 rounded-lg text-center">
                            <p className="text-sm text-gray-500">Total Net</p>
                            <p className="text-xl font-bold text-emerald-600">
                                ₹{generateResult.summary.totalNet.toLocaleString()}
                            </p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg text-center">
                            <p className="text-sm text-gray-500">Total Cash</p>
                            <p className="text-xl font-bold">
                                ₹{generateResult.summary.totalCash.toLocaleString()}
                            </p>
                        </div>
                    </div>
                </Card>
            )}

            {/* Batches List */}
            {batches.length > 0 && (
                <Card className="p-4">
                    <h4 className="font-semibold text-gray-900 mb-4">
                        Generated Batches ({batches.length})
                    </h4>
                    <div className="space-y-3">
                        {batches.map((batch, index) => (
                            <div
                                key={batch.id || index}
                                className="border rounded-lg p-4"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className={`px-2 py-1 text-xs font-medium rounded ${batch.batch_type === 'MERGED_CASH_QR'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-blue-100 text-blue-800'
                                            }`}>
                                            {batch.batch_type.replace(/_/g, ' ')}
                                        </span>
                                        <span className="text-sm text-gray-500">
                                            #{batch.batch_number}
                                        </span>
                                    </div>
                                    <span className="font-bold">
                                        ₹{batch.total_net.toLocaleString()}
                                    </span>
                                </div>
                                {batch.customer_name && (
                                    <p className="text-sm text-gray-600">
                                        {batch.customer_name}
                                        {batch.customer_pan && ` (PAN: ${batch.customer_pan})`}
                                    </p>
                                )}
                                <p className="text-xs text-gray-400 mt-1">
                                    {batch.source_order_ids.length} orders • {batch.lines.length} line items
                                </p>
                            </div>
                        ))}
                    </div>
                </Card>
            )}

            {/* Empty State */}
            {batches.length === 0 && !loading && (
                <Card className="p-8 text-center">
                    <FileOutput className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900">No Batches</h3>
                    <p className="text-gray-500 mt-2">
                        Click "Generate Batches" to create FinPro export batches for the selected date.
                    </p>
                </Card>
            )}

            {/* JSON Export Modal */}
            {showJson && exportData && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl max-w-4xl w-full max-h-[80vh] overflow-hidden m-4">
                        <div className="p-4 border-b flex items-center justify-between">
                            <h3 className="font-semibold">FinPro Export JSON</h3>
                            <div className="flex gap-2">
                                <Button size="sm" onClick={handleDownload}>
                                    <Download className="h-4 w-4 mr-2" />
                                    Download
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => setShowJson(false)}>
                                    Close
                                </Button>
                            </div>
                        </div>
                        <div className="p-4 overflow-auto max-h-[60vh]">
                            <pre className="text-xs bg-gray-50 p-4 rounded-lg overflow-x-auto">
                                {exportData}
                            </pre>
                        </div>
                    </div>
                </div>
            )}

            {/* Error */}
            {error && (
                <div className="bg-red-50 border border-red-200 p-4 rounded-lg text-red-700">
                    {error}
                </div>
            )}
        </div>
    );
};

export default FinProDashboard;
