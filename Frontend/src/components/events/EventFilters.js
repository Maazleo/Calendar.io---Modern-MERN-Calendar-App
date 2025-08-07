import React, { useState } from 'react';
import { useEvents } from '../../contexts/EventContext';
import Button from '../ui/Button';

const EventFilters = ({ onClose }) => {
  const { filters, updateFilters, clearFilters } = useEvents();
  const [localFilters, setLocalFilters] = useState({
    start: filters.start || '',
    end: filters.end || '',
    category: filters.category || '',
    search: filters.search || '',
    status: filters.status || 'active'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleApply = () => {
    updateFilters(localFilters);
    onClose();
  };

  const handleClear = () => {
    clearFilters();
    setLocalFilters({
      start: '',
      end: '',
      category: '',
      search: '',
      status: 'active'
    });
  };

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'work', label: 'Work' },
    { value: 'personal', label: 'Personal' },
    { value: 'meeting', label: 'Meeting' },
    { value: 'birthday', label: 'Birthday' },
    { value: 'holiday', label: 'Holiday' },
    { value: 'other', label: 'Other' }
  ];

  const statuses = [
    { value: 'active', label: 'Active' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'completed', label: 'Completed' }
  ];

  return (
    <div className="space-y-6">
      {/* Search */}
      <div>
        <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
          Search Events
        </label>
        <input
          type="text"
          id="search"
          name="search"
          value={localFilters.search}
          onChange={handleChange}
          className="input"
          placeholder="Search by title or description..."
        />
      </div>

      {/* Date Range */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="start" className="block text-sm font-medium text-gray-700 mb-1">
            Start Date
          </label>
          <input
            type="date"
            id="start"
            name="start"
            value={localFilters.start}
            onChange={handleChange}
            className="input"
          />
        </div>

        <div>
          <label htmlFor="end" className="block text-sm font-medium text-gray-700 mb-1">
            End Date
          </label>
          <input
            type="date"
            id="end"
            name="end"
            value={localFilters.end}
            onChange={handleChange}
            className="input"
          />
        </div>
      </div>

      {/* Category */}
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
          Category
        </label>
        <select
          id="category"
          name="category"
          value={localFilters.category}
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

      {/* Status */}
      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
          Status
        </label>
        <select
          id="status"
          name="status"
          value={localFilters.status}
          onChange={handleChange}
          className="input"
        >
          {statuses.map(status => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>
      </div>

      {/* Quick Filters */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Quick Filters</h4>
        <div className="grid grid-cols-2 gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              const today = new Date();
              const nextWeek = new Date();
              nextWeek.setDate(today.getDate() + 7);
              
              setLocalFilters(prev => ({
                ...prev,
                start: today.toISOString().split('T')[0],
                end: nextWeek.toISOString().split('T')[0]
              }));
            }}
          >
            Next 7 Days
          </Button>
          
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              const today = new Date();
              const nextMonth = new Date();
              nextMonth.setMonth(today.getMonth() + 1);
              
              setLocalFilters(prev => ({
                ...prev,
                start: today.toISOString().split('T')[0],
                end: nextMonth.toISOString().split('T')[0]
              }));
            }}
          >
            Next 30 Days
          </Button>
          
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setLocalFilters(prev => ({
                ...prev,
                category: 'work'
              }));
            }}
          >
            Work Events
          </Button>
          
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setLocalFilters(prev => ({
                ...prev,
                category: 'personal'
              }));
            }}
          >
            Personal Events
          </Button>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between pt-4 border-t border-gray-200">
        <Button
          type="button"
          variant="outline"
          onClick={handleClear}
        >
          Clear All
        </Button>
        
        <div className="flex space-x-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleApply}
          >
            Apply Filters
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EventFilters; 