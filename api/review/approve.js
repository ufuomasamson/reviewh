import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // Service role key!
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { reviewId } = req.body;
  if (!reviewId) {
    return res.status(400).json({ error: 'Missing reviewId' });
  }

  // 1. Fetch the review (with reviewer_id, earnings, status, campaign_id)
  const { data: review, error: reviewError } = await supabase
    .from('reviews')
    .select('id, reviewer_id, earnings, status, campaign_id')
    .eq('id', reviewId)
    .single();

  if (reviewError || !review) {
    return res.status(404).json({ error: 'Review not found' });
  }

  if (review.status === 'approved') {
    return res.status(400).json({ error: 'Review already approved' });
  }

  // 2. Update review status to 'approved'
  const { error: updateError } = await supabase
    .from('reviews')
    .update({ status: 'approved' })
    .eq('id', reviewId);

  if (updateError) {
    return res.status(500).json({ error: 'Failed to update review status' });
  }

  // 3. Credit reviewer wallet
  const { data: reviewer, error: reviewerError } = await supabase
    .from('reviewers')
    .select('wallet_balance')
    .eq('id', review.reviewer_id)
    .single();

  if (reviewerError || !reviewer) {
    return res.status(404).json({ error: 'Reviewer not found' });
  }

  const newBalance = (reviewer.wallet_balance || 0) + (review.earnings || 0);

  const { error: walletError } = await supabase
    .from('reviewers')
    .update({ wallet_balance: newBalance })
    .eq('id', review.reviewer_id);

  if (walletError) {
    return res.status(500).json({ error: 'Failed to update reviewer wallet' });
  }

  // 4. Insert transaction
  const { error: txnError } = await supabase
    .from('transactions')
    .insert({
      user_id: review.reviewer_id,
      amount: review.earnings,
      type: 'earning',
      status: 'completed',
      description: `Review payment for review ${review.id}`
    });

  if (txnError) {
    return res.status(500).json({ error: 'Failed to insert earning transaction' });
  }

  return res.status(200).json({ success: true });
} 