const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

async function run() {
    const envContent = fs.readFileSync('.env.local', 'utf8');
    const supabaseUrl = envContent.match(/VITE_SUPABASE_URL=(.+)/)[1];
    const supabaseKey = envContent.match(/VITE_SUPABASE_ANON_KEY=(.+)/)[1];

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Find users with name containing "Shweta"
    console.log('Searching for users named Shweta...');
    const { data: users, error: usersError } = await supabase
        .from('users')
        .select('*')
        .ilike('name', '%Shweta%');

    if (usersError) {
        console.error('Error fetching users:', usersError);
    } else {
        console.log('Users found:', JSON.stringify(users, null, 2));
    }

    // Find orders by salesperson name containing "Shweta"
    console.log('\nSearching for orders by Shweta...');
    const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('id, salespersonId, salespersonName, date, status')
        .ilike('salespersonName', '%Shweta%')
        .limit(10);

    if (ordersError) {
        console.error('Error fetching orders:', ordersError);
    } else {
        console.log('Orders found:', JSON.stringify(orders, null, 2));
    }

    // Get all unique salesperson names and IDs
    console.log('\nGetting all unique salespersons...');
    const { data: allOrders, error: allOrdersError } = await supabase
        .from('orders')
        .select('salespersonId, salespersonName')
        .limit(1000);

    if (allOrdersError) {
        console.error('Error:', allOrdersError);
    } else {
        const uniqueSalespersons = new Map();
        allOrders.forEach(o => {
            if (!uniqueSalespersons.has(o.salespersonId)) {
                uniqueSalespersons.set(o.salespersonId, o.salespersonName);
            }
        });
        console.log('Unique salespersons:');
        uniqueSalespersons.forEach((name, id) => {
            console.log(`  ${id} -> ${name}`);
        });
    }
}

run();
