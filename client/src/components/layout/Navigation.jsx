import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import HeaderLoginDropdown from './HeaderLoginDropdown';

export const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsUserMenuOpen(false);
  };

  const isWorker = user?.role === 'worker';
  const isCustomer = user?.role === 'customer';

  // ✅ Added “Add Worker” visible only for customers
  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/search', label: 'Find Workers' },
    ...(isAuthenticated
      ? [
          ...(isCustomer ? [{ path: '/add-worker', label: 'Add Worker' }] : []),
          {
            path: '/bookings',
            label: user?.role === 'customer' ? 'My Bookings' : 'Job Requests',
          },
          { path: '/profile', label: 'Profile' },
        ]
      : []),
  ];

  const isActivePath = (path) => location.pathname === path;

  return (
    <nav className="bg-gray-50 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                isWorker
                  ? 'bg-gradient-to-r from-blue-500 to-green-500'
                  : 'bg-[#2979FF]'
              }`}
            >
              <span className="text-white font-bold text-xl">W</span>
            </div>
            <span
              className={`text-xl font-bold ${
                isWorker ? 'text-black' : 'gradient-text'
              }`}
            >
              WorkerConnect
            </span>
          </Link>

          {/* Desktop Navbar */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActivePath(link.path)
                    ? isWorker
                      ? 'text-green-600 bg-green-100'
                      : 'text-[#2979FF] bg-[#2979FF]/10'
                    : isWorker
                    ? 'text-gray-700 hover:text-green-600 hover:bg-green-100'
                    : 'text-gray-700 hover:text-[#2979FF] hover:bg-[#2979FF]/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* User Menu (Desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isWorker
                        ? 'bg-gradient-to-r from-blue-500 to-green-500'
                        : 'bg-gradient-primary'
                    }`}
                  >
                    {user?.profilePicture ? (
                      <img
                        src={user.profilePicture}
                        alt={user.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {user?.name}
                  </span>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <Link
                      to="/profile"
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <User className="w-4 h-4" />
                      <span>My Profile</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <HeaderLoginDropdown />
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-700 hover:text-primary hover:bg-gray-100"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActivePath(link.path)
                      ? 'text-primary bg-primary/10'
                      : 'text-gray-700 hover:text-primary hover:bg-primary/5'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              {isAuthenticated ? (
                <div className="pt-4 border-t border-gray-200 mt-4">
                  <div className="flex items-center space-x-3 px-3 py-2">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        isWorker
                          ? 'bg-gradient-to-r from-blue-500 to-green-500'
                          : 'bg-gradient-primary'
                      }`}
                    >
                      {user?.profilePicture ? (
                        <img
                          src={user.profilePicture}
                          alt={user.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <User className="w-5 h-5 text-white" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        {user?.name}
                      </p>
                      <p className="text-xs text-gray-500 capitalize">
                        {user?.role}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className={`flex items-center space-x-2 w-full px-3 py-2 text-left text-gray-700 rounded-md ${
                      isWorker
                        ? 'hover:bg-gradient-to-r hover:from-blue-500 hover:to-green-500'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="pt-4 border-t border-gray-200 mt-4 space-y-2">
                  <Link
                    to="/login"
                    className="block px-3 py-2 text-gray-700 hover:text-primary hover:bg-primary/5 rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block px-3 py-2 text-primary hover:bg-primary/5 rounded-md font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
