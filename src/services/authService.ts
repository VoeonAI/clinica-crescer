import { supabase } from '@/lib/supabaseClient';
import { profileService, Profile } from './profileService';

export type Role = 'master' | 'editor' | 'viewer';

export const authService = {
  async createInvite(email: string, role: Role, fullName: string) {
    // Obter sessão atual
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error('Not authenticated');
    }

    // Chamar Edge Function
    const { data, error } = await supabase.functions.invoke('create-admin-user', {
      body: {
        email,
        password: Math.random().toString(36).slice(-8), // Senha temporária
        role,
        full_name: fullName
      },
      headers: {
        Authorization: `Bearer ${session.access_token}`
      }
    });

    if (error) {
      // Tratar erro de email já existente
      if (error.message.includes('Email already registered') || error.status === 409) {
        throw new Error('Este e-mail já está cadastrado no sistema.');
      }
      
      console.error('Error creating user via edge function:', error);
      throw error;
    }

    return {
      id: data.user.id,
      email,
      full_name: fullName,
      role,
    };
  },

  async deleteUser(id: string) {
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

  async getAllProfiles(): Promise<Profile[]> {
    return profileService.getAllProfiles();
  },

  async updateRole(userId: string, role: Role): Promise<Profile> {
    return profileService.updateUserRole(userId, role);
  },
};