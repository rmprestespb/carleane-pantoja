CREATE POLICY "Anyone can read service photos"
ON storage.objects FOR SELECT TO anon, authenticated
USING (bucket_id = 'service-photos');

CREATE POLICY "Admins can upload service photos"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'service-photos' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update service photos"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'service-photos' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete service photos"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'service-photos' AND has_role(auth.uid(), 'admin'::app_role));