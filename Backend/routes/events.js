const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  getUpcomingEvents,
  getEventsByDateRange,
  getEventsByCategory,
  bulkUpdateEvents
} = require('../controllers/eventController');

const { protect } = require('../middleware/auth');

// Validation middleware
const validateEvent = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be between 1 and 100 characters'),
  body('start')
    .isISO8601()
    .withMessage('Start date must be a valid date'),
  body('end')
    .isISO8601()
    .withMessage('End date must be a valid date'),
  body('category')
    .optional()
    .isIn(['work', 'personal', 'meeting', 'birthday', 'holiday', 'other'])
    .withMessage('Invalid category'),
  body('color')
    .optional()
    .matches(/^#[0-9A-F]{6}$/i)
    .withMessage('Color must be a valid hex color')
];

const validateEventUpdate = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be between 1 and 100 characters'),
  body('start')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid date'),
  body('end')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid date'),
  body('category')
    .optional()
    .isIn(['work', 'personal', 'meeting', 'birthday', 'holiday', 'other'])
    .withMessage('Invalid category'),
  body('color')
    .optional()
    .matches(/^#[0-9A-F]{6}$/i)
    .withMessage('Color must be a valid hex color')
];

// All routes require authentication
router.use(protect);

// Routes
router.route('/')
  .get(getEvents)
  .post(validateEvent, createEvent);

router.route('/:id')
  .get(getEvent)
  .put(validateEventUpdate, updateEvent)
  .delete(deleteEvent);

router.get('/upcoming', getUpcomingEvents);
router.get('/range', getEventsByDateRange);
router.get('/category/:category', getEventsByCategory);
router.put('/bulk', bulkUpdateEvents);

module.exports = router; 