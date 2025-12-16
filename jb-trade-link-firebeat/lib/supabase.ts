import { createClient } from '@supabase/supabase-js';

// Get Supabase credentials from environment - MUST be set on Vercel!
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Missing Supabase environment variables!\n' +
    'Required: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY\n' +
    'On Vercel: Set these in Project Settings > Environment Variables\n' +
    'Locally: Create .env.local with these values'
  );
}

if (import.meta.env.DEV) {
  console.log('🔧 Development mode: Connecting to Supabase at', supabaseUrl);
}

// Custom storage with fallback for better compatibility
const getStorage = () => {
  if (typeof window === 'undefined') return null;
  
  try {
    // Test if localStorage is available and working
    const test = '__test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return localStorage;
  } catch {
    // Fallback to in-memory storage for restricted environments
    const memoryStorage: Record<string, string> = {};
    return {
      getItem: (key: string) => memoryStorage[key] || null,
      setItem: (key: string, value: string) => { memoryStorage[key] = value; },
      removeItem: (key: string) => { delete memoryStorage[key]; },
    } as Storage;
  }
};

export const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        storage: getStorage(),
    }
});
