import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Logueamos para ver qué pasa ANTES de que explote
console.log("DEBUG - URL:", supabaseUrl);
console.log("DEBUG - KEY:", supabaseAnonKey);

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("ERROR: Variables de entorno no cargadas. Revisa tu archivo .env.local");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);