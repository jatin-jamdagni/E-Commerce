import Image from 'next/image';
import React from 'react';

const Logo = () => {
  return (
    <Image
      src={
        process.env.NEXT_PUBLIC_LOGO_URL ||
        'https://e-commerce-jatin.vercel.app/logo.png'
      }
      alt="Logo"
      width={60}
      height={15}
      priority
      className="object-contain h-10 w-10"
    />
  );
};

export default Logo;
