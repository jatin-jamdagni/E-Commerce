"use client"

import { Heart } from "lucide-react"
import { useState } from "react"

interface WishlistButtonProps {
  count?: number
  onClick?: () => void
}

export default function WishlistButton({ count = 0, onClick }: WishlistButtonProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="relative">
      <button
        className="relative p-2 rounded-full hover:bg-red-50 transition-all duration-300 group"
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Heart
          size={28}
          className={`transition-all duration-300 ${
            isHovered ? "fill-red-400 stroke-red-500 scale-110" : "stroke-gray-600 hover:stroke-red-400"
          }`}
        />

        {count > 0 && (
          <div className="absolute top-0 -right-1 bg-gradient-to-r from-red-400 to-red-500 rounded-full min-w-[20px] h-5 flex items-center justify-center shadow-lg">
            <span className="text-white text-xs font-bold px-1">{count > 99 ? "99+" : count}</span>
          </div>
        )}
      </button>
    </div>
  )
}
