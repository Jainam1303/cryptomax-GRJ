const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const cryptoController = require('../../controllers/cryptoController');
const adminController = require('../../controllers/adminController');

// @route   GET api/crypto
// @desc    Get all cryptocurrencies
// @access  Private
router.get('/', auth, cryptoController.getCryptos);

// @route   GET api/crypto/market-data
// @desc    Get market overview data
// @access  Private
router.get('/market-data', auth, cryptoController.getMarketData);

// @route   GET api/crypto/:id
// @desc    Get cryptocurrency by ID
// @access  Private
router.get('/:id', auth, cryptoController.getCryptoById);

// @route   GET api/crypto/:id/price-history
// @desc    Get cryptocurrency price history
// @access  Private
router.get('/:id/price-history', auth, cryptoController.getPriceHistory);

// Public: Get deposit wallet info
router.get('/deposit-wallets/:coin', adminController.getDepositWallet);

module.exports = router;