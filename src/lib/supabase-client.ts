
import { createClient } from '@supabase/supabase-js';

// Supabase client for browser-based access
// These should be your public Supabase URL and anon key (NOT service role key)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase URL or anonymous key. Please check your environment variables.');
}

export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
