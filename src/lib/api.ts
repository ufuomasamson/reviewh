import { supabase } from './supabase';
import { mockCampaigns, mockReviews, mockBusinesses, mockReviewers } from './mockData';

// Campaign API functions
export const getCampaigns = async () => {
  try {
    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase error, using mock data:', error);
      return mockCampaigns;
    }

    return data || mockCampaigns;
  } catch (error) {
    console.warn('API error, using mock data:', error);
    return mockCampaigns;
  }
};

export const getBusinessCampaigns = async (businessId: string) => {
  try {
    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .eq('business_id', businessId)
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase error, using mock data:', error);
      return mockCampaigns.filter(c => c.businessId === businessId);
    }

    return data || mockCampaigns.filter(c => c.businessId === businessId);
  } catch (error) {
    console.warn('API error, using mock data:', error);
    return mockCampaigns.filter(c => c.businessId === businessId);
  }
};

// Review API functions
export const getReviews = async () => {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        campaign:campaigns(*),
        reviewer:users(*)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase error, using mock data:', error);
      return mockReviews;
    }

    return data || mockReviews;
  } catch (error) {
    console.warn('API error, using mock data:', error);
    return mockReviews;
  }
};

export const getReviewerReviews = async (reviewerId: string) => {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        campaign:campaigns(*)
      `)
      .eq('reviewer_id', reviewerId)
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase error, using mock data:', error);
      return mockReviews.filter(r => r.reviewerId === reviewerId);
    }

    return data || mockReviews.filter(r => r.reviewerId === reviewerId);
  } catch (error) {
    console.warn('API error, using mock data:', error);
    return mockReviews.filter(r => r.reviewerId === reviewerId);
  }
};

// Wallet and earnings functions
export const getWalletBalance = async (userId: string) => {
  try {
    // Try to get from businesses table first
    const { data: business, error: businessError } = await supabase
      .from('businesses')
      .select('wallet_balance')
      .eq('id', userId)
      .single();

    if (!businessError && business) {
      return business.wallet_balance || 0;
    }

    // Try to get from reviewers/users table
    const { data: reviewer, error: reviewerError } = await supabase
      .from('users')
      .select('wallet_balance')
      .eq('id', userId)
      .single();

    if (!reviewerError && reviewer) {
      return reviewer.wallet_balance || 0;
    }

    console.warn('Supabase error, using mock data:', businessError || reviewerError);
    
    // Fallback to mock data
    const mockBusiness = mockBusinesses.find(b => b.id === userId);
    if (mockBusiness) return mockBusiness.walletBalance;
    
    const mockReviewer = mockReviewers.find(r => r.id === userId);
    if (mockReviewer) return mockReviewer.walletBalance;
    
    return 0;
  } catch (error) {
    console.warn('API error, using mock data:', error);
    
    // Fallback to mock data
    const mockBusiness = mockBusinesses.find(b => b.id === userId);
    if (mockBusiness) return mockBusiness.walletBalance;
    
    const mockReviewer = mockReviewers.find(r => r.id === userId);
    if (mockReviewer) return mockReviewer.walletBalance;
    
    return 0;
  }
};

export const getTotalEarnings = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('earnings')
      .eq('reviewer_id', userId)
      .eq('status', 'approved');

    if (error) {
      console.warn('Supabase error, using mock data:', error);
      const mockUserReviews = mockReviews.filter(r => r.reviewerId === userId && r.status === 'approved');
      return mockUserReviews.reduce((total, review) => total + (review.earnings || 0), 0);
    }

    const totalEarnings = data?.reduce((total, review) => total + (review.earnings || 0), 0) || 0;
    return totalEarnings;
  } catch (error) {
    console.warn('API error, using mock data:', error);
    const mockUserReviews = mockReviews.filter(r => r.reviewerId === userId && r.status === 'approved');
    return mockUserReviews.reduce((total, review) => total + (review.earnings || 0), 0);
  }
};

// Business profile functions
export const getBusinessProfile = async (businessId: string) => {
  try {
    const { data, error } = await supabase
      .from('businesses')
      .select('*')
      .eq('id', businessId)
      .single();

    if (error) {
      console.warn('Supabase error, using mock data:', error);
      return mockBusinesses.find(b => b.id === businessId) || null;
    }

    return data || mockBusinesses.find(b => b.id === businessId) || null;
  } catch (error) {
    console.warn('API error, using mock data:', error);
    return mockBusinesses.find(b => b.id === businessId) || null;
  }
};

// User functions
export const getUsers = async () => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase error, using mock data:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.warn('API error, using mock data:', error);
    return [];
  }
};

// Transaction functions
export const getTransactions = async (userId?: string) => {
  try {
    let query = supabase
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false });

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query;

    if (error) {
      console.warn('Supabase error, using mock data:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.warn('API error, using mock data:', error);
    return [];
  }
};
