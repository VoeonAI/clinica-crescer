import { supabase } from '@/lib/supabaseClient';

export type StaffMember = {
  id: string;
  name: string;
  role_title: string;
  bio: string;
  photo_url?: string;
  specialties?: string[];
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export const staffService = {
  async getAllActive() {
    const { data, error } = await supabase
      .from('staff_members')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) throw error;
    return data as StaffMember[];
  },

  async getAll() {
    const { data, error } = await supabase
      .from('staff_members')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) throw error;
    return data as StaffMember[];
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('staff_members')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as StaffMember;
  },

  async create(member: Partial<StaffMember>) {
    const { data, error } = await supabase
      .from('staff_members')
      .insert(member)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, member: Partial<StaffMember>) {
    const { data, error } = await supabase
      .from('staff_members')
      .update(member)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('staff_members')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async updateOrder(updates: { id: string; display_order: number }[]) {
    const promises = updates.map(({ id, display_order }) =>
      supabase
        .from('staff_members')
        .update({ display_order })
        .eq('id', id)
    );

    await Promise.all(promises);
  },
};