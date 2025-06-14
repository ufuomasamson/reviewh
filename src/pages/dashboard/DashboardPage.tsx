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
