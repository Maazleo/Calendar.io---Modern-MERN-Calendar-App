const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  start: {
    type: Date,
    required: [true, 'Start date is required']
  },
  end: {
    type: Date,
    required: [true, 'End date is required']
  },
  allDay: {
    type: Boolean,
    default: false
  },
  location: {
    type: String,
    trim: true,
    maxlength: [200, 'Location cannot exceed 200 characters']
  },
  category: {
    type: String,
    enum: ['work', 'personal', 'meeting', 'birthday', 'holiday', 'other'],
    default: 'other'
  },
  color: {
    type: String,
    default: '#3788d8'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  attendees: [{
    email: {
      type: String,
      required: true
    },
    name: String,
    response: {
      type: String,
      enum: ['pending', 'accepted', 'declined'],
      default: 'pending'
    }
  }],
  reminders: [{
    type: {
      type: String,
      enum: ['email', 'push', 'sms'],
      default: 'email'
    },
    time: {
      type: Number, // minutes before event
      default: 15
    },
    sent: {
      type: Boolean,
      default: false
    }
  }],
  recurring: {
    isRecurring: {
      type: Boolean,
      default: false
    },
    pattern: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'yearly'],
      default: 'weekly'
    },
    interval: {
      type: Number,
      default: 1
    },
    endDate: Date,
    exceptions: [Date] // dates where recurring event doesn't occur
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    trim: true
  }],
  attachments: [{
    name: String,
    url: String,
    size: Number,
    type: String
  }],
  notes: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['active', 'cancelled', 'completed'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Index for efficient queries
eventSchema.index({ user: 1, start: 1, end: 1 });
eventSchema.index({ start: 1, end: 1 });
eventSchema.index({ category: 1 });

// Virtual for event duration
eventSchema.virtual('duration').get(function() {
  return this.end - this.start;
});

// Method to check if event is happening now
eventSchema.methods.isHappeningNow = function() {
  const now = new Date();
  return this.start <= now && this.end >= now;
};

// Method to get upcoming events
eventSchema.statics.getUpcomingEvents = function(userId, limit = 10) {
  return this.find({
    user: userId,
    start: { $gte: new Date() },
    status: 'active'
  })
  .sort({ start: 1 })
  .limit(limit);
};

// Method to get events by date range
eventSchema.statics.getEventsByDateRange = function(userId, startDate, endDate) {
  return this.find({
    user: userId,
    $or: [
      { start: { $gte: startDate, $lte: endDate } },
      { end: { $gte: startDate, $lte: endDate } },
      { start: { $lte: startDate }, end: { $gte: endDate } }
    ],
    status: 'active'
  }).sort({ start: 1 });
};

// Ensure virtual fields are serialized
eventSchema.set('toJSON', { virtuals: true });
eventSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Event', eventSchema); 