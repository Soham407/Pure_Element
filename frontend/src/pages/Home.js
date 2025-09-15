import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../services/api';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { ShoppingCart, Star, Leaf, Award, Shield, Heart } from 'lucide-react';
import toast from 'react-hot-toast';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const response = await apiService.products.getAll();
      // Get first 6 products as featured
      setFeaturedProducts(response.data.products.slice(0, 6));
    } catch (error) {
      console.error('Failed to fetch featured products:', error);
      toast.error('Failed to load featured products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId) => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }
    await addToCart(productId, 1);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-hero section-padding relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50/30 via-transparent to-sage-50/30"></div>
        <div className="container-custom relative z-10">
          <div className="text-center max-w-5xl mx-auto">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-neutral-900 mb-8 leading-tight">
              Pure <span className="text-gradient">Ayurvedic</span><br />
              Beauty & Wellness
            </h1>
            <p className="text-xl md:text-2xl text-neutral-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              Discover the transformative power of nature with our premium collection of 
              <span className="font-semibold text-primary-600"> Ayurvedic beauty and wellness products</span>, 
              crafted with ancient wisdom and modern science for your holistic well-being.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link to="/products" className="btn-primary text-lg px-10 py-4 shadow-2xl">
                Explore Collection
              </Link>
              <button className="btn-outline text-lg px-10 py-4">
                Our Story
              </button>
            </div>
            
            {/* Trust indicators */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 mb-2">500+</div>
                <div className="text-sm text-neutral-600 font-medium">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 mb-2">100%</div>
                <div className="text-sm text-neutral-600 font-medium">Natural</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 mb-2">5★</div>
                <div className="text-sm text-neutral-600 font-medium">Rated</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 mb-2">24/7</div>
                <div className="text-sm text-neutral-600 font-medium">Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6">
              Why Choose <span className="text-gradient">Pure Elements</span>?
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
              We're committed to bringing you the finest Ayurvedic products with uncompromising 
              quality, authenticity, and a deep respect for nature's healing power.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-8 card-hover group">
              <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Leaf className="w-10 h-10 text-primary-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-neutral-900">100% Natural</h3>
              <p className="text-neutral-600 leading-relaxed">
                Pure ingredients sourced directly from nature, completely free from harmful chemicals and synthetic additives.
              </p>
            </div>
            
            <div className="text-center p-8 card-hover group">
              <div className="w-20 h-20 bg-gradient-to-br from-secondary-100 to-secondary-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Award className="w-10 h-10 text-secondary-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-neutral-900">Certified Quality</h3>
              <p className="text-neutral-600 leading-relaxed">
                All products are rigorously tested and certified for purity, potency, and effectiveness by trusted laboratories.
              </p>
            </div>
            
            <div className="text-center p-8 card-hover group">
              <div className="w-20 h-20 bg-gradient-to-br from-sage-100 to-sage-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-10 h-10 text-sage-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-neutral-900">Safe & Gentle</h3>
              <p className="text-neutral-600 leading-relaxed">
                Gentle formulations carefully crafted to be suitable for all skin types, ages, and sensitivities.
              </p>
            </div>
            
            <div className="text-center p-8 card-hover group">
              <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-sage-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Heart className="w-10 h-10 text-primary-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-neutral-900">Holistic Wellness</h3>
              <p className="text-neutral-600 leading-relaxed">
                Products designed for complete mind, body, and soul wellness, following ancient Ayurvedic principles.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="section-padding bg-gradient-to-br from-neutral-50 to-sage-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6">
              Featured <span className="text-gradient">Products</span>
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
              Discover our most popular Ayurvedic beauty and wellness products, 
              carefully curated for your natural beauty journey.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((product, index) => (
                <div key={product.id} className="product-card p-6 group animate-fade-in" style={{animationDelay: `${index * 100}ms`}}>
                  <div className="aspect-w-1 aspect-h-1 mb-6 overflow-hidden rounded-2xl">
                    <img
                      src={product.image_url || 'https://via.placeholder.com/300x300/f3f4f6/9ca3af?text=No+Image'}
                      alt={product.name}
                      className="product-image"
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-neutral-900 group-hover:text-primary-600 transition-colors duration-200">
                      {product.name}
                    </h3>
                    <p className="text-neutral-600 text-sm line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                    <div className="rating">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="star" />
                      ))}
                      <span className="text-sm text-neutral-500 ml-2 font-medium">(4.8)</span>
                    </div>
                    <div className="flex items-center justify-between pt-4">
                      <span className="price">
                        ${product.price}
                      </span>
                      <div className="flex space-x-3">
                        <Link
                          to={`/products/${product.id}`}
                          className="btn-outline text-sm px-4 py-2"
                        >
                          View Details
                        </Link>
                        <button
                          onClick={() => handleAddToCart(product.id)}
                          className="btn-primary text-sm px-4 py-2 flex items-center space-x-2"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          <span>Add to Cart</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-16">
            <Link to="/products" className="btn-primary text-lg px-10 py-4 shadow-2xl">
              Explore All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="section-padding bg-gradient-to-br from-primary-600 via-primary-700 to-sage-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/90 via-primary-700/90 to-sage-600/90"></div>
        <div className="container-custom relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Stay Connected with Nature
          </h2>
          <p className="text-xl text-primary-100 mb-12 max-w-3xl mx-auto leading-relaxed">
            Subscribe to our newsletter and be the first to know about new products, 
            exclusive offers, wellness tips, and the latest in Ayurvedic beauty trends.
          </p>
          <div className="max-w-lg mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-6 py-4 rounded-full focus:outline-none focus:ring-2 focus:ring-white/50 text-neutral-900 placeholder-neutral-500"
              />
              <button className="bg-white text-primary-700 hover:bg-primary-50 font-semibold px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg">
                Subscribe
              </button>
            </div>
            <p className="text-primary-200 text-sm mt-4">
              Join over 10,000+ nature lovers who trust us for their wellness journey
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
