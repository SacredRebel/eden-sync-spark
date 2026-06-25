
-- Fix search_path on trigger function
CREATE OR REPLACE FUNCTION public.touch_updated_at() RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;

-- Restrict has_role execution
REVOKE EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) TO authenticated, service_role;

-- Replace permissive insert policies with minimal validation
DROP POLICY IF EXISTS "Anyone can submit" ON public.submissions;
CREATE POLICY "Anyone can submit" ON public.submissions FOR INSERT TO anon, authenticated
WITH CHECK (length(name) > 0 AND length(email) > 3 AND email LIKE '%@%');

DROP POLICY IF EXISTS "Anyone insert messages" ON public.submission_messages;
CREATE POLICY "Anyone insert messages" ON public.submission_messages FOR INSERT TO anon, authenticated
WITH CHECK (length(content) > 0 AND role IN ('user','assistant'));
