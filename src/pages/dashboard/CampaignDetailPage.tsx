import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Star, DollarSign, Clipboard, Calendar, AlertCircle, Trash2 } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useCampaignStore } from '../../store/campaignStore';
import { Campaign, Review } from '../../lib/types';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Textarea } from '../../components/ui/Textarea';
import { ReviewCard } from '../../components/review/ReviewCard';
import { formatCurrency, formatDate } from '../../lib/utils';
import { Alert } from '../../components/ui/Alert';

export const CampaignDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { getCampaignById, getReviews, createReview, updateReviewStatus, deleteCampaign, isLoading, error, updateCampaign } = useCampaignStore();
  
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewContent, setReviewContent] = useState('');
  const [rating, setRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  
  useEffect(() => {
    const fetchCampaignData = async () => {
      if (!id) return;
      
      try {
        const campaignData = await getCampaignById(id);
        if (campaignData) {
          setCampaign(campaignData);
          
          const campaignReviews = await getReviews(id);
          setReviews(campaignReviews);
        }
      } catch (error) {
        console.error('Failed to fetch campaign data:', error);
      }
    };
    
    fetchCampaignData();
  }, [id]);
  
  const handleReviewSubmit = async () => {
    if (!user || !campaign) return;
    
    if (reviewContent.trim().length < 50) {
      setReviewError('Review must be at least 50 characters long');
      return;
    }
    
    setIsSubmitting(true);
    setReviewError('');
    
    try {
      const newReview = await createReview({
        campaign_id: campaign.id,
        reviewer_id: user.id,
        rating,
        content: reviewContent,
        status: 'pending',
        earnings: campaign.price_per_review
      });
      
      setReviews([...reviews, newReview]);
      setReviewContent('');
      setRating(5);
    } catch (error) {
      console.error('Failed to submit review:', error);
      setReviewError('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleApproveReview = async (reviewId: string) => {
    if (!campaign) return;
    
    try {
      const updatedReview = await updateReviewStatus(reviewId, 'approved');
      
      // Update the reviews list with the updated review
      setReviews(reviews.map(rev => 
        rev.id === reviewId ? updatedReview : rev
      ));
      
      // Update the campaign's completed reviews count
      setCampaign({
        ...campaign,
        completed_reviews: campaign.completed_reviews + 1,
      });
    } catch (error) {
      console.error('Failed to approve review:', error);
    }
  };
  
  const handleRejectReview = async (reviewId: string) => {
    try {
      const updatedReview = await updateReviewStatus(reviewId, 'rejected');
      
      // Update the reviews list with the updated review
      setReviews(reviews.map(rev => 
        rev.id === reviewId ? updatedReview : rev
      ));
    } catch (error) {
      console.error('Failed to reject review:', error);
    }
  };
  
  const canSubmitReview = () => {
    if (!user || !campaign) return false;
    
    // Reviewers can submit reviews for active campaigns
    if (user.role === 'reviewer' && campaign.status === 'active') {
      // Check if the reviewer has already submitted a review for this campaign
      const hasReviewed = reviews.some(review => review.reviewer_id === user.id);
      return !hasReviewed;
    }
    
    return false;
  };
  
  const getStatusBadgeVariant = (status: Campaign['status']) => {
    switch (status) {
      case 'active': return 'success';
      case 'pending': return 'warning';
      case 'draft': return 'default';
      case 'completed': return 'primary';
      case 'rejected': return 'danger';
      default: return 'default';
    }
  };
  
  const handleDelete = async () => {
    if (!campaign || !id) return;
    
    setIsDeleting(true);
    setDeleteError('');
    
    try {
      await deleteCampaign(id);
      // Only navigate after successful deletion
      navigate('/campaigns');
    } catch (error) {
      console.error('Failed to delete campaign:', error);
      setDeleteError('Failed to delete campaign. Please try again.');
      setShowDeleteConfirm(false);
    } finally {
      setIsDeleting(false);
    }
  };
  
  const handleApproveCampaign = async () => {
    if (!campaign) return;
    try {
      const updated = await updateCampaign(campaign.id, { status: 'active' });
      setCampaign(updated);
    } catch (err) {
      alert('Failed to approve campaign. Please try again.');
    }
  };
  
  if (isLoading) {
    return (
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
    );
  }
  
  if (error || !campaign) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
        <h2 className="mt-2 text-lg font-medium text-gray-900">Campaign not found</h2>
        <p className="mt-1 text-gray-500">The campaign you're looking for doesn't exist or you don't have access.</p>
        <div className="mt-6">
          <Button
            onClick={() => navigate('/campaigns')}
            leftIcon={<ArrowLeft className="h-5 w-5" />}
          >
            Back to Campaigns
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <Button
          variant="outline"
          size="sm"
          leftIcon={<ArrowLeft className="h-4 w-4" />}
          onClick={() => navigate('/campaigns')}
        >
          Back to Campaigns
        </Button>
        
        {user?.role === 'business' && user.id === campaign?.business_id && (
          <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            leftIcon={<Edit className="h-4 w-4" />}
            onClick={() => alert('Edit functionality would go here')}
          >
            Edit Campaign
          </Button>
            
            {!showDeleteConfirm ? (
              <Button
                size="sm"
                variant="danger"
                leftIcon={<Trash2 className="h-4 w-4" />}
                onClick={() => {
                  setDeleteError('');
                  setShowDeleteConfirm(true);
                }}
              >
                Delete
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="danger"
                  onClick={handleDelete}
                  isLoading={isDeleting}
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Deleting...' : 'Confirm Delete'}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDeleteError('');
                  }}
                  disabled={isDeleting}
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
      
      {deleteError && (
        <Alert variant="error" title="Error">
          {deleteError}
        </Alert>
      )}
      
      <div className="grid md:grid-cols-3 gap-8">
        {/* Campaign Details */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">{campaign.title}</CardTitle>
                  <CardDescription>
                    <span className="block mt-1">{campaign.product}</span>
                  </CardDescription>
                </div>
                <Badge variant={getStatusBadgeVariant(campaign.status) as any}>
                  {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Description</h3>
                <p className="text-gray-700 whitespace-pre-line">{campaign.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex space-x-2 items-center">
                  <DollarSign className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Price per Review</p>
                    <p className="font-medium">{formatCurrency(campaign.price_per_review)}</p>
                  </div>
                </div>
                
                <div className="flex space-x-2 items-center">
                  <Star className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Reviews</p>
                    <p className="font-medium">{campaign.completed_reviews} / {campaign.target_reviews}</p>
                  </div>
                </div>
                
                <div className="flex space-x-2 items-center">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Created</p>
                    <p className="font-medium">{formatDate(campaign.created_at)}</p>
                  </div>
                </div>
                
                <div className="flex space-x-2 items-center">
                  <Clipboard className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Campaign ID</p>
                    <p className="font-medium text-xs">{campaign.id}</p>
                  </div>
                </div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ width: `${(campaign.completed_reviews / campaign.target_reviews) * 100}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>
          
          {/* Reviews Section */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Reviews</h2>
            
            {canSubmitReview() && (
              <div id="write-review">
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-lg">Write a Review</CardTitle>
                  <CardDescription>
                    Share your honest feedback about this product or service.
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className="focus:outline-none"
                          >
                            <Star 
                              className={`h-6 w-6 ${star <= rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} 
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    
                      <div>
                    <Textarea
                      label="Your Review"
                      placeholder="Share your experience with this product or service..."
                      value={reviewContent}
                          onChange={(e) => {
                            setReviewContent(e.target.value);
                            if (reviewError) setReviewError('');
                          }}
                      error={reviewError}
                      helpText="Min 50 characters. Your review will be checked by our team before being published."
                          rows={6}
                    />
                        {reviewError && (
                          <p className="mt-1 text-sm text-red-600">{reviewError}</p>
                        )}
                      </div>
                  </div>
                </CardContent>
                
                <CardFooter>
                  <Button 
                    onClick={handleReviewSubmit}
                    isLoading={isSubmitting}
                      disabled={reviewContent.trim().length < 50 || isSubmitting}
                  >
                    Submit Review
                  </Button>
                </CardFooter>
              </Card>
              </div>
            )}
            
            {reviews.length > 0 ? (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <ReviewCard 
                    key={review.id} 
                    review={review}
                    showActions={user?.role === 'admin' && review.status === 'pending'}
                    onApprove={() => handleApproveReview(review.id)}
                    onReject={() => handleRejectReview(review.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <Star className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No reviews yet</h3>
                <p className="mt-1 text-gray-500">Be the first to review this campaign.</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {user?.role === 'reviewer' && campaign.status === 'active' && (
            <Card>
              <CardHeader>
                <CardTitle>Earn by Reviewing</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  Share your honest opinion about this product and earn {formatCurrency(campaign.price_per_review)} for your approved review.
                </p>
                {canSubmitReview() ? (
                  <Button 
                    fullWidth
                    onClick={() => {
                      const reviewSection = document.getElementById('write-review');
                      if (reviewSection) {
                        reviewSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        const textarea = reviewSection.querySelector('textarea');
                        if (textarea) {
                          setTimeout(() => textarea.focus(), 100);
                        }
                      }
                    }}
                  >
                    Write a Review
                  </Button>
                ) : (
                  <p className="text-amber-600">You've already submitted a review for this campaign.</p>
                )}
              </CardContent>
            </Card>
          )}
          
          {user?.role === 'business' && user.id === campaign.business_id && (
            <Card>
              <CardHeader>
                <CardTitle>Campaign Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Total Budget</p>
                  <p className="text-xl font-semibold">{formatCurrency(campaign.price_per_review * campaign.target_reviews)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Spent So Far</p>
                  <p className="text-xl font-semibold">{formatCurrency(campaign.price_per_review * campaign.completed_reviews)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Reviews Completion</p>
                  <p className="text-xl font-semibold">{Math.round((campaign.completed_reviews / campaign.target_reviews) * 100)}%</p>
                </div>
              </CardContent>
            </Card>
          )}
          
          {user?.role === 'admin' && (
            <Card>
              <CardHeader>
                <CardTitle>Admin Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  Manage this campaign and moderate its reviews.
                </p>
                <div className="space-y-2">
                  <Button 
                    fullWidth
                    variant={campaign.status === 'active' ? 'outline' : 'primary'}
                    onClick={handleApproveCampaign}
                    disabled={campaign.status === 'active'}
                  >
                    {campaign.status === 'active' ? 'Already Active' : 'Approve Campaign'}
                  </Button>
                  
                  <Button 
                    fullWidth
                    variant="outline"
                    // In a real app, this would update the campaign status
                    onClick={() => alert('This would reject the campaign')}
                    disabled={campaign.status === 'rejected'}
                  >
                    Reject Campaign
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          
          <Card>
            <CardHeader>
              <CardTitle>Embed Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                Add these reviews to your website by copying the code below.
              </p>
              <div className="bg-gray-100 p-3 rounded-md text-sm font-mono overflow-x-auto">
                {`<script src="https://reviewhub.example/embed/${campaign.id}"></script>`}
              </div>
              <Button 
                variant="outline" 
                fullWidth 
                className="mt-4"
                onClick={() => {
                  navigator.clipboard.writeText(`<script src="https://reviewhub.example/embed/${campaign.id}"></script>`);
                  alert('Embed code copied to clipboard!');
                }}
              >
                Copy Code
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};