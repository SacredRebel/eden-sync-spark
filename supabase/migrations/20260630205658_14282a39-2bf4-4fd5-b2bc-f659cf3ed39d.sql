
CREATE SCHEMA IF NOT EXISTS private;

CREATE OR REPLACE FUNCTION private.has_role(_user_id uuid, _role public.app_role)
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

REVOKE ALL ON FUNCTION private.has_role(uuid, public.app_role) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) TO authenticated, service_role;

-- Drop dependent policies, drop the public function, recreate policies against private.has_role
DROP POLICY IF EXISTS "Admins read submissions" ON public.submissions;
DROP POLICY IF EXISTS "Admins update submissions" ON public.submissions;
DROP POLICY IF EXISTS "Admins delete submissions" ON public.submissions;
DROP POLICY IF EXISTS "Admins read messages" ON public.submission_messages;
DROP POLICY IF EXISTS "Admins read submissions" ON storage.objects;
DROP POLICY IF EXISTS "Admins delete submissions" ON storage.objects;

DROP FUNCTION IF EXISTS public.has_role(uuid, public.app_role);

CREATE POLICY "Admins read submissions" ON public.submissions
  FOR SELECT TO authenticated
  USING (private.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins update submissions" ON public.submissions
  FOR UPDATE TO authenticated
  USING (private.has_role(auth.uid(), 'admin'))
  WITH CHECK (private.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete submissions" ON public.submissions
  FOR DELETE TO authenticated
  USING (private.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins read messages" ON public.submission_messages
  FOR SELECT TO authenticated
  USING (private.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins read submissions" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'submissions' AND private.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete submissions" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'submissions' AND private.has_role(auth.uid(), 'admin'));

-- Thin SECURITY INVOKER wrapper so existing app code calling rpc('has_role', ...)
-- keeps working. Only returns true for the caller's own uid; safe to expose.
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  IF _user_id IS DISTINCT FROM auth.uid() THEN
    RETURN false;
  END IF;
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
END $$;

REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;
