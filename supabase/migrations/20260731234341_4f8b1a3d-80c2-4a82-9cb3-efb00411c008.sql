ALTER TABLE public.services ADD COLUMN IF NOT EXISTS is_visible boolean NOT NULL DEFAULT true;

DROP POLICY IF EXISTS "Anyone can view services" ON public.services;
CREATE POLICY "Anyone can view visible services"
ON public.services FOR SELECT TO anon, authenticated
USING (is_visible OR has_role(auth.uid(), 'admin'::app_role));