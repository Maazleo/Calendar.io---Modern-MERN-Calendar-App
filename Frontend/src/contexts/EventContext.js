import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const EventContext = createContext();

export const useEvents = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
};

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    start: null,
    end: null,
    category: '',
    search: '',
    status: 'active'
  });

  // Fetch all events
  const fetchEvents = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        ...filters,
        ...params
      }).toString();

      const response = await axios.get(`/api/events?${queryParams}`);
      setEvents(response.data.data.events);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to fetch events');
      return null;
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Fetch upcoming events
  const fetchUpcomingEvents = useCallback(async (limit = 10) => {
    try {
      const response = await axios.get(`/api/events/upcoming?limit=${limit}`);
      setUpcomingEvents(response.data.data.events);
      return response.data.data.events;
    } catch (error) {
      console.error('Error fetching upcoming events:', error);
      return [];
    }
  }, []);

  // Create new event
  const createEvent = async (eventData) => {
    try {
      const response = await axios.post('/api/events', eventData);
      const newEvent = response.data.data.event;
      
      setEvents(prev => [...prev, newEvent]);
      await fetchUpcomingEvents(); // Refresh upcoming events
      
      toast.success('Event created successfully');
      return { success: true, event: newEvent };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create event';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Update event
  const updateEvent = async (eventId, eventData) => {
    try {
      const response = await axios.put(`/api/events/${eventId}`, eventData);
      const updatedEvent = response.data.data.event;
      
      setEvents(prev => 
        prev.map(event => 
          event._id === eventId ? updatedEvent : event
        )
      );
      await fetchUpcomingEvents(); // Refresh upcoming events
      
      toast.success('Event updated successfully');
      return { success: true, event: updatedEvent };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update event';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Delete event
  const deleteEvent = async (eventId) => {
    try {
      await axios.delete(`/api/events/${eventId}`);
      
      setEvents(prev => prev.filter(event => event._id !== eventId));
      await fetchUpcomingEvents(); // Refresh upcoming events
      
      toast.success('Event deleted successfully');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete event';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Get single event
  const getEvent = async (eventId) => {
    try {
      const response = await axios.get(`/api/events/${eventId}`);
      return response.data.data.event;
    } catch (error) {
      console.error('Error fetching event:', error);
      toast.error('Failed to fetch event');
      return null;
    }
  };

  // Get events by date range
  const getEventsByDateRange = async (start, end) => {
    try {
      const response = await axios.get(`/api/events/range?start=${start}&end=${end}`);
      return response.data.data.events;
    } catch (error) {
      console.error('Error fetching events by date range:', error);
      return [];
    }
  };

  // Get events by category
  const getEventsByCategory = async (category, page = 1, limit = 20) => {
    try {
      const response = await axios.get(`/api/events/category/${category}?page=${page}&limit=${limit}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching events by category:', error);
      return { events: [], pagination: {} };
    }
  };

  // Bulk update events
  const bulkUpdateEvents = async (eventIds, updates) => {
    try {
      const response = await axios.put('/api/events/bulk', {
        eventIds,
        updates
      });
      
      // Refresh events after bulk update
      await fetchEvents();
      await fetchUpcomingEvents();
      
      toast.success(response.data.message);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update events';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Update filters
  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({
      start: null,
      end: null,
      category: '',
      search: '',
      status: 'active'
    });
  };

  // Load initial data
  useEffect(() => {
    fetchEvents();
    fetchUpcomingEvents();
  }, [fetchEvents, fetchUpcomingEvents]);

  // Fetch events when filters change
  useEffect(() => {
    if (Object.values(filters).some(value => value !== null && value !== '')) {
      fetchEvents();
    }
  }, [filters, fetchEvents]);

  const value = {
    events,
    upcomingEvents,
    loading,
    filters,
    fetchEvents,
    fetchUpcomingEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    getEvent,
    getEventsByDateRange,
    getEventsByCategory,
    bulkUpdateEvents,
    updateFilters,
    clearFilters
  };

  return (
    <EventContext.Provider value={value}>
      {children}
    </EventContext.Provider>
  );
}; 