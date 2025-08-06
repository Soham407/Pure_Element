import { createClient } from '@supabase/supabase-js';

// Expect these two environment variables to be defined in your Vite/CRA environment
// VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
let supabaseUrl;
let supabaseAnonKey;

// Vite exposes env via import.meta.env; CRA via process.env
if (typeof import.meta !== 'undefined' && import.meta.env) {
  supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
}

// Fallback to CRA env vars
if (!supabaseUrl) supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
if (!supabaseAnonKey) supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // eslint-disable-next-line no-console
  console.error('Supabase env vars are missing. Define VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY (Vite) or REACT_APP_SUPABASE_URL / REACT_APP_SUPABASE_ANON_KEY (CRA).');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
