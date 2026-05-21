-- Criação da tabela profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('master', 'editor', 'viewer')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Habilitar RLS na tabela profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Políticas para profiles
CREATE POLICY "profiles_select_policy" ON public.profiles
FOR SELECT TO authenticated USING (auth.uid() = id);

CREATE POLICY "profiles_insert_policy" ON public.profiles
FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_policy" ON public.profiles
FOR UPDATE TO authenticated USING (auth.uid() = id);

CREATE POLICY "profiles_delete_policy" ON public.profiles
FOR DELETE TO authenticated USING (auth.uid() = id);

-- Função para criar profile automaticamente quando usuário é criado
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE PLPGSQL
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data ->> 'full_name', 'Usuário'),
    COALESCE(new.raw_user_meta_data ->> 'role', 'viewer')
  );
  RETURN new;
END;
$$;

-- Trigger para criar profile automaticamente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Criação da tabela staff_members
CREATE TABLE IF NOT EXISTS public.staff_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role_title TEXT NOT NULL,
  bio TEXT,
  photo_url TEXT,
  specialties TEXT[],
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS na tabela staff_members
ALTER TABLE public.staff_members ENABLE ROW LEVEL SECURITY;

-- Políticas públicas para leitura de staff ativos
CREATE POLICY "staff_members_public_select" ON public.staff_members
FOR SELECT TO public USING (is_active = true);

-- Políticas para usuários autenticados
CREATE POLICY "staff_members_auth_select" ON public.staff_members
FOR SELECT TO authenticated USING (true);

CREATE POLICY "staff_members_insert" ON public.staff_members
FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "staff_members_update" ON public.staff_members
FOR UPDATE TO authenticated USING (true);

CREATE POLICY "staff_members_delete" ON public.staff_members
FOR DELETE TO authenticated USING (true);

-- Criação da tabela blog_categories
CREATE TABLE IF NOT EXISTS public.blog_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS na tabela blog_categories
ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;

-- Políticas públicas para leitura de categorias
CREATE POLICY "blog_categories_public_select" ON public.blog_categories
FOR SELECT TO public USING (true);

-- Políticas para usuários autenticados
CREATE POLICY "blog_categories_auth_select" ON public.blog_categories
FOR SELECT TO authenticated USING (true);

CREATE POLICY "blog_categories_insert" ON public.blog_categories
FOR INSERT TO authenticated USING (true);

CREATE POLICY "blog_categories_update" ON public.blog_categories
FOR UPDATE TO authenticated USING (true);

CREATE POLICY "blog_categories_delete" ON public.blog_categories
FOR DELETE TO authenticated USING (true);

-- Criação da tabela blog_posts
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT,
  cover_image_url TEXT,
  category_id UUID REFERENCES public.blog_categories(id) ON DELETE SET NULL,
  author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  seo_title TEXT,
  seo_description TEXT,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS na tabela blog_posts
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Políticas públicas para leitura de posts publicados
CREATE POLICY "blog_posts_public_select" ON public.blog_posts
FOR SELECT TO public USING (status = 'published');

-- Políticas para usuários autenticados
CREATE POLICY "blog_posts_auth_select" ON public.blog_posts
FOR SELECT TO authenticated USING (true);

CREATE POLICY "blog_posts_insert" ON public.blog_posts
FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "blog_posts_update" ON public.blog_posts
FOR UPDATE TO authenticated USING (true);

CREATE POLICY "blog_posts_delete" ON public.blog_posts
FOR DELETE TO authenticated USING (true);

-- Índices para melhorar performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON public.blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON public.blog_posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category_id ON public.blog_posts(category_id);
CREATE INDEX IF NOT EXISTS idx_staff_members_is_active ON public.staff_members(is_active);
CREATE INDEX IF NOT EXISTS idx_staff_members_display_order ON public.staff_members(display_order);