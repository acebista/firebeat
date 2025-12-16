import { createClient } from '@supabase/supabase-js';

// Prefer environment configuration for deploys; fall back to current defaults for local/dev convenience.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? 'https://qlosefnvwvmqeebfqdcg.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFsb3NlZm53dm1xZWViZnFkY2ciLCJhdWQiOiJzdXBhYmFzZSIsInN1YiI6ImFub24iLCJpYXQiOjE2OTg0MTY0MDAsImV4cCI6MTkxNDA3MjQwMH0.DXK3r8bXG1bXoY9b1jz1YV7Zt1nU5H3v3Z5Z8vV6H3o';

if (import.meta.env.DEV) {
  console.log('🔧 Development mode: Connecting directly to Supabase at', supabaseUrl);
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
