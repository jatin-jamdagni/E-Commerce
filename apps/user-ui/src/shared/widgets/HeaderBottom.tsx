'use client';

import { AlignLeft, ChevronDown, X } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { navItems, departments } from '../utils/constants';

interface HeaderBottomProps {
  className?: string;
}

const SCROLL_THRESHOLD = 100;
const DROPDOWN_WIDTH = 260;

const HeaderBottom: React.FC<HeaderBottomProps> = ({ className = '' }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isSticky, setIsSticky] = useState<boolean>(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Throttled scroll handler for better performance
  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY;
    setIsSticky(scrollY > SCROLL_THRESHOLD);
  }, []);

  // Click outside handler
  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node) &&
      buttonRef.current &&
      !buttonRef.current.contains(event.target as Node)
    ) {
      setIsDropdownOpen(false);
    }

    if (
      mobileMenuRef.current &&
      !mobileMenuRef.current.contains(event.target as Node)
    ) {
      setIsMobileMenuOpen(false);
    }
  }, []);

  // Keyboard handler for accessibility
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsDropdownOpen(false);
      setIsMobileMenuOpen(false);
      buttonRef.current?.focus();
    }
  }, []);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const throttledScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleScroll, 16); // ~60fps
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('scroll', throttledScroll);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timeoutId);
    };
  }, [handleScroll, handleClickOutside, handleKeyDown]);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
    setIsDropdownOpen(false);
  };

  const closeAllMenus = () => {
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header
        className={`w-full transition-all duration-300 ${
          isSticky
            ? 'fixed top-0 left-0 z-50 bg-white shadow-lg backdrop-blur-sm'
            : 'relative'
        } ${className}`}
        role="banner"
      >
        <div
          className={`w-full max-w-[80%] mx-auto flex items-center justify-between transition-all duration-300 ${
            isSticky ? 'py-2' : 'py-0'
          }`}
        >
          {/* Departments Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              ref={buttonRef}
              className={`w-[${DROPDOWN_WIDTH}px] cursor-pointer flex items-center justify-between px-5 h-[50px] bg-blue-500 hover:bg-blue-600 focus:bg-blue-600 rounded-t-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2`}
              onClick={toggleDropdown}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  toggleDropdown();
                }
              }}
              aria-expanded={isDropdownOpen}
              aria-controls="departments-menu"
              aria-haspopup="true"
              aria-label="Toggle departments menu"
            >
              <div className="flex items-center gap-2">
                <AlignLeft color="#fff" size={18} aria-hidden="true" />
                <span className="text-white font-medium text-sm lg:text-base">
                  All Departments
                </span>
              </div>
              <ChevronDown
                color="#fff"
                size={18}
                className={`transition-transform duration-300 ${
                  isDropdownOpen ? 'rotate-180' : 'rotate-0'
                }`}
                aria-hidden="true"
              />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div
                id="departments-menu"
                className={`absolute left-0 top-[50px] w-[${DROPDOWN_WIDTH}px] bg-white shadow-xl border border-gray-200 z-[60] rounded-b-sm animate-in slide-in-from-top-2 duration-200`}
                role="menu"
                aria-labelledby="departments-button"
              >
                <div className="p-2 max-h-[400px] overflow-y-auto">
                  <ul className="space-y-1" role="none">
                    {departments.map((dept) => (
                      <li key={dept.id} role="none">
                        <Link
                          href={dept.href}
                          className="block px-3 py-2 hover:bg-gray-100 focus:bg-gray-100 rounded text-gray-700 hover:text-blue-600 focus:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-inset text-sm"
                          role="menuitem"
                          onClick={closeAllMenus}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              closeAllMenus();
                            }
                          }}
                        >
                          <span className="flex items-center gap-2">
                            {dept.icon && (
                              <dept.icon size={16} aria-hidden="true" />
                            )}
                            {dept.name}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Desktop Navigation Links */}
          <nav
            className="hidden md:flex items-center space-x-1"
            role="navigation"
            aria-label="Main navigation"
          >
            {navItems.map((item) => (
              <Link
                key={item.title}
                className="px-4 py-2 font-medium text-gray-700 hover:text-blue-600 focus:text-blue-600 transition-colors text-base lg:text-lg rounded focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2"
                href={item.href}
                aria-label={item.title}
              >
                {item.title}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded hover:bg-gray-100 focus:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2"
            onClick={toggleMobileMenu}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <X className="text-gray-700" size={20} aria-hidden="true" />
            ) : (
              <AlignLeft
                className="text-gray-700"
                size={20}
                aria-hidden="true"
              />
            )}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
          onClick={closeAllMenus}
          aria-hidden="true"
        />
      )}

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          id="mobile-menu"
          className={`fixed top-0 right-0 h-full w-80 max-w-[90vw] bg-white shadow-xl z-50 md:hidden transform transition-transform duration-300 ${
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="mobile-menu-title"
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2
                id="mobile-menu-title"
                className="text-lg font-semibold text-gray-900"
              >
                Menu
              </h2>
              <button
                onClick={closeAllMenus}
                className="p-2 rounded hover:bg-gray-100 focus:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-inset"
                aria-label="Close mobile menu"
              >
                <X size={20} className="text-gray-700" aria-hidden="true" />
              </button>
            </div>

            <nav
              className="flex-1 overflow-y-auto p-4"
              role="navigation"
              aria-label="Mobile navigation"
            >
              <div className="space-y-6">
                {/* Mobile Navigation Links */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    Navigation
                  </h3>
                  <ul className="space-y-2">
                    {navItems.map((item) => (
                      <li key={item.title}>
                        <Link
                          href={item.href}
                          className="block px-3 py-2 text-gray-700 hover:text-blue-600 focus:text-blue-600 hover:bg-gray-50 focus:bg-gray-50 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-inset"
                          onClick={closeAllMenus}
                        >
                          {item.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Mobile Departments */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    Departments
                  </h3>
                  <ul className="space-y-2">
                    {departments.map((dept) => (
                      <li key={dept.id}>
                        <Link
                          href={dept.href}
                          className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-blue-600 focus:text-blue-600 hover:bg-gray-50 focus:bg-gray-50 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-inset"
                          onClick={closeAllMenus}
                        >
                          {dept.icon && (
                            <dept.icon size={16} aria-hidden="true" />
                          )}
                          {dept.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default HeaderBottom;
