import React, { useState, useCallback } from 'react';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useEvents } from '../contexts/EventContext';
import { IoAddOutline, IoFilterOutline } from 'react-icons/io5';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import EventForm from '../components/events/EventForm';
import EventDetails from '../components/events/EventDetails';
import EventFilters from '../components/events/EventFilters';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const localizer = momentLocalizer(moment);

const Calendar = () => {
  const { events, loading, createEvent, updateEvent, deleteEvent } = useEvents();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventForm, setShowEventForm] = useState(false);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [view, setView] = useState('month');
  const [date, setDate] = useState(new Date());

  // Convert events to Big Calendar format
  const calendarEvents = events.map(event => ({
    id: event._id,
    title: event.title,
    start: new Date(event.start),
    end: new Date(event.end),
    allDay: event.allDay,
    resource: event // Store full event data
  }));

  // Handle event selection
  const handleSelectEvent = (event) => {
    setSelectedEvent(event.resource);
    setShowEventDetails(true);
  };

  // Handle slot selection (create new event)
  const handleSelectSlot = useCallback(({ start, end, slots }) => {
    const newEvent = {
      start: start,
      end: end,
      allDay: slots.length > 1
    };
    setEditingEvent(newEvent);
    setShowEventForm(true);
  }, []);

  // Handle event creation/update
  const handleSaveEvent = useCallback(async (eventData) => {
    if (editingEvent && editingEvent._id) {
      // Update existing event
      await updateEvent(editingEvent._id, eventData);
    } else {
      // Create new event
      await createEvent(eventData);
    }
    setShowEventForm(false);
    setEditingEvent(null);
  }, [editingEvent, updateEvent, createEvent]);

  // Handle event deletion
  const handleDeleteEvent = useCallback(async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      await deleteEvent(eventId);
      setShowEventDetails(false);
      setSelectedEvent(null);
    }
  }, [deleteEvent]);

  // Handle event edit
  const handleEditEvent = useCallback(() => {
    setEditingEvent(selectedEvent);
    setShowEventDetails(false);
    setShowEventForm(true);
  }, [selectedEvent]);

  // Event styling
  const eventStyleGetter = (event) => {
    const category = event.resource?.category || 'other';
    const colors = {
      work: '#ef4444',
      personal: '#10b981',
      meeting: '#3b82f6',
      birthday: '#f59e0b',
      holiday: '#8b5cf6',
      other: '#6b7280'
    };

    return {
      style: {
        backgroundColor: colors[category],
        border: `1px solid ${colors[category]}`,
        color: 'white',
        borderRadius: '4px',
        opacity: 0.9
      }
    };
  };

  // Calendar messages
  const messages = {
    allDay: 'All Day',
    previous: 'Previous',
    next: 'Next',
    today: 'Today',
    month: 'Month',
    week: 'Week',
    day: 'Day',
    agenda: 'Agenda',
    date: 'Date',
    time: 'Time',
    event: 'Event',
    noEventsInRange: 'No events in this range.',
    showMore: (total) => `+${total} more`
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>
          <p className="text-gray-600">Manage your events and schedule</p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <Button
            variant="outline"
            onClick={() => setShowFilters(true)}
            className="flex items-center space-x-2"
          >
            <IoFilterOutline size={16} />
            <span>Filters</span>
          </Button>
          
          <Button
            onClick={() => {
              setEditingEvent(null);
              setShowEventForm(true);
            }}
            className="flex items-center space-x-2"
          >
            <IoAddOutline size={16} />
            <span>Add Event</span>
          </Button>
        </div>
      </div>

      {/* Calendar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {loading ? (
          <div className="flex items-center justify-center h-96">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <BigCalendar
            localizer={localizer}
            events={calendarEvents}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 600 }}
            views={['month', 'week', 'day', 'agenda']}
            view={view}
            onView={setView}
            date={date}
            onNavigate={setDate}
            onSelectEvent={handleSelectEvent}
            onSelectSlot={handleSelectSlot}
            selectable
            eventPropGetter={eventStyleGetter}
            messages={messages}
            defaultView="month"
            step={60}
            timeslots={1}
            className="calendar-container"
          />
        )}
      </div>

      {/* Event Form Modal */}
      <Modal
        isOpen={showEventForm}
        onClose={() => {
          setShowEventForm(false);
          setEditingEvent(null);
        }}
        title={editingEvent?._id ? 'Edit Event' : 'Create New Event'}
        size="lg"
      >
        <EventForm
          event={editingEvent}
          onSave={handleSaveEvent}
          onCancel={() => {
            setShowEventForm(false);
            setEditingEvent(null);
          }}
        />
      </Modal>

      {/* Event Details Modal */}
      <Modal
        isOpen={showEventDetails}
        onClose={() => {
          setShowEventDetails(false);
          setSelectedEvent(null);
        }}
        title="Event Details"
        size="md"
      >
        <EventDetails
          event={selectedEvent}
          onEdit={handleEditEvent}
          onDelete={handleDeleteEvent}
          onClose={() => {
            setShowEventDetails(false);
            setSelectedEvent(null);
          }}
        />
      </Modal>

      {/* Filters Modal */}
      <Modal
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        title="Filter Events"
        size="md"
      >
        <EventFilters
          onClose={() => setShowFilters(false)}
        />
      </Modal>
    </div>
  );
};

export default Calendar; 