DROP POLICY IF EXISTS "Anyone can read service photos" ON storage.objects;

CREATE POLICY "Admins can read service photos"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'service-photos'
  AND has_role(auth.uid(), 'admin'::app_role)
);