
DO $$
DECLARE
  v_uid uuid;
  v_email text := 'sacredrebel@eden.local';
BEGIN
  DELETE FROM auth.users WHERE email IN ('sasha@eden.local', 'sacredrebel@eden.local');

  v_uid := gen_random_uuid();

  INSERT INTO auth.users (
    id, instance_id, aud, role, email,
    encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data,
    created_at, updated_at, is_super_admin, is_sso_user
  ) VALUES (
    v_uid,
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    v_email,
    crypt('sacredadmin', gen_salt('bf')),
    now(),
    jsonb_build_object('provider','email','providers',ARRAY['email']),
    '{}'::jsonb,
    now(), now(), false, false
  );

  INSERT INTO auth.identities (
    id, user_id, provider_id, provider, identity_data,
    created_at, updated_at, last_sign_in_at
  ) VALUES (
    gen_random_uuid(), v_uid, v_uid::text, 'email',
    jsonb_build_object('sub', v_uid::text, 'email', v_email, 'email_verified', true),
    now(), now(), now()
  );

  INSERT INTO public.user_roles (user_id, role) VALUES (v_uid, 'admin');
END $$;
