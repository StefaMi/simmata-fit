
import { createClient } from '@supabase/supabase-js';

// Get environment variables or use empty strings as fallbacks
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Check if Supabase credentials are available
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "Missing Supabase credentials. Make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your environment variables."
  );
}

// Create a dummy client if credentials are missing
const supabaseClient = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : {
      auth: {
        signInWithPassword: () => Promise.resolve({ error: new Error("Supabase not configured") }),
        signUp: () => Promise.resolve({ error: new Error("Supabase not configured") }),
        signOut: () => Promise.resolve({ error: new Error("Supabase not configured") }),
        getSession: () => Promise.resolve({ data: { session: null } }),
        resetPasswordForEmail: () => Promise.resolve({ error: new Error("Supabase not configured") }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      }
    };

// Export the client and a helper function to check if Supabase is properly configured
export { supabaseClient };
export const isSupabaseConfigured = () => {
  return !!supabaseUrl && !!supabaseAnonKey;
};
