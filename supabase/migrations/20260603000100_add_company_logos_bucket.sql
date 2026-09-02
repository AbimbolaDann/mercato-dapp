-- Public bucket for supplier company logos: company-logos/{user_id}/{company_id}/logo.{ext}

INSERT INTO storage.buckets (id, name, public, allowed_mime_types, file_size_limit)
VALUES (
  'company-logos',
  'company-logos',
  true,
  ARRAY['image/jpeg', 'image/png', 'image/webp'],
  2097152
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  allowed_mime_types = EXCLUDED.allowed_mime_types,
  file_size_limit = EXCLUDED.file_size_limit;

DROP POLICY IF EXISTS "company_logos_public_read" ON storage.objects;
CREATE POLICY "company_logos_public_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'company-logos');

DROP POLICY IF EXISTS "company_logos_insert_own" ON storage.objects;
CREATE POLICY "company_logos_insert_own"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'company-logos'
    AND (auth.uid())::text = split_part(name, '/', 1)
  );

DROP POLICY IF EXISTS "company_logos_update_own" ON storage.objects;
CREATE POLICY "company_logos_update_own"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'company-logos'
    AND (auth.uid())::text = split_part(name, '/', 1)
  );

DROP POLICY IF EXISTS "company_logos_delete_own" ON storage.objects;
CREATE POLICY "company_logos_delete_own"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'company-logos'
    AND (auth.uid())::text = split_part(name, '/', 1)
  );
