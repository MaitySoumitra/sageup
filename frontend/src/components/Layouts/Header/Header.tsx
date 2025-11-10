import React, { useState, useEffect, useRef } from 'react';
import LoginModal from '../../Modal/User/LoginModal';
import MobileSearchHeader from './MobileSearchHeader';
import {
  UserCircle,
  MagnifyingGlass,
  MapPin,
  DotsThreeVertical,
  DownloadSimple,
  Storefront,
  Headset,
  CaretRight,
  DeviceMobile,
  TrendUp,
} from '@phosphor-icons/react';

interface HeaderProps {
  className?: string;
  hideMobileSearch?: boolean;
}

const Header: React.FC<HeaderProps> = ({ className = '', hideMobileSearch }) => {
  const [showLogin, setShowLogin] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [trending, setTrending] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isStickySearchHeader, setIsStickySearchHeader] = useState(false);

  const mobileSearchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsStickySearchHeader(scrollY >= 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Simulated trending data (replace with your own API if needed)
  useEffect(() => {
    setTrending(['Tractor', 'Fertilizer', 'Seeds', 'Irrigation', 'Tools']);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setShowSuggestions(true);
  };

  const handleSearch = () => {
    const query = searchQuery.trim();
    if (query) {
      // Replace navigate with window.location.href
      window.location.href = `/search?q=${encodeURIComponent(query)}`;
      setShowSuggestions(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch();
  };

  const SuggestionDropdown = () =>
    showSuggestions && trending.length > 0 ? (
      <div
        className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-sm z-50 max-h-[20rem] overflow-y-auto p-4 scrollbar-hide"
      >
        <h3 className="text-xs font-bold text-gray-500 mb-3 flex items-center gap-2">
          <TrendUp size={14} weight="fill" className="text-gray-500" />
          TRENDING SEARCHES
        </h3>
        <div className="flex flex-wrap gap-2">
          {trending.map((term, i) => (
            <button
              key={i}
              className="px-4 py-1 bg-gray-100 text-blue-600 font-semibold rounded-md hover:bg-blue-50 text-sm"
              onClick={() => {
                window.location.href = `/search?q=${encodeURIComponent(term)}`;
                setShowSuggestions(false);
              }}
            >
              {term}
            </button>
          ))}
        </div>
      </div>
    ) : null;

  return (
    <>
      <header
        className={`bg-white md:shadow-sm sticky z-50 transition-transform duration-300
          md:top-0
          ${isStickySearchHeader ? '-top-20 -translate-y-full' : 'top-0 translate-y-0'}
          md:translate-y-0
          ${className}`}
      >
        <div className="max-w-[1600px] mx-auto px-4 py-2">
          <div className="flex items-center justify-between gap-2 lg:gap-4">
            {/* Logo + Location */}
            <div className="flex items-center gap-8">
              <a href="/">
                <img
                  src="/kes-new.jpg"
                  alt="Kisan E-Store"
                  width={160}
                  height={40}
                  className="h-8 lg:h-10 w-auto object-contain"
                />
              </a>

              <div className="hidden md:flex flex-col items-center relative">
                <button className="flex items-center px-3 py-1.5 rounded hover:bg-blue-50 transition-colors cursor-pointer">
                  <MapPin size={18} weight="fill" className="text-blue-700 mr-1" />
                  <span className="text-sm font-medium text-blue-700">Location</span>
                </button>
              </div>
            </div>

            {/* Desktop Search */}
            <div className="flex-1 w-full hidden md:block">
              <div className="relative flex items-center">
                <MagnifyingGlass
                  className="absolute left-3 text-blue-600 cursor-pointer"
                  width={20}
                  height={20}
                  onClick={handleSearch}
                />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search for Products, Brands and More"
                  value={searchQuery}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  className="w-full pl-10 pr-4 h-10 text-[16px] bg-blue-50 rounded-sm focus:outline-none placeholder:text-gray-400 text-gray-900"
                />
                <SuggestionDropdown />
              </div>
            </div>

            {/* Right Side */}
            <div className="flex items-center justify-end gap-x-2 md:gap-x-4 relative">
              <DeviceMobile
                size={24}
                weight="regular"
                className="inline md:hidden text-gray-900 cursor-pointer"
              />

              <button
                className="flex items-center text-gray-900 hover:bg-blue-600 hover:text-white px-3 md:px-5 py-2 font-medium rounded-md"
                onClick={() => setShowLogin(true)}
              >
                <UserCircle width={24} height={24} className="mr-2" />
                Login
              </button>

              {/* Cart Button */}
              <button
                onClick={() => window.location.href = '/cart'}
                className="flex items-center text-gray-900 hover:bg-blue-600 hover:text-white px-3 md:px-5 py-2 font-medium rounded-md"
              >
                Book a call
              </button>

              {/* Dropdown Menu */}
              <div
                className="relative hidden lg:block"
                onMouseEnter={() => setShowDropdown(true)}
                onMouseLeave={() => setShowDropdown(false)}
              >
                <button className="flex items-center text-gray-900 hover:bg-blue-600 hover:text-white px-3 py-2 font-medium rounded-md">
                  <DotsThreeVertical width={28} height={28} weight="bold" />
                </button>

                {showDropdown && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 shadow-lg rounded-lg py-2 z-50">
                    <a href="#" className="flex items-center px-4 py-2 text-gray-800 hover:bg-blue-50">
                      <DownloadSimple size={20} className="mr-2 text-blue-600" />
                      Download App
                    </a>
                    <a href="#" className="flex items-center px-4 py-2 text-gray-800 hover:bg-blue-50">
                      <Storefront size={20} className="mr-2 text-blue-600" />
                      Sell with Us
                    </a>
                    <a href="#" className="flex items-center px-4 py-2 text-gray-800 hover:bg-blue-50">
                      <Headset size={20} className="mr-2 text-blue-600" />
                      Customer Care
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Location */}
          <div className="flex items-center gap-1 my-2 md:hidden">
            <MapPin size={20} weight="fill" className="text-gray-800" />
            <span className="text-xs font-semibold text-black">Location not set</span>
            <span className="flex items-center text-xs font-semibold text-blue-700 cursor-pointer ml-1">
              Select delivery location
              <CaretRight size={16} className="ml-1 text-blue-600" />
            </span>
          </div>

          {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
        </div>
      </header>

      {!hideMobileSearch && (
        <MobileSearchHeader ref={mobileSearchRef} isSticky={isStickySearchHeader} />
      )}
    </>
  );
};

export default Header;
