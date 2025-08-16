const express = require('express');
const router = express.Router();

// @route   GET api/database-status
// @desc    Check database connection status (public)
// @access  Public
router.get('/api/database-status', async (req, res) => {
  try {
    const mongoose = require('mongoose');
    const dbStatus = {
      readyState: mongoose.connection.readyState,
      connected: mongoose.connection.readyState === 1,
      host: mongoose.connection.host,
      port: mongoose.connection.port,
      name: mongoose.connection.name
    };
    
    console.log('🔍 Database status:', dbStatus);
    
    if (dbStatus.connected) {
      // Try to count transactions
      const Transaction = require('../models/Transaction');
      const transactionCount = await Transaction.countDocuments();
      const pendingDeposits = await Transaction.countDocuments({ type: 'deposit', status: 'pending' });
      
      res.json({
        success: true,
        database: dbStatus,
        stats: {
          totalTransactions: transactionCount,
          pendingDeposits: pendingDeposits
        }
      });
    } else {
      res.status(500).json({
        success: false,
        database: dbStatus,
        error: 'Database not connected'
      });
    }
  } catch (err) {
    console.error('Database status check error:', err.message);
    res.status(500).json({ 
      success: false, 
      error: err.message 
    });
  }
});

// API Routes
router.use('/api/auth', require('./api/auth'));
router.use('/api/wallet', require('./api/wallet'));
router.use('/api/investments', require('./api/investments'));
router.use('/api/investment-plans', require('./api/investmentPlans'));
router.use('/api/crypto', require('./api/crypto'));
router.use('/api/admin', require('./api/admin'));
router.use('/api/cryptos', require('./api/cryptos'));

module.exports = router;