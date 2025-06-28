import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

// Remove overly strict validation that might be causing the error
// Just check that the values exist and are not obviously placeholder values
if (supabaseUrl.includes('your-project') || supabaseAnonKey.includes('your-anon-key')) {
  throw new Error('Please update your .env file with actual Supabase credentials. You can find these in your Supabase project settings under API.');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});