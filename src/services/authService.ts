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
    return data;
  },

  async createInvite(email: string, role: 'master' | 'editor' | 'viewer', fullName: string) {
    // Cria o usuário no Supabase Auth
    const { data: { user }, error: authError } = await supabase.auth.signUp({
      email,
      password: Math.random().toString(36).slice(-8), // Senha temporária
    });

    if (authError) throw authError;

    if (user) {
      // Cria o perfil na tabela profiles
      const { data, error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          email,
          full_name: fullName,
          role,
        })
        .select()
        .single();

      if (profileError) throw profileError;
      return data;
    }

    throw new Error('Failed to create user');
  },

  async delete(id: string) {
    // Precisa ser feito via função admin, pois delete na tabela profiles
    // não remove do auth.users automaticamente
    // Por enquanto, apenas marcamos como inativo ou removemos o profile
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};