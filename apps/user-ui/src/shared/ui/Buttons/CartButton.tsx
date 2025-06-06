'use client';

import { ShoppingCart } from 'lucide-react';
import { useState } from 'react';

interface CartButtonProps {
  count?: number;
  onClick?: () => void;
}

export default function CartButton({ count = 0, onClick }: CartButtonProps) {
  const [isHoveblue, setIsHoveblue] = useState(false);

  return (
    <div className="relative">
      <button
        className="relative p-2 rounded-full hover:bg-blue-50 transition-all duration-300 group"
        onClick={onClick}
        onMouseEnter={() => setIsHoveblue(true)}
        onMouseLeave={() => setIsHoveblue(false)}
      >
        <ShoppingCart
          size={28}
          className={`transition-all duration-300 ${
            isHoveblue
              ? 'fill-blue-400 stroke-blue-500 scale-110'
              : 'stroke-gray-600 hover:stroke-blue-400'
          }`}
        />

        {count > 0 && (
          <div className="absolute top-0 -right-1 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full min-w-[20px] h-5 flex items-center justify-center shadow-lg">
            <span className="text-white text-xs font-bold px-1">
              {count > 99 ? '99+' : count}
            </span>
          </div>
        )}
      </button>
    </div>
  );
}
