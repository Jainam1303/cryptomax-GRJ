const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const auth = require('../../middleware/auth');
const authController = require('../../controllers/authController');

// @route   POST api/auth/register
// @desc    Register user
// @access  Public
router.post(
  '/register',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be at least 6 characters').isLength({ min: 6 })
  ],
  authController.register
);

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  authController.login
);

// @route   GET api/auth/user
// @desc    Get user data
// @access  Private
router.get('/user', auth, authController.getUser);

// KYC endpoints
// @route   POST api/auth/kyc/submit
// @desc    Submit KYC info
// @access  Private
router.post('/kyc/submit', auth, authController.submitKyc);

// @route   GET api/auth/kyc/status
// @desc    Get current KYC status
// @access  Private
router.get('/kyc/status', auth, authController.getKycStatus);

module.exports = router;