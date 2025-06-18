import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Megaphone, Plus, Search, Filter } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useCampaignStore } from '../../store/campaignStore';
import { Campaign } from '../../lib/types';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { CampaignCard } from '../../components/campaign/CampaignCard';

export const CampaignsPage: React.FC = () => {
  const { user } = useAuthStore();
  const { getCampaigns, getBusinessCampaigns } = useCampaignStore();
  
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  useEffect(() => {
    const fetchCampaigns = async () => {
      setIsLoading(true);
      try {
        let fetchedCampaigns: Campaign[] = [];
        
        if (user?.role === 'business') {
          // Fetch only campaigns created by this business
          fetchedCampaigns = await getBusinessCampaigns(user.id);
        } else {
          // For reviewers and admins, fetch all campaigns
          fetchedCampaigns = await getCampaigns();
          
          // For reviewers, only show active campaigns
          if (user?.role === 'reviewer') {
            fetchedCampaigns = fetchedCampaigns.filter(c => c.status === 'active');
          }
        }
        
        setCampaigns(fetchedCampaigns);
        setFilteredCampaigns(fetchedCampaigns);
      } catch (error) {
        console.error('Failed to fetch campaigns:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCampaigns();
  }, [user]);
  
  useEffect(() => {
    // Apply filters whenever search query or status filter changes
    let results = campaigns;
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      results = results.filter(campaign => 
        campaign.title.toLowerCase().includes(query) || 
        campaign.description.toLowerCase().includes(query) ||
        campaign.product.toLowerCase().includes(query)
      );
    }
    
    if (statusFilter !== 'all') {
      results = results.filter(campaign => campaign.status === statusFilter);
    }
    
    setFilteredCampaigns(results);
  }, [searchQuery, statusFilter, campaigns]);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
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
                  Campaign <span className="text-primary">Management</span>
                </h1>
                <p className="text-xl text-gray-300">
                  Monitor and manage all platform campaigns
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
                    placeholder="Search campaigns..."
                    value={searchQuery}
                    onChange={handleSearch}
                    className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              <div className="md:w-64">
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <select
                    value={statusFilter}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none"
                  >
                    <option value="all">All Statuses</option>
                    <option value="draft">Draft</option>
                    <option value="pending">Pending Approval</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
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
          ) : filteredCampaigns.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCampaigns.map((campaign) => (
                <CampaignCard key={campaign.id} campaign={campaign} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 rounded-lg bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700">
              <Megaphone className="mx-auto h-12 w-12 mb-4 text-gray-600" />
              <h3 className="text-lg font-medium mb-2 text-white">No campaigns found</h3>
              <p className="text-gray-400">
                {searchQuery || statusFilter !== 'all'
                  ? 'Try adjusting your filters to see more results.'
                  : 'Check back soon for new campaigns.'}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

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
                {user?.role === 'business' ? 'Your' : 'Available'} <span className="text-primary">Campaigns</span>
              </h1>
              <p className="text-xl text-gray-300">
                {user?.role === 'business'
                  ? 'Manage your review campaigns and track performance'
                  : 'Discover campaigns and start earning by writing reviews'}
              </p>
            </div>
            {user?.role === 'business' && (
              <div className="mt-6 lg:mt-0">
                <Link to="/campaigns/create">
                  <Button
                    size="lg"
                    rightIcon={<Plus className="h-5 w-5" />}
                    className="bg-primary hover:bg-primary-600 text-black font-semibold"
                  >
                    Create Campaign
                  </Button>
                </Link>
              </div>
            )}
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
                  placeholder="Search campaigns..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            <div className="md:w-64">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none"
                >
                  <option value="all">All Statuses</option>
                  <option value="draft">Draft</option>
                  <option value="pending">Pending Approval</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
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
        ) : filteredCampaigns.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCampaigns.map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 rounded-lg bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700">
            <Megaphone className="mx-auto h-12 w-12 mb-4 text-gray-600" />
            <h3 className="text-lg font-medium mb-2 text-white">No campaigns found</h3>
            <p className="text-gray-400">
              {searchQuery || statusFilter !== 'all'
                ? 'Try adjusting your filters to see more results.'
                : user?.role === 'business'
                  ? 'Get started by creating your first campaign.'
                  : 'Check back soon for new campaigns.'}
            </p>

            {user?.role === 'business' && !searchQuery && statusFilter === 'all' && (
              <div className="mt-6">
                <Link to="/campaigns/create">
                  <Button className="bg-primary hover:bg-primary-600 text-black">Create a Campaign</Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};