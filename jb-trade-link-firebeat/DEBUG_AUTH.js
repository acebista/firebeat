/**
 * COMPREHENSIVE AUTH DEBUG SCRIPT
 * 
 * Run this in browser console to diagnose login issues
 * 
 * Usage:
 * 1. Open http://localhost:5175
 * 2. Press F12 to open console
 * 3. Copy and paste this entire script
 * 4. Press Enter
 * 5. Follow the prompts
 */

console.log('🔍 AUTH DEBUG SCRIPT LOADED');
console.log('═'.repeat(60));

// Step 1: Check current storage state
console.log('\n📦 STEP 1: Checking Storage State...');
console.log('─'.repeat(60));

const checkStorage = () => {
    const localKeys = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) localKeys.push(key);
    }

    const sessionKeys = [];
    for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key) sessionKeys.push(key);
    }

    console.log('localStorage keys:', localKeys);
    console.log('sessionStorage keys:', sessionKeys);

    // Check for Supabase keys
    const supabaseKeys = localKeys.filter(k => k.includes('supabase') || k.startsWith('sb-'));
    if (supabaseKeys.length > 0) {
        console.warn('⚠️ Found Supabase keys:', supabaseKeys);
        supabaseKeys.forEach(key => {
            const value = localStorage.getItem(key);
            console.log(`  ${key}:`, value?.substring(0, 100) + '...');
        });
    } else {
        console.log('✅ No Supabase keys found (clean state)');
    }

    return { localKeys, sessionKeys, supabaseKeys };
};

const storageState = checkStorage();

// Step 2: Test Supabase connection
console.log('\n🔌 STEP 2: Testing Supabase Connection...');
console.log('─'.repeat(60));

const testSupabaseConnection = async () => {
    try {
        // Import supabase client
        const { supabase } = await import('./lib/supabase.js');
        console.log('✅ Supabase client imported');

        // Test getSession
        const { data, error } = await supabase.auth.getSession();
        if (error) {
            console.error('❌ getSession error:', error);
        } else {
            console.log('✅ getSession success:', data);
        }

        return { supabase, sessionData: data, sessionError: error };
    } catch (err) {
        console.error('❌ Failed to import or test Supabase:', err);
        return { error: err };
    }
};

// Step 3: Test login flow
console.log('\n🔐 STEP 3: Testing Login Flow...');
console.log('─'.repeat(60));

const testLogin = async (email, password) => {
    console.log(`Attempting login with: ${email}`);

    try {
        const { supabase } = await import('./lib/supabase.js');

        // Clear storage first
        console.log('🧹 Clearing storage...');
        localStorage.clear();
        sessionStorage.clear();
        console.log('✅ Storage cleared');

        // Small delay
        await new Promise(resolve => setTimeout(resolve, 200));

        // Attempt login
        console.log('🔑 Attempting sign in...');
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            console.error('❌ Login failed:', error);
            return { success: false, error };
        }

        console.log('✅ Login successful!');
        console.log('User:', data.user);
        console.log('Session:', data.session);

        return { success: true, data };
    } catch (err) {
        console.error('❌ Login exception:', err);
        return { success: false, error: err };
    }
};

// Step 4: Provide interactive commands
console.log('\n🎮 INTERACTIVE COMMANDS:');
console.log('─'.repeat(60));
console.log('Run these commands to test:');
console.log('');
console.log('1. Check storage:');
console.log('   checkStorage()');
console.log('');
console.log('2. Test Supabase connection:');
console.log('   await testSupabaseConnection()');
console.log('');
console.log('3. Test login:');
console.log('   await testLogin("ace.bista@gmail.com", "Sachu123!")');
console.log('');
console.log('4. Clear everything:');
console.log('   localStorage.clear(); sessionStorage.clear(); location.reload();');
console.log('');
console.log('5. Emergency cleanup:');
console.log('   window.emergencyStorageClear()');
console.log('');
console.log('═'.repeat(60));

// Make functions available globally
window.debugAuth = {
    checkStorage,
    testSupabaseConnection,
    testLogin,
    clearAll: () => {
        localStorage.clear();
        sessionStorage.clear();
        console.log('✅ All storage cleared');
        console.log('Run location.reload() to refresh');
    }
};

console.log('\n✅ Debug tools loaded!');
console.log('Access via: window.debugAuth');
console.log('');
console.log('QUICK TEST:');
console.log('await window.debugAuth.testLogin("ace.bista@gmail.com", "Sachu123!")');
console.log('');
