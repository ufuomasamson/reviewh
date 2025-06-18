-- Fix review approval by creating proper RPC function and updating RLS policies

-- First, update the transactions RLS policy to allow system operations
DROP POLICY IF EXISTS "System can create transactions" ON transactions;

-- Create a more flexible policy for transaction creation
CREATE POLICY "Allow transaction creation for review approvals"
  ON transactions FOR INSERT
  WITH CHECK (
    -- Allow admins to create any transaction
    auth.jwt() ->> 'role' = 'admin' OR
    -- Allow authenticated users to create earning transactions (for review approvals)
    (type = 'earning' AND auth.uid() IS NOT NULL)
  );

-- Create RPC function to approve reviews atomically
CREATE OR REPLACE FUNCTION approve_review_atomic(review_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  review_record RECORD;
  campaign_record RECORD;
  transaction_id UUID;
  result JSON;
BEGIN
  -- Check if user is admin
  IF auth.jwt() ->> 'role' != 'admin' THEN
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
GRANT EXECUTE ON FUNCTION approve_review_atomic(UUID) TO authenticated;

-- Create a simpler function for direct review status updates (for frontend-only mode)
CREATE OR REPLACE FUNCTION update_review_status_simple(review_id UUID, new_status TEXT)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  review_record RECORD;
  result JSON;
BEGIN
  -- Check if user is admin
  IF auth.jwt() ->> 'role' != 'admin' THEN
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
    'status', new_status
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
GRANT EXECUTE ON FUNCTION update_review_status_simple(UUID, TEXT) TO authenticated;
