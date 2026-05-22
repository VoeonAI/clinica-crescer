import { supabase } from '@/lib/supabaseClient';

const BLOG_BUCKET = 'blog-crescer';

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
    const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
    const filePath = `posts/content/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(BLOG_BUCKET)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      if (uploadError.message.includes('The resource was not found') || uploadError.message.includes('not found')) {
        throw new Error('O bucket "blog-crescer" não foi encontrado no Supabase Storage. Verifique se o bucket foi criado corretamente.');
      }
      throw new Error(uploadError.message || 'Erro ao enviar imagem.');
    }

    const { data: { publicUrl } } = supabase.storage
      .from(BLOG_BUCKET)
      .getPublicUrl(filePath);

    return publicUrl;
  },

  async uploadCoverImage(file: File): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
    const filePath = `posts/covers/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(BLOG_BUCKET)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      if (uploadError.message.includes('The resource was not found') || uploadError.message.includes('not found')) {
        throw new Error('O bucket "blog-crescer" não foi encontrado no Supabase Storage. Verifique se o bucket foi criado corretamente.');
      }
      throw new Error(uploadError.message || 'Erro ao enviar imagem de capa.');
    }

    const { data: { publicUrl } } = supabase.storage
      .from(BLOG_BUCKET)
      .getPublicUrl(filePath);

    return publicUrl;
  },
};