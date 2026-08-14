import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { useFavourites } from '../hooks/useFavourites';

interface FavouriteButtonProps {
  songId: number;
  className?: string;
  size?: number;
  showLabel?: boolean;
}

export const FavouriteButton: React.FC<FavouriteButtonProps> = ({
  songId,
  className = '',
  size = 18,
  showLabel = false,
}) => {
  const { isFavourite, toggleFavourite } = useFavourites();
  const liked = isFavourite(songId);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAnimating(true);
    toggleFavourite(songId);
    setTimeout(() => setIsAnimating(false), 350);
  };

  return (
    <button
      onClick={handleClick}
      className={`group/fav relative inline-flex items-center gap-1.5 p-1.5 rounded-full text-[#F1D7A3]/80 hover:text-[#B9472F] transition-colors focus:outline-none cursor-pointer ${className}`}
      title={liked ? 'Favourite ❤️ (Click to remove)' : 'Not Favourite ♡ (Click to save)'}
      aria-label={liked ? 'Remove from favourites' : 'Add to favourites'}
    >
      <Heart
        size={size}
        className={`transition-all duration-300 transform ${
          liked
            ? 'fill-[#B9472F] text-[#B9472F] scale-110'
            : 'text-[#F1D7A3]/70 hover:text-[#B9472F] hover:scale-110'
        } ${isAnimating && liked ? 'animate-heart-pulse' : ''}`}
      />
      {showLabel && (
        <span className="text-xs font-mono tracking-wider">
          {liked ? 'Favourite ❤️' : 'Favourite ♡'}
        </span>
      )}
    </button>
  );
};
