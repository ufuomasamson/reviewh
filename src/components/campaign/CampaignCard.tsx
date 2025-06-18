import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Campaign } from '../../lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { formatCurrency, formatDate } from '../../lib/utils';

interface CampaignCardProps {
  campaign: Campaign;
  showActions?: boolean;
}

export const CampaignCard: React.FC<CampaignCardProps> = ({ campaign, showActions = true }) => {
  const navigate = useNavigate();
  
  const statusVariant: Record<Campaign['status'], { variant: string; label: string }> = {
    'draft': { variant: 'default', label: 'Draft' },
    'pending': { variant: 'warning', label: 'Pending Approval' },
    'active': { variant: 'success', label: 'Active' },
    'completed': { variant: 'primary', label: 'Completed' },
    'rejected': { variant: 'danger', label: 'Rejected' },
  };
  
  const handleViewClick = () => {
    navigate(`/campaigns/${campaign.id}`);
  };
  
  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 overflow-hidden hover:border-gray-600 transition-all duration-300">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-white">{campaign.title}</h3>
          <Badge
            variant={statusVariant[campaign.status].variant as any}
          >
            {statusVariant[campaign.status].label}
          </Badge>
        </div>
        <p className="text-gray-300 text-sm leading-relaxed">{campaign.description}</p>
      </div>

      <div className="px-6 pb-6 space-y-4 flex-1">
        <div>
          <h4 className="text-sm font-medium text-gray-400">Product</h4>
          <p className="text-white font-medium">{campaign.product}</p>
        </div>

        <div className="flex justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-400">Per Review</h4>
            <p className="text-primary font-bold text-lg">{formatCurrency(campaign.price_per_review)}</p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-400">Progress</h4>
            <p className="text-white font-medium">{campaign.completed_reviews} / {campaign.target_reviews}</p>
          </div>
        </div>

        <div className="w-full bg-gray-700 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-primary to-yellow-500 h-3 rounded-full transition-all duration-300"
            style={{ width: `${Math.min((campaign.completed_reviews / campaign.target_reviews) * 100, 100)}%` }}
          ></div>
        </div>
      </div>

      <div className="border-t border-gray-700 pt-4 px-6 pb-6 flex justify-between items-center">
        <div className="text-sm text-gray-400">
          Created: {formatDate(campaign.created_at)}
        </div>

        {showActions && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleViewClick}
            className="border-gray-600 text-gray-300 hover:border-primary hover:text-primary hover:bg-primary hover:bg-opacity-10"
          >
            View Details
          </Button>
        )}
      </div>
    </div>
  );
};