import React, { useState, useEffect, useRef } from 'react';
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
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true; // Prevent double-fetch in React 18 StrictMode (dev)
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
      <section className="overflow-hidden relative bg-gradient-hero section-padding">
        <div className="absolute inset-0 bg-gradient-to-br via-transparent from-primary-50/30 to-sage-50/30"></div>
        <div className="relative z-10 container-custom">
          <div className="mx-auto max-w-5xl text-center">
            <h1 className="mb-8 text-5xl font-bold leading-tight md:text-6xl lg:text-7xl text-neutral-900">
              Pure <span className="text-gradient">Ayurvedic</span><br />
              Beauty & Wellness
            </h1>
            <p className="mx-auto mb-12 max-w-4xl text-xl leading-relaxed md:text-2xl text-neutral-600">
              Discover the transformative power of nature with our premium collection of 
              <span className="font-semibold text-primary-600"> Ayurvedic beauty and wellness products</span>, 
              crafted with ancient wisdom and modern science for your holistic well-being.
            </p>
            <div className="flex flex-col gap-6 justify-center items-center sm:flex-row">
              <Link to="/products" className="px-10 py-4 text-lg shadow-2xl btn-primary">
                Explore Collection
              </Link>
              <button className="px-10 py-4 text-lg btn-outline">
                Our Story
              </button>
            </div>
            
            {/* Trust indicators */}
            <div className="grid grid-cols-2 gap-8 mx-auto mt-16 max-w-4xl md:grid-cols-4">
              <div className="text-center">
                <div className="mb-2 text-3xl font-bold text-primary-600">500+</div>
                <div className="text-sm font-medium text-neutral-600">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="mb-2 text-3xl font-bold text-primary-600">100%</div>
                <div className="text-sm font-medium text-neutral-600">Natural</div>
              </div>
              <div className="text-center">
                <div className="mb-2 text-3xl font-bold text-primary-600">5★</div>
                <div className="text-sm font-medium text-neutral-600">Rated</div>
              </div>
              <div className="text-center">
                <div className="mb-2 text-3xl font-bold text-primary-600">24/7</div>
                <div className="text-sm font-medium text-neutral-600">Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white section-padding">
        <div className="container-custom">
          <div className="mb-16 text-center">
            <h2 className="mb-6 text-4xl font-bold md:text-5xl text-neutral-900">
              Why Choose <span className="text-gradient">Pure Elements</span>?
            </h2>
            <p className="mx-auto max-w-3xl text-xl leading-relaxed text-neutral-600">
              We're committed to bringing you the finest Ayurvedic products with uncompromising 
              quality, authenticity, and a deep respect for nature's healing power.
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="p-8 text-center card-hover group">
              <div className="flex justify-center items-center mx-auto mb-6 w-20 h-20 bg-gradient-to-br rounded-2xl transition-transform duration-300 from-primary-100 to-primary-200 group-hover:scale-110">
                <Leaf className="w-10 h-10 text-primary-600" />
              </div>
              <h3 className="mb-4 text-2xl font-semibold text-neutral-900">100% Natural</h3>
              <p className="leading-relaxed text-neutral-600">
                Pure ingredients sourced directly from nature, completely free from harmful chemicals and synthetic additives.
              </p>
            </div>
            
            <div className="p-8 text-center card-hover group">
              <div className="flex justify-center items-center mx-auto mb-6 w-20 h-20 bg-gradient-to-br rounded-2xl transition-transform duration-300 from-secondary-100 to-secondary-200 group-hover:scale-110">
                <Award className="w-10 h-10 text-secondary-600" />
              </div>
              <h3 className="mb-4 text-2xl font-semibold text-neutral-900">Certified Quality</h3>
              <p className="leading-relaxed text-neutral-600">
                All products are rigorously tested and certified for purity, potency, and effectiveness by trusted laboratories.
              </p>
            </div>
            
            <div className="p-8 text-center card-hover group">
              <div className="flex justify-center items-center mx-auto mb-6 w-20 h-20 bg-gradient-to-br rounded-2xl transition-transform duration-300 from-sage-100 to-sage-200 group-hover:scale-110">
                <Shield className="w-10 h-10 text-sage-600" />
              </div>
              <h3 className="mb-4 text-2xl font-semibold text-neutral-900">Safe & Gentle</h3>
              <p className="leading-relaxed text-neutral-600">
                Gentle formulations carefully crafted to be suitable for all skin types, ages, and sensitivities.
              </p>
            </div>
            
            <div className="p-8 text-center card-hover group">
              <div className="flex justify-center items-center mx-auto mb-6 w-20 h-20 bg-gradient-to-br rounded-2xl transition-transform duration-300 from-primary-100 to-sage-100 group-hover:scale-110">
                <Heart className="w-10 h-10 text-primary-600" />
              </div>
              <h3 className="mb-4 text-2xl font-semibold text-neutral-900">Holistic Wellness</h3>
              <p className="leading-relaxed text-neutral-600">
                Products designed for complete mind, body, and soul wellness, following ancient Ayurvedic principles.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="bg-gradient-to-br section-padding from-neutral-50 to-sage-50">
        <div className="container-custom">
          <div className="mb-16 text-center">
            <h2 className="mb-6 text-4xl font-bold md:text-5xl text-neutral-900">
              Featured <span className="text-gradient">Products</span>
            </h2>
            <p className="mx-auto max-w-3xl text-xl leading-relaxed text-neutral-600">
              Discover our most popular Ayurvedic beauty and wellness products, 
              carefully curated for your natural beauty journey.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {featuredProducts.map((product, index) => (
                <div key={product.id} className="p-6 product-card group animate-fade-in" style={{animationDelay: `${index * 100}ms`}}>
                  <div className="overflow-hidden mb-6 rounded-2xl aspect-w-1 aspect-h-1">
                    <img
                      src={product.image_url || 'https://via.placeholder.com/300x300/f3f4f6/9ca3af?text=No+Image'}
                      alt={product.name}
                      className="product-image"
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold transition-colors duration-200 text-neutral-900 group-hover:text-primary-600">
                      {product.name}
                    </h3>
                    <p className="text-sm leading-relaxed text-neutral-600 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="rating">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="star" />
                      ))}
                      <span className="ml-2 text-sm font-medium text-neutral-500">(4.8)</span>
                    </div>
                    <div className="flex justify-between items-center pt-4">
                      <span className="price">
                        ₹{product.price}
                      </span>
                      <div className="flex space-x-3">
                        <Link
                          to={`/products/${product.id}`}
                          className="px-4 py-2 text-sm btn-outline"
                        >
                          View Details
                        </Link>
                        <button
                          onClick={() => handleAddToCart(product.id)}
                          className="flex items-center px-4 py-2 space-x-2 text-sm btn-primary"
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

          <div className="mt-16 text-center">
            <Link to="/products" className="px-10 py-4 text-lg shadow-2xl btn-primary">
              Explore All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="overflow-hidden relative bg-gradient-to-br section-padding from-primary-600 via-primary-700 to-sage-600">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/90 via-primary-700/90 to-sage-600/90"></div>
        <div className="relative z-10 text-center container-custom">
          <h2 className="mb-6 text-4xl font-bold text-white md:text-5xl">
            Stay Connected with Nature
          </h2>
          <p className="mx-auto mb-12 max-w-3xl text-xl leading-relaxed text-primary-100">
            Subscribe to our newsletter and be the first to know about new products, 
            exclusive offers, wellness tips, and the latest in Ayurvedic beauty trends.
          </p>
          <div className="mx-auto max-w-lg">
            <div className="flex flex-col gap-4 sm:flex-row">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-6 py-4 rounded-full focus:outline-none focus:ring-2 focus:ring-white/50 text-neutral-900 placeholder-neutral-500"
              />
              <button className="px-8 py-4 font-semibold bg-white rounded-full shadow-lg transition-all duration-300 transform text-primary-700 hover:bg-primary-50 hover:scale-105">
                Subscribe
              </button>
            </div>
            <p className="mt-4 text-sm text-primary-200">
              Join over 10,000+ nature lovers who trust us for their wellness journey
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
