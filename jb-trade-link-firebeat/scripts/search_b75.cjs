const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

async function run() {
    const envContent = fs.readFileSync('.env.local', 'utf8');
    const supabaseUrl = envContent.match(/VITE_SUPABASE_URL=(.+)/)[1];
    const supabaseKey = envContent.match(/VITE_SUPABASE_ANON_KEY=(.+)/)[1];

    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Searching for any orders assigned to a trip containing "b75"...');
    const { data: orders, error } = await supabase
        .from('orders')
        .select('id, assignedTripId')
        .not('assignedTripId', 'is', null);

    if (error) {
        console.error(error);
    } else {
        const matches = orders.filter(o => o.assignedTripId.includes('b75'));
        console.log('Matches found:', JSON.stringify(matches, null, 2));
    }
}

run();
