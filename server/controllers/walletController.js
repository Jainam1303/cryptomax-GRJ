const Wallet = require('../models/Wallet');
const Transaction = require('../models/Transaction');
const WithdrawalRequest = require('../models/WithdrawalRequest');

// @route   GET api/wallet
// @desc    Get user wallet
// @access  Private
exports.getWallet = async (req, res) => {
  try {
    const wallet = req.wallet;
    // Dynamically calculate pending withdrawals
    const pending = await Transaction.aggregate([
      { $match: { user: wallet.user, type: 'withdrawal', status: 'pending' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    wallet.pendingWithdrawals = pending.length > 0 ? pending[0].total : 0;

    // Dynamically calculate total withdrawn (completed withdrawals)
    const completedWithdrawals = await Transaction.aggregate([
      { $match: { user: wallet.user, type: 'withdrawal', status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    wallet.totalWithdrawn = completedWithdrawals.length > 0 ? completedWithdrawals[0].total : 0;

    res.json(wallet);
  } catch (err) {
    console.error('Get wallet error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// @route   POST api/wallet/deposit
// @desc    Deposit funds to wallet
// @access  Private
exports.deposit = async (req, res) => {
  try {
    const { amount, paymentMethod, txid } = req.body;
    
    console.log('💰 Deposit request received:', { amount, paymentMethod, txid, userId: req.user.id });
    
    if (amount <= 0) {
      return res.status(400).json({ msg: 'Amount must be greater than 0' });
    }
    
    // Check database connection
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      console.log('❌ Database not connected during deposit. ReadyState:', mongoose.connection.readyState);
      return res.status(500).json({ 
        msg: 'Database not connected. Please check MongoDB connection.',
        error: 'Database connection failed'
      });
    }
    
    // Use wallet from middleware
    const wallet = req.wallet;
    
    // Create transaction record (pending)
    const transaction = new Transaction({
      user: req.user.id,
      type: 'deposit',
      amount,
      status: 'pending',
      description: `Deposit via ${paymentMethod}`,
      txid: txid || '',
      currency: 'USD'
    });
    
    console.log('📊 Creating deposit transaction:', {
      userId: req.user.id,
      amount,
      paymentMethod,
      txid,
      transactionId: transaction._id
    });
    
    // Save to database
    await transaction.save();
    console.log('✅ Deposit transaction saved to database:', transaction._id);
    
    // Do NOT credit wallet balance yet; wait for admin approval
    // Optionally, you can store a pendingDeposits field in wallet if you want
    
    res.json({
      success: true,
      wallet,
      transaction
    });
  } catch (err) {
    console.error('Deposit error:', err.message);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// @route   POST api/wallet/withdraw
// @desc    Request withdrawal
// @access  Private
exports.requestWithdrawal = async (req, res) => {
  try {
    console.log('RAW req.body:', JSON.stringify(req.body, null, 2));
    const { amount, paymentMethod, paymentDetails } = req.body;

    // Always store paymentDetails as a string
    let details = paymentDetails;
    if (typeof paymentDetails === 'object' && paymentDetails !== null && paymentDetails.walletAddress) {
      details = paymentDetails.walletAddress;
    }

    console.log('💰 Withdrawal request received:', { 
      amount, 
      paymentMethod, 
      paymentDetails: details, 
      userId: req.user.id 
    });
    
    if (amount <= 0) {
      return res.status(400).json({ msg: 'Amount must be greater than 0' });
    }
    
    // Use wallet from middleware
    const wallet = req.wallet;
    
    if (wallet.balance < amount) {
      return res.status(400).json({ msg: 'Insufficient funds' });
    }
    
    // Create withdrawal request
    const withdrawalRequest = new WithdrawalRequest({
      user: req.user.id,
      amount,
      paymentMethod,
      paymentDetails: details // store as string
    });
    
    console.log('📊 Creating withdrawal request:', {
      userId: req.user.id,
      amount,
      paymentMethod,
      paymentDetails: details,
      withdrawalRequestId: withdrawalRequest._id
    });
    
    await withdrawalRequest.save();
    console.log('✅ Withdrawal request saved to database:', withdrawalRequest._id);
    
    // Create transaction record (pending)
    const transaction = new Transaction({
      user: req.user.id,
      type: 'withdrawal',
      amount,
      status: 'pending',
      description: `Withdrawal request via ${paymentMethod}`
    });
    
    await transaction.save();
    console.log('✅ Withdrawal transaction saved to database:', transaction._id);
    
    // Update wallet (hold the funds)
    wallet.pendingWithdrawals += amount;
    wallet.balance -= amount;
    await wallet.save();
    console.log('✅ Wallet updated:', {
      newBalance: wallet.balance,
      pendingWithdrawals: wallet.pendingWithdrawals
    });
    
    res.json({
      success: true,
      withdrawalRequest,
      transaction
    });
  } catch (err) {
    console.error('Withdrawal request error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// @route   GET api/wallet/transactions
// @desc    Get user transactions
// @access  Private
exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id })
      .sort({ createdAt: -1 });
    res.json(transactions);
  } catch (err) {
    console.error('Get transactions error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};