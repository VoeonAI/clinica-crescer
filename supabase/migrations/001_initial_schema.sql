-- Funções auxiliares para verificação de roles
CREATE OR REPLACE FUNCTION is_master()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'master'
  );
$$;

CREATE OR REPLACE FUNCTION is_editor()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('master', 'editor')
  );
$$;

CREATE OR REPLACE FUNCTION has_role(role_name text)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = role_name
  );
$$;

-- Função para atualizar timestamp updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Tabela profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'editor' CHECK (role IN ('master', 'editor', 'viewer')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Trigger para atualizar updated_at em profiles
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Habilitar RLS na tabela profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Políticas para profiles
-- Usuário pode ler seu próprio profile
CREATE POLICY "profiles_read_own" ON public.profiles
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

-- Master pode ler todos os profiles
CREATE POLICY "profiles_read_all" ON public.profiles
  FOR SELECT TO authenticated
  USING (is_master());

-- Usuário pode atualizar apenas seu full_name
CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id AND (
    -- Só permite atualizar full_name
    (OLD.full_name IS DISTINCT FROM NEW.full_name) OR
    (OLD.email = NEW.email AND OLD.role = NEW.role)
  ));

-- Master pode atualizar roles
CREATE POLICY "profiles_master_update" ON public.profiles
  FOR UPDATE TO authenticated
  USING (is_master())
  WITH CHECK (is_master());

-- Trigger para criar profile automaticamente quando usuário é criado
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
    COALESCE(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data ->> 'role', 'editor')
  );
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Tabela blog_posts
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT,
  cover_image TEXT,
  published BOOLEAN DEFAULT false,
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published_at TIMESTAMP WITH TIME ZONE
);

-- Trigger para atualizar updated_at em blog_posts
CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger para atualizar published_at quando post é publicado
CREATE OR REPLACE FUNCTION update_published_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.published = true AND OLD.published = false THEN
    NEW.published_at = NOW();
  ELSIF NEW.published = false THEN
    NEW.published_at = NULL;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_update_published_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_published_at();

-- Habilitar RLS na tabela blog_posts
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Políticas para blog_posts
-- Público pode ler apenas posts publicados
CREATE POLICY "blog_posts_public_read" ON public.blog_posts
  FOR SELECT TO public
  USING (published = true);

-- Master e editor podem CRUD completo
CREATE POLICY "blog_posts_admin_all" ON public.blog_posts
  FOR ALL TO authenticated
  USING (is_editor())
  WITH CHECK (is_editor());

-- Viewer pode ler no admin
CREATE POLICY "blog_posts_viewer_read" ON public.blog_posts
  FOR SELECT TO authenticated
  USING (has_role('viewer'));

-- Tabela staff_members
CREATE TABLE IF NOT EXISTS public.staff_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role_title TEXT,
  bio TEXT,
  photo_url TEXT,
  specialties TEXT[],
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trigger para atualizar updated_at em staff_members
CREATE TRIGGER update_staff_members_updated_at
  BEFORE UPDATE ON public.staff_members
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Habilitar RLS na tabela staff_members
ALTER TABLE public.staff_members ENABLE ROW LEVEL SECURITY;

-- Políticas para staff_members
-- Público pode ler apenas membros ativos
CREATE POLICY "staff_members_public_read" ON public.staff_members
  FOR SELECT TO public
  USING (is_active = true);

-- Master e editor podem CRUD completo
CREATE POLICY "staff_members_admin_all" ON public.staff_members
  FOR ALL TO authenticated
  USING (is_editor())
  WITH CHECK (is_editor());

-- Viewer pode ler no admin
CREATE POLICY "staff_members_viewer_read" ON public.staff_members
  FOR SELECT TO authenticated
  USING (has_role('viewer'));

-- Índices para melhorar performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON public.blog_posts(published);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON public.blog_posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_staff_members_is_active ON public.staff_members(is_active);
CREATE INDEX IF NOT EXISTS idx_staff_members_display_order ON public.staff_members(display_order);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);