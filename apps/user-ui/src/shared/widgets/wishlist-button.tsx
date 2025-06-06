'use client';

import { Heart } from 'lucide-react';
import type React from 'react';

interface WishlistButtonProps {
  count: number;
  onClick: () => void;
}

const WishlistButton: React.FC<WishlistButtonProps> = ({ count, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="relative p-2 rounded-lg hover:bg-gray-50 focus:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300 group"
      aria-label={`Wishlist with ${count} items`}
    >
      <Heart
        size={24}
        className="text-gray-600 group-hover:text-red-500 transition-colors"
        strokeWidth={1.5}
      />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </button>
  );
};

export default WishlistButton;
