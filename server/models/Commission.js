const mongoose = require('mongoose');

const CommissionSchema = new mongoose.Schema({
  referrer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  referee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  investment: { type: mongoose.Schema.Types.ObjectId, ref: 'Investment', required: true, unique: true },
  investmentAmount: { type: Number, required: true },
  rate: { type: Number, required: true, default: 5 }, // percent
  amount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'paid'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  paidAt: { type: Date }
});

module.exports = mongoose.model('Commission', CommissionSchema);
