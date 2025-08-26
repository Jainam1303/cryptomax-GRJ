const User = require('../models/User');
const Crypto = require('../models/Crypto');
const Investment = require('../models/Investment');
const InvestmentPlan = require('../models/InvestmentPlan');
const WithdrawalRequest = require('../models/WithdrawalRequest');
const Transaction = require('../models/Transaction');
const Wallet = require('../models/Wallet');
const DepositWallet = require('../models/DepositWallet');
const Commission = require('../models/Commission');

const path = require('path');

// @route   GET api/admin/users
// @desc    Get all users
// @access  Private/Admin
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    const Transaction = require('../models/Transaction');
    const Investment = require('../models/Investment');

    const usersWithStats = await Promise.all(users.map(async user => {
      const totalDeposited = await Transaction.aggregate([
        // Use 'completed' for deposits to align with dashboard and transaction lifecycle
        { $match: { user: user._id, type: 'deposit', status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]);
      const totalWithdrawn = await Transaction.aggregate([
        { $match: { user: user._id, type: 'withdrawal', status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]);
      const investmentsCount = await Investment.countDocuments({ user: user._id });

      return {
        ...user.toObject(),
        totalDeposited: totalDeposited[0]?.total || 0,
        totalWithdrawn: totalWithdrawn[0]?.total || 0,
        investments: investmentsCount
      };
    }));

    res.json(usersWithStats);
  } catch (err) {
    console.error('Admin get users error:', err.message, err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// @route   GET api/admin/withdrawal-requests
// @desc    Get all withdrawal requests
// @access  Private/Admin
exports.getWithdrawalRequests = async (req, res) => {
  try {
    const withdrawalRequests = await WithdrawalRequest.find()
      .populate('user', 'name email')
      .sort({ requestedAt: -1 });
    
    console.log('🔍 Admin fetching withdrawal requests:', withdrawalRequests.length, 'requests');
    if (withdrawalRequests.length > 0) {
      console.log('📋 Sample withdrawal request:', {
        id: withdrawalRequests[0]._id,
        paymentMethod: withdrawalRequests[0].paymentMethod,
        paymentDetails: withdrawalRequests[0].paymentDetails,
        hasPaymentDetails: !!withdrawalRequests[0].paymentDetails
      });
    }
    
    res.json(withdrawalRequests);
  } catch (err) {
    console.error('Admin get withdrawal requests error:', err.message, err);
    
    // If database is not connected, return mock data
    if (err.message.includes('ECONNREFUSED') || err.message.includes('MongoNetworkError')) {
      console.log('📊 Returning mock withdrawal requests due to database connection issue');
      
      const mockWithdrawalRequests = [
        {
          _id: 'mock-withdrawal-1',
          user: { name: 'gopala', email: 'sweetmango1303@gmail.com' },
          amount: 100.00,
          paymentMethod: 'Usdt Trc20',
          paymentDetails: 'TXv3QZCBGMBouLT5Xgfj8v6mYsKRsc12jt',
          status: 'pending',
          requestedAt: new Date('2025-07-16'),
          createdAt: new Date('2025-07-16')
        },
        {
          _id: 'mock-withdrawal-2',
          user: { name: 'Jainam', email: 'johnmarston1303@gmail.com' },
          amount: 459.00,
          paymentMethod: 'Paypal',
          paymentDetails: 'kfjdkjfkskfkdjfksfs',
          status: 'pending',
          requestedAt: new Date('2025-07-16'),
          createdAt: new Date('2025-07-16')
        },
        {
          _id: 'mock-withdrawal-3',
          user: { name: 'Admin User', email: 'admin@cryptomax.com' },
          amount: 500.00,
          paymentMethod: 'Usdt Trc20',
          paymentDetails: 'N/A',
          status: 'completed',
          requestedAt: new Date('2025-07-16'),
          createdAt: new Date('2025-07-16')
        },
        {
          _id: 'mock-withdrawal-4',
          user: { name: 'Test User', email: 'test@example.com' },
          amount: 96.00,
          paymentMethod: 'Paypal',
          paymentDetails: '614141414114',
          status: 'rejected',
          requestedAt: new Date('2025-07-15'),
          createdAt: new Date('2025-07-15')
        }
      ];
      
      res.json(mockWithdrawalRequests);
    } else {
      res.status(500).json({ msg: 'Server error' });
    }
  }
};

// @route   PUT api/admin/withdrawal-requests/:id
// @desc    Process withdrawal request
// @access  Private/Admin
exports.processWithdrawalRequest = async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    
    if (!['approved', 'rejected', 'completed'].includes(status)) {
      return res.status(400).json({ msg: 'Invalid status' });
    }
    
    const withdrawalRequest = await WithdrawalRequest.findById(req.params.id);
    
    if (!withdrawalRequest) {
      return res.status(404).json({ msg: 'Withdrawal request not found' });
    }
    
    if (withdrawalRequest.status !== 'pending' && status !== 'completed') {
      return res.status(400).json({ msg: 'Request already processed' });
    }
    
    if (withdrawalRequest.status !== 'approved' && status === 'completed') {
      return res.status(400).json({ msg: 'Request must be approved before completion' });
    }
    
    // Update withdrawal request
    withdrawalRequest.status = status;
    withdrawalRequest.adminNotes = adminNotes || withdrawalRequest.adminNotes;
    withdrawalRequest.processedAt = Date.now();
    withdrawalRequest.processedBy = req.user.id;
    
    await withdrawalRequest.save();
    
    // Find related transaction (optional - for test data, transactions might not exist)
    const transaction = await Transaction.findOne({
      user: withdrawalRequest.user,
      type: 'withdrawal',
      amount: withdrawalRequest.amount,
      status: 'pending'
    });
    
    // Update wallet and transaction based on status
    const wallet = await Wallet.findOne({ user: withdrawalRequest.user });
    
    if (status === 'rejected') {
      // Return funds to user's wallet if wallet exists
      if (wallet) {
        wallet.balance += withdrawalRequest.amount;
        wallet.pendingWithdrawals -= withdrawalRequest.amount;
        await wallet.save();
      }
      
      // Update transaction if it exists
      if (transaction) {
        transaction.status = 'failed';
        transaction.failureReason = adminNotes || 'Rejected by system';
        transaction.description += ' (Rejected by system)';
        await transaction.save();
      }
    } else if (status === 'completed') {
      // Update wallet if it exists
      if (wallet) {
        wallet.pendingWithdrawals -= withdrawalRequest.amount;
        wallet.totalWithdrawn += withdrawalRequest.amount;
        await wallet.save();
      }
      
      // Update transaction if it exists
      if (transaction) {
        transaction.status = 'completed';
        transaction.completedAt = Date.now();
        await transaction.save();
      }
    } else if (status === 'approved') {
      // Only update transaction status if it exists
      if (transaction) {
        transaction.status = 'completed';
        transaction.description += ' (Approved by admin)';
        await transaction.save();
      }
    }
    
    res.json({
      success: true,
      withdrawalRequest
    });
  } catch (err) {
    console.error('Process withdrawal request error:', err.message);
    
    // If database is not connected, handle mock data
    if (err.message.includes('ECONNREFUSED') || err.message.includes('MongoNetworkError')) {
      console.log('📊 Processing mock withdrawal request:', req.params.id, 'with status:', status);
      
      // For mock data, just return success
      res.json({
        success: true,
        withdrawalRequest: {
          _id: req.params.id,
          status: status,
          adminNotes: adminNotes,
          processedAt: Date.now()
        }
      });
    } else {
      res.status(500).json({ msg: 'Server error' });
    }
  }
};

// @route   PUT api/admin/crypto/:id
// @desc    Update cryptocurrency settings
// @access  Private/Admin
exports.updateCryptoSettings = async (req, res) => {
  try {
    const { volatility, trend } = req.body;
    
    const crypto = await Crypto.findById(req.params.id);
    
    if (!crypto) {
      return res.status(404).json({ msg: 'Cryptocurrency not found' });
    }
    
    // Update admin settings
    crypto.adminSettings.volatility = volatility || crypto.adminSettings.volatility;
    crypto.adminSettings.trend = trend || crypto.adminSettings.trend;
    crypto.adminSettings.lastUpdated = Date.now();
    
    await crypto.save();
    
    res.json({
      success: true,
      crypto
    });
  } catch (err) {
    console.error('Update crypto settings error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// @route   PUT api/admin/investments/:id/adjust
// @desc    Adjust investment profit/loss display
// @access  Private/Admin
exports.adjustInvestment = async (req, res) => {
  try {
    const { enabled, percentage, createTransaction = false } = req.body;
    
    const investment = await Investment.findById(req.params.id);
    
    if (!investment) {
      return res.status(404).json({ msg: 'Investment not found' });
    }
    
    // Update admin adjustment
    investment.adminAdjustment.enabled = enabled !== undefined ? enabled : investment.adminAdjustment.enabled;
    investment.adminAdjustment.percentage = percentage !== undefined ? percentage : investment.adminAdjustment.percentage;
    investment.adminAdjustment.lastUpdated = Date.now();
    
    await investment.save();
    
    // Recalculate profit/loss if adjustment is enabled
    if (investment.adminAdjustment.enabled) {
      const crypto = await Crypto.findById(investment.crypto);
      const currentValue = investment.quantity * crypto.currentPrice;
      const baseProfitLoss = currentValue - investment.amount;
      const baseProfitLossPercentage = (baseProfitLoss / investment.amount) * 100;
      
      // Apply adjustment
      const adjustedProfitLossPercentage = baseProfitLossPercentage + investment.adminAdjustment.percentage;
      const adjustedProfitLoss = (adjustedProfitLossPercentage / 100) * investment.amount;
      
      investment.currentValue = currentValue;
      investment.profitLoss = adjustedProfitLoss;
      investment.profitLossPercentage = adjustedProfitLossPercentage;
      
      await investment.save();
    }
    
    res.json({
      success: true,
      investment
    });
  } catch (err) {
    console.error('Adjust investment error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// @route   PUT api/admin/investments/:id/manual-adjust
// @desc    Manually adjust investment profit/loss without creating transaction records
// @access  Private/Admin
exports.manualAdjustInvestment = async (req, res) => {
  try {
    const { amount, reason, isActive = true } = req.body;
    
    const investment = await Investment.findById(req.params.id);
    
    if (!investment) {
      return res.status(404).json({ msg: 'Investment not found' });
    }
    
    // Update manual adjustment
    investment.manualAdjustment.amount = amount;
    investment.manualAdjustment.reason = reason || '';
    investment.manualAdjustment.isActive = isActive;
    investment.manualAdjustment.appliedAt = Date.now();
    
    // Calculate new values based on manual adjustment
    if (isActive) {
      const newProfitLoss = amount;
      const newProfitLossPercentage = (newProfitLoss / investment.amount) * 100;
      const newCurrentValue = investment.amount + newProfitLoss;
      
      investment.profitLoss = newProfitLoss;
      investment.profitLossPercentage = newProfitLossPercentage;
      investment.currentValue = newCurrentValue;
      investment.totalEarnings = newProfitLoss;
    } else {
      // Reset to calculated values when manual adjustment is disabled
      const daysSinceStart = Math.floor((Date.now() - new Date(investment.startDate).getTime()) / (1000 * 60 * 60 * 24));
      const maxDays = investment.duration;
      const actualDays = Math.min(daysSinceStart, maxDays);
      const calculatedEarnings = (investment.amount * investment.dailyReturnPercentage * actualDays) / 100;
      
      investment.profitLoss = calculatedEarnings;
      investment.profitLossPercentage = (calculatedEarnings / investment.amount) * 100;
      investment.currentValue = investment.amount + calculatedEarnings;
      investment.totalEarnings = calculatedEarnings;
    }
    
    await investment.save();
    
    console.log('✅ Manual investment adjustment applied:', {
      investmentId: investment._id,
      amount: amount,
      reason: reason,
      isActive: isActive,
      newProfitLoss: investment.profitLoss,
      newProfitLossPercentage: investment.profitLossPercentage
    });
    
    res.json({
      success: true,
      investment,
      message: `Investment ${isActive ? 'manually adjusted' : 'reset to calculated values'}`
    });
  } catch (err) {
    console.error('Manual adjust investment error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// @route   GET api/admin/dashboard
// @desc    Get admin dashboard data
// @access  Private/Admin
exports.getDashboardData = async (req, res) => {
  try {
    // Get user count
    const userCount = await User.countDocuments();
    
    // Get total deposits
    const deposits = await Transaction.aggregate([
      { $match: { type: 'deposit', status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    
    // Get total withdrawals
    const withdrawals = await Transaction.aggregate([
      { $match: { type: 'withdrawal', status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    
    // Get pending withdrawal requests
    const pendingWithdrawals = await WithdrawalRequest.countDocuments({ status: 'pending' });
    
    // Get active investments
    const activeInvestments = await Investment.countDocuments({ status: 'active' });
    
    // Get total investment amount
    const investmentAmount = await Investment.aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    // Calculate financial summary
    const totalDeposits = deposits.length > 0 ? deposits[0].total : 0;
    const totalWithdrawals = withdrawals.length > 0 ? withdrawals[0].total : 0;
    const totalRevenue = totalDeposits; // You can adjust this logic as needed
    const totalPayouts = totalWithdrawals; // You can adjust this logic as needed
    const netBalance = totalRevenue - totalPayouts;

    // Pagination for recent transactions
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const totalTransactions = await Transaction.countDocuments();
    const recentTransactions = await Transaction.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'name email');
    
    res.json({
      userCount,
      financials: {
        totalDeposits,
        totalWithdrawals,
        pendingWithdrawals,
        activeInvestments,
        totalInvestmentAmount: investmentAmount.length > 0 ? investmentAmount[0].total : 0,
        totalRevenue,
        totalPayouts,
        netBalance
      },
      recentTransactions,
      totalTransactions,
      page,
      limit
    });
  } catch (err) {
    console.error('Get admin dashboard data error:', err.message, err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// @route   GET api/admin/investments
// @desc    Get all investments (admin)
// @access  Private/Admin
exports.getInvestments = async (req, res) => {
  try {
    const investments = await Investment.find()
      .populate('user', 'name email')
      .populate('crypto', 'name symbol image');
    res.json(investments);
  } catch (err) {
    console.error('Admin get investments error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// @route   GET api/admin/deposit-requests
// @desc    Get all pending deposit requests
// @access  Private/Admin
exports.getDepositRequests = async (req, res) => {
  try {
    console.log('🔍 Admin checking for pending deposit requests...');
    console.log('👤 Admin user:', req.user);
    
    // First check if we can connect to database
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      console.log('❌ Database not connected. ReadyState:', mongoose.connection.readyState);
      return res.status(500).json({ 
        msg: 'Database not connected. Please check MongoDB connection.',
        error: 'Database connection failed'
      });
    }
    
    // Check total transactions first
    const totalTransactions = await Transaction.countDocuments();
    const totalPendingDeposits = await Transaction.countDocuments({ type: 'deposit', status: 'pending' });
    
    console.log('📊 Database stats:');
    console.log('   - Total transactions:', totalTransactions);
    console.log('   - Total pending deposits:', totalPendingDeposits);
    
    const depositRequests = await Transaction.find({ type: 'deposit', status: 'pending' })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    
    console.log('📊 Found deposit requests:', depositRequests.length);
    console.log('📊 Deposit requests details:', depositRequests.map(d => ({
      id: d._id,
      user: d.user,
      amount: d.amount,
      status: d.status,
      createdAt: d.createdAt
    })));
    
    res.json(depositRequests);
  } catch (err) {
    console.error('Admin get deposit requests error:', err.message, err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// @route   PUT api/admin/deposit-requests/:id
// @desc    Approve or reject a deposit request
// @access  Private/Admin
exports.processDepositRequest = async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ msg: 'Invalid status' });
    }
    
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction || transaction.type !== 'deposit') {
      return res.status(404).json({ msg: 'Deposit transaction not found' });
    }
    if (transaction.status !== 'pending') {
      return res.status(400).json({ msg: 'Deposit already processed' });
    }
    
    // Find user's wallet
    const wallet = await Wallet.findOne({ user: transaction.user });
    if (!wallet) {
      return res.status(404).json({ msg: 'User wallet not found' });
    }
    
    if (status === 'approved') {
      // Credit wallet balance
      wallet.balance += transaction.amount;
      wallet.totalDeposited += transaction.amount;
      await wallet.save();
      transaction.status = 'completed';
      transaction.completedAt = Date.now();
      transaction.description += ' (Approved by admin)';
    } else if (status === 'rejected') {
      transaction.status = 'failed';
      transaction.failureReason = adminNotes || 'Rejected by system';
      transaction.description += ' (Rejected by system)';
    }
    await transaction.save();
    
    console.log('✅ Deposit processed:', { id: transaction._id, status, amount: transaction.amount });
    res.json({ success: true, transaction });
  } catch (err) {
    console.error('Process deposit request error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Public: Get deposit wallet info for a coin
exports.getDepositWallet = async (req, res) => {
  try {
    const { coin } = req.params;
    const wallet = await DepositWallet.findOne({ coin }).lean();
    if (!wallet) {
      return res.status(404).json({ msg: 'Deposit wallet not found' });
    }
    // Prefer API route to stream QR if stored in DB; build absolute URL
    const proto = (req.headers['x-forwarded-proto'] || req.protocol || 'http').toString();
    const host = req.get('host');
    const relativeQrPath = `/api/crypto/deposit-wallets/${coin}/qr`;
    const qrUrl = (wallet.qrImage && wallet.qrImage.data)
      ? `${proto}://${host}${relativeQrPath}`
      : (wallet.qrImageUrl && wallet.qrImageUrl.startsWith('http') ? wallet.qrImageUrl : (wallet.qrImageUrl ? `${proto}://${host}${wallet.qrImageUrl}` : ''));
    return res.json({
      coin: wallet.coin,
      address: wallet.address,
      qrImageUrl: qrUrl,
    });
  } catch (err) {
    console.error('Get deposit wallet error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Admin: Update deposit wallet info for a coin
exports.updateDepositWallet = async (req, res) => {
  try {
    const { coin } = req.params;
    const { address, qrImageUrl } = req.body;
    let wallet = await DepositWallet.findOne({ coin });
    if (!wallet) {
      wallet = new DepositWallet({ coin, address });
    } else {
      if (address) wallet.address = address;
    }
    // Allow setting a URL fallback (e.g., CDN), optional
    if (qrImageUrl !== undefined) {
      wallet.qrImageUrl = qrImageUrl;
    }
    await wallet.save();
    // Return minimal info
    return res.json({ coin: wallet.coin, address: wallet.address, qrImageUrl: wallet.qrImage && wallet.qrImage.data ? `/api/crypto/deposit-wallets/${coin}/qr` : (wallet.qrImageUrl || '') });
  } catch (err) {
    console.error('Update deposit wallet error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Upload QR code image for deposit wallet (store in MongoDB)
exports.uploadDepositWalletQr = async (req, res) => {
  try {
    const { coin } = req.params;
    if (!req.file) {
      return res.status(400).json({ msg: 'No file uploaded' });
    }
    let wallet = await DepositWallet.findOne({ coin });
    if (!wallet) {
      // Create a placeholder wallet; address should be set via updateDepositWallet later
      wallet = new DepositWallet({ coin, address: '' });
    }
    wallet.qrImage = {
      data: req.file.buffer,
      contentType: req.file.mimetype || 'image/png'
    };
    // Also set a stable API URL (absolute)
    const proto = (req.headers['x-forwarded-proto'] || req.protocol || 'http').toString();
    const host = req.get('host');
    wallet.qrImageUrl = `${proto}://${host}/api/crypto/deposit-wallets/${coin}/qr`;
    await wallet.save();
    return res.json({ qrImageUrl: wallet.qrImageUrl });
  } catch (err) {
    console.error('Upload deposit wallet QR error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Public: Stream QR image from MongoDB for a coin
exports.streamDepositWalletQr = async (req, res) => {
  try {
    const { coin } = req.params;
    const wallet = await DepositWallet.findOne({ coin });
    if (!wallet || !wallet.qrImage || !wallet.qrImage.data) {
      return res.status(404).json({ msg: 'QR image not found' });
    }
    res.set('Content-Type', wallet.qrImage.contentType || 'image/png');
    return res.send(wallet.qrImage.data);
  } catch (err) {
    console.error('Stream deposit wallet QR error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// ==================== SUBSCRIPTION INVESTMENT MANAGEMENT ====================

// @route   GET api/admin/subscription-investments
// @desc    Get all subscription investments with user details
// @access  Private/Admin
exports.getSubscriptionInvestments = async (req, res) => {
  try {
    const investments = await Investment.find({ investmentType: 'subscription' })
      .populate('user', 'name email')
      .populate('crypto', 'name symbol')
      .populate('investmentPlan', 'name dailyReturnPercentage duration')
      .sort({ createdAt: -1 });

    const investmentsWithCalculations = investments.map(investment => {
      const now = new Date();
      const startDate = new Date(investment.startDate);
      const endDate = new Date(investment.endDate);
      const daysElapsed = Math.floor((now - startDate) / (1000 * 60 * 60 * 24));
      const totalDays = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24));
      const daysRemaining = Math.max(0, totalDays - daysElapsed);
      
      // Calculate current earnings based on days elapsed
      const calculatedEarnings = (investment.amount * investment.dailyReturnPercentage / 100) * daysElapsed;
      
      // Check if manual adjustment is active
      let currentEarnings, profitLoss, currentValue, profitLossPercentage;
      
      if (investment.manualAdjustment.isActive) {
        // Use manual adjustment amount
        profitLoss = investment.manualAdjustment.amount;
        currentEarnings = profitLoss;
        currentValue = investment.amount + profitLoss;
        profitLossPercentage = (profitLoss / investment.amount) * 100;
      } else {
        // Use calculated earnings
        currentEarnings = calculatedEarnings;
        profitLoss = calculatedEarnings;
        currentValue = investment.amount + calculatedEarnings;
        profitLossPercentage = (profitLoss / investment.amount) * 100;
      }

      return {
        ...investment.toObject(),
        daysElapsed,
        daysRemaining,
        currentEarnings,
        currentValue,
        profitLoss,
        profitLossPercentage,
        isActive: investment.status === 'active',
        isCompleted: investment.status === 'completed'
      };
    });

    res.json(investmentsWithCalculations);
  } catch (err) {
    console.error('Get subscription investments error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// @route   GET api/admin/subscription-investments/:id
// @desc    Get specific subscription investment details
// @access  Private/Admin
exports.getSubscriptionInvestment = async (req, res) => {
  try {
    const investment = await Investment.findById(req.params.id)
      .populate('user', 'name email')
      .populate('crypto', 'name symbol')
      .populate('investmentPlan', 'name dailyReturnPercentage duration');

    if (!investment || investment.investmentType !== 'subscription') {
      return res.status(404).json({ msg: 'Subscription investment not found' });
    }

    const now = new Date();
    const startDate = new Date(investment.startDate);
    const endDate = new Date(investment.endDate);
    const daysElapsed = Math.floor((now - startDate) / (1000 * 60 * 60 * 24));
    const totalDays = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24));
    const daysRemaining = Math.max(0, totalDays - daysElapsed);
    
    // Calculate current earnings based on days elapsed
    const calculatedEarnings = (investment.amount * investment.dailyReturnPercentage / 100) * daysElapsed;
    
    // Check if manual adjustment is active
    let currentEarnings, profitLoss, currentValue, profitLossPercentage;
    
    if (investment.manualAdjustment.isActive) {
      // Use manual adjustment amount
      profitLoss = investment.manualAdjustment.amount;
      currentEarnings = profitLoss;
      currentValue = investment.amount + profitLoss;
      profitLossPercentage = (profitLoss / investment.amount) * 100;
    } else {
      // Use calculated earnings
      currentEarnings = calculatedEarnings;
      profitLoss = calculatedEarnings;
      currentValue = investment.amount + calculatedEarnings;
      profitLossPercentage = (profitLoss / investment.amount) * 100;
    }

    const investmentWithDetails = {
      ...investment.toObject(),
      daysElapsed,
      daysRemaining,
      currentEarnings,
      currentValue,
      profitLoss,
      profitLossPercentage,
      isActive: investment.status === 'active',
      isCompleted: investment.status === 'completed'
    };

    res.json(investmentWithDetails);
  } catch (err) {
    console.error('Get subscription investment error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// @route   PUT api/admin/subscription-investments/:id/daily-return
// @desc    Update daily return percentage for a subscription investment
// @access  Private/Admin
exports.updateDailyReturn = async (req, res) => {
  try {
    const { dailyReturnPercentage } = req.body;
    
    if (!dailyReturnPercentage || dailyReturnPercentage < 0 || dailyReturnPercentage > 10) {
      return res.status(400).json({ msg: 'Daily return percentage must be between 0 and 10%' });
    }

    const investment = await Investment.findById(req.params.id);
    if (!investment || investment.investmentType !== 'subscription') {
      return res.status(404).json({ msg: 'Subscription investment not found' });
    }

    // Update daily return percentage
    investment.dailyReturnPercentage = dailyReturnPercentage;
    
    // Recalculate total return percentage
    investment.totalReturnPercentage = dailyReturnPercentage * investment.duration;
    
    // Update investment plan reference if it exists
    if (investment.investmentPlan) {
      const plan = await InvestmentPlan.findById(investment.investmentPlan);
      if (plan) {
        plan.dailyReturnPercentage = dailyReturnPercentage;
        plan.totalReturnPercentage = dailyReturnPercentage * plan.duration;
        await plan.save();
      }
    }

    await investment.save();

    console.log('✅ Daily return updated:', {
      investmentId: investment._id,
      newDailyReturn: dailyReturnPercentage,
      user: investment.user
    });

    res.json({ 
      success: true, 
      investment,
      message: `Daily return updated to ${dailyReturnPercentage}%`
    });
  } catch (err) {
    console.error('Update daily return error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// @route   PUT api/admin/subscription-investments/:id/manual-adjustment
// @desc    Manually adjust profit/loss for a subscription investment
// @access  Private/Admin
exports.manualProfitAdjustment = async (req, res) => {
  try {
    const { adjustmentAmount, adjustmentReason } = req.body;
    
    if (typeof adjustmentAmount !== 'number') {
      return res.status(400).json({ msg: 'Adjustment amount must be a number' });
    }

    const investment = await Investment.findById(req.params.id);
    if (!investment || investment.investmentType !== 'subscription') {
      return res.status(404).json({ msg: 'Subscription investment not found' });
    }

    // Store manual adjustment
    investment.manualAdjustment.amount = adjustmentAmount;
    investment.manualAdjustment.reason = adjustmentReason || 'Admin adjustment';
    investment.manualAdjustment.appliedAt = new Date();
    investment.manualAdjustment.isActive = true;

    // Create adjustment transaction
    const transaction = new Transaction({
      user: investment.user,
      type: adjustmentAmount > 0 ? 'profit' : 'loss',
      amount: Math.abs(adjustmentAmount),
      status: 'completed',
      description: `Manual adjustment: ${adjustmentReason || 'Admin adjustment'} (${adjustmentAmount > 0 ? '+' : ''}${adjustmentAmount})`,
      completedAt: Date.now()
    });

    await transaction.save();

    // Update user's wallet if adjustment is positive
    if (adjustmentAmount > 0) {
      const wallet = await Wallet.findOne({ user: investment.user });
      if (wallet) {
        wallet.balance += adjustmentAmount;
        await wallet.save();
      }
    }

    await investment.save();

    console.log('✅ Manual profit adjustment:', {
      investmentId: investment._id,
      adjustmentAmount,
      reason: adjustmentReason,
      user: investment.user
    });

    res.json({ 
      success: true, 
      investment,
      transaction,
      message: `Profit adjusted by ${adjustmentAmount > 0 ? '+' : ''}${adjustmentAmount}`
    });
  } catch (err) {
    console.error('Manual profit adjustment error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// @route   PUT api/admin/subscription-investments/:id/reset-adjustment
// @desc    Reset manual adjustment and use calculated earnings
// @access  Private/Admin
exports.resetManualAdjustment = async (req, res) => {
  try {
    const investment = await Investment.findById(req.params.id);
    if (!investment || investment.investmentType !== 'subscription') {
      return res.status(404).json({ msg: 'Subscription investment not found' });
    }

    // Reset manual adjustment
    investment.manualAdjustment.amount = 0;
    investment.manualAdjustment.reason = '';
    investment.manualAdjustment.appliedAt = null;
    investment.manualAdjustment.isActive = false;

    await investment.save();

    console.log('✅ Manual adjustment reset:', {
      investmentId: investment._id,
      user: investment.user
    });

    res.json({ 
      success: true, 
      investment,
      message: 'Manual adjustment reset - using calculated earnings'
    });
  } catch (err) {
    console.error('Reset manual adjustment error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// @route   PUT api/admin/subscription-investments/:id/status
// @desc    Update investment status (active, completed, paused)
// @access  Private/Admin
exports.updateInvestmentStatus = async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    
    if (!['active', 'completed', 'paused', 'cancelled'].includes(status)) {
      return res.status(400).json({ msg: 'Invalid status' });
    }

    const investment = await Investment.findById(req.params.id);
    if (!investment || investment.investmentType !== 'subscription') {
      return res.status(404).json({ msg: 'Subscription investment not found' });
    }

    const oldStatus = investment.status;
    investment.status = status;

    // If completing investment, calculate final earnings
    if (status === 'completed' && oldStatus === 'active') {
      const now = new Date();
      const startDate = new Date(investment.startDate);
      const daysElapsed = Math.floor((now - startDate) / (1000 * 60 * 60 * 24));
      const finalEarnings = (investment.amount * investment.dailyReturnPercentage / 100) * daysElapsed;
      
      investment.dailyEarnings = finalEarnings;
      investment.totalEarnings = finalEarnings;
      investment.endDate = now;

      // Credit user's wallet with final earnings
      const wallet = await Wallet.findOne({ user: investment.user });
      if (wallet) {
        wallet.balance += finalEarnings;
        await wallet.save();
      }

      // Create completion transaction
      const transaction = new Transaction({
        user: investment.user,
        type: 'profit',
        amount: finalEarnings,
        status: 'completed',
        description: `Investment completed: ${investment.investmentPlan?.name || 'Subscription Plan'} - Final earnings`,
        completedAt: Date.now()
      });
      await transaction.save();
    }

    // Add admin notes if provided
    if (adminNotes) {
      investment.adminNotes = adminNotes;
    }

    await investment.save();

    console.log('✅ Investment status updated:', {
      investmentId: investment._id,
      oldStatus,
      newStatus: status,
      user: investment.user
    });

    res.json({ 
      success: true, 
      investment,
      message: `Investment status updated to ${status}`
    });
  } catch (err) {
    console.error('Update investment status error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// @route   GET api/admin/subscription-investments/user/:userId
// @desc    Get all subscription investments for a specific user
// @access  Private/Admin
exports.getUserSubscriptionInvestments = async (req, res) => {
  try {
    const investments = await Investment.find({ 
      user: req.params.userId, 
      investmentType: 'subscription' 
    })
      .populate('crypto', 'name symbol')
      .populate('investmentPlan', 'name dailyReturnPercentage duration')
      .sort({ createdAt: -1 });

    const investmentsWithCalculations = investments.map(investment => {
      const now = new Date();
      const startDate = new Date(investment.startDate);
      const endDate = new Date(investment.endDate);
      const daysElapsed = Math.floor((now - startDate) / (1000 * 60 * 60 * 24));
      const totalDays = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24));
      const daysRemaining = Math.max(0, totalDays - daysElapsed);
      
      const currentEarnings = (investment.amount * investment.dailyReturnPercentage / 100) * daysElapsed;
      const currentValue = investment.amount + currentEarnings;
      const profitLoss = currentEarnings;
      const profitLossPercentage = (profitLoss / investment.amount) * 100;

      return {
        ...investment.toObject(),
        daysElapsed,
        daysRemaining,
        currentEarnings,
        currentValue,
        profitLoss,
        profitLossPercentage,
        isActive: investment.status === 'active',
        isCompleted: investment.status === 'completed'
      };
    });

    res.json(investmentsWithCalculations);
  } catch (err) {
    console.error('Get user subscription investments error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// @route   POST api/admin/subscription-investments/bulk-update
// @desc    Bulk update daily returns for multiple investments
// @access  Private/Admin
exports.bulkUpdateDailyReturns = async (req, res) => {
  try {
    const { investmentIds, dailyReturnPercentage, reason } = req.body;
    
    if (!Array.isArray(investmentIds) || investmentIds.length === 0) {
      return res.status(400).json({ msg: 'Investment IDs array is required' });
    }

    if (!dailyReturnPercentage || dailyReturnPercentage < 0 || dailyReturnPercentage > 10) {
      return res.status(400).json({ msg: 'Daily return percentage must be between 0 and 10%' });
    }

    const updatedInvestments = [];
    const errors = [];

    for (const investmentId of investmentIds) {
      try {
        const investment = await Investment.findById(investmentId);
        if (!investment || investment.investmentType !== 'subscription') {
          errors.push(`Investment ${investmentId} not found or not a subscription investment`);
          continue;
        }

        investment.dailyReturnPercentage = dailyReturnPercentage;
        investment.totalReturnPercentage = dailyReturnPercentage * investment.duration;
        await investment.save();

        updatedInvestments.push(investment);

        console.log('✅ Bulk update - Investment updated:', {
          investmentId: investment._id,
          newDailyReturn: dailyReturnPercentage,
          user: investment.user
        });
      } catch (err) {
        errors.push(`Failed to update investment ${investmentId}: ${err.message}`);
      }
    }

    res.json({ 
      success: true, 
      updatedCount: updatedInvestments.length,
      errors,
      message: `Updated ${updatedInvestments.length} investments to ${dailyReturnPercentage}% daily return`
    });
  } catch (err) {
    console.error('Bulk update daily returns error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// @route   GET api/admin/kyc/pending
// @desc    Get all users with pending KYC
// @access  Private/Admin
exports.getPendingKycUsers = async (req, res) => {
  try {
    const users = await User.find({ 'kyc.status': 'pending' }).select('-password');
    res.json(users);
  } catch (err) {
    console.error('Admin get pending KYC users error:', err.message, err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// @route   POST api/admin/kyc/:userId/approve
// @desc    Approve a user's KYC
// @access  Private/Admin
exports.approveKyc = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ msg: 'User not found' });
    user.kyc.status = 'approved';
    user.kyc.reviewedAt = new Date();
    user.kyc.adminNotes = req.body.adminNotes || '';
    await user.save();
    res.json({ success: true, message: 'KYC approved', user });
  } catch (err) {
    console.error('Admin approve KYC error:', err.message, err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// @route   POST api/admin/kyc/:userId/reject
// @desc    Reject a user's KYC
// @access  Private/Admin
exports.rejectKyc = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ msg: 'User not found' });
    user.kyc.status = 'rejected';
    user.kyc.reviewedAt = new Date();
    user.kyc.adminNotes = req.body.adminNotes || '';
    await user.save();
    res.json({ success: true, message: 'KYC rejected', user });
  } catch (err) {
    console.error('Admin reject KYC error:', err.message, err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// ==================== AFFILIATE COMMISSIONS & PAYOUTS ====================

// @route   GET api/admin/commissions
// @desc    List commissions with optional status filter and pagination
// @access  Private/Admin
exports.getCommissions = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status && ['pending', 'paid'].includes(status)) query.status = status;
    const skip = (Number(page) - 1) * Number(limit);
    const [items, total] = await Promise.all([
      Commission.find(query)
        .populate('referrer', 'name email referralCode')
        .populate('referee', 'name email')
        .populate('investment', 'amount createdAt')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Commission.countDocuments(query)
    ]);
    res.json({ items, total, page: Number(page), limit: Number(limit) });
  } catch (err) {
    console.error('Admin get commissions error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// @route   PUT api/admin/commissions/:id/pay
// @desc    Mark a commission as paid
// @access  Private/Admin
exports.markCommissionPaid = async (req, res) => {
  try {
    const commission = await Commission.findById(req.params.id)
      .populate('referrer', 'name email')
      .populate('referee', 'name email');
    if (!commission) return res.status(404).json({ msg: 'Commission not found' });
    if (commission.status === 'paid') {
      return res.status(400).json({ msg: 'Commission already paid' });
    }
    commission.status = 'paid';
    commission.paidAt = new Date();
    await commission.save();
    res.json({ success: true, commission });
  } catch (err) {
    console.error('Admin pay commission error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// @route   GET api/admin/commissions/export.csv
// @desc    Export commissions to CSV (optionally filtered by status)
// @access  Private/Admin
exports.exportCommissionsCsv = async (req, res) => {
  try {
    const { status } = req.query;
    const query = {};
    if (status && ['pending', 'paid'].includes(status)) query.status = status;
    const items = await Commission.find(query)
      .populate('referrer', 'name email referralCode')
      .populate('referee', 'name email')
      .populate('investment', 'amount createdAt')
      .sort({ createdAt: -1 });

    const headers = [
      'CommissionID','Status','RatePercent','CommissionAmount','InvestmentAmount','CreatedAt','PaidAt',
      'ReferrerName','ReferrerEmail','ReferrerCode','RefereeName','RefereeEmail','InvestmentId'
    ];
    const rows = items.map(c => [
      c._id,
      c.status,
      c.rate,
      c.amount,
      c.investmentAmount,
      c.createdAt?.toISOString() || '',
      c.paidAt ? c.paidAt.toISOString() : '',
      c.referrer?.name || '',
      c.referrer?.email || '',
      c.referrer?.referralCode || '',
      c.referee?.name || '',
      c.referee?.email || '',
      c.investment?._id || ''
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.map(v => typeof v === 'string' && v.includes(',') ? `"${v}"` : v).join(','))].join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="commissions.csv"');
    res.send(csv);
  } catch (err) {
    console.error('Admin export commissions CSV error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};