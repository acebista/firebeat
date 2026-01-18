const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

async function run() {
    const envContent = fs.readFileSync('.env.local', 'utf8');
    const supabaseUrl = envContent.match(/VITE_SUPABASE_URL=(.+)/)[1];
    const supabaseKey = envContent.match(/VITE_SUPABASE_ANON_KEY=(.+)/)[1];

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: companies } = await supabase.from('companies').select('name').limit(5);
    console.log('Companies:', companies);

    const { data: products } = await supabase.from('products').select('name').limit(5);
    console.log('Products:', products);
}

run();
