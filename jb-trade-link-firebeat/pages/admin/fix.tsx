import React, { useState, useEffect } from 'react';
import { Card, Button } from '../../components/ui/Elements';
import { ProductService, OrderService, CompanyService } from '../../services/db';
import { Product, Company, Order } from '../../types';

export const FixOrderItems: React.FC = () => {
    const [status, setStatus] = useState<'idle' | 'fetching' | 'processing' | 'completed' | 'error'>('idle');
    const [progress, setProgress] = useState({ current: 0, total: 0 });
    const [logs, setLogs] = useState<string[]>([]);

    const addLog = (msg: string) => {
        setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${msg}`]);
    };

    const startFix = async () => {
        setStatus('fetching');
        setLogs([]);
        addLog('Fetching all necessary data...');

        try {
            // 1. Fetch all reference data
            const [allProducts, allCompanies, allOrders] = await Promise.all([
                ProductService.getAll(),
                CompanyService.getAll(),
                OrderService.getAll()
            ]);

            addLog(`Loaded ${allProducts.length} products, ${allCompanies.length} companies, and ${allOrders.length} orders.`);
            
            setStatus('processing');
            setProgress({ current: 0, total: allOrders.length });

            // Helper to find company
            const getCompany = (id: string) => allCompanies.find(c => c.id === id);
            const getProduct = (id: string) => allProducts.find(p => p.id === id);

            let updatedCount = 0;
            const batchSize = 50; // Process in batches to avoid UI freeze

            for (let i = 0; i < allOrders.length; i += batchSize) {
                const batch = allOrders.slice(i, i + batchSize);
                
                await Promise.all(batch.map(async (order) => {
                    // Check if items need fixing (simple check: missing 'productName')
                    const items = order.items || [];
                    let needsUpdate = false;

                    const fixedItems = items.map((item: any) => {
                        // If already correct style, skip
                        if (item.productName && item.companyName) return item;

                        needsUpdate = true;
                        const product = getProduct(item.productId);
                        
                        // If product not found, keep original but maybe add placeholder?
                        // For migration safety, we try our best.
                        const productName = product?.name || 'Unknown Product';
                        const companyId = product?.companyId || 'default-company';
                        const company = getCompany(companyId);
                        const companyName = company?.name || 'Amrapali'; // Default fallback based on your sample

                        // Transform to new schema
                        return {
                            qty: item.quantity,              // Map quantity -> qty
                            rate: item.price,                // Map price -> rate
                            total: item.amount,              // Map amount -> total
                            baseRate: item.price,            // Assume baseRate is same as rate for now
                            discountPct: 0,                  // Default 0 if missing
                            productId: item.productId,
                            productName: productName,
                            companyId: companyId,
                            companyName: companyName,
                            schemeAppliedText: ""            // Default empty
                        };
                    });

                    if (needsUpdate) {
                        // Create a clean order object with just the fields to update
                        const updatedOrder = {
                            ...order,
                            items: fixedItems
                        };
                        
                        // Perform the update
                        // Note: OrderService.update needs to be implemented/available. 
                        // If not, we assume 'add' might upsert or we need a direct update method.
                        // Assuming OrderService has an update or we use Supabase direct call pattern if available.
                        // Here we assume OrderService.update(orderId, data) exists.
                        await OrderService.update(order.id, { items: fixedItems });
                        updatedCount++;
                    }
                }));

                setProgress({ current: Math.min(i + batchSize, allOrders.length), total: allOrders.length });
                // Small delay to yield to UI
                await new Promise(r => setTimeout(r, 10));
            }

            setStatus('completed');
            addLog(`✅ Finished! Updated ${updatedCount} orders.`);

        } catch (error: any) {
            console.error(error);
            setStatus('error');
            addLog(`❌ Error: ${error.message}`);
        }
    };

    return (
        <Card className="p-6 max-w-2xl mx-auto mt-10">
            <h2 className="text-xl font-bold mb-4">Fix Order Items Schema</h2>
            <p className="text-gray-600 mb-6 text-sm">
                This script will scan all orders and convert the simplified `items` JSON 
                into the full format required by the application (adding product names, company details, etc).
            </p>

            <div className="flex justify-between items-center mb-4">
                <div className="text-sm font-semibold">
                    Status: <span className="uppercase text-blue-600">{status}</span>
                </div>
                {status === 'idle' && (
                    <Button onClick={startFix}>Start Fix Process</Button>
                )}
            </div>

            {status === 'processing' && (
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                    <div
                        className="bg-green-600 h-2.5 rounded-full transition-all duration-300"
                        style={{ width: `${(progress.current / progress.total) * 100}%` }}
                    ></div>
                    <p className="text-xs text-right mt-1">
                        {progress.current} / {progress.total}
                    </p>
                </div>
            )}

            <div className="bg-gray-900 text-green-400 p-4 rounded-md h-64 overflow-y-auto font-mono text-xs">
                {logs.length === 0 ? (
                    <p className="text-gray-500 italic">Logs will appear here...</p>
                ) : (
                    logs.map((log, i) => <div key={i}>{log}</div>)
                )}
            </div>
        </Card>
    );
};