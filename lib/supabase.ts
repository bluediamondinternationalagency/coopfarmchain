
import { createClient } from '@supabase/supabase-js';

// These environment variables should be set in your project configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabaseConfigError = !supabaseUrl || !supabaseAnonKey
	? 'Missing Supabase environment variables. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your hosting environment.'
	: null;

export const supabase = createClient(
	supabaseUrl || 'https://invalid.supabase.co',
	supabaseAnonKey || 'invalid-anon-key'
);
