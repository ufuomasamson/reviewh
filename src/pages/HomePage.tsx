import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Briefcase, DollarSign, Shield, BarChart, Globe, ArrowRight, CheckCircle, TrendingUp, Users, Zap } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const HomePage: React.FC = () => {
  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary opacity-10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary opacity-5 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary opacity-5 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary bg-opacity-20 border border-primary border-opacity-30 mb-8">
              <Zap className="h-4 w-4 text-primary mr-2" />
              <span className="text-primary font-medium text-sm">Revolutionizing Review Management</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Authentic Reviews,
              <span className="block bg-gradient-to-r from-primary to-yellow-400 bg-clip-text text-transparent">
                Real Growth
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Connect businesses with genuine reviewers. Build trust, boost credibility, and drive growth through our revolutionary review marketplace.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link to="/register">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary-600 text-black font-semibold px-8 py-4 text-lg"
                  rightIcon={<ArrowRight className="h-5 w-5" />}
                >
                  Start Your Journey
                </Button>
              </Link>
              <Link to="/about">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-primary text-primary hover:bg-primary hover:text-black px-8 py-4 text-lg"
                >
                  Explore Platform
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">10K+</div>
                <div className="text-gray-400">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">50K+</div>
                <div className="text-gray-400">Reviews Generated</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">99.9%</div>
                <div className="text-gray-400">Uptime</div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-primary rounded-full flex justify-center">
            <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-gray-900 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              How It <span className="text-primary">Works</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Three simple steps to transform your business reputation and start earning from authentic reviews
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {/* For Businesses */}
            <div className="relative group">
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl border border-gray-700 hover:border-primary transition-all duration-300 transform hover:-translate-y-2">
                <div className="absolute -top-4 left-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-primary to-yellow-400 rounded-2xl flex items-center justify-center shadow-lg">
                    <Briefcase className="h-8 w-8 text-black" />
                  </div>
                </div>

                <div className="pt-8">
                  <h3 className="text-2xl font-bold text-white mb-4">For Businesses</h3>
                  <p className="text-gray-400 mb-6">Launch campaigns and collect authentic reviews to boost your credibility</p>

                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="w-8 h-8 bg-primary bg-opacity-20 rounded-full flex items-center justify-center mr-4 mt-1">
                        <span className="text-primary font-bold text-sm">1</span>
                      </div>
                      <div>
                        <h4 className="text-white font-semibold">Create Campaign</h4>
                        <p className="text-gray-400 text-sm">Set up your review campaign with target audience and budget</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="w-8 h-8 bg-primary bg-opacity-20 rounded-full flex items-center justify-center mr-4 mt-1">
                        <span className="text-primary font-bold text-sm">2</span>
                      </div>
                      <div>
                        <h4 className="text-white font-semibold">Get Reviews</h4>
                        <p className="text-gray-400 text-sm">Receive authentic reviews from verified users</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="w-8 h-8 bg-primary bg-opacity-20 rounded-full flex items-center justify-center mr-4 mt-1">
                        <span className="text-primary font-bold text-sm">3</span>
                      </div>
                      <div>
                        <h4 className="text-white font-semibold">Boost Growth</h4>
                        <p className="text-gray-400 text-sm">Showcase reviews and watch your business grow</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* For Reviewers */}
            <div className="relative group">
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl border border-gray-700 hover:border-primary transition-all duration-300 transform hover:-translate-y-2">
                <div className="absolute -top-4 left-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-400 rounded-2xl flex items-center justify-center shadow-lg">
                    <DollarSign className="h-8 w-8 text-white" />
                  </div>
                </div>

                <div className="pt-8">
                  <h3 className="text-2xl font-bold text-white mb-4">For Reviewers</h3>
                  <p className="text-gray-400 mb-6">Earn money by sharing honest opinions about products and services</p>

                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="w-8 h-8 bg-green-500 bg-opacity-20 rounded-full flex items-center justify-center mr-4 mt-1">
                        <span className="text-green-400 font-bold text-sm">1</span>
                      </div>
                      <div>
                        <h4 className="text-white font-semibold">Browse Campaigns</h4>
                        <p className="text-gray-400 text-sm">Find products and services you've actually used</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="w-8 h-8 bg-green-500 bg-opacity-20 rounded-full flex items-center justify-center mr-4 mt-1">
                        <span className="text-green-400 font-bold text-sm">2</span>
                      </div>
                      <div>
                        <h4 className="text-white font-semibold">Write Reviews</h4>
                        <p className="text-gray-400 text-sm">Share detailed, honest feedback and experiences</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="w-8 h-8 bg-green-500 bg-opacity-20 rounded-full flex items-center justify-center mr-4 mt-1">
                        <span className="text-green-400 font-bold text-sm">3</span>
                      </div>
                      <div>
                        <h4 className="text-white font-semibold">Get Paid</h4>
                        <p className="text-gray-400 text-sm">Earn money for every approved review</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Trust & Security */}
            <div className="relative group">
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl border border-gray-700 hover:border-primary transition-all duration-300 transform hover:-translate-y-2">
                <div className="absolute -top-4 left-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                </div>

                <div className="pt-8">
                  <h3 className="text-2xl font-bold text-white mb-4">Trust & Security</h3>
                  <p className="text-gray-400 mb-6">Advanced verification and moderation ensure authentic, high-quality reviews</p>

                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="w-8 h-8 bg-blue-500 bg-opacity-20 rounded-full flex items-center justify-center mr-4 mt-1">
                        <CheckCircle className="h-4 w-4 text-blue-400" />
                      </div>
                      <div>
                        <h4 className="text-white font-semibold">Verified Users</h4>
                        <p className="text-gray-400 text-sm">All users undergo strict verification process</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="w-8 h-8 bg-blue-500 bg-opacity-20 rounded-full flex items-center justify-center mr-4 mt-1">
                        <CheckCircle className="h-4 w-4 text-blue-400" />
                      </div>
                      <div>
                        <h4 className="text-white font-semibold">AI Moderation</h4>
                        <p className="text-gray-400 text-sm">Advanced AI detects fake or biased reviews</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="w-8 h-8 bg-blue-500 bg-opacity-20 rounded-full flex items-center justify-center mr-4 mt-1">
                        <CheckCircle className="h-4 w-4 text-blue-400" />
                      </div>
                      <div>
                        <h4 className="text-white font-semibold">Secure Payments</h4>
                        <p className="text-gray-400 text-sm">Bank-grade security for all transactions</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-24 bg-black relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary via-transparent to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Powerful <span className="text-primary">Features</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Everything you need to manage reviews, build trust, and accelerate growth
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group relative">
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 hover:border-primary transition-all duration-300 transform hover:-translate-y-1">
                <div className="w-14 h-14 bg-gradient-to-r from-primary to-yellow-400 rounded-xl flex items-center justify-center mb-6">
                  <Shield className="h-7 w-7 text-black" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Verified Reviews</h3>
                <p className="text-gray-400 leading-relaxed">
                  Advanced verification system ensures every review comes from real users with genuine experiences.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group relative">
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 hover:border-primary transition-all duration-300 transform hover:-translate-y-1">
                <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-400 rounded-xl flex items-center justify-center mb-6">
                  <DollarSign className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Fair Compensation</h3>
                <p className="text-gray-400 leading-relaxed">
                  Transparent payment system that rewards reviewers fairly for their time and honest feedback.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group relative">
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 hover:border-primary transition-all duration-300 transform hover:-translate-y-1">
                <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mb-6">
                  <Globe className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Global Reach</h3>
                <p className="text-gray-400 leading-relaxed">
                  Connect with reviewers worldwide and showcase your reviews across multiple platforms.
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="group relative">
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 hover:border-primary transition-all duration-300 transform hover:-translate-y-1">
                <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-6">
                  <BarChart className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Advanced Analytics</h3>
                <p className="text-gray-400 leading-relaxed">
                  Deep insights into campaign performance, review quality, and ROI tracking.
                </p>
              </div>
            </div>

            {/* Feature 5 */}
            <div className="group relative">
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 hover:border-primary transition-all duration-300 transform hover:-translate-y-1">
                <div className="w-14 h-14 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl flex items-center justify-center mb-6">
                  <TrendingUp className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Growth Acceleration</h3>
                <p className="text-gray-400 leading-relaxed">
                  Proven strategies and tools to boost your online reputation and drive business growth.
                </p>
              </div>
            </div>

            {/* Feature 6 */}
            <div className="group relative">
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 hover:border-primary transition-all duration-300 transform hover:-translate-y-1">
                <div className="w-14 h-14 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-xl flex items-center justify-center mb-6">
                  <Users className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Community Driven</h3>
                <p className="text-gray-400 leading-relaxed">
                  Join a thriving community of businesses and reviewers building trust together.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-24 bg-gray-900 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Trusted by <span className="text-primary">Thousands</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              See what businesses and reviewers are saying about their experience with ReviewHub
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl border border-gray-700 relative">
              <div className="flex items-center mb-6">
                <img
                  src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  alt="Business owner"
                  className="w-14 h-14 rounded-full object-cover mr-4 border-2 border-primary"
                />
                <div>
                  <h4 className="font-bold text-white">Michael Johnson</h4>
                  <p className="text-sm text-primary">CEO, TechSolutions Inc.</p>
                </div>
              </div>
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-primary fill-current" />
                ))}
              </div>
              <p className="text-gray-300 leading-relaxed">
                "ReviewHub has completely transformed our customer feedback process. The quality and authenticity of reviews is unmatched. Our conversion rate increased by 40% after implementing their widget."
              </p>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl border border-gray-700 relative">
              <div className="flex items-center mb-6">
                <img
                  src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  alt="Reviewer"
                  className="w-14 h-14 rounded-full object-cover mr-4 border-2 border-green-400"
                />
                <div>
                  <h4 className="font-bold text-white">Sarah Williams</h4>
                  <p className="text-sm text-green-400">Top Reviewer</p>
                </div>
              </div>
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-green-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-300 leading-relaxed">
                "I've earned over $2,000 writing honest reviews on ReviewHub. The platform is intuitive, payments are always on time, and I love helping businesses grow through authentic feedback."
              </p>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl border border-gray-700 relative md:col-span-2 lg:col-span-1">
              <div className="flex items-center mb-6">
                <img
                  src="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  alt="Marketing Director"
                  className="w-14 h-14 rounded-full object-cover mr-4 border-2 border-blue-400"
                />
                <div>
                  <h4 className="font-bold text-white">David Chen</h4>
                  <p className="text-sm text-blue-400">Marketing Director, StartupCo</p>
                </div>
              </div>
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-blue-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-300 leading-relaxed">
                "The ROI on ReviewHub campaigns is incredible. We've built a strong online reputation that directly translates to increased sales. The analytics dashboard is a game-changer."
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">98%</div>
              <div className="text-gray-400">Customer Satisfaction</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">50K+</div>
              <div className="text-gray-400">Reviews Generated</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">1K+</div>
              <div className="text-gray-400">Active Businesses</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">24/7</div>
              <div className="text-gray-400">Support Available</div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-primary to-yellow-400 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-black rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-black rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-black mb-6">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl md:text-2xl text-black mb-12 max-w-4xl mx-auto opacity-90">
            Join thousands of businesses and reviewers building trust, driving growth, and earning money through authentic reviews.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-6 mb-12">
            <Link to="/register">
              <Button
                size="lg"
                className="bg-black text-primary hover:bg-gray-900 px-8 py-4 text-lg font-semibold"
                rightIcon={<ArrowRight className="h-5 w-5" />}
              >
                Start Your Journey
              </Button>
            </Link>
            <Link to="/pricing">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-black text-black hover:bg-black hover:text-primary px-8 py-4 text-lg font-semibold"
              >
                View Pricing Plans
              </Button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-black opacity-80">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              <span className="font-medium">No Setup Fees</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              <span className="font-medium">Free Trial Available</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              <span className="font-medium">Cancel Anytime</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};