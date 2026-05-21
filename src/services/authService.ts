import { supabase } from '@/lib/supabaseClient';

export type Profile = {
  id: string;
  email: string;
  full_name: string;
  role: 'master' | 'editor' | 'viewer';
  created_at: string;
};

export const authService = {
  async getProfiles() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Profile[];
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Profile;
  },

  async update(id: string, profile: Partial<Profile>) {
    const { data, error } = await supabase
      .from('profiles')
      .update(profile)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Profile;
  },

  async createInvite(email: string, role: 'master' | 'editor' | 'viewer', fullName: string) {
    // Cria o usuário no Supabase Auth
    const { data: { user }, error: authError } = await supabase.auth.signUp({
      email,
      password: Math.random().toString(36).slice(-8), // Senha temporária
      options: {
        data: {
          full_name: fullName,
          role: role,
        },
      },
    });

    if (authError) throw authError;

    if (user) {
      // O perfil será criado automaticamente pelo trigger
      return {
        id: user.id,
        email,
        full_name: fullName,
        role,
      };
    }

    throw new Error('Failed to create user');
  },

  async delete(id: string) {
    // Remove o profile da tabela pública
    const { error: profileError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', id);

    if (profileError) throw profileError;

    // Em produção, você precisaria usar a API Admin do Supabase para deletar
    // o usuário do auth.users, pois isso não pode ser feito via client SDK
    console.warn('Profile deletado. Para remover completamente do auth, use a API Admin do Supabase.');
  },
};