const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const auth = require('../../middleware/auth');
const ensureWallet = require('../../middleware/ensureWallet');
const walletController = require('../../controllers/walletController');

// @route   GET api/wallet
// @desc    Get user wallet
// @access  Private
router.get('/', auth, ensureWallet, walletController.getWallet);

// @route   POST api/wallet/deposit
// @desc    Deposit funds to wallet
// @access  Private
router.post(
  '/deposit',
  [
    auth,
    ensureWallet,
    check('amount', 'Amount is required and must be greater than 0').isFloat({ min: 0.01 }),
    check('paymentMethod', 'Payment method is required').not().isEmpty()
  ],
  walletController.deposit
);

// @route   POST api/wallet/withdraw
// @desc    Request withdrawal
// @access  Private
router.post(
  '/withdraw',
  [
    auth,
    ensureWallet,
    check('amount', 'Amount is required and must be greater than 0').isFloat({ min: 0.01 }),
    check('paymentMethod', 'Payment method is required').not().isEmpty(),
    check('paymentDetails', 'Payment details are required').not().isEmpty()
  ],
  walletController.requestWithdrawal
);

// @route   GET api/wallet/transactions
// @desc    Get user transactions
// @access  Private
router.get('/transactions', auth, ensureWallet, walletController.getTransactions);

module.exports = router;