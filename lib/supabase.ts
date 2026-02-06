
import { createClient } from '@supabase/supabase-js';

// These environment variables should be set in your project configuration
const supabaseUrl = (process.env.SUPABASE_URL as string) || 'https://your-project.supabase.co';
const supabaseAnonKey = (process.env.SUPABASE_ANON_KEY as string) || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
