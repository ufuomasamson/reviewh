import React from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const PricingPage: React.FC = () => {
  return (
    <div className="py-12 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight">
            Simple, transparent pricing
          </h1>
          <p className="mt-5 text-xl text-gray-500">
            No hidden fees, no long-term contracts. Just a simple platform fee for each successful review.
          </p>
        </div>
        
        <div className="mb-16">
          <div className="sm:flex sm:flex-col sm:align-center">
            <div className="relative self-center mt-6 bg-gray-100 rounded-lg p-0.5 flex sm:mt-8">
              <button
                type="button"
                className="relative w-1/2 bg-white border-gray-200 rounded-md shadow-sm py-2 text-sm font-medium text-gray-900 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-blue-500 focus:z-10 sm:w-auto sm:px-8"
              >
                Pay per Review
              </button>
              <button
                type="button"
                className="ml-0.5 relative w-1/2 border border-transparent rounded-md py-2 text-sm font-medium text-gray-700 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-blue-500 focus:z-10 sm:w-auto sm:px-8"
              >
                Subscription
              </button>
            </div>
          </div>
        </div>
        
        {/* Pricing Tables */}
        <div className="mt-12 space-y-12 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-x-8">
          {/* Basic Plan */}
          <div className="relative p-8 bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col">
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900">Starter</h3>
              <p className="mt-4 flex items-baseline text-gray-900">
                <span className="text-5xl font-extrabold tracking-tight">15%</span>
                <span className="ml-1 text-xl font-semibold">platform fee</span>
              </p>
              <p className="mt-6 text-gray-500">
                Perfect for small businesses just getting started with customer reviews.
              </p>
              
              <ul className="mt-6 space-y-4">
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <Check className="h-6 w-6 text-green-500" />
                  </div>
                  <p className="ml-3 text-gray-500">Up to 50 reviews per month</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <Check className="h-6 w-6 text-green-500" />
                  </div>
                  <p className="ml-3 text-gray-500">Basic embeddable widget</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <Check className="h-6 w-6 text-green-500" />
                  </div>
                  <p className="ml-3 text-gray-500">Email support</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <Check className="h-6 w-6 text-green-500" />
                  </div>
                  <p className="ml-3 text-gray-500">Simple analytics</p>
                </li>
              </ul>
            </div>
            
            <Link to="/register" className="mt-8">
              <Button variant="outline" size="lg" fullWidth>
                Get started
              </Button>
            </Link>
          </div>
          
          {/* Pro Plan */}
          <div className="relative p-8 bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col">
            <div className="absolute top-0 right-0 pt-4 pr-4">
              <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                Popular
              </span>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900">Professional</h3>
              <p className="mt-4 flex items-baseline text-gray-900">
                <span className="text-5xl font-extrabold tracking-tight">10%</span>
                <span className="ml-1 text-xl font-semibold">platform fee</span>
              </p>
              <p className="mt-6 text-gray-500">
                For growing businesses that need more reviews and better insights.
              </p>
              
              <ul className="mt-6 space-y-4">
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <Check className="h-6 w-6 text-green-500" />
                  </div>
                  <p className="ml-3 text-gray-500">Up to 200 reviews per month</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <Check className="h-6 w-6 text-green-500" />
                  </div>
                  <p className="ml-3 text-gray-500">Advanced embeddable widget</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <Check className="h-6 w-6 text-green-500" />
                  </div>
                  <p className="ml-3 text-gray-500">Priority email support</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <Check className="h-6 w-6 text-green-500" />
                  </div>
                  <p className="ml-3 text-gray-500">Detailed analytics dashboard</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <Check className="h-6 w-6 text-green-500" />
                  </div>
                  <p className="ml-3 text-gray-500">Review response tools</p>
                </li>
              </ul>
            </div>
            
            <Link to="/register" className="mt-8">
              <Button size="lg" fullWidth>
                Get started
              </Button>
            </Link>
          </div>
          
          {/* Enterprise Plan */}
          <div className="relative p-8 bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col">
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900">Enterprise</h3>
              <p className="mt-4 flex items-baseline text-gray-900">
                <span className="text-5xl font-extrabold tracking-tight">7%</span>
                <span className="ml-1 text-xl font-semibold">platform fee</span>
              </p>
              <p className="mt-6 text-gray-500">
                Custom solutions for large businesses with high volume needs.
              </p>
              
              <ul className="mt-6 space-y-4">
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <Check className="h-6 w-6 text-green-500" />
                  </div>
                  <p className="ml-3 text-gray-500">Unlimited reviews</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <Check className="h-6 w-6 text-green-500" />
                  </div>
                  <p className="ml-3 text-gray-500">Custom branded widgets</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <Check className="h-6 w-6 text-green-500" />
                  </div>
                  <p className="ml-3 text-gray-500">Dedicated account manager</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <Check className="h-6 w-6 text-green-500" />
                  </div>
                  <p className="ml-3 text-gray-500">Advanced reporting and API access</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <Check className="h-6 w-6 text-green-500" />
                  </div>
                  <p className="ml-3 text-gray-500">Custom integration options</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <Check className="h-6 w-6 text-green-500" />
                  </div>
                  <p className="ml-3 text-gray-500">Priority review processing</p>
                </li>
              </ul>
            </div>
            
            <Link to="/contact" className="mt-8">
              <Button variant="outline" size="lg" fullWidth>
                Contact sales
              </Button>
            </Link>
          </div>
        </div>
        
        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto mt-24">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-12">
            Frequently asked questions
          </h2>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                How does the platform fee work?
              </h3>
              <p className="mt-4 text-gray-500">
                The platform fee is a percentage of what you pay for each review. For example, if you set your review price at $1 and your platform fee is 10%, you'll pay $1.10 total per review. This fee helps us maintain the platform, verify reviews, and process payments.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                Can I change plans as my business grows?
              </h3>
              <p className="mt-4 text-gray-500">
                Absolutely! You can upgrade or downgrade your plan at any time. The new platform fee will apply to all new reviews collected after the change.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                How do I pay for reviews?
              </h3>
              <p className="mt-4 text-gray-500">
                You can fund your account with Flutterwave, and we'll automatically deduct the cost of each review plus the platform fee as reviews are approved.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                What happens if a review is rejected?
              </h3>
              <p className="mt-4 text-gray-500">
                You only pay for approved reviews. If our team rejects a review because it doesn't meet our quality standards, you won't be charged.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                Can reviewers write negative reviews?
              </h3>
              <p className="mt-4 text-gray-500">
                Yes. We believe in honest, authentic feedback. Reviewers are encouraged to share their genuine opinions, whether positive or negative. However, all reviews must be constructive and follow our community guidelines.
              </p>
            </div>
          </div>
        </div>
        
        {/* CTA Section */}
        <div className="mt-24 bg-blue-50 rounded-lg overflow-hidden shadow-xl">
          <div className="px-6 py-12 sm:px-12 lg:px-16">
            <div className="lg:flex lg:items-center lg:justify-between">
              <div className="lg:w-0 lg:flex-1">
                <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">
                  Ready to get started?
                </h2>
                <p className="mt-4 max-w-3xl text-lg text-gray-500">
                  Join thousands of businesses already collecting authentic reviews on our platform.
                </p>
              </div>
              <div className="mt-8 lg:mt-0 lg:flex-shrink-0">
                <div className="inline-flex rounded-md shadow">
                  <Link to="/register">
                    <Button size="lg">
                      Create an account
                    </Button>
                  </Link>
                </div>
                <div className="ml-3 inline-flex rounded-md shadow">
                  <Link to="/contact">
                    <Button variant="outline" size="lg">
                      Talk to sales
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};