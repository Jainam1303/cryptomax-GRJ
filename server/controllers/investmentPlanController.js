const InvestmentPlan = require('../models/InvestmentPlan');
const Crypto = require('../models/Crypto');

// @route   GET api/investment-plans
// @desc    Get all investment plans
// @access  Public
exports.getInvestmentPlans = async (req, res) => {
  try {
    const { cryptoId } = req.query;
    let query = { isActive: true };
    
    if (cryptoId) {
      query.crypto = cryptoId;
    }
    
    const plans = await InvestmentPlan.find(query)
      .populate('crypto', 'name symbol currentPrice')
      .sort({ minAmount: 1 });
    
    res.json(plans);
  } catch (err) {
    console.error('Get investment plans error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// @route   GET api/investment-plans/:id
// @desc    Get investment plan by ID
// @access  Public
exports.getInvestmentPlanById = async (req, res) => {
  try {
    const plan = await InvestmentPlan.findById(req.params.id)
      .populate('crypto', 'name symbol currentPrice');
    
    if (!plan) {
      return res.status(404).json({ msg: 'Investment plan not found' });
    }
    
    res.json(plan);
  } catch (err) {
    console.error('Get investment plan error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// @route   POST api/investment-plans
// @desc    Create new investment plan (Admin only)
// @access  Private (Admin)
exports.createInvestmentPlan = async (req, res) => {
  try {
    const {
      name,
      cryptoId,
      minAmount,
      maxAmount,
      dailyReturnPercentage,
      duration,
      description,
      features
    } = req.body;
    
    // Validate crypto exists
    const crypto = await Crypto.findById(cryptoId);
    if (!crypto) {
      return res.status(404).json({ msg: 'Cryptocurrency not found' });
    }
    
    // Calculate total return percentage
    const totalReturnPercentage = dailyReturnPercentage * duration;
    
    const plan = new InvestmentPlan({
      name,
      crypto: cryptoId,
      minAmount,
      maxAmount,
      dailyReturnPercentage,
      duration,
      totalReturnPercentage,
      description,
      features: features || []
    });
    
    await plan.save();
    
    const populatedPlan = await InvestmentPlan.findById(plan._id)
      .populate('crypto', 'name symbol currentPrice');
    
    res.json(populatedPlan);
  } catch (err) {
    console.error('Create investment plan error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// @route   PUT api/investment-plans/:id
// @desc    Update investment plan (Admin only)
// @access  Private (Admin)
exports.updateInvestmentPlan = async (req, res) => {
  try {
    const plan = await InvestmentPlan.findById(req.params.id);
    if (!plan) {
      return res.status(404).json({ msg: 'Investment plan not found' });
    }
    
    const {
      name,
      minAmount,
      maxAmount,
      dailyReturnPercentage,
      duration,
      description,
      features,
      isActive
    } = req.body;
    
    if (name) plan.name = name;
    if (minAmount) plan.minAmount = minAmount;
    if (maxAmount) plan.maxAmount = maxAmount;
    if (dailyReturnPercentage) plan.dailyReturnPercentage = dailyReturnPercentage;
    if (duration) plan.duration = duration;
    if (description) plan.description = description;
    if (features) plan.features = features;
    if (isActive !== undefined) plan.isActive = isActive;
    
    // Recalculate total return percentage
    if (dailyReturnPercentage || duration) {
      plan.totalReturnPercentage = plan.dailyReturnPercentage * plan.duration;
    }
    
    await plan.save();
    
    const updatedPlan = await InvestmentPlan.findById(plan._id)
      .populate('crypto', 'name symbol currentPrice');
    
    res.json(updatedPlan);
  } catch (err) {
    console.error('Update investment plan error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// @route   DELETE api/investment-plans/:id
// @desc    Delete investment plan (Admin only)
// @access  Private (Admin)
exports.deleteInvestmentPlan = async (req, res) => {
  try {
    const plan = await InvestmentPlan.findById(req.params.id);
    if (!plan) {
      return res.status(404).json({ msg: 'Investment plan not found' });
    }
    
    await plan.remove();
    res.json({ msg: 'Investment plan deleted' });
  } catch (err) {
    console.error('Delete investment plan error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
}; 