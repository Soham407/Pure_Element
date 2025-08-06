import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const apiService = {
  // Generic methods
  get: (url, config = {}) => apiClient.get(url, config),
  post: (url, data, config = {}) => apiClient.post(url, data, config),
  put: (url, data, config = {}) => apiClient.put(url, data, config),
  delete: (url, config = {}) => apiClient.delete(url, config),
  patch: (url, data, config = {}) => apiClient.patch(url, data, config),

  // Auth endpoints
  auth: {
    login: (email, password) => apiClient.post('/auth/login', { email, password }),
    register: (email, password, role) => apiClient.post('/auth/register', { email, password, role }),
    getProfile: () => apiClient.get('/auth/me'),
  },

  // Product endpoints
  products: {
    getAll: () => apiClient.get('/products'),
    getById: (id) => apiClient.get(`/products/${id}`),
    getByCategory: (categoryId) => apiClient.get(`/products/category/${categoryId}`),
    search: (query) => apiClient.get(`/products/search/${query}`),
  },

  // Category endpoints
  categories: {
    getAll: () => apiClient.get('/categories'),
    getWithCounts: () => apiClient.get('/categories/with-counts'),
  },

  // Cart endpoints
  cart: {
    get: () => apiClient.get('/cart'),
    add: (productId, quantity) => apiClient.post('/cart/add', { productId, quantity }),
    update: (itemId, quantity) => apiClient.put(`/cart/update/${itemId}`, { quantity }),
    remove: (itemId) => apiClient.delete(`/cart/remove/${itemId}`),
    clear: () => apiClient.delete('/cart/clear'),
  },

  // Profile endpoints
  profile: {
    update: (data) => apiClient.put('/profile', data),
    getOrders: () => apiClient.get('/profile/orders'),
  },

  // Admin endpoints
  admin: {
    // Products
    getProducts: () => apiClient.get('/admin/products'),
    createProduct: (data) => apiClient.post('/admin/products', data),
    updateProduct: (id, data) => apiClient.put(`/admin/products/${id}`, data),
    deleteProduct: (id) => apiClient.delete(`/admin/products/${id}`),
    
    // Categories
    getCategories: () => apiClient.get('/admin/categories'),
    createCategory: (name) => apiClient.post('/admin/categories', { name }),
    updateCategory: (id, data) => apiClient.put(`/admin/categories/${id}`, data),
    deleteCategory: (id) => apiClient.delete(`/admin/categories/${id}`),
    
    // Users
    getUsers: () => apiClient.get('/admin/users'),
    updateUser: (id, data) => apiClient.put(`/admin/users/${id}`, data),
    deleteUser: (id) => apiClient.delete(`/admin/users/${id}`),
    
    // Dashboard stats
    getDashboardStats: () => apiClient.get('/admin/dashboard/stats'),
    
    // Image upload
    uploadImage: (formData) => apiClient.post('/admin/upload-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  },
};

export default apiService;
