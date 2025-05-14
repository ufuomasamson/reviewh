import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const app = express();
const PORT = 5001;

app.use(cors());
app.use(bodyParser.json());

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

app.post('/api/payment/webhook', async (req, res) => {
  const receivedHash = req.headers['verif-hash'];
  const secretHash = process.env.FLW_SECRET_HASH;

  if (!secretHash || receivedHash !== secretHash) {
    console.log('Invalid or missing secret hash. Webhook rejected.');
    return res.status(401).send('Invalid hash');
  }

  const event = req.body.event;
  const data = req.body.data;

  if (event === 'charge.completed' && data.status === 'successful') {
    const email = data.customer.email;
    const amount = data.amount;

    // Find the user by email
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, wallet_balance')
      .eq('email', email)
      .single();

    if (userError || !user) {
      console.log('User not found:', email, userError);
      return res.status(404).send('User not found');
    }

    // Update the user's wallet balance
    const newBalance = (user.wallet_balance || 0) + amount;
    const { error: updateError } = await supabase
      .from('users')
      .update({ wallet_balance: newBalance })
      .eq('id', user.id);

    if (updateError) {
      console.log('Failed to update wallet:', updateError);
      return res.status(500).send('Failed to update wallet');
    }

    console.log(`Wallet updated for ${email}: +${amount} (new balance: ${newBalance})`);
  }

  res.status(200).send('Webhook received');
});

app.listen(PORT, () => {
  console.log(`Webhook server running on http://localhost:${PORT}`);
});