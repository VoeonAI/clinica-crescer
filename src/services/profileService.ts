import { supabase } from '@/lib/supabaseClient';

export type Profile = {
  id: string;
  email: string;
  full_name?: string;
  role: 'master' | 'editor' | 'viewer';
  created_at: string;
  updated_at: string;
};

export type UpdateProfileData = {
  full_name?: string;
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

  async updateUserRole(userId: string, role: 'master' | 'editor' | 'viewer'): Promise<Profile> {
    const { data: updatedProfile, error } = await supabase
      .from('profiles')
      .update({ role })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return updatedProfile;
  },
};