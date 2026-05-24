CREATE OR REPLACE FUNCTION public.is_master()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'master'
  );
$$;

CREATE OR REPLACE FUNCTION public.is_editor()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('master', 'editor')
  );
$$;

CREATE OR REPLACE FUNCTION public.has_role(role_name text)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = role_name
  );
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TABLE IF NOT EXISTS public.promotional_banner (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  is_active BOOLEAN NOT NULL DEFAULT false,
  type TEXT NOT NULL DEFAULT 'text' CHECK (type IN ('image', 'text')),
  image_url TEXT,
  text TEXT,
  link_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgname = 'update_promotional_banner_updated_at'
  ) THEN
    CREATE TRIGGER update_promotional_banner_updated_at
      BEFORE UPDATE ON public.promotional_banner
      FOR EACH ROW
      EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;

ALTER TABLE public.promotional_banner ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "promotional_banner_public_read_active" ON public.promotional_banner;
CREATE POLICY "promotional_banner_public_read_active" ON public.promotional_banner
  FOR SELECT TO public
  USING (is_active = true);

DROP POLICY IF EXISTS "promotional_banner_admin_all" ON public.promotional_banner;
CREATE POLICY "promotional_banner_admin_all" ON public.promotional_banner
  FOR ALL TO authenticated
  USING (is_editor())
  WITH CHECK (is_editor());

DROP POLICY IF EXISTS "promotional_banner_viewer_read" ON public.promotional_banner;
CREATE POLICY "promotional_banner_viewer_read" ON public.promotional_banner
  FOR SELECT TO authenticated
  USING (has_role('viewer'));

CREATE INDEX IF NOT EXISTS idx_promotional_banner_active ON public.promotional_banner(is_active);
CREATE INDEX IF NOT EXISTS idx_promotional_banner_updated_at ON public.promotional_banner(updated_at DESC);

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'promotional-banner',
  'promotional-banner',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "promotional_banner_storage_public_read" ON storage.objects;
CREATE POLICY "promotional_banner_storage_public_read" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'promotional-banner');

DROP POLICY IF EXISTS "promotional_banner_storage_admin_insert" ON storage.objects;
CREATE POLICY "promotional_banner_storage_admin_insert" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'promotional-banner' AND public.is_editor());

DROP POLICY IF EXISTS "promotional_banner_storage_admin_update" ON storage.objects;
CREATE POLICY "promotional_banner_storage_admin_update" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'promotional-banner' AND public.is_editor())
  WITH CHECK (bucket_id = 'promotional-banner' AND public.is_editor());

DROP POLICY IF EXISTS "promotional_banner_storage_admin_delete" ON storage.objects;
CREATE POLICY "promotional_banner_storage_admin_delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'promotional-banner' AND public.is_editor());
