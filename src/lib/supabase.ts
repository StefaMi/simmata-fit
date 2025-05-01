
import { createClient } from '@supabase/supabase-js';

// Set Supabase URL and anonymous key
const supabaseUrl = 'https://yaeiycpyyjlpalyzfhiw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlhZWl5Y3B5eWpscGFseXpmaGl3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxMzAwODYsImV4cCI6MjA2MTcwNjA4Nn0.3uVlphNhpJrvJJVrshS4EzlAOxdnCrVvB4aoiNq3V7o';

// Create the Supabase client
export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

// Export a helper function to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return true; // Since we're now using hardcoded credentials, Supabase is always configured
};
