const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

async function run() {
    const envContent = fs.readFileSync('.env.local', 'utf8');
    const supabaseUrl = envContent.match(/VITE_SUPABASE_URL=(.+)/)[1].trim();
    const supabaseKey = envContent.match(/VITE_SUPABASE_ANON_KEY=(.+)/)[1].trim();

    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('=== Salespersons in Orders ===');
    // Get unique salesperson IDs and names from orders
    const { data: allOrders } = await supabase
        .from('orders')
        .select('salespersonId, salespersonName')
        .limit(10000);

    const salespersonsInOrders = new Map();
    (allOrders || []).forEach(o => {
        if (!salespersonsInOrders.has(o.salespersonId)) {
            salespersonsInOrders.set(o.salespersonId, { name: o.salespersonName, count: 0 });
        }
        salespersonsInOrders.get(o.salespersonId).count++;
    });

    console.log('\nSalespersons in Orders (with order counts):');
    salespersonsInOrders.forEach((v, k) => {
        console.log(`  ${k} -> "${v.name}" (${v.count} orders)`);
    });

    console.log('\n=== Users in Users Table ===');
    const { data: users } = await supabase
        .from('users')
        .select('id, name, role')
        .eq('role', 'sales');

    console.log('\nSales Users in users table:');
    (users || []).forEach(u => {
        console.log(`  ${u.id} -> "${u.name}" (${u.role})`);
    });

    console.log('\n=== Comparing ===');
    // Find mismatches
    const orderIds = new Set([...salespersonsInOrders.keys()]);
    const userIds = new Set((users || []).map(u => u.id));

    const ordersWithMissingUsers = [...salespersonsInOrders.entries()].filter(([id]) => !userIds.has(id));
    const usersNotInOrders = (users || []).filter(u => !orderIds.has(u.id));

    if (ordersWithMissingUsers.length > 0) {
        console.log('\n❌ Orders reference salespersonIds NOT in users table:');
        ordersWithMissingUsers.forEach(([id, v]) => {
            console.log(`  ${id} -> "${v.name}" (${v.count} orders)`);
        });
    }

    if (usersNotInOrders.length > 0) {
        console.log('\n⚠️ Users in table but with no orders:');
        usersNotInOrders.forEach(u => {
            console.log(`  ${u.id} -> "${u.name}"`);
        });
    }

    // Suggest fixes
    console.log('\n=== Suggested Fixes ===');
    ordersWithMissingUsers.forEach(([orderId, orderData]) => {
        // Try to find a user with similar name
        const match = (users || []).find(u =>
            u.name.toLowerCase().replace(/\s+/g, '') === orderData.name.toLowerCase().replace(/\s+/g, '') ||
            u.name.toLowerCase().includes(orderData.name.toLowerCase().split(' ')[0]) ||
            orderData.name.toLowerCase().includes(u.name.toLowerCase().split(' ')[0])
        );
        if (match) {
            console.log(`\nFIX: Orders with salesperson "${orderData.name}" (ID: ${orderId})`);
            console.log(`     Should map to user "${match.name}" (ID: ${match.id})`);
            console.log(`     Run: UPDATE orders SET "salespersonId" = '${match.id}' WHERE "salespersonId" = '${orderId}';`);
        }
    });
}

run();
