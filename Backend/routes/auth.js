const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  logout
} = require('../controllers/authController');

const { protect } = require('../middleware/auth');

// Validation middleware
const validateRegistration = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
];

const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

const validateProfileUpdate = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email')
];

const validatePasswordChange = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long')
];

// Routes
router.post('/register', validateRegistration, register);
router.post('/login', validateLogin, login);
router.get('/me', protect, getMe);
router.put('/profile', protect, validateProfileUpdate, updateProfile);
router.put('/change-password', protect, validatePasswordChange, changePassword);
router.post('/logout', protect, logout);

module.exports = router; 