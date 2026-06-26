
DO $$
DECLARE
  new_user_id uuid := gen_random_uuid();
  admin_email text := 'sasha@eden.local';
  admin_password text := 'EdenAdmin2026!';
  existing_id uuid;
BEGIN
  SELECT id INTO existing_id FROM auth.users WHERE email = admin_email;

  IF existing_id IS NULL THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data, is_super_admin, is_sso_user
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      new_user_id, 'authenticated', 'authenticated', admin_email,
      crypt(admin_password, gen_salt('bf')),
      now(), now(), now(),
      jsonb_build_object('provider','email','providers',jsonb_build_array('email')),
      '{}'::jsonb, false, false
    );

    INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
    VALUES (
      gen_random_uuid(), new_user_id,
      jsonb_build_object('sub', new_user_id::text, 'email', admin_email, 'email_verified', true),
      'email', new_user_id::text, now(), now(), now()
    );

    existing_id := new_user_id;
  END IF;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (existing_id, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;
END $$;
