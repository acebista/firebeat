
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

const supabase = createClient(supabaseUrl!, supabaseKey!);

async function runQuery() {
    const table = process.argv[2] || 'orders';
    const limit = parseInt(process.argv[3] || '5');

    console.log(`Querying ${table} (limit ${limit})...`);

    const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(limit);

    if (error) {
        console.error('Query failed:', error.message);
        process.exit(1);
    }

    console.log(JSON.stringify(data, null, 2));
}

runQuery();
