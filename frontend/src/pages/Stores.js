import React, { useState } from 'react';
import { MapPin, Phone, Clock, Mail, Navigation } from 'lucide-react';

const Stores = () => {
  const [selectedStore, setSelectedStore] = useState(null);

  const stores = [
    {
      id: 1,
      name: "Mahabaleshwar - New",
      address: "134 Dr. Sabne Road, Main Market, Mahabaleshwar",
      phone: "9371007202",
      email: "mahabaleshwar@pureelements.in",
      hours: {
        weekdays: "9:00 AM - 8:00 PM",
        saturday: "9:00 AM - 9:00 PM",
        sunday: "10:00 AM - 7:00 PM"
      },
      image: "/api/placeholder/400/300",
      specialties: ["Ayurvedic Products", "Natural Skincare", "Wellness Consultation"]
    },
    {
      id: 2,
      name: "Mahabaleshwar",
      address: "Near Police Station, Main Market, Mahabaleshwar",
      phone: "9371007201",
      email: "mahabaleshwar@pureelements.in",
      hours: {
        weekdays: "9:00 AM - 8:00 PM",
        saturday: "9:00 AM - 9:00 PM",
        sunday: "10:00 AM - 7:00 PM"
      },
      image: "/api/placeholder/400/300",
      specialties: ["Traditional Ayurveda", "Herbal Remedies", "Natural Cosmetics"]
    },
    {
      id: 3,
      name: "Koregaon Park, Pune",
      address: "Sunderban Resort, Lane 1, Koregaon Park, Pune",
      phone: "9371007205",
      email: "pune@pureelements.in",
      hours: {
        weekdays: "9:00 AM - 8:00 PM",
        saturday: "9:00 AM - 9:00 PM",
        sunday: "10:00 AM - 7:00 PM"
      },
      image: "/api/placeholder/400/300",
      specialties: ["Premium Skincare", "Ayurvedic Consultation", "Wellness Products"]
    },
    {
      id: 4,
      name: "Westend Mall, Aundh, Pune",
      address: "HGS 25. Westend Mall. Parihar Chowk, Aundh, Pune",
      phone: "9371007207",
      email: "aundh@pureelements.in",
      hours: {
        weekdays: "10:00 AM - 10:00 PM",
        saturday: "10:00 AM - 10:00 PM",
        sunday: "10:00 AM - 10:00 PM"
      },
      image: "/api/placeholder/400/300",
      specialties: ["Mall Location", "Full Product Range", "Easy Access"]
    },
    {
      id: 5,
      name: "Phoenix Marketcity, Viman Nagar, Pune",
      address: "Lower Ground Floor, Opp. Timezone. Phoenix Mall, Viman Nagar, Pune",
      phone: "9371007204",
      email: "viman@pureelements.in",
      hours: {
        weekdays: "10:00 AM - 10:00 PM",
        saturday: "10:00 AM - 10:00 PM",
        sunday: "10:00 AM - 10:00 PM"
      },
      image: "/api/placeholder/400/300",
      specialties: ["Shopping Mall", "Complete Range", "Family Shopping"]
    },
    {
      id: 6,
      name: "The Pavillion Mall, Shivajinagar, Pune",
      address: "Second Floor. The Pavillion Mall, Senapati Bapat Road, Shivajinagar, Pune",
      phone: "9371007203",
      email: "shivajinagar@pureelements.in",
      hours: {
        weekdays: "10:00 AM - 10:00 PM",
        saturday: "10:00 AM - 10:00 PM",
        sunday: "10:00 AM - 10:00 PM"
      },
      image: "/api/placeholder/400/300",
      specialties: ["Mall Outlet", "Premium Location", "Full Service"]
    },
    {
      id: 7,
      name: "Phoenix Mall of Millennium, Wakad, Pune",
      address: "Shop No S-51, Second Floor, Phoenix Mall of the Millennium, Behind Sayaji Hotel, Wakad, Pune - 411057",
      phone: "9371007206",
      email: "wakad@pureelements.in",
      hours: {
        weekdays: "10:00 AM - 10:00 PM",
        saturday: "10:00 AM - 10:00 PM",
        sunday: "10:00 AM - 10:00 PM"
      },
      image: "/api/placeholder/400/300",
      specialties: ["Modern Mall", "Latest Products", "Expert Consultation"]
    },
    {
      id: 8,
      name: "Andheri (W), Mumbai",
      address: "Shop No. 1705, Building. 43, Shanti Nagar, D.N.Nagar, Andheri (W), Mumbai, Maharashtra 400053",
      phone: "91373 03060",
      email: "mumbai@pureelements.in",
      hours: {
        weekdays: "9:00 AM - 8:00 PM",
        saturday: "9:00 AM - 9:00 PM",
        sunday: "10:00 AM - 7:00 PM"
      },
      image: "/api/placeholder/400/300",
      specialties: ["Mumbai Location", "Premium Products", "Personalized Service"]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Pure Elements Flagship Stores</h1>
          <p className="text-xl md:text-2xl max-w-4xl mx-auto">
            Visit our physical locations to experience the promise of Ayurveda firsthand. Discover our authentic, natural products and get personalized wellness consultations from our experts.
          </p>
        </div>
      </div>

      {/* Store Locator */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Find a Store Near You</h2>
            <p className="text-lg text-gray-600">
              Experience the power of natural ingredients and authentic Ayurvedic formulations at our stores across Maharashtra and Mumbai
            </p>
          </div>

          {/* Store Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {stores.map((store) => (
              <div 
                key={store.id} 
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <img 
                  src={store.image} 
                  alt={store.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{store.name}</h3>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-start space-x-3">
                      <MapPin className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                      <p className="text-gray-600">{store.address}</p>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-primary-600 flex-shrink-0" />
                      <p className="text-gray-600">{store.phone}</p>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-primary-600 flex-shrink-0" />
                      <p className="text-gray-600">{store.email}</p>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <Clock className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                      <div className="text-gray-600">
                        <p>Mon-Fri: {store.hours.weekdays}</p>
                        <p>Saturday: {store.hours.saturday}</p>
                        <p>Sunday: {store.hours.sunday}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Specialties:</h4>
                    <div className="flex flex-wrap gap-2">
                      {store.specialties.map((specialty, index) => (
                        <span 
                          key={index}
                          className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <button className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center space-x-2">
                      <Navigation className="w-4 h-4" />
                      <span>Get Directions</span>
                    </button>
                    <button 
                      onClick={() => setSelectedStore(store)}
                      className="flex-1 border border-primary-600 text-primary-600 py-2 px-4 rounded-lg hover:bg-primary-50 transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">In-Store Experience</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Ayurvedic Consultation</h3>
              <p className="text-gray-600">
                Get personalized advice from our wellness experts to find the right natural products for your skin and health needs.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Product Testing</h3>
              <p className="text-gray-600">
                Experience our natural formulations firsthand. Test textures, aromas, and feel the difference of pure Ayurvedic ingredients.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Natural Living Education</h3>
              <p className="text-gray-600">
                Learn about the power of natural ingredients, Ayurvedic principles, and how to incorporate wellness into your daily routine.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Store Details Modal */}
      {selectedStore && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-bold text-gray-900">{selectedStore.name}</h3>
                <button 
                  onClick={() => setSelectedStore(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <img 
                src={selectedStore.image} 
                alt={selectedStore.name}
                className="w-full h-64 object-cover rounded-lg mb-6"
              />
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-600">{selectedStore.address}</p>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-primary-600 flex-shrink-0" />
                  <p className="text-gray-600">{selectedStore.phone}</p>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-primary-600 flex-shrink-0" />
                  <p className="text-gray-600">{selectedStore.email}</p>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                  <div className="text-gray-600">
                    <p>Mon-Fri: {selectedStore.hours.weekdays}</p>
                    <p>Saturday: {selectedStore.hours.saturday}</p>
                    <p>Sunday: {selectedStore.hours.sunday}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="font-semibold text-gray-900 mb-3">Specialties:</h4>
                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedStore.specialties.map((specialty, index) => (
                    <span 
                      key={index}
                      className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex space-x-3">
                <button className="flex-1 bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center space-x-2">
                  <Navigation className="w-4 h-4" />
                  <span>Get Directions</span>
                </button>
                <button className="flex-1 border border-primary-600 text-primary-600 py-3 px-4 rounded-lg hover:bg-primary-50 transition-colors">
                  Book Ayurvedic Consultation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Stores;
