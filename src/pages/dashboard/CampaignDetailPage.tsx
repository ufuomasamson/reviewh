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
      // Refetch the campaign from backend to get the correct completed_reviews
      const updatedCampaign = await getCampaignById(campaign.id);
      if (updatedCampaign) setCampaign(updatedCampaign);
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
      <div className="min-h-screen bg-black flex justify-center items-center py-12">
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
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>
    );
  }
  
  if (error || !campaign) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center py-12">
          <AlertCircle className="mx-auto h-12 w-12 text-red-400 mb-4" />
          <h2 className="text-lg font-medium text-white mb-2">Campaign not found</h2>
          <p className="text-gray-400 mb-6">The campaign you're looking for doesn't exist or you don't have access.</p>
          <Button
            onClick={() => navigate('/campaigns')}
            leftIcon={<ArrowLeft className="h-5 w-5" />}
            className="bg-primary hover:bg-primary-600 text-black"
          >
            Back to Campaigns
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-black">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900 border-b border-gray-800">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-primary rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                leftIcon={<ArrowLeft className="h-4 w-4" />}
                onClick={() => navigate('/campaigns')}
                className="border-gray-600 text-gray-300 hover:border-primary hover:text-primary"
              >
                Back to Campaigns
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-white">
                  Campaign <span className="text-primary">Details</span>
                </h1>
                <p className="text-gray-300">View and manage campaign information</p>
              </div>
            </div>

            {user?.role === 'business' && user.id === campaign?.business_id && (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  leftIcon={<Edit className="h-4 w-4" />}
                  onClick={() => alert('Edit functionality would go here')}
                  className="border-gray-600 text-gray-300 hover:border-primary hover:text-primary"
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
                    className="bg-red-500 bg-opacity-20 border border-red-500 border-opacity-30 text-red-400 hover:bg-red-500 hover:bg-opacity-30"
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
                      className="bg-red-500 bg-opacity-20 border border-red-500 border-opacity-30 text-red-400 hover:bg-red-500 hover:bg-opacity-30"
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
                      className="border-gray-600 text-gray-300 hover:border-gray-500"
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {deleteError && (
          <div className="bg-red-500 bg-opacity-10 border border-red-500 border-opacity-20 rounded-xl p-4">
            <Alert variant="error" title="Error">
              {deleteError}
            </Alert>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-8">
          {/* Campaign Details */}
          <div className="md:col-span-2">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 overflow-hidden">
              <div className="p-6 border-b border-gray-700">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-white">{campaign.title}</h2>
                    <p className="text-gray-400 mt-1">{campaign.product}</p>
                  </div>
                  <Badge variant={getStatusBadgeVariant(campaign.status) as any}>
                    {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                  </Badge>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-2">Description</h3>
                  <p className="text-gray-300 whitespace-pre-line">{campaign.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex space-x-3 items-center">
                    <DollarSign className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-gray-400">Price per Review</p>
                      <p className="font-medium text-white">{formatCurrency(campaign.price_per_review)}</p>
                    </div>
                  </div>

                  <div className="flex space-x-3 items-center">
                    <Star className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-gray-400">Reviews</p>
                      <p className="font-medium text-white">{campaign.completed_reviews} / {campaign.target_reviews}</p>
                    </div>
                  </div>

                  <div className="flex space-x-3 items-center">
                    <Calendar className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-gray-400">Created</p>
                      <p className="font-medium text-white">{formatDate(campaign.created_at)}</p>
                    </div>
                  </div>

                  <div className="flex space-x-3 items-center">
                    <Clipboard className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-gray-400">Campaign ID</p>
                      <p className="font-medium text-xs text-white">{campaign.id}</p>
                    </div>
                  </div>
                </div>

                <div className="w-full bg-gray-700 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-primary to-yellow-500 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min((campaign.completed_reviews / campaign.target_reviews) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4 text-white">Reviews</h2>

              {canSubmitReview() && (
                <div id="write-review">
                  <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 overflow-hidden mb-6">
                    <div className="p-6 border-b border-gray-700">
                      <h3 className="text-lg font-bold text-white mb-2">Write a Review</h3>
                      <p className="text-gray-400 text-sm">Share your honest feedback about this product or service.</p>
                    </div>

                    <div className="p-6">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Rating</label>
                          <div className="flex space-x-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                className="focus:outline-none"
                              >
                                <Star
                                  className={`h-6 w-6 ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`}
                                />
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Your Review</label>
                          <textarea
                            placeholder="Share your experience with this product or service..."
                            value={reviewContent}
                            onChange={(e) => {
                              setReviewContent(e.target.value);
                              if (reviewError) setReviewError('');
                            }}
                            rows={6}
                            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                          />
                          <p className="text-xs text-gray-400 mt-2">Min 50 characters. Your review will be checked by our team before being published.</p>
                          {reviewError && (
                            <p className="mt-1 text-sm text-red-400">{reviewError}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-700 pt-6 px-6 pb-6">
                      <Button
                        onClick={handleReviewSubmit}
                        isLoading={isSubmitting}
                        disabled={reviewContent.trim().length < 50 || isSubmitting}
                        className="bg-primary hover:bg-primary-600 text-black"
                      >
                        Submit Review
                      </Button>
                    </div>
                  </div>
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
                <div className="text-center py-8 rounded-lg bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700">
                  <Star className="mx-auto h-12 w-12 mb-4 text-gray-600" />
                  <h3 className="text-lg font-medium mb-2 text-white">No reviews yet</h3>
                  <p className="text-gray-400">Be the first to review this campaign.</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {user?.role === 'reviewer' && campaign.status === 'active' && (
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 overflow-hidden">
                <div className="p-6 border-b border-gray-700">
                  <h3 className="text-xl font-bold text-white">Earn by Reviewing</h3>
                </div>
                <div className="p-6">
                  <p className="text-gray-300 mb-4">
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
                      className="bg-primary hover:bg-primary-600 text-black w-full"
                    >
                      Write a Review
                    </Button>
                  ) : (
                    <p className="text-yellow-400">You've already submitted a review for this campaign.</p>
                  )}
                </div>
              </div>
            )}

            {user?.role === 'business' && user.id === campaign.business_id && (
              <>
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 overflow-hidden">
                  <div className="p-6 border-b border-gray-700">
                    <h3 className="text-xl font-bold text-white">Campaign Stats</h3>
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <p className="text-sm text-gray-400">Total Budget</p>
                      <p className="text-xl font-semibold text-white">{formatCurrency(campaign.price_per_review * campaign.target_reviews)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Spent So Far</p>
                      <p className="text-xl font-semibold text-primary">{formatCurrency(campaign.price_per_review * campaign.completed_reviews)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Reviews Completion</p>
                      <p className="text-xl font-semibold text-white">{Math.round((campaign.completed_reviews / campaign.target_reviews) * 100)}%</p>
                    </div>
                  </div>
                </div>

                {/* Embed Reviews section only for business owner */}
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 overflow-hidden">
                  <div className="p-6 border-b border-gray-700">
                    <h3 className="text-xl font-bold text-white">Embed Reviews</h3>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-300 mb-4">
                      Add these reviews to your website by copying the code below.
                    </p>
                    <div className="bg-gray-900 border border-gray-700 p-3 rounded-xl text-sm font-mono overflow-x-auto">
                      <code className="text-green-400">{`<script src="https://reviewhub.example/embed/${campaign.id}"></script>`}</code>
                    </div>
                    <Button
                      variant="outline"
                      fullWidth
                      className="mt-4 border-gray-600 text-gray-300 hover:border-primary hover:text-primary hover:bg-primary hover:bg-opacity-10"
                      onClick={() => {
                        navigator.clipboard.writeText(`<script src="https://reviewhub.example/embed/${campaign.id}"></script>`);
                        alert('Embed code copied to clipboard!');
                      }}
                    >
                      Copy Code
                    </Button>
                  </div>
                </div>
              </>
            )}

            {user?.role === 'admin' && (
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 overflow-hidden">
                <div className="p-6 border-b border-gray-700">
                  <h3 className="text-xl font-bold text-white">Admin Actions</h3>
                </div>
                <div className="p-6 space-y-4">
                  <p className="text-gray-300">
                    Manage this campaign and moderate its reviews.
                  </p>
                  <div className="space-y-3">
                    <Button
                      fullWidth
                      variant={campaign.status === 'active' ? 'outline' : 'primary'}
                      onClick={handleApproveCampaign}
                      disabled={campaign.status === 'active'}
                      className={campaign.status === 'active'
                        ? 'border-gray-600 text-gray-400 cursor-not-allowed'
                        : 'bg-primary hover:bg-primary-600 text-black'}
                    >
                      {campaign.status === 'active' ? 'Already Active' : 'Approve Campaign'}
                    </Button>

                    <Button
                      fullWidth
                      variant="outline"
                      onClick={() => alert('This would reject the campaign')}
                      disabled={campaign.status === 'rejected'}
                      className="border-red-500 border-opacity-30 text-red-400 hover:bg-red-500 hover:bg-opacity-10 disabled:border-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed"
                    >
                      Reject Campaign
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};