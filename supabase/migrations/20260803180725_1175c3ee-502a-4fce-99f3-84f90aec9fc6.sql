-- CLIENTS
CREATE TABLE public.clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  phone text NOT NULL,
  email text,
  birth_date date,
  notes text,
  status text NOT NULL DEFAULT 'active',
  first_visit_at timestamptz,
  last_visit_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX clients_phone_key ON public.clients (phone);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.clients TO authenticated;
GRANT ALL ON public.clients TO service_role;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage clients" ON public.clients FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER clients_set_updated_at BEFORE UPDATE ON public.clients
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ANAMNESIS
CREATE TABLE public.client_anamnesis (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  pain_history text,
  injuries text,
  surgeries text,
  allergies text,
  medications text,
  contraindications text[] NOT NULL DEFAULT '{}',
  pressure_preference text,
  preferred_oils text[] NOT NULL DEFAULT '{}',
  avoid_areas text[] NOT NULL DEFAULT '{}',
  objectives text,
  signed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX client_anamnesis_client_key ON public.client_anamnesis (client_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.client_anamnesis TO authenticated;
GRANT ALL ON public.client_anamnesis TO service_role;
ALTER TABLE public.client_anamnesis ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage anamnesis" ON public.client_anamnesis FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER client_anamnesis_set_updated_at BEFORE UPDATE ON public.client_anamnesis
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- PACKAGES
CREATE TABLE public.packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  service_id uuid REFERENCES public.services(id) ON DELETE SET NULL,
  service_name text NOT NULL,
  total_sessions integer NOT NULL DEFAULT 1,
  used_sessions integer NOT NULL DEFAULT 0,
  total_price numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'active',
  purchased_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX packages_client_idx ON public.packages (client_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.packages TO authenticated;
GRANT ALL ON public.packages TO service_role;
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage packages" ON public.packages FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER packages_set_updated_at BEFORE UPDATE ON public.packages
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- PAYMENTS
CREATE TABLE public.package_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id uuid NOT NULL REFERENCES public.packages(id) ON DELETE CASCADE,
  amount numeric NOT NULL DEFAULT 0,
  method text NOT NULL DEFAULT 'pix',
  paid_at timestamptz NOT NULL DEFAULT now(),
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX package_payments_package_idx ON public.package_payments (package_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.package_payments TO authenticated;
GRANT ALL ON public.package_payments TO service_role;
ALTER TABLE public.package_payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage package payments" ON public.package_payments FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- SESSIONS
CREATE TABLE public.sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  appointment_id uuid REFERENCES public.appointments(id) ON DELETE SET NULL,
  package_id uuid REFERENCES public.packages(id) ON DELETE SET NULL,
  service_name text NOT NULL,
  performed_at timestamptz NOT NULL DEFAULT now(),
  session_notes text,
  pressure_used text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX sessions_client_idx ON public.sessions (client_id, performed_at DESC);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.sessions TO authenticated;
GRANT ALL ON public.sessions TO service_role;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage sessions" ON public.sessions FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- link appointments to clients (optional)
ALTER TABLE public.appointments
  ADD COLUMN client_id uuid REFERENCES public.clients(id) ON DELETE SET NULL;

-- session side effects
CREATE OR REPLACE FUNCTION public.handle_session_insert()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  IF NEW.package_id IS NOT NULL THEN
    UPDATE public.packages
      SET used_sessions = LEAST(used_sessions + 1, total_sessions),
          status = CASE WHEN used_sessions + 1 >= total_sessions THEN 'completed' ELSE status END
      WHERE id = NEW.package_id;
  END IF;

  UPDATE public.clients
    SET last_visit_at = GREATEST(COALESCE(last_visit_at, NEW.performed_at), NEW.performed_at),
        first_visit_at = LEAST(COALESCE(first_visit_at, NEW.performed_at), NEW.performed_at)
    WHERE id = NEW.client_id;

  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.handle_session_insert() FROM PUBLIC, anon, authenticated;

CREATE TRIGGER sessions_after_insert AFTER INSERT ON public.sessions
  FOR EACH ROW EXECUTE FUNCTION public.handle_session_insert();