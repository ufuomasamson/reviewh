/*
  # Initial Database Schema

  1. New Tables
    - `users`: Base table for all user types
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `name` (text)
      - `role` (enum: admin, business, reviewer)
      - `avatar_url` (text, nullable)
      - `is_verified` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `businesses`: Extended profile for business users
      - `id` (uuid, primary key, references users)
      - `company_name` (text)
      - `description` (text)
      - `website` (text, nullable)
      - `verification_documents` (jsonb, nullable)
      - `wallet_balance` (decimal)

    - `reviewers`: Extended profile for reviewer users
      - `id` (uuid, primary key, references users)
      - `bio` (text, nullable)
      - `review_count` (integer)
      - `wallet_balance` (decimal)
      - `total_earnings` (decimal)

    - `campaigns`: Review campaigns created by businesses
      - `id` (uuid, primary key)
      - `business_id` (uuid, references businesses)
      - `title` (text)
      - `description` (text)
      - `product` (text)
      - `price_per_review` (decimal)
      - `status` (enum: draft, pending, active, completed, rejected)
      - `target_reviews` (integer)
      - `completed_reviews` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `reviews`: Reviews submitted by reviewers
      - `id` (uuid, primary key)
      - `campaign_id` (uuid, references campaigns)
      - `reviewer_id` (uuid, references reviewers)
      - `rating` (integer)
      - `content` (text)
      - `status` (enum: pending, approved, rejected)
      - `earnings` (decimal)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `transactions`: Wallet transactions
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users)
      - `amount` (decimal)
      - `type` (enum: deposit, withdrawal, earning, payment)
      - `status` (enum: pending, completed, failed)
      - `description` (text)
      - `created_at` (timestamp)

  2. Security
    - RLS policies for each table
    - Secure access patterns for different user roles

  3. Indexes
    - Optimized queries with appropriate indexes
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE user_role AS ENUM ('admin', 'business', 'reviewer');
CREATE TYPE campaign_status AS ENUM ('draft', 'pending', 'active', 'completed', 'rejected');
CREATE TYPE review_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE transaction_type AS ENUM ('deposit', 'withdrawal', 'earning', 'payment');
CREATE TYPE transaction_status AS ENUM ('pending', 'completed', 'failed');

-- Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role user_role NOT NULL,
  avatar_url TEXT,
  is_verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create businesses table
CREATE TABLE businesses (
  id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  description TEXT NOT NULL,
  website TEXT,
  verification_documents JSONB,
  wallet_balance DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create reviewers table
CREATE TABLE reviewers (
  id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  bio TEXT,
  review_count INTEGER NOT NULL DEFAULT 0,
  wallet_balance DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  total_earnings DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create campaigns table
CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  product TEXT NOT NULL,
  price_per_review DECIMAL(12,2) NOT NULL,
  status campaign_status NOT NULL DEFAULT 'draft',
  target_reviews INTEGER NOT NULL,
  completed_reviews INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (price_per_review >= 0.50 AND price_per_review <= 10.00),
  CHECK (target_reviews >= 5 AND target_reviews <= 1000),
  CHECK (completed_reviews >= 0 AND completed_reviews <= target_reviews)
);

-- Create reviews table
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES reviewers(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL,
  content TEXT NOT NULL,
  status review_status NOT NULL DEFAULT 'pending',
  earnings DECIMAL(12,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (rating >= 1 AND rating <= 5),
  CHECK (length(content) >= 50),
  UNIQUE (campaign_id, reviewer_id)
);

-- Create transactions table
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount DECIMAL(12,2) NOT NULL,
  type transaction_type NOT NULL,
  status transaction_status NOT NULL DEFAULT 'pending',
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (amount > 0)
);

-- Create indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_campaigns_business_id ON campaigns(business_id);
CREATE INDEX idx_campaigns_status ON campaigns(status);
CREATE INDEX idx_reviews_campaign_id ON reviews(campaign_id);
CREATE INDEX idx_reviews_reviewer_id ON reviews(reviewer_id);
CREATE INDEX idx_reviews_status ON reviews(status);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_status ON transactions(status);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviewers ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies

-- Users policies
CREATE POLICY "Users can view their own data"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all users"
  ON users FOR SELECT
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Users can update their own data"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- Businesses policies
CREATE POLICY "Businesses can view their own data"
  ON businesses FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all businesses"
  ON businesses FOR SELECT
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Businesses can update their own data"
  ON businesses FOR UPDATE
  USING (auth.uid() = id);

-- Reviewers policies
CREATE POLICY "Reviewers can view their own data"
  ON reviewers FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all reviewers"
  ON reviewers FOR SELECT
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Reviewers can update their own data"
  ON reviewers FOR UPDATE
  USING (auth.uid() = id);

-- Campaigns policies
CREATE POLICY "Anyone can view active campaigns"
  ON campaigns FOR SELECT
  USING (status = 'active');

CREATE POLICY "Businesses can view their own campaigns"
  ON campaigns FOR SELECT
  USING (business_id = auth.uid());

CREATE POLICY "Admins can view all campaigns"
  ON campaigns FOR SELECT
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Businesses can create campaigns"
  ON campaigns FOR INSERT
  WITH CHECK (business_id = auth.uid());

CREATE POLICY "Businesses can update their own campaigns"
  ON campaigns FOR UPDATE
  USING (business_id = auth.uid());

-- Reviews policies
CREATE POLICY "Anyone can view approved reviews"
  ON reviews FOR SELECT
  USING (status = 'approved');

CREATE POLICY "Reviewers can view their own reviews"
  ON reviews FOR SELECT
  USING (reviewer_id = auth.uid());

CREATE POLICY "Businesses can view reviews for their campaigns"
  ON reviews FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM campaigns
    WHERE campaigns.id = reviews.campaign_id
    AND campaigns.business_id = auth.uid()
  ));

CREATE POLICY "Admins can view all reviews"
  ON reviews FOR SELECT
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Reviewers can create reviews"
  ON reviews FOR INSERT
  WITH CHECK (reviewer_id = auth.uid());

CREATE POLICY "Admins can update review status"
  ON reviews FOR UPDATE
  USING (auth.jwt() ->> 'role' = 'admin');

-- Transactions policies
CREATE POLICY "Users can view their own transactions"
  ON transactions FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all transactions"
  ON transactions FOR SELECT
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "System can create transactions"
  ON transactions FOR INSERT
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Create functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_businesses_updated_at
  BEFORE UPDATE ON businesses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviewers_updated_at
  BEFORE UPDATE ON reviewers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_campaigns_updated_at
  BEFORE UPDATE ON campaigns
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();