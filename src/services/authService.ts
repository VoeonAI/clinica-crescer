import { supabase } from '@/lib/supabaseClient';
import { profileService, Profile, Role } from './profileService';

export const authService = {
  async createAdminUser(full_name: string, email: string, password: string, role: Role): Promise<{ id: string; email: string; full_name: string; role: Role }> {
    // Obter sessão atual
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error('Not authenticated');
    }

    // Chamar Edge Function
    const { data, error } = await supabase.functions.invoke('create-admin-user', {
      body: {
        full_name,
        email,
        password,
        role,
      },
      headers: {
        Authorization: `Bearer ${session.access_token}`
      }
    });

    if (error) {
      console.error('Error calling edge function:', error);
      
      // Tratar erro de email já existente (status 409)
      if (error.status === 409) {
        throw new Error('Este e-mail já está cadastrado no Authentication.');
      }
      
      throw error;
    }

    return data.user;
  },

  async syncExistingUser(email: string, role: Role, fullName: string) {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Not authenticated');

    const { data, error } = await supabase.functions.invoke('create-admin-user', {
      body: { email, role, full_name: fullName, sync_existing: true },
      headers: { Authorization: `Bearer ${session.access_token}` }
    });

    if (error) {
      if (error.status === 404 && error.message.includes('USER_NOT_FOUND')) {
        throw new Error('Usuário não encontrado no Authentication.');
      }
      throw error;
    }

    return data.user;
  },

  async deleteUser(id: string) {
    // Remove apenas o profile da tabela pública (Auth User permanece até deleção manual)
    await profileService.deleteProfile(id);
  },

  async getAllProfiles(): Promise<Profile[]> {
    return profileService.getAllProfiles();
  },

  async updateRole(userId: string, role: Role): Promise<Profile> {
    return profileService.updateProfile(userId, { role });
  },
};