import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Megaphone, DollarSign, BarChart } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useCampaignStore } from '../../store/campaignStore';
import { useWalletStore } from '../../store/walletStore';
import { Button } from '../../components/ui/Button';
import { StatCard } from '../../components/dashboard/StatCard';
import { CampaignCard } from '../../components/campaign/CampaignCard';
import { ReviewCard } from '../../components/review/ReviewCard';
import { formatCurrency } from '../../lib/utils';
import { Campaign, Review } from '../../lib/types';

export const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const { getCampaigns, getBusinessCampaigns, getReviews } = useCampaignStore();
  const { getWalletBalance, getTotalEarnings } = useWalletStore();
  
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [walletBalance, setWalletBalance] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);
  
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      if (user.role === 'business') {
        const businessCampaigns = await getBusinessCampaigns(user.id);
        setCampaigns(businessCampaigns.slice(0, 3)); // Show just the first 3
        
        const balance = await getWalletBalance(user.id);
        setWalletBalance(balance);
      } else if (user.role === 'reviewer') {
        const allCampaigns = await getCampaigns();
        setCampaigns(allCampaigns.filter(c => c.status === 'active').slice(0, 3));
        
        const reviewerReviews = await getReviews();
        setReviews(reviewerReviews.filter(r => r.reviewer_id === user.id).slice(0, 3));
        
        const balance = await getWalletBalance(user.id);
        setWalletBalance(balance);
        
        const earnings = await getTotalEarnings(user.id);
        setTotalEarnings(earnings);
      } else if (user.role === 'admin') {
        const allCampaigns = await getCampaigns();
        setCampaigns(allCampaigns.slice(0, 3));
        
        const allReviews = await getReviews();
        setReviews(allReviews.filter(r => r.status === 'pending').slice(0, 3));
      }
    };
    
    fetchData();
  }, [user]);
  
  const renderUserDashboard = () => {
    if (!user) return null;
    
    // Business Dashboard
    if (user.role === 'business') {
      return (
        <div className="space-y-8">
          {/* Verification Prompt */}
          {!user.isVerified && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-md flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-yellow-800">Verify Your Business Account</h2>
                <p className="text-yellow-700 mt-1">To unlock all features and start running campaigns, please verify your business by submitting the required documents.</p>
              </div>
              <Link to="/dashboard/verify">
                <Button variant="outline">Submit Documents</Button>
              </Link>
            </div>
          )}
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Business Dashboard</h1>
            <Link to="/campaigns/create">
              <Button rightIcon={<Megaphone className="h-5 w-5" />}>
                Create Campaign
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard 
              title="Total Campaigns" 
              value={campaigns.length} 
              icon={<Megaphone className="h-6 w-6" />} 
            />
            <StatCard 
              title="Total Reviews" 
              value={campaigns.reduce((acc, camp) => acc + camp.completed_reviews, 0)} 
              icon={<Star className="h-6 w-6" />} 
            />
            <StatCard 
              title="Wallet Balance" 
              value={formatCurrency(walletBalance)} 
              icon={<DollarSign className="h-6 w-6" />} 
              description="Available for campaigns" 
            />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Your Campaigns</h2>
              <Link to="/campaigns" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                View all campaigns
              </Link>
            </div>
            
            {campaigns.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {campaigns.map((campaign) => (
                  <CampaignCard key={campaign.id} campaign={campaign} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <Megaphone className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No campaigns yet</h3>
                <p className="mt-1 text-gray-500">Get started by creating your first campaign.</p>
                <div className="mt-6">
                  <Link to="/campaigns/create">
                    <Button>Create a Campaign</Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }
    
    // Reviewer Dashboard
    if (user.role === 'reviewer') {
      return (
        <div className="space-y-8">
          <h1 className="text-2xl font-bold text-gray-900">Reviewer Dashboard</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard 
              title="Reviews Written" 
              value={reviews.length} 
              icon={<Star className="h-6 w-6" />} 
            />
            <StatCard 
              title="Total Earnings" 
              value={formatCurrency(totalEarnings)} 
              icon={<DollarSign className="h-6 w-6" />} 
            />
            <StatCard 
              title="Available Balance" 
              value={formatCurrency(walletBalance)} 
              icon={<BarChart className="h-6 w-6" />} 
              description="Available for withdrawal" 
            />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Available Campaigns</h2>
              <Link to="/campaigns" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                View all campaigns
              </Link>
            </div>
            
            {campaigns.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {campaigns.map((campaign) => (
                  <CampaignCard key={campaign.id} campaign={campaign} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <Megaphone className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No campaigns available</h3>
                <p className="mt-1 text-gray-500">Check back soon for new review opportunities.</p>
              </div>
            )}
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Your Recent Reviews</h2>
              <Link to="/reviews" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                View all reviews
              </Link>
            </div>
            
            {reviews.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reviews.map((review) => (
                  <ReviewCard 
                    key={review.id} 
                    review={review} 
                    reviewerName={user.name}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <Star className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No reviews yet</h3>
                <p className="mt-1 text-gray-500">Start writing reviews to earn money.</p>
                <div className="mt-6">
                  <Link to="/campaigns">
                    <Button>Browse Campaigns</Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }
    
    // Admin Dashboard
    if (user.role === 'admin') {
      return (
        <div className="space-y-8">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard 
              title="Active Campaigns" 
              value={campaigns.filter(c => c.status === 'active').length} 
              icon={<Megaphone className="h-6 w-6" />} 
            />
            <StatCard 
              title="Pending Reviews" 
              value={reviews.length} 
              icon={<Star className="h-6 w-6" />} 
            />
            <StatCard 
              title="Pending Verifications" 
              value="3" 
              icon={<DollarSign className="h-6 w-6" />} 
            />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Pending Reviews</h2>
              <Link to="/reviews" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                View all reviews
              </Link>
            </div>
            
            {reviews.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reviews.map((review) => (
                  <ReviewCard 
                    key={review.id} 
                    review={review}
                    showActions={true}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <Star className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No pending reviews</h3>
                <p className="mt-1 text-gray-500">All reviews have been moderated.</p>
              </div>
            )}
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Recent Campaigns</h2>
              <Link to="/campaigns" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                View all campaigns
              </Link>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {campaigns.map((campaign) => (
                <CampaignCard key={campaign.id} campaign={campaign} />
              ))}
            </div>
          </div>
        </div>
      );
    }
    
    return null;
  };
  
  return (
    <div className="space-y-6">
      {renderUserDashboard()}
    </div>
  );
};