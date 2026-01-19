
import { createClient } from '@supabase/supabase-js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');

const getEnv = (key: string) => {
    const match = envContent.match(new RegExp(`^${key}=(.*)$`, 'm'));
    return match ? match[1].trim() : undefined;
};

const supabaseUrl = getEnv('VITE_SUPABASE_URL');
const supabaseKey = getEnv('SUPABASE_SERVICE_ROLE_KEY') || getEnv('VITE_SUPABASE_ANON_KEY');

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkInvoice() {
    const invoiceId = '260116-059';
    console.log(`Checking invoice: ${invoiceId}...`);

    const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', invoiceId)
        .single();

    if (error) {
        // Try searching in invoice_number if id doesn't match
        const { data: data2, error: error2 } = await supabase
            .from('orders')
            .select('*')
            .ilike('id', `%${invoiceId}%`);

        if (error2 || !data2 || data2.length === 0) {
            console.error('Order not found:', error?.message || error2?.message);
            return;
        }
        console.log('Match found via partial search:');
        printOrder(data2[0]);
    } else {
        printOrder(data);
    }
}

function printOrder(order: any) {
    console.log('--- Order Details ---');
    console.log('ID:', order.id);
    console.log('Status:', order.status);
    console.log('Payment Method:', order.paymentMethod || order.paymentMode);
    console.log('Remarks:', order.remarks);
    console.log('Delivery Status:', order.deliveryStatus);
    console.log('Payment Details:', JSON.stringify(order.paymentDetails, null, 2));

    const isCheque = (order.paymentMethod === 'Cheque' || order.paymentMode === 'Cheque');
    console.log('\nResult: Is it marked as Cheque?', isCheque ? 'YES ✅' : 'NO ❌');
}

checkInvoice();
