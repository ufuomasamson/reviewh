import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../../components/ui/Button';
import {
  Star,
  Megaphone,
  BarChart,
  DollarSign,
  Users,
  TrendingUp,
  Clock,
  CheckCircle
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { 
  getCampaigns, 
  getBusinessCampaigns, 
  getReviews, 
  getWalletBalance, 
  getTotalEarnings 
} from '../../lib/api';

export const DashboardPage: React.FC = () => {
  console.log('🔥 DashboardPage component loaded');
  const { user } = useAuthStore();
  console.log('👤 User data:', user);

  // State
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [walletBalance, setWalletBalance] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [businessProfile, setBusinessProfile] = useState<any>(null);
  const [adminStats, setAdminStats] = useState({
    totalUsers: 0,
    activeCampaigns: 0,
    pendingReviews: 0,
    pendingVerifications: 0,
    platformRevenue: 0
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  // Format currency helper
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  };

  // Format time ago helper
  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const past = new Date(date);
    const diffInHours = Math.floor((now.getTime() - past.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  // Fetch admin data
  const fetchAdminData = async () => {
    try {
      // Get total users
      const { count: totalUsers } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });

      // Get active campaigns
      const { count: activeCampaigns } = await supabase
        .from('campaigns')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      // Get pending reviews
      const { count: pendingReviews } = await supabase
        .from('reviews')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      // Get pending verifications
      const { count: pendingVerifications } = await supabase
        .from('businesses')
        .select('*', { count: 'exact', head: true })
        .eq('is_verified', false);

      // Calculate platform revenue (example calculation)
      const { data: completedCampaigns } = await supabase
        .from('campaigns')
        .select('budget')
        .eq('status', 'completed');

      const platformRevenue = completedCampaigns?.reduce((sum, campaign) => sum + (campaign.budget * 0.1), 0) || 0;

      setAdminStats({
        totalUsers: totalUsers || 0,
        activeCampaigns: activeCampaigns || 0,
        pendingReviews: pendingReviews || 0,
        pendingVerifications: pendingVerifications || 0,
        platformRevenue
      });

      // Get recent activity
      const { data: recentCampaigns } = await supabase
        .from('campaigns')
        .select('title, created_at')
        .order('created_at', { ascending: false })
        .limit(2);

      const { data: recentReviews } = await supabase
        .from('reviews')
        .select('created_at')
        .eq('status', 'approved')
        .order('created_at', { ascending: false })
        .limit(2);

      const { data: recentVerifications } = await supabase
        .from('businesses')
        .select('company_name, updated_at')
        .eq('is_verified', true)
        .order('updated_at', { ascending: false })
        .limit(2);

      const activities = [
        ...(recentCampaigns?.map(c => ({
          type: 'campaign_submitted',
          message: `Campaign submitted: ${c.title}`,
          time: c.created_at
        })) || []),
        ...(recentReviews?.map(r => ({
          type: 'review_approved',
          message: 'Review approved',
          time: r.created_at
        })) || []),
        ...(recentVerifications?.map(b => ({
          type: 'business_verified',
          message: `Business verified: ${b.company_name}`,
          time: b.updated_at
        })) || [])
      ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 4);

      setRecentActivity(activities);

    } catch (error) {
      console.error('Error fetching admin data:', error);
    }
  };

  useEffect(() => {
    console.log('🔄 useEffect triggered, user:', user);
    const fetchData = async () => {
      if (!user) {
        console.log('❌ No user in useEffect, returning early');
        return;
      }
      console.log('📊 Calling fetchData for role:', user.role);
      
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
        // Fetch admin dashboard data
        await fetchAdminData();

        const allCampaigns = await getCampaigns();
        setCampaigns(allCampaigns.slice(0, 3));

        const allReviews = await getReviews();
        setReviews(allReviews.filter(r => r.status === 'pending').slice(0, 5));
      }
    };
    
    fetchData();
  }, [user]);

  const renderUserDashboard = () => {
    console.log('🎯 renderUserDashboard called');
    if (!user) {
      console.log('❌ No user found, returning null');
      return null;
    }
    console.log('✅ User found, role:', user.role);
    
    // Business Dashboard
    console.log('🏢 Checking if user is business');
    if (user.role === 'business') {
      console.log('✅ Business role confirmed, rendering business dashboard');
      return (
        <div className="min-h-screen bg-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900 border border-gray-800 rounded-2xl">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-96 h-96 bg-primary rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-80 h-80 bg-primary rounded-full blur-3xl"></div>
              </div>
              <div className="relative z-10 p-8">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <h1 className="text-4xl font-bold text-white mb-2">
                      Welcome back, <span className="text-primary">{user.name}</span>!
                    </h1>
                    <p className="text-xl text-gray-300">Manage your review campaigns and grow your business</p>
                  </div>
                  <div className="mt-6 lg:mt-0">
                    <Link to="/campaigns/create">
                      <Button
                        size="lg"
                        rightIcon={<Megaphone className="h-5 w-5" />}
                        className="bg-primary hover:bg-primary-600 text-black font-semibold"
                      >
                        Create New Campaign
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-500 bg-opacity-20 rounded-xl flex items-center justify-center mr-4">
                    <Megaphone className="h-6 w-6 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-400">Total Campaigns</p>
                    <p className="text-2xl font-bold text-white">{campaigns.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-500 bg-opacity-20 rounded-xl flex items-center justify-center mr-4">
                    <BarChart className="h-6 w-6 text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-400">Active Campaigns</p>
                    <p className="text-2xl font-bold text-white">{campaigns.filter(c => c.status === 'active').length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-yellow-500 bg-opacity-20 rounded-xl flex items-center justify-center mr-4">
                    <Star className="h-6 w-6 text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-400">Total Reviews</p>
                    <p className="text-2xl font-bold text-white">{campaigns.reduce((sum, c) => sum + (c.completed_reviews || 0), 0)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-primary bg-opacity-20 rounded-xl flex items-center justify-center mr-4">
                    <DollarSign className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-400">Wallet Balance</p>
                    <p className="text-2xl font-bold text-white">{formatCurrency(walletBalance)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Business Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Campaign Performance</h3>
                  <TrendingUp className="h-5 w-5 text-green-400" />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Success Rate</span>
                    <span className="text-sm font-medium text-green-400">92%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-gradient-to-r from-green-400 to-green-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Avg. Rating</span>
                    <span className="text-sm font-medium text-yellow-400">4.6/5</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Monthly Spending</h3>
                  <DollarSign className="h-5 w-5 text-primary" />
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-2xl font-bold text-white">{formatCurrency(campaigns.reduce((sum, c) => sum + ((c.price_per_review || 0) * (c.completed_reviews || 0)), 0))}</p>
                    <p className="text-sm text-gray-400">Total spent this month</p>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Budget remaining</span>
                    <span className="text-green-400 font-medium">{formatCurrency(walletBalance)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Business Profile</h3>
                  <CheckCircle className={`h-5 w-5 ${user.isVerified ? 'text-green-400' : 'text-yellow-400'}`} />
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-400">Verification Status</p>
                    <p className={`text-sm font-medium ${user.isVerified ? 'text-green-400' : 'text-yellow-400'}`}>
                      {user.isVerified ? 'Verified Business' : 'Pending Verification'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Member Since</p>
                    <p className="text-sm font-medium text-white">
                      {new Date(user.createdAt || Date.now()).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long'
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Account Type</p>
                    <p className="text-sm font-medium text-primary">Business Account</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Recent Campaigns - Takes 2 columns */}
              <div className="lg:col-span-2">
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 overflow-hidden">
                  <div className="p-6 border-b border-gray-700">
                    <div className="flex justify-between items-center">
                      <h2 className="text-2xl font-bold text-white">Your Campaigns</h2>
                      <Link to="/campaigns" className="text-primary hover:text-primary-400 text-sm font-medium bg-primary bg-opacity-10 px-4 py-2 rounded-lg border border-primary border-opacity-20">
                        View All →
                      </Link>
                    </div>
                  </div>

                  <div className="p-6">
                    {campaigns.length > 0 ? (
                      <div className="space-y-4">
                        {campaigns.slice(0, 4).map((campaign) => (
                          <div key={campaign.id} className="bg-gray-900 border border-gray-700 rounded-xl p-4 hover:border-gray-600 transition-colors">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-semibold text-white">{campaign.title}</h3>
                                <p className="text-sm text-gray-400 mt-1">{campaign.product}</p>
                                <div className="flex items-center mt-2 space-x-4">
                                  <span className="text-sm text-gray-400">
                                    {campaign.completed_reviews || 0}/{campaign.target_reviews || 0} reviews
                                  </span>
                                  <span className="text-sm font-medium text-primary">
                                    {formatCurrency(campaign.price_per_review || 0)} per review
                                  </span>
                                </div>
                              </div>
                              <div className="text-right">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  campaign.status === 'active' ? 'bg-green-500 bg-opacity-20 text-green-400 border border-green-500 border-opacity-30' :
                                  campaign.status === 'pending' ? 'bg-yellow-500 bg-opacity-20 text-yellow-400 border border-yellow-500 border-opacity-30' :
                                  campaign.status === 'completed' ? 'bg-blue-500 bg-opacity-20 text-blue-400 border border-blue-500 border-opacity-30' :
                                  'bg-gray-500 bg-opacity-20 text-gray-400 border border-gray-500 border-opacity-30'
                                }`}>
                                  {campaign.status}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Megaphone className="mx-auto h-16 w-16 text-gray-600 mb-4" />
                        <h3 className="text-xl font-medium text-white mb-2">No campaigns yet</h3>
                        <p className="text-gray-400 mb-6">Get started by creating your first campaign.</p>
                        <Link to="/campaigns/create">
                          <Button className="bg-primary hover:bg-primary-600 text-black">
                            Create Your First Campaign
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Actions & Analytics */}
              <div className="bg-black border border-gray-800 rounded-2xl p-6 space-y-6" style={{ backgroundColor: '#0a0a0a' }}>
                {/* Quick Actions */}
                <div className="bg-gray-900 rounded-xl border border-gray-700 p-4" style={{ backgroundColor: '#1a1a1a' }}>
                  <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <Link to="/campaigns/create" className="block">
                      <div className="bg-gray-900 hover:bg-gray-800 border border-gray-700 hover:border-primary rounded-xl p-4 transition-all duration-300 group">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-500 bg-opacity-20 rounded-lg flex items-center justify-center mr-3 group-hover:bg-primary group-hover:bg-opacity-20">
                            <Megaphone className="h-5 w-5 text-blue-400 group-hover:text-primary" />
                          </div>
                          <span className="font-medium text-white">Create Campaign</span>
                        </div>
                      </div>
                    </Link>
                    <Link to="/wallet" className="block">
                      <div className="bg-gray-900 hover:bg-gray-800 border border-gray-700 hover:border-primary rounded-xl p-4 transition-all duration-300 group">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-green-500 bg-opacity-20 rounded-lg flex items-center justify-center mr-3 group-hover:bg-primary group-hover:bg-opacity-20">
                            <DollarSign className="h-5 w-5 text-green-400 group-hover:text-primary" />
                          </div>
                          <span className="font-medium text-white">Add Funds</span>
                        </div>
                      </div>
                    </Link>
                    <Link to="/reviews" className="block">
                      <div className="bg-gray-900 hover:bg-gray-800 border border-gray-700 hover:border-primary rounded-xl p-4 transition-all duration-300 group">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-yellow-500 bg-opacity-20 rounded-lg flex items-center justify-center mr-3 group-hover:bg-primary group-hover:bg-opacity-20">
                            <Star className="h-5 w-5 text-yellow-400 group-hover:text-primary" />
                          </div>
                          <span className="font-medium text-white">View Reviews</span>
                        </div>
                      </div>
                    </Link>
                    <Link to="/dashboard/verify" className="block">
                      <div className="bg-gray-900 hover:bg-gray-800 border border-gray-700 hover:border-primary rounded-xl p-4 transition-all duration-300 group">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-purple-500 bg-opacity-20 rounded-lg flex items-center justify-center mr-3 group-hover:bg-primary group-hover:bg-opacity-20">
                            <CheckCircle className="h-5 w-5 text-purple-400 group-hover:text-primary" />
                          </div>
                          <span className="font-medium text-white">Verify Business</span>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>

                {/* Performance Overview */}
                <div className="bg-gray-900 rounded-xl border border-gray-700 p-4" style={{ backgroundColor: '#1a1a1a' }}>
                  <h3 className="text-xl font-bold text-white mb-4">Performance</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm text-gray-400 mb-2">
                        <span>Campaign Success Rate</span>
                        <span className="text-white font-medium">85%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div className="bg-gradient-to-r from-green-400 to-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm text-gray-400 mb-2">
                        <span>Review Quality Score</span>
                        <span className="text-white font-medium">4.8/5</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div className="bg-gradient-to-r from-blue-400 to-blue-500 h-2 rounded-full" style={{ width: '96%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm text-gray-400 mb-2">
                        <span>Response Time</span>
                        <span className="text-white font-medium">2.3 days</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div className="bg-gradient-to-r from-primary to-yellow-500 h-2 rounded-full" style={{ width: '70%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Business Insights */}
                <div className="bg-gray-900 rounded-xl border border-gray-700 p-4" style={{ backgroundColor: '#1a1a1a' }}>
                  <h3 className="text-xl font-bold text-white mb-4">Business Insights</h3>
                  <div className="space-y-4">
                    <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <TrendingUp className="h-4 w-4 text-green-400 mr-2" />
                        <span className="text-sm font-medium text-green-400">Growth Trend</span>
                      </div>
                      <p className="text-xs text-gray-400">Your campaigns are performing 23% better than last month</p>
                    </div>
                    <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <Star className="h-4 w-4 text-yellow-400 mr-2" />
                        <span className="text-sm font-medium text-yellow-400">Top Performer</span>
                      </div>
                      <p className="text-xs text-gray-400">Your highest-rated campaign has 4.9/5 stars</p>
                    </div>
                    <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <Clock className="h-4 w-4 text-blue-400 mr-2" />
                        <span className="text-sm font-medium text-blue-400">Optimization Tip</span>
                      </div>
                      <p className="text-xs text-gray-400">Consider increasing budget for high-performing campaigns</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Reviewer Dashboard
    console.log('⭐ Checking if user is reviewer');
    if (user.role === 'reviewer') {
      console.log('✅ Reviewer role confirmed, rendering reviewer dashboard');
      return (
        <div className="min-h-screen bg-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900 border border-gray-800 rounded-2xl">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-96 h-96 bg-primary rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-80 h-80 bg-primary rounded-full blur-3xl"></div>
              </div>
              <div className="relative z-10 p-8">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <h1 className="text-4xl font-bold text-white mb-2">
                      Hello, <span className="text-primary">{user.name}</span>!
                    </h1>
                    <p className="text-xl text-gray-300">Discover new campaigns and earn money by writing honest reviews</p>
                  </div>
                  <div className="mt-6 lg:mt-0">
                    <Link to="/campaigns">
                      <Button
                        size="lg"
                        rightIcon={<Star className="h-5 w-5" />}
                        className="bg-primary hover:bg-primary-600 text-black font-semibold"
                      >
                        Browse Campaigns
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-500 bg-opacity-20 rounded-xl flex items-center justify-center mr-4">
                    <Star className="h-6 w-6 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-400">Reviews Written</p>
                    <p className="text-2xl font-bold text-white">{reviews.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-500 bg-opacity-20 rounded-xl flex items-center justify-center mr-4">
                    <BarChart className="h-6 w-6 text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-400">Approved Reviews</p>
                    <p className="text-2xl font-bold text-white">{reviews.filter(r => r.status === 'approved').length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-yellow-500 bg-opacity-20 rounded-xl flex items-center justify-center mr-4">
                    <DollarSign className="h-6 w-6 text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-400">Total Earnings</p>
                    <p className="text-2xl font-bold text-white">{formatCurrency(totalEarnings)}</p>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-primary bg-opacity-20 rounded-xl flex items-center justify-center mr-4">
                    <DollarSign className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-400">Available Balance</p>
                    <p className="text-2xl font-bold text-white">{formatCurrency(walletBalance)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Reviewer Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Review Performance</h3>
                  <TrendingUp className="h-5 w-5 text-green-400" />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Approval Rate</span>
                    <span className="text-sm font-medium text-green-400">
                      {reviews.length > 0 ? Math.round((reviews.filter(r => r.status === 'approved').length / reviews.length) * 100) : 0}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-green-400 to-green-500 h-2 rounded-full"
                      style={{
                        width: `${reviews.length > 0 ? (reviews.filter(r => r.status === 'approved').length / reviews.length) * 100 : 0}%`
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Avg. Rating Given</span>
                    <span className="text-sm font-medium text-yellow-400">4.2/5</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-2 rounded-full" style={{ width: '84%' }}></div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Earnings Overview</h3>
                  <DollarSign className="h-5 w-5 text-primary" />
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-2xl font-bold text-white">{formatCurrency(totalEarnings)}</p>
                    <p className="text-sm text-gray-400">Total lifetime earnings</p>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">This month</span>
                    <span className="text-green-400 font-medium">{formatCurrency(totalEarnings * 0.3)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Pending</span>
                    <span className="text-yellow-400 font-medium">
                      {formatCurrency(reviews.filter(r => r.status === 'pending').length * 1.5)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Reviewer Profile</h3>
                  <CheckCircle className="h-5 w-5 text-green-400" />
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-400">Reviewer Level</p>
                    <p className="text-sm font-medium text-primary">
                      {reviews.length >= 50 ? 'Expert Reviewer' :
                       reviews.length >= 20 ? 'Advanced Reviewer' :
                       reviews.length >= 5 ? 'Intermediate Reviewer' : 'Beginner Reviewer'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Member Since</p>
                    <p className="text-sm font-medium text-white">
                      {new Date(user.createdAt || Date.now()).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long'
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Specialization</p>
                    <p className="text-sm font-medium text-blue-400">Technology & Apps</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Available Campaigns - Takes 2 columns */}
              <div className="lg:col-span-2">
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 overflow-hidden">
                  <div className="p-6 border-b border-gray-700">
                    <div className="flex justify-between items-center">
                      <h2 className="text-2xl font-bold text-white">Available Campaigns</h2>
                      <Link to="/campaigns" className="text-primary hover:text-primary-400 text-sm font-medium bg-primary bg-opacity-10 px-4 py-2 rounded-lg border border-primary border-opacity-20">
                        View All →
                      </Link>
                    </div>
                  </div>

                  <div className="p-6">
                    {campaigns.length > 0 ? (
                      <div className="space-y-4">
                        {campaigns.slice(0, 4).map((campaign) => (
                          <div key={campaign.id} className="bg-gray-900 border border-gray-700 rounded-xl p-4 hover:border-gray-600 transition-colors">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-semibold text-white">{campaign.title}</h3>
                                <p className="text-sm text-gray-400 mt-1">{campaign.product}</p>
                                <div className="flex items-center mt-2 space-x-4">
                                  <span className="text-sm text-gray-400">
                                    {(campaign.target_reviews || 0) - (campaign.completed_reviews || 0)} reviews needed
                                  </span>
                                  <span className="text-lg font-bold text-primary">
                                    {formatCurrency(campaign.price_per_review || 0)}
                                  </span>
                                </div>
                              </div>
                              <div className="text-right">
                                <Link to={`/campaigns/${campaign.id}`}>
                                  <Button size="sm" className="bg-primary hover:bg-primary-600 text-black">
                                    Write Review
                                  </Button>
                                </Link>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Megaphone className="mx-auto h-16 w-16 text-gray-600 mb-4" />
                        <h3 className="text-xl font-medium text-white mb-2">No campaigns available</h3>
                        <p className="text-gray-400 mb-6">Check back soon for new review opportunities.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="bg-black border border-gray-800 rounded-2xl p-6 space-y-6" style={{ backgroundColor: '#0a0a0a' }}>
                {/* Quick Actions */}
                <div className="bg-gray-900 rounded-xl border border-gray-700 p-4" style={{ backgroundColor: '#1a1a1a' }}>
                  <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <Link to="/campaigns" className="block">
                      <div className="bg-gray-900 hover:bg-gray-800 border border-gray-700 hover:border-primary rounded-xl p-4 transition-all duration-300 group">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-500 bg-opacity-20 rounded-lg flex items-center justify-center mr-3 group-hover:bg-primary group-hover:bg-opacity-20">
                            <Star className="h-5 w-5 text-blue-400 group-hover:text-primary" />
                          </div>
                          <span className="font-medium text-white">Browse Campaigns</span>
                        </div>
                      </div>
                    </Link>
                    <Link to="/reviews" className="block">
                      <div className="bg-gray-900 hover:bg-gray-800 border border-gray-700 hover:border-primary rounded-xl p-4 transition-all duration-300 group">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-green-500 bg-opacity-20 rounded-lg flex items-center justify-center mr-3 group-hover:bg-primary group-hover:bg-opacity-20">
                            <BarChart className="h-5 w-5 text-green-400 group-hover:text-primary" />
                          </div>
                          <span className="font-medium text-white">My Reviews</span>
                        </div>
                      </div>
                    </Link>
                    <Link to="/wallet" className="block">
                      <div className="bg-gray-900 hover:bg-gray-800 border border-gray-700 hover:border-primary rounded-xl p-4 transition-all duration-300 group">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-yellow-500 bg-opacity-20 rounded-lg flex items-center justify-center mr-3 group-hover:bg-primary group-hover:bg-opacity-20">
                            <DollarSign className="h-5 w-5 text-yellow-400 group-hover:text-primary" />
                          </div>
                          <span className="font-medium text-white">Withdraw Earnings</span>
                        </div>
                      </div>
                    </Link>
                    <Link to="/dashboard/settings" className="block">
                      <div className="bg-gray-900 hover:bg-gray-800 border border-gray-700 hover:border-primary rounded-xl p-4 transition-all duration-300 group">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-purple-500 bg-opacity-20 rounded-lg flex items-center justify-center mr-3 group-hover:bg-primary group-hover:bg-opacity-20">
                            <Users className="h-5 w-5 text-purple-400 group-hover:text-primary" />
                          </div>
                          <span className="font-medium text-white">Profile Settings</span>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>

                {/* Recent Reviews */}
                <div className="bg-gray-900 rounded-xl border border-gray-700 p-4" style={{ backgroundColor: '#1a1a1a' }}>
                  <h3 className="text-xl font-bold text-white mb-4">Recent Reviews</h3>
                  {reviews.length > 0 ? (
                    <div className="space-y-3">
                      {reviews.slice(0, 3).map((review) => (
                        <div key={review.id} className="bg-gray-900 border border-gray-700 rounded-xl p-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-sm font-medium text-white">{review.campaign?.title || 'Campaign'}</p>
                              <p className="text-xs text-gray-400 mt-1">
                                {review.rating || 4}/5 stars • {formatCurrency(review.earnings || 1.5)}
                              </p>
                            </div>
                            <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                              review.status === 'approved' ? 'bg-green-500 bg-opacity-20 text-green-400 border border-green-500 border-opacity-30' :
                              review.status === 'pending' ? 'bg-yellow-500 bg-opacity-20 text-yellow-400 border border-yellow-500 border-opacity-30' :
                              'bg-red-500 bg-opacity-20 text-red-400 border border-red-500 border-opacity-30'
                            }`}>
                              {review.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 text-center">
                      <p className="text-sm font-medium text-gray-400">No reviews yet</p>
                      <p className="text-xs text-gray-500 mt-1">Start writing reviews to earn money</p>
                    </div>
                  )}
                </div>

                {/* Reviewer Insights */}
                <div className="bg-gray-900 rounded-xl border border-gray-700 p-4" style={{ backgroundColor: '#1a1a1a' }}>
                  <h3 className="text-xl font-bold text-white mb-4">Reviewer Insights</h3>
                  <div className="space-y-4">
                    <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <TrendingUp className="h-4 w-4 text-green-400 mr-2" />
                        <span className="text-sm font-medium text-green-400">Earning Streak</span>
                      </div>
                      <p className="text-xs text-gray-400">You've earned money for 5 consecutive days!</p>
                    </div>
                    <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <Star className="h-4 w-4 text-yellow-400 mr-2" />
                        <span className="text-sm font-medium text-yellow-400">Quality Bonus</span>
                      </div>
                      <p className="text-xs text-gray-400">High-quality reviews earn 20% bonus payments</p>
                    </div>
                    <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <Clock className="h-4 w-4 text-blue-400 mr-2" />
                        <span className="text-sm font-medium text-blue-400">Next Level</span>
                      </div>
                      <p className="text-xs text-gray-400">
                        {reviews.length >= 20 ? 'You\'re an Advanced Reviewer!' :
                         `Write ${20 - reviews.length} more reviews to reach Advanced level`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Admin Dashboard
    console.log('👑 Checking if user is admin');
    if (user.role === 'admin') {
      console.log('✅ Admin role confirmed, rendering admin dashboard');
      return (
        <div className="min-h-screen bg-black">
          <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900 border-b border-gray-800">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-96 h-96 bg-primary rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 right-0 w-80 h-80 bg-primary rounded-full blur-3xl"></div>
            </div>
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2">
                    Admin <span className="text-primary">Dashboard</span>
                  </h1>
                  <p className="text-xl text-gray-300">
                    Monitor platform performance and manage operations
                  </p>
                </div>
                <div className="mt-6 lg:mt-0 flex flex-col sm:flex-row gap-3">
                  <Link to="/admin/users">
                    <Button
                      size="lg"
                      className="bg-primary hover:bg-primary-600 text-black font-semibold"
                    >
                      Manage Users
                    </Button>
                  </Link>
                  <Link to="/campaigns">
                    <Button
                      variant="outline"
                      size="lg"
                      className="border-gray-600 text-gray-300 hover:border-primary hover:text-primary"
                    >
                      Manage Campaigns
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 hover:border-primary transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm font-medium">Total Users</p>
                    <p className="text-3xl font-bold text-white mt-2">{adminStats.totalUsers}</p>
                    <p className="text-green-400 text-sm mt-1">+12% from last month</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-500 bg-opacity-20 rounded-xl flex items-center justify-center">
                    <Users className="h-6 w-6 text-blue-400" />
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 hover:border-primary transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm font-medium">Active Campaigns</p>
                    <p className="text-3xl font-bold text-white mt-2">{adminStats.activeCampaigns}</p>
                    <p className="text-green-400 text-sm mt-1">+8% from last month</p>
                  </div>
                  <div className="w-12 h-12 bg-primary bg-opacity-20 rounded-xl flex items-center justify-center">
                    <Megaphone className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 hover:border-primary transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm font-medium">Pending Reviews</p>
                    <p className="text-3xl font-bold text-white mt-2">{adminStats.pendingReviews}</p>
                    <p className="text-yellow-400 text-sm mt-1">Needs attention</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-500 bg-opacity-20 rounded-xl flex items-center justify-center">
                    <Star className="h-6 w-6 text-yellow-400" />
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 hover:border-primary transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm font-medium">Pending Verifications</p>
                    <p className="text-3xl font-bold text-white mt-2">{adminStats.pendingVerifications}</p>
                    <p className="text-orange-400 text-sm mt-1">Action required</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-500 bg-opacity-20 rounded-xl flex items-center justify-center">
                    <BarChart className="h-6 w-6 text-orange-400" />
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 hover:border-primary transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm font-medium">Platform Revenue</p>
                    <p className="text-3xl font-bold text-white mt-2">{formatCurrency(adminStats.platformRevenue)}</p>
                    <p className="text-green-400 text-sm mt-1">+24% from last month</p>
                  </div>
                  <div className="w-12 h-12 bg-green-500 bg-opacity-20 rounded-xl flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-green-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    console.log('🚨 No role matched, returning null');
    console.log('🔍 User role was:', user?.role);
    return null;
  };

  console.log('🎯 Main DashboardPage return, calling renderUserDashboard()');
  
  return (
    <div className="space-y-6">
      {renderUserDashboard()}
    </div>
  );
};
