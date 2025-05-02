import React from 'react';
import { Link } from 'react-router-dom';
import { Check, Users, Star, Award, Heart } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const AboutPage: React.FC = () => {
  return (
    <div className="space-y-24 pb-16">
      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight">
              About ReviewHub
            </h1>
            <p className="mt-6 text-xl text-gray-500">
              We're on a mission to transform how businesses collect authentic reviews and how customers earn from sharing their honest opinions.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="space-y-4 text-lg text-gray-600">
                <p>
                  ReviewHub was founded in 2023 with a simple but powerful idea: what if we could create a platform where businesses get authentic reviews while fairly compensating customers for their time and feedback?
                </p>
                <p>
                  We noticed that many review platforms were filled with either overly positive or negative feedback, and customers were providing valuable content without being compensated. Meanwhile, businesses struggled to get honest, constructive feedback about their products and services.
                </p>
                <p>
                  Our solution bridges this gap by creating a transparent marketplace for reviews. Businesses get genuine feedback they can trust and showcase, while reviewers are fairly compensated for sharing their honest opinions.
                </p>
              </div>
            </div>
            <div className="mt-10 lg:mt-0">
              <div className="rounded-xl overflow-hidden shadow-xl">
                <img 
                  src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                  alt="Team collaboration" 
                  className="w-full h-full object-cover"
                />
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
            <h2 className="text-3xl font-bold text-gray-900">Our Team</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
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
              <h3 className="text-xl font-semibold">David Chen</h3>
              <p className="text-gray-500 mb-3">Founder & CEO</p>
              <p className="text-gray-600 max-w-xs mx-auto">
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
              <h3 className="text-xl font-semibold">Sophia Rodriguez</h3>
              <p className="text-gray-500 mb-3">CTO</p>
              <p className="text-gray-600 max-w-xs mx-auto">
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
              <h3 className="text-xl font-semibold">Marcus Johnson</h3>
              <p className="text-gray-500 mb-3">COO</p>
              <p className="text-gray-600 max-w-xs mx-auto">
                Operations expert focused on creating a seamless experience for all users.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Values Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Our Values</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex space-x-4">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Star className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Quality Over Quantity</h3>
                <p className="text-gray-600">
                  We prioritize thoughtful, detailed reviews over volume. It's not about how many reviews you have, but their quality and authenticity.
                </p>
              </div>
            </div>
            
            <div className="flex space-x-4">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Award className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Integrity</h3>
                <p className="text-gray-600">
                  We maintain the highest standards of honesty and transparency in all our operations, from review verification to payment processing.
                </p>
              </div>
            </div>
            
            <div className="flex space-x-4">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Heart className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Customer-Centric</h3>
                <p className="text-gray-600">
                  We design every aspect of our platform with both businesses and reviewers in mind, ensuring a mutually beneficial experience.
                </p>
              </div>
            </div>
            
            <div className="flex space-x-4">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Community</h3>
                <p className="text-gray-600">
                  We're building more than a platform—we're creating a community of businesses and reviewers who value authentic feedback.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Join our community today</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Whether you're a business looking for authentic reviews or someone who wants to earn by sharing your opinions, we'd love to have you on board.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/register">
              <Button size="lg" variant="secondary">
                Sign Up Now
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-blue-700">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};