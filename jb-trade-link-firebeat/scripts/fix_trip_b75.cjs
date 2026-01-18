const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

async function run() {
    const envContent = fs.readFileSync('.env.local', 'utf8');
    const supabaseUrl = envContent.match(/VITE_SUPABASE_URL=(.+)/)[1];
    const supabaseKey = envContent.match(/VITE_SUPABASE_ANON_KEY=(.+)/)[1];

    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Searching for trip matching "b75"...');
    const { data: trips, error: tripsError } = await supabase
        .from('trips')
        .select('*')
        .or('id.ilike.%b75%,id.eq.b75');

    if (tripsError) {
        console.error('Error fetching trips:', tripsError);
        return;
    }

    if (!trips || trips.length === 0) {
        console.log('No trip found matching "b75".');
        return;
    }

    const trip = trips[0];
    console.log('Found trip:', trip.id);
    console.log('Order IDs:', trip.orderIds);

    if (!trip.orderIds || trip.orderIds.length === 0) {
        console.log('No orders found in this trip.');
        return;
    }

    console.log(`Returning ${trip.orderIds.length} orders to "approved" pool...`);

    // Update orders
    const { error: ordersError } = await supabase
        .from('orders')
        .update({ status: 'approved', assignedTripId: null })
        .in('id', trip.orderIds);

    if (ordersError) {
        console.error('Error updating orders:', ordersError);
        return;
    }

    console.log('Orders updated successfully.');

    // Update trip to be empty and status or just delete it?
    // User said "remove all invoices from #trip_b75", implying the trip might stay but empty.
    // But usually it's cleaner to delete or mark as cancelled.
    // Let's check if there is a status field in trip.
    console.log('Trip status:', trip.status);

    const { error: tripUpdateError } = await supabase
        .from('trips')
        .update({
            orderIds: [],
            totalAmount: 0,
            totalOrders: 0
        })
        .eq('id', trip.id);

    if (tripUpdateError) {
        console.error('Error updating trip:', tripUpdateError);
        return;
    }

    console.log('Trip cleared successfully.');
}

run();
