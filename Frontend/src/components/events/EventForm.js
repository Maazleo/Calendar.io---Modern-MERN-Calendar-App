import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import Button from '../ui/Button';

const EventForm = ({ event, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start: '',
    end: '',
    allDay: false,
    location: '',
    category: 'other',
    color: '#3788d8',
    reminders: [{ type: 'email', time: 15, sent: false }],
    recurring: {
      isRecurring: false,
      pattern: 'weekly',
      interval: 1,
      endDate: ''
    }
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Initialize form with event data if editing
  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title || '',
        description: event.description || '',
        start: event.start ? format(new Date(event.start), "yyyy-MM-dd'T'HH:mm") : '',
        end: event.end ? format(new Date(event.end), "yyyy-MM-dd'T'HH:mm") : '',
        allDay: event.allDay || false,
        location: event.location || '',
        category: event.category || 'other',
        color: event.color || '#3788d8',
        reminders: event.reminders || [{ type: 'email', time: 15, sent: false }],
        recurring: event.recurring || {
          isRecurring: false,
          pattern: 'weekly',
          interval: 1,
          endDate: ''
        }
      });
    }
  }, [event]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleRecurringChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      recurring: {
        ...prev.recurring,
        [field]: value
      }
    }));
  };

  const addReminder = () => {
    setFormData(prev => ({
      ...prev,
      reminders: [...prev.reminders, { type: 'email', time: 15, sent: false }]
    }));
  };

  const removeReminder = (index) => {
    setFormData(prev => ({
      ...prev,
      reminders: prev.reminders.filter((_, i) => i !== index)
    }));
  };

  const updateReminder = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      reminders: prev.reminders.map((reminder, i) => 
        i === index ? { ...reminder, [field]: value } : reminder
      )
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.start) {
      newErrors.start = 'Start date is required';
    }

    if (!formData.end) {
      newErrors.end = 'End date is required';
    }

    if (formData.start && formData.end && new Date(formData.start) >= new Date(formData.end)) {
      newErrors.end = 'End date must be after start date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const eventData = {
        ...formData,
        start: new Date(formData.start).toISOString(),
        end: new Date(formData.end).toISOString()
      };
      
      await onSave(eventData);
    } catch (error) {
      console.error('Error saving event:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { value: 'work', label: 'Work', color: '#ef4444' },
    { value: 'personal', label: 'Personal', color: '#10b981' },
    { value: 'meeting', label: 'Meeting', color: '#3b82f6' },
    { value: 'birthday', label: 'Birthday', color: '#f59e0b' },
    { value: 'holiday', label: 'Holiday', color: '#8b5cf6' },
    { value: 'other', label: 'Other', color: '#6b7280' }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Title *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={`input ${errors.title ? 'border-red-300' : ''}`}
          placeholder="Event title"
        />
        {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="input"
          placeholder="Event description"
        />
      </div>

      {/* Date and Time */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="start" className="block text-sm font-medium text-gray-700 mb-1">
            Start Date & Time *
          </label>
          <input
            type="datetime-local"
            id="start"
            name="start"
            value={formData.start}
            onChange={handleChange}
            className={`input ${errors.start ? 'border-red-300' : ''}`}
          />
          {errors.start && <p className="mt-1 text-sm text-red-600">{errors.start}</p>}
        </div>

        <div>
          <label htmlFor="end" className="block text-sm font-medium text-gray-700 mb-1">
            End Date & Time *
          </label>
          <input
            type="datetime-local"
            id="end"
            name="end"
            value={formData.end}
            onChange={handleChange}
            className={`input ${errors.end ? 'border-red-300' : ''}`}
          />
          {errors.end && <p className="mt-1 text-sm text-red-600">{errors.end}</p>}
        </div>
      </div>

      {/* All Day */}
      <div className="flex items-center">
        <input
          type="checkbox"
          id="allDay"
          name="allDay"
          checked={formData.allDay}
          onChange={handleChange}
          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
        />
        <label htmlFor="allDay" className="ml-2 block text-sm text-gray-900">
          All day event
        </label>
      </div>

      {/* Location */}
      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
          Location
        </label>
        <input
          type="text"
          id="location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          className="input"
          placeholder="Event location"
        />
      </div>

      {/* Category */}
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
          Category
        </label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="input"
        >
          {categories.map(cat => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      {/* Color */}
      <div>
        <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-1">
          Color
        </label>
        <input
          type="color"
          id="color"
          name="color"
          value={formData.color}
          onChange={handleChange}
          className="h-10 w-20 border border-gray-300 rounded"
        />
      </div>

      {/* Recurring */}
      <div className="space-y-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isRecurring"
            checked={formData.recurring.isRecurring}
            onChange={(e) => handleRecurringChange('isRecurring', e.target.checked)}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label htmlFor="isRecurring" className="ml-2 block text-sm text-gray-900">
            Recurring event
          </label>
        </div>

        {formData.recurring.isRecurring && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pl-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pattern
              </label>
              <select
                value={formData.recurring.pattern}
                onChange={(e) => handleRecurringChange('pattern', e.target.value)}
                className="input"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Interval
              </label>
              <input
                type="number"
                min="1"
                value={formData.recurring.interval}
                onChange={(e) => handleRecurringChange('interval', parseInt(e.target.value))}
                className="input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={formData.recurring.endDate}
                onChange={(e) => handleRecurringChange('endDate', e.target.value)}
                className="input"
              />
            </div>
          </div>
        )}
      </div>

      {/* Reminders */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700">
            Reminders
          </label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addReminder}
          >
            Add Reminder
          </Button>
        </div>

        {formData.reminders.map((reminder, index) => (
          <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
            <select
              value={reminder.type}
              onChange={(e) => updateReminder(index, 'type', e.target.value)}
              className="input flex-1"
            >
              <option value="email">Email</option>
              <option value="push">Push</option>
              <option value="sms">SMS</option>
            </select>

            <input
              type="number"
              min="1"
              value={reminder.time}
              onChange={(e) => updateReminder(index, 'time', parseInt(e.target.value))}
              className="input w-20"
            />

            <span className="text-sm text-gray-600">minutes before</span>

            <Button
              type="button"
              variant="danger"
              size="sm"
              onClick={() => removeReminder(index)}
            >
              Remove
            </Button>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          loading={loading}
        >
          {event?._id ? 'Update Event' : 'Create Event'}
        </Button>
      </div>
    </form>
  );
};

export default EventForm; 