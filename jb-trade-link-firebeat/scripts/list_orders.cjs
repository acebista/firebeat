const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

async function run() {
    const envContent = fs.readFileSync('.env.local', 'utf8');
    const supabaseUrl = envContent.match(/VITE_SUPABASE_URL=(.+)/)[1];
    const supabaseKey = envContent.match(/VITE_SUPABASE_ANON_KEY=(.+)/)[1];

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: orders, error } = await supabase
        .from('orders')
        .select('id, status, assignedTripId')
        .limit(10);

    if (error) {
        console.error(error);
    } else {
        console.log(JSON.stringify(orders, null, 2));
    }
}

run();
