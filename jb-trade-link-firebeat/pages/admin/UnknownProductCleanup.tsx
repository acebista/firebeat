import React, { useEffect, useState } from 'react';
import { OrderService, CompanyService } from '../../services/db';
import { Order, Company } from '../../types';
import { Card, Button, Select } from '../../components/ui/Elements';
import { AlertTriangle } from 'lucide-react';

interface UnknownItem {
    productId: string;
    productName: string;
    occurrences: number;
    orderIds: Set<string>;
    // map orderId -> original items array for that order
    orderItemMap: Map<string, any[]>;
}

export const UnknownProductCleanup: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [unknownMap, setUnknownMap] = useState<Map<string, UnknownItem>>(new Map());
    const [companies, setCompanies] = useState<Company[]>([]);
    const [selectedCompany, setSelectedCompany] = useState<Record<string, string>>({});
    const [updating, setUpdating] = useState(false);

    // Fetch orders and companies on mount
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const orders = await OrderService.getAll();
                const comps = await CompanyService.getAll();
                setCompanies(comps);
                const map = new Map<string, UnknownItem>();
                for (const order of orders) {
                    if (!order.items) continue;
                    let items: any[] = [];
                    try {
                        items = JSON.parse(order.items as any);
                    } catch {
                        continue;
                    }
                    for (const it of items) {
                        if (
                            it.companyId === 'unknown' ||
                            it.companyName === 'Unknown' ||
                            !it.companyName?.trim() ||
                            !it.productName?.trim()
                        ) {
                            const key = it.productId || it.productName || `blank-${order.id}`;
                            const existing = map.get(key);
                            if (existing) {
                                existing.occurrences += 1;
                                existing.orderIds.add(order.id);
                                const arr = existing.orderItemMap.get(order.id) || [];
                                arr.push(it);
                                existing.orderItemMap.set(order.id, arr);
                            } else {
                                const newItem: UnknownItem = {
                                    productId: it.productId,
                                    productName: it.productName,
                                    occurrences: 1,
                                    orderIds: new Set([order.id]),
                                    orderItemMap: new Map([[order.id, [it]]]),
                                };
                                map.set(key, newItem);
                            }
                        }
                    }
                }
                setUnknownMap(map);
            } catch (e) {
                console.error('Failed to load data', e);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleApply = async (productKey: string) => {
        const target = unknownMap.get(productKey);
        if (!target) return;
        const companyId = selectedCompany[productKey];
        if (!companyId) return;
        const company = companies.find(c => c.id === companyId);
        if (!company) return;
        setUpdating(true);
        try {
            for (const orderId of target.orderIds) {
                const ordersArr = await OrderService.getOrdersByIds([orderId]);
                const order = ordersArr[0] as Order;
                if (!order || !order.items) continue;
                let items: any[] = [];
                try {
                    items = JSON.parse(order.items as any);
                } catch {
                    continue;
                }
                const newItems = items.map(it => {
                    const key = it.productId || it.productName;
                    if (key === productKey && (it.companyId === 'unknown' || it.companyName === 'Unknown')) {
                        return { ...it, companyId: company.id, companyName: company.name };
                    }
                    return it;
                });
                await OrderService.updateOrderItems(order.id, newItems);
            }
            // Update UI
            const newMap = new Map(unknownMap);
            newMap.delete(productKey);
            setUnknownMap(newMap);
            const newSel = { ...selectedCompany };
            delete newSel[productKey];
            setSelectedCompany(newSel);
        } catch (e) {
            console.error('Failed to apply cleanup', e);
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-8">
                <p>Loading...</p>
            </div>
        );
    }

    if (unknownMap.size === 0) {
        return (
            <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Unknown Product Cleanup</h2>
                <p>No unknown product entries found.</p>
            </Card>
        );
    }

    return (
        <Card className="p-6 space-y-6">
            <h2 className="text-2xl font-bold mb-4">Unknown Product Cleanup</h2>
            <p className="text-gray-600 mb-4">
                The following products are linked to "Unknown" companies. Choose the correct company and click Apply.
            </p>
            <div className="space-y-4">
                {Array.from(unknownMap.entries()).map(([key, data]) => (
                    <div key={key} className="flex items-center space-x-4 border p-3 rounded-md">
                        <div className="flex-1">
                            <p className="font-medium">{data.productName || '(no name)'}</p>
                            <p className="text-sm text-gray-500">Occurrences: {data.occurrences}</p>
                        </div>
                        <Select
                            label="Company"
                            options={companies.map(c => ({ label: c.name, value: c.id }))}
                            value={selectedCompany[key] || ''}
                            onChange={e => setSelectedCompany({ ...selectedCompany, [key]: e.target.value })}
                        />
                        <Button disabled={!selectedCompany[key] || updating} onClick={() => handleApply(key)}>
                            {updating ? 'Updating...' : 'Apply'}
                        </Button>
                    </div>
                ))}
            </div>
        </Card>
    );
};
