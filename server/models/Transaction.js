const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['deposit', 'withdrawal', 'investment', 'profit', 'loss', 'referral'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'cancelled'],
    default: 'pending'
  },
  currency: {
    type: String,
    default: 'USD'
  },
  description: {
    type: String,
    default: ''
  },
  reference: {
    type: String,
    default: ''
  },
  failureReason: {
    type: String,
    default: ''
  },
  txid: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Generate a unique reference number before saving
TransactionSchema.pre('save', function(next) {
  if (!this.reference) {
    const timestamp = new Date().getTime().toString();
    const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
    this.reference = `TXN-${timestamp.slice(-6)}-${randomStr}`;
  }
  next();
});

module.exports = mongoose.model('Transaction', TransactionSchema);