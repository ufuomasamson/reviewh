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
    <Card className="h-full flex flex-col hover:shadow-md transition-shadow duration-200">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{campaign.title}</CardTitle>
          <Badge 
            variant={statusVariant[campaign.status].variant as any}
          >
            {statusVariant[campaign.status].label}
          </Badge>
        </div>
        <CardDescription className="mt-2">{campaign.description}</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4 flex-1">
        <div>
          <h4 className="text-sm font-medium text-black opacity-70">Product</h4>
          <p className="text-black font-medium">{campaign.product}</p>
        </div>

        <div className="flex justify-between">
          <div>
            <h4 className="text-sm font-medium text-black opacity-70">Per Review</h4>
            <p className="text-black font-bold">{formatCurrency(campaign.price_per_review)}</p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-black opacity-70">Progress</h4>
            <p className="text-black font-medium">{campaign.completed_reviews} / {campaign.target_reviews}</p>
          </div>
        </div>

        <div className="w-full bg-black bg-opacity-20 rounded-full h-3">
          <div
            className="bg-black h-3 rounded-full transition-all duration-300"
            style={{ width: `${(campaign.completed_reviews / campaign.target_reviews) * 100}%` }}
          ></div>
        </div>
      </CardContent>
      
      <CardFooter className="border-t border-black border-opacity-20 pt-4 flex justify-between items-center">
        <div className="text-sm text-black opacity-70">
          Created: {formatDate(campaign.created_at)}
        </div>

        {showActions && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleViewClick}
            className="border-black text-black hover:bg-black hover:text-primary"
          >
            View Details
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};