import { supabase } from "@/lib/supabaseClient";

const PROMOTIONAL_BANNER_BUCKET = "promotional-banner";

export type PromotionalBannerType = "image" | "text";

export type PromotionalBanner = {
  id: string;
  is_active: boolean;
  type: PromotionalBannerType;
  image_url?: string | null;
  text?: string | null;
  link_url?: string | null;
  created_at: string;
  updated_at: string;
};

export type PromotionalBannerData = {
  is_active: boolean;
  type: PromotionalBannerType;
  image_url?: string | null;
  text?: string | null;
  link_url?: string | null;
};

const sanitizeFileName = (name: string) => name.replace(/[^a-zA-Z0-9._-]/g, "_");

export const promotionalBannerService = {
  async getActiveBanner(): Promise<PromotionalBanner | null> {
    const { data, error } = await supabase
      .from("promotional_banner")
      .select("*")
      .eq("is_active", true)
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async getAdminBanner(): Promise<PromotionalBanner | null> {
    const { data, error } = await supabase
      .from("promotional_banner")
      .select("*")
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async saveBanner(id: string | null, data: PromotionalBannerData): Promise<PromotionalBanner> {
    const query = id
      ? supabase.from("promotional_banner").update(data).eq("id", id)
      : supabase.from("promotional_banner").insert(data);

    const { data: savedBanner, error } = await query.select().single();

    if (error) throw error;
    return savedBanner;
  },

  async uploadBannerImage(file: File): Promise<string> {
    const fileName = `${Date.now()}-${sanitizeFileName(file.name)}`;
    const filePath = `banners/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(PROMOTIONAL_BANNER_BUCKET)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      if (uploadError.message.includes("not found")) {
        throw new Error('O bucket "promotional-banner" nao foi encontrado no Supabase Storage.');
      }
      throw new Error(uploadError.message || "Erro ao enviar imagem da faixa.");
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(PROMOTIONAL_BANNER_BUCKET).getPublicUrl(filePath);

    return publicUrl;
  },
};
