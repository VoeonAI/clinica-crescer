import { supabase } from '@/lib/supabaseClient';

const MEMBERS_BUCKET = 'members';

export type MemberType = 'founder' | 'therapist' | 'staff';

export type StaffMember = {
  id: string;
  name: string;
  role_title?: string;
  bio?: string;
  photo_url?: string;
  specialties?: string[];
  display_order: number;
  is_active: boolean;
  member_type: MemberType;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
};

export type CreateStaffData = Omit<StaffMember, 'id' | 'created_at' | 'updated_at'>;
export type UpdateStaffData = Partial<CreateStaffData>;

export const staffService = {
  async getActiveStaff(): Promise<StaffMember[]> {
    const { data, error } = await supabase
      .from('staff_members')
      .select('*')
      .eq('is_active', true)
      .order('is_featured', { ascending: false })
      .order('member_type', { ascending: true })
      .order('display_order', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async getAdminStaff(): Promise<StaffMember[]> {
    const { data, error } = await supabase
      .from('staff_members')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async getStaffById(id: string): Promise<StaffMember | null> {
    const { data, error } = await supabase
      .from('staff_members')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async createStaffMember(data: CreateStaffData): Promise<StaffMember> {
    const { data: newMember, error } = await supabase
      .from('staff_members')
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return newMember;
  },

  async updateStaffMember(id: string, data: UpdateStaffData): Promise<StaffMember> {
    const { data: updatedMember, error } = await supabase
      .from('staff_members')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return updatedMember;
  },

  async deleteStaffMember(id: string): Promise<void> {
    const { error } = await supabase
      .from('staff_members')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async updateDisplayOrder(updates: { id: string; display_order: number }[]): Promise<void> {
    const promises = updates.map(({ id, display_order }) =>
      supabase
        .from('staff_members')
        .update({ display_order })
        .eq('id', id)
    );

    await Promise.all(promises);
  },

  async uploadMemberImage(file: File): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
    const filePath = `members/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(MEMBERS_BUCKET)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      if (uploadError.message.includes('The resource was not found') || uploadError.message.includes('not found')) {
        throw new Error('O bucket "members" não foi encontrado no Supabase Storage. Verifique se o bucket foi criado corretamente.');
      }
      throw new Error(uploadError.message || 'Erro ao enviar imagem.');
    }

    const { data: { publicUrl } } = supabase.storage
      .from(MEMBERS_BUCKET)
      .getPublicUrl(filePath);

    return publicUrl;
  },
};