const cron = require('node-cron');
const Event = require('../models/Event');
const User = require('../models/User');
const { sendEventReminder } = require('./emailService');

// Check for events that need reminders every minute
const checkEventReminders = async () => {
  try {
    const now = new Date();
    
    // Find events that need reminders
    const events = await Event.find({
      status: 'active',
      'reminders.sent': false,
      start: { $gt: now }
    }).populate('user', 'email name preferences');

    for (const event of events) {
      for (const reminder of event.reminders) {
        if (reminder.sent) continue;

        const reminderTime = new Date(event.start.getTime() - (reminder.time * 60 * 1000));
        
        // Check if it's time to send the reminder
        if (now >= reminderTime && now < reminderTime.getTime() + 60000) { // Within 1 minute window
          if (reminder.type === 'email' && event.user.preferences.emailNotifications) {
            const emailSent = await sendEventReminder(event.user, event);
            
            if (emailSent) {
              // Mark reminder as sent
              reminder.sent = true;
              await event.save();
              console.log(`Reminder sent for event: ${event.title}`);
            }
          }
        }
      }
    }
  } catch (error) {
    console.error('Error checking event reminders:', error);
  }
};

// Clean up old events daily at 2 AM
const cleanupOldEvents = async () => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const result = await Event.deleteMany({
      end: { $lt: thirtyDaysAgo },
      status: { $in: ['cancelled', 'completed'] }
    });

    console.log(`Cleaned up ${result.deletedCount} old events`);
  } catch (error) {
    console.error('Error cleaning up old events:', error);
  }
};

// Generate recurring events weekly
const generateRecurringEvents = async () => {
  try {
    const recurringEvents = await Event.find({
      'recurring.isRecurring': true,
      status: 'active'
    });

    for (const event of recurringEvents) {
      const lastOccurrence = event.recurring.endDate || event.end;
      const nextOccurrence = new Date(lastOccurrence);

      // Calculate next occurrence based on pattern
      switch (event.recurring.pattern) {
        case 'daily':
          nextOccurrence.setDate(nextOccurrence.getDate() + event.recurring.interval);
          break;
        case 'weekly':
          nextOccurrence.setDate(nextOccurrence.getDate() + (7 * event.recurring.interval));
          break;
        case 'monthly':
          nextOccurrence.setMonth(nextOccurrence.getMonth() + event.recurring.interval);
          break;
        case 'yearly':
          nextOccurrence.setFullYear(nextOccurrence.getFullYear() + event.recurring.interval);
          break;
      }

      // Create next occurrence if it's within the next 30 days
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

      if (nextOccurrence <= thirtyDaysFromNow) {
        const newEvent = new Event({
          ...event.toObject(),
          _id: undefined,
          start: nextOccurrence,
          end: new Date(nextOccurrence.getTime() + (event.end - event.start)),
          reminders: event.reminders.map(r => ({ ...r, sent: false }))
        });

        await newEvent.save();
        console.log(`Generated recurring event: ${event.title}`);
      }
    }
  } catch (error) {
    console.error('Error generating recurring events:', error);
  }
};

// Start all cron jobs
const startCronJobs = () => {
  console.log('🕐 Starting cron jobs...');

  // Check reminders every minute
  cron.schedule('* * * * *', checkEventReminders, {
    scheduled: true,
    timezone: 'UTC'
  });

  // Clean up old events daily at 2 AM
  cron.schedule('0 2 * * *', cleanupOldEvents, {
    scheduled: true,
    timezone: 'UTC'
  });

  // Generate recurring events weekly on Sunday at 1 AM
  cron.schedule('0 1 * * 0', generateRecurringEvents, {
    scheduled: true,
    timezone: 'UTC'
  });

  console.log('✅ Cron jobs started successfully');
};

// Stop all cron jobs
const stopCronJobs = () => {
  cron.getTasks().forEach(task => task.stop());
  console.log('🛑 Cron jobs stopped');
};

module.exports = {
  startCronJobs,
  stopCronJobs,
  checkEventReminders,
  cleanupOldEvents,
  generateRecurringEvents
}; 