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
    <div className="h-full flex flex-col bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 overflow-hidden">
      <div className="flex flex-row items-start justify-between p-6">
        <div className="flex items-center">
          <Avatar name={displayName} size="sm" countryCode={displayCountryCode} />
          <div className="ml-3">
            <p className="text-sm font-medium text-white">{displayName}</p>
            {displayCountry && (
              <p className="text-xs text-gray-400">{displayCountry}</p>
            )}
            <div className="flex items-center mt-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`}
                />
              ))}
            </div>
          </div>
        </div>
        <Badge variant={statusVariant[review.status].variant as any}>
          {statusVariant[review.status].label}
        </Badge>
      </div>

      <div className="flex-1 px-6 pb-4">
        <p className="text-gray-300 leading-relaxed">{review.content}</p>
      </div>

      <div className="border-t border-gray-700 pt-4 px-6 pb-6 flex justify-between items-center">
        <div className="text-sm text-gray-400">
          {displayDate}
        </div>

        {showActions && review.status === 'pending' ? (
          <div className="flex space-x-2">
            <button
              onClick={onReject}
              className="px-3 py-1 text-sm text-red-400 hover:text-red-300 font-medium bg-red-500 bg-opacity-20 border border-red-500 border-opacity-30 rounded-lg hover:bg-opacity-30 transition-all"
            >
              Reject
            </button>
            <button
              onClick={onApprove}
              className="px-3 py-1 text-sm bg-green-500 bg-opacity-20 text-green-400 hover:text-green-300 border border-green-500 border-opacity-30 rounded-lg font-medium hover:bg-opacity-30 transition-all"
            >
              Approve
            </button>
          </div>
        ) : (
          <div className="flex items-center text-gray-400 text-sm">
            <ThumbsUp className="h-4 w-4 mr-1" />
            <span>Helpful</span>
          </div>
        )}
      </div>
    </div>
  );
};