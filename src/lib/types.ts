export type UserRole = 'admin' | 'business' | 'reviewer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  isVerified: boolean;
  createdAt: string;
}

export interface Business extends User {
  role: 'business';
  companyName: string;
  description: string;
  website?: string;
  verificationDocuments?: string[];
  walletBalance: number;
}

export interface Reviewer extends User {
  role: 'reviewer';
  bio?: string;
  reviewCount: number;
  walletBalance: number;
  earnings: number;
}

export interface Admin extends User {
  role: 'admin';
}

export interface Campaign {
  id: string;
  business_id: string;
  title: string;
  description: string;
  product: string;
  price_per_review: number;
  status: 'draft' | 'pending' | 'active' | 'completed' | 'rejected';
  target_reviews: number;
  completed_reviews: number;
  created_at: string;
  updated_at: string;
  business?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface Review {
  id: string;
  campaign_id: string;
  reviewer_id: string;
  rating: number;
  content: string;
  status: 'pending' | 'approved' | 'rejected';
  earnings: number;
  created_at: string;
  updated_at: string;
  reviewer?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: 'deposit' | 'withdrawal' | 'earning' | 'payment';
  status: 'pending' | 'completed' | 'failed';
  description: string;
  createdAt: string;
}