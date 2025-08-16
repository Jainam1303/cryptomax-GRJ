const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const auth = require('../../middleware/auth');
const admin = require('../../middleware/admin');
const investmentPlanController = require('../../controllers/investmentPlanController');

// @route   GET api/investment-plans
// @desc    Get all investment plans
// @access  Public
router.get('/', investmentPlanController.getInvestmentPlans);

// @route   GET api/investment-plans/:id
// @desc    Get investment plan by ID
// @access  Public
router.get('/:id', investmentPlanController.getInvestmentPlanById);

// @route   POST api/investment-plans
// @desc    Create new investment plan (Admin only)
// @access  Private (Admin)
router.post(
  '/',
  [
    auth,
    admin,
    [
      check('name', 'Name is required').not().isEmpty(),
      check('cryptoId', 'Cryptocurrency ID is required').not().isEmpty(),
      check('minAmount', 'Minimum amount must be at least $100').isFloat({ min: 100 }),
      check('maxAmount', 'Maximum amount must be at most $10,000').isFloat({ max: 10000 }),
      check('dailyReturnPercentage', 'Daily return percentage must be between 0.1% and 5%').isFloat({ min: 0.1, max: 5 }),
      check('duration', 'Duration must be between 30 and 365 days').isInt({ min: 30, max: 365 }),
      check('description', 'Description is required').not().isEmpty()
    ]
  ],
  investmentPlanController.createInvestmentPlan
);

// @route   PUT api/investment-plans/:id
// @desc    Update investment plan (Admin only)
// @access  Private (Admin)
router.put(
  '/:id',
  [
    auth,
    admin,
    [
      check('minAmount', 'Minimum amount must be at least $100').optional().isFloat({ min: 100 }),
      check('maxAmount', 'Maximum amount must be at most $10,000').optional().isFloat({ max: 10000 }),
      check('dailyReturnPercentage', 'Daily return percentage must be between 0.1% and 5%').optional().isFloat({ min: 0.1, max: 5 }),
      check('duration', 'Duration must be between 30 and 365 days').optional().isInt({ min: 30, max: 365 })
    ]
  ],
  investmentPlanController.updateInvestmentPlan
);

// @route   DELETE api/investment-plans/:id
// @desc    Delete investment plan (Admin only)
// @access  Private (Admin)
router.delete('/:id', [auth, admin], investmentPlanController.deleteInvestmentPlan);

module.exports = router; 