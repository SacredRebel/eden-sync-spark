
-- ROLES
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- STATUS ENUM
CREATE TYPE public.submission_status AS ENUM ('new', 'reviewing', 'quoted', 'won', 'lost', 'ready_to_book');

-- SUBMISSIONS
CREATE TABLE public.submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- contact
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  -- project
  project_type TEXT,
  vision TEXT,
  budget_range TEXT,
  timeline TEXT,
  -- media (array of {path, name, mime, size, kind: 'image'|'video'|'audio'})
  media JSONB NOT NULL DEFAULT '[]'::jsonb,
  -- transcripts of audio/video recordings, keyed by file path
  transcripts JSONB NOT NULL DEFAULT '{}'::jsonb,
  -- ai output
  ai_estimate_low NUMERIC,
  ai_estimate_high NUMERIC,
  ai_summary TEXT,
  -- admin
  status public.submission_status NOT NULL DEFAULT 'new',
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.submissions TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.submissions TO authenticated;
GRANT ALL ON public.submissions TO service_role;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- Anyone can create a submission (it's a public quote form)
CREATE POLICY "Anyone can submit" ON public.submissions FOR INSERT TO anon, authenticated WITH CHECK (true);
-- Only admins can read/update/delete
CREATE POLICY "Admins read submissions" ON public.submissions FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update submissions" ON public.submissions FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete submissions" ON public.submissions FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- CHAT MESSAGES (assistant follow-up conversation)
CREATE TABLE public.submission_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID NOT NULL REFERENCES public.submissions(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user','assistant','system')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.submission_messages TO anon, authenticated;
GRANT SELECT ON public.submission_messages TO authenticated;
GRANT ALL ON public.submission_messages TO service_role;
ALTER TABLE public.submission_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone insert messages" ON public.submission_messages FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins read messages" ON public.submission_messages FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.touch_updated_at() RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;
CREATE TRIGGER trg_submissions_touch BEFORE UPDATE ON public.submissions FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE INDEX idx_submissions_status_created ON public.submissions(status, created_at DESC);
