import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Briefcase, DollarSign, Shield, BarChart, Globe } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const HomePage: React.FC = () => {
  return (
    <div className="space-y-24 pb-16">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
            <div className="mb-12 lg:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight mb-6">
                Authentic reviews that grow your business
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Connect with real customers, get honest feedback, and boost your online reputation with ReviewHub. The simplest way to collect and showcase authentic reviews.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link to="/register">
                  <Button size="lg" rightIcon={<Star className="h-5 w-5" />}>
                    Get Started
                  </Button>
                </Link>
                <Link to="/about">
                  <Button variant="outline" size="lg">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative h-[500px] rounded-xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="People collaborating" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform simplifies the process of collecting, managing, and showcasing authentic reviews.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* For Businesses */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-5">
                <Briefcase className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">For Businesses</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-600 mr-3 flex-shrink-0">1</span>
                  <span>Create a campaign for your product or service</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-600 mr-3 flex-shrink-0">2</span>
                  <span>Set your budget and payment per review</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-600 mr-3 flex-shrink-0">3</span>
                  <span>Receive authentic reviews to showcase online</span>
                </li>
              </ul>
            </div>
            
            {/* For Reviewers */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="h-12 w-12 bg-teal-100 rounded-lg flex items-center justify-center mb-5">
                <Star className="h-6 w-6 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">For Reviewers</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-teal-100 text-teal-600 mr-3 flex-shrink-0">1</span>
                  <span>Browse available review campaigns</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-teal-100 text-teal-600 mr-3 flex-shrink-0">2</span>
                  <span>Write honest, thoughtful reviews</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-teal-100 text-teal-600 mr-3 flex-shrink-0">3</span>
                  <span>Get paid for each approved review</span>
                </li>
              </ul>
            </div>
            
            {/* For Admins */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="h-12 w-12 bg-amber-100 rounded-lg flex items-center justify-center mb-5">
                <Shield className="h-6 w-6 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Our Commitment</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-amber-100 text-amber-600 mr-3 flex-shrink-0">1</span>
                  <span>We verify all businesses on our platform</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-amber-100 text-amber-600 mr-3 flex-shrink-0">2</span>
                  <span>Reviews are moderated for authenticity</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-amber-100 text-amber-600 mr-3 flex-shrink-0">3</span>
                  <span>Secure, transparent payment processing</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Platform Features</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to manage your reviews and grow your business.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6 hover:shadow-lg transition-shadow duration-300 rounded-lg border border-gray-100">
              <div className="h-12 w-12 rounded-md bg-blue-100 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Verified Reviews</h3>
              <p className="text-gray-600">All reviews are verified and approved by our team to ensure authenticity.</p>
            </div>
            
            <div className="p-6 hover:shadow-lg transition-shadow duration-300 rounded-lg border border-gray-100">
              <div className="h-12 w-12 rounded-md bg-blue-100 flex items-center justify-center mb-4">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Fair Compensation</h3>
              <p className="text-gray-600">Reviewers are fairly compensated for their time and honest feedback.</p>
            </div>
            
            <div className="p-6 hover:shadow-lg transition-shadow duration-300 rounded-lg border border-gray-100">
              <div className="h-12 w-12 rounded-md bg-blue-100 flex items-center justify-center mb-4">
                <Globe className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Embeddable Widget</h3>
              <p className="text-gray-600">Showcase your reviews on your website with our customizable widget.</p>
            </div>
            
            <div className="p-6 hover:shadow-lg transition-shadow duration-300 rounded-lg border border-gray-100">
              <div className="h-12 w-12 rounded-md bg-blue-100 flex items-center justify-center mb-4">
                <BarChart className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Detailed Analytics</h3>
              <p className="text-gray-600">Track the performance of your campaigns and review engagement.</p>
            </div>
            
            <div className="p-6 hover:shadow-lg transition-shadow duration-300 rounded-lg border border-gray-100">
              <div className="h-12 w-12 rounded-md bg-blue-100 flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Secure Payments</h3>
              <p className="text-gray-600">Integration with Flutterwave for secure transaction processing.</p>
            </div>
            
            <div className="p-6 hover:shadow-lg transition-shadow duration-300 rounded-lg border border-gray-100">
              <div className="h-12 w-12 rounded-md bg-blue-100 flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Campaign Management</h3>
              <p className="text-gray-600">Easily create, manage, and track your review campaigns from one dashboard.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-16 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">What Our Users Say</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Hear from businesses and reviewers who use our platform.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="flex items-center mb-6">
                <img 
                  src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                  alt="Business owner" 
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-semibold">Michael Johnson</h4>
                  <p className="text-sm text-gray-500">CEO, TechSolutions Inc.</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "ReviewHub has transformed how we collect customer feedback. The quality of reviews is exceptional, and featuring them on our website has significantly increased our conversion rate."
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="flex items-center mb-6">
                <img 
                  src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                  alt="Reviewer" 
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-semibold">Sarah Williams</h4>
                  <p className="text-sm text-gray-500">Product Reviewer</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "I love writing reviews on ReviewHub. The platform is easy to use, and I appreciate being compensated for my honest opinions. It's a win-win for everyone involved."
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to get started?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Join thousands of businesses and reviewers on our platform today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/register">
              <Button size="lg" variant="secondary">
                Sign Up Now
              </Button>
            </Link>
            <Link to="/pricing">
              <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-blue-700">
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};