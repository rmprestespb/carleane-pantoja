CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- First registered user becomes the admin
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
  ELSE
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user')
    ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created_role
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_role();

CREATE TABLE public.services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  detail text,
  price numeric(10,2) NOT NULL DEFAULT 0,
  image_url text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.services TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.services TO authenticated;
GRANT ALL ON public.services TO service_role;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view services"
ON public.services FOR SELECT
USING (true);

CREATE POLICY "Admins can insert services"
ON public.services FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update services"
ON public.services FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete services"
ON public.services FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER services_set_updated_at
BEFORE UPDATE ON public.services
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.services (name, detail, price, sort_order, image_url) VALUES
('Massagem Relaxante', 'Sessão de 60 minutos', 120.00, 1, 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&q=80'),
('Drenagem Linfática', 'Sessão de 60 minutos', 130.00, 2, 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=400&q=80'),
('Massagem com Pedras Quentes', 'Sessão de 75 minutos', 160.00, 3, 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=400&q=80'),
('Ventosaterapia', 'Sessão de 40 minutos', 100.00, 4, 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=400&q=80'),
('Dry Needling', 'Agulhamento a seco, 40 minutos', 110.00, 5, 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=400&q=80'),
('Combo Queridinho', 'Relaxante + Ventosaterapia, 90 minutos', 190.00, 6, 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&q=80');