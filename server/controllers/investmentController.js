const Investment = require('../models/Investment');
const Crypto = require('../models/Crypto');
const Wallet = require('../models/Wallet');
const Transaction = require('../models/Transaction');
const fs = require('fs');
const path = require('path');

const { 
  storeMockInvestment, 
  storeMockTransaction, 
  getMockInvestments, 
  getMockTransactions 
} = require('../utils/mockDataManager');

// Load mock crypto data when database is unavailable
const loadMockCryptos = () => {
  try {
    const mockDataPath = path.join(__dirname, '../data/cryptos.json');
    if (fs.existsSync(mockDataPath)) {
      return JSON.parse(fs.readFileSync(mockDataPath, 'utf8'));
    }
  } catch (error) {
    console.log('❌ Could not load mock crypto data');
  }
  return [];
};

// @route   GET api/investments
// @desc    Get user investments
// @access  Private
exports.getInvestments = async (req, res) => {
  try {
    // Use mock data if USE_MOCK_INVESTMENTS is true or database is not available
    if (process.env.USE_MOCK_INVESTMENTS === 'true' || !process.env.MONGO_URI) {
      const cryptos = loadMockCryptos();
      const investments = getMockInvestments(req.user.id, cryptos);
      return res.json(investments);
    }
    
    // Try to fetch from database
    const investments = await Investment.find({ 
      user: req.user.id,
      status: { $in: ['active', 'completed'] }
    }).populate('crypto', 'name symbol currentPrice image priceChangePercentage24h')
      .populate('investmentPlan', 'name dailyReturnPercentage duration');
    
    // Update current values and profit/loss for each investment
    const updatedInvestments = await Promise.all(
      investments.map(async (investment) => {
        // Calculate subscription-based returns
        const daysSinceStart = Math.floor((Date.now() - new Date(investment.startDate).getTime()) / (1000 * 60 * 60 * 24));
        const maxDays = investment.duration;
        const actualDays = Math.min(daysSinceStart, maxDays);
        
        // Calculate total earnings based on daily return
        const calculatedEarnings = (investment.amount * investment.dailyReturnPercentage * actualDays) / 100;
        
        // Combine calculated earnings with any active manual adjustment (additive)
        const manualOffset = investment.manualAdjustment.isActive ? (investment.manualAdjustment.amount || 0) : 0;
        const combinedEarnings = calculatedEarnings + manualOffset;

        const totalEarnings = combinedEarnings;
        const profitLoss = combinedEarnings;
        const currentValue = investment.amount + combinedEarnings;
        const profitLossPercentage = (profitLoss / investment.amount) * 100;
        
        // Update investment with subscription-based values
        investment.currentValue = currentValue;
        investment.profitLoss = profitLoss;
        investment.profitLossPercentage = profitLossPercentage;
        investment.totalEarnings = totalEarnings;
        
        // Check if investment period is completed
        if (daysSinceStart >= maxDays && investment.status === 'active') {
          investment.status = 'completed';
        }

        // If completed and maturity not processed yet, process payout
        if (investment.status === 'completed' && !investment.maturityProcessed) {
          try {
            // Atomically claim processing to prevent duplicates across endpoints/requests
            const claimed = await Investment.findOneAndUpdate(
              { _id: investment._id, maturityProcessed: { $ne: true } },
              { $set: { maturityProcessed: true, maturedAt: new Date() } },
              { new: true }
            );

            if (claimed) {
              // Credit wallet with principal + interest
              const wallet = await Wallet.findOne({ user: investment.user });
              const payoutAmount = investment.amount + (investment.totalEarnings || 0);
              wallet.balance += payoutAmount;
              await wallet.save();

              // Ensure unique transaction per investment maturity
              const ref = `MATURE:${investment._id.toString()}`;
              const exists = await Transaction.findOne({ user: investment.user, reference: ref });
              if (!exists) {
                const maturityTx = new Transaction({
                  user: investment.user,
                  type: 'profit',
                  amount: payoutAmount,
                  status: 'completed',
                  description: 'Investment Matured',
                  completedAt: Date.now(),
                  createdAt: new Date(),
                  reference: ref
                });
                await maturityTx.save();
              }
            }
          } catch (payoutErr) {
            console.error('Maturity payout error:', payoutErr?.message);
          }
        }
        
        await investment.save();
        return investment;
      })
    );
    
    res.json(updatedInvestments);
  } catch (err) {
    console.error('Get investments error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// @route   POST api/investments
// @desc    Create new subscription investment
// @access  Private
exports.createInvestment = async (req, res) => {
  try {
    const { cryptoId, amount, planId } = req.body;
    
    if (amount <= 0) {
      return res.status(400).json({ msg: 'Amount must be greater than 0' });
    }
    
    // Get crypto details
    const crypto = await Crypto.findById(cryptoId);
    if (!crypto) {
      return res.status(404).json({ msg: 'Cryptocurrency not found' });
    }
    
    // Check wallet balance
    const wallet = await Wallet.findOne({ user: req.user.id });
    if (!wallet) {
      return res.status(404).json({ msg: 'Wallet not found' });
    }
    
    if (wallet.balance < amount) {
      return res.status(400).json({ msg: 'Insufficient funds' });
    }
    
    // Get investment plan
    const InvestmentPlan = require('../models/InvestmentPlan');
    const plan = await InvestmentPlan.findById(planId);
    
    if (!plan) {
      return res.status(404).json({ msg: 'Investment plan not found' });
    }
    
    if (amount < plan.minAmount || amount > plan.maxAmount) {
      return res.status(400).json({ 
        msg: `Amount must be between $${plan.minAmount} and $${plan.maxAmount}` 
      });
    }
    
    // Calculate end date
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + plan.duration);
    
    // Check if this is the user's first investment (before creating new one)
    const priorInvestmentsCount = await Investment.countDocuments({ user: req.user.id });

    // Create subscription investment
    const investment = new Investment({
      user: req.user.id,
      crypto: cryptoId,
      investmentPlan: planId,
      amount,
      quantity: 0, // Not used for subscription investments
      buyPrice: 0, // Not used for subscription investments
      currentValue: amount,
      profitLoss: 0,
      profitLossPercentage: 0,
      investmentType: 'subscription',
      dailyReturnPercentage: plan.dailyReturnPercentage,
      totalReturnPercentage: plan.totalReturnPercentage,
      duration: plan.duration,
      endDate: endDate,
      dailyEarnings: (amount * plan.dailyReturnPercentage) / 100,
      totalEarnings: 0
    });
    
    await investment.save();
    
    // Deduct from wallet
    wallet.balance -= amount;
    await wallet.save();
    
    // Create transaction record
    const transaction = new Transaction({
      user: req.user.id,
      type: 'investment',
      amount,
      status: 'completed',
      description: `Subscription investment in ${crypto.name} (${crypto.symbol}) - ${plan.name}`,
      completedAt: Date.now(),
      createdAt: new Date()
    });
    await transaction.save();
    
    // Affiliate commission on first investment
    try {
      if (priorInvestmentsCount === 0) {
        const Referral = require('../models/Referral');
        const Commission = require('../models/Commission');
        const referral = await Referral.findOne({ referee: req.user.id });
        if (referral) {
          // Prevent duplicate commission for same referee (unique by investment already helps)
          const rate = Number(process.env.AFFILIATE_COMMISSION_RATE || 5);
          const commissionAmount = Math.round((amount * rate) ) / 100; // amount is number in dollars
          await Commission.create({
            referrer: referral.referrer,
            referee: referral.referee,
            investment: investment._id,
            investmentAmount: amount,
            rate,
            amount: (amount * rate) / 100
          });
        }
      }
    } catch (affErr) {
      console.warn('Affiliate commission creation failed (non-blocking):', affErr?.message);
    }

    // Populate investment with crypto and plan details
    const populatedInvestment = await Investment.findById(investment._id)
      .populate('crypto', 'name symbol currentPrice')
      .populate('investmentPlan', 'name dailyReturnPercentage duration');
    
    res.json(populatedInvestment);
  } catch (err) {
    console.error('Create investment error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// @route   PUT api/investments/:id/sell
// @desc    Sell investment
// @access  Private
exports.sellInvestment = async (req, res) => {
  try {
    const investment = await Investment.findById(req.params.id)
      .populate('crypto')
      .populate('investmentPlan', 'name dailyReturnPercentage duration');
      
    if (!investment) {
      return res.status(404).json({ msg: 'Investment not found' });
    }
    if (investment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    if (investment.status !== 'active') {
      return res.status(400).json({ msg: 'Investment already sold or cancelled' });
    }
    
    // Calculate subscription-based returns for selling
    const daysSinceStart = Math.floor((Date.now() - new Date(investment.startDate).getTime()) / (1000 * 60 * 60 * 24));
    const maxDays = investment.duration;
    const actualDays = Math.min(daysSinceStart, maxDays);
    
    // Calculate total earnings based on daily return
    const totalEarnings = (investment.amount * investment.dailyReturnPercentage * actualDays) / 100;
    const currentValue = investment.amount + totalEarnings;
    const profitLoss = totalEarnings;
    const profitLossPercentage = (profitLoss / investment.amount) * 100;
    
    // Update investment with subscription-based values
    investment.currentValue = currentValue;
    investment.profitLoss = profitLoss;
    investment.profitLossPercentage = profitLossPercentage;
    investment.totalEarnings = totalEarnings;
    investment.status = 'sold';
    investment.soldAt = Date.now();
    
    await investment.save();
    
    // Create transaction record
    const transaction = new Transaction({
      user: req.user.id,
      type: 'profit', // Always profit for subscription investments
      amount: Math.abs(profitLoss),
      status: 'completed',
      description: `Sold subscription investment in ${investment.crypto.name} (${investment.crypto.symbol})`,
      completedAt: Date.now()
    });
    await transaction.save();
    
    // Update wallet
    const wallet = await Wallet.findOne({ user: req.user.id });
    wallet.balance += currentValue;
    await wallet.save();
    
    res.json({
      success: true,
      investment,
      transaction
    });
  } catch (err) {
    console.error('Sell investment error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// @route   GET api/investments/portfolio
// @desc    Get portfolio summary
// @access  Private
exports.getPortfolio = async (req, res) => {
  try {
    // Use mock data if USE_MOCK_INVESTMENTS is true or database is not available
    if (process.env.USE_MOCK_INVESTMENTS === 'true' || !process.env.MONGO_URI) {
      const cryptos = loadMockCryptos();
      const investments = getMockInvestments(req.user.id, cryptos);
      return res.json({ investments, summary: {} });
    }
    
    // Try to fetch from database
    const investments = await Investment.find({ 
      user: req.user.id,
      status: { $in: ['active'] }
    }).populate('crypto', 'name symbol currentPrice image')
      .populate('investmentPlan', 'name dailyReturnPercentage duration');
    
    let totalInvested = 0;
    let totalCurrentValue = 0;
    let totalProfitLoss = 0;
    
    const updatedInvestments = await Promise.all(investments.map(async (investment) => {
      const amount = Number(investment.amount) || 0;
      
      // Calculate subscription-based returns
      const daysSinceStart = Math.floor((Date.now() - new Date(investment.startDate).getTime()) / (1000 * 60 * 60 * 24));
      const maxDays = investment.duration;
      const actualDays = Math.min(daysSinceStart, maxDays);
      
      // Calculate total earnings based on daily return
      const calculatedEarnings = (amount * investment.dailyReturnPercentage * actualDays) / 100;
      
      // Combine calculated earnings with any active manual adjustment (additive)
      const manualOffset = investment.manualAdjustment.isActive ? (investment.manualAdjustment.amount || 0) : 0;
      const combinedEarnings = calculatedEarnings + manualOffset;

      const totalEarnings = combinedEarnings;
      const profitLoss = combinedEarnings;
      const currentValue = amount + combinedEarnings;
      const profitLossPercentage = (profitLoss / amount) * 100;
      
      // Update investment with subscription-based values
      investment.currentValue = currentValue;
      investment.profitLoss = profitLoss;
      investment.profitLossPercentage = profitLossPercentage;
      investment.totalEarnings = totalEarnings;
      
      // Check if investment period is completed
      if (daysSinceStart >= maxDays && investment.status === 'active') {
        investment.status = 'completed';
      }

      // Do not process maturity here to avoid duplicate processing; handled in getInvestments
      
      await investment.save();
      
      // Only include active investments in portfolio summary
      if (investment.status === 'active') {
        totalInvested += amount;
        totalCurrentValue += currentValue;
        totalProfitLoss += profitLoss;
      }
      
      return investment;
    }));
    
    const totalProfitLossPercentage = totalInvested > 0 ? (totalProfitLoss / totalInvested) * 100 : 0;
    
    // Ensure only active investments are returned in portfolio holdings
    const activeInvestments = updatedInvestments.filter(inv => inv.status === 'active');

    res.json({
      investments: activeInvestments,
      summary: {
        totalInvested,
        totalCurrentValue,
        totalProfitLoss,
        totalProfitLossPercentage
      }
    });
  } catch (err) {
    console.error('Get portfolio error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};