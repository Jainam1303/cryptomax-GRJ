const mongoose = require('mongoose');

const DepositWalletSchema = new mongoose.Schema({
  coin: {
    type: String,
    required: true,
    unique: true
  },
  address: {
    type: String,
    required: true
  },
  qrImageUrl: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('DepositWallet', DepositWalletSchema); 