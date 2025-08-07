import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';
import { useEvents } from '../contexts/EventContext';
import { 
  IoCalendarOutline, 
  IoAddOutline, 
  IoTimeOutline,
  IoLocationOutline,
  IoStatsChartOutline
} from 'react-icons/io5';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const Dashboard = () => {
  const { user } = useAuth();
  const { upcomingEvents, events, loading, fetchUpcomingEvents } = useEvents();
  const [stats, setStats] = useState({
    total: 0,
    thisWeek: 0,
    thisMonth: 0,
    byCategory: {}
  });

  useEffect(() => {
    fetchUpcomingEvents(5);
  }, [fetchUpcomingEvents]);

  useEffect(() => {
    if (events.length > 0) {
      const now = new Date();
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - now.getDay());
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

      const thisWeek = events.filter(event => 
        new Date(event.start) >= weekStart && new Date(event.start) <= now
      ).length;

      const thisMonth = events.filter(event => 
        new Date(event.start) >= monthStart && new Date(event.start) <= now
      ).length;

      const byCategory = events.reduce((acc, event) => {
        acc[event.category] = (acc[event.category] || 0) + 1;
        return acc;
      }, {});

      setStats({
        total: events.length,
        thisWeek,
        thisMonth,
        byCategory
      });
    }
  }, [events]);

  const categoryColors = {
    work: '#ef4444',
    personal: '#10b981',
    meeting: '#3b82f6',
    birthday: '#f59e0b',
    holiday: '#8b5cf6',
    other: '#6b7280'
  };

  const StatCard = ({ title, value, icon: Icon, color = 'primary' }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center">
        <div className={`p-3 rounded-lg bg-${color}-100`}>
          <Icon className={`h-6 w-6 text-${color}-600`} />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );

  const EventCard = ({ event }) => {
    const categoryColor = categoryColors[event.category] || categoryColors.other;
    
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: categoryColor }}
              />
              <span className="text-sm font-medium text-gray-600 capitalize">
                {event.category}
              </span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">{event.title}</h3>
            {event.description && (
              <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                {event.description}
              </p>
            )}
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <IoTimeOutline size={14} />
                <span>{format(new Date(event.start), 'MMM d, h:mm a')}</span>
              </div>
              {event.location && (
                <div className="flex items-center space-x-1">
                  <IoLocationOutline size={14} />
                  <span>{event.location}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-600 mt-2">
          Here's what's happening with your calendar today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Events"
          value={stats.total}
          icon={IoCalendarOutline}
          color="primary"
        />
        <StatCard
          title="This Week"
          value={stats.thisWeek}
          icon={IoTimeOutline}
          color="green"
        />
        <StatCard
          title="This Month"
          value={stats.thisMonth}
          icon={IoStatsChartOutline}
          color="blue"
        />
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Quick Actions</p>
              <Link to="/calendar?action=add">
                <Button className="mt-2 flex items-center space-x-2">
                  <IoAddOutline size={16} />
                  <span>Add Event</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upcoming Events */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Upcoming Events</h2>
                <Link
                  to="/calendar"
                  className="text-sm font-medium text-primary-600 hover:text-primary-500"
                >
                  View all
                </Link>
              </div>
            </div>
            <div className="p-6">
              {upcomingEvents.length > 0 ? (
                <div className="space-y-4">
                  {upcomingEvents.slice(0, 5).map((event) => (
                    <EventCard key={event._id} event={event} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <IoCalendarOutline className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No upcoming events</p>
                  <Link to="/calendar?action=add">
                    <Button className="mt-4">
                      Create your first event
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Events by Category</h2>
            </div>
            <div className="p-6">
              {Object.keys(stats.byCategory).length > 0 ? (
                <div className="space-y-4">
                  {Object.entries(stats.byCategory).map(([category, count]) => (
                    <div key={category} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: categoryColors[category] }}
                        />
                        <span className="text-sm font-medium text-gray-700 capitalize">
                          {category}
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">
                        {count}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No events yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Tips */}
          <div className="bg-blue-50 rounded-lg p-6 mt-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">Quick Tips</h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li>• Click on any day in the calendar to create a new event</li>
              <li>• Use filters to find specific events quickly</li>
              <li>• Set up reminders to never miss important events</li>
              <li>• Organize events by categories for better management</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 