import { supabase } from '@/lib/supabaseClient';

const PRODUCTS_BUCKET = 'products';

export type ProductType = 'gamelabs' | 'team';

export type Product = {
  id: string;
  type: ProductType;
  title: string;
  description?: string | null;
  cover_image?: string | null;
  gallery_images: string[];
  price?: string | null;
  external_url?: string | null;
  whatsapp_message?: string | null;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
};

export type CreateProductData = Omit<Product, 'id' | 'created_at' | 'updated_at'>;
export type UpdateProductData = Partial<<CreateProductData>;

export const productService = {
  async getProducts(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getActiveProducts(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getProductById(id: string): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async createProduct(data: CreateProductData): Promise<Product> {
    const { data: newProduct, error } = await supabase
      .from('products')
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return newProduct;
  },

  async updateProduct(id: string, data: UpdateProductData): Promise<Product> {
    const { data: updatedProduct, error } = await supabase
      .from('products')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return updatedProduct;
  },

  async deleteProduct(id: string): Promise<void> {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async toggleActive(id: string, isActive: boolean): Promise<Product> {
    return this.updateProduct(id, { is_active: !isActive });
  },

  async updateDisplayOrder(id: string, order: number): Promise<Product> {
    return this.updateProduct(id, { display_order: order });
  },

  async uploadCoverImage(file: File): Promise<string> {
    const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
    const filePath = `covers/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(PRODUCTS_BUCKET)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      if (uploadError.message.includes('not found')) {
        throw new Error('O bucket "products" não foi encontrado no Supabase Storage.');
      }
      throw new Error(uploadError.message || 'Erro ao enviar imagem de capa.');
    }

    const { data: { publicUrl } } = supabase.storage
      .from(PRODUCTS_BUCKET)
      .getPublicUrl(filePath);

    return publicUrl;
  },

  async uploadGalleryImages(files: File[]): Promise<string[]> {
    const uploadPromises = files.map(async (file) => {
      const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
      const filePath = `gallery/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(PRODUCTS_BUCKET)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        throw new Error(uploadError.message || 'Erro ao enviar imagem da galeria.');
      }

      const { data: { publicUrl } } = supabase.storage
        .from(PRODUCTS_BUCKET)
        .getPublicUrl(filePath);

      return publicUrl;
    });

    return Promise.all(uploadPromises);
  },
};