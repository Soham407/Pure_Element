import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import StarRating from '../components/common/StarRating';
import { ShoppingCart, ArrowLeft, Plus, Minus, MessageSquare, User, Calendar, X, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 0,
    comment: ''
  });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [galleryImages, setGalleryImages] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const fetchProduct = useCallback(async () => {
    try {
      const response = await apiService.products.getById(id);
      setProduct(response.data.product);
      
      // Fetch gallery images
      try {
        const galleryResponse = await apiService.products.getImages(id);
        const images = galleryResponse.data.images || [];
        setGalleryImages(images);
      } catch (galleryError) {
        console.error('Failed to fetch gallery images:', galleryError);
        // Don't fail the whole page if gallery images fail to load
        setGalleryImages([]);
      }
    } catch (error) {
      console.error('Failed to fetch product:', error);
      toast.error('Product not found');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  const fetchReviews = useCallback(async () => {
    try {
      setReviewsLoading(true);
      const response = await apiService.reviews.getByProduct(id);
      setReviews(response.data.reviews);
      setAverageRating(response.data.averageRating);
      setTotalReviews(response.data.totalReviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setReviewsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
    fetchReviews();
  }, [fetchProduct, fetchReviews]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error('Please login to submit a review');
      return;
    }

    if (reviewForm.rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    try {
      setSubmittingReview(true);
      await apiService.reviews.create(id, reviewForm);
      toast.success('Review submitted successfully!');
      setReviewForm({ rating: 0, comment: '' });
      setShowReviewForm(false);
      fetchReviews(); // Refresh reviews
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error(error.response?.data?.error || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleReviewFormChange = (field, value) => {
    setReviewForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }
    await addToCart(product.id, quantity);
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  // Image gallery functions
  const getAllImages = () => {
    const images = [];
    if (product?.thumbnail_url) {
      images.push({ url: product.thumbnail_url, isThumbnail: true });
    }
    galleryImages.forEach(img => {
      images.push({ url: img.image_url, isThumbnail: false });
    });
    return images;
  };

  const handleImageSelect = (index) => {
    setSelectedImageIndex(index);
  };

  const handleImageClick = () => {
    setShowImageModal(true);
  };

  const handleNextImage = () => {
    const allImages = getAllImages();
    setSelectedImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const handlePrevImage = () => {
    const allImages = getAllImages();
    setSelectedImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const handleCloseImageModal = () => {
    setShowImageModal(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h2>
          <button onClick={() => navigate('/products')} className="btn-primary">
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/products')}
          className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Products</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div 
              className="bg-white rounded-lg overflow-hidden shadow-lg cursor-pointer flex items-center justify-center min-h-[400px] max-h-[600px] w-full" 
              onClick={handleImageClick}
            >
              {(() => {
                const allImages = getAllImages();
                const currentImage = allImages[selectedImageIndex] || { url: product.thumbnail_url || 'https://via.placeholder.com/600x600/f3f4f6/9ca3af?text=No+Image' };
                return (
                  <img
                    src={currentImage.url}
                    alt={product.name}
                    className="max-w-full max-h-full w-auto h-auto object-contain hover:scale-105 transition-transform duration-300"
                    style={{ minHeight: '300px', minWidth: '200px' }}
                  />
                );
              })()}
            </div>

            {/* Image Thumbnails */}
            {(() => {
              const allImages = getAllImages();
              if (allImages.length > 1) {
                return (
                  <div className="flex space-x-2 overflow-x-auto pb-2">
                    {allImages.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => handleImageSelect(index)}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 flex items-center justify-center bg-gray-100 ${
                          selectedImageIndex === index
                            ? 'border-primary-500 ring-2 ring-primary-200'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <img
                          src={image.url}
                          alt={`${product.name} ${index + 1}`}
                          className="max-w-full max-h-full w-auto h-auto object-contain"
                        />
                      </button>
                    ))}
                  </div>
                );
              }
              return null;
            })()}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <div className="flex items-center space-x-2 mb-4">
                <StarRating 
                  rating={averageRating} 
                  size="md" 
                  showValue={true}
                  disabled={true}
                />
                <span className="text-gray-600">
                  ({totalReviews} review{totalReviews !== 1 ? 's' : ''})
                </span>
              </div>
              <p className="text-4xl font-bold text-primary-600 mb-4">₹{product.price}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">
                {product.description || 'No description available.'}
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Category</h3>
              <span className="inline-block bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm">
                {product.categories?.name}
              </span>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Availability</h3>
              <div className="flex items-center space-x-2">
                {product.stock > 0 ? (
                  <>
                    <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                    <span className="text-green-600 font-medium">In Stock ({product.stock} available)</span>
                  </>
                ) : (
                  <>
                    <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                    <span className="text-red-600 font-medium">Out of Stock</span>
                  </>
                )}
              </div>
            </div>

            {product.stock > 0 && (
              <div className="space-y-4">
                {/* Quantity Selector */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Quantity</h3>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      className="p-2 rounded-full border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-xl font-medium w-12 text-center">{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= product.stock}
                      className="p-2 rounded-full border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  className="w-full btn-primary text-lg py-4 flex items-center justify-center space-x-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Add to Cart - ₹{(product.price * quantity).toFixed(2)}</span>
                </button>
              </div>
            )}

            {/* Product Features */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Features</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• 100% Natural Ayurvedic ingredients</li>
                <li>• No harmful chemicals or preservatives</li>
                <li>• Suitable for all skin types</li>
                <li>• Cruelty-free and eco-friendly</li>
                <li>• Traditional formulation with modern science</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16">
          <div className="border-t border-gray-200 pt-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <MessageSquare className="w-6 h-6 mr-2" />
                Customer Reviews
              </h2>
              {isAuthenticated && (
                <button
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="btn-primary"
                >
                  Write a Review
                </button>
              )}
            </div>

            {/* Review Form */}
            {showReviewForm && (
              <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Write Your Review</h3>
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rating *
                    </label>
                    <StarRating
                      rating={reviewForm.rating}
                      onRatingChange={(rating) => handleReviewFormChange('rating', rating)}
                      size="lg"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Comment
                    </label>
                    <textarea
                      value={reviewForm.comment}
                      onChange={(e) => handleReviewFormChange('comment', e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Share your experience with this product..."
                    />
                  </div>

                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      disabled={submittingReview}
                      className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submittingReview ? 'Submitting...' : 'Submit Review'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowReviewForm(false)}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Reviews List */}
            {reviewsLoading ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner size="md" />
              </div>
            ) : reviews.length > 0 ? (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-primary-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {review.user.email.split('@')[0]}
                          </p>
                          <div className="flex items-center space-x-2">
                            <StarRating 
                              rating={review.rating} 
                              size="sm" 
                              disabled={true}
                            />
                            <span className="text-sm text-gray-500 flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {formatDate(review.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {review.comment && (
                      <p className="text-gray-700 leading-relaxed">
                        {review.comment}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
                <p className="text-gray-600">
                  Be the first to review this product and help other customers make their decision.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Image Modal */}
        {showImageModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90" onClick={handleCloseImageModal}>
            <div className="relative max-w-4xl max-h-[90vh] w-full mx-4">
              {/* Close Button */}
              <button
                onClick={handleCloseImageModal}
                className="absolute top-4 right-4 z-10 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-all duration-200"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Navigation Buttons */}
              {(() => {
                const allImages = getAllImages();
                if (allImages.length > 1) {
                  return (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePrevImage();
                        }}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-all duration-200"
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNextImage();
                        }}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-all duration-200"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>
                    </>
                  );
                }
                return null;
              })()}

              {/* Main Image */}
              <div className="flex items-center justify-center h-full w-full" onClick={(e) => e.stopPropagation()}>
                {(() => {
                  const allImages = getAllImages();
                  const currentImage = allImages[selectedImageIndex] || { url: product.thumbnail_url || 'https://via.placeholder.com/600x600/f3f4f6/9ca3af?text=No+Image' };
                  return (
                    <img
                      src={currentImage.url}
                      alt={product.name}
                      className="max-w-full max-h-full w-auto h-auto object-contain"
                      style={{ minHeight: '200px', minWidth: '150px' }}
                    />
                  );
                })()}
              </div>

              {/* Image Counter */}
              {(() => {
                const allImages = getAllImages();
                if (allImages.length > 1) {
                  return (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                      {selectedImageIndex + 1} / {allImages.length}
                    </div>
                  );
                }
                return null;
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
