import React from 'react';
import { Star } from 'lucide-react';

const StarRating = ({ 
  rating = 0, 
  onRatingChange = null, 
  size = 'md', 
  showValue = false, 
  disabled = false,
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8'
  };

  const handleStarClick = (starRating) => {
    if (!disabled && onRatingChange) {
      onRatingChange(starRating);
    }
  };

  const handleMouseEnter = (starRating) => {
    if (!disabled && onRatingChange) {
      // Optional: Add hover effect for interactive ratings
    }
  };

  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = star <= rating;
        const isInteractive = !disabled && onRatingChange;
        
        return (
          <button
            key={star}
            type="button"
            onClick={() => handleStarClick(star)}
            onMouseEnter={() => handleMouseEnter(star)}
            disabled={disabled}
            className={`
              ${sizeClasses[size]}
              ${isInteractive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}
              ${disabled ? 'cursor-not-allowed opacity-50' : ''}
            `}
          >
            <Star
              className={`
                ${sizeClasses[size]}
                ${isFilled ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                ${isInteractive ? 'hover:text-yellow-300' : ''}
                transition-colors duration-150
              `}
            />
          </button>
        );
      })}
      {showValue && (
        <span className="ml-2 text-sm text-gray-600">
          {rating > 0 ? rating.toFixed(1) : 'No rating'}
        </span>
      )}
    </div>
  );
};

export default StarRating;
