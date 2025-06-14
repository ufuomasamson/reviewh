import React from 'react';
import { Link } from 'react-router-dom';
import { Check, Users, Star, Award, Heart } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const AboutPage: React.FC = () => {
  return (
    <div className="bg-black">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary opacity-10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary opacity-5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Building Trust Through
              <span className="block bg-gradient-to-r from-primary to-yellow-400 bg-clip-text text-transparent">
                Authentic Reviews
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              We're revolutionizing how businesses and customers connect, creating a transparent ecosystem where genuine feedback drives growth and builds lasting trust.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-24 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-white mb-8">
                Our <span className="text-primary">Story</span>
              </h2>
              <div className="space-y-6 text-lg text-gray-300 leading-relaxed">
                <p>
                  ReviewHub was born from a simple observation: the review ecosystem was broken. Businesses struggled to get authentic feedback, while customers provided valuable insights without fair compensation.
                </p>
                <p>
                  Founded in 2023 by a team of product managers and engineers, we set out to create something different—a platform where transparency, authenticity, and fair compensation drive every interaction.
                </p>
                <p>
                  Today, we're proud to connect thousands of businesses with genuine reviewers, creating a marketplace where trust is built through authentic experiences and honest feedback.
                </p>
              </div>
              <div className="mt-8 grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">1K+</div>
                  <div className="text-gray-400 text-sm">Active Businesses</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">50K+</div>
                  <div className="text-gray-400 text-sm">Reviews Generated</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">98%</div>
                  <div className="text-gray-400 text-sm">Satisfaction Rate</div>
                </div>
              </div>
            </div>
            <div className="mt-10 lg:mt-0">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-yellow-400 rounded-2xl blur opacity-75"></div>
                <div className="relative bg-gray-800 rounded-2xl overflow-hidden border border-gray-700">
                  <img
                    src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                    alt="Team collaboration"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission Section */}
      <section className="py-16 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-xl text-gray-600 mb-10">
              To create a transparent, fair, and authentic review ecosystem that benefits both businesses and consumers.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 text-left">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Check className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Authenticity</h3>
                <p className="text-gray-600">
                  We verify every review to ensure it's honest and genuine, creating trust for businesses and consumers.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Fair Compensation</h3>
                <p className="text-gray-600">
                  We believe in rewarding reviewers for the value they create through their honest feedback and time.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Star className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Valuable Insights</h3>
                <p className="text-gray-600">
                  We help businesses collect the feedback they need to improve their products and services.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Team Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-on-dark">Our Team</h2>
            <p className="mt-4 text-xl text-muted max-w-3xl mx-auto">
              Meet the passionate people behind ReviewHub
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="mx-auto h-40 w-40 rounded-full overflow-hidden mb-4">
                <img
                  src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  alt="CEO"
                  className="h-full w-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold text-on-dark">David Chen</h3>
              <p className="text-muted mb-3">Founder & CEO</p>
              <p className="text-muted max-w-xs mx-auto">
                Former product manager with a passion for authentic customer experiences.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto h-40 w-40 rounded-full overflow-hidden mb-4">
                <img
                  src="https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  alt="CTO"
                  className="h-full w-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold text-on-dark">Sophia Rodriguez</h3>
              <p className="text-muted mb-3">CTO</p>
              <p className="text-muted max-w-xs mx-auto">
                Tech innovator with 15+ years of experience building scalable platforms.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto h-40 w-40 rounded-full overflow-hidden mb-4">
                <img
                  src="https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  alt="COO"
                  className="h-full w-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold text-on-dark">Marcus Johnson</h3>
              <p className="text-muted mb-3">COO</p>
              <p className="text-muted max-w-xs mx-auto">
                Operations expert focused on creating a seamless experience for all users.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Values Section */}
      <section className="py-16 bg-accent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-on-light">Our Values</h2>
            <p className="mt-4 text-xl text-muted max-w-3xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex space-x-4">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Star className="h-6 w-6 text-primary-600" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-on-light">Quality Over Quantity</h3>
                <p className="text-muted">
                  We prioritize thoughtful, detailed reviews over volume. It's not about how many reviews you have, but their quality and authenticity.
                </p>
              </div>
            </div>

            <div className="flex space-x-4">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Award className="h-6 w-6 text-primary-600" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-on-light">Integrity</h3>
                <p className="text-muted">
                  We maintain the highest standards of honesty and transparency in all our operations, from review verification to payment processing.
                </p>
              </div>
            </div>

            <div className="flex space-x-4">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Heart className="h-6 w-6 text-primary-600" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-on-light">Customer-Centric</h3>
                <p className="text-muted">
                  We design every aspect of our platform with both businesses and reviewers in mind, ensuring a mutually beneficial experience.
                </p>
              </div>
            </div>

            <div className="flex space-x-4">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary-600" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-on-light">Community</h3>
                <p className="text-muted">
                  We're building more than a platform—we're creating a community of businesses and reviewers who value authentic feedback.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-black mb-4">Join our community today</h2>
          <p className="text-xl text-black mb-8 max-w-3xl mx-auto opacity-80">
            Whether you're a business looking for authentic reviews or someone who wants to earn by sharing your opinions, we'd love to have you on board.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/register">
              <Button size="lg" variant="secondary">
                Sign Up Now
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="bg-transparent border-black text-black hover:bg-primary-600">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};