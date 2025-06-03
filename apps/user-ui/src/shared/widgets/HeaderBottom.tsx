import { AlignLeft, ChevronDown } from 'lucide-react';
import React, { useEffect, useState } from 'react';

const HeaderBottom = () => {
  const [show, setShow] = useState<boolean>(false);
  const [isSticky, setIsSticky] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.screenY > 100) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return (
    <div
      className={`w-full transition-all duration-300 ${isSticky ? 'fixed top-0 left-0 z-[100] bg-white shadow-lg' : 'relative'}`}
    >
      <div
        className={` w-[80%] relative m-auto flex items-center justify-between ${isSticky ? 'pt-3' : 'py-0'}`}
      >
        <div
          className={`w-[260px] ${isSticky && '-mb-2'} cursor-pointer flex items-center justify-between px-5 h-[50px] bg-[#3489ff]`}
          onClick={() => setShow(!show)}
        >
          <div className=" flex items-center gap-2">
            <AlignLeft color="#fff" />
            <span>All Depratments</span>
          </div>
          <ChevronDown color='#fff' />
        </div>

        {show && (
          <div className={` absolute left-0 ${isSticky ? 'top-[70px] ':""} `}>
          

          </div>
        )}
      </div>
    </div>
  );
};

export default HeaderBottom;
