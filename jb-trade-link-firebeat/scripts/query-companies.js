/**
 * Query Companies Table
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

async function queryCompanies() {
    console.log('📊 Querying Companies Table...\n');

    const { data, error } = await supabase.from('companies').select('*').order('name');

    if (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }

    console.log(`Found ${data.length} companies:\n`);
    console.log('─'.repeat(80));
    data.forEach((company, idx) => {
        console.log(`${idx + 1}. ${company.name}`);
        console.log(`   ID: ${company.id}`);
        if (company.description) console.log(`   Description: ${company.description}`);
        console.log('');
    });
    console.log('─'.repeat(80));
}

queryCompanies();
