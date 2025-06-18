-- Temporary fix for review update policy
-- This allows authenticated users to update review status for testing
-- In production, you should implement proper role-based access

-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "Admins can update review status" ON reviews;

-- Create a more permissive policy for testing
-- This allows any authenticated user to update review status
-- TODO: Replace with proper role-based policy once JWT metadata is configured
CREATE POLICY "Authenticated users can update review status (temp)"
  ON reviews FOR UPDATE
  USING (auth.uid() IS NOT NULL);

-- Alternative: If you want to check against the users table instead of JWT
-- CREATE POLICY "Users with admin role can update review status"
--   ON reviews FOR UPDATE
--   USING (
--     EXISTS (
--       SELECT 1 FROM users 
--       WHERE users.id = auth.uid() 
--       AND users.role = 'admin'
--     )
--   );
