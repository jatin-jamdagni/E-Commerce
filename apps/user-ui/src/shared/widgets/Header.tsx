'use client';

import type React from 'react';

import {
  CircleUserRound,
  Search,
  Menu,
  X,
  User,
  LogOut,
  Settings,
  Package,
} from 'lucide-react';
import dynamic from 'next/dynamic';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDebounce } from '@/hooks/use-debounce';
import WishlistButton from './wishlist-button';
import CartButton from '../ui/Buttons/CartButton';
import HeaderBottom from './HeaderBottom';
import Link from 'next/link';
 const DynamicLogo = dynamic(() => import('./logo'), {
  loading: () => <div className="w-32 h-8 bg-gray-200 animate-pulse rounded" />,
  ssr: false,
});

interface IHeaderUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface HeaderProps {
  user?: IHeaderUser | null;
  onLogin?: () => void;
  onLogout?: () => void;
  className?: string;
}

interface SearchSuggestion {
  id: string;
  title: string;
  category: string;
  image?: string;
}

const Header: React.FC<HeaderProps> = ({
  user,
  onLogin,
  onLogout,
  className = '',
}) => {
  const [wishlistCount, setWishlistCount] = useState(3);
  const [cartCount, setCartCount] = useState(2);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<
    SearchSuggestion[]
  >([]);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Mock search suggestions
  const mockSuggestions: SearchSuggestion[] = [
    { id: '1', title: 'iPhone 15 Pro', category: 'Electronics' },
    { id: '2', title: 'Samsung Galaxy S24', category: 'Electronics' },
    { id: '3', title: 'MacBook Air M3', category: 'Computers' },
    { id: '4', title: 'AirPods Pro', category: 'Audio' },
    { id: '5', title: 'iPad Pro', category: 'Tablets' },
  ];

  // Handle search suggestions
  useEffect(() => {
    if (debouncedSearchQuery.length > 2) {
      setIsSearching(true);
      // Simulate API call
      setTimeout(() => {
        const filtered = mockSuggestions.filter((item) =>
          item.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase()),
        );
        setSearchSuggestions(filtered);
        setIsSearching(false);
      }, 200);
    } else {
      setSearchSuggestions([]);
      setIsSearching(false);
    }
  }, [debouncedSearchQuery]);

  // Click outside handler
  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      searchRef.current &&
      !searchRef.current.contains(event.target as Node)
    ) {
      setIsSearchFocused(false);
      setSearchSuggestions([]);
    }
    if (
      userMenuRef.current &&
      !userMenuRef.current.contains(event.target as Node)
    ) {
      setIsUserMenuOpen(false);
    }
    if (
      mobileMenuRef.current &&
      !mobileMenuRef.current.contains(event.target as Node)
    ) {
      setIsMobileMenuOpen(false);
    }
  }, []);

  // Keyboard handler
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsSearchFocused(false);
      setSearchSuggestions([]);
      setIsUserMenuOpen(false);
      setIsMobileMenuOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleClickOutside, handleKeyDown]);

  const handleSearch = useCallback(() => {
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery);
      setIsSearchFocused(false);
      setSearchSuggestions([]);
      // Add your search logic here
    }
  }, [searchQuery]);

  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setSearchQuery(suggestion.title);
    setIsSearchFocused(false);
    setSearchSuggestions([]);
    console.log('Selected suggestion:', suggestion);
  };

  const handleWishlistClick = () => {
    setWishlistCount((prev) => prev + 1);
  };

  const handleCartClick = () => {
    setCartCount((prev) => prev + 1);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen((prev) => !prev);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const handleLoginClick = () => {
    setIsUserMenuOpen(false);
    onLogin?.();
  };

  const handleLogoutClick = () => {
    setIsUserMenuOpen(false);
    onLogout?.();
  };

  return (
    <div className={`w-full bg-white shadow-sm ${className}`}>
      {/* Main Header */}
      <div className="w-full max-w-[80%] py-4 lg:py-5 mx-auto">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a
              href="/"
              className="block focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
            >
              <DynamicLogo />
            </a>
          </div>

          {/* Search Bar - Hidden on mobile */}
          <div
            className="hidden md:flex w-full max-w-[50%] relative"
            ref={searchRef}
          >
            <div className="relative w-full">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleSearchKeyPress}
                onFocus={() => setIsSearchFocused(true)}
                className="w-full px-4 py-3 font-medium border-2 border-blue-500 hover:border-blue-600 focus:border-blue-600 outline-none h-[55px] rounded-l-md transition-all duration-200 focus:shadow-lg"
                aria-label="Search for products"
                aria-expanded={
                  isSearchFocused &&
                  (searchSuggestions.length > 0 || isSearching)
                }
                aria-haspopup="listbox"
                role="combobox"
                autoComplete="off"
              />

              {/* Search Suggestions */}
              {isSearchFocused &&
                (searchSuggestions.length > 0 || isSearching) && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-b-md shadow-xl z-50 max-h-80 overflow-y-auto">
                    {isSearching ? (
                      <div className="p-4 text-center text-gray-500">
                        <div className="animate-spin w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                        Searching...
                      </div>
                    ) : (
                      <ul role="listbox" aria-label="Search suggestions">
                        {searchSuggestions.map((suggestion) => (
                          <li key={suggestion.id} role="option">
                            <button
                              className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none border-b border-gray-100 last:border-b-0 transition-colors"
                              onClick={() => handleSuggestionClick(suggestion)}
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-medium text-gray-900">
                                  {suggestion.title}
                                </span>
                                <span className="text-sm text-gray-500">
                                  {suggestion.category}
                                </span>
                              </div>
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
            </div>

            <button
              onClick={handleSearch}
              className="bg-blue-500 w-[60px] hover:bg-blue-600 focus:bg-blue-600 cursor-pointer flex items-center justify-center h-[55px] rounded-r-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 hover:shadow-lg"
              aria-label="Search"
            >
              <Search color="#fff" size={20} />
            </button>
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-3 lg:gap-6">
            {/* User Account */}
            <div className="relative" ref={userMenuRef}>
              {user ? (
                <button
                  onClick={toggleUserMenu}
                  className="hidden lg:flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 focus:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300"
                  aria-expanded={isUserMenuOpen}
                  aria-haspopup="true"
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar || '/placeholder.svg'}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <CircleUserRound
                      size={32}
                      strokeWidth={1.5}
                      className="text-gray-600"
                    />
                  )}
                  <div className="flex flex-col items-start">
                    <span className="text-sm text-gray-600">Hello,</span>
                    <span className="text-sm font-semibold text-gray-900 truncate max-w-20">
                      {user.name}
                    </span>
                  </div>
                </button>
              ) : (
                <Link
                  // onClick={handleLoginClick}
                  href={"/login"}
                  className="hidden lg:flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 focus:bg-gray-50 hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  <CircleUserRound
                    size={32}
                    strokeWidth={1.5}
                    className="text-gray-600"
                  />
                  <div className="flex flex-col items-start">
                    <span className="text-sm text-gray-600">Hello,</span>
                    <span className="text-sm font-semibold">Sign in</span>
                  </div>
                </Link>
              )}

              {/* Mobile User Icon */}
              <button
                onClick={user ? toggleUserMenu : handleLoginClick}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-50 focus:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300"
                aria-label={user ? 'User menu' : 'Sign in'}
              >
                {user?.avatar ? (
                  <img
                    src={user.avatar || '/placeholder.svg'}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <CircleUserRound
                    size={28}
                    strokeWidth={1.5}
                    className="text-gray-600"
                  />
                )}
              </button>

              {/* User Dropdown Menu */}
              {isUserMenuOpen && user && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-50 py-2">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">
                      {user.name}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {user.email}
                    </p>
                  </div>

                  <div className="py-1">
                    <a
                      href="/profile"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 focus:bg-gray-50 transition-colors focus:outline-none"
                    >
                      <User size={16} />
                      My Profile
                    </a>
                    <a
                      href="/orders"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 focus:bg-gray-50 transition-colors focus:outline-none"
                    >
                      <Package size={16} />
                      My Orders
                    </a>
                    <a
                      href="/settings"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 focus:bg-gray-50 transition-colors focus:outline-none"
                    >
                      <Settings size={16} />
                      Settings
                    </a>
                  </div>

                  <div className="border-t border-gray-100 py-1">
                    <button
                      onClick={handleLogoutClick}
                      className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 focus:bg-red-50 transition-colors focus:outline-none"
                    >
                      <LogOut size={16} />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Wishlist */}
            <WishlistButton
              count={wishlistCount}
              onClick={handleWishlistClick}
            />

            {/* Cart */}
            <CartButton count={cartCount} onClick={handleCartClick} />

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 rounded-lg hover:bg-gray-50 focus:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300"
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <X size={24} className="text-gray-600" />
              ) : (
                <Menu size={24} className="text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden mt-4">
          <div className="flex w-full relative" ref={searchRef}>
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleSearchKeyPress}
                onFocus={() => setIsSearchFocused(true)}
                className="w-full px-4 py-3 font-medium border-2 border-blue-500 hover:border-blue-600 focus:border-blue-600 outline-none h-[50px] rounded-l-md transition-all duration-200"
                aria-label="Search for products"
              />

              {/* Mobile Search Suggestions */}
              {isSearchFocused &&
                (searchSuggestions.length > 0 || isSearching) && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-b-md shadow-xl z-50 max-h-60 overflow-y-auto">
                    {isSearching ? (
                      <div className="p-4 text-center text-gray-500">
                        <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                        Searching...
                      </div>
                    ) : (
                      <ul>
                        {searchSuggestions.map((suggestion) => (
                          <li key={suggestion.id}>
                            <button
                              className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none border-b border-gray-100 last:border-b-0 transition-colors"
                              onClick={() => handleSuggestionClick(suggestion)}
                            >
                              <div className="flex flex-col">
                                <span className="font-medium text-gray-900 text-sm">
                                  {suggestion.title}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {suggestion.category}
                                </span>
                              </div>
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
            </div>

            <button
              onClick={handleSearch}
              className="bg-blue-500 w-[50px] hover:bg-blue-600 focus:bg-blue-600 cursor-pointer flex items-center justify-center h-[50px] rounded-r-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2"
              aria-label="Search"
            >
              <Search color="#fff" size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-b border-gray-200" />

      {/* Bottom Header */}
      <HeaderBottom />

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="fixed top-0 right-0 h-full w-80 max-w-[90vw] bg-white shadow-xl z-50 md:hidden transform transition-transform duration-300"
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
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100 focus:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-inset"
                aria-label="Close mobile menu"
              >
                <X size={20} className="text-gray-700" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {user ? (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    {user.avatar ? (
                      <img
                        src={user.avatar || '/placeholder.svg'}
                        alt={user.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <CircleUserRound
                        size={48}
                        strokeWidth={1.5}
                        className="text-gray-600"
                      />
                    )}
                    <div>
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <a
                      href="/profile"
                      className="flex items-center gap-2 text-sm text-gray-700 hover:text-blue-600 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <User size={16} />
                      My Profile
                    </a>
                    <a
                      href="/orders"
                      className="flex items-center gap-2 text-sm text-gray-700 hover:text-blue-600 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Package size={16} />
                      My Orders
                    </a>
                    <button
                      onClick={handleLogoutClick}
                      className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700 transition-colors"
                    >
                      <LogOut size={16} />
                      Sign out
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mb-6">
                  <button
                    onClick={handleLoginClick}
                    className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors font-medium"
                  >
                    Sign In
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
