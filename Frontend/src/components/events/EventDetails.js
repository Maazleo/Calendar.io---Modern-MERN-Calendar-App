import React from 'react';
import { format } from 'date-fns';
import { IoLocationOutline, IoTimeOutline, IoCalendarOutline, IoTrashOutline, IoCreateOutline } from 'react-icons/io5';
import Button from '../ui/Button';

const EventDetails = ({ event, onEdit, onDelete, onClose }) => {
  if (!event) return null;

  const categoryColors = {
    work: '#ef4444',
    personal: '#10b981',
    meeting: '#3b82f6',
    birthday: '#f59e0b',
    holiday: '#8b5cf6',
    other: '#6b7280'
  };

  const formatDateTime = (date) => {
    return format(new Date(date), 'PPP p');
  };

  const formatTime = (date) => {
    return format(new Date(date), 'p');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{event.title}</h3>
          <div className="flex items-center space-x-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: categoryColors[event.category] }}
            />
            <span className="text-sm font-medium text-gray-600 capitalize">
              {event.category}
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onEdit}
            className="flex items-center space-x-1"
          >
            <IoCreateOutline size={16} />
            <span>Edit</span>
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => onDelete(event._id)}
            className="flex items-center space-x-1"
          >
            <IoTrashOutline size={16} />
            <span>Delete</span>
          </Button>
        </div>
      </div>

      {/* Description */}
      {event.description && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Description</h4>
          <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">
            {event.description}
          </p>
        </div>
      )}

      {/* Date and Time */}
      <div className="space-y-3">
        <div className="flex items-start space-x-3">
          <IoCalendarOutline className="h-5 w-5 text-gray-400 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-gray-700">Date & Time</p>
            <p className="text-gray-600">
              {event.allDay ? (
                format(new Date(event.start), 'PPP')
              ) : (
                <>
                  {formatDateTime(event.start)} - {formatTime(event.end)}
                </>
              )}
            </p>
          </div>
        </div>

        {/* Location */}
        {event.location && (
          <div className="flex items-start space-x-3">
            <IoLocationOutline className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-700">Location</p>
              <p className="text-gray-600">{event.location}</p>
            </div>
          </div>
        )}
      </div>

      {/* Recurring Info */}
      {event.recurring?.isRecurring && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-800 mb-2">Recurring Event</h4>
          <p className="text-sm text-blue-700">
            {event.recurring.interval} {event.recurring.pattern}
            {event.recurring.interval > 1 ? 's' : ''}
            {event.recurring.endDate && ` until ${format(new Date(event.recurring.endDate), 'PPP')}`}
          </p>
        </div>
      )}

      {/* Reminders */}
      {event.reminders && event.reminders.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Reminders</h4>
          <div className="space-y-2">
            {event.reminders.map((reminder, index) => (
              <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                <IoTimeOutline className="h-4 w-4" />
                <span>{reminder.time} minutes before via {reminder.type}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tags */}
      {event.tags && event.tags.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Tags</h4>
          <div className="flex flex-wrap gap-2">
            {event.tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Notes */}
      {event.notes && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Notes</h4>
          <p className="text-gray-600 bg-gray-50 p-3 rounded-lg text-sm">
            {event.notes}
          </p>
        </div>
      )}

      {/* Footer */}
      <div className="flex justify-end pt-4 border-t border-gray-200">
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  );
};

export default EventDetails; 