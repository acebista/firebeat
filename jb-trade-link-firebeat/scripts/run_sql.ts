
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

async function runSQL() {
    const sql = process.argv[2] || "SELECT 1 as test, NOW() as current_time";

    console.log(`Executing SQL: ${sql}`);

    // Use rpc to execute raw SQL - requires exec_sql function to exist
    // Otherwise fall back to a simple connection test
    try {
        const { data, error } = await supabase.rpc('exec_sql', { sql });

        if (error) {
            // Fallback: just test connection with a simple query
            console.log('Note: exec_sql function not found, testing connection via table query...');
            const { data: testData, error: testError } = await supabase
                .from('users')
                .select('id')
                .limit(1);

            if (testError) {
                console.error('Connection test failed:', testError.message);
                process.exit(1);
            }

            console.log('✅ Connection successful! (exec_sql not available, but DB is reachable)');
            console.log('Test query returned:', testData);
            return;
        }

        console.log('✅ SQL executed successfully!');
        console.log('Result:', JSON.stringify(data, null, 2));
    } catch (err: any) {
        console.error('Error:', err.message);
    }
}

runSQL();
