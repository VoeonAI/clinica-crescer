import { supabase } from '@/lib/supabaseClient';
import { profileService, Profile } from './profileService';

export type Role = 'master' | 'editor' | 'viewer';

export const authService = {
  async createInvite(email: string, role: Role, fullName: string) {
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