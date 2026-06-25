
-- Anyone can upload files into the submissions bucket
CREATE POLICY "Anyone upload submissions" ON storage.objects FOR INSERT TO anon, authenticated
WITH CHECK (bucket_id = 'submissions');

-- Only admins can read/list files
CREATE POLICY "Admins read submissions" ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'submissions' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete submissions" ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'submissions' AND public.has_role(auth.uid(), 'admin'));
