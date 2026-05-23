import { supabase } from '@/lib/supabaseClient';

export type Role = 'master' | 'editor' | 'viewer';

export type Profile = {
  id: string;
  email: string;
  full_name?: string;
  role: Role;
  created_at: string;
  updated_at: string;
};

export type UpdateProfileData = {
  full_name?: string;
  role?: Role;
};

export const profileService = {
  async getMyProfile(): Promise<Profile | null> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) throw error;
    return data;
  },

  async getAllProfiles(): Promise<Profile[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async updateMyProfile(data: UpdateProfileData): Promise<Profile> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error('User not authenticated');

    const { data: updatedProfile, error } = await supabase
      .from('profiles')
      .update(data)
      .eq('id', user.id)
      .select()
      .single();

    if (error) throw error;
    return updatedProfile;
  },

  async updateProfile(id: string, data: UpdateProfileData): Promise<Profile> {
    const { data: updatedProfile, error } = await supabase
      .from('profiles')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return updatedProfile;
  },

  async deleteProfile(id: string): Promise<void> {
    const { error } = await supabase
      .from("profiles")
      .delete()
      .eq("id", id);

    if (error) throw error;

    const { data: remainingProfile, error: verifyError } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", id)
      .maybeSingle();

    if (verifyError) throw verifyError;

    if (remainingProfile) {
      throw new Error(
        'O profile nao foi removido. Verifique se existe a policy DELETE "master_can_delete_profiles" em public.profiles.'
      );
    }
  },
};
