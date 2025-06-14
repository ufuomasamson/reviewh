import React, { useEffect, useState } from 'react';
import { Users, Search, Filter, Check, X, Briefcase, Star, Eye } from 'lucide-react';
import { Business, Reviewer, User } from '../../lib/types';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { formatDate } from '../../lib/utils';
import { Avatar } from '../../components/ui/Avatar';
import { supabase } from '../../lib/supabase';
import { Modal } from '../../components/ui/Modal';

export const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<(User | Business | Reviewer)[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<(User | Business | Reviewer)[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [verificationFilter, setVerificationFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<any>(null);
  const [profileDetails, setProfileDetails] = useState<any>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        // Fetch all users
        const { data: usersData, error: usersError } = await supabase
          .from('users')
          .select('*')
          .order('created_at', { ascending: false });

        if (usersError) throw usersError;

        // Fetch business profiles
        const { data: businessesData, error: businessesError } = await supabase
          .from('businesses')
          .select('*');

        if (businessesError) throw businessesError;

        // Fetch reviewer profiles
        const { data: reviewersData, error: reviewersError } = await supabase
          .from('reviewers')
          .select('*');

        if (reviewersError) throw reviewersError;

        // Create a map of business and reviewer profiles
        const businessMap = new Map(businessesData?.map(b => [b.id, b]));
        const reviewerMap = new Map(reviewersData?.map(r => [r.id, r]));
        
        // Combine user data with their respective profiles
        const combinedUsers = usersData?.map(user => {
          if (user.role === 'business') {
            const businessProfile = businessMap.get(user.id);
            return {
              ...user,
              companyName: businessProfile?.company_name,
              description: businessProfile?.description,
              website: businessProfile?.website,
              walletBalance: user.balance,
            };
          } else if (user.role === 'reviewer') {
            const reviewerProfile = reviewerMap.get(user.id);
            return {
              ...user,
              bio: reviewerProfile?.bio,
              reviewCount: reviewerProfile?.review_count,
              walletBalance: reviewerProfile?.wallet_balance,
              earnings: reviewerProfile?.total_earnings,
            };
          }
          return user;
        }) || [];
        
        setUsers(combinedUsers);
        setFilteredUsers(combinedUsers);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUsers();
  }, []);
  
  useEffect(() => {
    // Apply filters when search query or filters change
    let results = users;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      results = results.filter(user =>
        (user.name && user.name.toLowerCase().includes(query)) ||
        (user as any)?.companyName?.toLowerCase?.().includes(query) ||
        (user.email && user.email.toLowerCase().includes(query))
      );
    }
    if (roleFilter !== 'all') {
      results = results.filter(user => user.role === roleFilter);
    }
    if (verificationFilter !== 'all') {
      const isVerified = verificationFilter === 'verified';
      results = results.filter(user => user.isVerified === isVerified);
    }
    setFilteredUsers(results);
  }, [searchQuery, roleFilter, verificationFilter, users]);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const handleRoleChange = (value: string) => {
    setRoleFilter(value);
  };
  
  const handleVerificationChange = (value: string) => {
    setVerificationFilter(value);
  };
  
  const handleVerifyUser = async (userId: string) => {
    const { error } = await supabase
      .from('users')
      .update({ is_verified: true })
      .eq('id', userId);
    if (!error) {
      setUsers(users.map(user => 
        user.id === userId ? { ...user, isVerified: true } : user
      ));
    } else {
      alert('Failed to verify user');
    }
  };
  
  // Add these after users is set
  const businessUsers = filteredUsers.filter(user => user.role === 'business');
  const reviewerUsers = filteredUsers.filter(user => user.role === 'reviewer');
  
  // Helper to fetch business or reviewer profile details
  const handleViewProfile = async (user: any) => {
    setSelectedProfile(user);
    setProfileModalOpen(true);
    setProfileLoading(true);
    if (user.role === 'business') {
      // Fetch campaigns and reviews for this business
      const { data: campaigns } = await supabase
        .from('campaigns')
        .select('id, title, status, completed_reviews, target_reviews, price_per_review')
        .eq('business_id', user.id);
      // Fetch wallet_balance from businesses table
      const { data: businessProfile } = await supabase
        .from('businesses')
        .select('wallet_balance')
        .eq('id', user.id)
        .single();
      // Calculate stats
      const numCampaigns = campaigns?.length || 0;
      const numApproved = campaigns?.filter(c => c.status === 'active' || c.status === 'completed').length || 0;
      const reviewsPerCampaign = campaigns?.map(c => ({ title: c.title, count: c.completed_reviews })) || [];
      const totalAvailable = campaigns?.reduce((sum, c) => sum + ((c.target_reviews - c.completed_reviews) * (c.price_per_review || 0)), 0) || 0;
      setProfileDetails({
        businessName: user.companyName,
        numCampaigns,
        numApproved,
        reviewsPerCampaign,
        totalAvailable,
        walletBalance: businessProfile?.wallet_balance ?? 0,
        createdAt: user.created_at,
        website: user.website,
      });
    } else if (user.role === 'reviewer') {
      // Fetch reviews for this reviewer
      const { data: reviews } = await supabase
        .from('reviews')
        .select('id, status, earnings, created_at')
        .eq('reviewer_id', user.id);
      const totalSubmitted = reviews?.length || 0;
      const totalApproved = reviews?.filter(r => r.status === 'approved').length || 0;
      const totalEarned = reviews?.filter(r => r.status === 'approved').reduce((sum, r) => sum + (r.earnings || 0), 0) || 0;
      setProfileDetails({
        name: user.name,
        totalSubmitted,
        totalApproved,
        totalEarned,
        availableForWithdrawal: user.walletBalance,
        createdAt: user.created_at,
      });
    }
    setProfileLoading(false);
  };
  
  return (
    <div className="min-h-screen bg-black">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900 border-b border-gray-800">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-primary rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                User <span className="text-primary">Management</span>
              </h1>
              <p className="text-xl text-gray-300">
                Manage businesses and reviewers on the platform
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Search and Filter Section */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="md:flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
            <div className="md:w-48">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  value={roleFilter}
                  onChange={(e) => handleRoleChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none"
                >
                  <option value="all">All Roles</option>
                  <option value="business">Businesses</option>
                  <option value="reviewer">Reviewers</option>
                </select>
              </div>
            </div>
            <div className="md:w-48">
              <select
                value={verificationFilter}
                onChange={(e) => handleVerificationChange(e.target.value)}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none"
              >
                <option value="all">All Status</option>
                <option value="verified">Verified</option>
                <option value="unverified">Unverified</option>
              </select>
            </div>
          </div>
        </div>
        {/* User Statistics and Lists */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 p-6">
            <h2 className="text-xl font-bold text-white mb-2 flex items-center">
              <Briefcase className="h-5 w-5 mr-2 text-blue-400" /> Businesses
            </h2>
            <p className="text-3xl font-bold text-blue-400 mb-4">{businessUsers.length}</p>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {businessUsers.map(user => (
                <div key={user.id} className="flex items-center py-3 px-4 bg-gray-900 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors">
                  <Avatar name={user.name} size="sm" />
                  <div className="ml-3 flex-1">
                    <div className="font-medium text-white">{user.name}</div>
                    <div className="text-gray-400 text-sm">{user.email}</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {user.is_verified && (
                      <Check className="h-4 w-4 text-green-400" />
                    )}
                    <button onClick={() => handleViewProfile(user)} className="text-primary hover:text-primary-400 transition-colors">
                      <Eye className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 p-6">
            <h2 className="text-xl font-bold text-white mb-2 flex items-center">
              <Star className="h-5 w-5 mr-2 text-green-400" /> Reviewers
            </h2>
            <p className="text-3xl font-bold text-green-400 mb-4">{reviewerUsers.length}</p>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {reviewerUsers.map(user => (
                <div key={user.id} className="flex items-center py-3 px-4 bg-gray-900 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors">
                  <Avatar name={user.name} size="sm" />
                  <div className="ml-3 flex-1">
                    <div className="font-medium text-white">{user.name}</div>
                    <div className="text-gray-400 text-sm">{user.email}</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {user.is_verified && (
                      <Check className="h-4 w-4 text-green-400" />
                    )}
                    <button onClick={() => handleViewProfile(user)} className="text-primary hover:text-primary-400 transition-colors">
                      <Eye className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {isLoading && (
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
        )}
      </div>

      {/* Profile Modal */}
      {profileModalOpen && (
        <Modal open={profileModalOpen} onClose={() => setProfileModalOpen(false)}>
          <div className="p-6 min-w-[320px] max-w-[400px] sm:min-w-[380px] sm:max-w-[440px]">
            {profileLoading ? (
              <div className="flex flex-col items-center justify-center py-8">
                <svg className="animate-spin h-8 w-8 text-blue-500 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span className="text-gray-500">Loading profile...</span>
              </div>
            ) : selectedProfile?.role === 'business' ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-blue-100 text-blue-700 rounded-full p-3">
                    <Briefcase className="h-7 w-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-blue-800 mb-1">{profileDetails.businessName}</h3>
                    <div className="text-xs text-gray-500">Business Account</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="bg-blue-50 rounded-lg p-3">
                    <div className="text-xs text-blue-700 font-semibold">Campaigns</div>
                    <div className="text-lg font-bold">{profileDetails.numCampaigns}</div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3">
                    <div className="text-xs text-blue-700 font-semibold">Approved</div>
                    <div className="text-lg font-bold">{profileDetails.numApproved}</div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3 col-span-2">
                    <div className="text-xs text-blue-700 font-semibold mb-1">Reviews per Campaign</div>
                    <ul className="text-xs text-gray-700 space-y-1">
                      {profileDetails.reviewsPerCampaign.map((c: any) => (
                        <li key={c.title}><span className="font-semibold">{c.title}:</span> {c.count}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3 col-span-2">
                    <div className="text-xs text-blue-700 font-semibold">Available for More Reviews</div>
                    <div className="text-lg font-bold text-blue-900">${profileDetails.totalAvailable.toFixed(2)}</div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3 col-span-2">
                    <div className="text-xs text-blue-700 font-semibold">Wallet Balance</div>
                    <div className="text-lg font-bold text-blue-900">${profileDetails.walletBalance?.toFixed(2)}</div>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="text-xs text-gray-500">Website:</div>
                  <div className="text-xs text-blue-700 font-semibold truncate max-w-[180px]">{profileDetails.website || 'N/A'}</div>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <div className="text-xs text-gray-500">Account Created:</div>
                  <div className="text-xs text-gray-700">{formatDate(profileDetails.createdAt)}</div>
                </div>
              </div>
            ) : selectedProfile?.role === 'reviewer' ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-green-100 text-green-700 rounded-full p-3">
                    <Star className="h-7 w-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-green-800 mb-1">{profileDetails.name}</h3>
                    <div className="text-xs text-gray-500">Reviewer Account</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="bg-green-50 rounded-lg p-3">
                    <div className="text-xs text-green-700 font-semibold">Submitted</div>
                    <div className="text-lg font-bold">{profileDetails.totalSubmitted}</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3">
                    <div className="text-xs text-green-700 font-semibold">Approved</div>
                    <div className="text-lg font-bold">{profileDetails.totalApproved}</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3 col-span-2">
                    <div className="text-xs text-green-700 font-semibold">Total Earned</div>
                    <div className="text-lg font-bold text-green-900">${profileDetails.totalEarned.toFixed(2)}</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3 col-span-2">
                    <div className="text-xs text-green-700 font-semibold">Available for Withdrawal</div>
                    <div className="text-lg font-bold text-green-900">${profileDetails.availableForWithdrawal.toFixed(2)}</div>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="text-xs text-gray-500">Account Created:</div>
                  <div className="text-xs text-gray-700">{formatDate(profileDetails.createdAt)}</div>
                </div>
              </div>
            ) : null}
          </div>
        </Modal>
      )}
    </div>
  );
};