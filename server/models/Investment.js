const mongoose = require('mongoose');

const InvestmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  crypto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Crypto',
    required: true
  },
  investmentPlan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'InvestmentPlan',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 100 // Minimum $100 for subscription investments
  },
  currentValue: {
    type: Number,
    default: 0,
    min: 0
  },
  profitLoss: {
    type: Number,
    default: 0
  },
  profitLossPercentage: {
    type: Number,
    default: 0
  },
  // Subscription-based investment fields
  investmentType: {
    type: String,
    enum: ['subscription'],
    default: 'subscription'
  },
  dailyReturnPercentage: {
    type: Number,
    default: 0
  },
  totalReturnPercentage: {
    type: Number,
    default: 0
  },
  duration: {
    type: Number,
    default: 0 // in days
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date,
    default: null
  },
  dailyEarnings: {
    type: Number,
    default: 0
  },
  totalEarnings: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'sold', 'cancelled', 'completed'],
    default: 'active'
  },
  // Admin controlled settings for manipulating profit/loss display
  adminAdjustment: {
    enabled: {
      type: Boolean,
      default: false
    },
    percentage: {
      type: Number,
      default: 0 // Can be positive or negative
    },
    lastUpdated: {
      type: Date,
      default: null
    }
  },
  // Manual profit adjustment by admin
  manualAdjustment: {
    amount: {
      type: Number,
      default: 0 // Can be positive or negative
    },
    reason: {
      type: String,
      default: ''
    },
    appliedAt: {
      type: Date,
      default: null
    },
    isActive: {
      type: Boolean,
      default: false
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  soldAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Investment', InvestmentSchema);