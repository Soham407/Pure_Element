import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiService } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { ArrowLeft, Upload, X } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminProductForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    parent_category_id: '',
    category_id: ''
  });
  const [parentCategories, setParentCategories] = useState([]);
  const [childCategories, setChildCategories] = useState([]);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEdit);
  const [errors, setErrors] = useState({});

  

  const fetchParentCategories = async () => {
    try {
      const response = await apiService.admin.getParentCategories();
      setParentCategories(response.data.categories || []);
    } catch (error) {
      console.error('Failed to fetch parent categories:', error);
      toast.error('Failed to load parent categories');
    }
  };

  const fetchChildCategories = async (parentId) => {
    try {
      const response = await apiService.admin.getChildCategories(parentId);
      setChildCategories(response.data.categories || []);
    } catch (error) {
      console.error('Failed to fetch child categories:', error);
      toast.error('Failed to load child categories');
      setChildCategories([]);
    }
  };

  const fetchProduct = useCallback(async () => {
    try {
      const response = await apiService.products.getById(id);
      const product = response.data.product;
      
      // Get the category details to determine if it's a child category
      const categoryResponse = await apiService.admin.getCategories();
      const allCategories = categoryResponse.data.categories || [];
      const productCategory = allCategories.find(cat => cat.id === product.category_id);
      
      // Check if the product category is a child category (has parent_id)
      const isChildCategory = productCategory?.parent_id;
      
      setFormData({
        name: product.name,
        description: product.description || '',
        price: product.price.toString(),
        stock: product.stock.toString(),
        parent_category_id: isChildCategory ? productCategory.parent_id : product.category_id,
        category_id: isChildCategory ? product.category_id : ''
      });
      
      // If it's a child category, fetch child categories for the parent
      if (isChildCategory) {
        await fetchChildCategories(productCategory.parent_id);
      }
      
      setImagePreview(product.image_url);
    } catch (error) {
      console.error('Failed to fetch product:', error);
      toast.error('Failed to load product');
      navigate('/admin');
    } finally {
      setInitialLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchParentCategories();
    if (isEdit) {
      fetchProduct();
    }
  }, [id, isEdit, fetchProduct]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'parent_category_id') {
      // When parent category changes, reset child category and fetch new child categories
      setFormData(prev => ({
        ...prev,
        parent_category_id: value,
        category_id: '' // Reset child category
      }));
      
      if (value) {
        fetchChildCategories(value);
      } else {
        setChildCategories([]);
      }
    } else if (name === 'category_id') {
      // When child category changes, update the form data
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Image size should be less than 5MB');
        return;
      }
      
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview('');
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (!formData.price || isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Valid price is required';
    }

    if (!formData.stock || isNaN(formData.stock) || parseInt(formData.stock) < 0) {
      newErrors.stock = 'Valid stock quantity is required';
    }

    // Category validation: parent category is mandatory
    if (!formData.parent_category_id) {
      newErrors.parent_category_id = 'Parent category is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);

    try {
      let imageUrl = imagePreview;

      // Upload image if new image is selected
      if (image) {
        const imageFormData = new FormData();
        imageFormData.append('image', image);
        
        const uploadResponse = await apiService.admin.uploadImage(imageFormData);
        imageUrl = uploadResponse.data.imageUrl;
      }

      // Use child category if selected, otherwise use parent category
      const categoryId = formData.category_id || formData.parent_category_id;
      
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        categoryId: categoryId,
        imageUrl: imageUrl
      };

      if (isEdit) {
        await apiService.admin.updateProduct(id, productData);
        toast.success('Product updated successfully!');
      } else {
        await apiService.admin.createProduct(productData);
        toast.success('Product created successfully!');
      }

      navigate('/admin');
    } catch (error) {
      console.error('Failed to save product:', error);
      toast.error(error.response?.data?.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/admin')}
            className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEdit ? 'Edit Product' : 'Add New Product'}
          </h1>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Product Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Product Name *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className={`input-field ${errors.name ? 'border-red-500' : ''}`}
                placeholder="Enter product name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter product description"
              />
            </div>

            {/* Price and Stock */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                  Price ($) *
                </label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  className={`input-field ${errors.price ? 'border-red-500' : ''}`}
                  placeholder="0.00"
                />
                {errors.price && (
                  <p className="mt-1 text-sm text-red-600">{errors.price}</p>
                )}
              </div>

              <div>
                <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
                  Stock Quantity *
                </label>
                <input
                  id="stock"
                  name="stock"
                  type="number"
                  value={formData.stock}
                  onChange={handleChange}
                  className={`input-field ${errors.stock ? 'border-red-500' : ''}`}
                  placeholder="0"
                />
                {errors.stock && (
                  <p className="mt-1 text-sm text-red-600">{errors.stock}</p>
                )}
              </div>
            </div>

            {/* Category */}
            <div>
              <label htmlFor="parent_category_id" className="block text-sm font-medium text-gray-700 mb-1">
                Parent Category *
              </label>
              <select
                id="parent_category_id"
                name="parent_category_id"
                value={formData.parent_category_id}
                onChange={handleChange}
                className={`input-field ${errors.parent_category_id ? 'border-red-500' : ''}`}
              >
                <option value="">Select a parent category</option>
                {parentCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-sm text-gray-500">
                Select a parent category to enable child category selection
              </p>
              {errors.parent_category_id && (
                <p className="mt-1 text-sm text-red-600">{errors.parent_category_id}</p>
              )}
            </div>

            <div>
              <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-1">
                Child Category (Optional)
              </label>
              <select
                id="category_id"
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                disabled={!formData.parent_category_id}
                className={`input-field ${errors.category_id ? 'border-red-500' : ''} ${!formData.parent_category_id ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              >
                <option value="">{formData.parent_category_id ? 'Select a child category (optional)' : 'Select a parent category first'}</option>
                {childCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-sm text-gray-500">
                {formData.parent_category_id 
                  ? 'Select a child category for more specific categorization, or leave empty to assign to the parent category'
                  : 'Child categories will be available after selecting a parent category'
                }
              </p>
              {errors.category_id && (
                <p className="mt-1 text-sm text-red-600">{errors.category_id}</p>
              )}
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Image
              </label>
              
              {imagePreview ? (
                <div className="relative inline-block">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-2">
                    <label htmlFor="image" className="cursor-pointer">
                      <span className="text-primary-600 hover:text-primary-700 font-medium">
                        Upload an image
                      </span>
                      <input
                        id="image"
                        name="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="sr-only"
                      />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => navigate('/admin')}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading && <LoadingSpinner size="sm" />}
                  <span>{isEdit ? 'Update Product' : 'Create Product'}</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminProductForm;
