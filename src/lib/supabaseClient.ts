import { supabase as supabaseClient } from '@/integrations/supabase/client';

// Re-exportar com o nome esperado pelo resto da aplicação
export const supabase = supabaseClient;