import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { Database } from '@/types/database';

// Custom storage implementation for Expo
const ExpoSecureStoreAdapter = {
  getItem: (key: string) => {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    }
    return SecureStore.getItemAsync(key);
  },
  setItem: (key: string, value: string) => {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
      return Promise.resolve();
    }
    return SecureStore.setItemAsync(key, value);
  },
  removeItem: (key: string) => {
    if (Platform.OS === 'web') {
      localStorage.removeItem(key);
      return Promise.resolve();
    }
    return SecureStore.deleteItemAsync(key);
  },
};

// Get environment variables
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// More detailed error checking
if (!supabaseUrl) {
  console.error('Missing EXPO_PUBLIC_SUPABASE_URL in environment variables');
  console.log('Available env vars:', Object.keys(process.env).filter(key => key.startsWith('EXPO_PUBLIC')));
}

if (!supabaseAnonKey) {
  console.error('Missing EXPO_PUBLIC_SUPABASE_ANON_KEY in environment variables');
  console.log('Available env vars:', Object.keys(process.env).filter(key => key.startsWith('EXPO_PUBLIC')));
}

// Check if we have placeholder values
if (supabaseUrl && (supabaseUrl.includes('your_supabase') || supabaseUrl === 'your_supabase_project_url')) {
  throw new Error('Please update your .env file with actual Supabase credentials. You can find these in your Supabase project settings under API.');
}

if (supabaseAnonKey && (supabaseAnonKey.includes('your_supabase') || supabaseAnonKey === 'your_supabase_anon_key')) {
  throw new Error('Please update your .env file with actual Supabase credentials. You can find these in your Supabase project settings under API.');
}

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file and ensure EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY are set.');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});