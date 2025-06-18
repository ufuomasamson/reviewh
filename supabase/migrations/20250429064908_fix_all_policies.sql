-- Comprehensive fix for all RLS policies to enable review approval

-- 1. Fix Reviews Table Policies
-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Admins can update review status" ON reviews;
DROP POLICY IF EXISTS "Authenticated users can update review status (temp)" ON reviews;
DROP POLICY IF EXISTS "Admins and service role can update review status" ON reviews;

-- Create flexible review update policy that checks the users table for admin role
CREATE POLICY "Allow review updates for admins"
  ON reviews FOR UPDATE
  USING (
    -- Check if the current user has admin role in the users table
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- 2. Fix Transactions Table Policies  
-- Drop existing restrictive policies
DROP POLICY IF EXISTS "System can create transactions" ON transactions;
DROP POLICY IF EXISTS "Allow transaction creation for review approvals" ON transactions;
DROP POLICY IF EXISTS "Flexible transaction creation policy" ON transactions;

-- Create policy that allows admins to create transactions
CREATE POLICY "Allow transaction creation for admins"
  ON transactions FOR INSERT
  WITH CHECK (
    -- Check if the current user has admin role in the users table
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- 3. Ensure all other policies are permissive enough
-- Update users policies to allow reading user roles
DROP POLICY IF EXISTS "Enable select for authenticated users" ON users;
CREATE POLICY "Allow users to read user data"
  ON users FOR SELECT
  USING (true); -- Allow all authenticated users to read user data (needed for role checks)

-- 4. Create a simple function for review status updates
CREATE OR REPLACE FUNCTION update_review_status_admin_only(review_id UUID, new_status TEXT)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  review_record RECORD;
  current_user_role TEXT;
  result JSON;
BEGIN
  -- Get the current user's role from the users table
  SELECT role INTO current_user_role
  FROM users
  WHERE id = auth.uid();

  -- Check if user is admin
  IF current_user_role != 'admin' THEN
    RAISE EXCEPTION 'Only admins can update review status';
  END IF;

  -- Update review status
  UPDATE reviews
  SET status = new_status::review_status, updated_at = now()
  WHERE id = review_id
  RETURNING * INTO review_record;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Review not found';
  END IF;

  -- Return success result
  result := json_build_object(
    'success', true,
    'review_id', review_id,
    'status', new_status,
    'updated_at', review_record.updated_at
  );

  RETURN result;

EXCEPTION
  WHEN OTHERS THEN
    -- Return error result
    result := json_build_object(
      'success', false,
      'error', SQLERRM
    );
    RETURN result;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION update_review_status_admin_only(UUID, TEXT) TO authenticated;

-- 5. Create function for review approval with transaction creation (optional)
CREATE OR REPLACE FUNCTION approve_review_with_transaction(review_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  review_record RECORD;
  campaign_record RECORD;
  current_user_role TEXT;
  transaction_id UUID;
  result JSON;
BEGIN
  -- Get the current user's role from the users table
  SELECT role INTO current_user_role
  FROM users
  WHERE id = auth.uid();

  -- Check if user is admin
  IF current_user_role != 'admin' THEN
    RAISE EXCEPTION 'Only admins can approve reviews';
  END IF;

  -- Get the review details
  SELECT * INTO review_record
  FROM reviews
  WHERE id = review_id AND status = 'pending';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Review not found or already processed';
  END IF;

  -- Get the campaign details
  SELECT * INTO campaign_record
  FROM campaigns
  WHERE id = review_record.campaign_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Campaign not found';
  END IF;

  -- Update review status to approved
  UPDATE reviews
  SET status = 'approved', updated_at = now()
  WHERE id = review_id;

  -- Create earning transaction for the reviewer
  INSERT INTO transactions (
    user_id,
    amount,
    type,
    status,
    description
  ) VALUES (
    review_record.reviewer_id,
    review_record.earnings,
    'earning',
    'completed',
    'Review payment for campaign: ' || campaign_record.title
  ) RETURNING id INTO transaction_id;

  -- Update reviewer's wallet balance
  UPDATE reviewers
  SET 
    wallet_balance = wallet_balance + review_record.earnings,
    total_earnings = total_earnings + review_record.earnings
  WHERE id = review_record.reviewer_id;

  -- Update campaign's completed reviews count
  UPDATE campaigns
  SET completed_reviews = completed_reviews + 1
  WHERE id = review_record.campaign_id;

  -- Return success result
  result := json_build_object(
    'success', true,
    'review_id', review_id,
    'transaction_id', transaction_id,
    'earnings', review_record.earnings
  );

  RETURN result;

EXCEPTION
  WHEN OTHERS THEN
    -- Return error result
    result := json_build_object(
      'success', false,
      'error', SQLERRM
    );
    RETURN result;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION approve_review_with_transaction(UUID) TO authenticated;
