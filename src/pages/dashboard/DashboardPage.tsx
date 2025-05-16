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
import { supabase } from '../../lib/supabase';

export const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const { getCampaigns, getBusinessCampaigns, getReviews } = useCampaignStore();
  const { getWalletBalance, getTotalEarnings } = useWalletStore();
  
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [walletBalance, setWalletBalance] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [businessProfile, setBusinessProfile] = useState<any>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      if (user.role === 'business') {
        // Fetch business profile and wallet balance
        const { data: business, error } = await supabase
          .from('businesses')
          .select('*')
          .eq('id', user.id)
          .single();
        setBusinessProfile(business);
        setWalletBalance(business?.wallet_balance || 0);
        const businessCampaigns = await getBusinessCampaigns(user.id);
        setCampaigns(businessCampaigns.slice(0, 3)); // Show just the first 3
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
          {/* Verification Status */}
          {!user.isVerified && businessProfile && businessProfile.verification_documents && businessProfile.verification_documents.length > 0 && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-md flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-yellow-800">Awaiting Verification</h2>
                <p className="text-yellow-700 mt-1">Your documents have been submitted and are pending admin approval.</p>
              </div>
            </div>
          )}
          {user.isVerified && (
            <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6 rounded-md flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-green-800">Account Verified</h2>
                <p className="text-green-700 mt-1">Your business account has been approved. You can now access all features.</p>
              </div>
            </div>
          )}
          {/* Prompt to submit documents if not verified and no documents */}
          {!user.isVerified && (!businessProfile || !businessProfile.verification_documents || businessProfile.verification_documents.length === 0) && (
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
  
  const BusinessBalances: React.FC = () => {
    const [businesses, setBusinesses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const fetchBusinesses = async () => {
        setLoading(true);
        const { data, error } = await supabase
          .from('businesses')
          .select('id, company_name, wallet_balance')
        if (!error && data) {
          // Join with users for name/email
          const { data: usersData } = await supabase
            .from('users')
            .select('id, name, email')
            .in('id', data.map((b: any) => b.id));
          const userMap = new Map(usersData?.map((u: any) => [u.id, u]) || []);
          setBusinesses(data.map((b: any) => ({
            id: b.id,
            name: userMap.get(b.id)?.name || '',
            email: userMap.get(b.id)?.email || '',
            balance: b.wallet_balance || 0
          })));
        }
        setLoading(false);
      };
      fetchBusinesses();
    }, []);

    if (loading) return <div>Loading business balances...</div>;

    return (
      <div style={{ marginTop: 32 }}>
        <h2 className="text-xl font-bold mb-2">Business Owners & Balances</h2>
        <table className="min-w-full divide-y divide-gray-200 bg-white rounded shadow">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {businesses.map(b => (
              <tr key={b.id}>
                <td className="px-4 py-2">{b.name}</td>
                <td className="px-4 py-2">{b.email}</td>
                <td className="px-4 py-2">{formatCurrency(b.balance)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  return (
    <div className="space-y-6">
      {renderUserDashboard()}
      {user && user.role === 'admin' && <BusinessBalances />}
    </div>
  );
};