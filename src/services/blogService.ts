import { supabase } from '@/lib/supabaseClient';

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  cover_image?: string;
  published: boolean;
  seo_title?: string;
  seo_description?: string;
  created_at: string;
  updated_at: string;
  published_at?: string;
};

export type CreatePostData = Omit<BlogPost, 'id' | 'created_at' | 'updated_at' | 'published_at'>;
export type UpdatePostData = Partial<CreatePostData>;

export const blogService = {
  async getPublishedPosts(): Promise<BlogPost[]> {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('published', true)
      .order('published_at', { ascending: false, nullsFirst: false });

    if (error) throw error;
    return data || [];
  },

  async getPostBySlug(slug: string): Promise<BlogPost | null> {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .single();

    if (error) throw error;
    return data;
  },

  async getAdminPosts(): Promise<BlogPost[]> {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getPostById(id: string): Promise<BlogPost | null> {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async createPost(data: CreatePostData): Promise<BlogPost> {
    const { data: newPost, error } = await supabase
      .from('blog_posts')
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return newPost;
  },

  async updatePost(id: string, data: UpdatePostData): Promise<BlogPost> {
    const { data: updatedPost, error } = await supabase
      .from('blog_posts')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return updatedPost;
  },

  async deletePost(id: string): Promise<void> {
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async togglePublishPost(id: string, published: boolean): Promise<BlogPost> {
    return this.updatePost(id, { published });
  },

  async uploadBlogImage(file: File): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('blog-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      if (uploadError.message.includes('The resource was not found')) {
        throw new Error('O bucket "blog-images" não existe. Crie-o no Supabase Storage para fazer upload de imagens.');
      }
      throw uploadError;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('blog-images')
      .getPublicUrl(filePath);

    return publicUrl;
  },
};