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
  
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          {user?.role === 'business' ? 'Your Campaigns' : 'Available Campaigns'}
        </h1>
        
        {user?.role === 'business' && (
          <Link to="/campaigns/create">
            <Button rightIcon={<Plus className="h-5 w-5" />}>
              Create Campaign
            </Button>
          </Link>
        )}
      </div>
      
      <div className="flex flex-col md:flex-row gap-4">
        <div className="md:flex-1">
          <Input
            placeholder="Search campaigns..."
            icon={<Search className="h-5 w-5" />}
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        
        <div className="md:w-64">
          <Select
            options={[
              { value: 'all', label: 'All Statuses' },
              { value: 'draft', label: 'Draft' },
              { value: 'pending', label: 'Pending Approval' },
              { value: 'active', label: 'Active' },
              { value: 'completed', label: 'Completed' },
              { value: 'rejected', label: 'Rejected' },
            ]}
            value={statusFilter}
            onChange={handleStatusChange}
            icon={<Filter className="h-5 w-5" />}
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
      ) : filteredCampaigns.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCampaigns.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Megaphone className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No campaigns found</h3>
          <p className="mt-1 text-gray-500">
            {searchQuery || statusFilter !== 'all' 
              ? 'Try adjusting your filters to see more results.'
              : user?.role === 'business' 
                ? 'Get started by creating your first campaign.' 
                : 'Check back soon for new campaigns.'}
          </p>
          
          {user?.role === 'business' && !searchQuery && statusFilter === 'all' && (
            <div className="mt-6">
              <Link to="/campaigns/create">
                <Button>Create a Campaign</Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};