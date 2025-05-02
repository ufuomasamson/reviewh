-- Create admin user with password
-- Password will be: Admin@123 (you can change this after logging in)
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'barnesfrances000@gmail.com',
  crypt('Admin@123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"name":"System Administrator"}',
  now(),
  now(),
  '',
  '',
  '',
  ''
);

-- Get the user id from the auth.users table
DO $$
DECLARE
  auth_user_id uuid;
BEGIN
  SELECT id INTO auth_user_id FROM auth.users WHERE email = 'barnesfrances000@gmail.com';
  
  -- Insert into public.users table
  INSERT INTO public.users (
    id,
    email,
    name,
    role,
    is_verified
  ) VALUES (
    auth_user_id,
    'barnesfrances000@gmail.com',
    'System Administrator',
    'admin',
    true
  )
  ON CONFLICT (email) DO NOTHING;
END $$; 