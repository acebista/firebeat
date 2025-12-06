
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// --- Configuration ---
const SUPABASE_URL = 'https://qlosefnvwvmqeebfqdcg.supabase.co';
const SUPABASE_KEY = 'sb_publishable_GmOKGTI8IFmv9q-KFJoICg_397GdY1g';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// --- Helper for ESM __dirname ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Mapping Logic ---

function mapOldInvoiceToNewOrder(oldInvoice) {
    // Calculate totals if missing
    const items = oldInvoice.items.map(item => {
        const qty = item.qty || 0;
        const baseRate = item.rate || 0; // Assuming 'rate' in old data was Base Rate
        const netTotal = item.net || (item.gross - (item.discountAmount || 0));

        // Calculate Net Rate per piece
        const netRate = qty > 0 ? (netTotal / qty) : baseRate;

        // Calculate Total Discount %
        const discountPct = (item.primaryDiscountPct || 0) + (item.schemeDiscountPct || 0);

        return {
            productId: item.productId || 'unknown',
            productName: item.productName || 'Unknown Product',
            qty: qty,
            rate: Number(netRate.toFixed(2)), // Final/Net Rate
            total: Number(netTotal.toFixed(2)),
            baseRate: baseRate,
            discountPct: discountPct,
            companyId: item.companyId,
            companyName: item.companyName
        };
    });

    const totalAmount = oldInvoice.grandTotal || oldInvoice.totalAmount || items.reduce((sum, i) => sum + i.total, 0);

    return {
        id: oldInvoice.id || oldInvoice.invoiceNo, // Use ID or InvoiceNo as PK
        customerId: oldInvoice.customerId || 'unknown_customer', // You might need a mapping for this
        customerName: oldInvoice.customerName || 'Unknown Customer',
        salespersonId: oldInvoice.salespersonId || 'unknown_agent',
        salespersonName: oldInvoice.salespersonName || 'Unknown Agent',
        date: oldInvoice.date || new Date().toISOString().split('T')[0],
        totalItems: items.reduce((sum, i) => sum + i.qty, 0),
        totalAmount: Number(totalAmount.toFixed(2)),
        status: 'delivered', // Assuming migrated invoices are completed
        items: items // Stored as JSONB in Supabase
    };
}

// --- Main Execution ---

async function migrate() {
    try {
        // 1. Load Data
        // Replace 'old_data.json' with your actual file path
        const dataPath = path.join(__dirname, 'old_data.json');

        if (!fs.existsSync(dataPath)) {
            console.error(`❌ Data file not found at: ${dataPath}`);
            console.log("Please create 'old_data.json' with your invoice array.");
            return;
        }

        const rawData = fs.readFileSync(dataPath, 'utf-8');
        const oldInvoices = JSON.parse(rawData);

        console.log(`Found ${oldInvoices.length} invoices to migrate.`);

        // 2. Map Data
        const newOrders = oldInvoices.map(mapOldInvoiceToNewOrder);

        // 3. Batch Insert
        const BATCH_SIZE = 100;
        let successCount = 0;
        let failCount = 0;

        for (let i = 0; i < newOrders.length; i += BATCH_SIZE) {
            const batch = newOrders.slice(i, i + BATCH_SIZE);

            const { error } = await supabase.from('orders').upsert(batch);

            if (error) {
                console.error(`❌ Batch ${i} failed:`, error.message);
                failCount += batch.length;
            } else {
                console.log(`✅ Batch ${i} - ${i + batch.length} inserted successfully.`);
                successCount += batch.length;
            }
        }

        console.log(`\nMigration Complete!`);
        console.log(`Success: ${successCount}`);
        console.log(`Failed: ${failCount}`);

    } catch (err) {
        console.error("Unexpected Error:", err);
    }
}

migrate();
