import React from 'react';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }
    await addToCart(product.id, 1);
  };

  const bgImage = product.image_url || 'https://via.placeholder.com/400x400/f3f4f6/9ca3af?text=No+Image';

  return (
    <div
      className="relative flex flex-col border bg-white shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden group cursor-pointer"
      style={{ minWidth: 0 }}
    >
      {/* Image Section as Background with Padding */}
      <div className="w-full p-4 box-border">
        <div
          className="w-full aspect-square bg-center bg-cover"
          style={{ backgroundImage: `url('${bgImage}')` }}
        />
      </div>
      {/* Content Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-4 text-center">
        <h3 className="font-bold text-lg text-neutral-900 mb-1 truncate w-full" title={product.name}>{product.name}</h3>
        <div className="text-sm text-neutral-500 mb-2 truncate w-full" title={product.subtitle}>{product.subtitle}</div>
        <div className="text-lg text-[#525f48] mb-4">₹{product.price}</div>
      </div>
      {/* Add to Cart Button with Margin and Padding, no w-full */}
      <button
        className="mt-auto bg-[#9ba97b] text-white uppercase font-semibold px-6 py-3 tracking-wider transition-all duration-200 hover:bg-[#7d8b5e] focus:outline-none focus:ring-2 focus:ring-[#9ba97b] mx-4 mb-4"
        onClick={handleAddToCart}
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;
