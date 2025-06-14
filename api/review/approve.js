import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const { reviewId } = req.body;
  if (!reviewId) {
    return res.status(400).json({ error: 'Missing reviewId' });
  }

  // 1. Fetch the review with campaign and reviewer info
  const { data: review, error: reviewError } = await supabase
    .from('reviews')
    .select('id, status, campaign_id, reviewer_id, earnings')
    .eq('id', reviewId)
    .single();

  if (reviewError || !review) {
    return res.status(404).json({ error: 'Review not found' });
  }
  if (review.status === 'approved') {
    return res.status(400).json({ error: 'Review already approved' });
  }

  // 2. Start a transaction (using Supabase PostgREST RPC)
  const { error } = await supabase.rpc('approve_review_atomic', {
    review_id: reviewId
  });

  if (error) {
    return res.status(500).json({ error: 'Failed to approve review: ' + error.message });
  }

  return res.status(200).json({ success: true });
} 