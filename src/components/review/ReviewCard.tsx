import React from 'react';
import { Star, ThumbsUp } from 'lucide-react';
import { Review } from '../../lib/types';
import { Card, CardContent, CardFooter, CardHeader } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Avatar } from '../ui/Avatar';
import { formatDate } from '../../lib/utils';

interface ReviewCardProps {
  review: Review;
  reviewerName?: string;
  showActions?: boolean;
  onApprove?: () => void;
  onReject?: () => void;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ 
  review, 
  reviewerName,
  showActions = false,
  onApprove,
  onReject
}) => {
  const statusVariant: Record<Review['status'], { variant: string; label: string }> = {
    'pending': { variant: 'warning', label: 'Pending Review' },
    'approved': { variant: 'success', label: 'Approved' },
    'rejected': { variant: 'danger', label: 'Rejected' },
  };

  // Use reviewer name from review object if available, else fallback
  const displayName = review.reviewer?.name || review.reviewer?.email || reviewerName || 'Anonymous Reviewer';
  const displayCountry = review.reviewer?.country;
  const displayCountryCode = review.reviewer?.country;
  const displayDate = review.created_at ? formatDate(review.created_at) : 'Unknown date';
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-start justify-between">
        <div className="flex items-center">
          <Avatar name={displayName} size="sm" countryCode={displayCountryCode} />
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">{displayName}</p>
            {displayCountry && (
              <p className="text-xs text-gray-500">{displayCountry}</p>
            )}
            <div className="flex items-center mt-1">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`h-4 w-4 ${i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} 
                />
              ))}
            </div>
          </div>
        </div>
        <Badge variant={statusVariant[review.status].variant as any}>
          {statusVariant[review.status].label}
        </Badge>
      </CardHeader>
      
      <CardContent className="flex-1">
        <p className="text-gray-700 leading-relaxed">{review.content}</p>
      </CardContent>
      
      <CardFooter className="border-t pt-4 flex justify-between items-center">
        <div className="text-sm text-gray-500">
          {displayDate}
        </div>
        
        {showActions && review.status === 'pending' ? (
          <div className="flex space-x-2">
            <button 
              onClick={onReject}
              className="px-3 py-1 text-sm text-red-600 hover:text-red-800 font-medium"
            >
              Reject
            </button>
            <button 
              onClick={onApprove}
              className="px-3 py-1 text-sm bg-green-100 text-green-800 hover:bg-green-200 rounded-md font-medium"
            >
              Approve
            </button>
          </div>
        ) : (
          <div className="flex items-center text-gray-500 text-sm">
            <ThumbsUp className="h-4 w-4 mr-1" />
            <span>Helpful</span>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};