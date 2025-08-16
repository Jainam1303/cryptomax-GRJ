const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const auth = require('../../middleware/auth');
const ensureWallet = require('../../middleware/ensureWallet');
const investmentController = require('../../controllers/investmentController');

// @route   GET api/investments
// @desc    Get user investments
// @access  Private
router.get('/', auth, investmentController.getInvestments);

// @route   POST api/investments
// @desc    Create new investment
// @access  Private
router.post(
  '/',
  [
    auth,
    ensureWallet,
    check('cryptoId', 'Cryptocurrency ID is required').not().isEmpty(),
    check('amount', 'Amount is required and must be greater than 0').isFloat({ min: 0.01 })
  ],
  investmentController.createInvestment
);

// @route   PUT api/investments/:id/sell
// @desc    Sell investment
// @access  Private
router.put('/:id/sell', auth, investmentController.sellInvestment);

// @route   GET api/investments/portfolio
// @desc    Get portfolio summary
// @access  Private
router.get('/portfolio', auth, investmentController.getPortfolio);

module.exports = router;