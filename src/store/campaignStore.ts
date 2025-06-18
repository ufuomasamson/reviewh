import { create } from 'zustand';
import { Campaign, Review } from '../lib/types';
import { supabase } from '../lib/supabase';

interface CampaignState {
  campaigns: Campaign[];
  reviews: Review[];
  isLoading: boolean;
  error: string | null;
  
  // Campaign actions
  getCampaigns: () => Promise<Campaign[]>;
  getCampaignById: (id: string) => Promise<Campaign | undefined>;
  getBusinessCampaigns: (businessId: string) => Promise<Campaign[]>;
  createCampaign: (campaign: Omit<Campaign, 'id' | 'created_at' | 'updated_at' | 'completed_reviews'>) => Promise<Campaign>;
  updateCampaign: (id: string, campaignData: Partial<Campaign>) => Promise<Campaign>;
  deleteCampaign: (id: string) => Promise<void>;
  
  // Review actions
  getReviews: (campaignId?: string, isAdmin?: boolean) => Promise<Review[]>;
  getReviewById: (id: string) => Promise<Review | undefined>;
  createReview: (review: Omit<Review, 'id' | 'created_at' | 'updated_at'>) => Promise<Review>;
  updateReviewStatus: (id: string, status: Review['status']) => Promise<Review>;
}

export const useCampaignStore = create<CampaignState>((set, get) => ({
  campaigns: [],
  reviews: [],
  isLoading: false,
  error: null,
  
  // Campaign methods
  getCampaigns: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data: campaigns, error } = await supabase
        .from('campaigns')
        .select(`
          *,
          business:businesses!campaigns_business_id_fkey(
            id,
            company_name,
            description,
            website
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      set({ campaigns: campaigns || [] });
      return campaigns || [];
    } catch (error) {
      set({ error: 'Failed to fetch campaigns' });
      return [];
    } finally {
      set({ isLoading: false });
    }
  },
  
  getCampaignById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data: campaign, error } = await supabase
        .from('campaigns')
        .select(`
          *,
          business:businesses!campaigns_business_id_fkey(
            id,
            company_name,
            description,
            website
          )
        `)
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('Error fetching campaign:', error);
        throw error;
      }
      
      if (!campaign) {
        throw new Error('Campaign not found');
      }
      
      return campaign;
    } catch (error) {
      console.error('Failed to fetch campaign:', error);
      set({ error: 'Failed to fetch campaign' });
      return null;
    } finally {
      set({ isLoading: false });
    }
  },
  
  getBusinessCampaigns: async (businessId: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data: campaigns, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('business_id', businessId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return campaigns || [];
    } catch (error) {
      set({ error: 'Failed to fetch business campaigns' });
      return [];
    } finally {
      set({ isLoading: false });
    }
  },
  
  createCampaign: async (campaignData) => {
    set({ isLoading: true, error: null });
    try {
      console.log('Creating campaign with data:', campaignData);
      
      const { data: campaign, error } = await supabase
        .from('campaigns')
        .insert([{
        ...campaignData,
          completed_reviews: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select(`
          *,
          business:businesses!campaigns_business_id_fkey(
            id,
            company_name,
            description,
            website
          )
        `)
        .single();
      
      if (error) {
        console.error('Error creating campaign:', error);
        throw error;
      }
      
      if (!campaign) {
        throw new Error('Failed to create campaign');
      }

      console.log('Campaign created successfully:', campaign);
      
      set(state => ({ 
        campaigns: [campaign, ...state.campaigns]
      }));
      
      return campaign;
    } catch (error) {
      console.error('Failed to create campaign:', error);
      set({ error: 'Failed to create campaign' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
  
  updateCampaign: async (id, campaignData) => {
    set({ isLoading: true, error: null });
    try {
      const { data: campaign, error } = await supabase
        .from('campaigns')
        .update(campaignData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      set(state => ({
        campaigns: state.campaigns.map(c => 
          c.id === id ? campaign : c
        )
      }));
      
      return campaign;
    } catch (error) {
      set({ error: 'Failed to update campaign' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
  
  deleteCampaign: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      console.log('Deleting campaign:', id);
      
      const { error } = await supabase
        .from('campaigns')
        .delete()
        .match({ id });
      
      if (error) {
        console.error('Error deleting campaign:', error);
        throw error;
      }

      console.log('Campaign deleted successfully');
      
      // Update local state to remove the deleted campaign
      set(state => ({
        campaigns: state.campaigns.filter(c => c.id !== id)
      }));
    } catch (error) {
      console.error('Failed to delete campaign:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to delete campaign' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
  
  // Review methods
  getReviews: async (campaignId?: string, isAdmin?: boolean) => {
    set({ isLoading: true, error: null });
    try {
      let query;
      // Join reviewers table for reviewer info
      query = supabase.from('reviews').select(`
        *,
        reviewer:reviewers!reviews_reviewer_id_fkey(
          id,
          name,
          email,
          country
        )
      `);
      if (campaignId) {
        query = query.eq('campaign_id', campaignId);
      }
      const { data: reviews, error } = await query.order('created_at', { ascending: false });
      if (error) {
        console.error('Error fetching reviews:', error);
        throw error;
      }
      return reviews || [];
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
      set({ error: 'Failed to fetch reviews' });
      return [];
    } finally {
      set({ isLoading: false });
    }
  },
  
  getReviewById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data: review, error } = await supabase
        .from('reviews')
        .select('*, reviewer:reviewers(name, country)')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      return review;
    } catch (error) {
      set({ error: 'Failed to fetch review' });
      return undefined;
    } finally {
      set({ isLoading: false });
    }
  },
  
  createReview: async (reviewData) => {
    set({ isLoading: true, error: null });
    try {
      const { data: review, error } = await supabase
        .from('reviews')
        .insert([reviewData])
        .select('*, reviewer:reviewers(name, country)')
        .single();
      
      if (error) throw error;
      
      set(state => ({ 
        reviews: [review, ...state.reviews]
      }));
      
      return review;
    } catch (error) {
      set({ error: 'Failed to create review' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
  
  updateReviewStatus: async (id, status) => {
    set({ isLoading: true, error: null });
    try {
      console.log('Updating review status:', { id, status });

      // Use the RPC function for secure review status updates
      const { data: result, error: rpcError } = await supabase
        .rpc('update_review_status_admin_only', {
          review_id: id,
          new_status: status
        });

      if (rpcError) {
        console.error('RPC Error:', rpcError);
        throw rpcError;
      }

      if (!result?.success) {
        throw new Error(result?.error || 'Failed to update review status');
      }

      console.log('Review status updated successfully via RPC:', result);

      // Fetch the updated review with relations
      const { data: reviews, error: fetchError } = await supabase
        .from('reviews')
        .select('*, reviewer:reviewers(id), campaign:campaigns(title)')
        .eq('id', id);

      if (fetchError) {
        console.error('Fetch error:', fetchError);
        throw fetchError;
      }

      const review = reviews && reviews.length > 0 ? reviews[0] : null;
      if (!review) throw new Error('No review returned after update');

      console.log('Fetched updated review:', review);

      // Update the local state
      set(state => ({
        reviews: state.reviews.map(r =>
          r.id === id ? review : r
        )
      }));

      return review;
    } catch (error: any) {
      console.error('Error updating review status:', error);

      // Provide more specific error messages
      if (error?.message?.includes('Only admins can update review status')) {
        set({ error: 'Permission denied. Only admins can update review status.' });
      } else if (error?.code === 'PGRST202') {
        set({ error: 'Database function not found. Please apply the latest migrations.' });
      } else if (error?.code === 'PGRST116') {
        set({ error: 'Review not found or access denied.' });
      } else {
        set({ error: 'Failed to update review status' });
      }

      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
}));