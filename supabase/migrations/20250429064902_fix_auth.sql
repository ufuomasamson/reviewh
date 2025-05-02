-- Enable the pgcrypto extension for UUID generation if not already enabled
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own data" ON users;
DROP POLICY IF EXISTS "Admins can view all users" ON users;
DROP POLICY IF EXISTS "Users can update their own data" ON users;
DROP POLICY IF EXISTS "Enable insert for authentication" ON users;
DROP POLICY IF EXISTS "Enable insert for new businesses" ON businesses;
DROP POLICY IF EXISTS "Enable insert for new reviewers" ON reviewers;

-- Ensure RLS is enabled
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviewers ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Enable insert for authentication" 
ON users FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Enable select for authenticated users" 
ON users FOR SELECT 
USING (true);

CREATE POLICY "Enable update for users based on id" 
ON users FOR UPDATE 
USING (auth.uid() = id);

-- Create policies for businesses table
CREATE POLICY "Enable insert for new businesses" 
ON businesses FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Enable select for authenticated users" 
ON businesses FOR SELECT 
USING (true);

CREATE POLICY "Enable update for businesses based on id" 
ON businesses FOR UPDATE 
USING (auth.uid() = id);

-- Create policies for reviewers table
CREATE POLICY "Enable insert for new reviewers" 
ON reviewers FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Enable select for authenticated users" 
ON reviewers FOR SELECT 
USING (true);

CREATE POLICY "Enable update for reviewers based on id" 
ON reviewers FOR UPDATE 
USING (auth.uid() = id);

-- Grant necessary permissions to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Grant necessary permissions to anon users for registration
GRANT USAGE ON SCHEMA public TO anon;
GRANT ALL ON users TO anon;
GRANT ALL ON businesses TO anon;
GRANT ALL ON reviewers TO anon; 