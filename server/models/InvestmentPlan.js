const mongoose = require('mongoose');

const InvestmentPlanSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  crypto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Crypto',
    required: true
  },
  minAmount: {
    type: Number,
    required: true,
    min: 100 // Minimum $100
  },
  maxAmount: {
    type: Number,
    required: true,
    max: 10000 // Maximum $10,000
  },
  dailyReturnPercentage: {
    type: Number,
    required: true,
    min: 0.1, // Minimum 0.1% daily return
    max: 5 // Maximum 5% daily return
  },
  duration: {
    type: Number,
    required: true,
    min: 7, // Minimum 7 days
    max: 365 // Maximum 365 days
  },
  totalReturnPercentage: {
    type: Number,
    required: true,
    min: 3, // Minimum 3% total return
    max: 500 // Maximum 500% total return
  },
  description: {
    type: String,
    required: true
  },
  features: [{
    type: String
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Calculate total return percentage based on daily return and duration
InvestmentPlanSchema.pre('save', function(next) {
  if (this.isModified('dailyReturnPercentage') || this.isModified('duration')) {
    this.totalReturnPercentage = (this.dailyReturnPercentage * this.duration);
  }
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('InvestmentPlan', InvestmentPlanSchema); 