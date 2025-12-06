// scripts/cleanup_unknown_products.ts
// ------------------------------------------------------------
// This script scans all orders for items whose `companyId` or `companyName`
// is set to "unknown"/"Unknown" and allows the user (via terminal prompt)
// to map each distinct unknown product to a real company from the
// `companies` table. The selected mapping is then applied to all matching
// order items and the orders are updated in Supabase.
// ------------------------------------------------------------

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase'; // Re‑use existing client configuration
import { Order, Company } from '../types';
import * as readline from 'readline';

// Helper to ask a question on the command line
function askQuestion(query: string): Promise<string> {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    return new Promise((resolve) => {
        rl.question(query, (answer) => {
            rl.close();
            resolve(answer.trim());
        });
    });
}

interface OrderItem {
    qty: number;
    rate: number;
    total: number;
    baseRate: number;
    companyId: string;
    productId: string;
    companyName: string;
    discountPct: number;
    productName: string;
}

async function main() {
    console.log('🔎 Fetching orders...');
    const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*');
    if (ordersError) {
        console.error('Failed to fetch orders:', ordersError);
        process.exit(1);
    }
    const orders = ordersData as Order[];

    console.log('🏢 Fetching companies...');
    const { data: companiesData, error: companiesError } = await supabase
        .from('companies')
        .select('*');
    if (companiesError) {
        console.error('Failed to fetch companies:', companiesError);
        process.exit(1);
    }
    const companies = companiesData as Company[];

    // Gather all distinct unknown product entries
    const unknownProducts: Map<string, { productName: string; occurrences: number }> = new Map();
    for (const order of orders) {
        if (!order.items) continue; // safety
        let items: OrderItem[] = [];
        try {
            items = JSON.parse(order.items as any);
        } catch (e) {
            console.warn(`⚠️ Could not parse items for order ${order.id}`);
            continue;
        }
        for (const it of items) {
            if (it.companyId === 'unknown' || it.companyName === 'Unknown') {
                const key = it.productId || it.productName;
                const existing = unknownProducts.get(key);
                unknownProducts.set(key, {
                    productName: it.productName,
                    occurrences: existing ? existing.occurrences + 1 : 1,
                });
            }
        }
    }

    if (unknownProducts.size === 0) {
        console.log('✅ No unknown product entries found.');
        return;
    }

    console.log(`🛠️ Found ${unknownProducts.size} distinct unknown product(s).`);

    // Build a mapping of productId -> chosen company
    const productToCompany: Map<string, { companyId: string; companyName: string }> = new Map();

    for (const [productKey, info] of unknownProducts.entries()) {
        console.log('\n---');
        console.log(`Product: ${info.productName} (occurrences: ${info.occurrences})`);
        console.log('Select a company from the list below (or press Enter to skip):');
        companies.forEach((c, idx) => {
            console.log(`${idx + 1}) ${c.name} (id: ${c.id})`);
        });
        const answer = await askQuestion('Enter number or leave blank to skip: ');
        const choice = parseInt(answer, 10);
        if (!isNaN(choice) && choice >= 1 && choice <= companies.length) {
            const chosen = companies[choice - 1];
            productToCompany.set(productKey, { companyId: chosen.id, companyName: chosen.name });
            console.log(`✅ Mapped to ${chosen.name}`);
        } else {
            console.log('⏭️ Skipping this product – it will remain "Unknown"');
        }
    }

    // Apply the mapping back to orders and update them
    console.log('\n🚚 Updating orders...');
    let updatedCount = 0;
    for (const order of orders) {
        if (!order.items) continue;
        let items: OrderItem[] = [];
        try {
            items = JSON.parse(order.items as any);
        } catch {
            continue;
        }
        let changed = false;
        const newItems = items.map((it) => {
            const key = it.productId || it.productName;
            const mapping = productToCompany.get(key);
            if (mapping && (it.companyId === 'unknown' || it.companyName === 'Unknown')) {
                changed = true;
                return {
                    ...it,
                    companyId: mapping.companyId,
                    companyName: mapping.companyName,
                } as OrderItem;
            }
            return it;
        });
        if (changed) {
            const { error } = await supabase
                .from('orders')
                .update({ items: JSON.stringify(newItems) })
                .eq('id', order.id);
            if (error) {
                console.error(`❌ Failed to update order ${order.id}:`, error);
            } else {
                updatedCount++;
                console.log(`✅ Order ${order.id} updated`);
            }
        }
    }

    console.log(`\n✨ Done. ${updatedCount} order(s) were updated.`);
}

main().catch((err) => {
    console.error('Unexpected error:', err);
    process.exit(1);
});
