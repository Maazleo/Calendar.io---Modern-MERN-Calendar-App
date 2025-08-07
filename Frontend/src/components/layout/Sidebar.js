import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  IoHomeOutline, 
  IoCalendarOutline, 
  IoPersonOutline,
  IoAddOutline,
  IoFilterOutline
} from 'react-icons/io5';

const Sidebar = () => {
  const location = useLocation();

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: IoHomeOutline,
      current: location.pathname === '/dashboard'
    },
    {
      name: 'Calendar',
      href: '/calendar',
      icon: IoCalendarOutline,
      current: location.pathname === '/calendar'
    },
    {
      name: 'Profile',
      href: '/profile',
      icon: IoPersonOutline,
      current: location.pathname === '/profile'
    }
  ];

  const quickActions = [
    {
      name: 'Add Event',
      href: '/calendar?action=add',
      icon: IoAddOutline
    },
    {
      name: 'Filter Events',
      href: '/calendar?action=filter',
      icon: IoFilterOutline
    }
  ];

  return (
    <div className="fixed left-0 top-16 h-full w-64 bg-white border-r border-gray-200 z-30">
      <div className="flex flex-col h-full">
        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          <div className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`
                    flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                    ${item.current
                      ? 'bg-primary-50 text-primary-700 border border-primary-200'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  <Icon size={20} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Quick Actions */}
          <div className="pt-6 border-t border-gray-200">
            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Quick Actions
            </h3>
            <div className="space-y-1">
              {quickActions.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                  >
                    <Icon size={20} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <div className="text-xs text-gray-500 text-center">
            Calendar.io v1.0.0
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 