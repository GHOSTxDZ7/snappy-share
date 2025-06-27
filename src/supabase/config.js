// 📦 Import the official Supabase client for JavaScript
import { createClient } from '@supabase/supabase-js'

// 🔐 Load Supabase project credentials from environment variables (via Vite)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;         // 🌐 Project URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;    // 🔑 Public anonymous API key

// 🚀 Initialize and export the Supabase client instance
export const supabase = createClient(supabaseUrl, supabaseKey);
