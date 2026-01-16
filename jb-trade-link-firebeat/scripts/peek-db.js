/**
 * Peek into Companies and Products table
 */
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const envLines = envContent.split('\n');
const env = {};
envLines.forEach(line => {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) {
        env[match[1].trim()] = match[2].trim();
    }
});

const SUPABASE_URL = env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function peekDatabase() {
    console.log('🔍 Peeking into Database...\n');

    // 1. Query Companies
    const { data: companies, error: compError } = await supabase.from('companies').select('*');
    if (compError) {
        console.error('❌ Companies Error:', compError);
    } else {
        console.log(`🏢 COMPANIES (${companies.length}):`);
        console.table(companies);
    }

    console.log('\n' + '─'.repeat(50) + '\n');

    // 2. Query Products (Sample 10)
    const { data: products, error: prodError } = await supabase.from('products').select('*').limit(10);
    if (prodError) {
        console.error('❌ Products Error:', prodError);
    } else {
        console.log(`📦 PRODUCTS (Total sample 10, total count in DB check follows):`);
        console.table(products.map(p => ({
            id: p.id,
            name: p.name,
            company: p.companyName,
            rate: p.baseRate,
            disc_rate: p.discountedRate
        })));

        const { count } = await supabase.from('products').select('*', { count: 'exact', head: true });
        console.log(`📈 Total Products in DB: ${count}`);
    }
}

peekDatabase();
