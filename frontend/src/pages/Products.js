import React, { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { apiService } from '../services/api';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import QuickViewModal from '../components/QuickViewModal';
import ProductCard from '../components/common/ProductCard';
import { 
  ShoppingCart, 
  Star, 
  Filter, 
  Search, 
  Grid, 
  List,
  Eye
} from 'lucide-react';
import toast from 'react-hot-toast';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const fetchCategories = async () => {
    try {
      const response = await apiService.categories.getAll();
      setCategories(response.data.categories);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      let response;
      
      if (selectedCategory) {
        response = await apiService.products.getByCategory(selectedCategory);
      } else {
        response = await apiService.products.getAll();
      }
      
      setProducts(response.data.products);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [selectedCategory]);

  useEffect(() => {
    fetchCategories();
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      fetchProducts();
      return;
    }

    try {
      setLoading(true);
      const response = await apiService.products.search(searchQuery);
      setProducts(response.data.products);
    } catch (error) {
      console.error('Search failed:', error);
      toast.error('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setSearchQuery('');
    if (categoryId) {
      setSearchParams({ category: categoryId });
    } else {
      setSearchParams({});
    }
  };

  const handleAddToCart = async (productId) => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }
    await addToCart(productId, 1);
  };

  const handleQuickView = (product) => {
    setQuickViewProduct(product);
    setIsQuickViewOpen(true);
  };

  const handleCloseQuickView = () => {
    setIsQuickViewOpen(false);
    setQuickViewProduct(null);
  };

  const sortedProducts = [...products].sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy) {
      case 'price':
        aValue = parseFloat(a.price);
        bValue = parseFloat(b.price);
        break;
      case 'name':
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case 'created_at':
        aValue = new Date(a.created_at);
        bValue = new Date(b.created_at);
        break;
      default:
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const selectedCategoryName = categories.find(cat => cat.id === selectedCategory)?.name || 'All Products';

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-sage-50">
      <div className="container-custom py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
            {selectedCategoryName}
          </h1>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
            Discover our premium collection of Ayurvedic beauty and wellness products, 
            carefully curated for your natural beauty journey.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="card-elevated p-8 mb-12">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search for natural beauty products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-24 py-4 border border-neutral-200 rounded-full focus:ring-2 focus:ring-primary-500 focus:outline-none focus:border-primary-500 bg-neutral-50 transition-all duration-200"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 btn-primary text-sm px-6 py-2"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Filter Toggle (Mobile) */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden btn-outline flex items-center space-x-2 px-6 py-4"
            >
              <Filter className="w-5 h-5" />
              <span>Filters</span>
            </button>
          </div>

          {/* Filters */}
          <div className={`mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${showFilters ? 'block' : 'hidden lg:grid'}`}>
            {/* Category Filter */}
            <div>
              <label className="block text-lg font-semibold text-neutral-700 mb-3">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 font-medium"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-lg font-semibold text-neutral-700 mb-3">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 font-medium"
              >
                <option value="name">Name</option>
                <option value="price">Price</option>
                <option value="created_at">Newest</option>
              </select>
            </div>

            {/* Sort Order */}
            <div>
              <label className="block text-lg font-semibold text-neutral-700 mb-3">Order</label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 font-medium"
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>

            {/* View Mode */}
            <div>
              <label className="block text-lg font-semibold text-neutral-700 mb-3">View</label>
              <div className="flex space-x-3">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                    viewMode === 'grid' 
                      ? 'bg-primary-600 text-white border-primary-600 shadow-lg' 
                      : 'bg-white text-neutral-600 border-neutral-200 hover:border-primary-300'
                  }`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                    viewMode === 'list' 
                      ? 'bg-primary-600 text-white border-primary-600 shadow-lg' 
                      : 'bg-white text-neutral-600 border-neutral-200 hover:border-primary-300'
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex justify-between items-center mb-8">
          <p className="text-lg text-neutral-600 font-medium">
            Showing <span className="text-primary-600 font-bold">{sortedProducts.length}</span> products
          </p>
          <button
            onClick={() => {
              setSelectedCategory('');
              setSearchQuery('');
              setSearchParams({});
            }}
            className="text-primary-600 hover:text-primary-700 text-lg font-medium transition-colors duration-200"
          >
            Clear all filters
          </button>
        </div>

        {/* Products Grid/List */}
        {loading ? (
          <div className="flex justify-center py-16">
            <LoadingSpinner size="lg" />
          </div>
        ) : sortedProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-32 h-32 bg-gradient-to-br from-primary-100 to-sage-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-16 h-16 text-primary-400" />
            </div>
            <h3 className="text-2xl font-semibold text-neutral-900 mb-4">No products found</h3>
            <p className="text-lg text-neutral-600 mb-8 max-w-md mx-auto">
              Try adjusting your search or filter criteria to find what you're looking for
            </p>
            <button
              onClick={() => {
                setSelectedCategory('');
                setSearchQuery('');
                setSearchParams({});
              }}
              className="btn-primary text-lg px-8 py-4"
            >
              View All Products
            </button>
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'
            : 'space-y-6'
          }>
            {sortedProducts.map((product, index) => (
              viewMode === 'grid' ? (
                <ProductCard key={product.id} product={product} />
              ) : (
                <div
                  key={product.id}
                  className="product-card p-6 flex flex-col md:flex-row gap-6 group animate-fade-in"
                  style={{animationDelay: `${index * 100}ms`}}
                >
                  {/* Clickable Product Image */}
                  <Link 
                    to={`/products/${product.id}`}
                    className="w-full md:w-48 flex-shrink-0 hover:opacity-90 transition-opacity duration-200"
                  >
                    <img
                      src={product.thumbnail_url || 'https://via.placeholder.com/300x300/f3f4f6/9ca3af?text=No+Image'}
                      alt={product.name}
                      className="w-full h-48 md:h-full object-cover rounded-2xl"
                    />
                  </Link>
                  <div className="flex-1 space-y-4">
                    <div className="flex items-start justify-between">
                      <Link 
                        to={`/products/${product.id}`}
                        className="text-xl font-semibold text-neutral-900 group-hover:text-primary-600 transition-colors duration-200 hover:text-primary-600"
                      >
                        {product.name}
                      </Link>
                      <span className="price">
                        ₹{product.price}
                      </span>
                    </div>
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
                      <span className="text-sm text-neutral-500 font-medium">
                        Category: {product.categories?.name}
                      </span>
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleQuickView(product)}
                          className="btn-outline text-sm px-4 py-2 flex items-center space-x-2"
                        >
                          <Eye className="w-4 h-4" />
                          <span>Quick View</span>
                        </button>
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
              )
            ))}
          </div>
        )}
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={isQuickViewOpen}
        onClose={handleCloseQuickView}
      />
    </div>
  );
};

export default Products;
