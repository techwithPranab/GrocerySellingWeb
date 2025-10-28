import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { 
  ShoppingCartIcon, 
  UserIcon, 
  MagnifyingGlassIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, isAuthenticated, logout } = useAuth();
  const { cartItemsCount } = useCart();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  const navigationItems = [
    { name: 'Products', href: '/products' },
    { name: 'Categories', href: '/categories' },
    { name: 'Offers', href: '/offers' },
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top bar */}
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">G</span>
              </div>
              <span className="text-xl font-bold text-gray-900 hidden sm:block">
                Fresh Grocery
              </span>
              <span className="text-lg font-bold text-gray-900 sm:hidden">
                Grocery
              </span>
            </Link>
          </div>

          {/* Search bar - Desktop */}
          <div className="hidden lg:block flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
              <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </form>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Search button - Mobile/Tablet */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-gray-700 hover:text-primary-600"
            >
              <MagnifyingGlassIcon className="h-6 w-6" />
            </button>

            {/* Cart - Only show for authenticated users */}
            {isAuthenticated && (
              <Link href="/cart" className="relative p-2 text-gray-700 hover:text-primary-600 transition-colors">
                <ShoppingCartIcon className="h-6 w-6" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center min-w-[20px]">
                    {cartItemsCount > 99 ? '99+' : cartItemsCount}
                  </span>
                )}
              </Link>
            )}

            {/* User menu */}
            {isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center space-x-1 md:space-x-2 p-2 text-gray-700 hover:text-primary-600 transition-colors">
                  <UserIcon className="h-6 w-6" />
                  <span className="hidden md:block text-sm">{user?.name?.split(' ')[0]}</span>
                </button>

                {/* Dropdown menu */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-1">
                    <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Profile
                    </Link>
                    <Link href="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      My Orders
                    </Link>
                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-1 md:space-x-2">
                <Link href="/login" className="btn btn-outline text-xs md:text-sm px-2 md:px-4 py-1 md:py-2">
                  Login
                </Link>
                <Link href="/register" className="btn btn-primary text-xs md:text-sm px-2 md:px-4 py-1 md:py-2">
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-gray-700 hover:text-primary-600"
            >
              {isMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Navigation - Desktop */}
        <nav className="hidden lg:flex items-center space-x-8 pb-4">
          {navigationItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* Mobile menu overlay */}
      {isMenuOpen && (
        <button
          className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-25 w-full h-full"
          onClick={() => setIsMenuOpen(false)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setIsMenuOpen(false);
            }
          }}
          aria-label="Close mobile menu"
          type="button"
        >
          <div className="fixed top-16 left-0 right-0 bg-white border-t border-gray-200 shadow-lg max-h-[calc(100vh-4rem)] overflow-y-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
              {/* Search bar - Mobile */}
              <form onSubmit={handleSearch} className="mb-6">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search for products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-base"
                    autoFocus
                  />
                  <MagnifyingGlassIcon className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                </div>
              </form>

              {/* Navigation - Mobile */}
              <nav className="space-y-1 mb-6">
                {navigationItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block py-3 px-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition-colors font-medium text-base"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>

              {/* User actions - Mobile */}
              {!isAuthenticated && (
                <div className="border-t border-gray-200 pt-4 space-y-3">
                  <Link
                    href="/login"
                    className="block w-full btn btn-outline text-center py-3"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="block w-full btn btn-primary text-center py-3"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </button>
      )}
    </header>
  );
};

export default Header;
