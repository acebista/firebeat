const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

async function run() {
    const envContent = fs.readFileSync('.env.local', 'utf8');
    const supabaseUrl = envContent.match(/VITE_SUPABASE_URL=(.+)/)[1];
    const supabaseKey = envContent.match(/VITE_SUPABASE_ANON_KEY=(.+)/)[1];

    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Searching for trips matching "trip_b75%"...');
    const { data: trips, error } = await supabase
        .from('trips')
        .select('id, deliveryDate, orderIds')
        .ilike('id', 'trip_b75%');

    if (error) {
        console.error(error);
    } else {
        console.log('Found trips:', JSON.stringify(trips, null, 2));
    }
}

run();
