import React from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const PricingPage: React.FC = () => {
  return (
    <div className="py-12 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-extrabold text-on-dark sm:text-5xl sm:tracking-tight">
            Simple, transparent pricing
          </h1>
          <p className="mt-5 text-xl text-muted">
            No hidden fees, no long-term contracts. Just a simple platform fee for each successful review.
          </p>
        </div>
        
        <div className="mb-16">
          <div className="sm:flex sm:flex-col sm:align-center">
            <div className="relative self-center mt-6 bg-accent-200 rounded-lg p-0.5 flex sm:mt-8">
              <button
                type="button"
                className="relative w-1/2 bg-card border-accent-300 rounded-md shadow-sm py-2 text-sm font-medium text-on-light whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-primary-500 focus:z-10 sm:w-auto sm:px-8"
              >
                Pay per Review
              </button>
              <button
                type="button"
                className="ml-0.5 relative w-1/2 border border-transparent rounded-md py-2 text-sm font-medium text-muted whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-primary-500 focus:z-10 sm:w-auto sm:px-8"
              >
                Subscription
              </button>
            </div>
          </div>
        </div>
        
        {/* Pricing Tables */}
        <div className="mt-12 space-y-12 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-x-8">
          {/* Basic Plan */}
          <div className="relative p-8 bg-card border border-accent-300 rounded-2xl shadow-sm flex flex-col">
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-on-light">Starter</h3>
              <p className="mt-4 flex items-baseline text-on-light">
                <span className="text-5xl font-extrabold tracking-tight">15%</span>
                <span className="ml-1 text-xl font-semibold">platform fee</span>
              </p>
              <p className="mt-6 text-muted">
                Perfect for small businesses just getting started with customer reviews.
              </p>
              
              <ul className="mt-6 space-y-4">
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <Check className="h-6 w-6 text-green-500" />
                  </div>
                  <p className="ml-3 text-muted">Up to 50 reviews per month</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <Check className="h-6 w-6 text-green-500" />
                  </div>
                  <p className="ml-3 text-muted">Basic embeddable widget</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <Check className="h-6 w-6 text-green-500" />
                  </div>
                  <p className="ml-3 text-muted">Email support</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <Check className="h-6 w-6 text-green-500" />
                  </div>
                  <p className="ml-3 text-muted">Simple analytics</p>
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
          <div className="relative p-8 bg-card border border-accent-300 rounded-2xl shadow-sm flex flex-col">
            <div className="absolute top-0 right-0 pt-4 pr-4">
              <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
                Popular
              </span>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-on-light">Professional</h3>
              <p className="mt-4 flex items-baseline text-on-light">
                <span className="text-5xl font-extrabold tracking-tight">10%</span>
                <span className="ml-1 text-xl font-semibold">platform fee</span>
              </p>
              <p className="mt-6 text-muted">
                For growing businesses that need more reviews and better insights.
              </p>
              
              <ul className="mt-6 space-y-4">
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <Check className="h-6 w-6 text-green-500" />
                  </div>
                  <p className="ml-3 text-muted">Up to 200 reviews per month</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <Check className="h-6 w-6 text-green-500" />
                  </div>
                  <p className="ml-3 text-muted">Advanced embeddable widget</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <Check className="h-6 w-6 text-green-500" />
                  </div>
                  <p className="ml-3 text-muted">Priority email support</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <Check className="h-6 w-6 text-green-500" />
                  </div>
                  <p className="ml-3 text-muted">Detailed analytics dashboard</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <Check className="h-6 w-6 text-green-500" />
                  </div>
                  <p className="ml-3 text-muted">Review response tools</p>
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
          <div className="relative p-8 bg-card border border-accent-300 rounded-2xl shadow-sm flex flex-col">
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-on-light">Enterprise</h3>
              <p className="mt-4 flex items-baseline text-on-light">
                <span className="text-5xl font-extrabold tracking-tight">7%</span>
                <span className="ml-1 text-xl font-semibold">platform fee</span>
              </p>
              <p className="mt-6 text-muted">
                Custom solutions for large businesses with high volume needs.
              </p>
              
              <ul className="mt-6 space-y-4">
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <Check className="h-6 w-6 text-green-500" />
                  </div>
                  <p className="ml-3 text-muted">Unlimited reviews</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <Check className="h-6 w-6 text-green-500" />
                  </div>
                  <p className="ml-3 text-muted">Custom branded widgets</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <Check className="h-6 w-6 text-green-500" />
                  </div>
                  <p className="ml-3 text-muted">Dedicated account manager</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <Check className="h-6 w-6 text-green-500" />
                  </div>
                  <p className="ml-3 text-muted">Advanced reporting and API access</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <Check className="h-6 w-6 text-green-500" />
                  </div>
                  <p className="ml-3 text-muted">Custom integration options</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <Check className="h-6 w-6 text-green-500" />
                  </div>
                  <p className="ml-3 text-muted">Priority review processing</p>
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
          <h2 className="text-3xl font-extrabold text-on-dark text-center mb-12">
            Frequently asked questions
          </h2>

          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold text-on-dark">
                How does the platform fee work?
              </h3>
              <p className="mt-4 text-muted">
                The platform fee is a percentage of what you pay for each review. For example, if you set your review price at $1 and your platform fee is 10%, you'll pay $1.10 total per review. This fee helps us maintain the platform, verify reviews, and process payments.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-on-dark">
                Can I change plans as my business grows?
              </h3>
              <p className="mt-4 text-muted">
                Absolutely! You can upgrade or downgrade your plan at any time. The new platform fee will apply to all new reviews collected after the change.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-on-dark">
                How do I pay for reviews?
              </h3>
              <p className="mt-4 text-muted">
                You can fund your account with Flutterwave, and we'll automatically deduct the cost of each review plus the platform fee as reviews are approved.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-on-dark">
                What happens if a review is rejected?
              </h3>
              <p className="mt-4 text-muted">
                You only pay for approved reviews. If our team rejects a review because it doesn't meet our quality standards, you won't be charged.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-on-dark">
                Can reviewers write negative reviews?
              </h3>
              <p className="mt-4 text-muted">
                Yes. We believe in honest, authentic feedback. Reviewers are encouraged to share their genuine opinions, whether positive or negative. However, all reviews must be constructive and follow our community guidelines.
              </p>
            </div>
          </div>
        </div>
        
        {/* CTA Section */}
        <div className="mt-24 bg-primary-50 rounded-lg overflow-hidden shadow-xl">
          <div className="px-6 py-12 sm:px-12 lg:px-16">
            <div className="lg:flex lg:items-center lg:justify-between">
              <div className="lg:w-0 lg:flex-1">
                <h2 className="text-3xl font-extrabold tracking-tight text-on-light">
                  Ready to get started?
                </h2>
                <p className="mt-4 max-w-3xl text-lg text-muted">
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