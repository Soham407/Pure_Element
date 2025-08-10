import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      setCart(null);
    }
  }, [isAuthenticated, user]);

  const fetchCart = async () => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      const response = await apiService.cart.get();
      setCart(response.data.cart);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
      setCart({ cart_items: [], total: 0 });
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return { success: false };
    }

    try {
      await apiService.cart.add(productId, quantity);
      await fetchCart();
      toast.success('Item added to cart!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to add item to cart';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const updateCartItem = async (itemId, quantity) => {
    if (!isAuthenticated) return { success: false };

    try {
      await apiService.cart.update(itemId, quantity);
      await fetchCart();
      toast.success('Cart updated!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to update cart item';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const removeFromCart = async (itemId) => {
    if (!isAuthenticated) return { success: false };

    try {
      await apiService.cart.remove(itemId);
      await fetchCart();
      toast.success('Item removed from cart!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to remove item from cart';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const clearCart = async () => {
    if (!isAuthenticated) return { success: false };

    try {
      await apiService.cart.clear();
      await fetchCart();
      toast.success('Cart cleared!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to clear cart';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const getCartItemCount = () => {
    if (!cart || !cart.cart_items) return 0;
    return cart.cart_items.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartTotal = () => {
    return cart?.total || 0;
  };

  const isInCart = (productId) => {
    if (!cart || !cart.cart_items) return false;
    return cart.cart_items.some(item => item.products.id === productId);
  };

  const getCartItemQuantity = (productId) => {
    if (!cart || !cart.cart_items) return 0;
    const item = cart.cart_items.find(item => item.products.id === productId);
    return item ? item.quantity : 0;
  };

  const value = {
    cart,
    loading,
    fetchCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    getCartItemCount,
    getCartTotal,
    isInCart,
    getCartItemQuantity
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
