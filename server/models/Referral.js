const mongoose = require('mongoose');

const ReferralSchema = new mongoose.Schema({
  referrer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  referee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Referral', ReferralSchema);
