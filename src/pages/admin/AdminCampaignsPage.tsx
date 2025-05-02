import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Card } from '../../components/ui/Card';
import { formatDate } from '../../lib/utils';
import { useAuthStore } from '../../store/authStore';

interface Campaign {
  id: string;
  name: string;
  owner_id: string;
  status: string;
  created_at: string;
}

export const AdminCampaignsPage: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchCampaigns = async () => {
      setIsLoading(true);
      console.log('Current user:', user); // Debug log for user

      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .order('created_at', { ascending: false });

      console.log('Fetched campaigns:', data); // Debug log for data
      console.log('Error if any:', error);     // Debug log for error

      if (error) {
        console.error('Error fetching campaigns:', error);
      } else if (data) {
        setCampaigns(data);
      }
      setIsLoading(false);
    };

    fetchCampaigns();
  }, [user]);

  // Debug: Log the full user object and metadata to the console
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user: supaUser } } = await supabase.auth.getUser();
      console.log('Full user data:', supaUser);
      console.log('User metadata:', supaUser?.user_metadata);
      console.log('App metadata:', supaUser?.app_metadata);
    };
    checkUser();
  }, []);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">All Campaigns</h1>
      {isLoading ? (
        <div className="flex justify-center py-12">
          <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
      ) : campaigns.length > 0 ? (
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {campaigns.map((campaign) => (
                  <tr key={campaign.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{campaign.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{campaign.owner_id}</td>
                    <td className="px-6 py-4 whitespace-nowrap capitalize">{campaign.status}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{formatDate(campaign.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h3 className="mt-2 text-lg font-medium text-gray-900">No campaigns found</h3>
          <p className="mt-1 text-gray-500">There are no campaigns created yet.</p>
        </div>
      )}
    </div>
  );
};

export default AdminCampaignsPage; 