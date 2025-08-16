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
  // Optional: URL pointing to QR image (can be API route)
  qrImageUrl: {
    type: String,
    required: false
  },
  // Store QR image directly in DB to avoid ephemeral filesystem issues
  qrImage: {
    data: Buffer,
    contentType: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('DepositWallet', DepositWalletSchema);