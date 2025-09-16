import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, ShoppingCart, Star, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';
import toast from 'react-hot-toast';

const QuickViewModal = ({ product, isOpen, onClose }) => {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [galleryImages, setGalleryImages] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Fetch gallery images when modal opens
  useEffect(() => {
    if (isOpen && product?.id) {
      const fetchGalleryImages = async () => {
        try {
          const response = await apiService.products.getImages(product.id);
          const images = response.data.images || [];
          setGalleryImages(images);
        } catch (error) {
          console.error('Failed to fetch gallery images:', error);
          setGalleryImages([]);
        }
      };
      fetchGalleryImages();
    }
  }, [isOpen, product?.id]);

  if (!isOpen || !product) return null;

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }
    await addToCart(product.id, 1);
    onClose();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
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

  const handleNextImage = () => {
    const allImages = getAllImages();
    setSelectedImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const handlePrevImage = () => {
    const allImages = getAllImages();
    setSelectedImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Quick View</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Image Gallery */}
            <div className="space-y-3">
              {/* Main Image */}
              <div className="relative flex items-center justify-center min-h-[300px] max-h-[400px] w-full bg-gray-50 rounded-lg">
                {(() => {
                  const allImages = getAllImages();
                  const currentImage = allImages[selectedImageIndex] || { url: product.thumbnail_url || 'https://via.placeholder.com/400x400/f3f4f6/9ca3af?text=No+Image' };
                  return (
                    <img
                      src={currentImage.url}
                      alt={product.name}
                      className="max-w-full max-h-full w-auto h-auto object-contain rounded-lg"
                      style={{ minHeight: '200px', minWidth: '150px' }}
                    />
                  );
                })()}
                
                {/* Navigation arrows for multiple images */}
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
                          className="absolute left-2 top-1/2 transform -translate-y-1/2 p-1 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-all duration-200"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleNextImage();
                          }}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-all duration-200"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </>
                    );
                  }
                  return null;
                })()}
              </div>

              {/* Image Thumbnails */}
              {(() => {
                const allImages = getAllImages();
                if (allImages.length > 1) {
                  return (
                    <div className="flex space-x-2 overflow-x-auto pb-1">
                      {allImages.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => handleImageSelect(index)}
                          className={`flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden border-2 transition-all duration-200 flex items-center justify-center bg-gray-100 ${
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

            {/* Product Details */}
            <div className="space-y-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {product.name}
                </h3>
                <div className="flex items-center space-x-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current text-yellow-400" />
                  ))}
                  <span className="text-sm text-gray-500 ml-2">(4.8)</span>
                </div>
                <p className="text-3xl font-bold text-primary-600 mb-4">
                  ${product.price}
                </p>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Description</h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {product.description}
                </p>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Category</h4>
                <span className="inline-block bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full">
                  {product.categories?.name || 'Uncategorized'}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  onClick={handleAddToCart}
                  className="btn-primary flex items-center justify-center space-x-2 py-3 px-6"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Add to Cart</span>
                </button>
                <Link
                  to={`/products/${product.id}`}
                  onClick={onClose}
                  className="btn-outline flex items-center justify-center space-x-2 py-3 px-6"
                >
                  <Eye className="w-5 h-5" />
                  <span>View Full Details</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;
