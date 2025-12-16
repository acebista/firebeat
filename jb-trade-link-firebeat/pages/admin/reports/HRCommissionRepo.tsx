import React, { useMemo } from 'react';
import { Card, Button } from '../../../components/ui/Elements';
import { SalesReportRow } from '../../../types/reports';
import { Product, Company } from '../../../types';
import { CommissionRate } from '../../../types/hr'; // Import CommissionRate type
import { Download, Printer } from 'lucide-react';
import { printContent } from '../../../lib/printUtils';

interface HRCommissionReportProps {
    data: SalesReportRow[];
    products: Product[];
    companies: Company[];
    commissionRates: CommissionRate[]; // Add commissionRates prop
}

export const HRCommissionReport: React.FC<HRCommissionReportProps> = ({ data, products, companies, commissionRates }) => {

    // Create lookups separately inside useMemo
    const { productMap, companyMap } = useMemo(() => {
        const pMap = new Map<string, Product>();
        products.forEach(p => pMap.set(p.id, p));

        const cMap = new Map<string, Company>();
        companies.forEach(c => cMap.set(c.id, c));
        return { productMap: pMap, companyMap: cMap };
    }, [products, companies]);

    // Group Commission Rates by Company ID
    const companyRatesMap = useMemo(() => {
        const map = new Map<string, CommissionRate[]>();
        commissionRates.forEach(rate => {
            const cId = rate.company_id || 'default';
            if (!map.has(cId)) map.set(cId, []);
            map.get(cId)!.push(rate);
        });
        return map;
    }, [commissionRates]);

    // Calculate commissions
    const commissionData = useMemo(() => {
        // Intermediate aggregation: Salesperson -> Company -> Data
        const spCompanyMap = new Map<string, Map<string, {
            totalVolume: number;
            items: Array<{
                orderId: string;
                date: string;
                customerName: string;
                itemTotal: number;
                productId: string;
                isOverride: boolean;
                overrideRate?: number;
            }>
        }>>();

        // 1. Group items by Salesperson and Company
        data.forEach(row => {
            const order = row.order;
            let items = order.items;

            if (typeof items === 'string') {
                try { items = JSON.parse(items); } catch (e) { items = []; }
            }

            if (!Array.isArray(items)) return;

            const spName = row.salespersonName || 'Unknown';
            if (!spCompanyMap.has(spName)) {
                spCompanyMap.set(spName, new Map());
            }

            items.forEach((item: any) => {
                const product = productMap.get(item.productId);
                if (!product) return;

                const companyId = product.companyId;
                // Note: If companyId is missing on product, we might default or skip. 
                // Assuming minimal data integrity here.
                if (!companyId) return;

                const spMap = spCompanyMap.get(spName)!;
                if (!spMap.has(companyId)) {
                    spMap.set(companyId, { totalVolume: 0, items: [] });
                }

                const entry = spMap.get(companyId)!;
                const itemTotal = Number(item.total || item.amount) || 0;

                // Check Override
                let isOverride = false;
                let overrideRate = undefined;
                if (product.commission_rate !== undefined && product.commission_rate !== null) {
                    isOverride = true;
                    overrideRate = product.commission_rate;
                }

                entry.totalVolume += itemTotal;
                entry.items.push({
                    orderId: row.invoiceNo,
                    date: row.date,
                    customerName: row.customerName,
                    itemTotal,
                    productId: product.id,
                    isOverride,
                    overrideRate
                });
            });
        });

        // 2. Calculate Commission per Group
        const salespersonResults = new Map<string, {
            name: string;
            totalSales: number;
            totalCommission: number;
            orders: number; // Distinct orders
            details: any[]; // Flattened details for report if needed
        }>();

        spCompanyMap.forEach((companyGroups, spName) => {
            // Initialize Result Entry
            if (!salespersonResults.has(spName)) {
                salespersonResults.set(spName, {
                    name: spName,
                    totalSales: 0,
                    totalCommission: 0,
                    orders: 0,
                    details: []
                });
            }
            const spResult = salespersonResults.get(spName)!;
            const seenOrders = new Set<string>();

            companyGroups.forEach((groupData, companyId) => {
                const company = companyMap.get(companyId);
                const commissionType = company?.commission_type || 'flat';
                const totalVolume = groupData.totalVolume;

                // Determine Base Rate for this Company Group
                let baseRate = 0;

                if (commissionType === 'flat') {
                    baseRate = company?.commission_rate || 0;
                } else if (commissionType === 'slab') {
                    // Find applicable slab
                    // Logic: Find rate where min_amount <= totalVolume <= (max_amount || Infinity)
                    // We reverse sort (or sort desc) by min_amount to ensure that if totalVolume equals a boundary (e.g. 10000),
                    // we match the higher tier (10000-20000) instead of the lower one (0-10000).
                    const rates = [...(companyRatesMap.get(companyId) || [])].sort((a, b) => b.min_amount - a.min_amount);

                    const slab = rates.find(r =>
                        totalVolume >= r.min_amount &&
                        (r.max_amount === null || totalVolume <= r.max_amount)
                    );

                    if (slab) {
                        baseRate = slab.rate_pct;
                    } else {
                        // Fallback if no slab matches (e.g. below min)? 0 usually.
                        baseRate = 0;
                    }
                }

                // Apply Rates to Items
                groupData.items.forEach(item => {
                    const effectiveRate = item.isOverride ? item.overrideRate! : baseRate;
                    const commission = item.itemTotal * (effectiveRate / 100);

                    spResult.totalCommission += commission;
                    spResult.totalSales += item.itemTotal;

                    if (!seenOrders.has(item.orderId)) {
                        seenOrders.add(item.orderId);
                        spResult.orders += 1;
                    }
                });
            });
        });

        return Array.from(salespersonResults.values());
    }, [data, productMap, companyMap, companyRatesMap]);

    const totalCommission = commissionData.reduce((sum, sp) => sum + sp.totalCommission, 0);
    const totalSales = commissionData.reduce((sum, sp) => sum + sp.totalSales, 0);

    const handlePrint = () => {
        printContent('HR & Commission Report', 'hr-report-print');
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-800">HR & Commissions Report</h3>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handlePrint}>
                        <Printer className="mr-2 h-4 w-4" /> Print
                    </Button>
                    <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" /> Export Excel
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-4 bg-indigo-50 border-indigo-100">
                    <div className="text-sm text-indigo-600 font-medium">Total Sales (Selected Period)</div>
                    <div className="text-2xl font-bold text-indigo-900">₹{totalSales.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                </Card>
                <Card className="p-4 bg-emerald-50 border-emerald-100">
                    <div className="text-sm text-emerald-600 font-medium">Total Commission Payable</div>
                    <div className="text-2xl font-bold text-emerald-900">₹{totalCommission.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                </Card>
            </div>

            <Card className="overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salesperson</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total Sales</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Commission</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {commissionData.length === 0 ? (
                            <tr><td colSpan={4} className="p-8 text-center text-gray-500">No data found.</td></tr>
                        ) : (
                            commissionData.map((sp) => (
                                <tr key={sp.name} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{sp.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center text-gray-500">{sp.orders}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-gray-900">₹{sp.totalSales.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right font-bold text-emerald-600">₹{sp.totalCommission.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </Card>

            {/* Print View */}
            <div id="hr-report-print" style={{ display: 'none' }}>
                <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                    <h2>HR & Commission Report</h2>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10pt' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f3f4f6' }}>
                            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Salesperson</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>Orders</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'right' }}>Total Sales</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'right' }}>Commission</th>
                        </tr>
                    </thead>
                    <tbody>
                        {commissionData.map((sp) => (
                            <tr key={sp.name}>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{sp.name}</td>
                                <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>{sp.orders}</td>
                                <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'right' }}>{sp.totalSales.toFixed(2)}</td>
                                <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'right', fontWeight: 'bold' }}>{sp.totalCommission.toFixed(2)}</td>
                            </tr>
                        ))}
                        <tr style={{ backgroundColor: '#f0fdf4', fontWeight: 'bold' }}>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>Total</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>{commissionData.reduce((a, b) => a + b.orders, 0)}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'right' }}>{totalSales.toFixed(2)}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'right' }}>{totalCommission.toFixed(2)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};
