-- Alter supplier_products table if it exists
ALTER TABLE IF EXISTS public.supplier_products
  ADD COLUMN IF NOT EXISTS image_url TEXT DEFAULT NULL;

-- Create products bucket in Supabase storage
INSERT INTO storage.buckets (id, name, public, allowed_mime_types, file_size_limit)
VALUES ('products', 'products', true, ARRAY['image/jpeg', 'image/png', 'image/webp'], 5000000)
ON CONFLICT (id) DO UPDATE SET allowed_mime_types = EXCLUDED.allowed_mime_types, file_size_limit = EXCLUDED.file_size_limit;

DROP POLICY IF EXISTS "products_public_read" ON storage.objects;
CREATE POLICY "products_public_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'products');

DROP POLICY IF EXISTS "products_insert_own" ON storage.objects;
CREATE POLICY "products_insert_own"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'products'
    AND (auth.uid())::text = split_part(name, '/', 1)
  );

DROP POLICY IF EXISTS "products_update_own" ON storage.objects;
CREATE POLICY "products_update_own"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'products'
    AND (auth.uid())::text = split_part(name, '/', 1)
  );

DROP POLICY IF EXISTS "products_delete_own" ON storage.objects;
CREATE POLICY "products_delete_own"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'products'
    AND (auth.uid())::text = split_part(name, '/', 1)
  );
