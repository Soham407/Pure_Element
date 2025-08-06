import React from 'react';
import { Heart, Users, Leaf, Award } from 'lucide-react';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">About Pure Elements</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            Discover the promise of Ayurveda with our authentic, natural products crafted for your wellness journey.
          </p>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <p className="text-lg text-gray-600 mb-6">
                Pure Elements was born from a deep respect for ancient Ayurvedic wisdom and a commitment to bringing 
                authentic, natural wellness solutions to modern life. Founded with the vision of making traditional 
                remedies accessible to everyone, we carefully source and craft products that honor centuries-old practices.
              </p>
              <p className="text-lg text-gray-600">
                Every product in our collection is a testament to the power of nature, formulated with pure ingredients 
                and traditional methods that have been trusted for generations.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-8">
              <img 
                src="/api/placeholder/500/400" 
                alt="Ayurvedic herbs and ingredients" 
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Natural Purity</h3>
              <p className="text-gray-600">
                We use only the finest natural ingredients, free from harmful chemicals and synthetic additives.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Quality Assured</h3>
              <p className="text-gray-600">
                Every product undergoes rigorous testing to ensure the highest standards of quality and efficacy.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Wellness First</h3>
              <p className="text-gray-600">
                Your health and well-being are at the heart of everything we do and every product we create.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Community Care</h3>
              <p className="text-gray-600">
                We believe in supporting communities and sustainable practices that benefit everyone.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-16 bg-primary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Our Mission</h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            To bridge the gap between ancient Ayurvedic wisdom and modern wellness needs, providing authentic, 
            natural products that empower individuals to take charge of their health naturally. We are committed 
            to preserving traditional knowledge while making it accessible and relevant for today's lifestyle.
          </p>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <img 
                src="/api/placeholder/200/200" 
                alt="Team member" 
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Dr. Priya Sharma</h3>
              <p className="text-primary-600 mb-3">Chief Ayurvedic Consultant</p>
              <p className="text-gray-600">
                With over 15 years of experience in Ayurvedic medicine, Dr. Sharma ensures all our products 
                meet traditional standards.
              </p>
            </div>
            <div className="text-center">
              <img 
                src="/api/placeholder/200/200" 
                alt="Team member" 
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Rajesh Kumar</h3>
              <p className="text-primary-600 mb-3">Quality Control Manager</p>
              <p className="text-gray-600">
                Rajesh oversees our quality assurance processes, ensuring every product meets our high standards 
                before reaching you.
              </p>
            </div>
            <div className="text-center">
              <img 
                src="/api/placeholder/200/200" 
                alt="Team member" 
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Anita Patel</h3>
              <p className="text-primary-600 mb-3">Customer Wellness Advisor</p>
              <p className="text-gray-600">
                Anita helps customers find the right products for their wellness journey and provides ongoing support.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
