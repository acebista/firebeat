import React, { useMemo, useState } from 'react';
import { Modal } from '../ui/Modal';
import { Card, Button, Badge } from '../ui/Elements';
import { CheckCircle, AlertCircle, Package, Info, Filter, Users, Search, Download, Printer, Table as TableIcon } from 'lucide-react';
import { DeliveryReportRow } from '../../pages/admin/reports/DeliveryRepo';
import { VatBill, parseReturnsFromRemarks, parseDamagesFromRemarks } from '../../utils/vatBilling';
import { printContent } from '../../lib/printUtils';

interface VatTallyModalProps {
    isOpen: boolean;
    onClose: () => void;
    rows: DeliveryReportRow[];
    generatedBills: VatBill[];
}

interface TallyItem {
    productName: string;
    tripOriginalQty: number;
    tripReturnsQty: number;
    tripDamagesQty: number;
    expectedNetQty: number; // Trip - Returns
    actualVatQty: number;
    difference: number;
    unloadQty: number; // Returns + Diff (or Original - Vat)
    status: 'match' | 'mismatch';
    reasons: string[];
}

export const VatTallyModal: React.FC<VatTallyModalProps> = ({ isOpen, onClose, rows, generatedBills }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'match' | 'mismatch'>('all');

    // Determine the context of the report
    const filterContext = useMemo(() => {
        const users = new Set(rows.map(r => r.deliveryUserName).filter(Boolean));
        const dates = new Set(rows.map(r => r.date).filter(Boolean));

        return {
            invoiceCount: rows.length,
            userCount: users.size,
            users: Array.from(users).slice(0, 3).join(', ') + (users.size > 3 ? ` +${users.size - 3} more` : ''),
            date: Array.from(dates).join(', ')
        };
    }, [rows]);

    const tallyData = useMemo(() => {
        const productMap = new Map<string, {
            original: number;
            returns: number;
            damages: number;
            vat: number;
            failed: number;
        }>();

        // 1. Initialize Product Map with Trip Data
        rows.forEach(row => {
            const orderItems = row.order.items || [];
            // "Not Billed" = Cancelled, Failed, Returned, or still Dispatched/Rescheduled
            const isNotBilled = ['cancelled', 'failed', 'returned', 'dispatched', 'approved'].includes(row.status.toLowerCase());

            orderItems.forEach(item => {
                const name = item.tempProductName || item.productName || 'Unknown';
                const qty = Number(item.quantity || item.qty) || 0;

                if (!productMap.has(name)) {
                    productMap.set(name, { original: 0, returns: 0, damages: 0, vat: 0, failed: 0 });
                }
                const stats = productMap.get(name)!;
                stats.original += qty;
                if (isNotBilled) stats.failed += qty;
            });
        });

        // Helper for robust matching
        const findMatch = (rawName: string) => {
            if (productMap.has(rawName)) return rawName;
            const norm = rawName.toLowerCase().trim();
            // Try normalized match
            for (const key of productMap.keys()) {
                if (key.toLowerCase().trim() === norm) return key;
            }
            // Try partial match
            for (const key of productMap.keys()) {
                const kNorm = key.toLowerCase().trim();
                if (kNorm.includes(norm) || norm.includes(kNorm)) return key;
            }
            return null;
        };

        // 2. Add Returns/Damages from Remarks
        rows.forEach(row => {
            const returns = parseReturnsFromRemarks(row.order.remarks || '');
            const damages = parseDamagesFromRemarks(row.order.remarks || '');

            returns.forEach((qty, name) => {
                const match = findMatch(name);
                if (match) productMap.get(match)!.returns += qty;
            });

            damages.forEach((qty, name) => {
                const match = findMatch(name);
                if (match) productMap.get(match)!.damages += qty;
            });
        });

        // 3. Add Quantities from Generated VAT Bills
        generatedBills.forEach(bill => {
            bill.items.forEach(item => {
                const match = findMatch(item.productName);
                if (match) {
                    productMap.get(match)!.vat += item.quantity;
                } else {
                    // This is unexpected as VAT bills are derived from same rows, but for safety:
                    productMap.set(item.productName, {
                        original: 0,
                        returns: 0,
                        damages: 0,
                        vat: item.quantity,
                        failed: 0
                    });
                }
            });
        });

        // 4. Compile Final Tally
        const items: TallyItem[] = Array.from(productMap.entries()).map(([name, stats]) => {
            const expectedNet = stats.original - stats.returns;
            const actualVat = stats.vat;
            const totalBilledAndFailed = actualVat + stats.failed + stats.damages;
            const totalDiff = stats.original - stats.returns - totalBilledAndFailed;

            const diff = expectedNet - actualVat;
            const reasons: string[] = [];

            let isExplained = false;

            if (diff !== 0) {
                if (stats.failed > 0) {
                    reasons.push(`${stats.failed} units on Failed/Pending orders (No Billing)`);
                }
                if (stats.damages > 0) {
                    reasons.push(`${stats.damages} units marked as Damages (Excluded)`);
                }

                if (Math.abs(totalDiff) < 0.1) {
                    isExplained = true;
                } else {
                    reasons.push(`Unexplained gap of ${totalDiff} units`);
                }
            } else {
                isExplained = true;
            }

            return {
                productName: name,
                tripOriginalQty: stats.original,
                tripReturnsQty: stats.returns,
                tripDamagesQty: stats.damages,
                expectedNetQty: expectedNet,
                actualVatQty: actualVat,
                difference: diff,
                unloadQty: diff + stats.returns,
                status: isExplained ? 'match' : 'mismatch' as any,
                reasons
            };
        }).sort((a, b) => (a.status === 'match' ? 1 : -1));

        return items;
    }, [rows, generatedBills]);

    const filteredTallyData = useMemo(() => {
        return tallyData.filter(item => {
            const matchesSearch = item.productName.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'all' ? true : item.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [tallyData, searchTerm, statusFilter]);

    const summaryStats = useMemo(() => {
        return {
            totalItems: tallyData.length,
            matches: tallyData.filter(i => i.status === 'match').length,
            mismatches: tallyData.filter(i => i.status === 'mismatch').length,
            totalOriginal: tallyData.reduce((s, i) => s + i.tripOriginalQty, 0),
            totalNet: tallyData.reduce((s, i) => s + i.expectedNetQty, 0),
            totalVat: tallyData.reduce((s, i) => s + i.actualVatQty, 0),
            totalUnload: tallyData.reduce((s, i) => s + i.unloadQty, 0),
        };
    }, [tallyData]);

    const exportToCSV = () => {
        const headers = ["Product Name", "Trip Gross", "Sales Return", "Expected Net", "VAT Bill Qty", "Diff", "Unload Qty", "Status"];
        const rows = filteredTallyData.map(i => [
            i.productName,
            i.tripOriginalQty,
            i.tripReturnsQty,
            i.expectedNetQty,
            i.actualVatQty,
            i.difference,
            i.unloadQty,
            i.status.toUpperCase()
        ]);

        const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `VAT_Tally_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const exportToPDF = () => {
        printContent(`VAT Billing Tally - ${filterContext.date}`, 'vat-tally-print-area');
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="VAT Billing Tally (Warehouse Unload Guide)"
            size="xl"
            footer={
                <div className="flex justify-between items-center w-full">
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={exportToCSV}
                            className="text-emerald-700 border-emerald-200 hover:bg-emerald-50"
                        >
                            <TableIcon className="h-4 w-4 mr-2" /> Export CSV
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={exportToPDF}
                            className="text-blue-700 border-blue-200 hover:bg-blue-50"
                        >
                            <Printer className="h-4 w-4 mr-2" /> Print PDF
                        </Button>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" onClick={onClose} className="rounded-xl">Close</Button>
                    </div>
                </div>
            }
        >
            <div className="space-y-6">
                {/* Active Filters Info */}
                <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3 flex flex-wrap gap-4 items-center">
                    <div className="flex items-center gap-1.5 text-xs text-indigo-700 font-bold uppercase">
                        <Filter size={14} /> Active Filter Tally:
                    </div>
                    <div className="flex items-center gap-1 text-xs text-indigo-600 bg-white px-2 py-1 rounded shadow-sm border border-indigo-100">
                        <Package size={12} /> {filterContext.invoiceCount} Invoices
                    </div>
                    <div className="flex items-center gap-1 text-xs text-indigo-600 bg-white px-2 py-1 rounded shadow-sm border border-indigo-100">
                        <Users size={12} /> Users: {filterContext.users}
                    </div>
                    {filterContext.date && (
                        <div className="flex items-center gap-1 text-xs text-indigo-600 bg-white px-2 py-1 rounded shadow-sm border border-indigo-100 uppercase">
                            📅 {filterContext.date}
                        </div>
                    )}
                </div>

                {/* Search and Filters */}
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                        />
                    </div>
                    <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl">
                        {(['all', 'match', 'mismatch'] as const).map((s) => (
                            <button
                                key={s}
                                onClick={() => setStatusFilter(s)}
                                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${statusFilter === s
                                    ? 'bg-white text-indigo-700 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                {s === 'all' ? 'All Items' : s === 'match' ? 'Matches' : 'Mismatches'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Summary Section */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card className="p-3 bg-white border-l-4 border-indigo-500">
                        <p className="text-xs text-gray-500 font-bold uppercase">Total Products</p>
                        <h3 className="text-2xl font-bold text-gray-900">{summaryStats.totalItems}</h3>
                    </Card>
                    <Card className={`p-3 border-l-4 ${summaryStats.mismatches === 0 ? 'border-emerald-500' : 'border-red-500'}`}>
                        <p className={`text-xs font-bold uppercase ${summaryStats.mismatches === 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                            {summaryStats.mismatches === 0 ? 'Billing Verified' : 'Mismatches Found'}
                        </p>
                        <h3 className={`text-2xl font-bold ${summaryStats.mismatches === 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                            {summaryStats.mismatches}
                        </h3>
                    </Card>
                    <Card className="p-3 bg-white border-l-4 border-blue-500">
                        <p className="text-xs text-gray-500 font-bold uppercase">Expected Sales</p>
                        <h3 className="text-2xl font-bold text-blue-900">{summaryStats.totalNet} <span className="text-xs font-normal">units</span></h3>
                    </Card>
                    <Card className="p-3 bg-white border-l-4 border-purple-500">
                        <p className="text-xs text-gray-500 font-bold uppercase">VAT Bill Total</p>
                        <h3 className="text-2xl font-bold text-purple-900">{summaryStats.totalVat} <span className="text-xs font-normal">units</span></h3>
                    </Card>
                    <Card className="p-3 bg-white border-l-4 border-orange-500">
                        <p className="text-xs text-gray-500 font-bold uppercase">Total Unload</p>
                        <h3 className="text-2xl font-bold text-orange-900">{summaryStats.totalUnload} <span className="text-xs font-normal">units</span></h3>
                    </Card>
                </div>

                {/* Tally Detail Table */}
                <div id="vat-tally-print-area" className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 text-sm">
                            <thead className="bg-gray-50 sticky top-0 z-10">
                                <tr>
                                    <th className="px-4 py-3 text-left font-bold text-gray-700">Product Name</th>
                                    <th className="px-4 py-3 text-center font-bold text-gray-700">Trip (Gross)</th>
                                    <th className="px-4 py-3 text-center font-bold text-red-600">Sales Return</th>
                                    <th className="px-4 py-3 text-center font-bold text-blue-600">Expected (Net)</th>
                                    <th className="px-4 py-3 text-center font-bold text-purple-600">VAT Bill Qty</th>
                                    <th className="px-4 py-3 text-center font-bold text-gray-700">Diff</th>
                                    <th className="px-4 py-3 text-center font-bold text-orange-600">Unload Qty</th>
                                    <th className="px-4 py-3 text-left font-bold text-gray-700">Status / Reason</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredTallyData.map((item, idx) => (
                                    <tr key={idx} className={item.status === 'mismatch' ? 'bg-red-50/30' : 'hover:bg-gray-50'}>
                                        <td className="px-4 py-3 font-medium text-gray-900">{item.productName}</td>
                                        <td className="px-4 py-3 text-center text-gray-600">{item.tripOriginalQty}</td>
                                        <td className="px-4 py-3 text-center text-red-500 font-medium">{item.tripReturnsQty > 0 ? `-${item.tripReturnsQty}` : '0'}</td>
                                        <td className="px-4 py-3 text-center font-bold text-blue-600">{item.expectedNetQty}</td>
                                        <td className="px-4 py-3 text-center font-bold text-purple-600">{item.actualVatQty}</td>
                                        <td className={`px-4 py-3 text-center font-bold ${item.difference === 0 ? 'text-gray-400' : 'text-red-600'}`}>
                                            {item.difference > 0 ? `+${item.difference}` : item.difference === 0 ? '0' : item.difference}
                                        </td>
                                        <td className="px-4 py-3 text-center font-black text-orange-600">
                                            {item.unloadQty}
                                        </td>
                                        <td className="px-4 py-3">
                                            {item.status === 'match' ? (
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-xs uppercase">
                                                        <CheckCircle size={14} /> {item.difference === 0 ? 'Correct' : 'Explained'}
                                                    </div>
                                                    {item.reasons.map((r, i) => (
                                                        <div key={i} className="text-[10px] text-gray-500 font-medium leading-tight">
                                                            • {r}
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-1.5 text-red-600 font-bold text-xs uppercase">
                                                        <AlertCircle size={14} /> Mismatch
                                                    </div>
                                                    {item.reasons.map((r, i) => (
                                                        <div key={i} className="text-[10px] text-gray-700 font-bold leading-tight">
                                                            • {r}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {filteredTallyData.length === 0 && (
                                    <tr>
                                        <td colSpan={8} className="px-4 py-8 text-center text-gray-500 italic">
                                            No products found matching your search criteria.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex items-start gap-3">
                    <Info className="h-5 w-5 text-indigo-500 shrink-0 mt-0.5" />
                    <div>
                        <p className="text-xs text-gray-700 font-bold">Logistics Verification Logic:</p>
                        <p className="text-[10px] text-gray-500 mt-1 leading-relaxed">
                            This report guides the warehouse team on items to be physically unloaded from the vehicle.
                            <strong>Unload Quantity</strong> = Trip Difference + Sales Returns.
                            It verifies that your trip inventory perfectly matches the current set of VAT bills.
                        </p>
                    </div>
                </div>
            </div>

        </Modal>

    );
};
