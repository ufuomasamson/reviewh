import React, { useEffect, useState } from 'react';
import { Star, Search, Filter, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useCampaignStore } from '../../store/campaignStore';
import { Review, Campaign } from '../../lib/types';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { ReviewCard } from '../../components/review/ReviewCard';
import { Alert } from '../../components/ui/Alert';
import { supabase } from '../../lib/supabase';

export const ReviewsPage: React.FC = () => {
  const { user } = useAuthStore();
  const { getReviews, getCampaigns, updateReviewStatus, isLoading, error } = useCampaignStore();
  
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [campaignFilter, setCampaignFilter] = useState('all');
  
  // Debug: Log the Supabase session for authentication troubleshooting
  useEffect(() => {
    supabase.auth.getSession().then(({ data, error }) => {
      console.log('Supabase session:', data?.session);
      if (error) console.error('Session error:', error);
    });
  }, []);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all campaigns for the dropdown filter
        const allCampaigns = await getCampaigns();
        setCampaigns(allCampaigns);
        
        // Fetch reviews based on user role
        let fetchedReviews;
        if (user?.role === 'admin') {
          fetchedReviews = await getReviews(undefined, true);
        } else {
          fetchedReviews = await getReviews();
        }
        
        if (user?.role === 'reviewer') {
          // Filter to only show this reviewer's reviews
          fetchedReviews = fetchedReviews.filter(review => review.reviewer_id === user.id);
        } else if (user?.role === 'business') {
          // Filter to only show reviews for this business's campaigns
          const businessCampaignIds = allCampaigns
            .filter(campaign => campaign.business_id === user.id)
            .map(campaign => campaign.id);
          
          fetchedReviews = fetchedReviews.filter(review => 
            businessCampaignIds.includes(review.campaign_id)
          );
          console.log('Business campaign IDs:', businessCampaignIds);
          console.log('Fetched reviews:', fetchedReviews);
        }
        
        setReviews(fetchedReviews);
        setFilteredReviews(fetchedReviews);
      } catch (err) {
        console.error('Failed to fetch reviews:', err);
      }
    };
    
    fetchData();
  }, [user]);
  
  useEffect(() => {
    // Apply filters whenever search query or filters change
    let results = reviews;
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      results = results.filter(review => 
        review.content.toLowerCase().includes(query)
      );
    }
    
    if (statusFilter !== 'all') {
      results = results.filter(review => review.status === statusFilter);
    }
    
    if (campaignFilter !== 'all') {
      results = results.filter(review => review.campaign_id === campaignFilter);
    }
    
    setFilteredReviews(results);
  }, [searchQuery, statusFilter, campaignFilter, reviews]);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
  };
  
  const handleCampaignChange = (value: string) => {
    setCampaignFilter(value);
  };
  
  const handleApproveReview = async (reviewId: string) => {
    try {
      const updatedReview = await updateReviewStatus(reviewId, 'approved');
      
      // Update the reviews list with the updated review
      setReviews(reviews.map(rev => 
        rev.id === reviewId ? updatedReview : rev
      ));
    } catch (error) {
      console.error('Failed to approve review:', error);
    }
  };
  
  const handleRejectReview = async (reviewId: string) => {
    try {
      const updatedReview = await updateReviewStatus(reviewId, 'rejected');
      
      // Update the reviews list with the updated review
      setReviews(reviews.map(rev => 
        rev.id === reviewId ? updatedReview : rev
      ));
    } catch (error) {
      console.error('Failed to reject review:', error);
    }
  };
  
  if (user?.role === 'admin') {
    return (
      <div className="min-h-screen bg-black">
        {/* Admin Header Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900 border-b border-gray-800">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-primary rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-primary rounded-full blur-3xl"></div>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">
                  Review <span className="text-primary">Management</span>
                </h1>
                <p className="text-xl text-gray-300">
                  Moderate and manage all platform reviews
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

          {error && (
            <div className="bg-red-500 bg-opacity-10 border border-red-500 border-opacity-20 rounded-xl p-4">
              <Alert variant="error">
                {error}
              </Alert>
            </div>
          )}

          {/* Filters */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="md:flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search reviews..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              <div className="md:w-48">
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <select
                    value={statusFilter}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none"
                  >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>

              <div className="md:w-64">
                <select
                  value={campaignFilter}
                  onChange={(e) => handleCampaignChange(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none"
                >
                  <option value="all">All Campaigns</option>
                  {campaigns.map(campaign => (
                    <option key={campaign.id} value={campaign.id}>{campaign.title}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <svg
                className="animate-spin h-8 w-8 text-primary"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </div>
          ) : filteredReviews.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredReviews.map((review) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  showActions={user?.role === 'admin' && review.status === 'pending'}
                  onApprove={() => handleApproveReview(review.id)}
                  onReject={() => handleRejectReview(review.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 rounded-lg bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700">
              <AlertCircle className="mx-auto h-12 w-12 mb-4 text-gray-600" />
              <h3 className="text-lg font-medium mb-2 text-white">No reviews found</h3>
              <p className="text-gray-400">
                {searchQuery || statusFilter !== 'all' || campaignFilter !== 'all'
                  ? 'Try adjusting your filters to see more results.'
                  : 'There are no reviews yet.'}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          {user?.role === 'business' ? 'Campaign Reviews' : 'Your Reviews'}
        </h1>
      </div>

      {error && (
        <Alert variant="error">
          {error}
        </Alert>
      )}

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="md:flex-1">
          <Input
            placeholder="Search reviews..."
            icon={<Search className="h-5 w-5" />}
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>

        <div className="md:w-48">
          <Select
            options={[
              { value: 'all', label: 'All Statuses' },
              { value: 'pending', label: 'Pending' },
              { value: 'approved', label: 'Approved' },
              { value: 'rejected', label: 'Rejected' },
            ]}
            value={statusFilter}
            onChange={handleStatusChange}
          />
        </div>

        <div className="md:w-64">
          <Select
            options={[
              { value: 'all', label: 'All Campaigns' },
              ...campaigns.map(campaign => ({
                value: campaign.id,
                label: campaign.title,
              })),
            ]}
            value={campaignFilter}
            onChange={handleCampaignChange}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <svg
            className="animate-spin h-8 w-8 text-blue-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
      ) : filteredReviews.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              showActions={user?.role === 'admin' && review.status === 'pending'}
              onApprove={() => handleApproveReview(review.id)}
              onReject={() => handleRejectReview(review.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No reviews found</h3>
          <p className="mt-1 text-gray-500">
            {searchQuery || statusFilter !== 'all' || campaignFilter !== 'all'
              ? 'Try adjusting your filters to see more results.'
              : user?.role === 'reviewer'
                ? 'You haven\'t written any reviews yet.'
                : 'There are no reviews yet.'}
          </p>
        </div>
      )}
    </div>
  );
};