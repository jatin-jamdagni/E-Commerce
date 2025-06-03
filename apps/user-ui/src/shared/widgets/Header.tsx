'use client';
import React, { useState } from 'react';
import { CircleUserRound, Search } from 'lucide-react';
 import WishlistButton from './WishlistButton';
import CartButton from './CartButton';

import dynamic from 'next/dynamic';
const DynamicLogo = dynamic(() => import('./Logo'), {
  loading: () => <p>Loading...</p>,
})

const Header = () => {
  const [wishlistCount, setWishlistCount] = useState(3);

  const handleWishlistClick = () => {
    setWishlistCount((prev) => prev + 1);
  };
  return (
    <div className=" w-full bg-white">
      <div className=" w-[80%] py-5 m-auto flex items-center justify-between ">
        <div>
          <a href="#">
            <DynamicLogo />
          </a>
        </div>

        <div className=" w-[50%] relative  ">
          <input
            type="text"
            placeholder="Search for products..."
            className=" w-full px-4 font-Poppins z-10 font-medium border-2 border-[#3489ff] hover:border-[#3489ffe8] outline-none h-[55px]"
          />
          <div className=" bg-[#3489FF] w-[60px]  hover:bg-[#3489ffe8]  cursor-pointer flex items-center justify-center h-[55px] absolute top-0 right-0">
            <Search color="#fff" />
          </div>
        </div>

        <div className=" flex items-center justify-center gap-x-6">
          <div className=" flex items-center gap-x-2">
            <CircleUserRound size={45} strokeWidth={1} />
            <div className=" flex flex-col items-start font-semibold justify-center ">
              <span>Hello,</span>
              <span className=" text-sm">Sign in</span>
            </div>
          </div>
          <div className="text-center">
            <WishlistButton
              count={wishlistCount}
              onClick={handleWishlistClick}
            />
          </div>
          <div className="text-center">
            <CartButton count={wishlistCount} onClick={handleWishlistClick} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
