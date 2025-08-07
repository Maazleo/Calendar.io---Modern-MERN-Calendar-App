const Event = require('../models/Event');

// @desc    Get all events for a user
// @route   GET /api/events
// @access  Private
exports.getEvents = async (req, res) => {
  try {
    const { 
      start, 
      end, 
      category, 
      search, 
      page = 1, 
      limit = 20,
      status = 'active'
    } = req.query;

    const query = { user: req.user.id };

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Filter by date range
    if (start && end) {
      query.$or = [
        { start: { $gte: new Date(start), $lte: new Date(end) } },
        { end: { $gte: new Date(start), $lte: new Date(end) } },
        { start: { $lte: new Date(start) }, end: { $gte: new Date(end) } }
      ];
    }

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Search by title or description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;

    const events = await Event.find(query)
      .sort({ start: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Event.countDocuments(query);

    res.status(200).json({
      status: 'success',
      data: {
        events,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalEvents: total,
          hasNextPage: page * limit < total,
          hasPrevPage: page > 1
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Private
exports.getEvent = async (req, res) => {
  try {
    const event = await Event.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!event) {
      return res.status(404).json({
        status: 'error',
        message: 'Event not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: { event }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Create new event
// @route   POST /api/events
// @access  Private
exports.createEvent = async (req, res) => {
  try {
    const eventData = {
      ...req.body,
      user: req.user.id
    };

    const event = await Event.create(eventData);

    res.status(201).json({
      status: 'success',
      message: 'Event created successfully',
      data: { event }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private
exports.updateEvent = async (req, res) => {
  try {
    let event = await Event.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!event) {
      return res.status(404).json({
        status: 'error',
        message: 'Event not found'
      });
    }

    event = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      status: 'success',
      message: 'Event updated successfully',
      data: { event }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!event) {
      return res.status(404).json({
        status: 'error',
        message: 'Event not found'
      });
    }

    await Event.findByIdAndDelete(req.params.id);

    res.status(200).json({
      status: 'success',
      message: 'Event deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Get upcoming events
// @route   GET /api/events/upcoming
// @access  Private
exports.getUpcomingEvents = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const events = await Event.getUpcomingEvents(req.user.id, parseInt(limit));

    res.status(200).json({
      status: 'success',
      data: { events }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Get events by date range
// @route   GET /api/events/range
// @access  Private
exports.getEventsByDateRange = async (req, res) => {
  try {
    const { start, end } = req.query;

    if (!start || !end) {
      return res.status(400).json({
        status: 'error',
        message: 'Start and end dates are required'
      });
    }

    const events = await Event.getEventsByDateRange(
      req.user.id,
      new Date(start),
      new Date(end)
    );

    res.status(200).json({
      status: 'success',
      data: { events }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Get events by category
// @route   GET /api/events/category/:category
// @access  Private
exports.getEventsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const skip = (page - 1) * limit;

    const events = await Event.find({
      user: req.user.id,
      category,
      status: 'active'
    })
    .sort({ start: 1 })
    .skip(skip)
    .limit(parseInt(limit));

    const total = await Event.countDocuments({
      user: req.user.id,
      category,
      status: 'active'
    });

    res.status(200).json({
      status: 'success',
      data: {
        events,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalEvents: total
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Bulk update events
// @route   PUT /api/events/bulk
// @access  Private
exports.bulkUpdateEvents = async (req, res) => {
  try {
    const { eventIds, updates } = req.body;

    if (!eventIds || !Array.isArray(eventIds) || eventIds.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Event IDs array is required'
      });
    }

    const result = await Event.updateMany(
      {
        _id: { $in: eventIds },
        user: req.user.id
      },
      updates
    );

    res.status(200).json({
      status: 'success',
      message: `${result.modifiedCount} events updated successfully`,
      data: { modifiedCount: result.modifiedCount }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
}; 