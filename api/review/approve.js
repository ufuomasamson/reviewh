import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY // Service role key!
  );

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { reviewId } = req.body;
  if (!reviewId) {
    return res.status(400).json({ error: 'Missing reviewId' });
  }

  // 1. Fetch the review (with status)
  const { data: review, error: reviewError } = await supabase
    .from('reviews')
    .select('id, status')
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

  return res.status(200).json({ success: true });
} 