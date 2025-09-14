import React from 'react';
import { Heart, Shield, Zap, Leaf, Award, CheckCircle } from 'lucide-react';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">About PURE ELEMENTS</h1>
          <p className="text-xl md:text-2xl max-w-4xl mx-auto">
            At PURE ELEMENTS, we aim towards simplification of skincare and create effective products through the ingredients offered by Mother Nature! Every product comes with a promise of ayurveda – Safety & Performance!
          </p>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Ingredients</h2>
              <p className="text-lg text-gray-600 mb-6">
                The Real Heroes, are selected from ayurvedic texts and picked up from mother nature.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                Roots / Fruits / Leaves / Flowers / Barks. almost every part of the plant is used in various formulations.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                Ingredients come in all possible forms … powders / juices / aqueous extracts / oil extracts / essential oils / raw herbs etc.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                Their essence is derived sometimes by grinding, sometimes squeezing / cold pressing / roasting / steam distilling / boiling or crushing.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                These natural treasures are then blended with modern goodies like vitamins / proteins / peptides etc. to enhance the efficacy of a formulation.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                We carefully select all our ingredients so that they're safe for you, your skin and the environment.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                All ingredients are sourced in an ethical way and no animal is harmed in the process.
              </p>
              <p className="text-lg text-gray-600 font-semibold">
                They are Potent, Pure & Safe!
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-8">
              <img 
                src="/api/placeholder/500/400" 
                alt="Natural Ayurvedic ingredients" 
                className="w-full h-64 object-cover rounded-lg mb-6"
              />
              <div className="text-center">
                <h3 className="text-2xl font-bold text-primary-600 mb-2">Pure Thinking</h3>
                <h3 className="text-2xl font-bold text-primary-600 mb-2">Pure Ingredients</h3>
                <h3 className="text-2xl font-bold text-primary-600 mb-4">PURE ELEMENTS</h3>
                <p className="text-lg font-semibold text-gray-700">The Promise of Ayurveda!</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Safety Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="bg-primary-50 rounded-lg p-8">
              <div className="flex items-center mb-6">
                <Shield className="w-12 h-12 text-primary-600 mr-4" />
                <h2 className="text-3xl font-bold text-gray-900">Safety</h2>
              </div>
              <p className="text-lg text-gray-600 mb-6">
                Safety is the single most important criterion at PURE ELEMENTS while selecting the ingredients and raw materials.
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-600 mr-3 mt-1 flex-shrink-0" />
                  <p className="text-gray-600">All our products are free from Paraben Preservatives.</p>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-600 mr-3 mt-1 flex-shrink-0" />
                  <p className="text-gray-600">We do not use harmful chemicals, petroleum products, paraffin oil, SLS, formaldehydes, phthalates etc.</p>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-600 mr-3 mt-1 flex-shrink-0" />
                  <p className="text-gray-600">Every ingredient used in our formulations undergoes extensive scrutiny, not only for its friendliness with skin & hair but with the environment also.</p>
                </div>
              </div>
            </div>
            <div>
              <img 
                src="/api/placeholder/500/400" 
                alt="Safe and natural ingredients" 
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Efficacy Section */}
      <div className="py-16 bg-primary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src="/api/placeholder/500/400" 
                alt="Effective formulations" 
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
            <div className="bg-white rounded-lg p-8">
              <div className="flex items-center mb-6">
                <Zap className="w-12 h-12 text-primary-600 mr-4" />
                <h2 className="text-3xl font-bold text-gray-900">Efficacy</h2>
              </div>
              <p className="text-lg text-gray-600 mb-6">
                Every ingredient is selected, and every formulation is developed in such a way that it should do what it is supposed to do.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                Potency and Efficacy is one of the most important factors which has made PURE ELEMENTS so popular among its users.
              </p>
              <div className="bg-primary-100 rounded-lg p-6 text-center">
                <h3 className="text-2xl font-bold text-primary-800 mb-2">Pure Thinking</h3>
                <h3 className="text-2xl font-bold text-primary-800 mb-2">Pure Ingredients</h3>
                <h3 className="text-2xl font-bold text-primary-800 mb-4">PURE ELEMENTS</h3>
                <p className="text-lg font-semibold text-primary-700">The Promise of Ayurveda!</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Why Choose Pure Elements?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Natural Purity</h3>
              <p className="text-gray-600">
                Ingredients selected from ayurvedic texts and picked from mother nature. Every part of the plant is used in various formulations.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Safety First</h3>
              <p className="text-gray-600">
                Free from harmful chemicals, parabens, SLS, and other toxic ingredients. Every formulation undergoes extensive scrutiny.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Proven Efficacy</h3>
              <p className="text-gray-600">
                Every ingredient is selected and every formulation is developed to do what it's supposed to do with maximum potency.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
