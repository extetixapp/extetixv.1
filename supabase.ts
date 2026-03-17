import { createClient } from '@supabase/supabase-js';

// Extraemos las variables de entorno
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * EXTETIX Guardian - Validación de Seguridad
 * Si las variables no existen, avisamos pero no rompemos el build innecesariamente
 */
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "⚠️ EXTETIX Guardian: Variables de Supabase no encontradas. " +
    "Asegúrate de tener NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY en tu .env.local"
  );
}

/**
 * Singleton del Cliente de Supabase
 * Esto asegura que solo usemos una instancia en toda la aplicación
 */
export const supabase = createClient(
  supabaseUrl || '', 
  supabaseAnonKey || '',
  {
    auth: {
      persistSession: true, // Importante para medicina estética (sesiones de paciente)
      autoRefreshToken: true,
    }
  }
);