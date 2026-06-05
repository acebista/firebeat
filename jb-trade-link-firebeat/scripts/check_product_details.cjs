const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

async function run() {
    const envContent = fs.readFileSync('.env.local', 'utf8');
    const supabaseUrl = envContent.match(/VITE_SUPABASE_URL=(.+)/)[1].trim();
    const supabaseKey = envContent.match(/VITE_SUPABASE_ANON_KEY=(.+)/)[1].trim();

    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log("Signing in as ace.bista@gmail.com...");
    await supabase.auth.signInWithPassword({
        email: 'ace.bista@gmail.com',
        password: 'Sachu123!'
    });

    const { data: product, error } = await supabase
        .from('products')
        .select('*')
        .eq('name', 'PHC BLACK- MRP 200 New 10 pack (1*90)')
        .single();
    
    if (error) throw error;
    console.log("Product details:", JSON.stringify(product, null, 2));
}

run().catch(console.error);
