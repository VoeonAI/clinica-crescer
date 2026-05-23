import { profileService, Profile, Role } from './profileService';

export const authService = {
  async deleteUser(id: string) {
    // Remove apenas o profile da tabela publica. O Auth User permanece no Supabase.
    await profileService.deleteProfile(id);
  },

  async getAllProfiles(): Promise<Profile[]> {
    return profileService.getAllProfiles();
  },

  async updateRole(userId: string, role: Role): Promise<Profile> {
    return profileService.updateProfile(userId, { role });
  },
};

export type { Profile, Role };
