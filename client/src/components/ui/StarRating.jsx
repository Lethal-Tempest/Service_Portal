import React from 'react';
import { Star } from 'lucide-react';

export const StarRating = ({
  rating,
  maxRating = 5,
  size = 'md',
  showRating = false,
  interactive = false,
  onRatingChange
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const handleStarClick = (starRating) => {
    if (interactive && onRatingChange) {
      onRatingChange(starRating);
    }
  };

  const renderStars = () => {
    const stars = [];

    for (let i = 1; i <= maxRating; i++) {
      const isFilled = i <= rating;
      const isHalfFilled = i - 0.5 <= rating && i > rating;

      stars.push(
        <div key={i} className="relative">
          <Star
            className={`${sizeClasses[size]} ${
              interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''
            } text-gray-300`}
            onClick={() => handleStarClick(i)}
          />
          {(isFilled || isHalfFilled) && (
            <Star
              className={`${sizeClasses[size]} absolute top-0 left-0 text-warning ${
                interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''
              }`}
              fill="currentColor"
              style={{
                clipPath: isHalfFilled ? 'inset(0 50% 0 0)' : 'none'
              }}
              onClick={() => handleStarClick(i)}
            />
          )}
        </div>
      );
    }

    return stars;
  };

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {renderStars()}
      </div>
      {showRating && (
        <span className={`ml-2 font-medium text-muted-foreground ${textSizeClasses[size]}`}>
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};
