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
      console.error('Error calling edge function:', error);
      
      // Tratar erro de email já existente (status 409)
      if (error.status === 409) {
        // Verificar se tem error.message customizado
        if (error.message && error.message.includes('USER_ALREADY_EXISTS')) {
          throw new Error('Este e-mail já está cadastrado no Authentication. Verifique a lista de usuários ou use a opção de sincronizar.');
        }
        throw new Error('Este e-mail já está cadastrado no sistema.');
      }
      
      // Outros erros
      throw error;
    }

    return {
      id: data.user.id,
      email,
      full_name: fullName,
      role,
    };
  },

  async syncExistingUser(email: string, role: Role, fullName: string) {
    // Obter sessão atual
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error('Not authenticated');
    }

    // Chamar Edge Function com sync_existing = true
    const { data, error } = await supabase.functions.invoke('create-admin-user', {
      body: {
        email,
        role,
        full_name: fullName,
        sync_existing: true
      },
      headers: {
        Authorization: `Bearer ${session.access_token}`
      }
    });

    if (error) {
      console.error('Error syncing user:', error);
      
      // Tratar erro de usuário não encontrado
      if (error.status === 404 && error.message.includes('USER_NOT_FOUND')) {
        throw new Error('Usuário não encontrado no Authentication.');
      }
      
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