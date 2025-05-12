import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '../../store/authStore';
import { useCampaignStore } from '../../store/campaignStore';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/Card';
import { Alert } from '../../components/ui/Alert';
import { FlutterWaveButton, closePaymentModal } from 'flutterwave-react-v3';

interface CampaignFormData {
  title: string;
  description: string;
  product: string;
  price_per_review: number;
  target_reviews: number;
}

export const CreateCampaignPage: React.FC = () => {
  const { user, ensureBusinessProfile } = useAuthStore();
  const { createCampaign, isLoading, error } = useCampaignStore();
  const navigate = useNavigate();
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<CampaignFormData>();
  
  const [subscribing, setSubscribing] = useState(false);
  const [subscriptionActive, setSubscriptionActive] = useState(false);

  useEffect(() => {
    // Check subscription status (assume user.subscription_status and user.subscription_expiry exist)
    if (
      user?.role === 'business' &&
      user.subscription_status === 'active' &&
      user.subscription_expiry &&
      new Date(user.subscription_expiry as string) > new Date()
    ) {
      setSubscriptionActive(true);
    } else {
      setSubscriptionActive(false);
    }
  }, [user]);

  const handleSubscriptionSuccess = async (response: any) => {
    // In a real app, verify payment and update subscription status in the backend
    setSubscribing(false);
    setSubscriptionActive(true);
    alert('Subscription successful! You can now create campaigns.');
    // Optionally, refetch user profile here
  };

  const onSubmit = async (data: CampaignFormData) => {
    if (!user) {
      console.error('No user found');
      return;
    }
    
    try {
      // Ensure business profile exists
      await ensureBusinessProfile();
      
      const campaign = await createCampaign({
        business_id: user.id,
        title: data.title,
        description: data.description,
        product: data.product,
        price_per_review: data.price_per_review,
        target_reviews: data.target_reviews,
        status: 'pending' // All new campaigns start in pending state for admin approval
      });
      
      // Redirect to the campaign detail page
      navigate(`/campaigns/${campaign.id}`);
    } catch (err: any) {
      console.error('Failed to create campaign:', err);
      if (err.message) console.error('Error message:', err.message);
      if (err.details) console.error('Error details:', err.details);
      if (err.hint) console.error('Error hint:', err.hint);
    }
  };
  
  return (
    <div className="max-w-2xl mx-auto py-10 space-y-10">
      {user?.role === 'business' && !subscriptionActive && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-md flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-yellow-800">Subscription Required</h2>
            <p className="text-yellow-700 mt-1">You need an active subscription ($6/month) to create campaigns. Please subscribe below to unlock all features.</p>
          </div>
          <FlutterWaveButton
            public_key={import.meta.env.VITE_FLW_PUBLIC_KEY}
            tx_ref={Date.now().toString()}
            amount={6}
            currency="USD"
            payment_options="card"
            customer={{
              email: user.email,
              phone_number: user.phone_number || '',
              name: user.name,
            }}
            customizations={{
              title: 'ReviewH Subscription',
              description: 'Monthly subscription to unlock campaign creation',
              logo: 'https://yourdomain.com/logo.png',
            }}
            text="Subscribe for $6/month"
            callback={handleSubscriptionSuccess}
            onClose={() => setSubscribing(false)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded shadow w-full mt-4"
          />
        </div>
      )}
      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <CardHeader>
            <CardTitle>Create a New Campaign</CardTitle>
          <CardDescription>
              Get honest reviews for your product or service from our community of verified reviewers.
          </CardDescription>
        </CardHeader>
        
          <CardContent className="space-y-6">
            {error && (
              <Alert variant="error" title="Error">
                {error}
              </Alert>
            )}
            
            <div>
            <Input
              label="Campaign Title"
                placeholder="e.g., Review our new productivity app"
              {...register('title', {
                  required: 'Title is required',
                  minLength: { value: 10, message: 'Title must be at least 10 characters' }
              })}
              error={errors.title?.message}
            />
            </div>
            
            <div>
              <Input
                label="Product Name"
                placeholder="e.g., TaskMaster Pro"
                {...register('product', { 
                  required: 'Product name is required'
                })}
                error={errors.product?.message}
              />
            </div>
            
            <div>
            <Textarea
              label="Campaign Description"
                placeholder="Describe what reviewers should focus on and any specific requirements..."
              {...register('description', {
                required: 'Description is required',
                  minLength: { value: 50, message: 'Description must be at least 50 characters' }
              })}
              error={errors.description?.message}
                rows={5}
            />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
              <Input
                type="number"
                  label="Price per Review ($)"
                  placeholder="0.00"
                step="0.01"
                min="0.50"
                  {...register('price_per_review', { 
                  required: 'Price per review is required',
                    min: { value: 0.5, message: 'Minimum price is $0.50' },
                    valueAsNumber: true
                })}
                  error={errors.price_per_review?.message}
                />
              </div>
              
              <div>
              <Input
                type="number"
                  label="Target Reviews"
                  placeholder="10"
                min="5"
                  {...register('target_reviews', { 
                    required: 'Target reviews is required',
                    min: { value: 5, message: 'Minimum 5 reviews required' },
                    valueAsNumber: true
                })}
                  error={errors.target_reviews?.message}
                />
              </div>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-lg text-sm text-blue-800">
              <p className="font-medium mb-2">Campaign Approval Process:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Your campaign will be reviewed by our team within 24 hours</li>
                <li>Once approved, it will be visible to reviewers</li>
                <li>You will only be charged for approved reviews</li>
                <li>Make sure you have sufficient funds in your wallet</li>
              </ol>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/campaigns')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              fullWidth
              size="lg"
              isLoading={isLoading}
              disabled={!subscriptionActive}
            >
              Create Campaign
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};