-- Add delete policy for campaigns
CREATE POLICY "Businesses can delete their own campaigns"
  ON campaigns FOR DELETE
  USING (business_id = auth.uid());
 
-- Add delete policy for admins
CREATE POLICY "Admins can delete any campaign"
  ON campaigns FOR DELETE
  USING (auth.jwt() ->> 'role' = 'admin'); 