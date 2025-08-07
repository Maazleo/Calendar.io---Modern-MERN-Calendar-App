import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  IoCalendarOutline, 
  IoPersonOutline, 
  IoLogOutOutline,
  IoMenuOutline,
  IoNotificationsOutline
} from 'react-icons/io5';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = async () => {
    await logout();
    setShowDropdown(false);
  };

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/dashboard':
        return 'Dashboard';
      case '/calendar':
        return 'Calendar';
      case '/profile':
        return 'Profile';
      default:
        return 'Calendar.io';
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 fixed top-0 left-0 right-0 z-40">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side */}
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <IoCalendarOutline className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900">Calendar.io</span>
            </Link>
          </div>

          {/* Center - Page Title */}
          <div className="hidden md:block">
            <h1 className="text-lg font-semibold text-gray-900">{getPageTitle()}</h1>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <IoNotificationsOutline size={20} />
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-sm">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="hidden md:block text-sm font-medium text-gray-700">
                  {user?.name}
                </span>
                <IoMenuOutline size={16} className="text-gray-400" />
              </button>

              {/* Dropdown Menu */}
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  <Link
                    to="/profile"
                    onClick={() => setShowDropdown(false)}
                    className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <IoPersonOutline size={16} />
                    <span>Profile</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors w-full text-left"
                  >
                    <IoLogOutOutline size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {showDropdown && (
        <div 
          className="fixed inset-0 z-40 md:hidden"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </nav>
  );
};

export default Navbar; 